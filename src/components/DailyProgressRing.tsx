import React, { useState, useEffect, useRef } from 'react';
import { Target, Check, Sparkles, Clock, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface DailyProgressRingProps {
  todayMinutes: number;
  dailyGoalMinutes: number;
  onUpdateDailyGoal?: (minutes: number) => void;
  className?: string;
}

export const DailyProgressRing: React.FC<DailyProgressRingProps> = ({
  todayMinutes,
  dailyGoalMinutes,
  onUpdateDailyGoal,
  className = '',
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevMinutesRef = useRef(todayMinutes);

  const rawPercent = (todayMinutes / dailyGoalMinutes) * 100;
  const clampedPercent = Math.min(100, Math.round(rawPercent));
  const isGoalAchieved = todayMinutes >= dailyGoalMinutes;

  // SVG ring math
  const size = 38;
  const strokeWidth = 3.5;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  // Trigger pulse effect when minutes increase
  useEffect(() => {
    if (todayMinutes > prevMinutesRef.current) {
      setIsPulsing(true);
      if (todayMinutes >= dailyGoalMinutes && prevMinutesRef.current < dailyGoalMinutes) {
        sound.playLevelUp();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.2 },
          colors: ['#2563EB', '#38BDF8', '#F59E0B', '#10B981'],
        });
      }
      const t = setTimeout(() => setIsPulsing(false), 1500);
      return () => clearTimeout(t);
    }
    prevMinutesRef.current = todayMinutes;
  }, [todayMinutes, dailyGoalMinutes]);

  const handleAdjustGoal = (mins: number) => {
    sound.playClick();
    if (onUpdateDailyGoal) {
      onUpdateDailyGoal(mins);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Clickable Progress Ring Button */}
      <button
        type="button"
        onClick={() => {
          sound.playClick();
          setShowPopover(!showPopover);
        }}
        className={`relative flex items-center justify-center rounded-2xl p-1 transition-all duration-300 cursor-pointer select-none group border ${
          isGoalAchieved
            ? 'bg-emerald-50/80 border-emerald-300 hover:bg-emerald-100 ring-2 ring-emerald-400/40'
            : 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/80'
        } ${isPulsing ? 'scale-110 shadow-lg shadow-blue-500/30 animate-pulse' : 'hover:scale-105 active:scale-95'}`}
        title={`Daily Goal: ${todayMinutes}/${dailyGoalMinutes} min (${clampedPercent}%)`}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="blueProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="emeraldAchievedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={isGoalAchieved ? '#D1FAE5' : '#DBEAFE'}
            strokeWidth={strokeWidth}
          />

          {/* Animated Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={isGoalAchieved ? 'url(#emeraldAchievedGradient)' : 'url(#blueProgressGradient)'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isGoalAchieved ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
          ) : (
            <Target className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
          )}
        </div>
      </button>

      {/* Popover Card */}
      {showPopover && (
        <div className="absolute top-12 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-72 bg-white border-2 border-blue-200 rounded-3xl shadow-2xl p-4 z-50 animate-scale-up text-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-xl ${
                  isGoalAchieved
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Target className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs uppercase font-black text-slate-400 tracking-wider">
                  Daily Rhythm
                </div>
                <div className="text-sm font-black text-slate-900">
                  {todayMinutes} of {dailyGoalMinutes} Mins
                </div>
              </div>
            </div>

            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                isGoalAchieved
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {clampedPercent}%
            </span>
          </div>

          {/* Progress Bar in Card */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalAchieved
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-blue-600 to-sky-400'
              }`}
              style={{ width: `${clampedPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 font-semibold mb-4 leading-snug">
            {isGoalAchieved
              ? '🎉 Daily target completed! You have built lasting memory retention today.'
              : `Keep going! ${Math.max(0, dailyGoalMinutes - todayMinutes)} more minutes to complete today's commitment.`}
          </p>

          {/* Adjust Target Buttons */}
          <div className="border-t border-slate-100 pt-3">
            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-2">
              Adjust Target
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => handleAdjustGoal(mins)}
                  className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    dailyGoalMinutes === mins
                      ? 'bg-blue-600 text-white border-blue-800 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
