/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7700', // Naranja del logo Yastaa
          50: '#fff3e6',
          100: '#ffe2cc',
          200: '#ffc199',
          300: '#ff9c66',
          400: '#ff7733',
          500: '#FF7700',
          600: '#cc5f00',
          700: '#994700',
          800: '#663000',
          900: '#331800',
          950: '#1a0c00',
        },
        secondary: {
          DEFAULT: '#00C800', // Verde flecha del logo Yastaa
          50: '#e6ffe6',
          100: '#ccffcc',
          200: '#99ff99',
          300: '#66ff66',
          400: '#33ff33',
          500: '#00C800',
          600: '#00a000',
          700: '#007800',
          800: '#005000',
          900: '#002800',
          950: '#001400',
        }
      }
    },
  },
  plugins: [],
}
