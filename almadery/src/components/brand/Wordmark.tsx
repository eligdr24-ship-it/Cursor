type WordmarkProps = {
  className?: string;
  title?: string;
};

/** ALMADERY wordmark rendered as scalable inline SVG type. */
export default function Wordmark({ className, title = "ALMADERY" }: WordmarkProps) {
  return (
    <svg viewBox="0 0 620 78" className={className} role="img" aria-label={title}>
      <text
        x="310"
        y="58"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="56"
        fontWeight={400}
        letterSpacing="17"
        fill="currentColor"
      >
        ALMADERY
      </text>
    </svg>
  );
}
