/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'public/styles/*.css',
    'views/*.pug',
    'src/*.pug',
    'poop.html',
    'views/homepage.pug'
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
        headline: "Morrowind",  //, century gothic, Sans serif
      }
    },
  },
  plugins: [],
}
