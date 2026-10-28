import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { products } from '@/data/products'
import { useShop } from '@/context/ShopContext'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/ProductCard'
import { getDisplayPrice } from '@/lib/catalogue'

export function SavedPage() {
  const { savedIds } = useShop()

  const savedProducts = products.filter((p) => savedIds.has(p.id))

  if (savedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender">
          <Heart className="h-7 w-7 text-brand-primary" />
        </div>
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-heading">
            Saved Items
          </h1>
          <p className="text-muted-foreground">
            You haven't saved any products yet.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/purchase">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Centred page header */}
      <div className="rounded-2xl bg-lavender-soft p-6 text-center md:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">
          Saved Items
        </h1>
        <p className="mt-2 text-muted-foreground">
          {savedProducts.length}{' '}
          {savedProducts.length === 1 ? 'product' : 'products'} saved for later.
        </p>
      </div>

      {/* Shared product grid — save control toggles items out of this list */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {savedProducts.map((product) => {
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
    </div>
  )
}
