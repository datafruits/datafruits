module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  globals: {
    "$": false,
    "jstz": false,
    "twttr": false,
    "emojione": false
  },
  rules: {
  }
};
