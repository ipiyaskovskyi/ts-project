import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

const reactRecommendedRules = reactPlugin.configs.recommended?.rules ?? {};
const reactJsxRuntimeRules = reactPlugin.configs['jsx-runtime']?.rules ?? {};
const reactHooksRecommendedRules = reactHooks.configs.recommended?.rules ?? {};
const jsxA11yRecommendedRules = jsxA11y.configs.recommended?.rules ?? {};

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier: prettierPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactRecommendedRules,
      ...reactJsxRuntimeRules,
      ...reactHooksRecommendedRules,
      ...jsxA11yRecommendedRules,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'warn'
    }
  }
);


