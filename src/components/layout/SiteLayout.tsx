import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Application shell. Establishes the common layout:
 * - full-height flex column so the footer sits at the bottom,
 * - one shared content container (max-w-7xl with responsive padding).
 */
export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Header />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
