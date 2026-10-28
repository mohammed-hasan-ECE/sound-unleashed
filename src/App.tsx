import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { ShopProvider } from '@/context/ShopContext'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { FinderPage } from '@/pages/FinderPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { SavedPage } from '@/pages/SavedPage'
import { CartPage } from '@/pages/CartPage'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">Page coming soon...</p>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ShopProvider>
        <Routes>
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="purchase" element={<CatalogPage />} />
            <Route path="finder" element={<FinderPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="saved" element={<SavedPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="buy" element={<PlaceholderPage title="Shop Instruments" />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ShopProvider>
    </ThemeProvider>
  )
}

export default App
