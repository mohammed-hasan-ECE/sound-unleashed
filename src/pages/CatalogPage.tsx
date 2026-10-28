import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronDown, Search, SearchX, X } from 'lucide-react'
import { products } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import {
  SORT_OPTIONS,
  getDisplayPrice,
  getListingPriceBounds,
  getLowestListingPrice,
  isSortOption,
  matchesSearch,
  sortProducts,
  type SortOption,
} from '@/lib/catalogue'
import type { Product } from '@/types/product'

const PRICE_STEP = 500

const categoryCounts = new Map<string, number>()
const brandCounts = new Map<string, number>()
for (const product of products) {
  categoryCounts.set(product.category, (categoryCounts.get(product.category) ?? 0) + 1)
  brandCounts.set(product.brand, (brandCounts.get(product.brand) ?? 0) + 1)
}

const CATEGORY_OPTIONS = Array.from(categoryCounts.entries()).sort((a, b) =>
  a[0].localeCompare(b[0])
)
const BRAND_OPTIONS = Array.from(brandCounts.entries()).sort((a, b) =>
  a[0].localeCompare(b[0])
)

const PRICE_BOUNDS = getListingPriceBounds(products)
const PRICE_SLIDER_MIN = PRICE_BOUNDS
  ? Math.floor(PRICE_BOUNDS.min / PRICE_STEP) * PRICE_STEP
  : 0
const PRICE_SLIDER_MAX = PRICE_BOUNDS
  ? Math.ceil(PRICE_BOUNDS.max / PRICE_STEP) * PRICE_STEP
  : 0

interface FilterSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}

