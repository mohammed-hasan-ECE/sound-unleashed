# Image Asset Guide

This guide describes how Sound Unleashed resolves product imagery today, and how real product photographs can be added later **without changing the component architecture**.

## Current assets

All current imagery is category-level SVG illustration, not photography of specific models:

| File | Used for |
| --- | --- |
| `public/images/instruments/guitar.svg` | Guitar products |
| `public/images/instruments/piano.svg` | Piano products and the homepage hero |
| `public/images/instruments/keyboard.svg` | Portable keyboard products |
| `public/images/instruments/drums.svg` | Drums and percussion products |
| `public/images/instruments/synthesizer.svg` | Synthesizer products |
| `public/images/instruments/midi.svg` | MIDI controller products |
| `public/images/instruments/studio.svg` | Studio and audio equipment category |

All illustrations use a `400 × 300` (4:3) viewBox. They are displayed with fixed aspect-ratio containers and `object-cover`, so cards do not shift while images load. On square product cards the artwork is centre-cropped; on product detail pages it is shown at 4:3.

## How a product image is chosen

1. Each product record in `src/data/products.ts` has an `imageUrl`.
2. If `imageUrl` is set, that path is used exactly as provided.
3. If `imageUrl` is `null`, `resolveProductImage()` in `src/components/product/product-images.ts` selects a category illustration based on the product's `category`.
4. If no category matches, the UI shows an intentional “Photograph pending” placeholder — never a broken image.

Shared components:

- `src/components/product/ProductCard.tsx` — square card artwork with a category fallback.
- `src/components/product/ProductImage.tsx` — product-detail image with `priority` support for above-the-fold loading.
- `src/pages/CartPage.tsx` — thumbnail with the same resolver.

## Adding real product photographs later

1. Create `public/images/products/` if it does not exist.
2. Add an image named after the product slug, for example:
   - `public/images/products/yamaha-c40-classical-guitar.jpg`
   - `public/images/products/roland-junodi-synthesizer.jpg`
   - `public/images/products/akai-mpk-mini-play-mk3.webp`
3. In `src/data/products.ts`, change that product's `imageUrl` to the new path, for example:
   ```ts
   imageUrl: '/images/products/yamaha-c40-classical-guitar.jpg',
   ```
4. Leave `imageUrl: null` for products that do not have a photograph yet; the category fallback continues to work.

You do not need to change any component to add photography.

### Recommended image specifications

- **Aspect ratio:** 4:3 (for example `1200 × 900`). Square (1:1) images also work but will be cropped on product cards.
- **Minimum size:** `800 × 600`; `1200 × 900` or larger is preferred for high-density screens.
- **Format:** `.jpg`, `.png`, or `.webp`.
- **Framing:** centre the instrument with a little breathing room, since cards crop to a square.
- **Background:** a clean, light background suits the existing lavender-and-white surfaces. Do not bake text or prices into the image.
- **File size:** keep each file reasonably small (roughly under 250 KB where possible) to protect page performance.

## Important accuracy notes

- Do not label a category illustration as a photograph of the exact model.
- Do not add images you do not have the rights to use.
- Keep alternative text descriptive. Existing components generate alt text from the category, brand, and product name; review it if a photograph shows something materially different.
- Do not replace the SVG illustrations unless a deliberate visual change is intended — they are the current fallback for every category.
