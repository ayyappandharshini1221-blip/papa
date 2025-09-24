'use client';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, UserRole, Student } from '@/lib/types';

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userProfile: User | Student =
      role === 'student'
        ? {
            id: user.uid,
            name,
            email,
            role,
            xp: 0,
            streak: 0,
            badges: [],
            classIds: [],
          }
        : {
            id: user.uid,
            name,
            email,
            role,
          };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    return userProfile;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    throw new Error('User data not found');
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async (role: UserRole) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      const userProfile: User | Student =
        role === 'student'
          ? {
              id: user.uid,
              name: user.displayName || 'Anonymous',
              email: user.email!,
              role,
              avatarUrl: user.photoURL || undefined,
              xp: 0,
              streak: 0,
              badges: [],
              classIds: [],
            }
          : {
              id: user.uid,
              name: user.displayName || 'Anonymous',
              email: user.email!,
              role,
              avatarUrl: user.photoURL || undefined,
            };

      await setDoc(userDocRef, userProfile);
      return userProfile;
    }
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        callback(userDoc.data() as User);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
