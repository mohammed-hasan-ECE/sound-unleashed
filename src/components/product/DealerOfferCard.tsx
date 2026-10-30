import { Button } from '@/components/ui/button'
import { BadgeCheck, ExternalLink } from 'lucide-react'

interface DealerOfferCardProps {
  dealerName: string
  url: string | null
  price: number | null
  currency: string
  priceType: 'listing' | 'mrp' | 'catalogue'
  availability: string | null
  pageType: 'product' | 'collection'
  isVerified: boolean
  note: string | null
}

export function DealerOfferCard({
  dealerName,
  url,
  price,
  currency,
  priceType,
  availability,
  pageType,
  isVerified,
  note,
}: DealerOfferCardProps) {
  const isPending = !isVerified && url === null

  const getPriceLabel = () => {
    if (priceType === 'mrp') return 'MRP'
    if (priceType === 'catalogue') return 'Catalogue'
    return 'Listing'
  }

  return (
    <div className="flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      {/* Dealer header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {isVerified && (
            <>
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-brand-primary"
                aria-hidden="true"
              />
              <span className="sr-only">Verified listing:</span>
            </>
          )}
          <h3 className="truncate text-sm font-semibold text-heading">{dealerName}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-lavender px-2.5 py-1 text-xs font-medium text-accent-text">
          {pageType === 'collection' ? 'Collection' : 'Product'}
        </span>
      </div>

      {note && (
        <p className="text-xs leading-relaxed text-muted-foreground italic">{note}</p>
      )}

      {/* Price + action */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
        {price !== null ? (
          <span className="text-base font-semibold text-heading">
            {currency} {price.toLocaleString('en-IN')}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              ({getPriceLabel()})
            </span>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Price unavailable</span>
        )}

        {isPending ? (
          <Button disabled size="sm" className="text-xs">
            Listing Pending Verification
          </Button>
        ) : (
          <Button asChild size="sm">
            <a
              href={url || ''}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Dealer
              <span className="sr-only">
                {' '}
                at {dealerName} (opens in a new tab)
              </span>
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        )}
      </div>

      {availability && (
        <p className="text-xs text-muted-foreground">
          Availability: {availability}
        </p>
      )}
    </div>
  )
}
