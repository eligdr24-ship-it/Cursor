import type { CSSProperties } from 'react'

type VisualProps = {
  className?: string
  style?: CSSProperties
}

/** Rough, uncut diamond — irregular mineral form with natural facets. */
export function RoughDiamond({ className = '', style }: VisualProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="roughFill" x1="40" y1="20" x2="160" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3a3836" />
          <stop offset="0.35" stopColor="#6e6a64" />
          <stop offset="0.6" stopColor="#9a948c" />
          <stop offset="1" stopColor="#2c2a28" />
        </linearGradient>
        <linearGradient id="roughHighlight" x1="70" y1="40" x2="130" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8e2d9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e8e2d9" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="roughGlow" cx="0.45" cy="0.35" r="0.55">
          <stop stopColor="#c4a574" stopOpacity="0.22" />
          <stop offset="1" stopColor="#050505" stopOpacity="0" />
        </radialGradient>
        <filter id="roughSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      <ellipse cx="100" cy="200" rx="48" ry="8" fill="#000" opacity="0.45" />
      <path
        d="M78 38 L112 28 L148 52 L168 96 L152 148 L118 188 L72 176 L42 128 L48 78 Z"
        fill="url(#roughGlow)"
      />
      <path
        d="M78 38 L112 28 L148 52 L168 96 L152 148 L118 188 L72 176 L42 128 L48 78 Z"
        fill="url(#roughFill)"
        stroke="#8a847c"
        strokeWidth="0.8"
        opacity="0.95"
      />
      <path d="M78 38 L118 96 L112 28" fill="url(#roughHighlight)" opacity="0.7" />
      <path d="M112 28 L148 52 L118 96" fill="#cfc8be" opacity="0.18" />
      <path d="M148 52 L168 96 L130 110 L118 96" fill="#1a1816" opacity="0.35" />
      <path d="M42 128 L72 176 L100 140 L78 100" fill="#0e0d0c" opacity="0.4" />
      <path d="M72 176 L118 188 L130 140 L100 140" fill="#4a4642" opacity="0.45" />
      <path d="M78 100 L118 96 L130 110 L100 140" fill="#7a746c" opacity="0.25" />
      <path
        d="M90 55 L105 48 L120 62"
        stroke="#e8e2d9"
        strokeWidth="0.7"
        opacity="0.35"
        strokeLinecap="round"
        filter="url(#roughSoft)"
      />
      <circle cx="98" cy="72" r="1.2" fill="#e8e2d9" opacity="0.5" />
      <circle cx="132" cy="88" r="0.8" fill="#c4a574" opacity="0.4" />
      <circle cx="86" cy="130" r="0.9" fill="#e8e2d9" opacity="0.25" />
    </svg>
  )
}

/** Brilliant-cut polished diamond with precise facets. */
export function PolishedDiamond({ className = '', style }: VisualProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="polTable" x1="70" y1="40" x2="130" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#d4d0ca" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8a8680" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="polFacetL" x1="40" y1="70" x2="100" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5f2ec" stopOpacity="0.7" />
          <stop offset="1" stopColor="#3a3834" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="polFacetR" x1="160" y1="70" x2="100" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4a574" stopOpacity="0.35" />
          <stop offset="0.4" stopColor="#e8e2d9" stopOpacity="0.45" />
          <stop offset="1" stopColor="#1a1816" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="polAura" cx="0.5" cy="0.4" r="0.5">
          <stop stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="175" rx="42" ry="6" fill="#000" opacity="0.35" />
      <circle cx="100" cy="95" r="70" fill="url(#polAura)" />
      {/* Crown */}
      <path d="M60 78 L100 42 L140 78 L100 92 Z" fill="url(#polTable)" />
      <path d="M40 95 L60 78 L100 92 L70 108 Z" fill="url(#polFacetL)" />
      <path d="M160 95 L140 78 L100 92 L130 108 Z" fill="url(#polFacetR)" />
      <path d="M60 78 L40 95 L70 108 L100 92" fill="#ffffff" opacity="0.12" />
      <path d="M140 78 L160 95 L130 108 L100 92" fill="#2a2826" opacity="0.25" />
      {/* Girdle line */}
      <path d="M40 95 L70 108 L100 102 L130 108 L160 95" stroke="#e8e2d9" strokeWidth="0.5" opacity="0.4" />
      {/* Pavilion */}
      <path d="M40 95 L70 108 L100 168 Z" fill="#5a5650" opacity="0.55" />
      <path d="M70 108 L100 102 L100 168 Z" fill="#cfc8be" opacity="0.35" />
      <path d="M100 102 L130 108 L100 168 Z" fill="#8a847c" opacity="0.4" />
      <path d="M130 108 L160 95 L100 168 Z" fill="#3a3632" opacity="0.55" />
      {/* Sparkle points */}
      <path d="M100 52 L102 58 L108 60 L102 62 L100 68 L98 62 L92 60 L98 58 Z" fill="#fff" opacity="0.55" />
      <circle cx="78" cy="88" r="1" fill="#fff" opacity="0.45" />
      <circle cx="128" cy="85" r="0.8" fill="#c4a574" opacity="0.5" />
    </svg>
  )
}

