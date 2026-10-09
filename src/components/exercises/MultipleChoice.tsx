import React from 'react';
import { Volume2, Volume1, Lightbulb } from 'lucide-react';
import { Exercise } from '../../types';
import { speakSentence, sound } from '../../utils/audio';

interface MultipleChoiceProps {
  exercise: Exercise;
  selectedOption: string | null;
  onSelect: (option: string) => void;
  isAnswerSubmitted: boolean;
  onAskHint?: () => void;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  exercise,
  selectedOption,
  onSelect,
  isAnswerSubmitted,
  onAskHint,
}) => {
  const options = exercise.options || [];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {exercise.topic}
        </span>
        {exercise.hint && !isAnswerSubmitted && (
          <button
            onClick={onAskHint}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Hint
          </button>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-6">
        {exercise.question}
      </h2>

      {/* Audio player if audioPrompt exists */}
      {exercise.audioPrompt && (
        <div className="flex items-center gap-3 mb-6 bg-blue-50/60 p-3 rounded-2xl border border-blue-200">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              speakSentence(exercise.audioPrompt!, exercise.audioLang || 'es-ES', 1.0);
            }}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
            title="Listen at normal speed"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              speakSentence(exercise.audioPrompt!, exercise.audioLang || 'es-ES', 0.65);
            }}
            className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-sm transition-transform active:scale-95 text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="Listen slowly (turtle speed)"
          >
            <Volume1 className="w-5 h-5" />
            <span>Slow</span>
          </button>
          <span className="text-sm font-bold text-slate-700 italic">
            "{exercise.audioPrompt}"
          </span>
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = isAnswerSubmitted && option === exercise.correctAnswer;
          const isWrong = isAnswerSubmitted && isSelected && option !== exercise.correctAnswer;

          let btnClass = 'border-slate-200 hover:border-blue-300 bg-white text-slate-700 shadow-sm';
          if (isSelected && !isAnswerSubmitted) {
            btnClass = 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-400 font-black';
          } else if (isCorrect) {
            btnClass = 'border-blue-500 bg-blue-100 text-blue-900 ring-2 ring-blue-500 font-black';
          } else if (isWrong) {
            btnClass = 'border-rose-400 bg-rose-50 text-rose-800 ring-2 ring-rose-400 line-through';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => {
                sound.playClick();
                onSelect(option);
              }}
              className={`relative flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all duration-150 border-b-4 active:border-b-2 active:translate-y-0.5 cursor-pointer ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-xs font-black text-blue-600 border border-blue-200">
                  {idx + 1}
                </span>
                <span className="text-base font-extrabold">{option}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
