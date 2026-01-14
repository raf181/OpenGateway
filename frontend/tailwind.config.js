/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        // Apple color palette
        primary: {
          50: '#f5f5f7',
          100: '#ebebf0',
          200: '#d5d5e3',
          300: '#c0c0d0',
          400: '#a6a6b8',
          500: '#8b8b9e',
          600: '#6e6e82',
          700: '#535363',
          800: '#424245',
          900: '#1d1d1f',
        },
        // Apple accent - system blue
        accent: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#c0dfff',
          300: '#a0cfff',
          400: '#5ba3ff',
          500: '#0a84ff',
          600: '#0071e3',
          700: '#0066cc',
          800: '#004fb8',
          900: '#003d9a',
        },
        // Apple grays
        gray: {
          50: '#f9f9fb',
          100: '#f5f5f7',
          200: '#ebebf0',
          300: '#d5d5e3',
          400: '#c0c0d0',
          500: '#8b8b9e',
          600: '#6e6e82',
          700: '#535363',
          800: '#2a2a2e',
          900: '#1d1d1f',
        },
      },
      spacing: {
        'safe-left': 'max(1rem, env(safe-area-inset-left))',
        'safe-right': 'max(1rem, env(safe-area-inset-right))',
        'safe-top': 'max(1rem, env(safe-area-inset-top))',
        'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
      },
      borderRadius: {
        'apple-sm': '8px',
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
        'apple-2xl': '28px',
      },
      boxShadow: {
        'apple-xs': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'apple': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'apple-xl': '0 16px 48px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
  plugins: [],
}
