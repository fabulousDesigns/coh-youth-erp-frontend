// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Navy blue shades
        primary: {
          50: '#f0f3f8',
          100: '#d9e1ed',
          200: '#b3c3db',
          300: '#8da5c9',
          400: '#6687b7',
          500: '#4069a5',
          600: '#335484',
          700: '#263f63',
          800: '#1a2a42',
          900: '#0d1521',
        },
        // Whitesmoke shades
        secondary: {
          50: '#ffffff',
          100: '#f5f5f5',
          200: '#ebebeb',
          300: '#d6d6d6',
          400: '#adadad',
          500: '#8f8f8f',
          600: '#6c6c6c',
          700: '#4d4d4d',
          800: '#2e2e2e',
          900: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}
export default config