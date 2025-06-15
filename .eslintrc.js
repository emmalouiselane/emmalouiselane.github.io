module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    React: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'gatsby',
  ],
  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/no-unused-prop-types': 'error',
    'react/no-unknown-property': 'error',

    // Accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/media-has-caption': 'error',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-param-reassign': ['error', { props: false }],
    'no-unused-expressions': ['error', { allowShortCircuit: true }],

    // Import rules
    'import/no-unresolved': ['error', { ignore: ['^@/'] }],
    'import/no-extraneous-dependencies': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'public/', '.cache/'],
}
