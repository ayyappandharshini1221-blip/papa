'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LeaderboardEntry, Student } from '@/lib/types';

export function useLeaderboard(classId?: string) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        let studentQuery;
        // The error is caused by compound queries that require a composite index.
        // Let's simplify the queries to avoid this.
        if (classId) {
          // First, get all students in the class
          studentQuery = query(collection(db, 'users'), where('classIds', 'array-contains', classId));
        } else {
          // Get all students, ordered by XP
          studentQuery = query(collection(db, 'users'), where('role', '==', 'student'), orderBy('xp', 'desc'), limit(10));
        }
        
        const querySnapshot = await getDocs(studentQuery);

        let students: Student[] = querySnapshot.docs.map(doc => doc.data() as Student);

        // If we filtered by classId, we now need to sort and limit in the client
        if (classId) {
          students = students
            .filter(s => s.role === 'student')
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10);
        }
        
        const data: LeaderboardEntry[] = students.map((student, index) => ({
          rank: index + 1,
          studentId: student.id,
          studentName: student.name,
          studentAvatarUrl: student.avatarUrl || '',
          xp: student.xp,
          streak: student.streak
        }));
        
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [classId]);

  return { leaderboardData, loading };
}
