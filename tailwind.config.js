/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/resources/views/**/*.rb.html",
    "./src/resources/js/**/*.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brandBgDark: '#0a0a0c',
        brandSurfaceDark: '#141417',
        brandBgLight: '#f8fafc',
        brandSurfaceLight: '#ffffff',
        brandPrimary: '#e11d48',
        brandSecondary: '#fbbf24',
        brandAccent: '#10b981',
        brandBorderDark: 'rgba(255, 255, 255, 0.08)',
        brandBorderLight: 'rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'spin-slow': 'spin 40s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [],
}
