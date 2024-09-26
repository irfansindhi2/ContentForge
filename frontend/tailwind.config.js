/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Make sure Tailwind scans your project files for utility classes
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],  // Add DaisyUI as a plugin
};


