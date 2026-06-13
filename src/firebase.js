import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

let auth = null;
let db = null;

if (hasConfig) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

function required() {
  throw new Error('Firebase no configurado. Crea un .env con las variables VITE_FIREBASE_*');
}

export async function registerUser(username, email, password) {
  if (!auth) required();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });
  await Promise.all([
    setDoc(doc(db, 'profiles', cred.user.uid), {
      username,
      email,
      createdAt: Date.now(),
    }),
    setDoc(doc(db, 'usernames', username.toLowerCase()), {
      uid: cred.user.uid,
      email,
    }),
  ]);
  return cred.user;
}

export async function loginUser(username, password) {
  if (!auth) required();
  const map = await getDoc(doc(db, 'usernames', username.toLowerCase()));
  if (!map.exists()) throw { code: 'auth/user-not-found', message: 'Usuario no encontrado' };
  const email = map.data().email;
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser() {
  if (!auth) required();
  await signOut(auth);
}

export async function getUserProfile(uid) {
  if (!db) required();
  const snap = await getDoc(doc(db, 'profiles', uid));
  return snap.exists() ? snap.data() : null;
}

export { auth, db };
