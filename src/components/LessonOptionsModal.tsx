import React from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  BookOpen,
  Layers,
  Sparkles,
  Play,
  Bot,
  Award,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { LessonNode, Course } from '../types';
import { sound } from '../utils/audio';

interface LessonOptionsModalProps {
  isOpen: boolean;
  lesson: LessonNode | null;
  course: Course;
  isCompleted: boolean;
  onClose: () => void;
  onOpenStudyGuide: () => void;
  onOpenFlashcards: () => void;
  onStartQuiz: () => void;
  onOpenAiTutor: () => void;
}

export const LessonOptionsModal: React.FC<LessonOptionsModalProps> = ({
  isOpen,
  lesson,
  course,
  isCompleted,
  onClose,
  onOpenStudyGuide,
  onOpenFlashcards,
  onStartQuiz,
  onOpenAiTutor,
}) => {
  if (!isOpen || !lesson) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in w-full h-full overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 -z-10 cursor-pointer"
        onClick={() => {
          sound.playClick();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Hub Dialog Bubble */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border-2 border-blue-300 overflow-hidden flex flex-col max-h-[88vh] animate-scale-up">
        {/* Header with Course Badge & Lesson Title */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 p-4 text-white shrink-0 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-xs shrink-0">
              {course.flagEmoji || '📘'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider text-sky-200">
                  {course.title}
                </span>
                {isCompleted && (
                  <span className="bg-emerald-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5" /> Completed
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight line-clamp-1">
                {lesson.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 cursor-pointer shadow-xs border border-white/20 shrink-0"
            title="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body: Learning Options */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5">
          {/* Lesson Brief */}
          <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-700 font-semibold line-clamp-2">
              {lesson.description || 'Learn and practice the fundamentals of this topic.'}
            </p>
            <div className="flex items-center gap-1 text-xs font-black text-blue-700 shrink-0 bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>+{lesson.xpReward} XP</span>
            </div>
          </div>

          <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
            Choose How You Want to Learn
          </div>

          {/* Option 1: Study Guide & Concepts (Learn First) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenStudyGuide();
            }}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/50 text-left transition-all active:scale-98 cursor-pointer shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  Study Guide & Concepts
                </span>
                <span className="text-[9px] bg-blue-100 text-blue-700 font-extrabold px-1.5 py-0.2 rounded-md">
                  Recommended
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                Read topic notes, key rules, definitions & audio pronunciation
              </p>
            </div>
          </button>

          {/* Option 2: Interactive Flashcards (Memorize) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenFlashcards();
            }}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/50 text-left transition-all active:scale-98 cursor-pointer shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-black text-slate-900">
                Interactive Flashcards
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                Flip memory cards to reinforce key terms and formulas
              </p>
            </div>
          </button>

          {/* Option 3: Interactive Practice Quiz */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onStartQuiz();
            }}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-left transition-all active:scale-98 cursor-pointer shadow-md shadow-blue-500/25 group"
          >
            <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 fill-white stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black">
                  {isCompleted ? 'Practice & Review Quiz' : 'Take Lesson Quiz'}
                </span>
                <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-md">
                  +{lesson.xpReward} XP
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium mt-0.5 line-clamp-1">
                {lesson.exercises?.length || 5} interactive exercises • Earn crowns & streak
              </p>
            </div>
          </button>

          {/* Option 4: Ask Pip AI Tutor */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenAiTutor();
            }}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-black text-xs transition-colors cursor-pointer border border-purple-200"
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>Have Pip AI Explain This Topic</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated time: ~3-5 mins</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-xs font-black text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
