/*eslint-env node */
/* global require, module */
const { colors } = require('tailwindcss/defaultTheme');
module.exports = {
  theme: {
    fontFamily: {
      debussy: ['debussy', 'sans-serif'],
      topaz: ['topaz'],
      helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      cursive: ['cursive'],
    },
    extend: {
      textShadow: {
        DEFAULT: "0 2px 4px var(--tw-shadow-color)"
      },
      height: {
        'handle-resize': 'calc(var(--vh, 1vh) * 100)',
      },
      colors: {
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        red: 'red',
        'df-pink': '#cf79e9',
        'df-yellow': '#fff94f',
        'df-yellow-dark': '#e8e000',
        'df-blue': '#00b4ff',
        'df-blue-dark': '#007eb3',
        'df-green': '#41d069',
        'df-green-dark': '#289244',
      },
    },
    themeVariants: ['classic', 'blm', 'trans'],
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'classic', 'blm', 'trans'],
    textColor: ['responsive', 'hover', 'focus', 'classic', 'blm', 'trans'],
    visibility: ['responsive', 'hover', 'focus', 'classic', 'blm', 'trans'],
  },
  plugins: [require('tailwindcss-multi-theme'), require('@frontile/core/tailwind')],
};