/** Gold ring band / setting in progress. */
export function GoldRingBand({ className = '', style }: VisualProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldBand" x1="40" y1="40" x2="200" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4bc8e" />
          <stop offset="0.35" stopColor="#c4a574" />
          <stop offset="0.65" stopColor="#9a7b4f" />
          <stop offset="1" stopColor="#6e5535" />
        </linearGradient>
        <linearGradient id="goldShine" x1="80" y1="50" x2="160" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0e6d2" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#c4a574" stopOpacity="0.1" />
          <stop offset="1" stopColor="#5c4528" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="175" rx="55" ry="7" fill="#000" opacity="0.4" />
      {/* Ring ellipse outer */}
      <ellipse
        cx="120"
        cy="110"
        rx="70"
        ry="48"
        stroke="url(#goldBand)"
        strokeWidth="14"
        fill="none"
      />
      <ellipse
        cx="120"
        cy="110"
        rx="70"
        ry="48"
        stroke="url(#goldShine)"
        strokeWidth="14"
        fill="none"
        opacity="0.85"
      />
      {/* Inner edge highlight */}
      <ellipse
        cx="120"
        cy="110"
        rx="58"
        ry="38"
        stroke="#f0e6d2"
        strokeWidth="0.6"
        fill="none"
        opacity="0.35"
      />
      {/* Setting prongs base */}
      <path
        d="M104 68 L120 52 L136 68"
        stroke="url(#goldBand)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M112 62 L120 48 L128 62" stroke="#d4bc8e" strokeWidth="1.5" fill="none" opacity="0.8" />
    </svg>
  )
}

/** Finished engagement ring — gold band with set diamond. */
export function FinishedRing({ className = '', style }: VisualProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="finGold" x1="50" y1="80" x2="190" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e0cda8" />
          <stop offset="0.3" stopColor="#c4a574" />
          <stop offset="0.7" stopColor="#9a7b4f" />
          <stop offset="1" stopColor="#6a5030" />
        </linearGradient>
        <linearGradient id="finDia" x1="100" y1="30" x2="140" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#e8e2d9" />
          <stop offset="1" stopColor="#8a8680" />
        </linearGradient>
        <radialGradient id="finGlow" cx="0.5" cy="0.35" r="0.45">
          <stop stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#c4a574" stopOpacity="0.08" />
          <stop offset="1" stopColor="#050505" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="90" fill="url(#finGlow)" />
      <ellipse cx="120" cy="205" rx="50" ry="6" fill="#000" opacity="0.3" />
      {/* Band */}
      <ellipse
        cx="120"
        cy="145"
        rx="62"
        ry="42"
        stroke="url(#finGold)"
        strokeWidth="11"
        fill="none"
      />
      <ellipse
        cx="120"
        cy="145"
        rx="52"
        ry="33"
        stroke="#f0e6d2"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
      {/* Prongs */}
      <path d="M108 88 L112 68" stroke="url(#finGold)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M132 88 L128 68" stroke="url(#finGold)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M100 95 L92 78" stroke="url(#finGold)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M140 95 L148 78" stroke="url(#finGold)" strokeWidth="2.2" strokeLinecap="round" />
      {/* Diamond */}
      <path d="M100 78 L120 48 L140 78 L120 88 Z" fill="url(#finDia)" />
      <path d="M100 78 L110 92 L120 88 Z" fill="#cfc8be" opacity="0.5" />
      <path d="M140 78 L130 92 L120 88 Z" fill="#5a5650" opacity="0.45" />
      <path d="M110 92 L120 108 L130 92 L120 88 Z" fill="#8a847c" opacity="0.55" />
      <path d="M120 52 L122 58 L128 60 L122 62 L120 68 L118 62 L112 60 L118 58 Z" fill="#fff" opacity="0.65" />
      <circle cx="112" cy="72" r="0.8" fill="#fff" opacity="0.5" />
    </svg>
  )
}

/** Artisan gold crafting tools — refined, not industrial. */
export function CraftTools({ className = '', style }: VisualProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="toolGold" x1="0" y1="0" x2="200" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4bc8e" />
          <stop offset="1" stopColor="#9a7b4f" />
        </linearGradient>
      </defs>
      {/* Fine pliers silhouette */}
      <path
        d="M30 90 L55 50 L70 58 L48 95 Z"
        stroke="url(#toolGold)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M42 90 L67 50 L82 58 L60 95 Z"
        stroke="url(#toolGold)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      {/* Gold wire coil */}
      <ellipse cx="130" cy="70" rx="28" ry="18" stroke="url(#toolGold)" strokeWidth="2" fill="none" opacity="0.6" />
      <ellipse cx="130" cy="66" rx="22" ry="14" stroke="#d4bc8e" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Loupe */}
      <circle cx="170" cy="40" r="16" stroke="#c4a574" strokeWidth="1.2" fill="none" opacity="0.55" />
      <circle cx="170" cy="40" r="10" stroke="#e8e2d9" strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M158 52 L148 68" stroke="#9a7b4f" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
