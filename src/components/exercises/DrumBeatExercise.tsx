import React, { useState, useEffect } from 'react';
import { Volume2, Music, Play, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Exercise } from '../../types';
import { sound } from '../../utils/audio';

interface DrumBeatExerciseProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelectAnswer: (ans: string) => void;
  isAnswerSubmitted: boolean;
}

export const DrumBeatExercise: React.FC<DrumBeatExerciseProps> = ({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  isAnswerSubmitted,
}) => {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const drumPads = [
    { id: 'kick', name: 'Kick Drum', emoji: '🥁', color: 'from-blue-600 to-indigo-700', hotkey: 'K' },
    { id: 'snare', name: 'Snare', emoji: '💥', color: 'from-amber-500 to-orange-600', hotkey: 'S' },
    { id: 'hihat', name: 'Hi-Hat', emoji: '🥢', color: 'from-emerald-500 to-teal-600', hotkey: 'H' },
    { id: 'tom', name: 'Tom', emoji: '🪘', color: 'from-purple-500 to-violet-600', hotkey: 'T' },
    { id: 'crash', name: 'Crash Cymbal', emoji: '✨', color: 'from-rose-500 to-pink-600', hotkey: 'C' },
  ];

  const handleHit = (drumId: 'kick' | 'snare' | 'hihat' | 'tom' | 'crash') => {
    setActivePad(drumId);
    sound.playDrum(drumId);
    setTimeout(() => setActivePad(null), 250);
  };

  // Keyboard hotkeys for live drum performance!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'k') handleHit('kick');
      else if (key === 's') handleHit('snare');
      else if (key === 'h') handleHit('hihat');
      else if (key === 't') handleHit('tom');
      else if (key === 'c') handleHit('crash');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Play target demonstration rhythm
  const playDemonstrationBeat = () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);

    // Standard 4/4 rock beat: 8 eighth notes
    const beatSteps = [
      { step: 1, drums: ['kick', 'hihat'] as const },
      { step: 2, drums: ['hihat'] as const },
      { step: 3, drums: ['snare', 'hihat'] as const },
      { step: 4, drums: ['hihat'] as const },
      { step: 5, drums: ['kick', 'hihat'] as const },
      { step: 6, drums: ['hihat'] as const },
      { step: 7, drums: ['snare', 'hihat'] as const },
      { step: 8, drums: ['hihat'] as const },
    ];

    beatSteps.forEach((s, idx) => {
      setTimeout(() => {
        setCurrentStep(s.step);
        s.drums.forEach((d) => {
          sound.playDrum(d);
          setActivePad(d);
        });
        setTimeout(() => setActivePad(null), 120);

        if (idx === beatSteps.length - 1) {
          setTimeout(() => {
            setIsPlayingSequence(false);
            setCurrentStep(null);
          }, 300);
        }
      }, idx * 250); // 120 BPM eighth notes (250ms each)
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Header Pill */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-purple-100 text-purple-900 rounded-full flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5" />
          🥁 Drum Kit & Rhythm Lab
        </span>
        <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
          Zero-Latency Percussion
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-3">
        {exercise.question}
      </h2>

      {exercise.instruction && (
        <p className="text-xs text-slate-500 font-bold text-center mb-4">
          {exercise.instruction}
        </p>
      )}

      {/* Demo Beat Play Button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={playDemonstrationBeat}
          disabled={isPlayingSequence}
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-md border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer ${
            isPlayingSequence ? 'opacity-80 scale-95' : ''
          }`}
        >
          <Volume2 className={`w-5 h-5 ${isPlayingSequence ? 'animate-spin' : 'animate-pulse'}`} />
          <span>{isPlayingSequence ? 'Playing 120 BPM Groove...' : 'Play 4/4 Drum Beat Demo 🥁'}</span>
        </button>
      </div>

      {/* Step Metronome Lights (8 steps) */}
      <div className="w-full bg-slate-900 p-3 rounded-2xl mb-6 flex items-center justify-between border-2 border-slate-700 shadow-inner">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-2">
          Measure 1:
        </span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
            const isDownbeat = s === 1 || s === 5;
            const isBackbeat = s === 3 || s === 7;
            const isActive = currentStep === s;

            return (
              <div
                key={s}
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 scale-125 shadow-lg shadow-amber-400/50'
                    : isDownbeat
                    ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40'
                    : isBackbeat
                    ? 'bg-orange-900/60 text-orange-300 border border-orange-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {s}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Drum Kit Pads */}
      <div className="w-full grid grid-cols-5 gap-2.5 mb-6">
        {drumPads.map((pad) => {
          const isHit = activePad === pad.id;

          return (
            <button
              key={pad.id}
              type="button"
              onClick={() => handleHit(pad.id as any)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b ${pad.color} text-white shadow-lg border-b-4 border-black/30 active:border-b-0 active:translate-y-1 transition-all cursor-pointer select-none group relative overflow-hidden ${
                isHit ? 'scale-95 brightness-125 ring-4 ring-white' : 'hover:scale-102'
              }`}
            >
              <span className="text-2xl mb-1 filter drop-shadow-sm group-hover:scale-110 transition-transform">
                {pad.emoji}
              </span>
              <span className="text-[11px] font-black leading-tight text-center">
                {pad.name}
              </span>
              <span className="text-[9px] font-bold text-white/70 mt-1 bg-black/20 px-1.5 py-0.2 rounded-sm">
                [{pad.hotkey}]
              </span>
            </button>
          );
        })}
      </div>

      {/* Options if Multiple Choice (e.g. identifying time signatures, beat positions, fills) */}
      {exercise.options && exercise.options.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-3">
          {exercise.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = isAnswerSubmitted && opt === exercise.correctAnswer;
            const isWrong = isAnswerSubmitted && isSelected && opt !== exercise.correctAnswer;

            let btnClass = 'border-2 border-slate-200 bg-white hover:border-purple-400 text-slate-800';
            if (isSelected) {
              btnClass = 'border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-400 font-black shadow-sm';
            }
            if (isAnswerSubmitted) {
              if (isCorrect) {
                btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black ring-2 ring-emerald-400';
              } else if (isWrong) {
                btnClass = 'border-rose-500 bg-rose-50 text-rose-950 font-black';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSelectAnswer(opt);
                }}
                disabled={isAnswerSubmitted}
                className={`p-4 rounded-2xl text-center text-sm sm:text-base font-extrabold transition-all cursor-pointer ${btnClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
