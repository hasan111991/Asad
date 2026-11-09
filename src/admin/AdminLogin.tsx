import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  AlertTriangle, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminRole } from '../types';

interface AdminLoginProps {
  onNavigateHome: () => void;
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onNavigateHome, onLoginSuccess }) => {
  const { 
    loginWithEmail, 
    loginWithGoogle, 
    loginAsDemoAdmin, 
    lockoutSeconds, 
    error: authError 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter both your official email and password.');
      return;
    }

    if (lockoutSeconds > 0) {
      setLocalError(`Login temporarily suspended for security. Please wait ${lockoutSeconds} seconds.`);
      return;
    }

    setLocalError(null);
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setLocalError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (lockoutSeconds > 0) return;
    setLocalError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      setLocalError(err?.message || 'Google sign-in was cancelled or unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: AdminRole) => {
    loginAsDemoAdmin(role);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#0d2a1c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#087A43] rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C9A227] rounded-full filter blur-3xl opacity-20"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Back to Public Portal Link */}
        <div className="mb-6 flex justify-between items-center px-4 sm:px-0">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Public Website</span>
          </button>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A227] bg-[#123B28] px-2.5 py-1 rounded border border-[#C9A227]/30">
            Secure Portal
          </span>
        </div>

        {/* Official Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#123B28] border-2 border-[#C9A227] shadow-xl mb-3">
            <ShieldCheck className="w-9 h-9 text-[#C9A227]" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-serif">
            Constituency Secretariat CMS
          </h2>
          <p className="mt-1 text-xs text-emerald-200">
            Chaudhry Asad Hanif Jutt – MPA PP-203 Chichawatni
          </p>
          <p className="text-[11px] text-[#C9A227] font-semibold mt-0.5">
            Authorized Personnel & Staff Login Only
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#123B28] py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-emerald-700/60 backdrop-blur-md">
          
          {/* Rate Limit Security Lockout Notice */}
          {lockoutSeconds > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 flex items-start gap-3 animate-pulse">
              <Clock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-white">Login Temporarily Locked</p>
                <p className="text-xs mt-0.5">
                  Too many consecutive failed attempts. System locked for protection.
                </p>
                <p className="text-xs font-mono font-bold text-rose-300 mt-2">
                  Time remaining: {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {(localError || authError) && lockoutSeconds === 0 && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/70 border border-rose-700 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                Official Staff Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  disabled={lockoutSeconds > 0 || loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@chasadhanif.pk or hasanaamir815@gmail.com"
                  className="block w-full pl-9 pr-3 py-2.5 bg-emerald-950/80 border border-emerald-700 rounded-xl text-white placeholder-emerald-600 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  disabled={lockoutSeconds > 0 || loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 bg-emerald-950/80 border border-emerald-700 rounded-xl text-white placeholder-emerald-600 text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={lockoutSeconds > 0 || loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-[#C9A227] rounded-xl shadow-lg text-xs font-bold text-white bg-[#087A43] hover:bg-[#066135] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4 text-[#C9A227]" />
                <span>{loading ? 'Authenticating Staff...' : 'Sign In to Secretariat Portal'}</span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#123B28] text-emerald-300">Super Admin Direct Access</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={lockoutSeconds > 0 || loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-700 bg-emerald-950/50 hover:bg-emerald-900/60 text-xs font-semibold text-emerald-100 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google (hasanaamir815@gmail.com)</span>
              </button>
            </div>
          </div>

          {/* Quick RBAC Role Test Selector */}
          <div className="mt-8 pt-5 border-t border-emerald-800/80">
            <div className="flex items-center gap-1.5 text-xs text-[#C9A227] font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Secretariat Staff Role Switcher (Evaluation / Demo Mode)</span>
            </div>
            <p className="text-[11px] text-emerald-300/80 mb-3">
              Select an authorized RBAC profile to test permissions and restricted route views:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('Super Admin')}
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Super Admin</span>
                  <span className="text-[10px] bg-amber-400 text-black font-black px-1.5 py-0.2 rounded">FULL</span>
                </div>
                <p className="text-[10px] text-emerald-200 mt-0.5">All modules & staff control</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('Office Manager')}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-200">Office Manager</span>
                  <span className="text-[10px] text-emerald-400">Grievance</span>
                </div>
                <p className="text-[10px] text-emerald-300 mt-0.5">Complaints & Notices</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('Project Manager')}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-200">Project Manager</span>
                  <span className="text-[10px] text-emerald-400">GIS/Dev</span>
                </div>
                <p className="text-[10px] text-emerald-300 mt-0.5">PP-203 Infrastructure</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('Media Manager')}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-200">Media Manager</span>
                  <span className="text-[10px] text-emerald-400">Media</span>
                </div>
                <p className="text-[10px] text-emerald-300 mt-0.5">News & Photo Gallery</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('Data Entry Operator')}
                className="sm:col-span-2 p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-200">Data Entry Operator</span>
                  <span className="text-[10px] text-emerald-400">Limited</span>
                </div>
                <p className="text-[10px] text-emerald-300 mt-0.5">Complaint logging and view-only project list</p>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-800/80 text-center text-[11px] text-emerald-400">
            <p>Protected by Firebase Role-Based Access Control (RBAC) & Audit Logging.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
