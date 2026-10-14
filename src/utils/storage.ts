import { UserProfile, Badge, LeaderboardUser, CommunityPost } from '../types';

const STORAGE_KEY = 'tudolearn_user_profile_v1';
const COMMUNITY_KEY = 'tudolearn_community_posts_v1';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-flame',
    title: 'Wildfire',
    description: 'Reach a 7-day learning streak',
    icon: 'Flame',
    category: 'streak',
    progress: 3,
    maxProgress: 7,
    isUnlocked: false,
    rewardGems: 100,
  },
  {
    id: 'badge-polyglot',
    title: 'Voice Virtuoso',
    description: 'Accurately pronounce 10 speech phrases',
    icon: 'Mic',
    category: 'languages',
    progress: 4,
    maxProgress: 10,
    isUnlocked: false,
    rewardGems: 75,
  },
  {
    id: 'badge-maestro',
    title: 'Piano Prodigy',
    description: 'Hit 8 perfect music pitch notes',
    icon: 'Music',
    category: 'music',
    progress: 5,
    maxProgress: 8,
    isUnlocked: false,
    rewardGems: 75,
  },
  {
    id: 'badge-euler',
    title: 'Speed Mathemagician',
    description: 'Solve 10 rapid math calculations without mistake',
    icon: 'Calculator',
    category: 'math',
    progress: 6,
    maxProgress: 10,
    isUnlocked: false,
    rewardGems: 80,
  },
  {
    id: 'badge-xp-1000',
    title: 'Sage of Omniscience',
    description: 'Accumulate 500 total XP',
    icon: 'Award',
    category: 'xp',
    progress: 180,
    maxProgress: 500,
    isUnlocked: false,
    rewardGems: 150,
  },
  {
    id: 'badge-super',
    title: 'Super TudoLearn Pioneer',
    description: 'Activate Super TudoLearn membership or 7-day trial',
    icon: 'Crown',
    category: 'mastery',
    progress: 0,
    maxProgress: 1,
    isUnlocked: false,
    rewardGems: 200,
  },
  {
    id: 'badge-daily-champion',
    title: 'Daily Challenger',
    description: 'Solve 3 Daily Rotating Challenges',
    icon: 'Sparkles',
    category: 'mastery',
    progress: 1,
    maxProgress: 3,
    isUnlocked: false,
    rewardGems: 120,
  },
  {
    id: 'badge-cyber-architect',
    title: 'Cyber Architect',
    description: 'Master hardware, terminal pipelines & computer networks',
    icon: 'Laptop',
    category: 'mastery',
    progress: 1,
    maxProgress: 4,
    isUnlocked: false,
    rewardGems: 150,
  },
];

export const DEFAULT_USER: UserProfile = {
  name: 'Alex Explorer',
  email: 'alex@tudolearn.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  xp: 245,
  gems: 480,
  streak: 5,
  streakFrozen: false,
  hasStreakFreeze: true,
  hearts: 5,
  maxHearts: 5,
  lastHeartTimestamp: Date.now(),
  isSuper: false,
  currentSubject: 'languages',
  currentCourseId: 'course-lang-es',
  completedLessonIds: ['l-es-1-1'],
  completedCourseIds: [],
  downloadedCourseIds: ['course-lang-es'],
  dailyGoalMinutes: 15,
  todayMinutes: 8,
  badges: INITIAL_BADGES,
  lastDailyChallengeDate: '',
  dailyChallengeStreak: 0,
};

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u-1', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', xp: 820, streak: 19, league: 'Gold', weeklyChange: 2 },
  { id: 'u-2', name: 'Kenji Sato', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', xp: 690, streak: 14, league: 'Gold', weeklyChange: 1 },
  { id: 'u-3', name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', xp: 540, streak: 8, league: 'Gold', weeklyChange: -1 },
  { id: 'current', name: 'Alex Explorer (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', xp: 245, streak: 5, league: 'Gold', isCurrentUser: true, weeklyChange: 3 },
  { id: 'u-4', name: 'Lucas Rossi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', xp: 210, streak: 4, league: 'Gold', weeklyChange: -2 },
  { id: 'u-5', name: 'Amina Diallo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', xp: 190, streak: 3, league: 'Gold', weeklyChange: 0 },
  { id: 'u-6', name: 'Liam O\'Connor', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', xp: 140, streak: 2, league: 'Gold', weeklyChange: -1 },
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p-1',
    authorName: 'Sofia Mendes',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    authorBadge: '🇪🇸 Polyglot Lvl 12',
    subject: 'languages',
    title: 'Mnemonic trick for Spanish "Por" vs "Para"',
    content: 'Remember PERFECT for "Para": Purpose, Exact date, Recipient, Future goal, Employment, Comparison, Toward a place! Hope this helps anyone studying in Unit 2 on TudoLearn!',
    createdAt: '2 hours ago',
    upvotes: 42,
    hasUpvoted: true,
    replies: [
      {
        id: 'r-1',
        authorName: 'Kenji Sato',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        content: 'This is brilliant! PERFECT makes it so easy to recall under time pressure.',
        createdAt: '1 hour ago',
      },
    ],
  },
  {
    id: 'p-2',
    authorName: 'David Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    authorBadge: '🎵 Music Theorist',
    subject: 'music',
    title: 'Circle of Fifths shortcut for piano learners',
    content: 'Notice how each sharp key adds 7 semitones (or a 5th up) while flats add 5 semitones! Practicing this 5 minutes a day will make ear training effortless.',
    createdAt: '5 hours ago',
    upvotes: 29,
    replies: [],
  },
  {
    id: 'p-3',
    authorName: 'Dr. Aris Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    authorBadge: '📐 Math Mentor',
    subject: 'mathematics',
    title: 'Mental percentage hack: X% of Y is always Y% of X!',
    content: 'Need to find 16% of 50? Just flip it: 50% of 16 = 8! It works for all real numbers and saves precious seconds in mental math rounds.',
    createdAt: '1 day ago',
    upvotes: 88,
    replies: [
      {
        id: 'r-2',
        authorName: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        content: 'My mind is blown! Used this in the speed challenge today.',
        createdAt: '18 hours ago',
      },
    ],
  },
  {
    id: 'p-4',
    authorName: 'Gabriel Santos',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authorBadge: '💻 Linux SysAdmin',
    subject: 'informatics',
    title: 'Essential Linux CLI shortcuts for Informatics Unit 1',
    content: 'Quick tip: remember "ls -la" to list all files with permissions and file sizes in human-readable format. Also, pressing Ctrl+R lets you reverse-search your entire shell command history instantly!',
    createdAt: '3 hours ago',
    upvotes: 64,
    hasUpvoted: true,
    replies: [
      {
        id: 'r-3',
        authorName: 'Alex Explorer (You)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        content: 'Ctrl+R is a lifesaver in the terminal exercises! Thanks for sharing!',
        createdAt: '2 hours ago',
      },
    ],
  },
];

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_USER, ...parsed };
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function getCommunityPosts(): CommunityPost[] {
  if (typeof window === 'undefined') return INITIAL_COMMUNITY_POSTS;
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    if (!raw) return INITIAL_COMMUNITY_POSTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMMUNITY_POSTS;
  }
}

export function saveCommunityPosts(posts: CommunityPost[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts:', e);
  }
}
