module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-grid-layout/**/*.js',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
    },
  },
  plugins: [require('daisyui')],
  safelist: [
    { pattern: /^grid-cols-/ },
    { pattern: /^gap-/ },
  ],
};