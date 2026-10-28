export interface DealerOffer {
  id: string
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

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  group: string
  category: string
  description: string
  specifications: string[] | null
  imageUrl: string | null
  isFeatured: boolean
  offers: DealerOffer[]
}