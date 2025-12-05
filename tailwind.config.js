/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F37021', // Primary orange for CTAs, icons, highlights
          dark: '#d35a0f', // Darker shade for hover states
        },
        heading: '#333333', // Dark gray for headings
        body: '#6B6B6B', // Body gray for regular text
        'background-light': '#FFFFFF', // White background
        'background-gray': '#FBFBFB', // Light gray background
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'], // For headings
        body: ['Inter', 'sans-serif'], // For body text
      },
    },
  },
  plugins: [],
} 
