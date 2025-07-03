import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import pluginPlaywright from 'eslint-plugin-playwright';
import vitest from '@vitest/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'generated-sources/**',
      'playwright-report/**',
      'coverage/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'next'),
  {
    plugins: { vitest, playwright: pluginPlaywright },
    languageOptions: {
      globals: { ...vitest.environments.env.globals },
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-identical-title': 'error',
      'vitest/prefer-to-have-length': 'error',
      'vitest/valid-expect': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-page-pause': 'error',
    },
  },
];

export default eslintConfig;
