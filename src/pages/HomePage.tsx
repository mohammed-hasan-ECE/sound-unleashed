import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Music, Guitar, Headphones, List, Globe, ArrowRight } from 'lucide-react'
import { products } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'

const classicalCategories = [
  { name: 'Piano', image: '/images/instruments/piano.svg' },
  { name: 'Guitar', image: '/images/instruments/guitar.svg' },
  { name: 'Drums & Percussion', image: '/images/instruments/drums.svg' },
]

const electronicCategories = [
  { name: 'Synthesizers', image: '/images/instruments/synthesizer.svg' },
  { name: 'MIDI Controllers', image: '/images/instruments/midi.svg' },
  { name: 'Studio & Audio Equipment', image: '/images/instruments/studio.svg' },
  { name: 'Portable Keyboards', image: '/images/instruments/keyboard.svg' },
]

/** Returns the lowest recorded listing price for a product, or null. */
function getBestListingPrice(productId: string): number | null {
  const product = products.find((p) => p.id === productId)
  if (!product) return null
  const listingPrices = product.offers
    .filter((o) => o.priceType === 'listing' && o.price !== null)
    .map((o) => o.price as number)
  if (listingPrices.length === 0) return null
  return Math.min(...listingPrices)
}

/** Featured products: flagged records first, with a fallback to the first four. */
function getFeaturedProducts() {
  const flagged = products.filter((p) => p.isFeatured)
  return (flagged.length > 0 ? flagged : products).slice(0, 4)
}

export function HomePage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* ============ HERO ============ */}
      <section className="hero-surface overflow-hidden rounded-3xl">
        <div className="grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          {/* Copy — single vertical stack */}
          <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white/90 uppercase backdrop-blur">
              Music Equipment Discovery
            </span>
            <h1 className="max-w-xl text-4xl leading-[1.08] font-bold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-[52px]">
              Discover Your Sound
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              Sound Unleashed helps musicians explore instruments, compare dealer
              listings, and discover equipment suited to their musical interests.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start lg:justify-start">
              <Button
                size="lg"
                asChild
                className="bg-white text-brand-deep hover:bg-lavender"
              >
                <Link to="/purchase">
                  Explore Instruments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/40 bg-transparent text-white hover:border-white/70 hover:bg-white/10 hover:text-white"
              >
                <Link to="/about">Discover Our Concept</Link>
              </Button>
            </div>
          </div>

          {/* Imagery — balanced right column */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <img
              src="/images/instruments/piano.svg"
              alt="Digital piano — representative of the instruments in our catalogue"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/80 to-transparent p-4">
              <p className="text-xs font-medium text-white/85">
                Catalogue imagery — product photographs coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="flex flex-col gap-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-heading">
            Explore Instrument Categories
          </h2>
          <p className="mt-2 text-muted-foreground">
            Two curated groups covering classical and modern electronic instruments.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
          {/* Classical Instruments */}
          <div className="flex h-full min-w-0 flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lavender">
                <Music className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-heading">
                  Classical Instruments
                </h3>
                <p className="text-sm text-muted-foreground">
                  Traditional acoustic instruments
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {classicalCategories.map(({ name, image }) => (
                <Link
                  key={name}
                  to="/purchase"
                  className="group overflow-hidden rounded-xl border border-border bg-lavender-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <img
                    src={image}
                    alt={`${name} category`}
                    loading="lazy"
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="flex min-h-12 items-center justify-center px-3 py-2 text-center text-sm font-medium text-heading">
                    {name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Bottom-anchored action */}
            <div className="mt-auto pt-2">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/purchase">
                  Browse Classical
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Modern Electronic Instruments */}
          <div className="flex h-full min-w-0 flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lavender">
                <Headphones className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-heading">
                  Modern Electronic Instruments
                </h3>
                <p className="text-sm text-muted-foreground">
                  Synths, controllers, and studio gear
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {electronicCategories.map(({ name, image }) => (
                <Link
                  key={name}
                  to="/purchase"
                  className="group overflow-hidden rounded-xl border border-border bg-lavender-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <img
                    src={image}
                    alt={`${name} category`}
                    loading="lazy"
                    className="aspect-[4/3] h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="flex min-h-12 items-center justify-center px-2 py-2 text-center text-xs font-medium text-heading sm:text-sm">
                    {name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Bottom-anchored action */}
            <div className="mt-auto pt-2">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/purchase">
                  Browse Electronic
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED EQUIPMENT ============ */}
      <section className="flex flex-col gap-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-heading">
              Featured Equipment
            </h2>
            <p className="mt-2 text-muted-foreground">
              A selection from our current catalogue.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="hidden shrink-0 sm:inline-flex">
            <Link to="/purchase">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => {
            const bestPrice = getBestListingPrice(product.id)
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                brand={product.brand}
                category={product.category}
                description={product.description}
                imageUrl={product.imageUrl}
                price={bestPrice}
                priceType="listing"
              />
            )
          })}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="rounded-3xl bg-lavender-soft p-8 md:p-12">
        <h2 className="text-center text-3xl font-bold tracking-tight text-heading">
          How It Works
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: List,
              step: '1',
              title: 'Explore',
              text: 'Discover instruments and audio equipment in the catalogue.',
            },
            {
              icon: Guitar,
              step: '2',
              title: 'Compare',
              text: 'Review available retailer listings and recorded prices.',
            },
            {
              icon: Globe,
              step: '3',
              title: 'Visit Dealer',
              text: "Open the retailer's product page to check latest details or make a purchase.",
            },
          ].map(({ icon: Icon, step, title, text }) => (
            <div
              key={title}
              className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-card"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-lavender">
                <Icon className="h-6 w-6 text-brand-primary" />
                <span className="absolute top-0 right-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/3 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                  {step}
                </span>
              </div>
              <h3 className="mt-1 text-lg font-semibold text-heading">{title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-3xl border border-border bg-card p-8 text-center shadow-card sm:p-12">
        <h2 className="text-3xl font-bold tracking-tight text-heading">
          About Sound Unleashed
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Sound Unleashed is a proposed music equipment discovery and retailer-referral
          platform designed to help musicians explore instruments, compare dealer
          listings, and discover equipment suited to their musical interests.
        </p>
        <Button asChild size="lg">
          <Link to="/about">
            Learn More About Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
