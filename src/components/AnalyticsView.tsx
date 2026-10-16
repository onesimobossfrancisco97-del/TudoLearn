import React from 'react';
import {
  TrendingUp,
  Target,
  Award,
  Download,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { UserProfile, Course } from '../types';
import { useMenuClickSound, sound } from '../utils/audio';
import { AppLanguage, t } from '../utils/i18n';

interface AnalyticsViewProps {
  user: UserProfile;
  courses: Course[];
  onOpenCertificate: (course: Course, level?: number) => void;
  onToggleOfflineCourse: (courseId: string) => void;
  isSimulatedOffline: boolean;
  onToggleSimulateOffline: () => void;
  appLanguage?: AppLanguage;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  user,
  courses,
  onOpenCertificate,
  onToggleOfflineCourse,
  isSimulatedOffline,
  onToggleSimulateOffline,
  appLanguage = 'en',
}) => {
  const { isClickSoundEnabled, toggleClickSound } = useMenuClickSound();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyActivity = [12, 18, 15, 22, 15, 8, 20];

  return (
    <div className="w-full max-w-xl mx-auto pb-24">
      {/* Header with Royal Blue Gradient */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/10 mb-6 border border-blue-400/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-black bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full tracking-wider border border-white/20">
              TudoLearn Performance
            </span>
            <h1 className="text-2xl font-black mt-2">Study Analytics</h1>
            <p className="text-xs text-blue-100 font-semibold mt-0.5">
              Track retention, consistency, and earn verified mastery certificates.
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Daily Goal & Retention Widget */}
      <div className="bg-white border-2 border-slate-200 hover:border-blue-200 rounded-3xl p-5 mb-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-black text-slate-800">Daily Study Target</h2>
          </div>
          <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {user.todayMinutes} / {user.dailyGoalMinutes} Mins
          </span>
        </div>

        <div className="w-full bg-blue-50 h-3 rounded-full overflow-hidden mb-4 border border-blue-100">
          <div
            className="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.round((user.todayMinutes / user.dailyGoalMinutes) * 100))}%`,
            }}
          />
        </div>

        {/* Weekly Activity Bar Chart */}
        <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Weekly Minutes</h3>
        <div className="grid grid-cols-7 gap-2 items-end h-24 pt-4 border-b border-slate-100 pb-2">
          {days.map((day, idx) => {
            const mins = dailyActivity[idx];
            const heightPercent = Math.min(100, (mins / 25) * 100);
            return (
              <div key={day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-400">{mins}m</span>
                <div
                  className="w-full max-w-[28px] bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-lg transition-all"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] font-black text-slate-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline Mode & Downloads Manager */}
      <div className="bg-white border-2 border-slate-200 hover:border-blue-200 rounded-3xl p-5 mb-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isSimulatedOffline ? (
              <WifiOff className="w-5 h-5 text-amber-500" />
            ) : (
              <Wifi className="w-5 h-5 text-blue-600" />
            )}
            <div>
              <h2 className="text-sm font-black text-slate-800">Offline Lesson Packs</h2>
              <p className="text-[11px] text-slate-400 font-bold">
                Download lessons to study without WiFi or cellular data.
              </p>
            </div>
          </div>

          <button
            onClick={onToggleSimulateOffline}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
              isSimulatedOffline
                ? 'bg-amber-500 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            {isSimulatedOffline ? 'Airplane Mode ON' : 'Test Offline'}
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {courses.map((c) => {
            const isDownloaded = user.downloadedCourseIds.includes(c.id);
            return (
              <div key={c.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span>{c.flagEmoji || '📘'}</span>
                    <span>{c.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {c.units.length} Unit • ~1.2 MB
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleOfflineCourse(c.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                    isDownloaded
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isDownloaded ? 'Downloaded' : 'Download'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audio & Sound Preferences */}
      <div className="bg-white border-2 border-slate-200 hover:border-blue-200 rounded-3xl p-5 mb-6 shadow-xs transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl ${
                isClickSoundEnabled
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {isClickSoundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800">Menu & Button Clicking Sounds</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Play subtle audible pops when tapping menus and buttons
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = toggleClickSound();
              if (next) sound.playClick();
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              isClickSoundEnabled
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
            }`}
          >
            {isClickSoundEnabled ? 'Audio ON' : 'Audio OFF'}
          </button>
        </div>
      </div>

      {/* Mastery Certificates */}
      <div className="bg-white border-2 border-slate-200 hover:border-blue-200 rounded-3xl p-5 shadow-xs transition-colors">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-black text-slate-800">{t('header.my_certificates', appLanguage)}</h2>
        </div>
        <p className="text-xs text-slate-500 font-semibold mb-4">
          Earn official verified diplomas and capstone master credentials upon completing Level 5 and Level 10 milestones.
        </p>

        <div className="space-y-3">
          {courses.slice(0, 4).map((c) => (
            <div
              key={c.id}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{c.flagEmoji || '📘'}</span>
                  <div>
                    <div className="text-xs font-black text-slate-900">{c.title}</div>
                    <div className="text-[10px] text-slate-400 font-bold">10 Levels • {c.level}</div>
                  </div>
                </div>
              </div>

              {/* Two milestone certificates: Level 5 and Level 10 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                {/* Level 5 Intermediate Diploma */}
                <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block mb-0.5">
                      Level 5 Milestone
                    </div>
                    <div className="text-xs font-black text-slate-800">Intermediate Diploma</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenCertificate(c, 5);
                    }}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[11px] font-black transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>

                {/* Level 10 Master Certification */}
                <div className="bg-white p-2.5 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded inline-block mb-0.5">
                      Level 10 Capstone
                    </div>
                    <div className="text-xs font-black text-slate-800">Master Certificate</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenCertificate(c, 10);
                    }}
                    className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-[11px] font-black shadow-2xs transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Attribution Sign-off */}
      <div className="text-center py-4 text-xs text-slate-400 font-medium border-t border-slate-200/60 mt-6">
        TudoLearn Global Academy • Founder of the App: <strong className="text-slate-700 font-black">Onesimo Boss Francisco</strong>
      </div>
    </div>
  );
};
