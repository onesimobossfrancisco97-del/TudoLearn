import React, { useState } from 'react';
import { Volume2, Music, Sparkles } from 'lucide-react';
import { Exercise } from '../../types';
import { sound } from '../../utils/audio';

interface PianoNoteExerciseProps {
  exercise: Exercise;
  selectedNote: string | null;
  onSelectNote: (note: string) => void;
  isAnswerSubmitted: boolean;
}

export const PianoNoteExercise: React.FC<PianoNoteExerciseProps> = ({
  exercise,
  selectedNote,
  onSelectNote,
  isAnswerSubmitted,
}) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const whiteKeys = [
    { note: 'C4', label: 'C' },
    { note: 'D4', label: 'D' },
    { note: 'E4', label: 'E' },
    { note: 'F4', label: 'F' },
    { note: 'G4', label: 'G' },
    { note: 'A4', label: 'A' },
    { note: 'B4', label: 'B' },
    { note: 'C5', label: 'C5' },
  ];

  const blackKeys = [
    { note: 'C#4', leftPercent: 12.5 },
    { note: 'D#4', leftPercent: 25.0 },
    // Gap between E and F
    { note: 'F#4', leftPercent: 50.0 },
    { note: 'G#4', leftPercent: 62.5 },
    { note: 'A#4', leftPercent: 75.0 },
  ];

  const handleKeyClick = (note: string) => {
    setActiveKey(note);
    sound.playPianoNote(note);
    onSelectNote(note);
    setTimeout(() => setActiveKey(null), 300);
  };

  const playPromptSound = () => {
    if (exercise.soundNote) {
      sound.playPianoNote(exercise.soundNote);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-pink-100 text-pink-800 rounded-full flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5" />
          Interactive Keyboard & Ear Trainer
        </span>
        <span className="text-xs text-slate-500 font-bold">
          Web Audio Synthesizer
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-4">
        {exercise.question}
      </h2>

      {/* Target Audio Prompt Button */}
      {exercise.soundNote && (
        <button
          type="button"
          onClick={playPromptSound}
          className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-sm rounded-2xl shadow-md border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 transition-all mb-8 cursor-pointer"
        >
          <Volume2 className="w-5 h-5 animate-pulse" />
          <span>Tap to Hear Target Pitch ({exercise.soundNote})</span>
        </button>
      )}

      {/* Selected Note Indicator */}
      <div className="text-center mb-4">
        <span className="text-xs uppercase font-black tracking-wider text-slate-400">Selected Note: </span>
        <span className="text-xl font-black text-pink-600">
          {selectedNote ? selectedNote : 'None yet (tap a key)'}
        </span>
      </div>

      {/* Interactive Piano Keyboard */}
      <div className="relative w-full max-w-md h-44 bg-slate-800 p-2.5 rounded-2xl shadow-xl select-none">
        {/* White Keys */}
        <div className="grid grid-cols-8 h-full gap-1.5">
          {whiteKeys.map((item) => {
            const isSelected = selectedNote === item.note;
            const isPlaying = activeKey === item.note;
            const isCorrect = isAnswerSubmitted && item.note === exercise.correctAnswer;
            const isWrong = isAnswerSubmitted && isSelected && item.note !== exercise.correctAnswer;

            let keyStyle = 'bg-white hover:bg-slate-100 text-slate-700 border-b-6 border-slate-300';
            if (isPlaying || isSelected) {
              keyStyle = 'bg-pink-100 text-pink-700 border-b-2 translate-y-1 ring-2 ring-pink-400 font-black';
            }
            if (isCorrect) {
              keyStyle = 'bg-emerald-200 text-emerald-900 border-b-2 ring-3 ring-emerald-500 font-black';
            } else if (isWrong) {
              keyStyle = 'bg-rose-200 text-rose-900 border-b-2 ring-3 ring-rose-500 line-through';
            }

            return (
              <button
                key={item.note}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => handleKeyClick(item.note)}
                className={`relative h-full rounded-b-xl flex flex-col justify-end items-center pb-2 transition-all cursor-pointer ${keyStyle}`}
              >
                <span className="text-xs font-black">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Black Keys */}
        {blackKeys.map((bk) => {
          return (
            <button
              key={bk.note}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => handleKeyClick(bk.note)}
              style={{ left: `calc(${bk.leftPercent}% - 12px)` }}
              className="absolute top-2.5 w-6 h-24 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 rounded-b-md shadow-md z-10 text-[9px] text-slate-400 flex items-end justify-center pb-1 transition-all active:h-23 cursor-pointer"
            >
              ♯
            </button>
          );
        })}
      </div>

      <p className="text-xs font-bold text-slate-400 mt-4 text-center">
        Tip: Press any piano key to synthesize its acoustic waveform and hear its pitch!
      </p>
    </div>
  );
};
