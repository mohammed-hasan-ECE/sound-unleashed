import { useParams, Link } from 'react-router-dom'
import { products } from '@/data/products'
import { ProductImage } from '@/components/product/ProductImage'
import { DealerOfferCard } from '@/components/product/DealerOfferCard'
import { Button } from '@/components/ui/button'
import { Heart, Star, ShoppingCart, SearchX } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { resolveProductImage } from '@/components/product/product-images'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isSaved, toggleSaved, isLiked, toggleLike, rateProduct, getProductRating, addToCart } = useShop()

  const product = products.find(function (p) { return p.slug === slug })

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender">
          <SearchX className="h-7 w-7 text-brand-primary" aria-hidden="true" />
        </div>
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-heading">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you're looking for does not exist.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/purchase">Back to Catalogue</Link>
        </Button>
      </div>
    )
  }

  const currentRating = getProductRating(product.id) || 0

  return (
    <div className="flex flex-col gap-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-accent-text">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/purchase" className="transition-colors hover:text-accent-text">Catalogue</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-heading">{product.name}</span>
      </nav>

      {/* Product Header */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <ProductImage
          imageUrl={resolveProductImage(product.imageUrl, product.category)}
          alt={`${product.category} — ${product.brand} ${product.name}`}
          className="aspect-[4/3] w-full md:col-span-1"
          priority
        />

        <div className="flex flex-col gap-4 md:col-span-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">
              {product.brand}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-heading md:text-4xl">
                {product.name}
              </h1>
              <button
                onClick={() => toggleSaved(product.id)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                  isSaved(product.id)
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-border text-muted-foreground hover:border-brand-primary hover:text-accent-text'
                }`}
                aria-label={isSaved(product.id) ? 'Remove from saved items' : 'Save item'}
                aria-pressed={isSaved(product.id)}
              >
                <Heart
                  className="h-5 w-5"
                  fill={isSaved(product.id) ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <p className="inline-flex w-fit rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-accent-text">
            {product.category}
          </p>
          <p className="max-w-2xl text-muted-foreground">{product.description}</p>

          {product.specifications && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="mb-3 font-semibold text-heading">Specifications</h2>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground">
                {product.specifications.map(function (spec, i) { return <li key={i}>{spec}</li> })}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => addToCart(product.id)}>
              <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
              Add to Cart
            </Button>

            <Button
              size="lg"
              variant={isLiked(product.id) ? 'default' : 'outline'}
              onClick={() => toggleLike(product.id)}
              aria-pressed={isLiked(product.id)}
            >
              <Heart
                className="mr-2 h-4 w-4"
                fill={isLiked(product.id) ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              {isLiked(product.id) ? 'Liked' : 'Like'}
            </Button>
          </div>
        </div>
      </div>

      {/* Local Rating */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="mb-4 text-xl font-bold text-heading">Rate this product</h2>
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Rate this product out of 5"
        >
          {[1, 2, 3, 4, 5].map(function (rating) {
            return (
              <button
                key={rating}
                type="button"
                onClick={function () { return rateProduct(product.id, rating) }}
                className="rounded-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                aria-label={'Rate ' + rating + ' out of 5'}
                aria-pressed={currentRating === rating}
              >
                <Star
                  className="h-7 w-7 text-brand-primary"
                  fill={currentRating >= rating ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  aria-hidden="true"
                />
              </button>
            )
          })}
          <span
            className="ml-2 text-sm text-muted-foreground"
            aria-live="polite"
            aria-atomic="true"
          >
            {currentRating > 0 ? currentRating + ' out of 5' : 'Not rated'}
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This is a local demonstration rating. It does not reflect real customer feedback.
        </p>
      </div>

      {/* Dealer Offers */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-heading">Available at Dealers</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {product.offers.map(function (offer) {
            return (
              <DealerOfferCard
                key={offer.id}
                dealerName={offer.dealerName}
                url={offer.url}
                price={offer.price}
                currency={offer.currency}
                priceType={offer.priceType}
                availability={offer.availability}
                pageType={offer.pageType}
                isVerified={offer.isVerified}
                note={offer.note}
              />
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-lavender-soft p-5 text-sm text-muted-foreground">
        <p>
          Note: Prices and availability shown are previously observed values.
          Please visit the retailer's website for the latest information.
        </p>
      </div>
    </div>
  )
}
