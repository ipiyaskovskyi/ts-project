import js from '@eslint/js';
import pluginN from 'eslint-plugin-n';
import prettierPlugin from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module'
      }
    },
    plugins: {
      n: pluginN,
      prettier: prettierPlugin
    },
    rules: {
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-unsupported-features/es-builtins': 'off',
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    }
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'n/no-unpublished-import': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
);


