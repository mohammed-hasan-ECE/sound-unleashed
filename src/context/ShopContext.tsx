import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface CartItem {
  productId: string
  quantity: number
}

interface ShopContextValue {
  savedIds: Set<string>
  toggleSaved: (productId: string) => void
  isSaved: (productId: string) => boolean
  likes: Set<string>
  toggleLike: (productId: string) => void
  isLiked: (productId: string) => boolean
  ratings: Map<string, number>
  rateProduct: (productId: string, rating: number) => void
  getProductRating: (productId: string) => number | null
  cart: CartItem[]
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartItemCount: number
}

const SAVED_KEY = 'sound-unleashed:saved:v1'
const LIKES_KEY = 'sound-unleashed:likes:v1'
const RATINGS_KEY = 'sound-unleashed:ratings:v1'
const CART_KEY = 'sound-unleashed:cart:v1'

// eslint-disable-next-line react/no-unknown-property
const ShopContext = createContext<ShopContextValue | null>(null)

const getStoredItem = function <T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

const setStoredItem = function (key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage failed
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(function () {
    return new Set(getStoredItem<string[]>(SAVED_KEY, []))
  })
  const [likes, setLikes] = useState<Set<string>>(function () {
    return new Set(getStoredItem<string[]>(LIKES_KEY, []))
  })
  const [ratings, setRatings] = useState<Map<string, number>>(function () {
    return new Map(getStoredItem<[string, number][]>(RATINGS_KEY, []))
  })
  const [cart, setCart] = useState<CartItem[]>(function () {
    return getStoredItem<CartItem[]>(CART_KEY, [])
  })

  useEffect(function () {
    setStoredItem(SAVED_KEY, Array.from(savedIds))
  }, [savedIds])

  useEffect(function () {
    setStoredItem(LIKES_KEY, Array.from(likes))
  }, [likes])

  useEffect(function () {
    setStoredItem(RATINGS_KEY, Array.from(ratings.entries()))
  }, [ratings])

  useEffect(function () {
    setStoredItem(CART_KEY, cart)
  }, [cart])

  const toggleSaved = useCallback(function (productId: string) {
    setSavedIds(function (prev) {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }, [])

  const isSaved = useCallback(function (productId: string) {
    return savedIds.has(productId)
  }, [savedIds])

  const toggleLike = useCallback(function (productId: string) {
    setLikes(function (prev) {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }, [])

  const isLiked = useCallback(function (productId: string) {
    return likes.has(productId)
  }, [likes])

  const rateProduct = useCallback(function (productId: string, rating: number) {
    setRatings(function (prev) {
      const next = new Map(prev)
      next.set(productId, rating)
      return next
    })
  }, [])

  const getProductRating = useCallback(function (productId: string) {
    return ratings.get(productId) ?? null
  }, [ratings])

  const addToCart = useCallback(function (productId: string) {
    setCart(function (prev) {
      const existing = prev.find(function (item) { return item.productId === productId })
      if (existing) {
        return prev.map(function (item) {
          return item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        })
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback(function (productId: string) {
    setCart(function (prev) {
      return prev.filter(function (item) { return item.productId !== productId })
    })
  }, [])

  const updateCartQuantity = useCallback(function (productId: string, quantity: number) {
    if (quantity <= 0) {
      setCart(function (prev) {
        return prev.filter(function (item) { return item.productId !== productId })
      })
    } else {
      setCart(function (prev) {
        return prev.map(function (item) {
          return item.productId === productId 
            ? { ...item, quantity: quantity } 
            : item
        })
      })
    }
  }, [])

  const clearCart = useCallback(function () {
    setCart([])
  }, [])

  const cartItemCount = cart.reduce(function (sum, item) { return sum + item.quantity }, 0)

  return (
    <ShopContext.Provider value={{
      savedIds,
      toggleSaved,
      isSaved,
      likes,
      toggleLike,
      isLiked,
      ratings,
      rateProduct,
      getProductRating,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartItemCount
    }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within ShopProvider')
  }
  return context
}
