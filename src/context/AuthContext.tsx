import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth, googleProvider, createStaffFirebaseUser } from '../lib/firebase';
import { AdminRole, AdminUser } from '../types';
import { getAdminUser, saveAdminUser, recordAuditLog } from '../services/firestoreService';

interface RateLimitState {
  failedAttempts: number;
  lockoutUntil: number | null;
}

interface AuthContextType {
  currentUser: User | null;
  adminUser: AdminUser | null;
  adminRole: AdminRole | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDemoAdmin: boolean;
  loading: boolean;
  error: string | null;
  lockoutSeconds: number;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoAdmin: (role?: AdminRole) => void;
  createStaffAccount: (email: string, pass: string, displayName: string, role: AdminRole) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (allowedRoles: AdminRole[]) => boolean;
}

const SUPER_ADMIN_EMAIL = 'hasanaamir815@gmail.com';
const RATE_LIMIT_KEY = 'portal_admin_rate_limit';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(() => {
    return localStorage.getItem('demo_admin_active') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Load and manage rate limiting state
  const getRateLimitState = (): RateLimitState => {
    try {
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (_) {}
    return { failedAttempts: 0, lockoutUntil: null };
  };

  const checkLockout = useCallback((): boolean => {
    const state = getRateLimitState();
    if (state.lockoutUntil) {
      const remainingMs = state.lockoutUntil - Date.now();
      if (remainingMs > 0) {
        setLockoutSeconds(Math.ceil(remainingMs / 1000));
        return true;
      } else {
        // Lockout expired
        localStorage.removeItem(RATE_LIMIT_KEY);
        setLockoutSeconds(0);
        return false;
      }
    }
    setLockoutSeconds(0);
    return false;
  }, []);

  useEffect(() => {
    checkLockout();
    const interval = setInterval(() => {
      checkLockout();
    }, 1000);
    return () => clearInterval(interval);
  }, [checkLockout]);

  const recordFailedAttempt = () => {
    const state = getRateLimitState();
    const newAttempts = state.failedAttempts + 1;
    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ failedAttempts: newAttempts, lockoutUntil }));
      setLockoutSeconds(Math.ceil(LOCKOUT_DURATION_MS / 1000));
      setError(`Account security lockout: Too many failed login attempts. Please wait ${Math.ceil(LOCKOUT_DURATION_MS / 60000)} minutes.`);
    } else {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ failedAttempts: newAttempts, lockoutUntil: null }));
      setError(`Invalid credentials. ${MAX_FAILED_ATTEMPTS - newAttempts} attempt(s) remaining before security lockout.`);
    }
  };

  const clearFailedAttempts = () => {
    localStorage.removeItem(RATE_LIMIT_KEY);
    setLockoutSeconds(0);
  };

  // Sync admin role and account records from Firestore
  const syncAdminUser = async (user: User) => {
    try {
      let record = await getAdminUser(user.uid);
      
      // Auto-bootstrap primary Super Admin if logging in with official email
      if (user.email === SUPER_ADMIN_EMAIL) {
        if (!record) {
          record = {
            id: user.uid,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Chaudhry Asad Hanif Jutt (Super Admin)',
            role: 'Super Admin',
            status: 'Active',
            createdAt: new Date().toISOString(),
            createdBy: 'System Bootstrap',
            lastLogin: new Date().toISOString()
          };
          await saveAdminUser(record);
        } else if (record.role !== 'Super Admin') {
          record.role = 'Super Admin';
          await saveAdminUser(record);
        }
      }

      if (record) {
        if (record.status === 'Suspended') {
          setError('This staff account has been suspended by the Super Admin.');
          await signOut(auth);
          setAdminUser(null);
          setAdminRole(null);
          return;
        }
        setAdminUser(record);
        setAdminRole(record.role);
      } else {
        // Unlisted user without an admin profile
        setAdminUser(null);
        setAdminRole(null);
      }
    } catch (err) {
      console.warn('Admin user record synchronization note:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncAdminUser(user);
      } else {
        if (!localStorage.getItem('demo_admin_active')) {
          setAdminUser(null);
          setAdminRole(null);
        }
      }
      setLoading(false);
    }, (err) => {
      console.error('Auth state change error:', err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    if (checkLockout()) {
      throw new Error(`Login temporarily locked due to security policy. Please wait ${lockoutSeconds} seconds.`);
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      clearFailedAttempts();
      setIsDemoAdmin(false);
      localStorage.removeItem('demo_admin_active');
      await syncAdminUser(cred.user);
      await recordAuditLog('ADMIN_LOGIN_SUCCESS', 'auth', cred.user.uid, `Email/Password login by ${email}`);
    } catch (err: any) {
      recordFailedAttempt();
      await recordAuditLog('ADMIN_LOGIN_FAILED', 'auth', email, `Failed login attempt for ${email}`);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    if (checkLockout()) {
      throw new Error(`Login temporarily locked due to security policy. Please wait ${lockoutSeconds} seconds.`);
    }

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      clearFailedAttempts();
      setIsDemoAdmin(false);
      localStorage.removeItem('demo_admin_active');
      await syncAdminUser(cred.user);
      await recordAuditLog('ADMIN_LOGIN_SUCCESS', 'auth', cred.user.uid, `Google OAuth login by ${cred.user.email}`);
    } catch (err: any) {
      recordFailedAttempt();
      throw err;
    }
  };

  const loginAsDemoAdmin = (role: AdminRole = 'Super Admin') => {
    setIsDemoAdmin(true);
    localStorage.setItem('demo_admin_active', 'true');
    const demoUser: AdminUser = {
      id: 'demo-staff-id',
      uid: 'demo-staff-id',
      email: role === 'Super Admin' ? SUPER_ADMIN_EMAIL : `${role.toLowerCase().replace(/\s+/g, '.')}@chasadhanif.pk`,
      displayName: role === 'Super Admin' ? 'Chaudhry Asad Hanif Jutt (Super Admin)' : `Authorized Staff (${role})`,
      role,
      status: 'Active',
      createdAt: new Date().toISOString(),
      createdBy: 'Secretariat System'
    };
    setAdminUser(demoUser);
    setAdminRole(role);
  };

  const createStaffAccount = async (email: string, pass: string, displayName: string, role: AdminRole) => {
    if (!isSuperAdmin) {
      throw new Error('Unauthorized: Only Super Administrators can provision staff accounts.');
    }

    // 1. Create Firebase Auth user via secondary client
    const newUid = await createStaffFirebaseUser(email.trim(), pass);

    // 2. Persist staff RBAC document
    const staffRecord: AdminUser = {
      id: newUid,
      uid: newUid,
      email: email.trim(),
      displayName: displayName.trim(),
      role,
      status: 'Active',
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.email || 'Super Admin'
    };

    await saveAdminUser(staffRecord);
    await recordAuditLog('STAFF_ACCOUNT_CREATED', 'admins', newUid, `Staff ${email} created with role ${role}`);
  };

  const logout = async () => {
    setIsDemoAdmin(false);
    localStorage.removeItem('demo_admin_active');
    setAdminUser(null);
    setAdminRole(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  // Determine authorized status
  const isSuperAdmin = isDemoAdmin && adminRole === 'Super Admin' 
    ? true 
    : (currentUser?.email === SUPER_ADMIN_EMAIL || adminRole === 'Super Admin');

  const isAdmin = isDemoAdmin 
    ? true 
    : (isSuperAdmin || (!!currentUser && !!adminRole && adminUser?.status === 'Active'));

  const hasPermission = (allowedRoles: AdminRole[]): boolean => {
    if (isSuperAdmin) return true;
    if (!adminRole) return false;
    return allowedRoles.includes(adminRole);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminUser,
        adminRole,
        isAdmin,
        isSuperAdmin,
        isDemoAdmin,
        loading,
        error,
        lockoutSeconds,
        loginWithEmail,
        loginWithGoogle,
        loginAsDemoAdmin,
        createStaffAccount,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
