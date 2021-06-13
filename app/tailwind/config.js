/*global module*/
/*eslint-env node */
const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    fontFamily: {
      debussy: ['debussy', 'sans-serif'],
      helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      cursive: ['font-cursive'],
    },
    extend: {
      height: {
        'handle-resize': 'calc(var(--vh, 1vh) * 100)',
      },
      colors: {
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        red: 'red',
        'df-pink': '#e992ff',
        'df-yellow': '#fff94f',
        'df-yellow-dark': '#e8e000',
        'df-blue': '#00b4ff',
        'df-blue-dark': '#007eb3',
        'df-green': '#5fdc82',
        'df-green-dark': '#2bc456',
      },
    },
    themeVariants: ['classic', 'blm', 'trans'],
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'classic', 'blm', 'trans'],
    textColor: ['responsive', 'hover', 'focus', 'classic', 'blm', 'trans'],
    visibility: ['responsive', 'hover', 'focus', 'classic', 'blm', 'trans'],
  },
  plugins: [require('tailwindcss-multi-theme')],
};
