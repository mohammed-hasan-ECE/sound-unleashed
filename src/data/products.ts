import { type Product } from '@/types/product'

/**
 * Product catalogue.
 *
 * imageUrl values currently point to category-level instrument
 * illustrations (not photographs of the exact models). Replace
 * them with product photographs as they become available —
 * see public/images/IMAGE-GUIDE.md for the naming convention.
 */
export const products: Product[] = [
  {
    id: 'yamaha-c40-guitar',
    slug: 'yamaha-c40-classical-guitar',
    name: 'C40 Classical Guitar',
    brand: 'Yamaha',
    group: 'Classical Instruments',
    category: 'Guitar',
    description: 'Entry-level classical guitar with beautiful tone and smooth playability.',
    specifications: [
      'Top: Spruce',
      'Back & Sides: Nato',
      'Neck: Nato, bolt-on',
      'Fingerboard: Rosewood',
      'Scale length: 650mm',
      'Body depth: 108mm'
    ],
    imageUrl: '/images/instruments/guitar.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-bajaao',
        dealerName: 'Bajaao',
        url: 'https://www.bajaao.com/products/yamaha-c40-classical-guitar',
        price: 9015,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-2-wavemusic',
        dealerName: 'Wave Music India',
        url: 'https://www.wavemusicindia.com/products/yamaha-c40-classical-acoustic-guitar',
        price: 8990,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-3-firstoctave',
        dealerName: 'FirstOctave',
        url: 'https://www.firstoctave.in/collections/classical-guitars',
        price: 8990,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'collection',
        isVerified: true,
        note: 'This is a collection page, not a dedicated product page'
      }
    ]
  },
  {
    id: 'yamaha-p145-piano',
    slug: 'yamaha-p145-digital-piano',
    name: 'P-145 Digital Piano',
    brand: 'Yamaha',
    group: 'Classical Instruments',
    category: 'Piano',
    description: '88-key digital piano with weighted keys and realistic piano sounds.',
    specifications: [
      '88-key, weighted, enthalpy-simulated keys',
      'AWM2 stereo sampling',
      '192 note polyphony',
      '128 built-in presets',
      'Sustain pedal support'
    ],
    imageUrl: '/images/instruments/piano.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-bajaao',
        dealerName: 'Bajaao',
        url: 'https://www.bajaao.com/products/yamaha-p45-88-key-digital-piano',
        price: 49390,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: 'URL has legacy slug despite P-145 listing'
      },
      {
        id: 'offer-2-wavemusic',
        dealerName: 'Wave Music India',
        url: 'https://www.wavemusicindia.com/products/yamaha-p-145b-digital-piano',
        price: 44000,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-3-chennaimusicals',
        dealerName: 'ChennaiMusicals',
        url: 'https://chennaimusicals.com/products/yamaha-p-series-p-145b-digital-piano-88keys-black-only-piano',
        price: 44151,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      }
    ]
  },
  {
    id: 'yamaha-psr-e383-keyboard',
    slug: 'yamaha-psr-e383-portable-keyboard',
    name: 'PSR-E383 Portable Keyboard',
    brand: 'Yamaha',
    group: 'Modern Electronic Instruments',
    category: 'Portable Keyboards',
    description: '61-key portable keyboard with lesson functions and educational features.',
    specifications: [
      '61 keys, standard size',
      '769 tones, 199 rhythms, 55 drum patterns',
      'Lesson function with arpeggio and scale lessons',
      'USB to Host connectivity',
      'Battery or AC powered'
    ],
    imageUrl: '/images/instruments/keyboard.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-yamaha-store',
        dealerName: 'Yamaha Music Store India',
        url: 'https://yamahamusicstore.in/musical-instruments/yamaha-psr-e383-portable-keyboard-61-keys-adaptor-included.html',
        price: 17990,
        currency: 'INR',
        priceType: 'mrp',
        availability: 'Out of stock',
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-2-bajaao',
        dealerName: 'Bajaao',
        url: 'https://www.bajaao.com/products/yamaha-psr-e383-61-keys-portable-keyboard',
        price: 16790,
        currency: 'INR',
        priceType: 'listing',
        availability: 'Out of stock',
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-3-chennaimusicals',
        dealerName: 'ChennaiMusicals',
        url: 'https://chennaimusicals.com/products/yamaha-psr-e383-portable-keyboard-61-keys',
        price: 16190,
        currency: 'INR',
        priceType: 'listing',
        availability: 'Sold out',
        pageType: 'product',
        isVerified: true,
        note: null
      }
    ]
  },
  {
    id: 'alesis-nitro-max',
    slug: 'alesis-nitro-max-electronic-drum-kit',
    name: 'Nitro Max Electronic Drum Kit',
    brand: 'Alesis',
    group: 'Modern Electronic Instruments',
    category: 'Drums and Percussion',
    description: '8-piece electronic drum kit with mesh drum heads and Bluetooth connectivity.',
    specifications: [
      '8-piece configuration with mesh snare and toms',
      'Kick with beater, hi-hat, crash, ride',
      '3-zone ride cymbal, chokable cymbal',
      'Bluetooth MIDI for audio app connectivity',
      'Kick pedal and hi-hat controller included'
    ],
    imageUrl: '/images/instruments/drums.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-bajaao',
        dealerName: 'Bajaao',
        url: 'https://www.bajaao.com/products/alesis-nitro-electronic-drum-kit',
        price: 37900,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-2-chennaimusicals',
        dealerName: 'ChennaiMusicals',
        url: 'https://chennaimusicals.com/products/alesis-nitro-max-kit-eight-piece-electronic-drum-kit-with-mesh-heads-and-bluetooth',
        price: 44275,
        currency: 'INR',
        priceType: 'listing',
        availability: 'Sold out',
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-3-chennaimusicals-collection',
        dealerName: 'ChennaiMusicals electronic drum catalogue',
        url: 'https://chennaimusicals.com/collections/electronic-drum-kit',
        price: 38999,
        currency: 'INR',
        priceType: 'catalogue',
        availability: 'In stock',
        pageType: 'collection',
        isVerified: true,
        note: 'This is a collection page. Product variants and configurations may differ'
      }
    ]
  },
  {
    id: 'yamaha-f310-guitar',
    slug: 'yamaha-f310-acoustic-guitar',
    name: 'F310 Natural Acoustic Guitar',
    brand: 'Yamaha',
    group: 'Classical Instruments',
    category: 'Guitar',
    description: 'Conga-style dreadnought acoustic guitar made in Indonesia with excellent projection.',
    specifications: [
      'Conga-style dreadnought body',
      'Solid Sitka spruce top',
      'Nato back and sides',
      'Creme sunburst finish',
      'Rosewood bridge'
    ],
    imageUrl: '/images/instruments/guitar.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-yamaha-store',
        dealerName: 'Yamaha Music Store India',
        url: 'https://yamahamusicstore.in/musical-instruments/yamaha-f310-natural-acoustic-guitar-made-in-india.html',
        price: 10990,
        currency: 'INR',
        priceType: 'mrp',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-2-bajaao',
        dealerName: 'Bajaao',
        url: 'https://www.bajaao.com/products/yamaha-f310-acoustic-guitar',
        price: 10440,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-3-chennaimusicals',
        dealerName: 'ChennaiMusicals',
        url: 'https://chennaimusicals.com/products/yamaha-f310-acoustic-guitar-natural',
        price: 9700,
        currency: 'INR',
        priceType: 'listing',
        availability: 'Sold out',
        pageType: 'product',
        isVerified: true,
        note: null
      }
    ]
  },
  {
    id: 'fender-fa-125',
    slug: 'fender-fa-125-dreadnought-acoustic-guitar',
    name: 'FA-125 Dreadnought Acoustic Guitar',
    brand: 'Fender',
    group: 'Classical Instruments',
    category: 'Guitar',
    description: 'Solid spruce dreadnought acoustic guitar with elegant natural finish.',
    specifications: [
      'Solid spruce top',
      'Nato back and sides',
      'Flamed rosette pattern',
      'Rosewood bridge and fingerboard',
      'Traditional dreadnought body shape'
    ],
    imageUrl: '/images/instruments/guitar.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-bajaao',
        dealerName: 'Bajaao',
        url: 'https://www.bajaao.com/products/fender-fa-125-dreadnought-acoustic-guitar',
        price: 17480,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-2-pending-1',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      },
      {
        id: 'offer-3-pending-1',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      }
    ]
  },
  {
    id: 'yamaha-c40m-guitar',
    slug: 'yamaha-c40m-classical-guitar',
    name: 'C40M Classical Guitar',
    brand: 'Yamaha',
    group: 'Classical Instruments',
    category: 'Guitar',
    description: 'Classical guitar made in Japan with premium craftsmanship.',
    specifications: [
      'Top: Japanese cedar',
      'Back & Sides: Japanese cedar',
      'Neck: Cedar, bolt-on',
      'Fingerboard: Rosewood',
      'Scale length: 650mm'
    ],
    imageUrl: '/images/instruments/guitar.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-firstoctave',
        dealerName: 'FirstOctave',
        url: 'https://www.firstoctave.in/collections/classical-guitars',
        price: 8990,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'collection',
        isVerified: true,
        note: 'This is a collection page. The C40M model differs from C40'
      },
      {
        id: 'offer-2-pending-2',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      },
      {
        id: 'offer-3-pending-2',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      }
    ]
  },
  {
    id: 'casio-ct-s1',
    slug: 'casio-ct-s1-keyboard',
    name: 'CT-S1 Keyboard',
    brand: 'Casio',
    group: 'Modern Electronic Instruments',
    category: 'Portable Keyboards',
    description: 'Compact keyboard with built-in speakers and step-up lesson functions.',
    specifications: [
      '61 keys',
      'Built-in speakers',
      'Step-up lesson function',
      'Lesson part and melody part editing',
      'USB to HOST'
    ],
    imageUrl: '/images/instruments/keyboard.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-casio-india',
        dealerName: 'Casio official India product page',
        url: 'https://www.casio.com/in/electronic-musical-instruments/product.CT-S1BK/',
        price: 16995,
        currency: 'INR',
        priceType: 'mrp',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-2-pending-3',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      },
      {
        id: 'offer-3-pending-3',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      }
    ]
  },
  {
    id: 'roland-junodi',
    slug: 'roland-junodi-synthesizer',
    name: 'JUNO-Di Synthesizer Keyboard',
    brand: 'Roland',
    group: 'Modern Electronic Instruments',
    category: 'Synthesizers',
    description: 'Portable synthesizer keyboard with classic Juno sounds and arpeggiator.',
    specifications: [
      '76 keys',
      '64 preset patches, 64 user patches',
      'Arpeggiator with 16 patterns',
      'Audio input for playing along with external sources',
      'USB for computer connectivity'
    ],
    imageUrl: '/images/instruments/synthesizer.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-bajaao',
        dealerName: 'Bajaao',
        url: 'https://www.bajaao.com/products/roland-junodi-synthesizer-keyboard',
        price: 59427,
        currency: 'INR',
        priceType: 'listing',
        availability: 'Out of stock',
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-2-pending-4',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      },
      {
        id: 'offer-3-pending-4',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      }
    ]
  },
  {
    id: 'akai-mpk-mini',
    slug: 'akai-mpk-mini-play-mk3',
    name: 'MPK Mini Play MK3 Controller Keyboard',
    brand: 'Akai',
    group: 'Modern Electronic Instruments',
    category: 'MIDI Controllers',
    description: 'Compact MIDI controller with built-in speakers and MPC Beats software.',
    specifications: [
      '25 keys, velocity-sensitive',
      'Built-in speakers',
      'MPC Beats software included',
      '8 MPC pads',
      'Jostick for pitch bend/modulation'
    ],
    imageUrl: '/images/instruments/midi.svg',
    isFeatured: true,
    offers: [
      {
        id: 'offer-1-bajaao',
        dealerName: 'Bajaao',
        url: 'https://www.bajaao.com/products/akai-mpk-mini-play-mini-controller-keyboard-with-built-in-speakers-with-mpc-beats-software-pack',
        price: 12480,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: true,
        note: null
      },
      {
        id: 'offer-2-pending-5',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      },
      {
        id: 'offer-3-pending-5',
        dealerName: 'Dealer listing pending verification',
        url: null,
        price: null,
        currency: 'INR',
        priceType: 'listing',
        availability: null,
        pageType: 'product',
        isVerified: false,
        note: null
      }
    ]
  }
]
