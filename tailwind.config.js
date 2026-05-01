/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olabits: {
          indigo: '#4f46e5',
          blue: '#2563eb',
          red: '#dc2626',
          wine: '#881337',
          light: '#f5f3ff', // Very light indigo background
        }
      }
    },
  },
  plugins: [],
}
