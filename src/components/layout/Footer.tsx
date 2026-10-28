import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/brand/BrandLogo'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-brand-deep text-white">
      {/* Shared page container */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          {/* Centred brand block */}
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 text-center">
            <BrandLogo variant="footer" />
            <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-white/70">
              A music equipment discovery platform that helps you find the right gear
              through organised categories and direct links to retailer websites.
            </p>
          </div>

          {/* Centred navigation */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm"
            aria-label="Footer"
          >
            <Link to="/" className="text-white/90 transition-colors hover:text-white">
              Home
            </Link>
            <Link to="/purchase" className="text-white/90 transition-colors hover:text-white">
              Buy
            </Link>
            <Link to="/saved" className="text-white/90 transition-colors hover:text-white">
              Saved
            </Link>
            <Link to="/cart" className="text-white/90 transition-colors hover:text-white">
              Cart
            </Link>
            <Link to="/about" className="text-white/90 transition-colors hover:text-white">
              About
            </Link>
          </nav>

          {/* Disclosure + copyright */}
          <div className="mx-auto w-full max-w-2xl border-t border-white/15 pt-6 text-center">
            <p className="text-xs leading-relaxed text-white/60">
              Sound Unleashed is a product-discovery prototype. Actual purchases are
              completed on external retailer websites.
            </p>
            <p className="mt-3 text-xs text-white/60">
              © {currentYear} Sound Unleashed. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
