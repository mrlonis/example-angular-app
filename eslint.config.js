// @ts-check
const eslint = require('@eslint/js');
const angular = require('angular-eslint');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const importPlugin = require('eslint-plugin-import');
const cypressPlugin = require('eslint-plugin-cypress/flat');
const depend = require('eslint-plugin-depend');
const jasmine = require('eslint-plugin-jasmine');
const globals = require('globals');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  {
    files: ['**/*.spec.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      jasmine.configs.recommended,
      importPlugin.flatConfigs?.recommended,
      depend.configs['flat/recommended'],
      eslintConfigPrettier,
      eslintPluginPrettierRecommended,
    ],
    settings: {
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.spec.json'],
        },
      },
    },
    languageOptions: { parserOptions: { projectService: true }, globals: { ...globals.jasmine } },
    plugins: { jasmine },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/sort-lifecycle-methods': 'error',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        { types: { Promise: 'Promise is not allowed, use Observable instead' } },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-deprecated': 'error',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'error',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true, commonjs: true }],
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: false },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      // ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      importPlugin.flatConfigs?.recommended,
      depend.configs['flat/recommended'],
      eslintConfigPrettier,
      eslintPluginPrettierRecommended,
    ],
    settings: {
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.app.json', 'cypress/tsconfig.json'],
        },
      },
    },
    languageOptions: { parserOptions: { projectService: true } },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/sort-lifecycle-methods': 'error',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        { types: { Promise: 'Promise is not allowed, use Observable instead' } },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-deprecated': 'error',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'error',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true, commonjs: true }],
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: false },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      eslintConfigPrettier,
      eslintPluginPrettierRecommended,
    ],
    rules: {
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
    },
  },
  cypressPlugin.configs.recommended,
]);
