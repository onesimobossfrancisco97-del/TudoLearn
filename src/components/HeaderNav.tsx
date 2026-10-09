import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Heart,
  Sparkles,
  Zap,
  ChevronDown,
  WifiOff,
  Bot,
  GraduationCap,
  Shield,
  Wand2,
  LogIn,
  LogOut,
  Cloud,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User as FirebaseUser } from 'firebase/auth';
import { Course } from '../types';
import { sound } from '../utils/audio';
import { DailyProgressRing } from './DailyProgressRing';

interface HeaderNavProps {
  courses: Course[];
  currentCourse: Course;
  onSelectCourse: (course: Course) => void;
  streak: number;
  gems: number;
  hearts: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  onUpdateDailyGoal?: (minutes: number) => void;
  isSuper: boolean;
  isSimulatedOffline: boolean;
  onOpenSuperModal: () => void;
  onOpenAiTutor: () => void;
  onOpenAiTools: () => void;
  firebaseUser: FirebaseUser | null;
  onSignInGoogle: () => void;
  onSignOut: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  courses,
  currentCourse,
  onSelectCourse,
  streak,
  gems,
  hearts,
  todayMinutes,
  dailyGoalMinutes,
  onUpdateDailyGoal,
  isSuper,
  isSimulatedOffline,
  onOpenSuperModal,
  onOpenAiTutor,
  onOpenAiTools,
  firebaseUser,
  onSignInGoogle,
  onSignOut,
}) => {
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isCelebratingStreak, setIsCelebratingStreak] = useState(false);

  const flameRef = useRef<HTMLButtonElement>(null);
  const prevStreakRef = useRef(streak);

  // High-impact multi-stage celebration animation
  const triggerStreakCelebration = (sourceEl?: HTMLElement | null) => {
    sound.playLevelUp();
    setIsCelebratingStreak(true);

    const targetEl = sourceEl || flameRef.current;
    let origin = { x: 0.7, y: 0.05 };

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }

    // Stage 1: Explosive Flame Core Burst
    confetti({
      particleCount: 85,
      spread: 90,
      origin,
      colors: ['#FF3B30', '#FF6B00', '#FFA500', '#FFD700', '#FF4500'],
      startVelocity: 38,
      gravity: 0.85,
      scalar: 1.25,
      ticks: 200,
    });

    // Stage 2: Left and Right Stadium Crossfire Cannons
    setTimeout(() => {
      confetti({
        particleCount: 65,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.2 },
        colors: ['#FF4500', '#FFA500', '#FFD700', '#2563EB', '#38BDF8'],
        startVelocity: 45,
      });
      confetti({
        particleCount: 65,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.2 },
        colors: ['#FF4500', '#FFA500', '#FFD700', '#2563EB', '#38BDF8'],
        startVelocity: 45,
      });
    }, 150);

    // Stage 3: Golden Stars & Sparkles Grand Finale
    setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 120,
        origin,
        shapes: ['star', 'circle'],
        colors: ['#FFD700', '#FFA500', '#FF6200', '#FFFFFF', '#60A5FA'],
        startVelocity: 42,
        scalar: 1.4,
        ticks: 260,
      });
    }, 320);

    setTimeout(() => {
      setIsCelebratingStreak(false);
    }, 3000);
  };

  // Detect whenever streak increases
  useEffect(() => {
    if (streak > prevStreakRef.current) {
      triggerStreakCelebration(flameRef.current);
    }
    prevStreakRef.current = streak;
  }, [streak]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-blue-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Logo & Course Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* TudoLearn Brand Logo */}
          <div className="flex items-center gap-2 select-none shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border-b-2 border-blue-900 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none">
                TudoLearn
              </span>
              <span className="text-[8px] uppercase tracking-widest font-black text-blue-500/80 mt-0.5 hidden sm:block">
                Gamified Mastery
              </span>
            </div>
          </div>

          {/* Course Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowCourseDropdown(!showCourseDropdown);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 border-blue-200 hover:border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-slate-800 transition-all cursor-pointer font-black text-xs sm:text-sm active:scale-95 shadow-xs"
            >
              <span className="text-xl sm:text-2xl leading-none">
                {currentCourse.flagEmoji || '📘'}
              </span>
              <span className="max-w-[90px] sm:max-w-[130px] truncate font-extrabold text-blue-950">
                {currentCourse.title}
              </span>
              <ChevronDown className="w-4 h-4 text-blue-400" />
            </button>

            {/* Dropdown Menu */}
            {showCourseDropdown && (
              <div className="absolute top-12 left-0 w-64 bg-white border-2 border-blue-200 rounded-3xl shadow-2xl p-2 z-50 animate-scale-up">
                <div className="text-[10px] uppercase font-black tracking-wider text-blue-400 px-3 py-1.5">
                  Select Study Course
                </div>
                <div className="space-y-1">
                  {courses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        sound.playClick();
                        onSelectCourse(c);
                        setShowCourseDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-left transition-colors cursor-pointer ${
                        c.id === currentCourse.id
                          ? 'bg-blue-100 text-blue-900 font-black'
                          : 'hover:bg-slate-50 text-slate-700 font-bold'
                      }`}
                    >
                      <span className="text-xl">{c.flagEmoji || '🎓'}</span>
                      <div className="flex-1 truncate">
                        <div className="text-xs truncate">{c.title}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{c.subject}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Stats & Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* AI Tools Suite Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAiTools();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-sm shadow-purple-500/20 border-b-2 border-purple-900"
            title="Open AI Studio Tools (Music, Voice, Vision, Video)"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Lab</span>
          </button>

          {/* AI Pip Buddy quick trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAiTutor();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-sm shadow-blue-500/20 border-b-2 border-blue-800"
            title="Ask Pip AI tutor"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Pip</span>
          </button>

          {/* Streak Flame Counter */}
          <div className="relative">
            <button
              ref={flameRef}
              type="button"
              onClick={() => {
                sound.playClick();
                setShowStreakModal(!showStreakModal);
              }}
              className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-2xl font-black text-xs sm:text-sm cursor-pointer select-none transition-all duration-300 border ${
                isCelebratingStreak
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white border-orange-400 scale-110 shadow-lg shadow-orange-500/50 ring-4 ring-orange-400/50 animate-pulse'
                  : 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200'
              }`}
              title={`${streak} Day Streak!`}
            >
              <Flame
                className={`w-4 h-4 transition-transform duration-300 ${
                  isCelebratingStreak
                    ? 'fill-yellow-200 text-yellow-200 scale-125 animate-bounce'
                    : 'fill-orange-500 text-orange-500 animate-pulse'
                }`}
              />
              <span>{streak}</span>
            </button>

            {/* Streak Modal */}
            {showStreakModal && (
              <div className="absolute top-12 right-0 w-72 bg-white border-2 border-orange-200 rounded-3xl shadow-2xl p-4 z-50 animate-scale-up">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Flame className="w-5 h-5 fill-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-800">{streak} Day Streak!</div>
                    <div className="text-[10px] text-slate-400 font-bold">Keep the fire burning</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-800 rounded-xl mb-3 text-xs font-bold border border-blue-100">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Streak Freeze is active for protection</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerStreakCelebration(flameRef.current);
                    setShowStreakModal(false);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase rounded-xl border-b-2 border-orange-800 active:border-b-0 cursor-pointer"
                >
                  CELEBRATE STREAK
                </button>
              </div>
            )}
          </div>

          {/* Daily Goal Progress Ring */}
          <DailyProgressRing
            todayMinutes={todayMinutes}
            dailyGoalMinutes={dailyGoalMinutes}
            onUpdateDailyGoal={onUpdateDailyGoal}
          />

          {/* Gems */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-2xl text-blue-600 bg-blue-50 font-black text-xs sm:text-sm cursor-default select-none border border-blue-200"
            title={`${gems} Gems`}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>{gems}</span>
          </div>

          {/* Hearts */}
          <button
            onClick={() => {
              sound.playClick();
              if (!isSuper) onOpenSuperModal();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border ${
              isSuper
                ? 'text-blue-700 bg-blue-50 border-blue-300'
                : 'text-rose-500 bg-rose-50 border-rose-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSuper ? 'text-blue-600 fill-blue-600' : 'text-rose-500 fill-rose-500'}`} />
            <span>{isSuper ? '∞' : hearts}</span>
          </button>

          {/* Firebase Authentication / User Avatar */}
          <div className="relative">
            {firebaseUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-8 h-8 rounded-full border-2 border-blue-400 overflow-hidden shadow-xs cursor-pointer active:scale-95 transition-transform"
                  title={`${firebaseUser.displayName || firebaseUser.email} (Synced to Firestore)`}
                >
                  <img
                    src={firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                {showUserDropdown && (
                  <div className="absolute top-11 right-0 w-56 bg-white border-2 border-blue-200 rounded-3xl shadow-2xl p-3 z-50 animate-scale-up">
                    <div className="text-xs font-black text-slate-800 truncate mb-1">
                      {firebaseUser.displayName || 'Learner'}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mb-2">
                      {firebaseUser.email}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl mb-3 border border-emerald-200">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Firestore Sync Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSignOut();
                        setShowUserDropdown(false);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onSignInGoogle}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-black text-xs rounded-2xl shadow-sm border-b-2 border-blue-900 active:border-b-0 cursor-pointer"
                title="Sign In with Google via Firebase Auth"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
