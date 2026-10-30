import { useCallback, useEffect, useState } from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeProviderContext,
  type ResolvedTheme,
  type ThemePreference,
} from './theme-context'

type ThemeProviderProps = {
  children: React.ReactNode
}

const DARK_QUERY = '(prefers-color-scheme: dark)'
const LIGHT_THEME_COLOR = '#251036'
const DARK_THEME_COLOR = '#160c22'

function isPreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

/** Read the saved preference, tolerating unavailable or blocked storage. */
function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isPreference(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(DARK_QUERY).matches
}

/**
 * Appearance provider.
 *
 * - `system` follows `prefers-color-scheme` and keeps following it.
 * - `light` / `dark` are explicit and ignore system changes.
 * - The choice is saved under its own key, separate from shop storage.
 * - Applies the `dark` class and `color-scheme` to <html> so native inputs,
 *   selects, scrollbars, and browser UI match the selected appearance.
 *
 * The pre-paint script in index.html applies the same class before React
 * mounts, so there is no flash of the wrong theme.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreference] = useState<ThemePreference>(readStoredPreference)
  const [systemDark, setSystemDark] = useState<boolean>(systemPrefersDark)

  const theme: ResolvedTheme =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference

  // Follow operating-system changes whenever System is selected. The listener
  // always records the latest system value; `theme` only reads it while the
  // preference is `system`, so an explicit Light/Dark choice is unaffected.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const query = window.matchMedia(DARK_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  // Reflect the resolved theme on the document. This effect also keeps the
  // meta theme-color in step with the browser chrome.
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.theme = theme
    root.style.colorScheme = theme

    const meta = window.document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR)
  }, [theme])

  // Keep multiple tabs in step with the same preference.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== THEME_STORAGE_KEY) return
      setPreference(readStoredPreference())
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setTheme = useCallback((next: ThemePreference) => {
    setPreference(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the choice still applies for this page view.
    }
  }, [])

  return (
    <ThemeProviderContext.Provider value={{ theme, preference, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
