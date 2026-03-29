import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { ArchivedItem } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyA5ct_FoGXWDBc29U2C66NVk0HyTV8JUS8",
  authDomain: "postly-ai-claude-01.firebaseapp.com",
  projectId: "postly-ai-claude-01",
  storageBucket: "postly-ai-claude-01.firebasestorage.app",
  messagingSenderId: "470157171469",
  appId: "1:470157171469:web:d4fca773fa46063356ae44",
  measurementId: "G-VSRCK499PX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// ── Auth Functions ──
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
export const onAuthChange = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);

// ── Firestore: Archive ──
const getUserArchiveRef = (uid: string) => doc(db, 'users', uid, 'data', 'archive');

export const saveArchiveToFirestore = async (uid: string, items: ArchivedItem[]) => {
  try {
    await setDoc(getUserArchiveRef(uid), { items, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.error('Error saving archive:', e);
  }
};

export const loadArchiveFromFirestore = async (uid: string): Promise<ArchivedItem[]> => {
  try {
    const snap = await getDoc(getUserArchiveRef(uid));
    if (snap.exists()) return snap.data().items || [];
  } catch (e) {
    console.error('Error loading archive:', e);
  }
  return [];
};

// ── Firestore: User Profile ──
export const saveUserProfile = async (uid: string, data: Record<string, any>) => {
  try {
    await setDoc(doc(db, 'users', uid), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error('Error saving profile:', e);
  }
};

export const loadUserProfile = async (uid: string) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data();
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return null;
};
