import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowRight, Compass, Globe, Guitar, Headphones, List, Music } from 'lucide-react'
import { products } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { getLowestListingPrice } from '@/lib/catalogue'

/**
 * Homepage category labels mapped to the exact `category` values used by the
 * product records. Display labels differ in two places ("Drums & Percussion"
 * and "Studio & Audio Equipment"), so the mapping is explicit rather than
 * inferred from the visible name.
 */
const classicalCategories = [
  { name: 'Piano', category: 'Piano', image: '/images/instruments/piano.svg' },
  { name: 'Guitar', category: 'Guitar', image: '/images/instruments/guitar.svg' },
  {
    name: 'Drums & Percussion',
    category: 'Drums and Percussion',
    image: '/images/instruments/drums.svg',
  },
]

const electronicCategories = [
  {
    name: 'Synthesizers',
    category: 'Synthesizers',
    image: '/images/instruments/synthesizer.svg',
  },
  {
    name: 'MIDI Controllers',
    category: 'MIDI Controllers',
    image: '/images/instruments/midi.svg',
  },
  {
    // The catalogue currently has no studio/audio records in this category.
    // The link still opens an honest empty catalogue state.
    name: 'Studio & Audio Equipment',
    category: 'Studio & Audio Equipment',
    image: '/images/instruments/studio.svg',
  },
  {
    name: 'Portable Keyboards',
    category: 'Portable Keyboards',
    image: '/images/instruments/keyboard.svg',
  },
]

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
      <section className="hero-surface relative overflow-hidden rounded-3xl">
        {/* Controlled violet lighting behind the artwork — decorative only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full bg-brand-primary/25 blur-3xl"
        />

        <div className="relative grid grid-cols-1 items-center gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
          {/* Copy column — brand lockup first, then headline, copy, actions */}
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            {/* 1. Brand lockup */}
            <div className="su-reveal su-reveal-1">
              <BrandLogo variant="hero" />
            </div>

            {/* 2 + 3. Headline and supporting description */}
            <div className="flex flex-col gap-4">
              <h1 className="su-reveal su-reveal-2 max-w-xl text-4xl leading-[1.05] font-bold tracking-tight text-balance text-white drop-shadow-md sm:text-5xl lg:text-[54px]">
                Find the sound that moves you.
              </h1>
              <p className="su-reveal su-reveal-3 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                Sound Unleashed brings instruments and studio equipment together in one
                organised catalogue, so you can explore the gear, compare retailer
                listings, and buy directly from the retailer you choose.
              </p>
            </div>

            {/* 4 + 5. Primary CTA and secondary category link */}
            <div className="su-reveal su-reveal-4 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <Button
                size="lg"
                asChild
                className="bg-white text-brand-deep shadow-lg hover:bg-brand-lavender focus-visible:ring-white focus-visible:ring-offset-brand-deep"
              >
                <Link to="/purchase">
                  Explore Instruments
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href="#categories"
                className="group inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Browse Categories
                <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Instrument composition — the existing piano artwork, framed */}
          <div className="su-reveal su-reveal-5 relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 rounded-full bg-brand-primary/30 blur-3xl"
            />
            <figure className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-2 shadow-2xl">
              <img
                src="/images/instruments/piano.svg"
                alt="Digital piano — representative of the instruments in the Sound Unleashed catalogue"
                width={400}
                height={300}
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <figcaption className="px-2 pt-3 pb-1 text-center lg:text-left">
                <span className="text-[11px] font-semibold tracking-wider text-brand-light uppercase">
                  Instrument spotlight
                </span>
                <p className="mt-0.5 text-xs font-medium text-white/75">
                  Catalogue imagery — product photographs coming soon
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section id="categories" className="flex scroll-mt-28 flex-col gap-8">
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
                <Music className="h-6 w-6 text-brand-primary" aria-hidden="true" />
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
              {classicalCategories.map(({ name, category, image }) => (
                <Link
                  key={name}
                  to={`/purchase?category=${encodeURIComponent(category)}`}
                  className="group overflow-hidden rounded-xl border border-border bg-lavender-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <img
                    src={image}
                    alt={`${name} category`}
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
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
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Modern Electronic Instruments */}
          <div className="flex h-full min-w-0 flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lavender">
                <Headphones className="h-6 w-6 text-brand-primary" aria-hidden="true" />
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

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {electronicCategories.map(({ name, category, image }) => (
                <Link
                  key={name}
                  to={`/purchase?category=${encodeURIComponent(category)}`}
                  className="group overflow-hidden rounded-xl border border-border bg-lavender-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <img
                    src={image}
                    alt={`${name} category`}
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
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
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GUIDED FINDER ============ */}
      <section className="hero-surface relative overflow-hidden rounded-3xl p-8 md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-brand-primary/30 blur-3xl"
        />

        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-brand-light uppercase">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              Guided discovery
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              Not sure where to start?
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-white/80">
              Tell us what you&apos;re interested in, and we&apos;ll help you explore the
              instruments and equipment available in Sound Unleashed.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-brand-deep shadow-lg hover:bg-brand-lavender focus-visible:ring-white focus-visible:ring-offset-brand-deep"
              >
                <Link to="/finder">
                  Help Me Find My Sound
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <span className="text-xs text-white/60">
                Three quick questions. No account needed.
              </span>
            </div>
          </div>

          <ol className="grid gap-3">
            {[
              {
                title: 'Pick your interests',
                text: 'Choose the instrument categories you want to explore.',
              },
              {
                title: 'Tell us your goal',
                text: 'Prioritise related categories in your matches.',
              },
              {
                title: 'Set an optional budget',
                text: 'Narrow results by recorded listing price.',
              },
            ].map((item, index) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{item.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-white/70">
                    {item.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
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
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => {
            const bestPrice = getLowestListingPrice(product)
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
                <Icon className="h-6 w-6 text-brand-primary" aria-hidden="true" />
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
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
