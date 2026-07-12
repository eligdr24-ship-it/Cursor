type Props = { className?: string; label?: string };

/**
 * A rough, uncut diamond crystal — irregular facets in cool mineral grays,
 * resting on a soft pool of shadow.
 */
export default function RoughDiamondSVG({ className, label }: Props) {
  return (
    <svg
      viewBox="0 0 420 440"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id="rgh-depth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="rgh-halo" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#8c8478" stopOpacity="0.16" />
          <stop offset="1" stopColor="#8c8478" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="212" cy="210" r="200" fill="url(#rgh-halo)" />
      <ellipse cx="208" cy="408" rx="146" ry="16" fill="#000000" opacity="0.55" />

      {/* Facets sharing interior nodes C(228,196) and K(150,250) */}
      <g>
        <polygon points="118,120 210,46 228,196" fill="#565660" />
        <polygon points="210,46 330,140 228,196" fill="#4a4a53" />
        <polygon points="330,140 348,236 228,196" fill="#37373e" />
        <polygon points="348,236 258,368 228,196" fill="#2c2c32" />
        <polygon points="228,196 258,368 150,352 150,250" fill="#232328" />
        <polygon points="150,250 150,352 84,220" fill="#313138" />
        <polygon points="228,196 150,250 84,220 118,120" fill="#3f3f47" />
      </g>

      {/* Depth overlay across the whole crystal */}
      <polygon
        points="210,46 330,140 348,236 258,368 150,352 84,220 118,120"
        fill="url(#rgh-depth)"
      />

      {/* Facet edges */}
      <g stroke="#7c7c88" strokeOpacity="0.32" strokeWidth="1">
        <line x1="228" y1="196" x2="210" y2="46" />
        <line x1="228" y1="196" x2="330" y2="140" />
        <line x1="228" y1="196" x2="348" y2="236" />
        <line x1="228" y1="196" x2="258" y2="368" />
        <line x1="228" y1="196" x2="150" y2="250" />
        <line x1="228" y1="196" x2="118" y2="120" />
        <line x1="150" y1="250" x2="150" y2="352" />
        <line x1="150" y1="250" x2="84" y2="220" />
      </g>
      <polygon
        points="210,46 330,140 348,236 258,368 150,352 84,220 118,120"
        fill="none"
        stroke="#8a8a96"
        strokeOpacity="0.5"
        strokeWidth="1.4"
      />
      {/* Light catching the upper edges */}
      <g stroke="#c2c2cd" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round">
        <line x1="118" y1="120" x2="210" y2="46" />
        <line x1="210" y1="46" x2="330" y2="140" />
      </g>

      {/* Mineral inclusions */}
      <g fill="#a2a2ae" opacity="0.35">
        <circle cx="182" cy="142" r="1.6" />
        <circle cx="242" cy="118" r="1.2" />
        <circle cx="204" cy="232" r="1.8" />
        <circle cx="262" cy="254" r="1.3" />
        <circle cx="162" cy="298" r="1.5" />
        <circle cx="298" cy="198" r="1.2" />
      </g>
    </svg>
  );
}
