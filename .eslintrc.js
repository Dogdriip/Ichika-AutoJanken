module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-console': 0,
    'no-plusplus': 0,
    'vars-on-top': 0,
    'no-restricted-syntax': [0, 'ForOfStatement'],
  },
};
