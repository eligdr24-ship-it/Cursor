type LogoProps = {
  variant?: 'full' | 'emblem' | 'wordmark'
  className?: string
  emblemClassName?: string
  wordmarkClassName?: string
  subtitleClassName?: string
  showSubtitle?: boolean
}

/** Geometric A monogram formed from diamond facets within a refined hallmark. */
export function AlmaderyLogo({
  variant = 'full',
  className = '',
  emblemClassName = '',
  wordmarkClassName = '',
  subtitleClassName = '',
  showSubtitle = true,
}: LogoProps) {
  const emblem = (
    <svg
      className={emblemClassName}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={variant !== 'emblem'}
      role={variant === 'emblem' ? 'img' : undefined}
    >
      {variant === 'emblem' && <title>ALMADERY emblem</title>}
      {/* Outer hallmark octagon */}
      <path
        d="M28 6 L52 6 L74 28 L74 52 L52 74 L28 74 L6 52 L6 28 Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.85"
      />
      {/* Inner diamond frame */}
      <path
        d="M40 14 L58 32 L40 66 L22 32 Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      {/* Faceted A — left stroke */}
      <path
        d="M40 20 L26 54"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Faceted A — right stroke */}
      <path
        d="M40 20 L54 54"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* A crossbar as facet line */}
      <path
        d="M31 42 L49 42"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Crown facet highlight */}
      <path
        d="M34 32 L40 22 L46 32 Z"
        fill="currentColor"
        opacity="0.28"
      />
      {/* Subtle ring arc beneath A */}
      <path
        d="M28 56 C32 62, 48 62, 52 56"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
        strokeLinecap="round"
      />
    </svg>
  )

  if (variant === 'emblem') {
    return <div className={className}>{emblem}</div>
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {(variant === 'full' || variant === 'wordmark') && (
        <>
          {variant === 'full' && (
            <div className={`mb-5 text-champagne ${emblemClassName || 'w-16 h-16 md:w-20 md:h-20'}`}>
              {emblem}
            </div>
          )}
          <p
            className={`font-display tracking-[0.42em] uppercase text-soft-ivory ${
              wordmarkClassName || 'text-2xl md:text-3xl font-light'
            }`}
          >
            ALMADERY
          </p>
          {showSubtitle && (
            <p
              className={`mt-3 font-body font-light uppercase tracking-[0.28em] text-muted-beige ${
                subtitleClassName || 'text-[0.625rem] md:text-xs'
              }`}
            >
              Fine Diamonds &amp; Gold Jewellery
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default AlmaderyLogo
