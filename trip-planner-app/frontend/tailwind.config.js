/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'dark': '#1a1a1a',
        'dark-card': '#2d2d2d',
      },
      textColor: {
        'dark': '#ffffff',
        'dark-secondary': '#a0aec0',
      }
    },
  },
  plugins: [],
}

