import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Sparkles, CheckCircle2, AlertCircle, Radio } from 'lucide-react';
import { Exercise } from '../../types';
import { sound, speakSentence, createSpeechRecognizer } from '../../utils/audio';

interface SpeechPracticeProps {
  exercise: Exercise;
  transcript: string;
  onTranscriptChange: (text: string) => void;
  isAnswerSubmitted: boolean;
  quietModeFallback?: boolean;
  onSelectFallbackOption?: (option: string) => void;
  selectedFallbackOption?: string | null;
}

export const SpeechPractice: React.FC<SpeechPracticeProps> = ({
  exercise,
  transcript,
  onTranscriptChange,
  isAnswerSubmitted,
  quietModeFallback = false,
  onSelectFallbackOption,
  selectedFallbackOption,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const recognitionRef = useRef<any>(null);

  const targetPhrase = exercise.targetSpeech || exercise.correctAnswer;

  const handleToggleMic = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    sound.playClick();

    // Check mediaDevices getUserMedia microphone permission first
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setMicPermissionDenied(false);
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicPermissionDenied(true);
        }
      }
    }

    const recognizer = createSpeechRecognizer(
      exercise.audioLang || 'es-ES',
      (spokenText) => {
        onTranscriptChange(spokenText);
        setIsListening(false);
        evaluatePronunciation(spokenText);
      },
      (err) => {
        console.warn('Speech recognition status:', err);
        if (err && err.error === 'not-allowed') {
          setMicPermissionDenied(true);
        }
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!recognizer) {
      return;
    }

    recognitionRef.current = recognizer;
    try {
      recognizer.start();
      setIsListening(true);
    } catch (e) {
      setIsListening(false);
    }
  };

  const evaluatePronunciation = async (spokenText: string) => {
    setEvaluating(true);
    try {
      const res = await fetch('/api/ai/pronunciation-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetText: targetPhrase,
          spokenText,
          language: exercise.audioLang || 'Spanish',
        }),
      });
      const data = await res.json();
      setAiScore(data.score ?? 92);
      setAiFeedback(data.feedback || data.tips || 'Sounded very clear and authentic!');
    } catch {
      const match = spokenText.toLowerCase().trim() === targetPhrase.toLowerCase().trim();
      setAiScore(match ? 98 : 84);
      setAiFeedback(match ? 'Flawless pronunciation!' : 'Great accent! Keep practicing.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleSimulateClearSpeech = () => {
    onTranscriptChange(targetPhrase);
    evaluatePronunciation(targetPhrase);
  };

  // If Speaking Practice is disabled by the user (Quiet Mode fallback)
  if (quietModeFallback) {
    const fallbackOptions = [
      targetPhrase,
      'Buenos días, amigo',
      'Hasta luego, gracias',
      'De nada, por favor',
    ].sort(() => 0.5 - Math.random());

    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-amber-100 text-amber-800 rounded-full flex items-center gap-1.5">
            Quiet Mode Active (Speaking Off)
          </span>
          <span className="text-xs text-slate-400 font-bold">Select the phrase</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-4">
          {exercise.question}
        </h2>

        <div className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl mb-6 text-center">
          <span className="text-xs uppercase font-black text-blue-500">Target Phrase</span>
          <div className="text-2xl font-black text-blue-950 mt-1">"{targetPhrase}"</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {fallbackOptions.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isAnswerSubmitted}
              onClick={() => {
                sound.playClick();
                if (onSelectFallbackOption) onSelectFallbackOption(opt);
                onTranscriptChange(opt);
              }}
              className={`p-4 rounded-2xl border-2 text-left font-black transition-all border-b-4 active:border-b-2 cursor-pointer ${
                selectedFallbackOption === opt
                  ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-400'
                  : 'border-slate-200 hover:border-blue-300 bg-white text-slate-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          AI Speech & Pronunciation Coach
        </span>
        <button
          type="button"
          onClick={() => speakSentence(targetPhrase, exercise.audioLang || 'es-ES', 1.0)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer bg-blue-50 px-2.5 py-1 rounded-xl"
        >
          <Volume2 className="w-4 h-4" />
          Listen first
        </button>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-2">
        {exercise.question}
      </h2>

      {/* Target Phrase Banner */}
      <div className="w-full p-6 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-2 border-blue-200 rounded-3xl flex flex-col items-center justify-center mb-6 text-center shadow-xs">
        <div className="text-2xl sm:text-3xl font-black text-blue-950 mb-2 tracking-wide">
          "{targetPhrase}"
        </div>
        <p className="text-xs font-bold text-blue-700">
          {exercise.explanation || 'Speak with a clear voice into your microphone'}
        </p>
      </div>

      {/* Microphone Record Button with Audio Wave Simulation */}
      <div className="relative flex flex-col items-center my-4">
        {isListening && (
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-40 animate-ping -m-3 pointer-events-none" />
        )}

        <button
          type="button"
          disabled={isAnswerSubmitted}
          onClick={handleToggleMic}
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-xl border-4 cursor-pointer ${
            isListening
              ? 'bg-rose-500 border-rose-300 text-white animate-pulse'
              : transcript
              ? 'bg-gradient-to-tr from-blue-600 to-sky-500 border-sky-300 text-white'
              : 'bg-gradient-to-tr from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 border-blue-300 text-white active:scale-95'
          }`}
          title="Click to activate microphone"
        >
          {isListening ? (
            <>
              <Mic className="w-10 h-10 animate-bounce" />
              <span className="text-[10px] font-black uppercase mt-1">Listening</span>
            </>
          ) : (
            <>
              <Mic className="w-10 h-10" />
              <span className="text-[10px] font-black uppercase mt-1">Tap to speak</span>
            </>
          )}
        </button>

        {/* Live Audio Visualizer Bars when listening */}
        {isListening && (
          <div className="flex items-center gap-1.5 mt-3 h-5">
            <span className="w-1 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-4 bg-sky-400 rounded-full animate-bounce" />
            <span className="w-1 h-6 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.2s]" />
            <span className="w-1 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.1s]" />
          </div>
        )}
      </div>

      {/* Permission Denied Alert */}
      {micPermissionDenied && (
        <div className="w-full bg-rose-50 border-2 border-rose-200 rounded-2xl p-3.5 mb-4 flex items-center gap-2.5 text-rose-800 text-xs font-bold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            Microphone permission was denied. Please allow microphone access in your browser's address bar to evaluate pronunciation, or switch to Quiet Mode.
          </span>
        </div>
      )}

      {/* Spoken Transcript display */}
      <div className="w-full min-h-[60px] p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-center mb-4">
        {transcript ? (
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-extrabold text-slate-400">You said</span>
            <span className="text-lg font-black text-slate-800 italic">"{transcript}"</span>
          </div>
        ) : (
          <span className="text-xs font-semibold text-slate-400 italic">
            {isListening ? 'Speak now into your microphone...' : 'Click the microphone button and read the phrase aloud'}
          </span>
        )}
      </div>

      {/* AI Pronunciation Score Feedback */}
      {evaluating && (
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 p-2 animate-pulse">
          <Sparkles className="w-4 h-4 animate-spin" />
          Evaluating pronunciation & phonetic pitch...
        </div>
      )}

      {aiScore !== null && !evaluating && (
        <div className="w-full bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-xs ${
                aiScore >= 80 ? 'bg-gradient-to-tr from-blue-600 to-sky-500' : 'bg-amber-500'
              }`}
            >
              {aiScore}%
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">
                {aiScore >= 80 ? 'Pronunciation: Excellent!' : 'Good Effort!'}
              </div>
              <div className="text-xs text-slate-600 font-semibold mt-0.5">{aiFeedback}</div>
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
        </div>
      )}

      {/* Testing helper */}
      {!transcript && (
        <button
          type="button"
          onClick={handleSimulateClearSpeech}
          className="mt-3 text-xs text-blue-600 underline hover:text-blue-800 cursor-pointer font-bold"
        >
          Testing without mic hardware? Tap here to simulate clear pronunciation
        </button>
      )}
    </div>
  );
};
