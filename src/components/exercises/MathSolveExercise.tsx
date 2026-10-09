import React from 'react';
import { Delete, Sparkles, Lightbulb } from 'lucide-react';
import { Exercise } from '../../types';
import { sound } from '../../utils/audio';

interface MathSolveExerciseProps {
  exercise: Exercise;
  inputValue: string;
  onInputChange: (val: string) => void;
  isAnswerSubmitted: boolean;
  onAskHint?: () => void;
}

export const MathSolveExercise: React.FC<MathSolveExerciseProps> = ({
  exercise,
  inputValue,
  onInputChange,
  isAnswerSubmitted,
  onAskHint,
}) => {
  const keypadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'DEL'];

  const handleKeyPress = (btn: string) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    if (btn === 'DEL') {
      onInputChange(inputValue.slice(0, -1));
    } else {
      if (inputValue.length < 8) {
        onInputChange(inputValue + btn);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          Math Problem Solving
        </span>
        {exercise.hint && !isAnswerSubmitted && (
          <button
            onClick={onAskHint}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Hint
          </button>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-4">
        {exercise.question}
      </h2>

      {/* Math Formula Card */}
      {exercise.mathFormula && (
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl mb-6 shadow-inner text-center">
          <div className="text-2xl sm:text-3xl font-black font-mono text-blue-900 tracking-wider">
            {exercise.mathFormula}
          </div>
        </div>
      )}

      {/* Answer Display Box */}
      <div className="w-full max-w-xs mb-6">
        <div
          className={`h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black font-mono shadow-sm transition-all ${
            isAnswerSubmitted
              ? inputValue === exercise.correctAnswer
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                : 'border-rose-500 bg-rose-50 text-rose-800'
              : 'border-blue-400 bg-white text-slate-800 ring-2 ring-blue-100'
          }`}
        >
          {inputValue ? (
            inputValue
          ) : (
            <span className="text-slate-300 font-normal text-2xl font-sans">Type answer...</span>
          )}
        </div>
      </div>

      {/* Tactile Keypad */}
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
        {keypadButtons.map((btn) => (
          <button
            key={btn}
            type="button"
            disabled={isAnswerSubmitted}
            onClick={() => handleKeyPress(btn)}
            className={`h-13 rounded-xl font-black text-lg border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center cursor-pointer ${
              btn === 'DEL'
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            {btn === 'DEL' ? <Delete className="w-5 h-5" /> : btn}
          </button>
        ))}
      </div>
    </div>
  );
};
