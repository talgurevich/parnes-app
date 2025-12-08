import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e94560',
          light: '#ff6b6b',
          dark: '#c73e54',
        },
        secondary: {
          DEFAULT: '#4ecdc4',
          light: '#6ee7df',
          dark: '#44a08d',
        },
        background: {
          DEFAULT: '#1a1a2e',
          light: '#16213e',
          dark: '#0f3460',
        },
        success: '#92D050',
        warning: '#FFC000',
        danger: '#FF0000',
      },
    },
  },
  plugins: [],
}
export default config
