import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Flame,
  Heart,
  Sparkles,
  ChevronDown,
  Bot,
  Shield,
  Wand2,
  LogIn,
  LogOut,
  Cloud,
  Search,
  Globe,
  Volume2,
  VolumeX,
  X,
  Check,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User as FirebaseUser } from 'firebase/auth';
import { Course } from '../types';
import { sound, useMenuClickSound } from '../utils/audio';
import { DailyProgressRing } from './DailyProgressRing';
import appLogoImg from '../assets/images/tudolearn_app_logo_1791585881128.jpg';
import { AppLanguage, SUPPORTED_LANGUAGES, t, translateCourseTitle, translateSubject } from '../utils/i18n';

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
  onOpenDailyChallenge?: () => void;
  isDailyChallengeCompleted?: boolean;
  onOpenManagementTab?: () => void;
  appLanguage?: AppLanguage;
  onSelectAppLanguage?: (lang: AppLanguage) => void;
  onOpenCertificates?: () => void;
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
  isSimulatedOffline: _isSimulatedOffline,
  onOpenSuperModal,
  onOpenAiTutor,
  onOpenAiTools,
  firebaseUser,
  onSignInGoogle,
  onSignOut,
  onOpenDailyChallenge,
  isDailyChallengeCompleted,
  onOpenManagementTab,
  appLanguage = 'en',
  onSelectAppLanguage,
  onOpenCertificates,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<'all' | 'languages' | 'music' | 'stem' | 'informatics'>('all');
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isCelebratingStreak, setIsCelebratingStreak] = useState(false);
  const { isClickSoundEnabled, toggleClickSound } = useMenuClickSound();

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === appLanguage) || SUPPORTED_LANGUAGES[0];

  const flameRef = useRef<HTMLButtonElement>(null);
  const prevStreakRef = useRef(streak);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const handleSoundToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextState = toggleClickSound();
    if (nextState) {
      sound.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-blue-100 shadow-xs w-full max-w-full">
      {/* =========================================================================
          PRIMARY TOP BAR
          Spaced, accessible, zero-overlap options for mobile, tablet, and laptop
          ========================================================================= */}
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6 h-15 sm:h-17 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left Section: Brand Logo & Course Switcher (Flexible, never squashed) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
          {/* TudoLearn Brand Logo */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 select-none shrink-0 group cursor-pointer"
            onClick={() => sound.playLevelUp()}
            title="TudoLearn - All-in-One Learning"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl overflow-hidden shadow-xs border-2 border-blue-200 group-hover:scale-105 transition-transform shrink-0 bg-blue-600 ring-2 ring-blue-400/20">
              <img
                src={appLogoImg}
                alt="TudoLearn App Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none">
                TudoLearn
              </span>
              <span className="text-[8px] uppercase tracking-widest font-black text-blue-500/80 mt-0.5 hidden xl:block">
                All-in-One Learning
              </span>
            </div>
          </div>

          {/* Course Switcher Option Trigger */}
          <div className="relative shrink min-w-0">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowCourseDropdown(true);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 h-9 sm:h-9.5 rounded-xl sm:rounded-2xl border-2 border-blue-200 hover:border-blue-300 bg-blue-50/80 hover:bg-blue-100 text-slate-800 transition-all cursor-pointer font-black text-xs active:scale-95 shadow-xs max-w-full"
              title="Change active course or subject"
            >
              <span className="text-base sm:text-xl leading-none shrink-0">
                {currentCourse.flagEmoji || '📘'}
              </span>
              <span className="max-w-[65px] xs:max-w-[85px] sm:max-w-[105px] md:max-w-[125px] lg:max-w-[160px] truncate font-extrabold text-blue-950">
                {currentCourse.title}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-blue-600 shrink-0 transition-transform duration-200 ${
                  showCourseDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Section: Structured Functional Clusters (Zero Overlap) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* ---------------------------------------------------------------
              Cluster 1: Vital Stats (Streak, Hearts, Gems, Goal Ring)
              Always fits, responsive pills with crystal-clear counts
              --------------------------------------------------------------- */}

          {/* Streak Flame Counter (sm+) */}
          <div className="relative shrink-0 hidden sm:block">
            <button
              ref={flameRef}
              type="button"
              onClick={() => {
                sound.playClick();
                setShowStreakModal(!showStreakModal);
              }}
              className={`h-9 px-2 sm:px-2.5 flex items-center gap-1 rounded-xl font-black text-xs cursor-pointer select-none transition-all duration-200 border ${
                isCelebratingStreak
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white border-orange-400 scale-105 shadow-md shadow-orange-500/40 ring-2 ring-orange-300'
                  : 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200'
              }`}
              title={`${streak} Day Streak!`}
            >
              <Flame
                className={`w-3.5 h-3.5 shrink-0 ${
                  isCelebratingStreak
                    ? 'fill-yellow-200 text-yellow-200 animate-bounce'
                    : 'fill-orange-500 text-orange-500'
                }`}
              />
              <span className="font-extrabold">{streak}</span>
            </button>
          </div>

          {/* Hearts Option (sm+) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (!isSuper) onOpenSuperModal();
            }}
            className={`hidden sm:flex h-9 px-2 sm:px-2.5 items-center gap-1 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer border ${
              isSuper
                ? 'text-blue-700 bg-blue-50 border-blue-300'
                : 'text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100'
            }`}
            title={isSuper ? 'Unlimited Super Hearts' : `${hearts} Hearts Remaining`}
          >
            <Heart
              className={`w-3.5 h-3.5 shrink-0 ${
                isSuper ? 'text-blue-600 fill-blue-600' : 'text-rose-500 fill-rose-500'
              }`}
            />
            <span className="font-extrabold">{isSuper ? '∞' : hearts}</span>
          </button>

          {/* Gems (lg+) */}
          <div
            className="hidden lg:flex h-9 px-2.5 items-center gap-1 rounded-xl text-blue-600 bg-blue-50 font-black text-xs cursor-default select-none border border-blue-200 shrink-0"
            title={`${gems} Gems`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-extrabold">{gems}</span>
          </div>

          {/* Daily Goal Progress Ring (xl+) */}
          {todayMinutes !== undefined && dailyGoalMinutes !== undefined && (
            <div className="hidden xl:block shrink-0">
              <DailyProgressRing
                todayMinutes={todayMinutes}
                dailyGoalMinutes={dailyGoalMinutes}
                onUpdateDailyGoal={onUpdateDailyGoal}
              />
            </div>
          )}

          {/* ---------------------------------------------------------------
              Cluster 2: AI & Quick Learning Actions
              Icon-first on tablets/laptops, expanding on wide screens
              --------------------------------------------------------------- */}

          {/* Pip AI Tutor Quick Button (sm+) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAiTutor();
            }}
            className="hidden sm:flex h-9 px-2 sm:px-2.5 items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-xs border-b border-blue-800 shrink-0"
            title="Ask Pip AI tutor"
          >
            <Bot className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline text-[11px]">Pip</span>
          </button>

          {/* AI Tools Suite Button (lg+) */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAiTools();
            }}
            className="hidden lg:flex h-9 px-2 xl:px-2.5 items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-xs border-b border-purple-900 shrink-0"
            title="Open AI Studio Tools (Music, Voice, Vision, Video)"
          >
            <Wand2 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline text-[11px]">AI Lab</span>
          </button>

          {/* Daily Challenge Quick Button (md+) */}
          {onOpenDailyChallenge && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenDailyChallenge();
              }}
              className={`hidden md:flex h-9 px-2 xl:px-2.5 items-center gap-1 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer border shrink-0 ${
                isDailyChallengeCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-xs'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-amber-600 shadow-xs'
              }`}
              title={
                isDailyChallengeCompleted
                  ? 'Daily Challenge completed today! (+50 gems claimed)'
                  : "Daily Challenge: Solve today's puzzle (+50 Gems)"
              }
            >
              <Sparkles
                className={`w-3.5 h-3.5 shrink-0 ${
                  isDailyChallengeCompleted ? 'text-emerald-600' : 'text-amber-100 fill-amber-200'
                }`}
              />
              <span className="hidden xl:inline text-[11px]">
                {isDailyChallengeCompleted ? 'Solved' : 'Challenge'}
              </span>
            </button>
          )}

          {/* Visual Divider between Tools & Controls (sm+) */}
          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-0.5 shrink-0" />

          {/* ---------------------------------------------------------------
              Cluster 3: Utilities (Language, Sound, User Account)
              Compact, accessible, never clipped
              --------------------------------------------------------------- */}

          {/* Native App Language Switcher Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowLangModal(true);
            }}
            className="h-9 px-2 sm:px-2.5 flex items-center justify-center gap-1 rounded-xl border-2 border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50 text-slate-800 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
            title={`${t('header.native_language', appLanguage)} (${currentLangMeta.name})`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-sm leading-none shrink-0">{currentLangMeta.flag}</span>
            <span className="text-[11px] font-black hidden 2xl:inline text-slate-800">
              {currentLangMeta.nativeName}
            </span>
          </button>

          {/* Menu Click Sound Toggle Button */}
          <button
            type="button"
            onClick={handleSoundToggle}
            className={`h-9 px-2 sm:px-2.5 flex items-center justify-center gap-1 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer border shrink-0 ${
              isClickSoundEnabled
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-2xs'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
            title={
              isClickSoundEnabled
                ? 'Menu Click Sound: ON (Tap to Mute)'
                : 'Menu Click Sound: OFF (Tap to Unmute)'
            }
          >
            {isClickSoundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className="text-[11px] font-extrabold hidden 2xl:inline">
              {isClickSoundEnabled ? 'Sound' : 'Muted'}
            </span>
          </button>

          {/* Firebase Authentication / User Avatar Option */}
          <div className="relative shrink-0">
            {firebaseUser ? (
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-9 h-9 rounded-xl border-2 border-blue-400 overflow-hidden shadow-xs cursor-pointer active:scale-95 transition-transform shrink-0 block"
                title={`${firebaseUser.displayName || firebaseUser.email} (Synced to Firestore)`}
              >
                <img
                  src={
                    firebaseUser.photoURL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSignInGoogle}
                className="h-9 px-2.5 sm:px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-black text-xs rounded-xl shadow-xs border-b-2 border-blue-900 active:border-b-0 cursor-pointer flex items-center gap-1 shrink-0"
                title="Sign In with Google via Firebase Auth"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          ARRANGED TOP MENU OPTIONS FOR MOBILE VIEW
          Flows down in a clean 4-pill balanced bar, zero overlap, comfortable tap
          ========================================================================= */}
      <div className="sm:hidden w-full bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-sky-50/70 border-t border-blue-100/90 px-2 py-1.5">
        <div className="grid grid-cols-4 gap-1.5 w-full">
          {/* Streak Option */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowStreakModal(!showStreakModal);
            }}
            className={`min-h-[38px] px-1.5 py-1 flex items-center justify-center gap-1 rounded-xl font-black text-xs transition-transform active:scale-95 cursor-pointer border ${
              isCelebratingStreak
                ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50 shadow-2xs'
            }`}
            title={`${streak} Day Streak!`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 shrink-0" />
            <span className="font-extrabold truncate">{streak}d</span>
          </button>

          {/* Hearts Option */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              if (!isSuper) onOpenSuperModal();
            }}
            className={`min-h-[38px] px-1.5 py-1 flex items-center justify-center gap-1 rounded-xl font-black text-xs transition-transform active:scale-95 cursor-pointer border ${
              isSuper
                ? 'bg-white text-blue-700 border-blue-300 shadow-2xs'
                : 'bg-white text-rose-500 border-rose-200 hover:bg-rose-50 shadow-2xs'
            }`}
            title={isSuper ? 'Unlimited Super Hearts' : `${hearts} Hearts`}
          >
            <Heart
              className={`w-3.5 h-3.5 shrink-0 ${
                isSuper ? 'text-blue-600 fill-blue-600' : 'text-rose-500 fill-rose-500'
              }`}
            />
            <span className="font-extrabold truncate">{isSuper ? '∞' : hearts}</span>
          </button>

          {/* Gems Option */}
          <div
            className="min-h-[38px] px-1.5 py-1 flex items-center justify-center gap-1 rounded-xl font-black text-xs bg-white text-blue-600 border border-blue-200 select-none shadow-2xs"
            title={`${gems} Gems`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-extrabold truncate">{gems}</span>
          </div>

          {/* Pip AI Tutor Quick Option */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenAiTutor();
            }}
            className="min-h-[38px] px-1.5 py-1 flex items-center justify-center gap-1 rounded-xl font-black text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white transition-transform active:scale-95 cursor-pointer shadow-xs border-b border-blue-900"
            title="Ask Pip AI Tutor"
          >
            <Bot className="w-3.5 h-3.5 shrink-0" />
            <span className="font-extrabold truncate">Pip</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          COURSE SWITCHER MODAL (PORTALED TO DOCUMENT BODY)
          Guaranteed to pop up on top of EVERYTHING (z-[9999]), never hidden behind!
          ========================================================================= */}
      {showCourseDropdown && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in w-full h-full">
          {/* Backdrop Dismiss Trigger */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setShowCourseDropdown(false)}
            aria-hidden="true"
          />

          {/* Modal Container: High elevation, fully visible, scrolls down strictly */}
          <div className="relative w-full max-w-lg bg-white border-2 border-blue-300 rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col max-h-[88vh] animate-scale-up overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {t('header.switch_course', appLanguage)}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-bold">
                    {courses.length} learning paths available
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCourseDropdown(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="relative my-3 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder={t('header.search_course', appLanguage)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:bg-white font-medium"
                autoFocus
              />
            </div>

            {/* Subject Category Filter Tabs (Spacious, wraps vertically, never scrolls sideways) */}
            <div className="flex flex-wrap gap-2 mb-3 shrink-0">
              {[
                { id: 'all', label: t('subject.all', appLanguage) },
                { id: 'informatics', label: `💻 ${t('subject.informatics', appLanguage)} (${courses.filter((c) => c.subject === 'informatics' || c.subject === 'coding').length})` },
                { id: 'languages', label: `🌍 ${t('subject.languages', appLanguage)} (${courses.filter((c) => c.subject === 'languages').length})` },
                { id: 'music', label: `🎸 ${t('subject.music', appLanguage)} (${courses.filter((c) => c.subject === 'music').length})` },
                { id: 'stem', label: `🔬 ${t('subject.stem', appLanguage)}` },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCourseCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    courseCategoryFilter === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Scrollable Course Cards (Scrolls DOWN strictly) */}
            <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 py-1">
              {courses
                .filter((c) => {
                  if (courseCategoryFilter === 'languages') return c.subject === 'languages';
                  if (courseCategoryFilter === 'music') return c.subject === 'music';
                  if (courseCategoryFilter === 'informatics') return c.subject === 'informatics' || c.subject === 'coding';
                  if (courseCategoryFilter === 'stem') return c.subject === 'mathematics' || c.subject === 'science' || c.subject === 'psychology';
                  return true;
                })
                .filter((c) => {
                  if (!courseSearch.trim()) return true;
                  const q = courseSearch.toLowerCase();
                  return (
                    c.title.toLowerCase().includes(q) ||
                    (c.language && c.language.toLowerCase().includes(q)) ||
                    c.subject.toLowerCase().includes(q)
                  );
                })
                .map((c) => {
                  const isCurrent = c.id === currentCourse.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onSelectCourse(c);
                        setShowCourseDropdown(false);
                        setCourseSearch('');
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left transition-all cursor-pointer min-h-[58px] ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black ring-2 ring-blue-300'
                          : 'bg-slate-50 hover:bg-blue-50/70 text-slate-800 font-bold border border-slate-200 hover:border-blue-200 active:bg-blue-100'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl leading-none shrink-0 drop-shadow-xs">
                        {c.flagEmoji || '🎓'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs sm:text-sm font-black truncate ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                          {translateCourseTitle(c.title, appLanguage)}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] capitalize font-bold ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>
                            {c.subject === 'languages' ? c.language || 'Language' : translateSubject(c.subject, appLanguage)}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'}`}>
                            {c.totalLearners} learners
                          </span>
                        </div>
                      </div>
                      {isCurrent && (
                        <div className="p-1 rounded-full bg-white/20 text-white shrink-0">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>

            {/* Bottom Audio Sound Preferences & Founder Row */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 bg-slate-50/70 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 p-4 rounded-b-3xl">
              <div className="flex items-center gap-2">
                {isClickSoundEnabled ? (
                  <Volume2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div className="text-[11px] font-bold text-slate-700">
                  Menu Sound: <span className={isClickSoundEnabled ? 'text-blue-600' : 'text-slate-400'}>{isClickSoundEnabled ? 'Enabled' : 'Muted'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSoundToggle}
                  className={`ml-1.5 px-2.5 py-1 rounded-lg font-black text-xs cursor-pointer transition-colors ${
                    isClickSoundEnabled
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isClickSoundEnabled ? 'Turn OFF' : 'Turn ON'}
                </button>
              </div>

              <div className="text-[10px] text-slate-500 font-medium">
                Founder: <span className="font-black text-slate-900">Onesimo Boss Francisco</span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          STREAK CELEBRATION MODAL (PORTALED TO DOCUMENT BODY)
          Pops up on top of everything (z-[9999])
          ========================================================================= */}
      {showStreakModal && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setShowStreakModal(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm bg-white border-2 border-orange-200 rounded-3xl shadow-2xl p-5 animate-scale-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl">
                  <Flame className="w-5 h-5 fill-orange-500" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-800">{streak} Day Streak!</div>
                  <div className="text-[10px] text-slate-400 font-bold">Keep the fire burning</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStreakModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-2xl mb-4 text-xs font-bold border border-blue-100">
              <Shield className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Streak Freeze is active for protection</span>
            </div>

            <button
              type="button"
              onClick={() => {
                triggerStreakCelebration(flameRef.current);
                setShowStreakModal(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl border-b-2 border-orange-800 active:border-b-0 cursor-pointer shadow-xs"
            >
              CELEBRATE STREAK
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          USER PROFILE MODAL (PORTALED TO DOCUMENT BODY)
          Pops up on top of everything (z-[9999])
          ========================================================================= */}
      {showUserDropdown && firebaseUser && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setShowUserDropdown(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-xs bg-white border-2 border-blue-200 rounded-3xl shadow-2xl p-4 animate-scale-up">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-black text-slate-800 truncate">
                {firebaseUser.displayName || 'Learner'}
              </div>
              <button
                type="button"
                onClick={() => setShowUserDropdown(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 truncate mb-3">
              {firebaseUser.email}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl mb-3 border border-emerald-200">
              <Cloud className="w-3.5 h-3.5" />
              <span>Firestore Sync Active</span>
            </div>

            {onOpenCertificates && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenCertificates();
                  setShowUserDropdown(false);
                }}
                className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer mb-2 border border-amber-200"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('header.my_certificates', appLanguage)}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowUserDropdown(false);
                setShowLangModal(true);
              }}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer mb-2 border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Language: {currentLangMeta.flag} {currentLangMeta.nativeName}</span>
            </button>

            {onOpenManagementTab && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenManagementTab();
                  setShowUserDropdown(false);
                }}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer mb-2 border border-blue-200"
              >
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Management & Payment Settings</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onSignOut();
                setShowUserDropdown(false);
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            {/* Founder of the App Credit */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-center">
              <div className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span>{t('founder.badge', appLanguage)}</span>
              </div>
              <div className="text-xs font-black text-slate-900 mt-1">
                {t('founder.name', appLanguage)}
              </div>
              <div className="text-[9px] text-slate-400 font-medium">
                {t('founder.desc', appLanguage)}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          NATIVE LANGUAGE SELECTION MODAL (PORTALED TO DOCUMENT BODY)
          Pops up on top of everything (z-[9999])
          ========================================================================= */}
      {showLangModal && isMounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setShowLangModal(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md bg-white border-3 border-blue-400 rounded-3xl shadow-2xl p-5 sm:p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {t('header.native_language', appLanguage)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLangModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-semibold mb-4">
              {t('header.select_native_lang', appLanguage)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === appLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      if (onSelectAppLanguage) onSelectAppLanguage(lang.code);
                      setShowLangModal(false);
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="text-xs font-black text-slate-900">{lang.nativeName}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{lang.name}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-800 font-medium">
              💡 <strong>Learn English:</strong> Once your native language is set, select <strong>English Essentials (🇺🇸)</strong> in the course menu to learn English through your mother tongue!
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
