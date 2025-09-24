export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}

export interface Teacher extends User {
  role: 'teacher';
}

export interface Student extends User {
  role: 'student';
  xp: number;
  streak: number;
  badges: Badge[];
  classIds: string[];
}

export interface Class {
  id: string;
  name:string;
  teacherId: string;
  studentIds: string[];
  inviteCode: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  assignedTo: string; // classId
  questionCount: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  studentAvatarUrl: string;
  xp: number;
  rank: number;
}
