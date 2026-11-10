import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer 
} from 'firebase/firestore';
import rawFirebaseConfig from '../../firebase-applet-config.json';

const defaultFirebaseConfig = {
  projectId: "primeval-objective-t8chg",
  appId: "1:499568409181:web:ab776e3b1b901b22046bb4",
  apiKey: "AIzaSyCfyQdUG3f2KYku6H5EZz44ke-tCMP8370",
  authDomain: "primeval-objective-t8chg.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-chaudhryasadhani-bdc67768-220b-449b-8fc4-bb22028a39bc",
  storageBucket: "primeval-objective-t8chg.firebasestorage.app",
  messagingSenderId: "499568409181"
};

const firebaseConfig = {
  ...defaultFirebaseConfig,
  ...(typeof rawFirebaseConfig === 'object' && rawFirebaseConfig !== null ? rawFirebaseConfig : {})
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function createStaffFirebaseUser(email: string, password: string): Promise<string> {
  const secondaryApp = initializeApp(firebaseConfig, `StaffCreation-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const userCred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = userCred.user.uid;
    await signOut(secondaryAuth);
    await deleteApp(secondaryApp);
    return uid;
  } catch (error) {
    try {
      await deleteApp(secondaryApp);
    } catch (_) {}
    throw error;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline:', error.message);
      return false;
    }
    // A permission denied or not-found error still verifies connectivity to server
    return true;
  }
}
