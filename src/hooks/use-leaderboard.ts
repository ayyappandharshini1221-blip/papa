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
        if (classId) {
          studentQuery = query(collection(db, 'users'), where('role', '==', 'student'), where('classIds', 'array-contains', classId), orderBy('xp', 'desc'), limit(10));
        } else {
          studentQuery = query(collection(db, 'users'), where('role', '==', 'student'), orderBy('xp', 'desc'), limit(10));
        }
        
        const querySnapshot = await getDocs(studentQuery);
        const students = querySnapshot.docs.map(doc => doc.data() as Student);
        
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
