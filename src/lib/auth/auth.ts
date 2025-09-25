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
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error('An account with this email already exists.');
    }

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
    setDoc(userDocRef, userProfile).catch((serverError) => {
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
    setDoc(userDocRef, userProfile).catch((serverError) => {
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

export const signInWithGoogle = async (role: UserRole) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const existingUser = userDoc.data() as User;
      if (existingUser.role !== role) {
         setDoc(userDocRef, { role: role }, { merge: true }).catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: { role },
            });
            errorEmitter.emit('permission-error', permissionError);
        });
        existingUser.role = role;
      }
      return existingUser;
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

      setDoc(userDocRef, userProfile).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: userProfile,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
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
        console.warn(`User with UID ${firebaseUser.uid} authenticated but has no Firestore document.`);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};