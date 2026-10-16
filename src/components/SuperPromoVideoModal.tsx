import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Crown,
  Award,
  Zap,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { AppLanguage, t } from '../utils/i18n';
import { LEMONSQUEEZY_MONTHLY_URL, LEMONSQUEEZY_YEARLY_URL } from '../utils/paymentConfig';

interface SuperPromoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage?: AppLanguage;
  onUpgradeDirect?: () => void;
}

interface AdScene {
  id: number;
  badge: string;
  titleKey: string;
  descKey: string;
  defaultTitle: string;
  defaultDesc: string;
  color: string;
  icon: React.ElementType;
  duration: number; // in seconds
  highlightStat: string;
}

export const SuperPromoVideoModal: React.FC<SuperPromoVideoModalProps> = ({
  isOpen,
  onClose,
  appLanguage = 'en',
  onUpgradeDirect,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  const scenes: AdScene[] = [
    {
      id: 1,
      badge: 'UNLIMITED HEARTS',
      titleKey: 'video.scene1_title',
      descKey: 'video.scene1_desc',
      defaultTitle: 'Never Run Out of Hearts',
      defaultDesc: 'Practice without anxiety. Infinite cyan hearts allow you to learn continuously without interruptions or waiting.',
      color: 'from-blue-600 via-sky-500 to-indigo-600',
      icon: Heart,
      duration: 6,
      highlightStat: '∞ Unlimited Hearts',
    },
    {
      id: 2,
      badge: 'ALL 10 LEVELS UNLOCKED',
      titleKey: 'video.scene2_title',
      descKey: 'video.scene2_desc',
      defaultTitle: 'Unlock All 10 Levels in Every Course',
      defaultDesc: 'Break free from level barriers. Access foundational, intermediate, and advanced master syllabus modules across all subjects.',
      color: 'from-amber-500 via-orange-500 to-yellow-500',
      icon: Crown,
      duration: 6,
      highlightStat: '10 Full Levels',
    },
    {
      id: 3,
      badge: 'OFFICIAL CERTIFICATES',
      titleKey: 'video.scene3_title',
      descKey: 'video.scene3_desc',
      defaultTitle: 'Official Accredited Diplomas',
      defaultDesc: 'Earn verifiable Level 5 Intermediate Diplomas and Level 10 Capstone Master Credentials signed by Founder Onesimo Boss Francisco.',
      color: 'from-emerald-600 via-teal-500 to-blue-600',
      icon: Award,
      duration: 6,
      highlightStat: 'Level 5 & 10 Diplomas',
    },
    {
      id: 4,
      badge: 'AD-FREE & OFFLINE',
      titleKey: 'video.scene4_title',
      descKey: 'video.scene4_desc',
      defaultTitle: '100% Ad-Free & Offline Mode',
      defaultDesc: 'Download complete courses with audio and lessons. Practice on planes, trains, or off the grid with lightning speed.',
      color: 'from-purple-600 via-indigo-600 to-pink-600',
      icon: Download,
      duration: 6,
      highlightStat: 'Zero Ads & Offline',
    },
    {
      id: 5,
      badge: 'SPECIAL PROMO',
      titleKey: 'video.title',
      descKey: 'video.subtitle',
      defaultTitle: 'Try Super TudoLearn Free for 7 Days',
      defaultDesc: 'Join thousands of students accelerating their careers, languages, and instruments with Super TudoLearn.',
      color: 'from-blue-700 via-indigo-600 to-violet-800',
      icon: Zap,
      duration: 8,
      highlightStat: '7-Day Free Trial',
    },
  ];

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= totalDuration) {
          return 0; // loop back
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, totalDuration]);

  // Synchronize current scene based on elapsed seconds
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      accumulated += scenes[i].duration;
      if (elapsedSeconds < accumulated) {
        if (currentSceneIndex !== i) {
          setCurrentSceneIndex(i);
          if (!isAudioMuted) sound.playClick();
        }
        break;
      }
    }
  }, [elapsedSeconds, currentSceneIndex, isAudioMuted, scenes]);

  if (!isOpen) return null;

  const currentScene = scenes[currentSceneIndex];
  const Icon = currentScene.icon;
  const currentCheckoutUrl =
    selectedPlan === 'yearly' ? LEMONSQUEEZY_YEARLY_URL : LEMONSQUEEZY_MONTHLY_URL;

  const handleSelectScene = (index: number) => {
    sound.playClick();
    let accumulated = 0;
    for (let i = 0; i < index; i++) {
      accumulated += scenes[i].duration;
    }
    setElapsedSeconds(accumulated);
    setCurrentSceneIndex(index);
  };

  const handleTogglePlay = () => {
    sound.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    sound.playClick();
    setElapsedSeconds(0);
    setCurrentSceneIndex(0);
    setIsPlaying(true);
  };

  const handleClaimTrial = () => {
    sound.playLevelUp();
    confetti({ particleCount: 120, spread: 80 });
  };

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-amber-400/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-scale-up text-white">
        {/* Top Video Header */}
        <div className="p-3.5 sm:p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Crown className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-white">Super TudoLearn</span>
                <span className="text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white px-1.5 py-0.5 rounded animate-pulse">
                  OFFICIAL AD
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Founder: Onesimo Boss Francisco • Watch Commercial Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Screen / Canvas Viewport */}
        <div className={`relative flex-1 min-h-[260px] sm:min-h-[320px] bg-gradient-to-br ${currentScene.color} p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-700`}>
          {/* Animated Background Rings / Particles */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-8 border-white animate-spin-slow" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-8 border-white/50 animate-pulse" />
          </div>

          {/* Top Scene Tag & Stat Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white">
              {currentScene.badge}
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentScene.highlightStat}</span>
            </span>
          </div>

          {/* Center Cinematic Feature Presentation */}
          <div className="relative z-10 text-center my-auto py-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 mx-auto flex items-center justify-center shadow-2xl mb-4 animate-bounce-subtle">
              <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-md" />
            </div>

            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md max-w-lg mx-auto">
              {t(currentScene.titleKey, appLanguage) || currentScene.defaultTitle}
            </h3>

            <p className="text-xs sm:text-base text-white/90 font-semibold mt-2 max-w-md mx-auto leading-relaxed drop-shadow-xs">
              {t(currentScene.descKey, appLanguage) || currentScene.defaultDesc}
            </p>
          </div>

          {/* Bottom Captions Overlay */}
          <div className="relative z-10 bg-black/50 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 text-center">
            <p className="text-xs sm:text-sm font-bold text-amber-300">
              ⚡ Super TudoLearn Commercial • Experience 10 Levels & Official Diplomas
            </p>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="bg-slate-900 p-3 sm:p-4 border-t border-slate-800 space-y-3 shrink-0">
          {/* Progress Bar Scrubber */}
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(elapsedSeconds / totalDuration) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
              <span>{formatTime(elapsedSeconds)}</span>
              <span>Scene {currentSceneIndex + 1} of {scenes.length}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Control Buttons & Scene Shortcuts */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer transition-colors shadow-xs"
                title={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                title="Restart Commercial"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Scene Selector Pills */}
            <div className="flex items-center gap-1">
              {scenes.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                    currentSceneIndex === idx
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upgrade / Checkout Call to Action Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="text-sm font-black text-white">Start 7-Day Free Trial</span>
              <span className="text-[10px] font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                Cancel Anytime
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Then only $4.99/mo (billed yearly $59.99) or $9.99/mo
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Monthly / Yearly Switch */}
            <div className="flex p-0.5 bg-slate-800 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedPlan('yearly')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  selectedPlan === 'yearly'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly (50% OFF)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  selectedPlan === 'monthly'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Direct External Checkout Link to Lemon Squeezy */}
            <a
              href={currentCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClaimTrial}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-400/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>CLAIM FREE TRIAL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
