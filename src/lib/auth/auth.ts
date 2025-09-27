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
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from 'firebase/firestore';
import { getDb, getAuthInstance } from '@/lib/firebase';
import type { User, UserRole, Student } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
) => {
  try {
    const auth = getAuthInstance();
    const db = getDb();
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

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, userProfile).catch((serverError) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'create',
        requestResourceData: userProfile,
      });
      errorEmitter.emit('permission-error', permissionError);
    });

    return userProfile;
  } catch (error: any) {
    console.error('Error signing up:', error);
    // Use a more user-friendly message for common errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists.');
    }
    throw new Error(error.message);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const auth = getAuthInstance();
    const db = getDb();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    
    console.warn(`User document not found for UID: ${user.uid}. Creating a new one.`);
    const userProfile: Student = {
      id: user.uid,
      name: user.displayName || 'New User',
      email: user.email!,
      role: 'student',
      xp: 0,
      streak: 0,
      badges: [],
      classIds: [],
    };
    await setDoc(userDocRef, userProfile).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userProfile,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
    return userProfile;

  } catch (error: any)
   {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    const auth = getAuthInstance();
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  const auth = getAuthInstance();
  const db = getDb();
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        callback(userDoc.data() as User);
      } else {
        console.warn(`User with UID ${firebaseUser.uid} authenticated but has no Firestore document.`);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
