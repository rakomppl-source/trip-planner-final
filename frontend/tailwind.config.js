/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effbf6",
          100: "#d7f5e7",
          200: "#aeeacf",
          300: "#7fdcb2",
          400: "#53c692",
          500: "#2ea974",
          600: "#1f855b",
          700: "#196a4a",
          800: "#16543d",
          900: "#144634"
        }
      }
    }
  },
  plugins: []
};
