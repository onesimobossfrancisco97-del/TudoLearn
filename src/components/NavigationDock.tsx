import React, { useState } from 'react';
import {
  Map,
  Trophy,
  Users,
  Award,
  ShoppingBag,
  TrendingUp,
  UploadCloud,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Shield,
  Play,
} from 'lucide-react';
import { sound, useMenuClickSound } from '../utils/audio';
import appLogoImg from '../assets/images/tudolearn_app_logo_1791585881128.jpg';

export type TabType =
  | 'learn'
  | 'leaderboard'
  | 'community'
  | 'badges'
  | 'shop'
  | 'analytics'
  | 'studio';

import { AppLanguage, t } from '../utils/i18n';

interface NavigationDockProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  appLanguage?: AppLanguage;
  onOpenPromoVideo?: () => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  currentTab,
  onChangeTab,
  appLanguage = 'en',
  onOpenPromoVideo,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isClickSoundEnabled, toggleClickSound } = useMenuClickSound();

  const tabs: { id: TabType; label: string; icon: React.ElementType; description: string }[] = [
    { id: 'learn', label: t('nav.learn', appLanguage), icon: Map, description: t('nav.learn_desc', appLanguage) },
    { id: 'leaderboard', label: t('nav.leaderboard', appLanguage), icon: Trophy, description: t('nav.leaderboard_desc', appLanguage) },
    { id: 'community', label: t('nav.community', appLanguage), icon: Users, description: t('nav.community_desc', appLanguage) },
    { id: 'badges', label: t('nav.badges', appLanguage), icon: Award, description: t('nav.badges_desc', appLanguage) },
    { id: 'shop', label: t('nav.shop', appLanguage), icon: ShoppingBag, description: t('nav.shop_desc', appLanguage) },
    { id: 'analytics', label: t('nav.analytics', appLanguage), icon: TrendingUp, description: t('nav.analytics_desc', appLanguage) },
    { id: 'studio', label: t('nav.management', appLanguage), icon: Shield, description: t('nav.management_desc', appLanguage) },
  ];

  const handleSelectTab = (tabId: TabType) => {
    sound.playClick();
    onChangeTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleClickSound();
    if (next) {
      sound.playClick();
    }
  };

  return (
    <>
      {/* =========================================================================
          DESKTOP VERTICAL SIDEBAR MENU (FLOWS DOWN, NO LEFT-RIGHT SCROLLING)
          ========================================================================= */}
      <aside
        aria-label="Sidebar Navigation"
        className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-white/95 backdrop-blur-md border-r-2 border-blue-100 flex-col justify-between p-4 z-40 shadow-lg shadow-blue-500/5 select-none"
      >
        {/* Top Branding */}
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-blue-50">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-blue-500/25 border-2 border-blue-200 shrink-0 bg-blue-600">
              <img
                src={appLogoImg}
                alt="TudoLearn Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                TudoLearn
              </span>
              <span className="text-[9px] uppercase tracking-widest font-black text-blue-500/80">
                Gamified Mastery
              </span>
            </div>
          </div>

          {/* Navigation Links - Stacked Vertically Going Down */}
          <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-3 py-1">
              {t('nav.main_menu', appLanguage)}
            </div>
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl w-full text-left font-black text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/70 border border-transparent'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-black">{tab.label}</span>
                    <span
                      className={`text-[9px] font-medium ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {tab.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Preferences Card: Menu Click Sound Switch */}
        <div className="pt-3 border-t border-blue-50 space-y-2">
          <div className="p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-2xl border border-blue-100/80 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isClickSoundEnabled
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isClickSoundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-800 leading-tight">
                    {t('menu.sound', appLanguage)}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">
                    {isClickSoundEnabled ? t('menu.sound_on', appLanguage) : t('menu.sound_off', appLanguage)}
                  </span>
                </div>
              </div>

              {/* Accessible Toggle Button */}
              <button
                type="button"
                onClick={handleToggleSound}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isClickSoundEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={isClickSoundEnabled}
                title={
                  isClickSoundEnabled
                    ? 'Turn OFF menu clicking sound'
                    : 'Turn ON menu clicking sound'
                }
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isClickSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Super TudoLearn Promotional Video Ad Button */}
          {onOpenPromoVideo && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenPromoVideo();
              }}
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer border border-amber-300"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{t('video.watch_ad', appLanguage)}</span>
            </button>
          )}

          {/* Founder of the App Credit Card */}
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border border-blue-800/40 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider font-extrabold text-amber-400 mb-0.5">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>{t('founder.badge', appLanguage)}</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            </div>
            <div className="text-xs font-black text-white tracking-tight">
              {t('founder.name', appLanguage)}
            </div>
            <div className="text-[8.5px] text-blue-200/80 font-semibold mt-0.5">
              {t('founder.desc', appLanguage)}
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE BOTTOM DOCK (NEVER SCROLLS LEFT/RIGHT - EXPANDS DOWNWARD)
          ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-blue-100 shadow-xl overflow-x-hidden"
      >
        <div className="max-w-md mx-auto px-2 flex items-center justify-around h-16">
          {/* Primary Quick Tabs */}
          {[
            { id: 'learn', label: t('nav.learn', appLanguage), icon: Map },
            { id: 'leaderboard', label: t('nav.leaderboard', appLanguage), icon: Trophy },
            { id: 'community', label: t('nav.community', appLanguage), icon: Users },
            { id: 'shop', label: t('nav.shop', appLanguage), icon: ShoppingBag },
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id as TabType)}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 cursor-pointer ${
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
                <span className="text-[10px] mt-0.5 tracking-tight font-extrabold">{tab.label}</span>
              </button>
            );
          })}

          {/* Full Vertical Menu Trigger */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsMobileMenuOpen(true);
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 cursor-pointer ${
              ['badges', 'analytics', 'studio'].includes(currentTab) || isMobileMenuOpen
                ? 'text-indigo-600 font-black'
                : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
            title="Open all sections and audio settings"
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                ['badges', 'analytics', 'studio'].includes(currentTab) || isMobileMenuOpen
                  ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200'
                  : 'bg-transparent'
              }`}
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-extrabold">Menu ▾</span>
          </button>
        </div>
      </nav>

      {/* =========================================================================
          MOBILE VERTICAL DRAWER / MENU SHEET (SCROLLS DOWN ONLY)
          ========================================================================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in w-full max-w-full overflow-hidden">
          {/* Backdrop click to dismiss */}
          <div
            className="flex-1"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet that scrolls DOWN strictly */}
          <div className="bg-white rounded-t-3xl border-t-2 border-blue-200 shadow-2xl p-4 max-h-[82vh] flex flex-col animate-scale-up overflow-hidden w-full max-w-full">
            {/* Header: Title + Sound Toggle + Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-black text-slate-800">
                  {t('menu.preferences', appLanguage)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Sound Toggle Banner */}
            <div className="my-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    isClickSoundEnabled
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isClickSoundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">{t('menu.sound', appLanguage)}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {isClickSoundEnabled ? t('menu.sound_on', appLanguage) : t('menu.sound_off', appLanguage)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleSound}
                className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer transition-colors ${
                  isClickSoundEnabled
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isClickSoundEnabled ? t('menu.turn_off', appLanguage) : t('menu.turn_on', appLanguage)}
              </button>
            </div>

            {/* Vertical List of All Tabs - SCROLLS DOWN STRICTLY WITH SPACIOUS TOUCH TARGETS */}
            <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 py-1">
              <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-1 py-0.5">
                {t('menu.all_sections', appLanguage)}
              </div>
              {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl w-full text-left font-black text-sm min-h-[54px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-50 hover:bg-blue-50/70 text-slate-700 border border-slate-200/80 active:bg-blue-100'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600 shadow-2xs'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-black">{tab.label}</div>
                      <div
                        className={`text-[10px] font-medium truncate ${
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Super Promo Video Button in Mobile Menu */}
            {onOpenPromoVideo && (
              <div className="mt-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsMobileMenuOpen(false);
                    onOpenPromoVideo();
                  }}
                  className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer border border-amber-300"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{t('video.watch_ad', appLanguage)}</span>
                </button>
              </div>
            )}

            {/* Founder of the App: Mobile Menu Screen Bottom Credit */}
            <div className="mt-2 pt-2 border-t border-slate-100 shrink-0">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border border-blue-900/50 shadow-md text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-amber-400 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('founder.badge', appLanguage)}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-sm font-black text-white tracking-tight">
                  {t('founder.name', appLanguage)}
                </div>
                <div className="text-[10px] text-blue-200/80 font-medium mt-0.5">
                  {t('founder.desc', appLanguage)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
