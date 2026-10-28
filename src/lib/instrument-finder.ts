import { products } from '@/data/products'
import { getLowestListingPrice } from '@/lib/catalogue'
import type { Product } from '@/types/product'

/**
 * Rule-based instrument finder.
 *
 * Everything here is derived from the real catalogue in `src/data/products.ts`.
 * The finder only:
 *   1. filters by the catalogue `category` values the visitor selected,
 *   2. places categories related to the visitor's intended use first,
 *   3. optionally filters by the lowest valid recorded listing price,
 * and it explains each result with the rule that produced it.
 *
 * It does not claim to assess skill level, performance suitability, or
 * technical fit — the catalogue does not contain those facts.
 */

export type InterestId =
  | 'guitars'
  | 'pianos-keyboards'
  | 'drums'
  | 'synthesizers'
  | 'midi-controllers'
  | 'everything'

export type UseId = 'learn' | 'perform' | 'produce' | 'explore'

export type BudgetId = 'under-10000' | '10000-20000' | '20000-40000' | '40000-plus'

export interface InterestOption {
  id: InterestId
  label: string
  description: string
  /** Existing category illustration, or null when an icon is used instead. */
  image: string | null
  /** Exact catalogue `category` values. null means every category. */
  categories: string[] | null
}

export interface UseOption {
  id: UseId
  label: string
  description: string
  /**
   * Category-level affinity, used only to order results. An empty list means
   * no category is prioritised. These are product-category mappings, not
   * claims about a product's technical suitability.
   */
  affinity: string[]
}

export interface BudgetOption {
  id: BudgetId
  label: string
  description: string
  /** Inclusive lower bound. */
  min: number
  /** Exclusive upper bound; the top band uses Infinity. */
  max: number
}

export const INTEREST_OPTIONS: InterestOption[] = [
  {
    id: 'guitars',
    label: 'Guitars',
    description: 'Acoustic and classical guitars',
    image: '/images/instruments/guitar.svg',
    categories: ['Guitar'],
  },
  {
    id: 'pianos-keyboards',
    label: 'Pianos & keyboards',
    description: 'Digital pianos and portable keyboards',
    image: '/images/instruments/piano.svg',
    categories: ['Piano', 'Portable Keyboards'],
  },
  {
    id: 'drums',
    label: 'Drums & percussion',
    description: 'Electronic drum kits',
    image: '/images/instruments/drums.svg',
    categories: ['Drums and Percussion'],
  },
  {
    id: 'synthesizers',
    label: 'Synthesizers',
    description: 'Synthesizer keyboards',
    image: '/images/instruments/synthesizer.svg',
    categories: ['Synthesizers'],
  },
  {
    id: 'midi-controllers',
    label: 'MIDI controllers',
    description: 'Compact controller keyboards',
    image: '/images/instruments/midi.svg',
    categories: ['MIDI Controllers'],
  },
  {
    id: 'everything',
    label: 'Explore everything',
    description: 'All categories in the catalogue',
    image: null,
    categories: null,
  },
]

export const USE_OPTIONS: UseOption[] = [
  {
    id: 'learn',
    label: 'Learn to play an instrument',
    description: 'Prioritises pianos, keyboards, and guitars.',
    affinity: ['Piano', 'Portable Keyboards', 'Guitar'],
  },
  {
    id: 'perform',
    label: 'Play and perform music',
    description: 'Prioritises guitars, pianos, drums, and synthesizers.',
    affinity: ['Guitar', 'Piano', 'Drums and Percussion', 'Synthesizers'],
  },
  {
    id: 'produce',
    label: 'Create electronic music',
    description: 'Prioritises synthesizers and MIDI controllers.',
    affinity: ['Synthesizers', 'MIDI Controllers'],
  },
  {
    id: 'explore',
    label: 'Explore my options',
    description: 'No category is prioritised.',
    affinity: [],
  },
]

/**
 * Budget bands are half-open intervals: min <= price < max.
 * The bands match the recorded listing-price spread (Rs. 8,990–59,427), so
 * every band contains at least one catalogue product today.
 */
export const BUDGET_OPTIONS: BudgetOption[] = [
  {
    id: 'under-10000',
    label: 'Under ₹10,000',
    description: 'Below ₹10,000',
    min: 0,
    max: 10000,
  },
  {
    id: '10000-20000',
    label: '₹10,000 – ₹19,999',
    description: 'From ₹10,000 to just under ₹20,000',
    min: 10000,
    max: 20000,
  },
  {
    id: '20000-40000',
    label: '₹20,000 – ₹39,999',
    description: 'From ₹20,000 to just under ₹40,000',
    min: 20000,
    max: 40000,
  },
  {
    id: '40000-plus',
    label: '₹40,000 and above',
    description: '₹40,000 or more',
    min: 40000,
    max: Number.POSITIVE_INFINITY,
  },
]

