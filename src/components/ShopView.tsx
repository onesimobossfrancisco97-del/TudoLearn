import React from 'react';
import { Heart, Shield, Sparkles, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface ShopViewProps {
  gems: number;
  hearts: number;
  maxHearts: number;
  hasStreakFreeze: boolean;
  isSuper: boolean;
  onRefillHearts: (cost: number) => void;
  onBuyStreakFreeze: (cost: number) => void;
  onOpenSuperModal: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  gems,
  hearts,
  maxHearts,
  hasStreakFreeze,
  isSuper,
  onRefillHearts,
  onBuyStreakFreeze,
  onOpenSuperModal,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto pb-24">
      {/* Super TudoLearn Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/10 mb-8 relative overflow-hidden border border-blue-400/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-black bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full tracking-wider border border-white/20">
              {isSuper ? 'Active Member' : 'Premium Upgrade'}
            </span>
            <h2 className="text-2xl font-black mt-2">Super TudoLearn</h2>
            <p className="text-xs text-blue-100 font-semibold mt-1">
              Unlimited hearts, offline downloads, and zero interruptions.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSuperModal();
            }}
            className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            {isSuper ? 'Manage Plan' : 'Try Free'}
          </button>
        </div>
      </div>

      {/* Gems Balance Bar */}
      <div className="flex items-center justify-between bg-white border-2 border-blue-100 rounded-2xl p-4 mb-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">Your Treasury</div>
            <div className="text-xl font-black text-slate-800">{gems} Gems</div>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500">Earned by completing lessons</span>
      </div>

      {/* Power-ups Section */}
      <h3 className="text-base font-black text-slate-800 mb-3 px-1">Power-Ups</h3>
      <div className="space-y-3 mb-8">
        {/* Heart Refill */}
        <div className="bg-white border-2 border-slate-200 hover:border-blue-200 transition-colors rounded-3xl p-4.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
              <Heart className="w-7 h-7 fill-rose-500" />
            </div>
            <div>
              <div className="text-base font-black text-slate-800">Refill Hearts</div>
              <div className="text-xs font-bold text-slate-500">
                Restore your practice lives to full {maxHearts} hearts.
              </div>
            </div>
          </div>

          {hearts >= maxHearts || isSuper ? (
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              Full
            </span>
          ) : (
            <button
              onClick={() => {
                if (gems >= 100) {
                  sound.playLevelUp();
                  onRefillHearts(100);
                }
              }}
              disabled={gems < 100}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs uppercase rounded-xl border-b-2 border-blue-900 active:border-b-0 cursor-pointer shadow-xs"
            >
              100 Gems
            </button>
          )}
        </div>

        {/* Streak Freeze */}
        <div className="bg-white border-2 border-slate-200 hover:border-blue-200 transition-colors rounded-3xl p-4.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="text-base font-black text-slate-800">Streak Freeze</div>
              <div className="text-xs font-bold text-slate-500">
                Protects your streak if you miss a single day of practice.
              </div>
            </div>
          </div>

          {hasStreakFreeze ? (
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl flex items-center gap-1 border border-blue-200">
              <Check className="w-3.5 h-3.5" /> Equipped
            </span>
          ) : (
            <button
              onClick={() => {
                if (gems >= 200) {
                  sound.playLevelUp();
                  onBuyStreakFreeze(200);
                }
              }}
              disabled={gems < 200}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs uppercase rounded-xl border-b-2 border-blue-900 active:border-b-0 cursor-pointer shadow-xs"
            >
              200 Gems
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
