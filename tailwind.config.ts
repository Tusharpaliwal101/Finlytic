import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#3557ff',
          light: 'rgba(53, 87, 255, 0.08)',
          dark: '#2a45cc',
        },
        green: {
          DEFAULT: '#00c9a7',
          dark: '#00a388',
        },
        error: '#ff4b4b',
        warning: '#ffb34b',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '10': '10px',
        '16': '16px',
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      boxShadow: {
        brand: '0 4px 20px rgba(53, 87, 255, 0.04)',
      },
      transitionDuration: {
        DEFAULT: '170ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
      },
    },
  },
  plugins: [],
}

export default config
