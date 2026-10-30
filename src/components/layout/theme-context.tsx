import { createContext } from 'react'

/** What the visitor has chosen. `system` follows the operating system. */
export type ThemePreference = 'system' | 'light' | 'dark'

/** What is actually painted right now. */
export type ResolvedTheme = 'light' | 'dark'

export type ThemeProviderState = {
  /** Resolved appearance currently applied to the document. */
  theme: ResolvedTheme
  /** Stored preference: system, light, or dark. */
  preference: ThemePreference
  /** Persist a new preference and apply it immediately. */
  setTheme: (preference: ThemePreference) => void
}

/**
 * Dedicated key for the appearance choice. The four ShopContext keys are
 * untouched; this value lives alongside them.
 */
export const THEME_STORAGE_KEY = 'sound-unleashed:theme:v1'

export const ThemeProviderContext =
  createContext<ThemeProviderState | undefined>(undefined)