export interface FinderAnswers {
  interests: InterestId[]
  use: UseId | null
  budget: BudgetId | null
}

export const INITIAL_ANSWERS: FinderAnswers = {
  interests: [],
  use: null,
  budget: null,
}

export interface FinderRecommendation {
  product: Product
  reason: string
  /** 0 = also in a category prioritised by the intended use, 1 = other match. */
  priority: number
}

export interface FinderResult {
  recommendations: FinderRecommendation[]
  /** Matches excluded only because they have no valid recorded listing price. */
  hiddenNoPrice: Product[]
}

export function isEverythingSelected(answers: FinderAnswers): boolean {
  return answers.interests.includes('everything')
}

export function getInterestOption(id: InterestId): InterestOption | undefined {
  return INTEREST_OPTIONS.find((option) => option.id === id)
}

export function getBudgetOption(id: BudgetId | null): BudgetOption | undefined {
  return id === null ? undefined : BUDGET_OPTIONS.find((option) => option.id === id)
}

/** Category values represented by the selected interests. null = all. */
export function getSelectedCategories(answers: FinderAnswers): string[] | null {
  // No interest selected means no matches, never the whole catalogue.
  if (answers.interests.length === 0) return []
  if (isEverythingSelected(answers)) return null

  const categories = new Set<string>()
  for (const id of answers.interests) {
    for (const category of getInterestOption(id)?.categories ?? []) {
      categories.add(category)
    }
  }
  return [...categories]
}

export function matchesBudget(price: number, option: BudgetOption): boolean {
  return price >= option.min && price < option.max
}

function formatRupees(value: number): string {
  return `Rs. ${value.toLocaleString('en-IN')}`
}

function getInterestLabelForCategory(category: string, answers: FinderAnswers): string | null {
  for (const id of answers.interests) {
    const option = getInterestOption(id)
    if (option?.categories?.includes(category)) return option.label
  }
  return null
}

interface ReasonContext {
  answers: FinderAnswers
  exploreEverything: boolean
  useOption: UseOption | undefined
  budgetOption: BudgetOption | undefined
  priority: number
  listingPrice: number | null
}

function buildReason(product: Product, context: ReasonContext): string {
  const parts: string[] = []

  if (context.exploreEverything) {
    parts.push('Included because you chose to explore the full catalogue.')
  } else {
    const interestLabel = getInterestLabelForCategory(product.category, context.answers)
    parts.push(
      interestLabel
        ? `Matches your interest in ${interestLabel}.`
        : `Included from the ${product.category} category.`
    )
  }

  if (context.priority === 0 && context.useOption && context.useOption.affinity.length > 0) {
    parts.push(`Prioritised for your “${context.useOption.label}” preference.`)
  }

  if (context.budgetOption && context.listingPrice !== null) {
    parts.push(
      `Its lowest recorded listing price (${formatRupees(
        context.listingPrice
      )}) is within your selected budget.`
    )
  }

  return parts.join(' ')
}

/**
 * Deterministic recommendation pass.
 *
 * Ordering is stable: results are grouped by priority, then kept in the
 * catalogue's own order. Array.prototype.sort is stable, but the original
 * index is included in the comparison so the behaviour is explicit.
 */
export function getRecommendations(
  answers: FinderAnswers,
  catalogue: Product[] = products
): FinderResult {
  const exploreEverything = isEverythingSelected(answers)
  const selectedCategories = getSelectedCategories(answers)
  const selectedSet = selectedCategories === null ? null : new Set(selectedCategories)
  const useOption = answers.use === null
    ? undefined
    : USE_OPTIONS.find((option) => option.id === answers.use)
  const budgetOption = getBudgetOption(answers.budget)

  const scoped = catalogue
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => selectedSet === null || selectedSet.has(product.category))
    .map(({ product, index }) => ({
      product,
      index,
      priority:
        useOption && useOption.affinity.length > 0 && useOption.affinity.includes(product.category)
          ? 0
          : 1,
    }))
    .sort((a, b) => a.priority - b.priority || a.index - b.index)

  const recommendations: FinderRecommendation[] = []
  const hiddenNoPrice: Product[] = []

  for (const entry of scoped) {
    const listingPrice = getLowestListingPrice(entry.product)

    if (budgetOption) {
      if (listingPrice === null) {
        hiddenNoPrice.push(entry.product)
        continue
      }
      if (!matchesBudget(listingPrice, budgetOption)) continue
    }

    recommendations.push({
      product: entry.product,
      priority: entry.priority,
      reason: buildReason(entry.product, {
        answers,
        exploreEverything,
        useOption,
        budgetOption,
        priority: entry.priority,
        listingPrice,
      }),
    })
  }

  return { recommendations, hiddenNoPrice }
}
