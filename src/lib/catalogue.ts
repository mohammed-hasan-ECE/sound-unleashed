import type { Product } from '@/types/product'

/**
 * Shared catalogue helpers.
 *
 * All price logic here is based on `offers[].priceType === 'listing'`.
 * MRPs, catalogue-only offers, null prices, and non-numeric values are never
 * treated as comparable listing prices.
 */

export type SortOption =
  | 'recommended'
  | 'name-asc'
  | 'brand-asc'
  | 'price-asc'
  | 'price-desc'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'brand-asc', label: 'Brand: A–Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

export function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value)
}

/** Every valid recorded listing price for a product. MRPs are excluded. */
export function getListingPrices(product: Product): number[] {
  return product.offers
    .filter((offer) => offer.priceType === 'listing')
    .map((offer) => offer.price)
    .filter(
      (price): price is number =>
        typeof price === 'number' && Number.isFinite(price) && price > 0
    )
}

/**
 * The comparable "from" price for filtering and price sorting: the lowest
 * valid recorded listing price. Returns null when no listing price is known.
 */
export function getLowestListingPrice(product: Product): number | null {
  const prices = getListingPrices(product)
  return prices.length > 0 ? Math.min(...prices) : null
}

/**
 * The price displayed on a product card: the lowest valid recorded listing
 * price, falling back to a recorded MRP when no listing price exists. Using
 * the same "from" price as filtering and sorting keeps price order readable.
 * It is a recorded price, not a live quotation.
 */
export function getDisplayPrice(product: Product): {
  price: number | null
  priceType: 'listing' | 'mrp' | 'catalogue'
} {
  const listing = getLowestListingPrice(product)
  if (listing !== null) return { price: listing, priceType: 'listing' }

  const mrp = product.offers.find(
    (offer) => offer.priceType === 'mrp' && offer.price !== null
  )
  if (mrp) return { price: mrp.price, priceType: 'mrp' }

  return { price: null, priceType: 'listing' }
}

/**
 * Case-insensitive multi-term search over the fields the catalogue actually
 * has. Every term must appear somewhere in the product's searchable text.
 */
export function matchesSearch(product: Product, query: string): boolean {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  if (terms.length === 0) return true

  const haystack = [
    product.name,
    product.brand,
    product.category,
    product.group,
    product.description,
  ]
    .join(' ')
    .toLowerCase()

  return terms.every((term) => haystack.includes(term))
}

/**
 * Price sorting uses the lowest valid recorded listing price and always puts
 * products without a listing price last, regardless of direction.
 */
function compareByListingPrice(a: Product, b: Product, direction: 1 | -1): number {
  const priceA = getLowestListingPrice(a)
  const priceB = getLowestListingPrice(b)

  if (priceA === null && priceB === null) return a.name.localeCompare(b.name)
  if (priceA === null) return 1
  if (priceB === null) return -1
  if (priceA === priceB) return a.name.localeCompare(b.name)

  return direction * (priceA - priceB)
}

/** Returns a sorted copy; the source array is never mutated. */
export function sortProducts(list: Product[], sort: SortOption): Product[] {
  const sorted = [...list]

  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'brand-asc':
      return sorted.sort(
        (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
      )
    case 'price-asc':
      return sorted.sort((a, b) => compareByListingPrice(a, b, 1))
    case 'price-desc':
      return sorted.sort((a, b) => compareByListingPrice(a, b, -1))
    case 'recommended':
    default:
      // Preserve the catalogue's own order.
      return sorted
  }
}

/** Lowest and highest comparable listing prices across a set of products. */
export function getListingPriceBounds(list: Product[]): { min: number; max: number } | null {
  const prices = list
    .map((product) => getLowestListingPrice(product))
    .filter((price): price is number => price !== null)

  if (prices.length === 0) return null

  return { min: Math.min(...prices), max: Math.max(...prices) }
}
