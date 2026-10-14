import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  Flame,
  Award,
  ChevronRight,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyChallenge, UserProfile } from '../types';
import { getTimeUntilMidnight, getTodayDateKey } from '../data/dailyChallengesData';
import { sound } from '../utils/audio';
import { MascotPip } from './MascotPip';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: DailyChallenge;
  user: UserProfile;
  onCompleteChallenge: (gemsBonus: number, xpBonus: number) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  challenge,
  user,
  onCompleteChallenge,
}) => {
  const todayKey = getTodayDateKey();
  const isAlreadyCompleted = user.lastDailyChallengeDate === todayKey;

  // Countdown state
  const [countdown, setCountdown] = useState(getTimeUntilMidnight().formatted);

  // Puzzle interactive states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [mathAnswer, setMathAnswer] = useState('');
  const [scrambleBank, setScrambleBank] = useState<string[]>([]);
  const [assembledWord, setAssembledWord] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(isAlreadyCompleted);
  const [isCorrect, setIsCorrect] = useState(isAlreadyCompleted);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Initialize scramble letters when challenge changes
  useEffect(() => {
    if (challenge.puzzleType === 'word_scramble' && challenge.scrambleLetters) {
      // Shuffle letters slightly for fun
      const shuffled = [...challenge.scrambleLetters].sort(() => Math.random() - 0.5);
      setScrambleBank(shuffled);
      setAssembledWord([]);
    }
  }, [challenge]);

  // Keep countdown updated every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync completion status if user already completed it
  useEffect(() => {
    if (user.lastDailyChallengeDate === todayKey) {
      setIsAnswerSubmitted(true);
      setIsCorrect(true);
    }
  }, [user.lastDailyChallengeDate, todayKey]);

  if (!isOpen) return null;

  // Audio preview helper
  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    try {
      if (challenge.instrumentType === 'guitar') {
        sound.playGuitarChord('G');
      } else if (challenge.instrumentType === 'piano' && challenge.soundNote) {
        sound.playPianoNote(challenge.soundNote);
      } else if (challenge.instrumentType === 'drums') {
        sound.playDrum('kick');
        setTimeout(() => sound.playDrum('snare'), 250);
        setTimeout(() => sound.playDrum('hihat'), 500);
      } else if (challenge.soundNote) {
        sound.playPianoNote(challenge.soundNote);
      } else {
        sound.playLevelUp();
      }
    } catch {
      // Audio fallback
    }
    setTimeout(() => setIsPlayingAudio(false), 800);
  };

  // Letter bank clicks for scramble
  const handleSelectScrambleLetter = (letter: string, index: number) => {
    sound.playClick();
    setErrorMessage(null);
    setAssembledWord((prev) => [...prev, letter]);
    setScrambleBank((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveAssembledLetter = (letter: string, index: number) => {
    sound.playClick();
    setErrorMessage(null);
    setAssembledWord((prev) => prev.filter((_, i) => i !== index));
    setScrambleBank((prev) => [...prev, letter]);
  };

  const handleResetScramble = () => {
    sound.playClick();
    setErrorMessage(null);
    if (challenge.scrambleLetters) {
      setScrambleBank([...challenge.scrambleLetters]);
      setAssembledWord([]);
    }
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    let userAnswer = '';

    if (challenge.puzzleType === 'multiple_choice') {
      if (!selectedOption) return;
      userAnswer = selectedOption.trim();
    } else if (challenge.puzzleType === 'word_scramble') {
      userAnswer = assembledWord.join('').trim().toUpperCase();
      if (!userAnswer) return;
    } else if (challenge.puzzleType === 'math_input') {
      userAnswer = mathAnswer.trim();
      if (!userAnswer) return;
    }

    const correct =
      userAnswer.toLowerCase().replace(/\s+/g, '') ===
      challenge.correctAnswer.toLowerCase().replace(/\s+/g, '');

    if (correct) {
      sound.playLevelUp();
      setIsCorrect(true);
      setIsAnswerSubmitted(true);
      setErrorMessage(null);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.3 },
        colors: ['#2563EB', '#38BDF8', '#F59E0B', '#10B981', '#EC4899'],
      });

      // Call parent completion to add gems & update user state
      onCompleteChallenge(challenge.gemsReward, challenge.xpReward);
    } else {
      sound.playWrong();
      setIsCorrect(false);
      setErrorMessage(
        'Not quite! Give it another try or check the hint below for a helpful tip.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Top Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 p-5 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-28 h-28 bg-indigo-400/20 rounded-full blur-lg pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white/90 hover:text-white transition-all cursor-pointer z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Metadata */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Daily Challenge
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 text-xs font-bold text-amber-100">
              {challenge.categoryEmoji} {challenge.categoryLabel}
            </span>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950">
              {challenge.difficulty}
            </span>
          </div>

          <h2 className="relative z-10 text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {challenge.title}
          </h2>

          {/* Time & Bounty Bar */}
          <div className="relative z-10 mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5 text-amber-100">
              <Clock className="w-4 h-4 text-amber-200" />
              <span>Resets in: <strong className="text-white font-mono">{countdown}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-amber-400/30 text-yellow-100 px-2.5 py-1 rounded-xl flex items-center gap-1 font-black">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                +{challenge.gemsReward} Gems
              </span>
              <span className="bg-white/20 text-white px-2 py-1 rounded-xl font-black">
                +{challenge.xpReward} XP
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Question / Context Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            {challenge.context && (
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-2 italic">
                {challenge.context}
              </p>
            )}
            <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
              {challenge.question}
            </h3>

            {/* Audio Button if musical challenge */}
            {challenge.soundNote && (
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  disabled={isPlayingAudio}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 cursor-pointer transition-all active:scale-95"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-indigo-600' : ''}`} />
                  <span>{isPlayingAudio ? 'Playing pitch...' : 'Play Audio Sample'}</span>
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  {challenge.instrumentType ? `${challenge.instrumentType.toUpperCase()} tuning reference` : 'Ear reference pitch'}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Answer Input based on puzzleType */}
          {!isAnswerSubmitted && (
            <div>
              {/* Type 1: Multiple Choice */}
              {challenge.puzzleType === 'multiple_choice' && challenge.options && (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Select the correct answer:
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {challenge.options.map((option, idx) => {
                      const isSelected = selectedOption === option;
                      const letters = ['A', 'B', 'C', 'D', 'E'];
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setSelectedOption(option);
                            setErrorMessage(null);
                          }}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-2xl font-bold text-sm sm:text-base border-2 transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-md ring-2 ring-blue-300/40'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {letters[idx]}
                            </span>
                            <span>{option}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Type 2: Word Scramble / Anagram */}
              {challenge.puzzleType === 'word_scramble' && (
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Tap letters to assemble the word:
                  </div>

                  {/* Assembled Word Slot */}
                  <div className="min-h-14 p-2 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center gap-1.5 flex-wrap">
                    {assembledWord.length === 0 ? (
                      <span className="text-xs text-slate-400 font-bold italic">
                        Select letters from the tile bank below
                      </span>
                    ) : (
                      assembledWord.map((letter, idx) => (
                        <button
                          key={`${letter}-${idx}`}
                          type="button"
                          onClick={() => handleRemoveAssembledLetter(letter, idx)}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 hover:bg-rose-500 text-white font-black text-lg flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                          title="Click to remove"
                        >
                          {letter}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Letter Bank */}
                  <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                    {scrambleBank.map((letter, idx) => (
                      <button
                        key={`bank-${letter}-${idx}`}
                        type="button"
                        onClick={() => handleSelectScrambleLetter(letter, idx)}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-800 font-black text-lg flex items-center justify-center shadow-sm cursor-pointer transition-all active:scale-90"
                      >
                        {letter}
                      </button>
                    ))}
                  </div>

                  {/* Reset button */}
                  {assembledWord.length > 0 && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleResetScramble}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset tiles</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Type 3: Math / Numeric Input */}
              {challenge.puzzleType === 'math_input' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Enter the calculated numeric result:
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={mathAnswer}
                      onChange={(e) => {
                        setMathAnswer(e.target.value);
                        setErrorMessage(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && mathAnswer.trim()) {
                          handleCheckAnswer();
                        }
                      }}
                      placeholder="e.g. 12"
                      className="flex-1 text-2xl font-black px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none text-center bg-white"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Error feedback */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-700 text-xs font-bold animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Hint Accordion */}
              <div className="pt-2">
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setShowHint(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-all cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Need a hint? (Free)</span>
                  </button>
                ) : (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-medium">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      Clue:
                    </div>
                    {challenge.hint}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Correct / Completed Celebration Card */}
          {isAnswerSubmitted && isCorrect && (
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 rounded-3xl p-5 space-y-4 animate-scale-up">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-emerald-950">
                    Challenge Completed! 🌟
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold">
                    You earned <strong className="font-black text-amber-600">+{challenge.gemsReward} Gems</strong> and <strong className="font-black text-blue-600">+{challenge.xpReward} XP</strong>!
                  </p>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-white/80 rounded-2xl p-4 border border-emerald-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <div className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Why this is correct:
                </div>
                {challenge.explanation}
              </div>

              {/* Streak bonus info */}
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>Daily Challenge Streak: {user.dailyChallengeStreak || 1} Days</span>
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Next challenge in {countdown}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={
                  (challenge.puzzleType === 'multiple_choice' && !selectedOption) ||
                  (challenge.puzzleType === 'word_scramble' && assembledWord.length === 0) ||
                  (challenge.puzzleType === 'math_input' && !mathAnswer.trim())
                }
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl border-b-3 border-amber-700 active:border-b-0 active:translate-y-0.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Submit Answer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl border-b-3 border-emerald-800 active:border-b-0 active:translate-y-0.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Awesome! Done</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
