import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, Home, Heart, Info, Music } from 'lucide-react'
import { useState } from 'react'
import { useShop } from '@/context/ShopContext'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { ThemeToggle } from './ThemeToggle'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Buy', href: '/purchase', icon: Music },
  { name: 'Saved', href: '/saved', icon: Heart },
  { name: 'Cart', href: '/cart', icon: ShoppingCart },
  { name: 'About', href: '/about', icon: Info },
]

export function Header() {
  const location = useLocation()
  // The menu is tied to the route it was opened on, so a route change closes
  // it without an effect that sets state after render.
  const [menu, setMenu] = useState({ open: false, pathname: location.pathname })
  const { savedIds, cartItemCount } = useShop()

  const mobileMenuOpen = menu.open && menu.pathname === location.pathname

  const toggleMobileMenu = () => {
    setMenu({ open: !mobileMenuOpen, pathname: location.pathname })
  }

  const closeMobileMenu = () => {
    setMenu({ open: false, pathname: location.pathname })
  }

  const isActive = (href: string) =>
    location.pathname === href || (href !== '/' && location.pathname.startsWith(href))

  const countFor = (name: string) =>
    name === 'Saved' ? savedIds.size : name === 'Cart' ? cartItemCount : 0

  const countLabelFor = (count: number) =>
    `${count} ${count === 1 ? 'item' : 'items'}`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 shadow-card-sm backdrop-blur">
      {/* Shared page container */}
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo — anchored left, never clipped */}
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="Sound Unleashed — Home"
        >
          <BrandLogo variant="header" />
        </Link>

        {/* Desktop navigation + appearance control */}
        <div className="flex items-center gap-1.5 lg:gap-2">
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navigation.map(({ name, href, icon: Icon }) => {
              const count = countFor(name)
              return (
                <Link
                  key={name}
                  to={href}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive(href)
                      ? 'bg-lavender text-accent-text'
                      : 'text-text hover:bg-bg-muted hover:text-accent-text'
                  }`}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {name}
                  {count > 0 && (
                    <>
                      <span
                        aria-hidden="true"
                        className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-xs font-semibold text-white"
                      >
                        {count}
                      </span>
                      <span className="sr-only">{countLabelFor(count)}</span>
                    </>
                  )}
                </Link>
              )
            })}
          </nav>

          <ThemeToggle />

          {/* Mobile toggle — only below the lg breakpoint */}
          <button
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-text transition-colors hover:bg-bg-muted lg:hidden"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu — full-width rows, counts aligned right. It stays in the
          DOM so the toggle's aria-controls target always exists; `hidden`
          keeps it out of the accessibility tree while closed. */}
      <nav
        id="mobile-navigation"
        hidden={!mobileMenuOpen}
        className="border-t border-border bg-card px-4 pt-2 pb-4 sm:px-6 lg:hidden"
        aria-label="Mobile"
      >
        <div className="flex flex-col gap-1">
          {navigation.map(({ name, href, icon: Icon }) => {
            const count = countFor(name)
            return (
              <Link
                key={name}
                to={href}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-base font-medium transition-colors ${
                  isActive(href)
                    ? 'bg-lavender text-accent-text'
                    : 'text-text hover:bg-bg-muted'
                }`}
                aria-current={isActive(href) ? 'page' : undefined}
                onClick={closeMobileMenu}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {name}
                {count > 0 && (
                  <span
                    aria-hidden="true"
                    className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-xs font-semibold text-white"
                  >
                    {count}
                  </span>
                )}
                {count > 0 && (
                  <span className="sr-only">{countLabelFor(count)}</span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
