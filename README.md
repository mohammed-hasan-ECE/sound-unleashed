# Sound Unleashed

Sound Unleashed is a frontend prototype for a music-equipment discovery catalogue. Visitors can browse instruments, search and filter the catalogue, compare recorded retailer listings, save and like products, keep a demonstration cart, and use a short guided finder to explore products that match their interests.

Actual purchases are completed on the retailer's own website. Sound Unleashed does not process payments or fulfil orders.

## Features

- **Homepage** with the Sound Unleashed brand identity, instrument categories, featured equipment, and a guided-finder entry point.
- **Catalogue** (`/purchase`) with search, category and brand filters, a maximum recorded-listing-price filter, sorting, applied-filter chips, and honest empty states. Filters are kept in the URL so views can be shared and browser history works.
- **Product details** (`/product/:slug`) using the real catalogue records, including specifications, recorded retailer offers, save/like/rating controls, and external retailer links.
- **Guided instrument finder** (`/finder`) — a three-step rule-based wizard covering interests, intended use, and an optional budget, followed by explained product matches.
- **Saved items** (`/saved`), **cart** (`/cart`), and **about** (`/about`) pages.
- **Local persistence** for saved items, likes, ratings, and cart contents through `localStorage`.
- **System / Light / Dark appearance** with a header menu, persisted choice, and no flash of the wrong theme on load.
- **First-visit brand intro** on the homepage only, with a one-shot logo reveal and an immediate skip.

## Technology stack

- React 19 and TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4 (via the Vite/PostCSS integration)
- Radix Slot, class-variance-authority, clsx, and tailwind-merge for the shared button primitive
- lucide-react icons
- oxlint for linting

No backend, database, authentication, payment integration, or external API is used.

## Requirements

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- npm

## Installation

```bash
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`.

## Development

```bash
npm run dev
```

Vite prints the local development URL (typically `http://localhost:5173`).

## Production build

```bash
npm run build
```

This runs the TypeScript project build (`tsc -b`) and then creates the production bundle in `dist/`.

To preview the production build locally:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

Linting uses oxlint. The repository currently reports one pre-existing fast-refresh warning for `src/context/ShopContext.tsx` (`react(only-export-components)`); it is a warning, not an error, and does not affect the build.

## Project structure

```text
public/
  images/
    instruments/        Category-level instrument illustrations (SVG)
    IMAGE-GUIDE.md      How product imagery is resolved and can be extended
src/
  App.tsx               Route definitions
  main.tsx              React entry point and BrowserRouter
  index.css             Tailwind import, design tokens, motion rules, base styles
  components/
    brand/              Shared Sound Unleashed logo lockup and first-visit intro
    layout/             Header, footer, application shell, theme provider and appearance menu
    product/            Product card, product image, dealer offer card, image resolver
    ui/                 Shared button primitive
  context/
    ShopContext.tsx     Saved, likes, ratings, and cart state (localStorage-backed)
  data/
    products.ts         The local product catalogue — the single source of product data
  lib/
    catalogue.ts        Search, sorting, and recorded-listing-price helpers
    instrument-finder.ts Rule-based finder options, budget bands, and recommendations
  pages/                Home, catalogue, finder, product detail, saved, cart, about
  types/                Shared product types
```

Path alias `@/` maps to `src/`.

## How product discovery works

All discovery runs against the local catalogue in `src/data/products.ts`. No network requests, AI models, or live retailer feeds are involved.

- **Search** matches product names, brands, categories, and descriptions.
- **Filters and sorting** are implemented in `src/lib/catalogue.ts`.
- **Prices** use only offers explicitly marked as `listing` prices. MRPs and offers without a numeric price are never treated as listing prices. Cards show the lowest valid recorded listing price for a product.
- **The finder** filters by the category values selected in step 1, reorders results according to a documented category-level intended-use preference in step 2, and optionally filters by the lowest valid recorded listing price in step 3. It does not claim to assess skill level or technical suitability, and it does not use AI.
- **Budget bands** are half-open intervals (`min ≤ price < max`), with the top band open-ended at ₹40,000 and above. Products without a recorded listing price are excluded from budget matching and disclosed in the results.

Recorded prices and availability are previously observed values. They may change and are **not guaranteed live quotations**. Visitors should confirm current details on the retailer's website.

## Local storage

Saved items, likes, local demonstration ratings, and the cart are stored in the browser only. No account is required and nothing is sent to a server. The keys are:

- `sound-unleashed:saved:v1`
- `sound-unleashed:likes:v1`
- `sound-unleashed:ratings:v1`
- `sound-unleashed:cart:v1`

Clearing site data removes these values. Ratings are a local demonstration feature and do not represent real customer feedback.

The appearance preference uses its own key, `sound-unleashed:theme:v1` (`system`, `light`, or `dark`). The first-visit intro uses a session-only marker, `sound-unleashed:intro-seen:v1`, so it returns only in a new browser session. Neither key reads or writes the shop keys above.

## Appearance

The header appearance menu offers **System**, **Light**, and **Dark**. With no stored choice the app follows the operating system and keeps following it while System is selected. An explicit Light or Dark choice is remembered across routes, refreshes, and new tabs, and it ignores later operating-system changes.

The palette is defined once as semantic tokens in `src/index.css`; `html.dark` swaps the token values for a deep aubergine/plum appearance instead of adding per-component dark classes. The document's `color-scheme` is kept in sync so native selects, scrollbars, and other browser controls match. A small inline script in `index.html` applies the stored class before the first paint, avoiding a flash of the wrong theme. Local storage failures fall back to the system preference without breaking the page.

## First-visit intro

A short branded overlay appears only when a browser session begins on the homepage (`/`). It reuses the shared `BrandLogo`, reveals the tagline “Discover your next sound.”, and offers **Enter Sound Unleashed** plus **Skip intro**. The logo itself is also an entrance button. The automatic reveal completes in under two seconds.

Direct links to the catalogue, finder, product pages, saved items, cart, or about are never blocked. Internal navigation back to the homepage does not replay the intro, and the session marker is written when the overlay is dismissed or finishes. Visitors who prefer reduced motion skip the intro entirely. While the overlay is open the page behind it is inert and cannot scroll; once it closes, focus moves to the main landmark. No audio, external assets, or animation libraries are used.

## Purchases and external links

Sound Unleashed is a discovery and retailer-referral prototype. The cart is for demonstration only and does not complete a transaction. Retailer links open the retailer's own website in a new tab; purchases, payment, delivery, and after-sales support are handled entirely by that retailer.

## Product photography

Product cards currently use category-level instrument illustrations from `public/images/instruments/`. They are representative artwork, not photographs of specific models. Product image paths and the category fallback are resolved in `src/components/product/product-images.ts`. See `public/images/IMAGE-GUIDE.md` for the naming convention and how to add real product photographs later without changing the component architecture.
