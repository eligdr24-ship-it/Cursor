type EmblemProps = {
  className?: string;
  /** When true, paths are prepared for GSAP stroke-draw animation. */
  drawable?: boolean;
  strokeWidth?: number;
  title?: string;
};

/**
 * ALMADERY emblem — a geometric "A" whose crossbar is a brilliant-cut lozenge,
 * enclosed in an elongated octagonal jewellery hallmark.
 */
export default function Emblem({
  className,
  drawable = false,
  strokeWidth = 2.5,
  title,
}: EmblemProps) {
  const draw = drawable
    ? { pathLength: 100, strokeDasharray: 100, "data-draw": "" }
    : {};
  return (
    <svg
      viewBox="0 0 120 150"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path {...draw} d="M36 6 H84 L114 36 V114 L84 144 H36 L6 114 V36 Z" />
        <path
          {...draw}
          opacity={0.45}
          strokeWidth={strokeWidth * 0.4}
          d="M39.5 14 H80.5 L106 39.5 V110.5 L80.5 136 H39.5 L14 110.5 V39.5 Z"
        />
        <path {...draw} d="M60 30 L36 122" />
        <path {...draw} d="M60 30 L84 122" />
        <path {...draw} d="M60 76 L70 87 L60 98 L50 87 Z" />
      </g>
    </svg>
  );
}
