import React, { useState } from 'react';
import {
  Star,
  Lock,
  Check,
  Award,
  Gift,
  BookOpen,
  Layers,
  Map as MapIcon,
  Sparkles,
  ChevronRight,
  Play,
  Crown,
  Zap,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Course, LessonNode, DailyChallenge, UserProfile } from '../types';
import { MascotPip } from './MascotPip';
import { sound } from '../utils/audio';
import { DailyChallengeCard } from './DailyChallengeCard';
import { LessonOptionsModal } from './LessonOptionsModal';
import { LessonStudyGuideModal } from './LessonStudyGuideModal';
import { getLessonStudyGuide } from '../utils/lessonGuide';
import { isLevelSuperExclusive, getLevelCertificateInfo } from '../utils/courseCurriculum';
import { AppLanguage, t } from '../utils/i18n';

interface LearningPathProps {
  course: Course;
  completedLessonIds: string[];
  onSelectLesson: (lesson: LessonNode) => void;
  onOpenChest: (gems: number) => void;
  onOpenAiTutor: () => void;
  dailyChallenge?: DailyChallenge;
  user?: UserProfile;
  onOpenDailyChallenge?: () => void;
  onOpenSuperModal?: () => void;
  onOpenCertificate?: (course: Course, level: number) => void;
  appLanguage?: AppLanguage;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  course,
  completedLessonIds,
  onSelectLesson,
  onOpenChest,
  onOpenAiTutor,
  dailyChallenge,
  user,
  onOpenDailyChallenge,
  onOpenSuperModal,
  onOpenCertificate,
  appLanguage = 'en',
}) => {
  const [courseLearningMode, setCourseLearningMode] = useState<'path' | 'study_guide' | 'flashcards'>('path');
  const [selectedNode, setSelectedNode] = useState<LessonNode | null>(null);
  const [activeStudyGuideLesson, setActiveStudyGuideLesson] = useState<LessonNode | null>(null);
  const [openedChestIds, setOpenedChestIds] = useState<string[]>([]);
  const [superGateLevel, setSuperGateLevel] = useState<number | null>(null);

  const isUserSuper = Boolean(user?.isSuper);

  // Serpentine offset pattern for path (calibrated for mobile screens)
  const offsets = [0, -24, -38, -18, 0, 18, 38, 24];

  // Flat list of all lessons in this course
  const allLessons = course.units.flatMap((u) => u.lessons);

  return (
    <div className="w-full max-w-xl mx-auto pb-24 overflow-x-hidden px-1 sm:px-0">
      {/* Course Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-500/10 mb-4 relative overflow-hidden border border-blue-400/20">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-2xl">{course.flagEmoji || '🎓'}</span>
              <span className="text-xs uppercase font-black bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full tracking-wider border border-white/20">
                TudoLearn • 10 {t('path.level', appLanguage)}s
              </span>
              {isUserSuper ? (
                <span className="text-[10px] font-black uppercase bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Crown className="w-3 h-3 fill-amber-950" />
                  <span>Super Unlocked</span>
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase bg-blue-900/60 text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  Levels 1-2 Free
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">{course.title}</h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 font-semibold line-clamp-2">
              {course.description}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAiTutor();
            }}
            className="shrink-0 flex flex-col items-center p-2.5 sm:p-3 bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-2xl border border-white/30 transition-transform active:scale-95 cursor-pointer shadow-sm"
            title={t('path.ask_pip', appLanguage)}
          >
            <MascotPip mood="cheer" size="sm" interactive={false} />
            <span className="text-[10px] font-black uppercase mt-1 tracking-wider">{t('path.pip_tutor', appLanguage)}</span>
          </button>
        </div>
      </div>

      {/* Course Learning Options Switcher: Distinct options, not just quizzes */}
      <div className="flex items-center justify-between bg-white border-2 border-blue-100 rounded-2xl p-1.5 mb-6 shadow-2xs gap-1">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setCourseLearningMode('path');
          }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            courseLearningMode === 'path'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/50'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span className="truncate">{t('path.learning_path', appLanguage)}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setCourseLearningMode('study_guide');
          }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            courseLearningMode === 'study_guide'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="truncate">{t('path.study_guides', appLanguage)}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setCourseLearningMode('flashcards');
          }}
          className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            courseLearningMode === 'flashcards'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="truncate">{t('path.flashcards', appLanguage)}</span>
        </button>
      </div>

      {/* Daily Challenge Feature on Dashboard */}
      {dailyChallenge && user && onOpenDailyChallenge && (
        <div className="mb-6 animate-fade-in">
          <DailyChallengeCard
            challenge={dailyChallenge}
            user={user}
            onOpenModal={onOpenDailyChallenge}
          />
        </div>
      )}

      {/* MODE 1: Interactive Learning Map Path with 10 Levels */}
      {courseLearningMode === 'path' && (
        <div className="space-y-10 animate-fade-in">
          {course.units.map((unit) => {
            const isSuperExclusive = isLevelSuperExclusive(unit.unitNumber);
            const isLockedBySuper = isSuperExclusive && !isUserSuper;
            const certInfo = getLevelCertificateInfo(unit.unitNumber, course.title);

            // Check if checkpoint lesson of this unit is completed
            const checkpointLesson = unit.lessons.find((l) => l.type === 'checkpoint') || unit.lessons[unit.lessons.length - 1];
            const isUnitCompleted = checkpointLesson ? completedLessonIds.includes(checkpointLesson.id) : false;

            return (
              <div key={unit.id} className="mb-10 relative">
                {/* Unit Header Banner */}
                <div
                  className={`w-full rounded-2xl p-4 sm:p-5 text-white shadow-md mb-6 flex items-center justify-between border ${
                    isLockedBySuper
                      ? 'bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 border-indigo-500/30'
                      : unit.unitNumber === 5
                      ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 border-amber-400/40 shadow-amber-500/10'
                      : unit.unitNumber === 10
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 border-emerald-400/40 shadow-emerald-500/10'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 border-blue-400/30'
                  }`}
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase font-black tracking-wider text-blue-200">
                        {t('path.level', appLanguage)} {unit.unitNumber}
                      </span>
                      {isLockedBySuper ? (
                        <span className="text-[10px] font-black uppercase bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Super TudoLearn</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-sky-200 bg-white/10 px-2 py-0.5 rounded-full">
                          {unit.unitNumber <= 2 ? t('levels.free_badge', appLanguage) : 'Unlocked ★'}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-black">{unit.title}</h2>
                    <p className="text-xs text-blue-100 font-medium mt-0.5">{unit.description}</p>
                  </div>

                  <div className="p-2.5 bg-white/15 backdrop-blur-xs rounded-xl border border-white/20 shrink-0">
                    {isLockedBySuper ? (
                      <Crown className="w-5 h-5 text-amber-300" />
                    ) : certInfo ? (
                      <Award className="w-5 h-5 text-amber-300 animate-pulse" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>

                {/* Milestone Certificate Card for Level 5 and Level 10 */}
                {certInfo && (
                  <div
                    className={`mb-6 p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                      isUnitCompleted
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-sm'
                        : 'bg-white border-indigo-100 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          isUnitCompleted
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-md shadow-amber-500/20'
                            : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        }`}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                            {certInfo.badge}
                          </span>
                          {isUnitCompleted && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                              <span>Earned</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                          {certInfo.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {certInfo.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex items-center gap-2">
                      {isUnitCompleted && onOpenCertificate ? (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playLevelUp();
                            onOpenCertificate(course, unit.unitNumber);
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Award className="w-4 h-4 fill-slate-950" />
                          <span>{t('levels.view_certificate', appLanguage)}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 italic text-center sm:text-right">
                          {unit.unitNumber === 5
                            ? t('levels.certificate_level5_award', appLanguage)
                            : t('levels.certificate_level10_award', appLanguage)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Nodes Path */}
                <div className="flex flex-col items-center gap-7 relative">
                  {unit.lessons.map((lesson, idx) => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isPrevCompleted = idx === 0 || completedLessonIds.includes(unit.lessons[idx - 1].id);
                    const isLocked = !isCompleted && !isPrevCompleted;
                    const isCurrent = !isCompleted && isPrevCompleted;

                    const horizontalOffset = offsets[idx % offsets.length];

                    return (
                      <div
                        key={lesson.id}
                        className="relative flex flex-col items-center"
                        style={{ transform: `translateX(${horizontalOffset}px)` }}
                      >
                        {/* Floating mascot encouragement near the current active lesson */}
                        {isCurrent && !isLockedBySuper && (
                          <div className="absolute -left-36 -top-4 hidden sm:block animate-fade-in">
                            <MascotPip
                              mood="cheer"
                              size="sm"
                              message="Tap to open learning options!"
                              interactive={false}
                            />
                          </div>
                        )}

                        {/* Node Button */}
                        <div className="relative">
                          {/* Ring glow for current lesson */}
                          {isCurrent && !isLockedBySuper && (
                            <div className="absolute -inset-2.5 rounded-full bg-blue-400 opacity-60 animate-ping pointer-events-none" />
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              if (isLockedBySuper) {
                                setSuperGateLevel(unit.unitNumber);
                                return;
                              }
                              if (lesson.type === 'chest') {
                                if (!openedChestIds.includes(lesson.id)) {
                                  setOpenedChestIds([...openedChestIds, lesson.id]);
                                  onOpenChest(25);
                                }
                              } else {
                                setSelectedNode(lesson);
                              }
                            }}
                            className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 border-b-6 active:border-b-2 active:translate-y-1 shadow-lg cursor-pointer ${
                              isLockedBySuper
                                ? 'bg-gradient-to-b from-indigo-900 to-slate-900 border-indigo-950 text-indigo-300 hover:border-amber-500 shadow-indigo-950/40'
                                : isCompleted
                                ? 'bg-amber-400 border-amber-600 text-amber-950 hover:bg-amber-300 shadow-amber-500/20'
                                : isCurrent
                                ? 'bg-gradient-to-b from-blue-500 to-blue-600 border-blue-800 text-white hover:from-blue-400 hover:to-blue-500 shadow-blue-500/30 ring-4 ring-sky-300/60'
                                : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-80'
                            }`}
                          >
                            {isLockedBySuper ? (
                              <div className="flex flex-col items-center">
                                <Lock className="w-7 h-7 text-amber-400" />
                                <span className="text-[9px] font-black uppercase text-amber-300 tracking-wider">Super</span>
                              </div>
                            ) : isCompleted ? (
                              <Check className="w-9 h-9 stroke-[3]" />
                            ) : isLocked ? (
                              <Lock className="w-8 h-8" />
                            ) : lesson.type === 'checkpoint' ? (
                              <Award className="w-9 h-9 text-white animate-pulse" />
                            ) : lesson.type === 'chest' ? (
                              <Gift className="w-9 h-9 text-white animate-bounce" />
                            ) : (
                              <Star className="w-9 h-9 fill-white text-white" />
                            )}
                          </button>

                          {/* Crowns / Stars under node */}
                          <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 z-20 flex gap-0.5 bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
                            {[0, 1, 2].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  isCompleted ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Node Title Label */}
                        <span className="text-xs font-black text-slate-700 mt-3 text-center max-w-[140px] line-clamp-1">
                          {lesson.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: Course Study Guides & Syllabus Notes */}
      {courseLearningMode === 'study_guide' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
            <h3 className="text-sm font-black text-blue-900">
              📖 {course.title} — 10 Levels Syllabus & Study Notes
            </h3>
            <p className="text-xs text-blue-700 mt-0.5">
              Read comprehensive pedagogical study notes, concepts, and vocabulary for each level.
            </p>
          </div>

          <div className="space-y-3">
            {allLessons.map((l, index) => {
              const guide = getLessonStudyGuide(l, course);
              const isComp = completedLessonIds.includes(l.id);

              return (
                <div
                  key={l.id}
                  className="bg-white border-2 border-slate-200 hover:border-blue-300 rounded-2xl p-4 shadow-2xs transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                        Lesson {index + 1}
                      </span>
                      {isComp && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-bold text-slate-400">
                      +{l.xpReward} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 mb-1">{l.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {guide.overview}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setActiveStudyGuideLesson(l);
                      }}
                      className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t('path.read_notes', appLanguage)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onSelectLesson(l);
                      }}
                      className="py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Quiz</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: Course Flashcard Decks */}
      {courseLearningMode === 'flashcards' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
            <h3 className="text-sm font-black text-indigo-900">
              🗂️ 10 Levels Flashcard Memory Decks
            </h3>
            <p className="text-xs text-indigo-700 mt-0.5">
              Select any level below to open interactive 3D flashcard decks for rapid memorization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allLessons.map((l) => {
              const guide = getLessonStudyGuide(l, course);
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveStudyGuideLesson(l);
                  }}
                  className="bg-white border-2 border-slate-200 hover:border-indigo-300 rounded-2xl p-4 text-left transition-all active:scale-98 shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {guide.flashcards.length} cards
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-1 line-clamp-1">
                    {l.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {l.description}
                  </p>
                  <div className="mt-3 flex items-center text-xs font-black text-indigo-600 gap-1">
                    <span>{t('path.practice_deck', appLanguage)}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Super TudoLearn Premium Level Gate Modal */}
      {superGateLevel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-amber-400 relative text-center">
            <button
              onClick={() => {
                sound.playClick();
                setSuperGateLevel(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center text-amber-950 shadow-lg shadow-amber-500/30 mb-4 ring-4 ring-amber-200">
              <Crown className="w-8 h-8 fill-amber-950" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Level {superGateLevel} • Super TudoLearn Exclusive
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 mb-2">
              {t('levels.upgrade_prompt_title', appLanguage)}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-6">
              {t('levels.upgrade_prompt_desc', appLanguage)}
            </p>

            <div className="space-y-2.5 text-left mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full access to all 10 Levels in all courses</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Earn verified Level 5 & Level 10 official certificates</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited hearts & mistake review</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Offline study mode & downloads</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setSuperGateLevel(null);
                if (onOpenSuperModal) onOpenSuperModal();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{t('levels.upgrade_button', appLanguage)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Lesson Learning Options Hub Modal (Tapping any node opens this) */}
      <LessonOptionsModal
        isOpen={Boolean(selectedNode)}
        lesson={selectedNode}
        course={course}
        isCompleted={Boolean(selectedNode && completedLessonIds.includes(selectedNode.id))}
        onClose={() => setSelectedNode(null)}
        onOpenStudyGuide={() => {
          if (selectedNode) {
            setActiveStudyGuideLesson(selectedNode);
            setSelectedNode(null);
          }
        }}
        onOpenFlashcards={() => {
          if (selectedNode) {
            setActiveStudyGuideLesson(selectedNode);
            setSelectedNode(null);
          }
        }}
        onStartQuiz={() => {
          if (selectedNode) {
            onSelectLesson(selectedNode);
            setSelectedNode(null);
          }
        }}
        onOpenAiTutor={() => {
          setSelectedNode(null);
          onOpenAiTutor();
        }}
      />

      {/* Full-Screen Lesson Study Guide & Flashcard Deck Modal */}
      {activeStudyGuideLesson && (
        <LessonStudyGuideModal
          isOpen={Boolean(activeStudyGuideLesson)}
          lesson={activeStudyGuideLesson}
          course={course}
          onClose={() => setActiveStudyGuideLesson(null)}
          onStartQuiz={() => {
            const lessonToStart = activeStudyGuideLesson;
            setActiveStudyGuideLesson(null);
            onSelectLesson(lessonToStart);
          }}
          onOpenAiTutor={() => {
            setActiveStudyGuideLesson(null);
            onOpenAiTutor();
          }}
        />
      )}
    </div>
  );
};
