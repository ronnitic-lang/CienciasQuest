
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  ASSOCIATION = 'ASSOCIATION'
}

export interface AvatarConfig {
  skinColor: string;
  accessory: 'none' | 'glasses' | 'goggles';
  clothing: 'tshirt' | 'labcoat';
  hairColor: string;
  hairStyle: 'short' | 'long' | 'puffs' | 'bob' | 'bald' | 'fade';
  facialHair?: 'none' | 'beard' | 'mustache';
  headwear: 'none' | 'cocar' | 'turban' | 'strawHat';
}

export interface Classroom {
  id: string;
  school: string;
  grade: number;
  classId: string; // A, B, C...
  shift: string; // Manhã, Tarde, Integral
  teacherId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'blocked';
  
  state?: string;
  city?: string;
  school?: string;
  teacherSchools?: string[]; // Lista de escolas vinculadas a este professor
  grade?: number;
  classId?: string;
  shift?: string;
  teacherId?: string;
  
  isVerified?: boolean; 
  proofFileUrl?: string;

  avatarConfig?: AvatarConfig;
  xp?: number;
  streak?: number;
  completedUnits?: string[];
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: number | string;
  explanation?: string;
  bnccCode?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  grade: number;
  bnccCodes: string[];
  isLocked: boolean;
  color: string;
  type?: 'review' | 'standard' | 'exam' | 'gincana';
  bimester?: 1 | 2 | 3 | 4;
}

export interface AnalyticsData {
  skill: string;
  averageScore: number;
  studentCount: number;
}
