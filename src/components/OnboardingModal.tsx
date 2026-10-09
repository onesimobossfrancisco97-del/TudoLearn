import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { MascotPip } from './MascotPip';
import { SubjectType } from '../types';
import { sound } from '../utils/audio';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinishOnboarding: (selectedSubject: SubjectType, dailyMinutes: number) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onFinishOnboarding,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('languages');
  const [assessmentAnswer, setAssessmentAnswer] = useState<string | null>(null);
  const [dailyMinutes, setDailyMinutes] = useState<number>(15);

  if (!isOpen) return null;

  const handleNext = () => {
    sound.playClick();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      sound.playLevelUp();
      onFinishOnboarding(selectedSubject, dailyMinutes);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-blue-400 overflow-hidden flex flex-col p-6 sm:p-8 relative animate-scale-up">
        {/* Pip Mascot at the top */}
        <div className="flex flex-col items-center text-center mb-6">
          <MascotPip
            mood={step === 3 ? 'celebrate' : 'cheer'}
            size="md"
            interactive={false}
          />
          <h1 className="text-2xl font-black text-slate-900 mt-3">
            {step === 1 && 'Welcome to TudoLearn!'}
            {step === 2 && 'Skill Diagnostic Check'}
            {step === 3 && 'Set Your Daily Target'}
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-1">
            {step === 1 && 'Which subject would you love to conquer first?'}
            {step === 2 && 'Help us adapt interactive lessons to your current skill level.'}
            {step === 3 && 'Daily consistency of just 15 minutes creates permanent mastery.'}
          </p>
        </div>

        {/* Step 1: Subject Selection */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { id: 'languages', title: '🇪🇸 Languages', desc: 'Spanish conversational' },
              { id: 'mathematics', title: '📐 Mathematics', desc: 'Rapid mental arithmetic' },
              { id: 'music', title: '🎵 Music', desc: 'Piano keys & ear training' },
              { id: 'science', title: '🔬 Science', desc: 'Physics & cosmic forces' },
              { id: 'coding', title: '💻 Coding', desc: 'Algorithms & logic' },
              { id: 'psychology', title: '🧠 Psychology', desc: 'Habit loops & memory' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedSubject(sub.id as SubjectType);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  selectedSubject === sub.id
                    ? 'border-blue-500 bg-blue-50 text-blue-950 ring-2 ring-blue-400 font-black'
                    : 'border-slate-200 hover:border-blue-300 bg-white text-slate-700'
                }`}
              >
                <div className="text-sm font-black">{sub.title}</div>
                <div className="text-[11px] text-slate-400 font-bold mt-0.5">{sub.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Skill Diagnostic Assessment */}
        {step === 2 && (
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] uppercase font-black text-blue-500">Diagnostic Question</span>
              <p className="text-base font-black text-slate-800 mt-1">
                {selectedSubject === 'languages' && 'How would you say "Good morning" in Spanish?'}
                {selectedSubject === 'mathematics' && 'What is 15% of 80?'}
                {selectedSubject === 'music' && 'Which white key sits left of the two black keys?'}
                {selectedSubject === 'science' && 'What is the standard unit of force in physics?'}
                {selectedSubject === 'coding' && 'Which keyword declares a constant in modern JavaScript?'}
                {selectedSubject === 'psychology' && 'What is the first phase of the Habit Loop?'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                'I am brand new to this (Start from ground zero)',
                'I know a few basic words / concepts (Elementary)',
                'I have studied before and want a challenge (Intermediate)',
              ].map((ans, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAssessmentAnswer(ans);
                  }}
                  className={`p-3 rounded-xl border-2 text-left text-xs font-black transition-all cursor-pointer ${
                    assessmentAnswer === ans
                      ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-400'
                      : 'border-slate-200 hover:border-blue-300 bg-white text-slate-700'
                  }`}
                >
                  {ans}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Daily Commitment */}
        {step === 3 && (
          <div className="space-y-3 mb-6">
            {[
              { mins: 5, label: 'Casual', desc: '5 mins / day (Low friction)' },
              { mins: 15, label: 'Regular (Recommended)', desc: '15 mins / day (Optimal retention)' },
              { mins: 20, label: 'Serious', desc: '20 mins / day (Fast-track mastery)' },
            ].map((goal) => (
              <button
                key={goal.mins}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setDailyMinutes(goal.mins);
                }}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                  dailyMinutes === goal.mins
                    ? 'border-blue-500 bg-blue-50 text-blue-950 ring-2 ring-blue-400 font-black'
                    : 'border-slate-200 hover:border-blue-300 bg-white text-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-black">{goal.label}</div>
                  <div className="text-xs text-slate-400 font-bold">{goal.desc}</div>
                </div>
                {dailyMinutes === goal.mins && (
                  <Check className="w-5 h-5 text-blue-600 stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Navigation Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base uppercase tracking-wider rounded-2xl border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <span>{step === 3 ? 'START MY JOURNEY' : 'CONTINUE'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
