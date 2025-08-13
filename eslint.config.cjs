// @ts-check
'use strict';

module.exports = [
  // Basic JavaScript configuration
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        // DOM types
        Event: 'readonly',
        CustomEvent: 'readonly',
        HTMLElement: 'readonly',
        // Other common globals
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.min.js',
    ],
  },
];
