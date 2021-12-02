module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: ['.eslintrc.js', 'node_modules/', 'dist/'],
  rules: {
    '@typescript-eslint/comma-dangle': ['error', 'never'],
    '@typescript-eslint/semi': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    'linebreak-style': 'off'
  }
}
