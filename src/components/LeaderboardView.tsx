import React from 'react';
import { Trophy, Flame, ChevronUp, ChevronDown, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { LeaderboardUser } from '../types';

interface LeaderboardViewProps {
  users: LeaderboardUser[];
  currentUserXp: number;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ users, currentUserXp }) => {
  // Sort users by XP descending
  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);

  return (
    <div className="w-full max-w-xl mx-auto pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-6 h-6 text-yellow-200 fill-yellow-200" />
              <span className="text-xs uppercase font-black bg-white/20 px-3 py-0.5 rounded-full">
                Gold League
              </span>
            </div>
            <h1 className="text-2xl font-black">Weekly Championship</h1>
            <p className="text-xs text-amber-100 font-semibold mt-1">
              Top 3 advance to Obsidian League. Keep your streak!
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-2xl text-xs font-black">
            <Clock className="w-4 h-4" />
            <span>2d 14h left</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3 mb-6 items-end pt-4">
        {/* 2nd Place */}
        {sortedUsers[1] && (
          <div className="flex flex-col items-center bg-white border-2 border-slate-200 rounded-3xl p-3 shadow-xs">
            <div className="relative mb-2">
              <img
                src={sortedUsers[1].avatar}
                alt={sortedUsers[1].name}
                className="w-14 h-14 rounded-full border-3 border-slate-300 object-cover"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center border-2 border-white">
                2
              </span>
            </div>
            <span className="text-xs font-black text-slate-800 text-center line-clamp-1">
              {sortedUsers[1].name}
            </span>
            <span className="text-xs font-bold text-amber-600 mt-0.5">
              {sortedUsers[1].xp} XP
            </span>
          </div>
        )}

        {/* 1st Place */}
        {sortedUsers[0] && (
          <div className="flex flex-col items-center bg-amber-50 border-3 border-amber-400 rounded-3xl p-4 shadow-md -translate-y-2">
            <div className="relative mb-2">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
              </div>
              <img
                src={sortedUsers[0].avatar}
                alt={sortedUsers[0].name}
                className="w-16 h-16 rounded-full border-4 border-amber-400 object-cover shadow-sm"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center border-2 border-white">
                1
              </span>
            </div>
            <span className="text-sm font-black text-slate-900 text-center line-clamp-1">
              {sortedUsers[0].name}
            </span>
            <span className="text-xs font-black text-amber-600 mt-0.5">
              {sortedUsers[0].xp} XP
            </span>
          </div>
        )}

        {/* 3rd Place */}
        {sortedUsers[2] && (
          <div className="flex flex-col items-center bg-white border-2 border-slate-200 rounded-3xl p-3 shadow-xs">
            <div className="relative mb-2">
              <img
                src={sortedUsers[2].avatar}
                alt={sortedUsers[2].name}
                className="w-14 h-14 rounded-full border-3 border-amber-600/40 object-cover"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>
            <span className="text-xs font-black text-slate-800 text-center line-clamp-1">
              {sortedUsers[2].name}
            </span>
            <span className="text-xs font-bold text-amber-600 mt-0.5">
              {sortedUsers[2].xp} XP
            </span>
          </div>
        )}
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl divide-y divide-slate-100 overflow-hidden shadow-xs">
        {sortedUsers.map((user, idx) => {
          const rank = idx + 1;
          const isPromotionZone = rank <= 3;
          const isDemotionZone = rank >= sortedUsers.length - 1;

          return (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3.5 sm:p-4 transition-colors ${
                user.isCurrentUser
                  ? 'bg-blue-50/80 border-l-4 border-blue-600'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 text-center text-sm font-black ${
                    rank === 1
                      ? 'text-amber-500 font-extrabold text-base'
                      : rank === 2
                      ? 'text-slate-400'
                      : rank === 3
                      ? 'text-amber-700'
                      : 'text-slate-400'
                  }`}
                >
                  {rank}
                </span>

                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />

                <div>
                  <div className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <span>{user.name}</span>
                    {user.isCurrentUser && (
                      <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-0.5 text-rose-500">
                      <Flame className="w-3.5 h-3.5 fill-rose-500" />
                      {user.streak}d streak
                    </span>
                    {isPromotionZone && (
                      <span className="text-blue-600 flex items-center text-[10px] font-extrabold">
                        <ChevronUp className="w-3 h-3" /> Promotion
                      </span>
                    )}
                    {isDemotionZone && (
                      <span className="text-rose-500 flex items-center text-[10px]">
                        <ChevronDown className="w-3 h-3" /> Danger zone
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-slate-700">{user.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
