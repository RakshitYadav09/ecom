/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9', 
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        custom: {
          white: '#ffffff',
          light: '#b7c7cf',
          medium: '#596577', 
          dark: '#465266',
          darker: '#212b43'
        },
        brand: {
          50: '#f7f9fb',
          100: '#eef4f7', 
          200: '#b7c7cf',
          300: '#9bb0bb',
          400: '#7f98a7',
          500: '#596577',
          600: '#465266',
          700: '#394453',
          800: '#2c3641',
          900: '#212b43',
        }
      }
    },
  },
  plugins: [],
}