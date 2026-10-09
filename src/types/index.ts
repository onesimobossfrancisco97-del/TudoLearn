export type SubjectType = 'languages' | 'mathematics' | 'music' | 'science' | 'coding' | 'psychology';

export type ExerciseType =
  | 'multiple_choice'
  | 'sentence_order'
  | 'listen_select'
  | 'speech_practice'
  | 'piano_note'
  | 'math_solve'
  | 'flashcard';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  instruction?: string;
  subject: SubjectType;
  topic: string;
  options?: string[];
  correctAnswer: string;
  audioPrompt?: string; // Text to speak via TTS
  audioLang?: string;   // 'es-ES', 'fr-FR', 'en-US', etc.
  targetSpeech?: string;// For speech recognition
  soundNote?: string;   // For music: 'C4', 'E4', 'G4', etc.
  mathFormula?: string;
  explanation: string;
  hint?: string;
  wordBank?: string[];  // For sentence ordering
}

export interface LessonNode {
  id: string;
  title: string;
  description: string;
  unitId: string;
  subject: SubjectType;
  xpReward: number;
  totalExercises: number;
  type: 'regular' | 'checkpoint' | 'chest' | 'speaking' | 'speed_round';
  crowns: number; // 0 to 3
  status: 'locked' | 'available' | 'completed' | 'current';
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  color: string;
  bannerGradient: string;
  lessons: LessonNode[];
}

export interface Course {
  id: string;
  subject: SubjectType;
  title: string;
  language?: string;
  icon: string;
  flagEmoji?: string;
  color: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalLearners: string;
  units: Unit[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'xp' | 'music' | 'languages' | 'math' | 'mastery';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  rewardGems: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Obsidian' | 'Diamond';
  isCurrentUser?: boolean;
  weeklyChange?: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  subject: SubjectType;
  title: string;
  content: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  replies: {
    id: string;
    authorName: string;
    avatar: string;
    content: string;
    createdAt: string;
  }[];
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  gems: number;
  streak: number;
  streakFrozen: boolean;
  hasStreakFreeze: boolean;
  hearts: number;
  maxHearts: number;
  lastHeartTimestamp: number;
  isSuper: boolean;
  trialExpiresAt?: number;
  currentSubject: SubjectType;
  currentCourseId: string;
  completedLessonIds: string[];
  completedCourseIds: string[];
  downloadedCourseIds: string[];
  dailyGoalMinutes: number;
  todayMinutes: number;
  badges: Badge[];
}
