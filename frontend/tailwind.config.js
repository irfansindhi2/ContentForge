module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',  // Defines a 24-column grid
      },
    },
  },
  plugins: [require('daisyui')],
};