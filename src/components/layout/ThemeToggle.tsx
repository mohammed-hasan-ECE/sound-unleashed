import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from './use-theme'
import type { ThemePreference } from './theme-context'

interface AppearanceOption {
  value: ThemePreference
  label: string
  description: string
  icon: typeof Sun
}

const OPTIONS: AppearanceOption[] = [
  {
    value: 'system',
    label: 'System',
    description: 'Follow your device',
    icon: Monitor,
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Lavender daylight',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Deep plum night',
    icon: Moon,
  },
]

/**
 * Header appearance control: an accessible menu with System, Light, and Dark.
 *
 * Implements the standard menu-button pattern — the trigger reports
 * `aria-expanded`, opening moves focus into the menu, arrow keys move between
 * options, Escape closes and returns focus to the trigger.
 */
export function ThemeToggle() {
  const { preference, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const selectedIndex = Math.max(
    OPTIONS.findIndex((option) => option.value === preference),
    0
  )
  const CurrentIcon = (OPTIONS[selectedIndex] ?? OPTIONS[0]).icon
  const currentLabel = (OPTIONS[selectedIndex] ?? OPTIONS[0]).label

  // Close when the visitor clicks anywhere outside the control.
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  const focusOption = (index: number) => {
    itemRefs.current[(index + OPTIONS.length) % OPTIONS.length]?.focus()
  }

  const openMenu = (focusIndex = selectedIndex) => {
    setOpen(true)
    window.requestAnimationFrame(() => focusOption(focusIndex))
  }

  const closeMenu = (returnFocus = true) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const choose = (value: ThemePreference) => {
    setTheme(value)
    closeMenu()
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu(event.key === 'ArrowDown' ? selectedIndex : OPTIONS.length - 1)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      closeMenu()
    }
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const activeIndex = itemRefs.current.findIndex(
      (item) => item === document.activeElement
    )

    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
    } else if (event.key === 'Tab') {
      // Tabbing out of the menu closes it and lets focus continue naturally.
      setOpen(false)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(activeIndex + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusOption(activeIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusOption(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusOption(OPTIONS.length - 1)
    }
  }

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeMenu(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        aria-label={`Appearance: ${currentLabel}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="appearance-menu"
        title={`Appearance: ${currentLabel}`}
        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
          open
            ? 'bg-lavender text-accent-text'
            : 'text-text hover:bg-bg-muted hover:text-accent-text'
        }`}
      >
        <CurrentIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      <div
        id="appearance-menu"
        role="menu"
        aria-label="Appearance"
        hidden={!open}
        onKeyDown={handleMenuKeyDown}
        className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-card-lg"
      >
        <p className="px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Appearance
        </p>
        {OPTIONS.map((option, index) => {
          const Icon = option.icon
          const selected = option.value === preference

          return (
            <button
              key={option.value}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              tabIndex={-1}
              onClick={() => choose(option.value)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                selected
                  ? 'bg-lavender text-accent-text'
                  : 'text-text hover:bg-bg-muted'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
              {selected && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
