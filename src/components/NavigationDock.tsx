import React from 'react';
import {
  Map,
  Trophy,
  Users,
  Award,
  ShoppingBag,
  TrendingUp,
  UploadCloud,
} from 'lucide-react';
import { sound } from '../utils/audio';

export type TabType =
  | 'learn'
  | 'leaderboard'
  | 'community'
  | 'badges'
  | 'shop'
  | 'analytics'
  | 'studio';

interface NavigationDockProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({ currentTab, onChangeTab }) => {
  const tabs = [
    { id: 'learn', label: 'Learn', icon: Map },
    { id: 'leaderboard', label: 'Ranks', icon: Trophy },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'analytics', label: 'Insights', icon: TrendingUp },
    { id: 'studio', label: 'Studio', icon: UploadCloud },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-blue-100 shadow-xl">
      <div className="max-w-xl mx-auto px-2 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                onChangeTab(tab.id as TabType);
              }}
              className={`flex flex-col items-center justify-center w-full py-1 transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'text-blue-600 scale-105 font-black'
                  : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-xs ring-1 ring-blue-200'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
