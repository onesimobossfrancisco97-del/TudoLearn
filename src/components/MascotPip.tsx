import React from 'react';
import { Sparkles, HelpCircle, Heart, Zap } from 'lucide-react';

export type MascotMood = 'idle' | 'cheer' | 'celebrate' | 'thinking' | 'sad' | 'speaking';

interface MascotPipProps {
  mood?: MascotMood;
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onTalk?: () => void;
  className?: string;
}

export const MascotPip: React.FC<MascotPipProps> = ({
  mood = 'idle',
  message,
  subMessage,
  size = 'md',
  interactive = true,
  onTalk,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
  };

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Pip Mascot SVG with Electric Blue Theme */}
      <div
        onClick={interactive ? onTalk : undefined}
        className={`relative ${sizeClasses[size]} shrink-0 transition-transform duration-300 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        }`}
        title="Pip: Your TudoLearn Mentor (tap for a tip!)"
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md select-none overflow-visible"
        >
          {/* Shadow */}
          <ellipse cx="60" cy="112" rx="34" ry="7" fill="rgba(30,58,138,0.18)" />

          {/* Ears / Antenna Tufts */}
          <path
            d="M 34 32 C 26 14, 42 16, 45 28 Z"
            fill="#1D4ED8"
            className="transition-all duration-300"
          />
          <path
            d="M 86 32 C 94 14, 78 16, 75 28 Z"
            fill="#1D4ED8"
            className="transition-all duration-300"
          />
          {/* Inner ears */}
          <path d="M 36 29 C 32 20, 40 21, 42 27 Z" fill="#60A5FA" />
          <path d="M 84 29 C 88 20, 80 21, 78 27 Z" fill="#60A5FA" />

          {/* Main Body - Royal / Electric Blue */}
          <rect
            x="24"
            y="26"
            width="72"
            height="78"
            rx="36"
            fill="#2563EB"
            className="transition-colors duration-300 shadow-inner"
          />

          {/* Light Sky Belly Badge */}
          <rect
            x="36"
            y="56"
            width="48"
            height="42"
            rx="22"
            fill="#BAE6FD"
          />

          {/* Belly Emblem based on mood */}
          {mood === 'celebrate' ? (
            <path
              d="M 60 66 L 63 74 L 71 74 L 64 79 L 67 87 L 60 82 L 53 87 L 56 79 L 49 74 L 57 74 Z"
              fill="#F59E0B"
            />
          ) : mood === 'thinking' ? (
            <circle cx="60" cy="76" r="6" fill="#0284C7" opacity="0.8" />
          ) : (
            <path
              d="M 60 70 C 58 64, 48 64, 48 72 C 48 78, 60 86, 60 86 C 60 86, 72 78, 72 72 C 72 64, 62 64, 60 70 Z"
              fill="#0284C7"
              opacity="0.7"
            />
          )}

          {/* Wings */}
          {mood === 'cheer' || mood === 'celebrate' ? (
            <>
              {/* Upraised happy wings */}
              <ellipse cx="18" cy="46" rx="9" ry="20" transform="rotate(-28 18 46)" fill="#1E40AF" />
              <ellipse cx="102" cy="46" rx="9" ry="20" transform="rotate(28 102 46)" fill="#1E40AF" />
            </>
          ) : mood === 'sad' ? (
            <>
              {/* Drooped wings */}
              <ellipse cx="18" cy="74" rx="8" ry="18" transform="rotate(12 18 74)" fill="#1E40AF" />
              <ellipse cx="102" cy="74" rx="8" ry="18" transform="rotate(-12 102 74)" fill="#1E40AF" />
            </>
          ) : (
            <>
              {/* Neutral friendly wings */}
              <ellipse cx="20" cy="62" rx="8" ry="18" fill="#1E40AF" />
              <ellipse cx="100" cy="62" rx="8" ry="18" fill="#1E40AF" />
            </>
          )}

          {/* Giant Expressive Eyes */}
          <ellipse cx="44" cy="48" rx="14" ry="16" fill="#FFFFFF" />
          <ellipse cx="76" cy="48" rx="14" ry="16" fill="#FFFFFF" />

          {/* Eye pupils according to mood */}
          {mood === 'cheer' || mood === 'celebrate' ? (
            <>
              <path d="M 34 50 Q 44 40, 54 50" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 66 50 Q 76 40, 86 50" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : mood === 'sad' ? (
            <>
              <circle cx="45" cy="51" r="7" fill="#1E293B" />
              <circle cx="75" cy="51" r="7" fill="#1E293B" />
              <path d="M 38 60 Q 36 66, 38 70" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : mood === 'thinking' ? (
            <>
              <circle cx="48" cy="44" r="7" fill="#1E293B" />
              <circle cx="80" cy="44" r="7" fill="#1E293B" />
              <circle cx="50" cy="42" r="2.5" fill="#FFFFFF" />
              <circle cx="82" cy="42" r="2.5" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <circle cx="46" cy="48" r="8" fill="#0F172A" />
              <circle cx="74" cy="48" r="8" fill="#0F172A" />
              <circle cx="48" cy="45" r="3" fill="#FFFFFF" />
              <circle cx="76" cy="45" r="3" fill="#FFFFFF" />
              <circle cx="43" cy="51" r="1.5" fill="#FFFFFF" />
              <circle cx="71" cy="51" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Cute Orange Beak */}
          <polygon
            points="54,53 66,53 60,63"
            fill="#F97316"
            className="transition-transform duration-200"
          />

          {/* Cheek blushes */}
          <ellipse cx="32" cy="57" rx="5" ry="3" fill="#F472B6" opacity="0.65" />
          <ellipse cx="88" cy="57" rx="5" ry="3" fill="#F472B6" opacity="0.65" />

          {/* Feet */}
          <ellipse cx="46" cy="104" rx="8" ry="4" fill="#F97316" />
          <ellipse cx="74" cy="104" rx="8" ry="4" fill="#F97316" />

          {/* Party Hat if celebrating */}
          {mood === 'celebrate' && (
            <polygon
              points="60,6 48,27 72,27"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Floating status badge */}
        {mood === 'celebrate' && (
          <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-full animate-bounce shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        )}
        {mood === 'thinking' && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full animate-pulse shadow-md">
            <HelpCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Speech Bubble with Blue Accent Border */}
      {message && (
        <div className="relative bg-white border-2 border-blue-400/80 rounded-2xl p-3.5 shadow-md max-w-sm">
          {/* Arrow */}
          <div className="absolute left-[-8px] top-6 w-3 h-3 bg-white border-b-2 border-l-2 border-blue-400/80 transform rotate-45" />

          <p className="text-slate-800 text-sm font-extrabold leading-snug">{message}</p>
          {subMessage && (
            <p className="text-slate-500 text-xs mt-1 font-semibold">{subMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};
