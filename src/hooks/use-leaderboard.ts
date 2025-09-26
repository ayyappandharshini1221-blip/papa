'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { getDb } from '@/lib/firebase';
import type { LeaderboardEntry, Student } from '@/lib/types';

export function useLeaderboard(classId?: string) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const db = getDb();
      setLoading(true);
      try {
        let students: Student[] = [];

        // Fetch all users who are students
        const studentQuery = query(collection(db, 'users'), where('role', '==', 'student'));
        const querySnapshot = await getDocs(studentQuery);
        students = querySnapshot.docs.map(doc => doc.data() as Student);
        
        // If a classId is provided, filter the students on the client side
        if (classId) {
          students = students.filter(s => s.classIds?.includes(classId));
        }

        // Sort by XP in descending order
        students.sort((a, b) => b.xp - a.xp);
        
        // Limit to top 10 if no class is specified
        if (!classId) {
            students = students.slice(0, 10);
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