function FilterSelect({ id, label, value, onChange, children }: FilterSelectProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-border bg-card px-3 pr-9 text-sm font-medium text-text transition-colors hover:border-border-strong focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 focus:outline-none"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

interface AppliedFilterProps {
  label: string
  ariaLabel: string
  onRemove: () => void
}

function AppliedFilter({ label, ariaLabel, onRemove }: AppliedFilterProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={ariaLabel}
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border-strong bg-lavender px-3 text-xs font-medium text-brand-primary-dark transition-colors hover:border-brand-primary hover:bg-lavender-soft"
    >
      <span>{label}</span>
      <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </button>
  )
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q')?.trim() ?? ''
  const category = searchParams.get('category') ?? ''
  const brand = searchParams.get('brand') ?? ''
  const sortParam = searchParams.get('sort') ?? 'recommended'
  const sort: SortOption = isSortOption(sortParam) ? sortParam : 'recommended'

  const maxPriceParam = Number(searchParams.get('maxPrice'))
  const activeMaxPrice =
    PRICE_BOUNDS &&
    Number.isFinite(maxPriceParam) &&
    maxPriceParam > 0 &&
    maxPriceParam < PRICE_SLIDER_MAX
      ? Math.max(maxPriceParam, PRICE_SLIDER_MIN)
      : null

  // The input is a draft; the URL query is the applied value.
  const [searchInput, setSearchInput] = useState(query)
  const appliedQueryRef = useRef(query)

  const writeParams = useCallback(
    (updates: Record<string, string | null>, replace = false) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === '') next.delete(key)
            else next.set(key, value)
          }
          return next
        },
        { replace }
      )
    },
    [setSearchParams]
  )

  // Keep the input in step with URL navigation (e.g. back/forward, header
  // "Buy" link) without overwriting text the visitor is still typing.
  useEffect(() => {
    if (query === appliedQueryRef.current) return
    appliedQueryRef.current = query
    setSearchInput((current) => (current.trim() === query ? current : query))
  }, [query])

  // Debounce URL writes so typing does not rewrite history on every keystroke.
  useEffect(() => {
    const trimmed = searchInput.trim()
    if (trimmed === query) return

    const timer = window.setTimeout(() => {
      writeParams({ q: trimmed || null }, true)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [searchInput, query, writeParams])

  const { filteredProducts, hiddenNoPrice } = useMemo(() => {
    const searched = products.filter((product) => matchesSearch(product, query))
    const scoped = searched.filter(
      (product) =>
        (!category || product.category === category) &&
        (!brand || product.brand === brand)
    )

    if (activeMaxPrice === null) {
      return { filteredProducts: sortProducts(scoped, sort), hiddenNoPrice: 0 }
    }

    const priced: Product[] = []
    let hidden = 0

    for (const product of scoped) {
      const price = getLowestListingPrice(product)
      if (price === null) hidden += 1
      else if (price <= activeMaxPrice) priced.push(product)
    }

    return { filteredProducts: sortProducts(priced, sort), hiddenNoPrice: hidden }
  }, [query, category, brand, activeMaxPrice, sort])

  const categoryOptions =
    category && !categoryCounts.has(category)
      ? [...CATEGORY_OPTIONS, [category, 0] as [string, number]]
      : CATEGORY_OPTIONS

  const brandOptions =
    brand && !brandCounts.has(brand)
      ? [...BRAND_OPTIONS, [brand, 0] as [string, number]]
      : BRAND_OPTIONS

  const hasActiveFilters =
    Boolean(query) || Boolean(category) || Boolean(brand) || activeMaxPrice !== null

  const clearSearch = () => {
    setSearchInput('')
    writeParams({ q: null }, true)
  }

  const clearAllFilters = () => {
    setSearchInput('')
    writeParams({ q: null, category: null, brand: null, maxPrice: null })
  }

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    if (!Number.isFinite(value) || value >= PRICE_SLIDER_MAX) {
      writeParams({ maxPrice: null })
      return
    }
    writeParams({ maxPrice: String(value) })
  }

  const categoryHasNoProducts = Boolean(category) && !categoryCounts.has(category)
  const emptyIsCategoryOnly =
    categoryHasNoProducts && !query && !brand && activeMaxPrice === null

  return (
    <div className="flex flex-col gap-8">
      {/* ============ PAGE HEADING + SEARCH ============ */}
      <header className="rounded-2xl bg-lavender-soft p-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">
          Discover Instruments
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Browse classical and modern electronic instruments, search by name or brand,
          and compare recorded retailer listings. Purchases are completed on the
          retailer&apos;s own website.
        </p>

        <form
          role="search"
          aria-label="Catalogue search"
          onSubmit={(event) => event.preventDefault()}
          className="mt-6 max-w-2xl"
        >
          <label htmlFor="catalogue-search" className="sr-only">
            Search instruments, brands, and equipment
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="catalogue-search"
              type="text"
              inputMode="search"
              enterKeyHint="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search instruments, brands, and equipment..."
              className="h-12 w-full rounded-xl border border-border bg-card pr-12 pl-12 text-base text-text shadow-card-sm transition-colors placeholder:text-muted-foreground focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 focus:outline-none"
            />
            {searchInput.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-bg-muted hover:text-heading"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </header>

      {/* ============ FILTERS, SORTING, RESULT COUNT ============ */}
      <section
        aria-labelledby="filters-heading"
        className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="filters-heading" className="text-base font-semibold text-heading">
              Filters &amp; sorting
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Refine by category, brand, or recorded listing price.
            </p>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="shrink-0 text-brand-primary-dark"
            >
              <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Clear all filters
            </Button>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FilterSelect
            id="filter-category"
            label="Category"
            value={category}
            onChange={(value) => writeParams({ category: value || null })}
          >
            <option value="">All categories</option>
            {categoryOptions.map(([name, count]) => (
              <option key={name} value={name}>
                {name} ({count})
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            id="filter-brand"
            label="Brand"
            value={brand}
            onChange={(value) => writeParams({ brand: value || null })}
          >
            <option value="">All brands</option>
            {brandOptions.map(([name, count]) => (
              <option key={name} value={name}>
                {name} ({count})
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            id="sort-products"
            label="Sort by"
            value={sort}
            onChange={(value) =>
              writeParams({ sort: value === 'recommended' ? null : value })
            }
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </div>

        {PRICE_BOUNDS && (
          <div className="mt-5 border-t border-border pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label
                htmlFor="filter-price"
                className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
              >
                Maximum recorded listing price
              </label>
              <span className="text-sm font-semibold text-heading">
                {activeMaxPrice !== null
                  ? `Up to Rs. ${activeMaxPrice.toLocaleString('en-IN')}`
                  : 'Any price'}
              </span>
            </div>
            <input
              id="filter-price"
              type="range"
              min={PRICE_SLIDER_MIN}
              max={PRICE_SLIDER_MAX}
              step={PRICE_STEP}
              value={activeMaxPrice ?? PRICE_SLIDER_MAX}
              onChange={handlePriceChange}
              aria-valuetext={
                activeMaxPrice !== null
                  ? `Up to Rs. ${activeMaxPrice.toLocaleString('en-IN')}`
                  : 'Any recorded listing price'
              }
              className="mt-3 w-full cursor-pointer accent-brand-primary"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Uses recorded listing prices only — MRPs are excluded. Prices may change,
              so confirm details on the retailer&apos;s site.
            </p>
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Applied:</span>
            {query && (
              <AppliedFilter
                label={`Search: “${query}”`}
                ariaLabel={`Remove search filter: ${query}`}
                onRemove={clearSearch}
              />
            )}
            {category && (
              <AppliedFilter
                label={category}
                ariaLabel={`Remove category filter: ${category}`}
                onRemove={() => writeParams({ category: null })}
              />
            )}
            {brand && (
              <AppliedFilter
                label={brand}
                ariaLabel={`Remove brand filter: ${brand}`}
                onRemove={() => writeParams({ brand: null })}
              />
            )}
            {activeMaxPrice !== null && (
              <AppliedFilter
                label={`Up to Rs. ${activeMaxPrice.toLocaleString('en-IN')}`}
                ariaLabel="Remove price filter"
                onRemove={() => writeParams({ maxPrice: null })}
              />
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            Showing <span className="font-semibold text-heading">{filteredProducts.length}</span>{' '}
            of {products.length} instruments
          </p>
          <p className="text-xs text-muted-foreground">
            Recorded listings, not live quotations.
          </p>
        </div>

        {hiddenNoPrice > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {hiddenNoPrice} {hiddenNoPrice === 1 ? 'instrument has' : 'instruments have'} no
            recorded listing price and {hiddenNoPrice === 1 ? 'is' : 'are'} hidden while
            the price filter is active.
          </p>
        )}
      </section>

      {/* ============ RESULTS ============ */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const { price, priceType } = getDisplayPrice(product)
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
                price={price}
                priceType={priceType}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-10 text-center shadow-card sm:p-14">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender">
            <SearchX className="h-7 w-7 text-brand-primary" aria-hidden="true" />
          </div>
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold text-heading">
              {emptyIsCategoryOnly
                ? `No instruments are listed in ${category} yet.`
                : 'No instruments match your current search.'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {emptyIsCategoryOnly
                ? 'This category is part of the catalogue structure, but no products have been added to it yet. Browse the full catalogue in the meantime.'
                : 'Try a different search term, or remove some filters to see more of the catalogue.'}
            </p>
            {hiddenNoPrice > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {hiddenNoPrice} {hiddenNoPrice === 1 ? 'instrument has' : 'instruments have'}{' '}
                no recorded listing price and cannot be matched to the selected price.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasActiveFilters && (
              <Button onClick={clearAllFilters}>Clear search and filters</Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/purchase" onClick={clearAllFilters}>
                View all instruments
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
