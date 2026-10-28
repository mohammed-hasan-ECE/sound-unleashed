import { useSearchParams, Link } from 'react-router-dom'
import { products } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const filteredProducts = products.filter(function (product) {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.group.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="rounded-2xl bg-lavender-soft p-6 md:p-8">
        <h1 className="text-3xl font-bold text-heading md:text-4xl">
          Discover Instruments
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse our catalogue of classical and modern electronic instruments.
        </p>
        {searchQuery && (
          <p className="mt-3 text-sm font-medium text-brand-primary-dark">
            Showing results for &ldquo;{searchQuery}&rdquo; ({filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'product' : 'products'})
          </p>
        )}
      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map(function (product) {
            const listingOffer = product.offers.find(
              (o) => o.priceType === 'listing' && o.price !== null
            )
            const mrpOffer = product.offers.find(
              (o) => o.priceType === 'mrp' && o.price !== null
            )
            const price =
              listingOffer !== undefined
                ? listingOffer.price
                : mrpOffer !== undefined
                  ? mrpOffer.price
                  : null
            const priceType =
              listingOffer !== undefined
                ? listingOffer.priceType
                : mrpOffer !== undefined
                  ? mrpOffer.priceType
                  : 'listing'

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
        /* Empty state */
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-14 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender">
            <SearchX className="h-7 w-7 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-heading">No products found</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search term or browse the full catalogue.
            </p>
          </div>
          <Button asChild>
            <Link to="/purchase">Clear Search</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
