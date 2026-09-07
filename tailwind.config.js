/**
 * Tailwind CSS Configuration
 * Defines custom color palettes (Statutory Forest Green #0d4734, warning ambers, dark slate)
 * and typography scales matching Legal Metrology Department design system.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          green: '#0d4734',
          dark: '#083325',
          light: '#e6f4ea',
          accent: '#10b981',
          gold: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
};
