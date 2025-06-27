/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#030711',
          darker: '#0F1629',
          dark: '#1E293B',
          primary: '#FF2E63',
          secondary: '#08F7FE',
          accent: '#00FF9F',
          purple: '#BD00FF',
          yellow: '#FFE53D'
        }
      },
      boxShadow: {
        neon: '0 0 5px theme(colors.cyber.secondary), 0 0 20px theme(colors.cyber.secondary)',
        'neon-strong': '0 0 5px theme(colors.cyber.secondary), 0 0 20px theme(colors.cyber.secondary), 0 0 40px theme(colors.cyber.secondary)',
        'neon-pink': '0 0 5px theme(colors.cyber.primary), 0 0 20px theme(colors.cyber.primary)',
        'neon-green': '0 0 5px theme(colors.cyber.accent), 0 0 20px theme(colors.cyber.accent)',
        'neon-purple': '0 0 5px theme(colors.cyber.purple), 0 0 20px theme(colors.cyber.purple)'
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(to right, rgba(8, 247, 254, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(8, 247, 254, 0.1) 1px, transparent 1px)'
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      keyframes: {
        shine: {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shine: 'shine 2s infinite'
      }
    }
  },
  plugins: []
};