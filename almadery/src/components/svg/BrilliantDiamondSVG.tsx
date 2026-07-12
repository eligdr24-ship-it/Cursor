type Props = { className?: string; label?: string };

/**
 * A polished round brilliant diamond in profile — crown, girdle and pavilion
 * with precise symmetrical facets and quiet champagne fire.
 */
export default function BrilliantDiamondSVG({ className, label }: Props) {
  return (
    <svg
      viewBox="0 0 440 400"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id="brl-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#8f96a6" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <ellipse cx="220" cy="384" rx="120" ry="10" fill="#000000" opacity="0.35" />

      {/* Pavilion */}
      <g>
        <polygon points="66,150 130,150 220,368" fill="#ccd0da" />
        <polygon points="130,150 220,150 220,368" fill="#eef0f5" />
        <polygon points="220,150 310,150 220,368" fill="#dde1e9" />
        <polygon points="310,150 374,150 220,368" fill="#b7bcc9" />
      </g>

      {/* Crown */}
      <g>
        <polygon points="150,70 66,150 130,150" fill="#dfe3ea" />
        <polygon points="150,70 130,150 220,150" fill="#f2f4f7" />
        <polygon points="150,70 290,70 220,150" fill="#fbfbf9" />
        <polygon points="290,70 220,150 310,150" fill="#e6e9ef" />
        <polygon points="290,70 310,150 374,150" fill="#cdd2dc" />
      </g>

      {/* Champagne fire accents */}
      <g fill="#d0b384">
        <polygon points="220,150 246,150 220,368" opacity="0.26" />
        <polygon points="150,70 130,150 162,150" opacity="0.16" />
        <polygon points="290,70 310,150 286,150" opacity="0.12" />
      </g>

      {/* Sheen over the whole stone */}
      <polygon
        points="150,70 290,70 374,150 220,368 66,150"
        fill="url(#brl-sheen)"
      />

      {/* Facet edges */}
      <g stroke="#9aa0ad" strokeOpacity="0.55" strokeWidth="1">
        <line x1="150" y1="70" x2="66" y2="150" />
        <line x1="150" y1="70" x2="130" y2="150" />
        <line x1="150" y1="70" x2="220" y2="150" />
        <line x1="290" y1="70" x2="220" y2="150" />
        <line x1="290" y1="70" x2="310" y2="150" />
        <line x1="290" y1="70" x2="374" y2="150" />
        <line x1="130" y1="150" x2="220" y2="368" />
        <line x1="220" y1="150" x2="220" y2="368" />
        <line x1="310" y1="150" x2="220" y2="368" />
      </g>
      <g stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.4" strokeLinecap="round">
        <line x1="150" y1="70" x2="290" y2="70" />
        <line x1="66" y1="150" x2="374" y2="150" />
      </g>
      <polygon
        points="150,70 290,70 374,150 220,368 66,150"
        fill="none"
        stroke="#c8ccd6"
        strokeOpacity="0.7"
        strokeWidth="1.2"
      />

      {/* Quiet sparkle on the table */}
      <path
        d="M176 92 l3.5 10 10 3.5 -10 3.5 -3.5 10 -3.5 -10 -10 -3.5 10 -3.5 Z"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
  );
}
