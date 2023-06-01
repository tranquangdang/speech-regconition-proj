/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    // Example content paths...
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {},
    colors: {
      black: '#000000',
      'grey-dark': '#666666',
      'grey-medium': '#cccccc',
      'grey-light': '#d8d8d8',
    },
  },
  plugins: [],
};
