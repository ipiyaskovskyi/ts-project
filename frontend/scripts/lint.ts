import path from 'node:path';
import { fileURLToPath } from 'node:url';
import unsupportedApi from 'eslint/use-at-your-own-risk';

const { FlatESLint } = unsupportedApi;

async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const patterns = args.filter((arg) => arg !== '--fix');

  const cwd = fileURLToPath(new URL('..', import.meta.url));
  process.chdir(cwd);

  const eslint = new FlatESLint({
    cwd,
    overrideConfigFile: path.join(cwd, 'eslint.config.ts'),
    fix: shouldFix
  });

  const filesToLint = patterns.length > 0 ? patterns : ['src/**/*.{ts,tsx}'];
  const results = await eslint.lintFiles(filesToLint);

  if (shouldFix) {
    await FlatESLint.outputFixes(results);
  }

  const formatter = await eslint.loadFormatter('stylish');
  const output = formatter.format(results);
  if (output) {
    console.log(output);
  }

  const hasErrors = results.some((result) => result.errorCount > 0);

  if (hasErrors) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


