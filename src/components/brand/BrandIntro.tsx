import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { Button } from '@/components/ui/button'

/** Marker for "the intro has been shown in this browser session". */
const INTRO_SESSION_KEY = 'sound-unleashed:intro-seen:v1'

/** How long the one-shot reveal runs before the homepage is revealed. */
const AUTO_REVEAL_MS = 1700
/** Length of the polite fade back to the homepage. */
const FADE_OUT_MS = 260

type IntroPhase = 'open' | 'closing' | 'closed'

function hasSeenIntro(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === '1'
  } catch {
    // Storage unavailable: show the intro, but it can always be dismissed and
    // it closes by itself.
    return false
  }
}

function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, '1')
  } catch {
    // Ignore: the intro still works for this page view.
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface BrandIntroProps {
  children: ReactNode
}

/**
 * First-run brand intro for the homepage.
 *
 * Shown only when the session starts on `/` and the marker is absent. Direct
 * links to any other route, later in-app navigation, refreshes, and React
 * Strict Mode never replay it. Visitors who prefer reduced motion skip straight
 * to the homepage — the intro is decorative, not a gate.
 *
 * The shell is marked `inert` while the overlay is open, so keyboard and
 * assistive-technology focus stay inside the dialog. Focus returns to the main
 * landmark once it closes.
 */
export function BrandIntro({ children }: BrandIntroProps) {
  const { pathname } = useLocation()

  const [phase, setPhase] = useState<IntroPhase>(() =>
    pathname === '/' && !hasSeenIntro() && !prefersReducedMotion() ? 'open' : 'closed'
  )

  const dialogRef = useRef<HTMLDivElement>(null)
  // Remember whether this mount ever showed the intro, so focus is only
  // redirected to the main landmark after an intro — not on every page load.
  const introWasShown = useRef(phase !== 'closed')

  const blocking = phase !== 'closed' && pathname === '/'

  const beginClose = useCallback(() => {
    markIntroSeen()
    setPhase((current) => (current === 'open' ? 'closing' : current))
  }, [])

  // Logo, Enter, Skip, and Escape reveal the homepage without waiting for the
  // remaining animation (or for the fade).
  const closeNow = useCallback(() => {
    markIntroSeen()
    setPhase('closed')
  }, [])

  // Focus the dialog itself when it appears; Tab then reaches the logo first.
  useEffect(() => {
    if (blocking) dialogRef.current?.focus({ preventScroll: true })
  }, [blocking])

  // Automatic reveal after the short animation.
  useEffect(() => {
    if (phase !== 'open') return
    const timer = window.setTimeout(beginClose, AUTO_REVEAL_MS)
    return () => window.clearTimeout(timer)
  }, [phase, beginClose])

  // Let the fade finish before unmounting the overlay.
  useEffect(() => {
    if (phase !== 'closing') return
    const timer = window.setTimeout(() => setPhase('closed'), FADE_OUT_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  // Keep the page behind the overlay from scrolling while it is open.
  useEffect(() => {
    if (!blocking) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [blocking])

  // Move focus to the start of the page once the intro is gone.
  useEffect(() => {
    if (phase !== 'closed' || !introWasShown.current) return
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [phase])

  return (
    <>
      <div
        inert={blocking || undefined}
        aria-hidden={blocking || undefined}
        className="flex min-h-screen flex-col"
      >
        {children}
      </div>

      {blocking && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-title"
          aria-describedby="intro-tagline"
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              closeNow()
            }
          }}
          className={`su-intro fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-brand-deep px-6 py-10 text-center focus:outline-none ${
            phase === 'closing' ? 'is-closing' : ''
          }`}
        >
          {/* Soft violet glow — decorative, one-shot */}
          <div
            aria-hidden="true"
            className="su-intro-glow pointer-events-none absolute h-[24rem] w-[24rem] rounded-full bg-brand-primary/30 blur-3xl sm:h-[30rem] sm:w-[30rem]"
          />

          <h2 id="intro-title" className="sr-only">
            Welcome to Sound Unleashed
          </h2>

          {/* The mark doubles as an entrance button */}
          <button
            type="button"
            onClick={closeNow}
            aria-label="Enter Sound Unleashed"
            className="su-intro-logo relative rounded-3xl px-4 py-3 transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-4 focus-visible:ring-offset-brand-deep focus-visible:outline-none"
          >
            <BrandLogo variant="intro" wordmarkClassName="su-intro-wordmark" />
          </button>

          {/* Audio-wave reveal */}
          <div
            aria-hidden="true"
            className="relative mt-8 flex h-10 items-end gap-1.5"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <span
                key={index}
                className="su-intro-bar w-1.5 rounded-full bg-brand-light/80"
                style={{
                  height: `${16 + (index % 4) * 8}px`,
                  animationDelay: `${240 + index * 55}ms`,
                }}
              />
            ))}
          </div>

          <p
            id="intro-tagline"
            className="su-intro-tagline relative mt-6 text-lg text-white/80 sm:text-xl"
          >
            Discover your next sound.
          </p>

          <div className="relative mt-10 flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={closeNow}
              className="bg-white text-brand-deep shadow-lg hover:bg-brand-lavender focus-visible:ring-white focus-visible:ring-offset-brand-deep"
            >
              Enter Sound Unleashed
            </Button>
            <button
              type="button"
              onClick={closeNow}
              className="min-h-11 rounded-lg px-3 text-sm font-medium text-white/70 underline underline-offset-4 transition-colors hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep focus-visible:outline-none"
            >
              Skip intro
            </button>
          </div>
        </div>
      )}
    </>
  )
}
