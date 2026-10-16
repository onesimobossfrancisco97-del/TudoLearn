import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../utils/firebase';
import { AppLanguage, t } from '../utils/i18n';
import appLogoImg from '../assets/images/tudolearn_app_logo_1791585881128.jpg';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  appLanguage?: AppLanguage;
  pendingLessonTitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  appLanguage = 'en',
  pendingLessonTitle,
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    sound.playClick();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        sound.playLevelUp();
        confetti({ particleCount: 90, spread: 70 });
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      console.warn('Google auth err:', err);
      setErrorMsg(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        const user = await signUpWithEmail(email.trim(), password, name.trim());
        sound.playLevelUp();
        confetti({ particleCount: 100, spread: 80 });
        onSuccess(user);
        onClose();
      } else {
        const user = await signInWithEmail(email.trim(), password);
        sound.playLevelUp();
        confetti({ particleCount: 70, spread: 60 });
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      console.warn('Email auth err:', err);
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (msg.includes('auth/email-already-in-use')) {
        msg = 'This email is already registered. Please switch to Sign In.';
      } else if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        msg = 'Invalid email or password. Please verify and try again.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white border-2 border-blue-400 rounded-3xl shadow-2xl p-5 sm:p-7 flex flex-col max-h-[92vh] overflow-y-auto animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top App Branding & Mascot/Logo */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/25 border-2 border-blue-300 mx-auto mb-3 bg-blue-600 animate-bounce-subtle">
            <img
              src={appLogoImg}
              alt="TudoLearn Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-[11px] font-black border border-amber-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('auth.required_to_learn', appLanguage)}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'signup'
              ? t('auth.welcome_title', appLanguage)
              : t('auth.sign_in', appLanguage)}
          </h2>

          <p className="text-xs text-slate-500 font-semibold mt-1 max-w-xs mx-auto">
            {pendingLessonTitle ? (
              <span>
                To start <strong className="text-blue-700">{pendingLessonTitle}</strong>, sign up or sign in below!
              </span>
            ) : (
              t('auth.welcome_desc', appLanguage)
            )}
          </p>
        </div>

        {/* Benefits Badges */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-2.5 bg-blue-50/70 rounded-2xl border border-blue-100 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-blue-600 mb-0.5" />
            <span className="text-[10px] font-black text-slate-800">Save Progress</span>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="w-4 h-4 text-amber-500 mb-0.5" />
            <span className="text-[10px] font-black text-slate-800">Keep Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-4 h-4 text-emerald-600 mb-0.5" />
            <span className="text-[10px] font-black text-slate-800">Certificates</span>
          </div>
        </div>

        {/* Fast Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-blue-400 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-60 mb-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.41l4.03-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.28 2.57 1.25 6.59l4.03 3.13c.95-2.83 3.6-4.97 6.72-4.97z"
            />
          </svg>
          <span>{t('auth.continue_google', appLanguage)}</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="w-full border-t border-slate-200" />
          <span className="bg-white px-2.5 text-[10px] uppercase font-black tracking-wider text-slate-400">
            {t('auth.or_email', appLanguage)}
          </span>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmitEmail} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
                {t('auth.full_name', appLanguage)}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
              {t('auth.email', appLanguage)}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">
              {t('auth.password', appLanguage)}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            <span>
              {isLoading
                ? 'Processing...'
                : mode === 'signup'
                ? t('auth.sign_up_button', appLanguage)
                : t('auth.sign_in_button', appLanguage)}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Sign Up and Sign In */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-bold">
            {mode === 'signup'
              ? t('auth.already_have_account', appLanguage)
              : t('auth.dont_have_account', appLanguage)}{' '}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setErrorMsg(null);
              }}
              className="text-blue-600 font-black hover:underline cursor-pointer ml-1"
            >
              {mode === 'signup'
                ? t('auth.sign_in', appLanguage)
                : t('auth.sign_up', appLanguage)}
            </button>
          </p>
        </div>

        {/* Founder Attribution at bottom of Auth Modal */}
        <div className="mt-3 text-center text-[10px] text-slate-400 font-medium">
          TudoLearn • Founder of the App: <strong className="text-slate-600 font-black">Onesimo Boss Francisco</strong>
        </div>
      </div>
    </div>
  );
};
