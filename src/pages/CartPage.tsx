import { Link } from 'react-router-dom'
import { products } from '@/data/products'
import { type DealerOffer, type Product } from '@/types/product'
import { useShop } from '@/context/ShopContext'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingCart, Info } from 'lucide-react'
import { resolveProductImage } from '@/components/product/product-images'

interface CartItemWithProduct {
  productId: string
  quantity: number
  product: Product
}

export function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useShop()

  const cartItems = cart.map(function (item) {
    return {
      ...item,
      product: products.find(function (p) { return p.id === item.productId })
    }
  }).filter(function (item): item is CartItemWithProduct {
    return item.product !== null && item.product !== undefined
  })

  type PriceInfo = { listingPrice: number | null }

  const getPriceInfo = function (product: Product): PriceInfo {
    const listingOffer = product.offers.find(function (o: DealerOffer) { 
      return o.priceType === 'listing' && o.price !== null 
    })
    return { listingPrice: listingOffer?.price ?? null }
  }

  const calculateSubtotal = function () {
    return cartItems.reduce(function (sum, item) {
      const priceInfo = getPriceInfo(item.product)
      if (priceInfo.listingPrice === null) {
        return sum
      }
      return sum + (priceInfo.listingPrice * item.quantity)
    }, 0)
  }

  const getExcludedCount = function () {
    return cartItems.reduce(function (count, item) {
      const priceInfo = getPriceInfo(item.product)
      if (priceInfo.listingPrice === null) {
        return count + 1
      }
      return count
    }, 0)
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender">
          <ShoppingCart className="h-7 w-7 text-brand-primary" />
        </div>
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-heading">Your Cart</h1>
          <p className="text-muted-foreground">Your cart is empty.</p>
        </div>
        <Button asChild size="lg">
          <Link to="/purchase">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="rounded-2xl bg-lavender-soft p-6 md:p-8">
        <h1 className="text-3xl font-bold text-heading md:text-4xl">Your Cart</h1>
        <p className="mt-2 text-muted-foreground">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart.
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4">
        <h2 className="sr-only">Cart items</h2>
        {cartItems.map(function (item) {
          const priceInfo = getPriceInfo(item.product as Product)
          const itemImage = resolveProductImage(item.product.imageUrl, item.product.category)

          return (
            <div
              key={item.productId}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center"
            >
              {/* Image */}
              <Link
                to={`/product/${item.product.slug}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-lavender-soft"
              >
                {itemImage ? (
                  <img
                    src={itemImage}
                    alt={`${item.product.category} — ${item.product.brand} ${item.product.name}`}
                    width={80}
                    height={80}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] font-medium text-muted-foreground">
                    Photo pending
                  </span>
                )}
              </Link>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-text">
                  {item.product.brand}
                </p>
                <h3 className="line-clamp-2 text-base leading-snug font-semibold text-heading">
                  {item.product.name}
                </h3>
                {priceInfo.listingPrice !== null ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Rs. {priceInfo.listingPrice.toLocaleString('en-IN')} (previously listed)
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-muted-foreground italic">
                    Not included in estimated subtotal — no eligible recorded listing price.
                  </p>
                )}
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                  aria-label={`Decrease quantity for ${item.product.brand} ${item.product.name}`}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span className="w-8 text-center text-base font-semibold text-heading">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                  aria-label={`Increase quantity for ${item.product.brand} ${item.product.name}`}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {/* Remove */}
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:border-red-300 hover:text-red-500"
                onClick={() => removeFromCart(item.productId)}
                aria-label={`Remove ${item.product.brand} ${item.product.name} from cart`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-lg font-semibold text-heading">Estimated Subtotal:</span>
          <span className="text-2xl font-bold text-accent-text">
            Rs. {calculateSubtotal().toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
            This estimated subtotal is based on previously recorded listing prices only.
            Items without recorded listing prices are excluded. This is not a live quotation.
          </p>

          {getExcludedCount() > 0 && (
            <p className="rounded-lg bg-lavender-soft px-4 py-2.5 text-sm text-accent-text">
              {getExcludedCount()} cart {getExcludedCount() === 1 ? 'item is' : 'items are'}{' '}
              excluded from this estimate — no eligible recorded listing price.
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Sound Unleashed is a product discovery and retailer-referral prototype. This
            cart is for demonstration only. To buy a product, visit the retailer's website.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="sm:flex-1">
            <Link to="/purchase">Continue Shopping</Link>
          </Button>
          <Button variant="outline" size="lg" onClick={clearCart} className="sm:flex-1">
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
