import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Trophy,
  Flame,
  ArrowRight,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { DailyChallenge, UserProfile } from '../types';
import { getTimeUntilMidnight, getTodayDateKey } from '../data/dailyChallengesData';
import { sound } from '../utils/audio';

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  user: UserProfile;
  onOpenModal: () => void;
  className?: string;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  challenge,
  user,
  onOpenModal,
  className = '',
}) => {
  const todayKey = getTodayDateKey();
  const isCompleted = user.lastDailyChallengeDate === todayKey;

  const [countdown, setCountdown] = useState(getTimeUntilMidnight().formatted);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border-2 transition-all duration-300 shadow-lg ${
        isCompleted
          ? 'bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-blue-900/90 border-emerald-400/40 text-white shadow-emerald-950/20'
          : 'bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-700 border-amber-300/60 text-white shadow-amber-900/20'
      } ${className}`}
    >
      {/* Decorative ambient blurred orbs */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Info Column */}
        <div className="flex-1 space-y-2">
          {/* Top badges bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-xs ${
                isCompleted
                  ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30'
                  : 'bg-amber-300 text-amber-950 border-amber-200 animate-pulse'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isCompleted ? 'Daily Challenge Complete' : "Today's Daily Challenge"}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/25 text-xs font-bold text-white/90">
              <span>{challenge.categoryEmoji}</span>
              <span>{challenge.categoryLabel}</span>
            </span>

            {/* Countdown timer */}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200/90 bg-black/20 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Resets in: <strong className="text-white font-mono">{countdown}</strong></span>
            </span>
          </div>

          {/* Title and prompt summary */}
          <div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{challenge.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/85 font-medium line-clamp-1 mt-0.5">
              {challenge.question}
            </p>
          </div>

          {/* Reward Bounty */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 bg-yellow-400/25 border border-yellow-300/40 text-yellow-200 px-2.5 py-1 rounded-xl text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>+{challenge.gemsReward} Bonus Gems</span>
            </div>

            <div className="flex items-center gap-1 bg-white/15 text-white px-2 py-1 rounded-xl text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>+{challenge.xpReward} XP</span>
            </div>

            {user.dailyChallengeStreak && user.dailyChallengeStreak > 0 ? (
              <div className="flex items-center gap-1 text-xs font-bold text-orange-200">
                <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                <span>{user.dailyChallengeStreak} Day Streak</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 w-full md:w-auto flex md:flex-col items-center justify-end">
          {isCompleted ? (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenModal();
              }}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-emerald-500/30 hover:bg-emerald-500/40 border border-emerald-300/40 text-emerald-100 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Review Solution</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenModal();
              }}
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 border-b-4 border-amber-900/30 shadow-lg shadow-black/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>Solve & Earn {challenge.gemsReward} Gems</span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
