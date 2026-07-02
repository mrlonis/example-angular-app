// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../eslint.config.js');
const pluginCypress = require('eslint-plugin-cypress');

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ['**/*.ts'],
    extends: [pluginCypress.configs.recommended],
    rules: {},
  },
]);
