/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: { 50: '#fff1f7', 100: '#ffe0ee', 200: '#ffc2dd', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#be185d' },
        lilac: { 100: '#f1e8ff', 200: '#e0cdfc', 300: '#c4a5f7', 400: '#a87af0', 500: '#8b5cf6', 700: '#5b2fb3' },
        aqua: { 100: '#d5f7f3', 200: '#a3ece4', 300: '#5fdccf', 400: '#2ec4b6', 600: '#0f8b80' },
        gold: { 100: '#fff3c4', 200: '#ffe58a', 300: '#ffd23f', 400: '#f5b700', 600: '#a67900' },
        cream: '#fffaf5',
        ink: '#4a2c5e',
      },
      fontFamily: { display: ['"Baloo 2"', '"Comic Sans MS"', '"Trebuchet MS"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
