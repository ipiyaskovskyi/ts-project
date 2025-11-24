declare module 'eslint-plugin-jsx-a11y' {
  import type { ESLint } from 'eslint';
  
  const plugin: ESLint.Plugin & {
    configs: {
      recommended: {
        rules: Record<string, ESLint.Rule>;
      };
    };
  };
  
  export default plugin;
}

