import React, { useState } from 'react';
import { Volume2, Music, Sparkles, Check, Play, Disc } from 'lucide-react';
import { Exercise } from '../../types';
import { sound } from '../../utils/audio';

interface GuitarFretboardExerciseProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onSelectAnswer: (ans: string) => void;
  isAnswerSubmitted: boolean;
}

export const GuitarFretboardExercise: React.FC<GuitarFretboardExerciseProps> = ({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  isAnswerSubmitted,
}) => {
  const [activeString, setActiveString] = useState<number | null>(null);
  const [isStrumming, setIsStrumming] = useState(false);

  const instrument = exercise.instrumentType || 'guitar';
  const isBass = instrument === 'bass';
  const isUkulele = instrument === 'ukulele';

  // Standard tunings
  // Guitar: strings 6 down to 1: E2, A2, D3, G3, B3, E4
  const guitarStrings = [
    { num: 6, name: 'E', label: '6th (Low E)', thickness: 4 },
    { num: 5, name: 'A', label: '5th (A)', thickness: 3.5 },
    { num: 4, name: 'D', label: '4th (D)', thickness: 3 },
    { num: 3, name: 'G', label: '3rd (G)', thickness: 2.2 },
    { num: 2, name: 'B', label: '2nd (B)', thickness: 1.6 },
    { num: 1, name: 'e', label: '1st (High E)', thickness: 1.2 },
  ];

  // Bass: strings 4 down to 1: E1, A1, D2, G2
  const bassStrings = [
    { num: 4, name: 'E', label: '4th (Low E)', thickness: 5 },
    { num: 3, name: 'A', label: '3rd (A)', thickness: 4 },
    { num: 2, name: 'D', label: '2nd (D)', thickness: 3 },
    { num: 1, name: 'G', label: '1st (G)', thickness: 2.2 },
  ];

  // Ukulele: strings 4 down to 1: G4, C4, E4, A4
  const ukuleleStrings = [
    { num: 4, name: 'G', label: '4th (G)', thickness: 2 },
    { num: 3, name: 'C', label: '3rd (C)', thickness: 3 },
    { num: 2, name: 'E', label: '2nd (E)', thickness: 2.2 },
    { num: 1, name: 'A', label: '1st (A)', thickness: 1.5 },
  ];

  const currentStrings = isBass ? bassStrings : isUkulele ? ukuleleStrings : guitarStrings;
  const numFrets = 5; // Open (0) + Frets 1 to 4

  const handlePluck = (stringNum: number, fret = 0) => {
    setActiveString(stringNum);
    if (isBass) {
      sound.playBassNote(stringNum, fret);
    } else if (isUkulele) {
      sound.playUkulelePluck(stringNum, fret);
    } else {
      sound.playGuitarPluck(stringNum, fret);
    }
    setTimeout(() => setActiveString(null), 350);
  };

  const handleStrum = () => {
    setIsStrumming(true);
    const chord = exercise.guitarChordName || exercise.correctAnswer;
    if (isUkulele) {
      sound.playUkuleleChord(chord);
    } else {
      sound.playGuitarChord(chord);
    }
    setTimeout(() => setIsStrumming(false), 600);
  };

  // If question is a fretboard position click question (e.g. "String 6 Fret 3")
  const handleFretClick = (stringNum: number, fret: number) => {
    handlePluck(stringNum, fret);
    const answerKey = `s${stringNum}-f${fret}`;
    onSelectAnswer(answerKey);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Header Pill */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-amber-100 text-amber-900 rounded-full flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5" />
          {isBass ? '🎸 Bass Fretboard Studio' : isUkulele ? '🪕 Ukulele Chord Studio' : '🎸 Guitar Fretboard & Chord Lab'}
        </span>
        <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
          Acoustic Synthesizer
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

      {/* Chord Strum / Demo Audio Button if chord exercise */}
      {(exercise.guitarChordName || exercise.guitarFrets) && (
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={handleStrum}
            disabled={isStrumming}
            className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-md border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer ${
              isStrumming ? 'opacity-80 scale-95' : ''
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isStrumming ? 'animate-bounce' : 'animate-pulse'}`} />
            <span>Strum {exercise.guitarChordName || 'Chord'} 🎸</span>
          </button>
        </div>
      )}

      {/* Interactive Fretboard Visualizer */}
      <div className="w-full bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 p-4 rounded-3xl shadow-2xl border-4 border-amber-900/60 mb-6 select-none relative overflow-hidden">
        {/* Wood Grain Accent overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Fret Number Markers */}
        <div className="grid grid-cols-6 text-center text-[11px] font-black text-amber-200/70 mb-2 border-b border-amber-700/40 pb-1">
          <div className="text-amber-400">Open (0)</div>
          <div>Fret 1</div>
          <div>Fret 2</div>
          <div className="text-amber-300">Fret 3 •</div>
          <div>Fret 4</div>
          <div className="text-amber-300">Fret 5 •</div>
        </div>

        {/* Fretboard Grid */}
        <div className="space-y-3.5 relative py-2">
          {currentStrings.map((str) => {
            const chordFretInfo = exercise.guitarFrets?.find((f) => f.stringNum === str.num);
            const isMuted = chordFretInfo && chordFretInfo.fret === -1;
            const isFrettedAt = chordFretInfo ? chordFretInfo.fret : null;

            return (
              <div key={str.num} className="flex items-center relative group">
                {/* String Label */}
                <div className="w-12 shrink-0 flex items-center justify-between pr-2 text-xs font-black">
                  <span className="text-amber-300 font-mono">{str.name}</span>
                  <span className="text-[10px] text-amber-400/60">{str.num}</span>
                </div>

                {/* Frets Grid for this string */}
                <div className="flex-1 grid grid-cols-6 gap-1 relative items-center">
                  {/* Metal String Line running across frets */}
                  <div
                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150"
                    style={{
                      height: `${str.thickness}px`,
                      background:
                        activeString === str.num
                          ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)'
                          : 'linear-gradient(90deg, #d1d5db, #9ca3af, #d1d5db)',
                      boxShadow: activeString === str.num ? '0 0 8px #f59e0b' : 'none',
                    }}
                  />

                  {/* Frets 0 to 5 */}
                  {[0, 1, 2, 3, 4, 5].map((fret) => {
                    const isTargetPosition =
                      exercise.targetFretPosition &&
                      exercise.targetFretPosition.stringNum === str.num &&
                      exercise.targetFretPosition.fret === fret;

                    const isDotHere = isFrettedAt === fret;
                    const answerKey = `s${str.num}-f${fret}`;
                    const isSelected = selectedAnswer === answerKey;

                    return (
                      <button
                        key={fret}
                        type="button"
                        onClick={() => handleFretClick(str.num, fret)}
                        className={`relative h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          fret === 0
                            ? 'bg-amber-900/30 border-r-2 border-amber-600/70 hover:bg-amber-700/40'
                            : 'border-r border-stone-500/50 hover:bg-amber-700/30'
                        }`}
                        title={`${str.name} String, Fret ${fret}`}
                      >
                        {/* Fret wire */}
                        {fret > 0 && (
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-stone-400/80 rounded-full" />
                        )}

                        {/* Chord Finger Dot */}
                        {isDotHere && fret > 0 && (
                          <div className="relative z-10 w-6 h-6 rounded-full bg-amber-400 text-stone-900 border-2 border-amber-200 flex items-center justify-center text-xs font-black shadow-lg animate-pulse">
                            {chordFretInfo?.finger || '●'}
                          </div>
                        )}

                        {/* Open String Circle (O) or Mute (X) */}
                        {fret === 0 && isDotHere && (
                          <div className="relative z-10 w-5 h-5 rounded-full border-2 border-amber-300 text-amber-300 flex items-center justify-center text-[10px] font-black">
                            O
                          </div>
                        )}
                        {fret === 0 && isMuted && (
                          <div className="relative z-10 text-rose-400 font-black text-xs">
                            ✕
                          </div>
                        )}

                        {/* Selected Indicator for Click Challenges */}
                        {isSelected && !isDotHere && (
                          <div className="relative z-10 w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-md">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fret Position Markers Inlays (Fret 3 & 5 dots) */}
        <div className="flex justify-around text-center text-stone-500 text-[10px] font-bold pt-2 border-t border-amber-900/40">
          <span className="text-amber-400/80">💡 Tip: Tap any fret to pluck that string and hear the pitch!</span>
        </div>
      </div>

      {/* Options if Multiple Choice style (e.g. Chord identification) */}
      {exercise.options && exercise.options.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-3">
          {exercise.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect = isAnswerSubmitted && opt === exercise.correctAnswer;
            const isWrong = isAnswerSubmitted && isSelected && opt !== exercise.correctAnswer;

            let btnClass = 'border-2 border-slate-200 bg-white hover:border-amber-400 text-slate-800';
            if (isSelected) {
              btnClass = 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-400 font-black shadow-sm';
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
                className={`p-4 rounded-2xl text-center text-base font-extrabold transition-all cursor-pointer ${btnClass}`}
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
