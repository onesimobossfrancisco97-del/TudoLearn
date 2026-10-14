import React from 'react';

interface TudoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  className?: string;
}

export const TudoLogo: React.FC<TudoLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    hero: 96,
  };

  const px = pixelSizes[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* App Icon Mark */}
      <div
        style={{ width: px, height: px }}
        className="relative shrink-0 group transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Tile Background Gradient */}
            <linearGradient id="tudoTileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="35%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            {/* Inner Glow */}
            <linearGradient id="tudoBellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>

            {/* Cap Gold Gradient */}
            <linearGradient id="tudoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Subtle App Tile Shadow */}
            <filter id="tileShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1E3A8A" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Squircle App Icon Base */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="26"
            fill="url(#tudoTileGrad)"
            stroke="#60A5FA"
            strokeWidth="1.5"
            filter="url(#tileShadow)"
          />

          {/* Tactile Lower Bezel */}
          <path
            d="M 4 74 C 4 88, 16 96, 30 96 L 70 96 C 84 96, 96 88, 96 74 C 96 84, 84 94, 70 94 L 30 94 C 16 94, 4 84, 4 74 Z"
            fill="#172554"
            opacity="0.45"
          />

          {/* Subtle Multi-Subject Orbital Rings / Constellation */}
          <circle cx="50" cy="54" r="38" stroke="#93C5FD" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.3" fill="none" />

          {/* Pip Character Base inside Squircle */}
          {/* Ear Tufts */}
          <path d="M 28 36 C 20 22, 34 24, 38 33 Z" fill="#1D4ED8" />
          <path d="M 72 36 C 80 22, 66 24, 62 33 Z" fill="#1D4ED8" />
          <path d="M 30 34 C 24 26, 32 27, 35 32 Z" fill="#60A5FA" />
          <path d="M 70 34 C 76 26, 68 27, 65 32 Z" fill="#60A5FA" />

          {/* Main Head / Torso */}
          <rect x="22" y="32" width="56" height="54" rx="27" fill="#2563EB" />

          {/* Belly Highlight (shaped like an open book curve) */}
          <path
            d="M 32 58 C 38 52, 50 56, 50 62 C 50 56, 62 52, 68 58 C 68 76, 32 76, 32 58 Z"
            fill="url(#tudoBellyGrad)"
          />

          {/* Giant Expressive Curiosity Eyes */}
          {/* Left Eye White */}
          <ellipse cx="38" cy="48" rx="10" ry="11.5" fill="#FFFFFF" />
          {/* Right Eye White */}
          <ellipse cx="62" cy="48" rx="10" ry="11.5" fill="#FFFFFF" />

          {/* Pupils */}
          <ellipse cx="40" cy="48" rx="6" ry="7" fill="#0F172A" />
          <ellipse cx="60" cy="48" rx="6" ry="7" fill="#0F172A" />

          {/* Sparkling Eye Highlights */}
          <circle cx="42" cy="45" r="2.5" fill="#FFFFFF" />
          <circle cx="62" cy="45" r="2.5" fill="#FFFFFF" />
          <circle cx="38" cy="50" r="1.2" fill="#FFFFFF" />
          <circle cx="58" cy="50" r="1.2" fill="#FFFFFF" />

          {/* Beak / Enthusiastic Smile */}
          <polygon points="46,52 54,52 50,60" fill="#F97316" />
          <polygon points="47,53 53,53 50,56" fill="#FDBA74" />

          {/* Cheek Blushes */}
          <ellipse cx="28" cy="54" rx="4" ry="2.2" fill="#F472B6" opacity="0.6" />
          <ellipse cx="72" cy="54" rx="4" ry="2.2" fill="#F472B6" opacity="0.6" />

          {/* Graduation Mortarboard Cap */}
          {/* Cap Skull Base */}
          <ellipse cx="50" cy="30" rx="15" ry="4" fill="#0F172A" />
          {/* Diamond Cap Top */}
          <polygon points="50,15 76,24 50,32 24,24" fill="#1E293B" stroke="#475569" strokeWidth="1" />
          <polygon points="50,16 73,24 50,30 27,24" fill="#0F172A" />
          {/* Cap Button */}
          <circle cx="50" cy="24" r="2.2" fill="url(#tudoGoldGrad)" />
          {/* Tassel */}
          <path d="M 50 24 Q 66 26, 68 36" stroke="#F59E0B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="68" cy="37" r="1.8" fill="#F59E0B" />

          {/* Multi-Subject Symbols integrated as magic sparks */}
          {/* Top-Right: Golden Spark of Wisdom (XP & Mastery) */}
          <path
            d="M 80 18 L 82 23 L 87 25 L 82 27 L 80 32 L 78 27 L 73 25 L 78 23 Z"
            fill="url(#tudoGoldGrad)"
          />

          {/* Top-Left: Science / Logic Spark */}
          <circle cx="16" cy="22" r="2.2" fill="#67E8F9" />
          <circle cx="21" cy="18" r="1.2" fill="#A5F3FC" />

          {/* Bottom-Right: Music Note */}
          <path
            d="M 82 72 L 82 66 L 87 64 L 87 68 M 82 72 A 2 2 0 1 1 78 72 A 2 2 0 0 1 82 72"
            stroke="#F472B6"
            strokeWidth="1.2"
            fill="#F472B6"
          />

          {/* Bottom-Left: Speech quote bubble / Language symbol */}
          <path
            d="M 16 66 C 14 66, 12 68, 12 70 C 12 72, 14 74, 16 74 L 16 76 L 18 74 C 19 74, 20 73, 20 71 C 20 68, 18 66, 16 66 Z"
            fill="#34D399"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Optional Logotype Text */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none">
            TudoLearn
          </span>
          <span className="text-[9px] uppercase tracking-widest font-extrabold text-blue-500/80 mt-0.5">
            Interactive Multi-Subject Academy
          </span>
        </div>
      )}
    </div>
  );
};
