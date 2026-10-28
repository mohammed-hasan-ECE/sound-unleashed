import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  GraduationCap,
  LayoutGrid,
  Mic,
  RotateCcw,
  SearchX,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/ProductCard'
import { products } from '@/data/products'
import { getDisplayPrice } from '@/lib/catalogue'
import {
  BUDGET_OPTIONS,
  INITIAL_ANSWERS,
  INTEREST_OPTIONS,
  USE_OPTIONS,
  getBudgetOption,
  getInterestOption,
  getRecommendations,
  type FinderAnswers,
  type InterestId,
  type UseId,
} from '@/lib/instrument-finder'

type Step = 1 | 2 | 3 | 4

const STEP_TITLES = ['Interests', 'Intended use', 'Budget'] as const

const USE_ICONS = {
  learn: GraduationCap,
  perform: Mic,
  produce: SlidersHorizontal,
  explore: Compass,
} satisfies Record<UseId, typeof Compass>

interface InterestCardProps {
  id: InterestId
  label: string
  description: string
  image: string | null
  selected: boolean
  onToggle: (id: InterestId) => void
}

function InterestCard({ id, label, description, image, selected, onToggle }: InterestCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      aria-pressed={selected}
      className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
        selected
          ? 'border-brand-primary bg-lavender-soft ring-2 ring-brand-primary/25'
          : 'border-border bg-card hover:border-border-strong hover:shadow-card'
      }`}
    >
      <span className="block aspect-[4/3] overflow-hidden bg-lavender-soft">
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-lavender to-lavender-soft">
            <LayoutGrid className="h-10 w-10 text-brand-primary" aria-hidden="true" />
          </span>
        )}
      </span>

      <span className="block p-4">
        <span className="block text-base font-semibold text-heading">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>

      {selected && (
        <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white shadow-card-sm">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      )}
    </button>
  )
}

export function FinderPage() {
  const [answers, setAnswers] = useState<FinderAnswers>(INITIAL_ANSWERS)
  const [step, setStep] = useState<Step>(1)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const shouldFocusHeading = useRef(false)

  // Move focus to the new step heading after an explicit navigation, but not
  // on the initial page load (which would scroll the hero out of view).
  useEffect(() => {
    if (!shouldFocusHeading.current) return
    shouldFocusHeading.current = false
    headingRef.current?.focus()
  }, [step])

  const { recommendations, hiddenNoPrice } = useMemo(
    () => getRecommendations(answers),
    [answers]
  )

  const budgetOption = getBudgetOption(answers.budget)
  const interestLabels = answers.interests
    .map((id) => getInterestOption(id)?.label)
    .filter((label): label is string => Boolean(label))
  const useLabel = USE_OPTIONS.find((option) => option.id === answers.use)?.label ?? null

  const focusNext = () => {
    shouldFocusHeading.current = true
  }

  const goToStep = (next: Step) => {
    focusNext()
    setStep(next)
  }

  const toggleInterest = (id: InterestId) => {
    setAnswers((previous) => {
      if (id === 'everything') {
        return {
          ...previous,
          interests: previous.interests.includes('everything') ? [] : ['everything'],
        }
      }

      const withoutEverything = previous.interests.filter((value) => value !== 'everything')
      const isSelected = withoutEverything.includes(id)

      return {
        ...previous,
        interests: isSelected
          ? withoutEverything.filter((value) => value !== id)
          : [...withoutEverything, id],
      }
    })
  }

  const handleNext = () => {
    if (step === 1 && answers.interests.length === 0) return
    if (step === 2 && answers.use === null) return
    goToStep((step === 3 ? 4 : step + 1) as Step)
  }

  const handleBack = () => {
    if (step > 1) goToStep((step - 1) as Step)
  }

  const handleSkipBudget = () => {
    setAnswers((previous) => ({ ...previous, budget: null }))
    goToStep(4)
  }

  const handleEditPreferences = () => goToStep(1)

  const handleStartOver = () => {
    setAnswers(INITIAL_ANSWERS)
    goToStep(1)
  }

  const handleRemoveBudget = () => {
    setAnswers((previous) => ({ ...previous, budget: null }))
  }

  const canContinue =
    step === 1 ? answers.interests.length > 0 : step === 2 ? answers.use !== null : true

  const isResults = step === 4

  return (
    <div className="flex flex-col gap-8">
      {/* ============ FINDER HEADER ============ */}
      <section className="hero-surface relative overflow-hidden rounded-3xl p-6 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-brand-primary/30 blur-3xl"
        />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-brand-light uppercase">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            Guided discovery
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-[42px]">
            Help me find my sound
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/80">
            Three quick questions about what you want to explore. Your answers are matched
            against the instruments currently in the Sound Unleashed catalogue — no account
            needed, and nothing is stored after you leave.
          </p>
        </div>
      </section>

      {/* ============ WIZARD ============ */}
      {!isResults && (
        <section
          aria-labelledby="finder-step-heading"
          className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-semibold text-brand-primary-dark">
                Step {step} of 3
              </p>
              <p className="text-xs font-medium text-muted-foreground">{STEP_TITLES[step - 1]}</p>
            </div>
            <div className="mt-2 flex gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                    index <= step ? 'bg-brand-primary' : 'bg-lavender'
                  }`}
                />
              ))}
            </div>
          </div>

          <div key={step} className="su-step-in">
            {/* ---------- STEP 1 ---------- */}
            {step === 1 && (
              <>
                <h2
                  id="finder-step-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-2xl font-bold tracking-tight text-heading sm:text-3xl"
                >
                  What are you interested in exploring?
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Choose the instruments or equipment that catch your interest. We&apos;ll use
                  your selection to narrow down the catalogue.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {INTEREST_OPTIONS.map((option) => (
                    <InterestCard
                      key={option.id}
                      id={option.id}
                      label={option.label}
                      description={option.description}
                      image={option.image}
                      selected={answers.interests.includes(option.id)}
                      onToggle={toggleInterest}
                    />
                  ))}
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Selecting &ldquo;Explore everything&rdquo; clears any other interest.
                </p>
              </>
            )}

            {/* ---------- STEP 2 ---------- */}
            {step === 2 && (
              <>
                <h2
                  id="finder-step-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-2xl font-bold tracking-tight text-heading sm:text-3xl"
                >
                  What brings you here?
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Choose what you&apos;re hoping to do with your next instrument or piece of
                  equipment. This only decides which catalogue categories appear first — it is
                  not an assessment of what a product is technically suited to.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {USE_OPTIONS.map((option) => {
                    const Icon = USE_ICONS[option.id]
                    const selected = answers.use === option.id

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAnswers((previous) => ({ ...previous, use: option.id }))}
                        aria-pressed={selected}
                        className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                          selected
                            ? 'border-brand-primary bg-lavender-soft ring-2 ring-brand-primary/25'
                            : 'border-border bg-card hover:border-border-strong hover:shadow-card'
                        }`}
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            selected
                              ? 'bg-brand-primary text-white'
                              : 'bg-lavender text-brand-primary'
                          }`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-semibold text-heading">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                        {selected && (
                          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* ---------- STEP 3 ---------- */}
            {step === 3 && (
              <>
                <h2
                  id="finder-step-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-2xl font-bold tracking-tight text-heading sm:text-3xl"
                >
                  What budget are you working with?
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Choose a budget to narrow the products with recorded listing prices. This step
                  is optional — skip it to see every match in your interests.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {BUDGET_OPTIONS.map((option) => {
                    const selected = answers.budget === option.id

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setAnswers((previous) => ({ ...previous, budget: option.id }))
                        }
                        aria-pressed={selected}
                        className={`flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                          selected
                            ? 'border-brand-primary bg-lavender-soft ring-2 ring-brand-primary/25'
                            : 'border-border bg-card hover:border-border-strong hover:shadow-card'
                        }`}
                      >
                        <span>
                          <span className="block text-base font-semibold text-heading">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                        {selected && (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        )}
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() =>
                      setAnswers((previous) => ({ ...previous, budget: null }))
                    }
                    aria-pressed={answers.budget === null}
                    className={`flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                      answers.budget === null
                        ? 'border-brand-primary bg-lavender-soft ring-2 ring-brand-primary/25'
                        : 'border-border bg-card hover:border-border-strong hover:shadow-card'
                    }`}
                  >
                    <span>
                      <span className="block text-base font-semibold text-heading">
                        No budget preference
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Show every match, whatever its recorded price.
                      </span>
                    </span>
                    {answers.budget === null && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-lavender-soft p-4 text-xs leading-relaxed text-muted-foreground">
                  Budgets use the lowest valid recorded listing price for each instrument. MRPs
                  are not treated as listing prices, and a missing price is never treated as
                  free. Instruments without a recorded listing price are set aside while a
                  budget is active. Recorded prices may change — confirm details on the
                  retailer&apos;s site.
                </div>
              </>
            )}

            {/* ---------- WIZARD NAVIGATION ---------- */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center">
                <Button onClick={handleNext} disabled={!canContinue}>
                  {step === 3 ? 'See my matches' : 'Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>

                {step === 3 && (
                  <Button variant="ghost" onClick={handleSkipBudget}>
                    Skip budget
                  </Button>
                )}
              </div>
            </div>

            {!canContinue && (
              <p className="mt-3 text-sm text-muted-foreground" role="status">
                {step === 1
                  ? 'Select at least one interest to continue.'
                  : 'Choose an option to continue.'}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ============ RESULTS ============ */}
      {isResults && (
        <section aria-labelledby="finder-results-heading" className="flex flex-col gap-6">
          <div className="rounded-3xl border border-border bg-lavender-soft p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-brand-primary-dark uppercase">
                  Your matches
                </p>
                <h2
                  id="finder-results-heading"
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-2 text-3xl font-bold tracking-tight text-heading sm:text-4xl"
                >
                  Your sound starts here.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-heading">
                    {recommendations.length} of {products.length}
                  </span>{' '}
                  {recommendations.length === 1 ? 'instrument matches' : 'instruments match'} your
                  preferences below.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleEditPreferences}>
                  <SlidersHorizontal className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Edit preferences
                </Button>
                <Button variant="ghost" size="sm" onClick={handleStartOver}>
                  <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Start over
                </Button>
              </div>
            </div>

            <ul aria-label="Selected preferences" className="mt-5 flex flex-wrap gap-2">
              {interestLabels.map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-border-strong bg-card px-3 py-1 text-xs font-medium text-heading"
                >
                  {label}
                </li>
              ))}
              {useLabel && (
                <li className="rounded-full border border-border-strong bg-card px-3 py-1 text-xs font-medium text-heading">
                  {useLabel}
                </li>
              )}
              <li className="rounded-full border border-border-strong bg-card px-3 py-1 text-xs font-medium text-heading">
                {budgetOption ? budgetOption.label : 'No budget preference'}
              </li>
            </ul>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Results are ordered by how directly they match your interests. Categories related to
              your intended use are shown first, and ties keep the catalogue&apos;s own order.
            </p>
          </div>

          {hiddenNoPrice.length > 0 && (
            <p className="rounded-xl border border-border bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground shadow-card-sm">
              {hiddenNoPrice.length}{' '}
              {hiddenNoPrice.length === 1 ? 'instrument has' : 'instruments have'} no recorded
              listing price and cannot be evaluated against your budget:{' '}
              <span className="font-medium text-heading">
                {hiddenNoPrice.map((product) => product.name).join(', ')}
              </span>
              . They are not treated as affordable, and they are not shown while a budget is
              active.
            </p>
          )}

          {recommendations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recommendations.map(({ product, reason }) => {
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
                      reason={reason}
                    />
                  )
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                <Button variant="outline" asChild>
                  <Link to="/purchase">
                    Explore all instruments
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="ghost" onClick={handleEditPreferences}>
                  <SlidersHorizontal className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Change my preferences
                </Button>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                These suggestions are based only on catalogue categories, your stated
                preferences, and recorded listing prices. They are not a technical assessment of
                suitability, and recorded prices may change — confirm details with the retailer.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-10 text-center shadow-card sm:p-14">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender">
                <SearchX className="h-7 w-7 text-brand-primary" aria-hidden="true" />
              </div>
              <div className="max-w-xl">
                <h3 className="text-xl font-semibold text-heading">
                  No instruments match these preferences.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {budgetOption
                    ? 'No instrument in your selected interests has a recorded listing price within this budget. Removing the budget may reveal matches, or you can broaden your interests.'
                    : 'The categories you selected do not currently contain any products in the catalogue. Try choosing different interests.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button onClick={handleEditPreferences}>Change my preferences</Button>
                {budgetOption && (
                  <Button variant="outline" onClick={handleRemoveBudget}>
                    Remove budget filter
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to="/purchase">Explore all instruments</Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      )}

      {!isResults && (
        <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          <Sparkles className="mr-1.5 inline h-3.5 w-3.5 align-[-2px] text-brand-primary" aria-hidden="true" />
          The finder is a rule-based way to explore the catalogue. It does not assess skill
          level or technical suitability, and it never changes your saved items or cart.
        </p>
      )}
    </div>
  )
}
