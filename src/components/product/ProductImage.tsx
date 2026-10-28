interface ProductImageProps {
  imageUrl: string | null
  alt: string
  className?: string
}

/**
 * Displays a product image inside a consistent, branded container.
 * Falls back to a neutral, intentional placeholder area when no image
 * resolves — never a broken image or crude drawing.
 */
export function ProductImage({ imageUrl, alt, className = '' }: ProductImageProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-lavender-soft ${className}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            fill="none"
            className="h-12 w-12 text-brand-primary opacity-40"
          >
            <path
              d="M9 24 Q12 22 15 24 Q18 28 21 24 Q24 16 27 24 Q30 29 33 24 Q36 21.5 39 24"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="text-xs font-medium text-muted-foreground">
            Photograph pending
          </span>
        </div>
      )}
    </div>
  )
}
