import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingCart, Sparkles, Star, Heart } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { resolveProductImage } from '@/components/product/product-images'

interface ProductCardProps {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  description: string
  imageUrl: string | null
  price: number | null
  priceType: 'listing' | 'mrp' | 'catalogue'
  /** Optional, truthful explanation shown when a card appears in a set of results. */
  reason?: string
}

export function ProductCard({
  id,
  slug,
  name,
  brand,
  category,
  description,
  imageUrl,
  price,
  priceType,
  reason,
}: ProductCardProps) {
  const { isSaved, toggleSaved, isLiked, toggleLike, addToCart } = useShop()

  // Fall back to the shared category illustration when no image is set.
  const resolvedImage = resolveProductImage(imageUrl, category)

  const formatPrice = (p: number, type: string) => {
    const label = type === 'mrp' ? 'MRP' : type === 'catalogue' ? 'Catalogue' : 'Listed'
    const prefix = type === 'listing' ? 'From ' : ''
    return `${prefix}Rs. ${p.toLocaleString('en-IN')} (${label})`
  }

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-200 hover:shadow-card-lg motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">
      {/* 1. Image area — the save control is a sibling of the link, never nested in it */}
      <div className="relative shrink-0">
        <Link
          to={`/product/${slug}`}
          className="group block aspect-square overflow-hidden bg-lavender-soft"
          aria-label={`View details for ${brand} ${name}`}
        >
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt={`${category} — ${brand} ${name}`}
              width={400}
              height={300}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs font-medium text-muted-foreground">
              Photograph pending
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => toggleSaved(id)}
          className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors ${
            isSaved(id)
              ? 'border-brand-primary bg-brand-primary text-white'
              : 'border-border bg-card/90 text-muted-foreground hover:text-brand-primary'
          }`}
          aria-label={isSaved(id) ? 'Remove from saved items' : 'Save item'}
          aria-pressed={isSaved(id)}
        >
          <Heart className="h-4 w-4" fill={isSaved(id) ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* 2–7. Content sequence — category, name, brand, price, actions */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {category}
        </p>
        <h3 className="line-clamp-2 text-lg leading-snug font-semibold text-heading">
          {name}
        </h3>
        <p className="text-sm font-semibold text-accent-text">{brand}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>

        {reason && (
          <p className="rounded-xl bg-lavender-soft px-3 py-2 text-xs leading-relaxed text-accent-text">
            <Sparkles
              className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]"
              aria-hidden="true"
            />
            {reason}
          </p>
        )}

        {/* Actions pinned to the card bottom */}
        <div className="mt-auto flex flex-col gap-3 pt-3">
          {price !== null ? (
            <span className="text-sm font-semibold text-heading">
              {formatPrice(price, priceType)}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">No recorded price</span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleLike(id)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                isLiked(id)
                  ? 'border-brand-primary bg-brand-primary/10 text-accent-text'
                  : 'border-border text-muted-foreground hover:border-brand-primary hover:text-accent-text'
              }`}
              aria-label={isLiked(id) ? 'Unlike product' : 'Like product'}
              aria-pressed={isLiked(id)}
            >
              <Star className="h-4 w-4" fill={isLiked(id) ? 'currentColor' : 'none'} />
            </button>

            <Button size="sm" className="flex-1" asChild>
              <Link to={`/product/${slug}`}>
                View Details
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => addToCart(id)}
            aria-label={`Add ${brand} ${name} to cart`}
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
