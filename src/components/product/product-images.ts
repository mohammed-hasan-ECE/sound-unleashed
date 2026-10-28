/**
 * Resolves the image shown for a product.
 *
 * Products point at a local image path when one is available. When a
 * product has no image of its own, we fall back to the shared
 * category-level illustration for its instrument family — never a broken
 * asset or a fabricated path. These are category illustrations, not
 * photographs of a specific model.
 */

const CATEGORY_IMAGES: { match: RegExp; image: string }[] = [
  { match: /piano/i, image: '/images/instruments/piano.svg' },
  { match: /guitar/i, image: '/images/instruments/guitar.svg' },
  { match: /drum|percussion/i, image: '/images/instruments/drums.svg' },
  { match: /synth/i, image: '/images/instruments/synthesizer.svg' },
  { match: /midi/i, image: '/images/instruments/midi.svg' },
  { match: /studio|audio|speaker/i, image: '/images/instruments/studio.svg' },
  { match: /keyboard/i, image: '/images/instruments/keyboard.svg' },
]

export function resolveProductImage(
  imageUrl: string | null,
  category: string
): string | null {
  if (imageUrl) return imageUrl
  const entry = CATEGORY_IMAGES.find((entry) => entry.match.test(category))
  return entry ? entry.image : null
}
