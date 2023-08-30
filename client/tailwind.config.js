/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      margin: {
        '45px': '45px',
      },
      scale: {
        '101': '1.01',
      },
      width: {
        '80vw': '80vw',
      },
      minHeight: {
        '90vh': '90vh',
        '80vh': '85vh',
      },
      colors: {
        'kakao': '#FEE500',
      },
    },
  },
  plugins: [],
}