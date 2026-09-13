/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f2942',
          darknavy: '#081726',
          blue: '#1d4ed8',
          lightblue: '#f0f5fa',
          saffron: '#e66b00',
          green: '#047857',
          forest: '#065f46',
          lightgreen: '#ecfdf5',
          gold: '#b45309',
          surface: '#f8fafc',
          border: '#cbd5e1',
          muted: '#64748b',
          darktext: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif']
      }
    },
  },
  plugins: [],
}
