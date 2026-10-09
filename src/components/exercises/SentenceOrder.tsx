import React from 'react';
import { Exercise } from '../../types';
import { sound } from '../../utils/audio';

interface SentenceOrderProps {
  exercise: Exercise;
  selectedWords: string[];
  onChangeWords: (words: string[]) => void;
  isAnswerSubmitted: boolean;
}

export const SentenceOrder: React.FC<SentenceOrderProps> = ({
  exercise,
  selectedWords,
  onChangeWords,
  isAnswerSubmitted,
}) => {
  const allWords = exercise.wordBank || [];

  const usedWordIndices: number[] = [];
  selectedWords.forEach((word) => {
    const idx = allWords.findIndex((w, i) => w === word && !usedWordIndices.includes(i));
    if (idx !== -1) usedWordIndices.push(idx);
  });

  const handleAddWord = (word: string) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    onChangeWords([...selectedWords, word]);
  };

  const handleRemoveWord = (indexToRemove: number) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    onChangeWords(selectedWords.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-sky-100 text-sky-800 rounded-full">
          Sentence Builder
        </span>
        <span className="text-xs text-slate-500 font-bold">
          Tap words to construct
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-6">
        {exercise.question}
      </h2>

      {/* Answer Slots Box */}
      <div className="w-full min-h-[90px] p-4 bg-blue-50/40 rounded-2xl border-2 border-dashed border-blue-200 flex flex-wrap gap-2.5 items-center mb-8">
        {selectedWords.length === 0 ? (
          <span className="text-sm font-semibold text-slate-400 italic mx-auto">
            Tap words below to arrange your sentence here...
          </span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => handleRemoveWord(idx)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black text-base shadow-sm border-b-2 border-blue-900 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all cursor-pointer"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Available Word Bank */}
      <div className="flex flex-wrap justify-center gap-2.5 w-full">
        {allWords.map((word, idx) => {
          const isUsed = usedWordIndices.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              disabled={isUsed || isAnswerSubmitted}
              onClick={() => handleAddWord(word)}
              className={`px-4 py-2.5 rounded-xl font-bold text-base transition-all border-2 border-b-4 active:border-b-2 active:translate-y-0.5 ${
                isUsed
                  ? 'bg-slate-200 border-slate-200 text-slate-300 cursor-not-allowed opacity-40'
                  : 'bg-white border-slate-300 hover:border-blue-400 text-slate-800 shadow-sm hover:bg-blue-50/50 cursor-pointer'
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
};
