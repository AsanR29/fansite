/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'public/*/*.css',
    'public/styles/blah.css'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ddaa77",
          light: "#eeaa88",
          dark: "#ccaa66",
          500: "#ddaa77",
        }
      },
      fontFamily: {
        headline: "Poppins, sans-serif",
      }
    },
  },
  plugins: [],
}
