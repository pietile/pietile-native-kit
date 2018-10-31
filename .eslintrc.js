module.exports = {
  extends: ['pietile'],
  plugins: ['react-native'],
  env: {
    browser: true,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'no-use-before-define': 'off',
    'react-native/no-color-literals': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react/destructuring-assignment': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.android.js', '.ios.js'],
      },
    },
  },
  globals: {
    __DEV__: true,
  },
};
