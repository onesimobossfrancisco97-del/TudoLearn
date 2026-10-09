import React from 'react';
import { Award, Flame, Mic, Music, Calculator, Crown, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '../types';
import { sound } from '../utils/audio';

interface BadgesViewProps {
  badges: Badge[];
  onClaimBadge: (badgeId: string, gemReward: number) => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ badges, onClaimBadge }) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />;
      case 'Mic':
        return <Mic className="w-6 h-6 text-blue-500" />;
      case 'Music':
        return <Music className="w-6 h-6 text-pink-500" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-sky-500" />;
      case 'Crown':
        return <Crown className="w-6 h-6 text-amber-500 fill-amber-400" />;
      default:
        return <Award className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/10 mb-6 border border-blue-400/20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 backdrop-blur-xs rounded-2xl border border-white/20">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Achievements & Badges</h1>
            <p className="text-xs text-blue-100 font-semibold mt-0.5">
              Level up your TudoLearn masteries and collect reward gems!
            </p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((badge) => {
          const isComplete = badge.progress >= badge.maxProgress;
          const percent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                badge.isUnlocked
                  ? 'bg-blue-50/50 border-blue-300 shadow-xs'
                  : isComplete
                  ? 'bg-amber-50 border-amber-300 shadow-md ring-2 ring-amber-300 animate-pulse'
                  : 'bg-white border-slate-200 hover:border-blue-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-100/60 px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    +{badge.rewardGems} Gems
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-800">{badge.title}</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5 mb-3 leading-snug">
                  {badge.description}
                </p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isComplete ? 'bg-gradient-to-r from-blue-600 to-sky-400' : 'bg-blue-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-black text-slate-400">
                  <span>
                    {badge.progress} / {badge.maxProgress}
                  </span>
                  <span>{percent}%</span>
                </div>

                {/* Claim Button */}
                {isComplete && !badge.isUnlocked && (
                  <button
                    onClick={() => {
                      sound.playLevelUp();
                      confetti({ particleCount: 70, spread: 60 });
                      onClaimBadge(badge.id, badge.rewardGems);
                    }}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md border-b-2 border-orange-700 active:border-b-0 active:translate-y-0.5 cursor-pointer"
                  >
                    CLAIM {badge.rewardGems} GEMS
                  </button>
                )}

                {badge.isUnlocked && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-black text-blue-700 bg-blue-100/80 py-1.5 rounded-xl border border-blue-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Unlocked
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
