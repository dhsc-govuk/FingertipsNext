import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJest from 'eslint-plugin-jest';
import pluginPlaywright from 'eslint-plugin-playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: ['.next/**', 'generated-sources/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'next'),
  {
    plugins: { jest: pluginJest, playwright: pluginPlaywright },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_$',
        },
      ],
      'jest/no-focused-tests': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/valid-expect': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-page-pause': 'error',
    },
  },
];

export default eslintConfig;
