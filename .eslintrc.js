module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    'arrow-parens': [1, 'as-needed'],
    'quotes': [1, 'single', { 'avoidEscape': true }],
    'space-before-function-paren': [1, { 'anonymous': 'never', 'named': 'never' }],
    'indent': [1, 2, { 'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 } }],
    'brace-style': [1, '1tbs', { 'allowSingleLine': true }],
    'max-statements-per-line': [1, { 'max': 2 }],
    'operator-linebreak': [1, 'after'],
    // NB: All rules below this line are to-dos. They should be fixed as we go and removed when the violations are removed.
    'array-bracket-spacing': 1,
    'camelcase': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    'dot-notation': 0,
    'ember-suave/no-const-outside-module-scope': 1,
    'ember-suave/no-direct-property-access': 0,
    'ember-suave/prefer-destructuring': 1,
    'ember-suave/require-const-for-ember-properties': 1,
    'generator-star-spacing': 1,
    'key-spacing': 1,
    'keyword-spacing': 1,
    'new-cap': 1,
    'no-console': 1,
    'no-empty': 1,
    'no-extra-boolean-cast': 1,
    'no-cond-assign': 1,
    'no-irregular-whitespace': 1,
    'no-multiple-empty-lines': 1,
    'no-trailing-spaces': 1,
    'no-unused-vars': 1,
    'no-var': 1,
    'object-curly-spacing': 1,
    'object-shorthand': 1,
    'one-var': 1,
    'prefer-spread': 1,
    'prefer-template': 1,
    'semi': 1,
    'semi-spacing': 1,
    'space-before-blocks': 1,
    'space-in-parens': 1,
    'space-infix-ops': 1,
    'space-unary-ops': 1,
    'spaced-comment': 1
  }
};
