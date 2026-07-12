type Props = {
  className?: string;
  label?: string;
  /**
   * "open"     — prongs undrawn, stone raised by GSAP (setting scene start)
   * "complete" — everything in place (final ring reveal)
   */
  state?: "open" | "complete";
  /** Warm, lighter contact shadow for light gallery backgrounds. */
  softShadow?: boolean;
};

/**
 * The ALMADERY solitaire — champagne-gold band, four-prong head and a round
 * brilliant diamond. Groups expose data attributes so the master timeline can
 * lower the stone (data-stone) and draw the prongs (data-prong) on scroll.
 */
export default function RingAssemblySVG({
  className,
  label,
  state = "complete",
  softShadow = false,
}: Props) {
  const complete = state === "complete";
  const prongDraw = complete
    ? {}
    : { pathLength: 100, strokeDasharray: 100, strokeDashoffset: 100 };
  return (
    <svg
      viewBox="0 0 440 500"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id="ras-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eed7ab" />
          <stop offset="0.45" stopColor="#c9a468" />
          <stop offset="1" stopColor="#7d5f33" />
        </linearGradient>
        <linearGradient id="ras-gold-soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9cfa0" />
          <stop offset="1" stopColor="#8a6b3b" />
        </linearGradient>
        <linearGradient id="ras-ice" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c8ccd6" />
        </linearGradient>
      </defs>

      <ellipse
        cx="220"
        cy="482"
        rx="150"
        ry="12"
        fill={softShadow ? "#6d5a3d" : "#000000"}
        opacity={softShadow ? 0.22 : 0.45}
      />

      {/* Band */}
      <g data-ring-band="">
        <circle
          cx="220"
          cy="330"
          r="128"
          fill="none"
          stroke="url(#ras-gold)"
          strokeWidth="24"
        />
        {/* inner rim light */}
        <circle
          cx="220"
          cy="330"
          r="117"
          fill="none"
          stroke="#f3e2c2"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
        {/* outer catch-light arc */}
        <path
          d="M 120 250 A 128 128 0 0 1 240 203"
          fill="none"
          stroke="#f7ead0"
          strokeOpacity="0.8"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Setting head / basket */}
      <g data-ring-head="">
        <path
          d="M186 196 L196 172 L244 172 L254 196"
          fill="none"
          stroke="url(#ras-gold-soft)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line x1="196" y1="184" x2="244" y2="184" stroke="#8a6b3b" strokeWidth="3" opacity="0.8" />
      </g>

      {/* The diamond — lowered into place by the timeline */}
      <g data-stone="">
        {/* pavilion */}
        <polygon points="164,128 220,168 192,128" fill="#dde1e9" />
        <polygon points="192,128 220,168 248,128" fill="#eef0f5" />
        <polygon points="248,128 220,168 276,128" fill="#c3c8d3" />
        {/* crown */}
        <polygon points="190,96 164,128 192,128" fill="#dfe3ea" />
        <polygon points="190,96 192,128 250,96" fill="#fbfbf9" />
        <polygon points="250,96 192,128 248,128" fill="#eef0f5" />
        <polygon points="250,96 248,128 276,128" fill="#ccd1db" />
        {/* champagne fire */}
        <polygon points="220,168 206,128 226,128" fill="#d0b384" opacity="0.28" />
        {/* edges */}
        <g stroke="#9aa0ad" strokeOpacity="0.55" strokeWidth="0.9">
          <line x1="192" y1="128" x2="220" y2="168" />
          <line x1="248" y1="128" x2="220" y2="168" />
          <line x1="192" y1="128" x2="190" y2="96" />
          <line x1="248" y1="128" x2="250" y2="96" />
        </g>
        <g stroke="#ffffff" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round">
          <line x1="190" y1="96" x2="250" y2="96" />
          <line x1="164" y1="128" x2="276" y2="128" />
        </g>
        <polygon
          points="190,96 250,96 276,128 220,168 164,128"
          fill="none"
          stroke="url(#ras-ice)"
          strokeOpacity="0.6"
          strokeWidth="1"
        />
        {/* table sparkle */}
        <path
          d="M204 104 l2.6 7.4 7.4 2.6 -7.4 2.6 -2.6 7.4 -2.6 -7.4 -7.4 -2.6 7.4 -2.6 Z"
          fill="#ffffff"
          opacity="0.95"
        />
      </g>

      {/* Prongs — drawn closed over the girdle by the timeline */}
      <g
        stroke="url(#ras-gold-soft)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      >
        <path data-prong="" {...prongDraw} d="M186 196 C 168 176, 158 148, 170 122" />
        <path data-prong="" {...prongDraw} d="M254 196 C 272 176, 282 148, 270 122" />
        <path data-prong="" {...prongDraw} d="M204 186 C 196 166, 194 146, 199 130" strokeWidth="5" opacity="0.85" />
        <path data-prong="" {...prongDraw} d="M236 186 C 244 166, 246 146, 241 130" strokeWidth="5" opacity="0.85" />
      </g>
    </svg>
  );
}
