module.exports = {
  ignorePatterns: ['node_modules/**', 'logs/**'],
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    eqeqeq: ['error', 'always'],
    'max-len': ['error', { code: 100 }],
    'prettier/prettier': ['error', { singleQuote: true, semi: true }],
    'no-console': 'off',
    'no-unused-vars': ['warn'],
  },
};
