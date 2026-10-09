import React, { useState } from 'react';
import {
  Star,
  Lock,
  Check,
  Award,
  Gift,
  BookOpen,
} from 'lucide-react';
import { Course, LessonNode } from '../types';
import { MascotPip } from './MascotPip';
import { sound } from '../utils/audio';

interface LearningPathProps {
  course: Course;
  completedLessonIds: string[];
  onSelectLesson: (lesson: LessonNode) => void;
  onOpenChest: (gems: number) => void;
  onOpenAiTutor: () => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  course,
  completedLessonIds,
  onSelectLesson,
  onOpenChest,
  onOpenAiTutor,
}) => {
  const [selectedNode, setSelectedNode] = useState<LessonNode | null>(null);
  const [openedChestIds, setOpenedChestIds] = useState<string[]>([]);

  // Serpentine offset pattern for path
  const offsets = [0, -35, -55, -25, 0, 35, 55, 25];

  return (
    <div className="w-full max-w-xl mx-auto pb-24">
      {/* Course Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/10 mb-8 relative overflow-hidden border border-blue-400/20">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{course.flagEmoji || '🎓'}</span>
              <span className="text-xs uppercase font-black bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full tracking-wider border border-white/20">
                TudoLearn • {course.level}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{course.title}</h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 font-semibold line-clamp-2">
              {course.description}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAiTutor();
            }}
            className="shrink-0 flex flex-col items-center p-3 bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-2xl border border-white/30 transition-transform active:scale-95 cursor-pointer shadow-sm"
            title="Ask Pip AI tutor"
          >
            <MascotPip mood="cheer" size="sm" interactive={false} />
            <span className="text-[10px] font-black uppercase mt-1 tracking-wider">Pip Tutor</span>
          </button>
        </div>
      </div>

      {/* Units & Serpentine Path */}
      {course.units.map((unit) => (
        <div key={unit.id} className="mb-12">
          {/* Unit Header Banner with Blue/Indigo/Sky Theme */}
          <div
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-4 sm:p-5 text-white shadow-md mb-8 flex items-center justify-between border border-blue-400/30"
          >
            <div>
              <div className="text-xs uppercase font-black tracking-wider text-blue-200">
                Unit {unit.unitNumber}
              </div>
              <h2 className="text-lg sm:text-xl font-black">{unit.title}</h2>
              <p className="text-xs text-blue-100 font-medium mt-0.5">{unit.description}</p>
            </div>
            <div className="p-2.5 bg-white/20 backdrop-blur-xs rounded-xl border border-white/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>

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
                  {isCurrent && (
                    <div className="absolute -left-36 -top-4 hidden sm:block animate-fade-in">
                      <MascotPip
                        mood="cheer"
                        size="sm"
                        message="Tap here to level up!"
                        interactive={false}
                      />
                    </div>
                  )}

                  {/* Node Button */}
                  <div className="relative">
                    {/* Ring glow for current lesson */}
                    {isCurrent && (
                      <div className="absolute -inset-2.5 rounded-full bg-blue-400 opacity-60 animate-ping pointer-events-none" />
                    )}

                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        sound.playClick();
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
                        isCompleted
                          ? 'bg-amber-400 border-amber-600 text-amber-950 hover:bg-amber-300 shadow-amber-500/20'
                          : isCurrent
                          ? 'bg-gradient-to-b from-blue-500 to-blue-600 border-blue-800 text-white hover:from-blue-400 hover:to-blue-500 shadow-blue-500/30 ring-4 ring-sky-300/60'
                          : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-80'
                      }`}
                    >
                      {isCompleted ? (
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
                  <span className="text-xs font-black text-slate-700 mt-3 text-center max-w-[130px] line-clamp-1">
                    {lesson.title}
                  </span>

                  {/* Popover Callout when clicked */}
                  {selectedNode?.id === lesson.id && (
                    <div className="absolute top-24 z-30 bg-white border-2 border-blue-200 rounded-3xl p-4 shadow-2xl w-64 animate-scale-up">
                      <div className="text-sm font-black text-slate-900 mb-1">
                        {lesson.title}
                      </div>
                      <p className="text-xs text-slate-500 mb-3 font-semibold">
                        {lesson.description}
                      </p>

                      <div className="flex items-center justify-between text-xs font-bold text-blue-700 bg-blue-50 p-2 rounded-xl mb-3 border border-blue-100">
                        <span>Reward:</span>
                        <span>+{lesson.xpReward} XP</span>
                      </div>

                      <button
                        onClick={() => {
                          onSelectLesson(lesson);
                          setSelectedNode(null);
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl border-b-3 border-blue-900 active:border-b-0 active:translate-y-0.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        {isCompleted ? 'PRACTICE (+5 XP)' : 'START LESSON'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
