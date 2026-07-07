/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#1e1f22',
          secondary: '#26272b',
          tertiary: '#2f3136',
          hover: '#34363c'
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          muted: '#1e3a5f'
        },
        border: {
          DEFAULT: '#34363c'
        },
        text: {
          primary: '#dcddde',
          secondary: '#9a9ba1',
          muted: '#6c6d72'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
}
