import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star, Heart } from 'lucide-react'
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
}: ProductCardProps) {
  const { isSaved, toggleSaved, isLiked, toggleLike, addToCart } = useShop()

  // Fall back to the shared category illustration when no image is set.
  const resolvedImage = resolveProductImage(imageUrl, category)

  const formatPrice = (p: number, type: string) => {
    const label = type === 'mrp' ? 'MRP' : type === 'catalogue' ? 'Catalogue' : 'Listed'
    return `Rs. ${p.toLocaleString('en-IN')} (${label})`
  }

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-lg">
      {/* 1. Image area */}
      <Link
        to={`/product/${slug}`}
        className="relative block aspect-square shrink-0 overflow-hidden bg-lavender-soft"
        aria-label={`View details for ${brand} ${name}`}
      >
        {resolvedImage ? (
          <img
            src={resolvedImage}
            alt={`${category} — ${brand} ${name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-xs font-medium text-muted-foreground">
            Photograph pending
          </span>
        )}

        {/* Save control (state-aware) */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleSaved(id)
          }}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors ${
            isSaved(id)
              ? 'border-brand-primary bg-brand-primary text-white'
              : 'border-border bg-card/90 text-muted-foreground hover:text-brand-primary'
          }`}
          aria-label={isSaved(id) ? 'Remove from saved items' : 'Save item'}
          aria-pressed={isSaved(id)}
        >
          <Heart className="h-4 w-4" fill={isSaved(id) ? 'currentColor' : 'none'} />
        </button>
      </Link>

      {/* 2–8. Content sequence — reserved action space keeps cards aligned */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-semibold tracking-wide text-brand-primary uppercase">
          {brand}
        </p>
        <h3 className="line-clamp-2 text-lg leading-snug font-semibold text-heading">
          {name}
        </h3>
        <p className="text-xs font-medium text-muted-foreground">{category}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>

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
              onClick={() => toggleLike(id)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                isLiked(id)
                  ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                  : 'border-border text-muted-foreground hover:border-brand-primary hover:text-brand-primary'
              }`}
              aria-label={isLiked(id) ? 'Unlike product' : 'Like product'}
              aria-pressed={isLiked(id)}
            >
              <Star className="h-4 w-4" fill={isLiked(id) ? 'currentColor' : 'none'} />
            </button>

            <Button
              size="sm"
              className="flex-1"
              onClick={() => addToCart(id)}
            >
              <ShoppingCart className="mr-1.5 h-4 w-4" />
              Add to Cart
            </Button>
          </div>

          <Link to={`/product/${slug}`} className="block">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
