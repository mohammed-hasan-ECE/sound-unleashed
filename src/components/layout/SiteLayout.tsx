import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { BrandIntro } from '@/components/brand/BrandIntro'
import { products } from '@/data/products'

/**
 * Application shell. Establishes the common layout:
 * - a skip link for keyboard and screen-reader users,
 * - full-height flex column so the footer sits at the bottom,
 * - one shared content container (max-w-7xl with responsive padding),
 * - scroll restoration and a document title on route changes.
 */

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Sound Unleashed — Find the Sound That Moves You',
  '/purchase': 'Discover Instruments — Sound Unleashed',
  '/finder': 'Help Me Find My Sound — Sound Unleashed',
  '/about': 'About Sound Unleashed',
  '/saved': 'Saved Items — Sound Unleashed',
  '/cart': 'Your Cart — Sound Unleashed',
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/product/')) {
    const slug = pathname.slice('/product/'.length)
    const product = products.find((item) => item.slug === slug)
    return product
      ? `${product.brand} ${product.name} — Sound Unleashed`
      : 'Product Not Found — Sound Unleashed'
  }

  return ROUTE_TITLES[pathname] ?? 'Sound Unleashed'
}

export function SiteLayout() {
  const { pathname } = useLocation()

  // Start each route at the top of the page. This intentionally does not run
  // for in-page anchors such as the homepage "Browse Categories" link.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.title = getPageTitle(pathname)
  }, [pathname])

  return (
    <BrandIntro>
      <div className="flex min-h-screen flex-col bg-bg text-text">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:bg-card focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-accent-text focus:shadow-card-lg focus:ring-2 focus:ring-brand-primary"
        >
          Skip to main content
        </a>
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 scroll-mt-20 focus:outline-none"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </BrandIntro>
  )
}
