import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  BookOpen,
  Layers,
  Volume2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Lightbulb,
  CheckCircle2,
  Bot,
  PlayCircle,
} from 'lucide-react';
import { LessonNode, Course } from '../types';
import { getLessonStudyGuide, FlashcardItem } from '../utils/lessonGuide';
import { sound, speakSentence } from '../utils/audio';

interface LessonStudyGuideModalProps {
  isOpen: boolean;
  lesson: LessonNode;
  course?: Course;
  onClose: () => void;
  onStartQuiz: () => void;
  onOpenAiTutor?: () => void;
}

export const LessonStudyGuideModal: React.FC<LessonStudyGuideModalProps> = ({
  isOpen,
  lesson,
  course,
  onClose,
  onStartQuiz,
  onOpenAiTutor,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'flashcards'>('guide');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCardIds, setKnownCardIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const studyGuide = getLessonStudyGuide(lesson, course);
  const flashcards = studyGuide.flashcards;
  const currentCard: FlashcardItem | undefined = flashcards[currentCardIndex];

  const handleSpeak = (text: string, lang?: string) => {
    speakSentence(text, lang || 'es-ES');
  };

  const handleNextCard = () => {
    sound.playClick();
    setIsFlipped(false);
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    sound.playClick();
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex(flashcards.length - 1);
    }
  };

  const handleToggleCardKnown = (cardId: string) => {
    sound.playCorrect();
    if (knownCardIds.includes(cardId)) {
      setKnownCardIds(knownCardIds.filter((id) => id !== cardId));
    } else {
      setKnownCardIds([...knownCardIds, cardId]);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in w-full h-full overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 -z-10"
        onClick={() => {
          sound.playClick();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Main Study Hub Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-blue-300 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Pinned Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 p-4 text-white shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-sky-200">
                Lesson Study Hub • {lesson.subject}
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {lesson.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Learning Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 px-3 pt-2 gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('guide');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-white text-blue-600 border-t-2 border-x-2 border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Guide & Notes</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('flashcards');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-white text-blue-600 border-t-2 border-x-2 border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Interactive Flashcards ({flashcards.length})</span>
          </button>
        </div>

        {/* Content Body: Study Guide */}
        {activeTab === 'guide' && (
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
            {/* Concept Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-4 rounded-2xl border border-blue-100/80">
              <div className="flex items-center gap-2 mb-1.5 text-blue-800 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Concept Overview</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                {studyGuide.overview}
              </p>
            </div>

            {/* Key Ideas & Rules Breakdown */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">
                Key Concepts & Principles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {studyGuide.keyConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border-2 border-slate-200/90 rounded-2xl shadow-2xs hover:border-blue-200 transition-colors"
                  >
                    <div className="text-xs sm:text-sm font-black text-slate-800 mb-1">
                      {concept.title}
                    </div>
                    <p className="text-xs text-slate-600 leading-snug font-medium">
                      {concept.explanation}
                    </p>
                    {concept.example && (
                      <div className="mt-2 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                        {concept.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Vocabulary & Phrases with Audio Speaker */}
            {studyGuide.vocabulary.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Vocabulary & Pronunciation
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">Tap speaker to listen</span>
                </div>
                <div className="space-y-2">
                  {studyGuide.vocabulary.map((vocab, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {vocab.term}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium line-clamp-1">
                          {vocab.definition}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSpeak(vocab.term, vocab.audioLang)}
                        className="p-2 rounded-xl bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 transition-transform active:scale-90 cursor-pointer shrink-0 shadow-2xs"
                        title="Listen to native speech"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Tips */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black uppercase tracking-wider mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Learning Pro-Tips</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-950 font-medium list-disc list-inside">
                {studyGuide.proTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Content Body: Flashcards Deck */}
        {activeTab === 'flashcards' && currentCard && (
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col justify-between">
            {/* Deck Progress Bar */}
            <div className="flex items-center justify-between text-xs font-black text-slate-500 mb-3">
              <span>
                Card {currentCardIndex + 1} of {flashcards.length}
              </span>
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {knownCardIds.length} Mastered
              </span>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => {
                sound.playClick();
                setIsFlipped(!isFlipped);
              }}
              className="relative min-h-[220px] sm:min-h-[260px] w-full bg-gradient-to-br from-white to-blue-50/50 border-3 border-blue-200 rounded-3xl p-6 shadow-lg flex flex-col justify-between cursor-pointer hover:border-blue-300 transition-all select-none my-auto"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                  {currentCard.category}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  Tap to flip
                </span>
              </div>

              {/* Card Face */}
              <div className="my-auto text-center py-4">
                {!isFlipped ? (
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                      {currentCard.front}
                    </div>
                    {currentCard.hint && (
                      <p className="text-xs text-slate-400 mt-2 font-semibold">
                        Hint: {currentCard.hint}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="text-sm uppercase font-bold text-blue-600 mb-1">
                      Meaning / Explanation:
                    </div>
                    <div className="text-base sm:text-xl font-black text-slate-800 leading-relaxed">
                      {currentCard.back}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Audio pronunciation */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                {currentCard.audioPrompt ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentCard.audioPrompt!, currentCard.audioLang);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCardKnown(currentCard.id);
                  }}
                  className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    knownCardIds.includes(currentCard.id)
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{knownCardIds.includes(currentCard.id) ? 'Mastered' : 'Mark Known'}</span>
                </button>
              </div>
            </div>

            {/* Deck Navigation Controls */}
            <div className="flex items-center justify-between gap-3 mt-4">
              <button
                type="button"
                onClick={handlePrevCard}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev Card</span>
              </button>

              <button
                type="button"
                onClick={handleNextCard}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs cursor-pointer"
              >
                <span>Next Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Pinned Bottom Footer Action Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between gap-2">
          {onOpenAiTutor && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenAiTutor();
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-black text-xs cursor-pointer border border-purple-200"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Ask Pip to Explain</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-3 py-2.5 text-xs font-black text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
                onStartQuiz();
              }}
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 border-b-2 border-blue-900 active:border-b-0 active:translate-y-0.5 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>START PRACTICE QUIZ (+15 XP)</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
