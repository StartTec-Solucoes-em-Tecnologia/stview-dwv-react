/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#b9afd3',
          200: '#ab9fca',
          300: '#9d8fc1',
          400: '#8f7fb8',
          500: '#816faf',
          600: '#7460a7',
          700: '#685696',
          800: '#5c4c85',
          900: '#514374'
        }
      }
    }
  },
  plugins: []
}
