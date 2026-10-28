/**
 * Sound Unleashed — shared brand logo.
 *
 * One identity used in the header and the footer. The symbol is a
 * rounded aubergine tile carrying a crescendo sound-wave — a wave whose
 * amplitude swells towards the middle and resolves to the right — with a
 * trailing pulse dot that suggests the beat continuing past the mark.
 *
 * Use `variant="header"` on light surfaces and `variant="footer"` on the
 * deep-purple footer. Colour treatment switches with the variant; the
 * artwork itself is defined exactly once.
 */

interface BrandLogoProps {
  variant?: 'header' | 'footer'
  className?: string
}

export function BrandLogo({ variant = 'header', className = '' }: BrandLogoProps) {
  const isFooter = variant === 'footer'

  // Symbol + wordmark sizes scale with the variant.
  const symbolSize = isFooter ? 'h-12 w-12' : 'h-10 w-10'
  const wordmarkSize = isFooter ? 'text-2xl' : 'text-xl'

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {/* ===== Symbol ===== */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className={`shrink-0 ${symbolSize}`}
        role="img"
        aria-label="Sound Unleashed"
      >
        <defs>
          {/* Tile: deep aubergine flowing into dark violet */}
          <linearGradient id="su-tile" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#251036" />
            <stop offset="1" stopColor="#39205C" />
          </linearGradient>
          {/* Wave: vibrant purple resolving into light violet */}
          <linearGradient id="su-wave" x1="9" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#863BFF" />
            <stop offset="1" stopColor="#B79CFF" />
          </linearGradient>
        </defs>

        {/* Foundation tile */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#su-tile)" />
        {/* Subtle inner ring for depth */}
        <rect
          x="3.25" y="3.25" width="41.5" height="41.5" rx="12.75"
          stroke="#863BFF" strokeOpacity="0.3" strokeWidth="1" fill="none"
        />

        {/* Crescendo wave — amplitude swells to the centre, then resolves */}
        <path
          d="M9 24 Q12 22 15 24 Q18 28 21 24 Q24 16 27 24 Q30 29 33 24 Q36 21.5 39 24"
          stroke="url(#su-wave)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Trailing pulse — the beat continues past the wave */}
        <circle cx="42.5" cy="24" r="1.9" fill="#B79CFF" />
      </svg>

      {/* ===== Wordmark ===== */}
      <span className={`flex items-baseline whitespace-nowrap font-semibold tracking-tight ${wordmarkSize}`}>
        <span className={isFooter ? 'text-white' : 'text-brand-deep'}>
          Sound
        </span>
        <span
          className={
            isFooter
              ? 'ml-1.5 font-extrabold text-lavender'
              : 'ml-1.5 font-extrabold text-brand-primary'
          }
        >
          Unleashed
        </span>
      </span>
    </span>
  )
}
