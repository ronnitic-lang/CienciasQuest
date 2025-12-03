export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export interface AvatarConfig {
  skinColor: string;
  hairStyle: string; // 'straight', 'curly', 'braids', 'indigenous_headdress'
  hairColor: string;
  clothing: string; // 'casual', 'lab_coat', 'traditional'
  accessory: string; // 'none', 'glasses', 'goggles'
  backgroundColor: string;
}

export interface StudentProfile {
  name: string;
  grade: number; // 6, 7, 8, 9
  school: string;
  shift: 'Manhã' | 'Tarde' | 'Integral';
  classId: string; // A, B, C...
  avatar: AvatarConfig;
  progress: Record<string, number>; // skillId -> stars (0-3)
  completedRevision: boolean;
}

export interface TeacherProfile {
  name: string;
  school: string;
  classes: string[]; // ['6A', '7B']
}

export interface Skill {
  id: string; // EF06CI01
  code: string;
  description: string;
  topic: string;
  grade: number;
  isRevision?: boolean;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_GAP = 'FILL_GAP',
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[]; // string for MC, string[] for gaps
  explanation: string;
}

export interface LessonContent {
  intro: string;
  questions: Question[];
}