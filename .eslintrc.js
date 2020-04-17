module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'react'],
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.server.json'],
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
