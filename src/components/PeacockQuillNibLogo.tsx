import React from 'react';

interface PeacockQuillNibLogoProps {
  className?: string;
  onNibClick?: () => void;
}

export const PeacockQuillNibLogo: React.FC<PeacockQuillNibLogoProps> = ({
  className = "w-44 h-56",
  onNibClick
}) => {
  return (
    <svg
      viewBox="0 0 280 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PersonaAI Sanctuary Emblem"
    >
      <defs>
        {/* Soft emerald backlight */}
        <radialGradient id="auraGlow" cx="60%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#0EA5E9" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Outer Feather Plumes: Deep Forest into Peacock Teal */}
        <linearGradient id="plumeGrad" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="45%" stopColor="#0D555A" />
          <stop offset="100%" stopColor="#083338" />
        </linearGradient>

        {/* Warm Amber Eye Halo */}
        <linearGradient id="amberHalo" x1="30%" y1="10%" x2="70%" y2="90%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="55%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Radiant Turquoise Shield */}
        <linearGradient id="turquoiseEye" x1="30%" y1="10%" x2="70%" y2="90%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Midnight Royal Heart Core */}
        <linearGradient id="midnightCore" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0B1120" />
        </linearGradient>

        {/* Classic Fountain Pen Brass/Gold Nib */}
        <linearGradient id="goldNib" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        {/* Ink Flourish Gradient */}
        <linearGradient id="inkSweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="50%" stopColor="#2563EB" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Atmospheric Glow */}
      <circle cx="170" cy="95" r="75" fill="url(#auraGlow)" />

      {/* ============================================================ */}
      {/* 1. DENSE, CONTINUOUS VANE CLUSTERS (Attached to the Rachis)  */}
      {/* ============================================================ */}
      {/* Crown Crest Barbs */}
      <path d="M174 22 C186 10, 200 6, 210 4 C198 12, 190 22, 182 30 Z" fill="#0D555A" />
      <path d="M165 24 C168 12, 178 6, 185 4 C178 14, 174 22, 171 30 Z" fill="#0D555A" />

      {/* Upper Left Feather Vanes (Curving inward toward eye) */}
      <path d="M152 46 C124 50, 108 72, 116 96 C102 82, 106 60, 134 46 Z" fill="url(#plumeGrad)" />
      <path d="M136 78 C108 88, 96 114, 108 138 C94 122, 98 100, 122 84 Z" fill="url(#plumeGrad)" />
      <path d="M126 122 C104 136, 100 162, 114 184 C100 168, 100 148, 118 132 Z" fill="url(#plumeGrad)" />
      <path d="M120 168 C106 182, 108 204, 122 218 C110 206, 108 190, 118 178 Z" fill="#0F766E" />

      {/* Upper Right Feather Vanes (Sweeping upward & outward) */}
      <path d="M194 48 C220 54, 238 78, 230 102 C242 86, 236 64, 206 50 Z" fill="url(#plumeGrad)" />
      <path d="M184 88 C212 98, 226 126, 216 150 C226 132, 222 110, 196 94 Z" fill="url(#plumeGrad)" />
      <path d="M172 136 C194 150, 202 178, 188 200 C200 182, 196 160, 178 144 Z" fill="url(#plumeGrad)" />
      <path d="M156 182 C172 198, 172 220, 158 234 C168 220, 166 202, 154 190 Z" fill="#0F766E" />

      {/* ============================================================ */}
      {/* 2. THE MULTI-TONAL PEACOCK EYE (Indented Heart Motif)       */}
      {/* ============================================================ */}
      {/* Amber Teardrop Halo */}
      <path
        d="M174 54 C146 56, 134 86, 154 112 C168 128, 194 120, 200 94 C206 68, 190 54, 174 54 Z"
        fill="url(#amberHalo)"
      />

      {/* Turquoise Iris Shield */}
      <path
        d="M174 64 C154 66, 146 88, 162 106 C172 116, 190 110, 194 92 C198 76, 186 64, 174 64 Z"
        fill="url(#turquoiseEye)"
      />

      {/* Royal Indigo Indented Heart Pupil */}
      <path
        d="M174 74 C164 75, 159 86, 166 94 C170 99, 174 97, 174 94 C174 97, 178 99, 182 94 C188 86, 184 75, 174 74 Z"
        fill="url(#midnightCore)"
      />

      {/* Specular Light Dot */}
      <circle cx="170" cy="80" r="2" fill="#FEF08A" />

      {/* ============================================================ */}
      {/* 3. TILTED S-CURVE QUILL RACHIS (Continuous Flow into Nib)   */}
      {/* ============================================================ */}
      <path
        d="M172 108 C166 148, 150 196, 126 242"
        stroke="#083338"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* ============================================================ */}
      {/* 4. FOUNTAIN PEN NIB & CALLIGRAPHIC INK SWEEP                */}
      {/* ============================================================ */}
      <g
        onClick={onNibClick}
        className="cursor-pointer group/nib"
        role="button"
        tabIndex={0}
        aria-label="Open Hardware Smart Pen Labs Preview"
      >
        {/* Large invisible hit area for easy tapping */}
        <rect x="70" y="225" width="160" height="90" fill="transparent" />

        {/* Nib Collar (Rotated along quill trajectory) */}
        <g transform="translate(126, 242) rotate(26)">
          {/* Metal Ferrule Band */}
          <rect x="-6" y="0" width="12" height="3.5" rx="1.5" fill="#083338" />

          {/* Gold Fountain Pen Nib */}
          <path
            d="M-5 3.5 L5 3.5 L4 26 L0 38 L-4 26 Z"
            fill="url(#goldNib)"
            stroke="#083338"
            strokeWidth="1.2"
            strokeLinejoin="round"
            className="transition-transform duration-300 origin-top group-hover/nib:scale-110"
          />

          {/* Breather Hole & Ink Slit */}
          <circle cx="0" cy="18" r="1.4" fill="#083338" />
          <line x1="0" y1="19" x2="0" y2="38" stroke="#083338" strokeWidth="1.1" />
        </g>

        {/* Ink Writing Stroke (Flows right from the nib tip at ~110, 276) */}
        <path
          d="M110 276 C95 288, 76 292, 68 280 C60 268, 74 256, 92 260 C116 266, 148 290, 185 292 C218 294, 242 284, 260 276"
          stroke="url(#inkSweep)"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300 group-hover/nib:stroke-teal-500"
        />

        {/* Living Ink Droplet */}
        <circle cx="68" cy="278" r="1.5" fill="#0D9488" opacity="0.7" />
      </g>
    </svg>
  );
};
