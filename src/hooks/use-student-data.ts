'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot, collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { onAuthChange } from '@/lib/auth/auth';
import type { Student, Class } from '@/lib/types';

export function useStudentData() {
  const [student, setStudent] = useState<Student | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user && user.role === 'student') {
        const studentDocRef = doc(db, 'users', user.id);
        const unsubStudent = onSnapshot(studentDocRef, (doc) => {
          setStudent(doc.data() as Student);
          setLoading(false);
        });

        return () => unsubStudent();
      } else {
        setStudent(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      if (student && student.classIds && student.classIds.length > 0) {
        try {
          const classesQuery = query(collection(db, 'classes'), where('__name__', 'in', student.classIds));
          const querySnapshot = await getDocs(classesQuery);
          const fetchedClasses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
          setClasses(fetchedClasses);
        } catch (error) {
          console.error("Error fetching classes: ", error);
        }
      } else {
        setClasses([]);
      }
    };

    fetchClasses();
  }, [student]);


  return { student, classes, loading };
}
