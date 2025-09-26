'use client';

import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import { onAuthChange } from '@/lib/auth/auth';
import type { Teacher, Class, Student } from '@/lib/types';

interface StudentsByClass {
  [classId: string]: Student[];
}

export function useTeacherData() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<StudentsByClass>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthChange(async (user) => {
      const db = getDb();
      if (user && user.role === 'teacher') {
        const teacherDocRef = doc(db, 'users', user.id);
        const teacherDoc = await getDoc(teacherDocRef);
        if (teacherDoc.exists()) {
          setTeacher(teacherDoc.data() as Teacher);
        } else {
            setLoading(false);
            setTeacher(null);
        }
      } else {
        setTeacher(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const db = getDb();
    if (!teacher) {
      if (!loading) { 
        setClasses([]);
      }
      return;
    };

    const classesQuery = query(
      collection(db, 'classes'),
      where('teacherId', '==', teacher.id)
    );

    const unsubscribeClasses = onSnapshot(classesQuery, (querySnapshot) => {
      const fetchedClasses = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Class)
      );
      setClasses(fetchedClasses);
      // We will set loading to false in the student fetching useEffect
    });

    return () => unsubscribeClasses();
  }, [teacher, loading]);


  useEffect(() => {
    const db = getDb();
    // This effect now controls the final loading state
    if (classes.length === 0 && teacher) { // teacher check ensures this doesn't run on initial load before teacher is set
      setStudents({});
      setLoading(false);
      return;
    }
    if (classes.length === 0) {
      return;
    }


    const studentIdsPerClass: { [classId: string]: string[] } = {};
    const allStudentIds = new Set<string>();
    classes.forEach(c => {
        studentIdsPerClass[c.id] = c.studentIds;
        c.studentIds.forEach(id => allStudentIds.add(id));
    });

    if (allStudentIds.size === 0) {
        setStudents({});
        setLoading(false);
        return;
    }

    const fetchStudents = async () => {
        const studentsData: { [id: string]: Student } = {};
        const studentIdsArray = Array.from(allStudentIds);

        // Firestore 'in' query is limited to 30 elements.
        // We need to batch the requests.
        const batches = [];
        for (let i = 0; i < studentIdsArray.length; i += 30) {
            batches.push(studentIdsArray.slice(i, i + 30));
        }

        await Promise.all(batches.map(async (batch) => {
            if (batch.length === 0) return;
            const studentsQuery = query(collection(db, 'users'), where('__name__', 'in', batch));
            const querySnapshot = await getDocs(studentsQuery);
            querySnapshot.forEach(doc => {
                studentsData[doc.id] = { id: doc.id, ...doc.data() } as Student;
            });
        }));
        
        const newStudentsByClass: StudentsByClass = {};
        for(const classId in studentIdsPerClass) {
            newStudentsByClass[classId] = studentIdsPerClass[classId]
                .map(studentId => studentsData[studentId])
                .filter(Boolean); // Filter out undefined students
        }
        setStudents(newStudentsByClass);
        setLoading(false); // Set loading to false after all data is fetched
    };

    fetchStudents();

  }, [classes, teacher]);


  return { teacher, classes, students, loading };
}
