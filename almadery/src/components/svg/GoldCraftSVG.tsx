type Props = { className?: string; label?: string };

/**
 * Gold craftsmanship — a ring band taking shape on the bench. The band arc is
 * drawable (data-band-arc) so scroll progress can "form" the ring, while
 * slender artisan tools rest against warm light.
 */
export default function GoldCraftSVG({ className, label }: Props) {
  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id="gcs-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9cfa0" />
          <stop offset="0.45" stopColor="#c9a468" />
          <stop offset="1" stopColor="#8a6b3b" />
        </linearGradient>
        <radialGradient id="gcs-glow" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor="#d0b384" stopOpacity="0.18" />
          <stop offset="1" stopColor="#d0b384" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="260" cy="250" r="240" fill="url(#gcs-glow)" />
      <ellipse cx="260" cy="478" rx="180" ry="14" fill="#000000" opacity="0.5" />

      {/* Guide circle of the future band */}
      <circle
        cx="260"
        cy="250"
        r="132"
        fill="none"
        stroke="#d0b384"
        strokeOpacity="0.14"
        strokeWidth="1"
        strokeDasharray="2 7"
      />

      {/* The forming band — drawn by scroll */}
      <circle
        data-band-arc=""
        cx="260"
        cy="250"
        r="132"
        fill="none"
        stroke="url(#gcs-gold)"
        strokeWidth="24"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        transform="rotate(-90 260 250)"
      />
      {/* Inner rim highlight, drawn slightly behind the band */}
      <circle
        data-band-edge=""
        cx="260"
        cy="250"
        r="121"
        fill="none"
        stroke="#f3e2c2"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        pathLength={100}
        strokeDasharray={100}
        transform="rotate(-90 260 250)"
      />

      {/* Jeweller's tweezers — from upper right */}
      <g data-tool-tweezers="" stroke="#a89a80" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M492 46 L330 176" />
        <path d="M498 62 L342 190" />
        <path d="M330 176 L322 186 M342 190 L322 186" strokeWidth="3" />
      </g>

      {/* Burnishing file — resting lower left */}
      <g data-tool-file="">
        <path
          d="M36 434 L196 350 L206 366 L46 450 Z"
          fill="#3a352c"
          stroke="#6b6152"
          strokeWidth="1.5"
        />
        <path d="M60 430 L180 366 M74 438 L194 374" stroke="#6b6152" strokeWidth="1" opacity="0.7" />
        <path d="M36 434 L14 446 L24 462 L46 450 Z" fill="#8a6b3b" opacity="0.9" />
      </g>

      {/* Fine gold dust */}
      <g data-gold-dust="" fill="#d0b384">
        <circle cx="150" cy="300" r="1.8" opacity="0.7" />
        <circle cx="360" cy="330" r="1.4" opacity="0.55" />
        <circle cx="300" cy="120" r="1.3" opacity="0.5" />
        <circle cx="200" cy="150" r="1.1" opacity="0.45" />
        <circle cx="392" cy="228" r="1.7" opacity="0.6" />
        <circle cx="240" cy="404" r="1.5" opacity="0.6" />
        <circle cx="120" cy="210" r="1.2" opacity="0.4" />
      </g>
    </svg>
  );
}
