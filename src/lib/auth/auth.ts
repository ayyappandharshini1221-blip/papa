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

export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
) => {
  try {
    // Check if a user with this email already exists in Firestore
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
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    
    // If user exists in Auth but not Firestore, create a record.
    // This is a fallback and might not have the correct role if it wasn't set during a failed signup.
    // Defaulting to 'student'.
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
    await setDoc(userDocRef, userProfile);
    return userProfile;

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
      const existingUser = userDoc.data() as User;
      // If role selection during Google sign-in differs from stored role, update it.
      if (existingUser.role !== role) {
        await setDoc(userDocRef, { role: role }, { merge: true });
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
        // This case handles users that exist in Auth but not in Firestore.
        // You might want to create a default user record here or handle it as an error state.
        console.warn(`User with UID ${firebaseUser.uid} authenticated but has no Firestore document.`);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
