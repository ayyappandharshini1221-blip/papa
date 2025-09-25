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
import { db } from '@/lib/firebase';
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
      if (user && user.role === 'teacher') {
        const teacherDocRef = doc(db, 'users', user.id);
        const teacherDoc = await getDoc(teacherDocRef);
        if (teacherDoc.exists()) {
          setTeacher(teacherDoc.data() as Teacher);
        }
      } else {
        setTeacher(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!teacher) {
      if (!loading) { // prevent clearing on initial load
        setClasses([]);
      }
      return;
    };

    setLoading(true);
    const classesQuery = query(
      collection(db, 'classes'),
      where('teacherId', '==', teacher.id)
    );

    const unsubscribeClasses = onSnapshot(classesQuery, (querySnapshot) => {
      const fetchedClasses = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Class)
      );
      setClasses(fetchedClasses);
      setLoading(false);
    });

    return () => unsubscribeClasses();
  }, [teacher, loading]);


  useEffect(() => {
    if (classes.length === 0) {
      setStudents({});
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

        for (const batch of batches) {
            if (batch.length === 0) continue;
            const studentsQuery = query(collection(db, 'users'), where('__name__', 'in', batch));
            const querySnapshot = await getDocs(studentsQuery);
            querySnapshot.forEach(doc => {
                studentsData[doc.id] = { id: doc.id, ...doc.data() } as Student;
            });
        }
        
        const newStudentsByClass: StudentsByClass = {};
        for(const classId in studentIdsPerClass) {
            newStudentsByClass[classId] = studentIdsPerClass[classId]
                .map(studentId => studentsData[studentId])
                .filter(Boolean); // Filter out undefined students
        }
        setStudents(newStudentsByClass);
    };

    fetchStudents();

  }, [classes]);


  return { teacher, classes, students, loading };
}
