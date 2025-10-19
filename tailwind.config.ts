import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: {
        ink: { 950: '#0b1220', 900: '#0f172a', 800: '#111827' }
      },
      boxShadow: {
        card: '0 6px 18px rgba(2, 6, 23, .5)'
      }
    }
  },
  plugins: []
} satisfies Config;
