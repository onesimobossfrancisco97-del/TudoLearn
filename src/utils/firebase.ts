import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, CommunityPost } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Authentication helper: Google Sign In
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Google Sign-In note:', error);
    throw error;
  }
}

// Authentication helper: Email & Password Sign Up
export async function signUpWithEmail(email: string, pass: string, name: string): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name.trim() && cred.user) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }
  return cred.user;
}

// Authentication helper: Email & Password Sign In
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

// Authentication helper: Sign Out
export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Save User Profile to Firestore
export async function syncUserProfileToFirestore(userId: string, profile: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        ...profile,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore sync note:', err);
  }
}

// Fetch User Profile from Firestore
export async function fetchUserProfileFromFirestore(userId: string): Promise<Partial<UserProfile> | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as Partial<UserProfile>;
    }
    return null;
  } catch (err) {
    console.warn('Firestore fetch note:', err);
    return null;
  }
}
