import { useId } from 'react'

/**
 * Sound Unleashed — shared brand logo.
 *
 * One identity used in the header, the homepage hero, and the footer. The
 * symbol is a rounded aubergine tile carrying a crescendo sound-wave — a wave
 * whose amplitude swells towards the middle and resolves to the right — with a
 * trailing pulse dot that suggests the beat continuing past the mark.
 *
 * Sizes and colour treatment switch with the variant; the artwork itself is
 * defined exactly once, so the brand can never drift between surfaces.
 */

type BrandLogoVariant = 'header' | 'hero' | 'intro' | 'footer'

interface BrandLogoProps {
  variant?: BrandLogoVariant
  className?: string
  /** Extra classes for the wordmark only, e.g. its intro reveal animation. */
  wordmarkClassName?: string
}

interface VariantStyle {
  symbol: string
  wordmark: string
  firstWord: string
  secondWord: string
}

const VARIANTS: Record<BrandLogoVariant, VariantStyle> = {
  // Compact: sticky header. Both words use theme-aware tokens so the wordmark
  // keeps AA contrast on the lavender canvas and on the dark plum canvas.
  header: {
    symbol: 'h-10 w-10',
    wordmark: 'text-xl',
    firstWord: 'text-heading',
    secondWord: 'text-accent-text',
  },
  // Large, light-on-dark: the hero brand lockup.
  hero: {
    symbol: 'h-14 w-14 sm:h-16 sm:w-16',
    wordmark: 'text-2xl sm:text-3xl',
    firstWord: 'text-white',
    secondWord: 'text-brand-light',
  },
  // Extra large, light-on-dark: the opening intro screen.
  intro: {
    symbol: 'h-16 w-16 sm:h-24 sm:w-24',
    wordmark: 'text-3xl sm:text-5xl',
    firstWord: 'text-white',
    secondWord: 'text-brand-light',
  },
  // Mid-size, light-on-dark: footer.
  footer: {
    symbol: 'h-12 w-12',
    wordmark: 'text-2xl',
    firstWord: 'text-white',
    secondWord: 'text-brand-lavender',
  },
}

export function BrandLogo({
  variant = 'header',
  className = '',
  wordmarkClassName = '',
}: BrandLogoProps) {
  const style = VARIANTS[variant]

  // Unique gradient ids: several logos (header + hero + footer) can share a
  // page, and duplicate SVG ids are invalid markup.
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '')
  const tileId = `su-tile-${uid}`
  const waveId = `su-wave-${uid}`

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {/* ===== Symbol ===== */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        className={`shrink-0 ${style.symbol}`}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Tile: deep aubergine flowing into dark violet */}
          <linearGradient id={tileId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#251036" />
            <stop offset="1" stopColor="#39205C" />
          </linearGradient>
          {/* Wave: vibrant purple resolving into light violet */}
          <linearGradient id={waveId} x1="9" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#863BFF" />
            <stop offset="1" stopColor="#B79CFF" />
          </linearGradient>
        </defs>

        {/* Foundation tile */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${tileId})`} />
        {/* Subtle inner ring for depth */}
        <rect
          x="3.25" y="3.25" width="41.5" height="41.5" rx="12.75"
          stroke="#863BFF" strokeOpacity="0.3" strokeWidth="1" fill="none"
        />

        {/* Crescendo wave — amplitude swells to the centre, then resolves */}
        <path
          d="M9 24 Q12 22 15 24 Q18 28 21 24 Q24 16 27 24 Q30 29 33 24 Q36 21.5 39 24"
          stroke={`url(#${waveId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Trailing pulse — the beat continues past the wave */}
        <circle cx="42.5" cy="24" r="1.9" fill="#B79CFF" />
      </svg>

      {/* ===== Wordmark ===== */}
      <span
        className={`flex items-baseline whitespace-nowrap font-semibold tracking-tight ${style.wordmark} ${wordmarkClassName}`}
      >
        <span className={style.firstWord}>Sound</span>
        <span className={`ml-1.5 font-extrabold ${style.secondWord}`}>Unleashed</span>
      </span>
    </span>
  )
}
