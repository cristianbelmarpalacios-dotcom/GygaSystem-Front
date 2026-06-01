import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          DEFAULT: '#9b7bb6',
          dark: '#7f6394',
          light: '#c4a9d9',
          surface: '#F8F7FA',
        },
      },
      maxWidth: {
        page: '100rem',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        brand:
          '0 1px 3px rgba(150, 114, 172, 0.12), 0 8px 24px rgba(150, 114, 172, 0.08)',
        'brand-glow':
          '0 2px 8px rgba(155, 123, 182, 0.14), 0 12px 32px rgba(155, 123, 182, 0.18)',
        'brand-glow-lg':
          '0 4px 12px rgba(155, 123, 182, 0.18), 0 20px 48px rgba(155, 123, 182, 0.22)',
      },
    },
  },
  plugins: [],
}
export default config

