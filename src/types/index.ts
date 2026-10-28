export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  retailerUrl: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface WishlistItem {
  id: string
  productId: string
  addedAt: string
}