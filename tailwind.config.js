import { join } from 'path'

export default {
  content: [
    join(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './index.html'),
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#863bff',
        'brand-primary-dark': '#7e14ff',
        'brand-accent': '#47bfff',
        'brand-accent-light': '#ede6ff',
      },
    },
  },
  plugins: [],
}
