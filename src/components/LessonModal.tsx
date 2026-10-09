import React, { useState } from 'react';
import {
  X,
  Heart,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Bot,
  Flame,
  Mic,
  MicOff,
  Radio,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonNode, Exercise } from '../types';
import { MultipleChoice } from './exercises/MultipleChoice';
import { SentenceOrder } from './exercises/SentenceOrder';
import { SpeechPractice } from './exercises/SpeechPractice';
import { PianoNoteExercise } from './exercises/PianoNoteExercise';
import { MathSolveExercise } from './exercises/MathSolveExercise';
import { MascotPip } from './MascotPip';
import { AiTutorModal } from './AiTutorModal';
import { sound } from '../utils/audio';

interface LessonModalProps {
  lesson: LessonNode;
  isSuper: boolean;
  hearts: number;
  streak: number;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, earnedXp: number) => void;
  onLoseHeart: () => void;
  onOpenSuperModal: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  isSuper,
  hearts,
  streak,
  onClose,
  onCompleteLesson,
  onLoseHeart,
  onOpenSuperModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [mathInput, setMathInput] = useState('');
  const [selectedFallbackOption, setSelectedFallbackOption] = useState<string | null>(null);

  // Speaking Practice toggle state
  const [speakingPracticeEnabled, setSpeakingPracticeEnabled] = useState(true);
  const [micToastMessage, setMicToastMessage] = useState<string | null>(null);

  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  const exercises = lesson.exercises;
  const currentExercise: Exercise = exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex) / exercises.length) * 100);

  // Toggle speaking practice and verify microphone permission
  const handleToggleSpeakingPractice = async () => {
    sound.playClick();
    if (!speakingPracticeEnabled) {
      // User is enabling Speaking Practice: verify microphone permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
          setSpeakingPracticeEnabled(true);
          setMicToastMessage('🎙️ Microphone connected! Speaking practice enabled.');
          setTimeout(() => setMicToastMessage(null), 3500);
        } catch (err: any) {
          setSpeakingPracticeEnabled(false);
          setMicToastMessage('⚠️ Microphone access is blocked. Allow permission in your browser address bar.');
          setTimeout(() => setMicToastMessage(null), 4500);
        }
      } else {
        setSpeakingPracticeEnabled(true);
        setMicToastMessage('🎙️ Speaking practice active.');
        setTimeout(() => setMicToastMessage(null), 3000);
      }
    } else {
      // User is turning off speaking practice (Quiet Mode)
      setSpeakingPracticeEnabled(false);
      setMicToastMessage('🔇 Quiet Mode active. Speaking exercises converted to tapping.');
      setTimeout(() => setMicToastMessage(null), 3500);
    }
  };

  const hasAnswer = (() => {
    if (!currentExercise) return false;
    switch (currentExercise.type) {
      case 'multiple_choice':
      case 'listen_select':
        return selectedOption !== null;
      case 'sentence_order':
        return selectedWords.length > 0;
      case 'speech_practice':
        if (!speakingPracticeEnabled) {
          return selectedFallbackOption !== null || speechTranscript.trim().length > 0;
        }
        return speechTranscript.trim().length > 0;
      case 'piano_note':
        return selectedNote !== null;
      case 'math_solve':
        return mathInput.trim().length > 0;
      default:
        return false;
    }
  })();

  const handleCheckAnswer = () => {
    if (!hasAnswer || isAnswerSubmitted) return;

    let correct = false;
    const ans = currentExercise.correctAnswer.trim().toLowerCase();

    if (currentExercise.type === 'multiple_choice' || currentExercise.type === 'listen_select') {
      correct = selectedOption?.trim().toLowerCase() === ans;
    } else if (currentExercise.type === 'sentence_order') {
      const sentence = selectedWords.join(' ').toLowerCase();
      correct = sentence === ans || sentence.replace(/[.,]/g, '') === ans.replace(/[.,]/g, '');
    } else if (currentExercise.type === 'speech_practice') {
      if (!speakingPracticeEnabled && selectedFallbackOption) {
        correct = selectedFallbackOption.trim().toLowerCase() === ans;
      } else {
        const spoken = speechTranscript.toLowerCase();
        const target = (currentExercise.targetSpeech || currentExercise.correctAnswer).toLowerCase();
        correct = spoken.includes(target) || target.includes(spoken) || spoken.length > 2;
      }
    } else if (currentExercise.type === 'piano_note') {
      correct = selectedNote === currentExercise.correctAnswer;
    } else if (currentExercise.type === 'math_solve') {
      correct = mathInput.trim() === currentExercise.correctAnswer.trim();
    }

    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      sound.playCorrect();
    } else {
      sound.playWrong();
      setMistakesCount((c) => c + 1);
      if (!isSuper) {
        onLoseHeart();
      }
    }
  };

  const handleContinue = () => {
    sound.playClick();

    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSelectedWords([]);
      setSpeechTranscript('');
      setSelectedNote(null);
      setMathInput('');
      setSelectedFallbackOption(null);
      setIsAnswerSubmitted(false);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
      sound.playLevelUp();
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#38BDF8', '#6366F1', '#F59E0B'],
      });
      onCompleteLesson(lesson.id, lesson.xpReward);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-hidden">
      {/* Top Navigation Bar with Speaking Practice Toggle */}
      <div className="max-w-4xl w-full mx-auto px-4 py-3 flex items-center justify-between gap-3 sm:gap-4 border-b border-blue-100">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="text-slate-400 hover:text-slate-700 p-2 rounded-xl transition-colors cursor-pointer"
          title="Exit lesson"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Electric Blue Progress Bar */}
        <div className="flex-1 bg-blue-100/70 h-4 rounded-full overflow-hidden p-0.5 relative">
          <div
            className="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Speaking Practice Toggle Button for Language Courses */}
        {lesson.subject === 'languages' && (
          <button
            type="button"
            onClick={handleToggleSpeakingPractice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
              speakingPracticeEnabled
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-800 shadow-sm shadow-blue-500/20 active:scale-95'
                : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
            }`}
            title={
              speakingPracticeEnabled
                ? 'Speaking Practice ON (Click to toggle Quiet Mode)'
                : 'Speaking Practice OFF (Click to enable Microphone)'
            }
          >
            {speakingPracticeEnabled ? (
              <Mic className="w-3.5 h-3.5 text-sky-200 animate-pulse" />
            ) : (
              <MicOff className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Speaking</span>
            <span className="text-[10px] uppercase font-black">
              {speakingPracticeEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        )}

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 font-black text-rose-500">
          <Heart className="w-5 h-5 fill-rose-500" />
          <span className="text-sm">
            {isSuper ? '∞' : hearts}
          </span>
        </div>
      </div>

      {/* Floating Microphone Permission Notification Toast */}
      {micToastMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <span>{micToastMessage}</span>
        </div>
      )}

      {/* Main Exercise Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col justify-center max-w-3xl w-full mx-auto">
        {!isFinished ? (
          <div>
            {(currentExercise.type === 'multiple_choice' || currentExercise.type === 'listen_select') && (
              <MultipleChoice
                exercise={currentExercise}
                selectedOption={selectedOption}
                onSelect={setSelectedOption}
                isAnswerSubmitted={isAnswerSubmitted}
                onAskHint={() => setShowAiTutor(true)}
              />
            )}

            {currentExercise.type === 'sentence_order' && (
              <SentenceOrder
                exercise={currentExercise}
                selectedWords={selectedWords}
                onChangeWords={setSelectedWords}
                isAnswerSubmitted={isAnswerSubmitted}
              />
            )}

            {currentExercise.type === 'speech_practice' && (
              <SpeechPractice
                exercise={currentExercise}
                transcript={speechTranscript}
                onTranscriptChange={setSpeechTranscript}
                isAnswerSubmitted={isAnswerSubmitted}
                quietModeFallback={!speakingPracticeEnabled}
                selectedFallbackOption={selectedFallbackOption}
                onSelectFallbackOption={setSelectedFallbackOption}
              />
            )}

            {currentExercise.type === 'piano_note' && (
              <PianoNoteExercise
                exercise={currentExercise}
                selectedNote={selectedNote}
                onSelectNote={setSelectedNote}
                isAnswerSubmitted={isAnswerSubmitted}
              />
            )}

            {currentExercise.type === 'math_solve' && (
              <MathSolveExercise
                exercise={currentExercise}
                inputValue={mathInput}
                onInputChange={setMathInput}
                isAnswerSubmitted={isAnswerSubmitted}
                onAskHint={() => setShowAiTutor(true)}
              />
            )}
          </div>
        ) : (
          /* Lesson Completed Celebration View */
          <div className="flex flex-col items-center text-center animate-fade-in max-w-md mx-auto">
            <MascotPip
              mood="celebrate"
              size="lg"
              interactive={false}
              message="Sensational! You completed this TudoLearn unit!"
            />

            <h1 className="text-3xl font-black text-slate-900 mt-6 mb-2">
              Lesson Complete!
            </h1>
            <p className="text-slate-500 font-bold mb-8">
              You mastered "{lesson.title}" on TudoLearn!
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 w-full mb-8">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-[10px] uppercase font-black text-blue-600">Total XP</span>
                <span className="text-2xl font-black text-blue-700">+{lesson.xpReward}</span>
              </div>
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-[10px] uppercase font-black text-sky-600">Accuracy</span>
                <span className="text-2xl font-black text-sky-700">
                  {Math.round(((exercises.length - mistakesCount) / exercises.length) * 100)}%
                </span>
              </div>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex flex-col items-center">
                <span className="text-[10px] uppercase font-black text-orange-600 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-orange-500" /> Streak
                </span>
                <span className="text-2xl font-black text-orange-700">{streak} Days</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              CONTINUE TO MAP
            </button>
          </div>
        )}
      </div>

      {/* Bottom Feedback Action Drawer */}
      {!isFinished && (
        <div
          className={`border-t-2 p-4 transition-all duration-300 ${
            !isAnswerSubmitted
              ? 'bg-white border-blue-100'
              : isCorrect
              ? 'bg-blue-50 border-blue-300 text-blue-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Feedback Message */}
            {isAnswerSubmitted ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {isCorrect ? (
                  <>
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-blue-900">
                        Awesome job!
                      </div>
                      <div className="text-xs font-bold text-blue-700">
                        {currentExercise.explanation}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-rose-900">
                        Correct Answer: {currentExercise.correctAnswer}
                      </div>
                      <div className="text-xs font-bold text-rose-700">
                        {currentExercise.explanation}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:block text-xs font-bold text-slate-400">
                Choose, assemble, or speak your answer above to verify
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {isAnswerSubmitted && !isCorrect && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowAiTutor(true);
                  }}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Explain with Pip</span>
                </button>
              )}

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={!hasAnswer}
                  onClick={handleCheckAnswer}
                  className={`w-full sm:w-44 py-3.5 rounded-2xl font-black text-base border-b-4 transition-all uppercase tracking-wider cursor-pointer ${
                    hasAnswer
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-900 active:border-b-0 active:translate-y-1 shadow-md shadow-blue-500/20'
                      : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                  }`}
                >
                  CHECK
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContinue}
                  className={`w-full sm:w-44 py-3.5 rounded-2xl font-black text-base border-b-4 transition-all uppercase tracking-wider text-white shadow-md active:border-b-0 active:translate-y-1 cursor-pointer ${
                    isCorrect
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-900'
                      : 'bg-rose-500 hover:bg-rose-600 border-rose-700'
                  }`}
                >
                  CONTINUE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Tutor Modal */}
      {showAiTutor && (
        <AiTutorModal
          isOpen={showAiTutor}
          onClose={() => setShowAiTutor(false)}
          contextQuestion={currentExercise?.question}
          userAnswer={
            selectedOption ||
            speechTranscript ||
            mathInput ||
            selectedWords.join(' ') ||
            selectedFallbackOption ||
            ''
          }
          correctAnswer={currentExercise?.correctAnswer}
          subject={lesson.subject}
          topic={currentExercise?.topic}
        />
      )}
    </div>
  );
};
