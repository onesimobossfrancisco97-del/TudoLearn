import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { MascotPip } from './MascotPip';
import { sound } from '../utils/audio';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextQuestion?: string;
  userAnswer?: string;
  correctAnswer?: string;
  subject?: string;
  topic?: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  contextQuestion,
  userAnswer,
  correctAnswer,
  subject = 'Languages',
  topic = 'General Practice',
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'pip' | 'user'; text: string }>>([
    {
      sender: 'pip',
      text: contextQuestion
        ? `Hi there! I noticed you were working on "${contextQuestion}". What part would you like help understanding?`
        : `Hey! I'm Pip, your TudoLearn AI study buddy. Ask me anything about ${subject}, grammar rules, math shortcuts, or ear training!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    sound.playClick();
    const userQuery = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: contextQuestion || userQuery,
          userAnswer: userAnswer || userQuery,
          correctAnswer: correctAnswer || 'Concept breakdown',
          subject,
          topic,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'pip',
          text: data.explanation || 'You are making steady progress! Keep focusing on the core principles.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'pip',
          text: `Great question! In ${subject}, the key is recognizing the underlying pattern. Try breaking the challenge down into smaller components!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-blue-400 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MascotPip mood="speaking" size="sm" interactive={false} />
            <div>
              <div className="flex items-center gap-1.5 font-black text-lg">
                <span>Pip the AI Tutor</span>
                <span className="text-[10px] bg-white/20 backdrop-blur-xs text-white font-extrabold uppercase px-2 py-0.5 rounded-full border border-white/20">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-blue-100 font-semibold">
                Personalized {subject} Mentorship
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3.5 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'pip' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-sm">
                  Pip
                </div>
              )}
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-sm font-bold leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-800 border-2 border-blue-100 shadow-xs rounded-tl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 p-2 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              Pip is crafting an easy explanation...
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleQuickQuestion('Can you give me a mnemonic to remember this?')}
            className="text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            💡 Give me a mnemonic
          </button>
          <button
            onClick={() => handleQuickQuestion('Why is the correct answer right?')}
            className="text-[11px] font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            🤔 Explain the rule
          </button>
          <button
            onClick={() => handleQuickQuestion('Give me another similar practice question')}
            className="text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            ⚡ Practice drill
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask Pip about ${subject}...`}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:bg-slate-300 text-white rounded-xl font-black flex items-center justify-center transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
