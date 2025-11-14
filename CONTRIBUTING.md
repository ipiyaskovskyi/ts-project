# Contributing to Task Tracker

Thank you for your interest in contributing to Task Tracker!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes

## Development Workflow

1. **Before making changes:**
   - Ensure you're on the latest `main` branch
   - Create a new branch for your feature/fix

2. **While developing:**
   - Write tests for new features
   - Follow the existing code style
   - Run `npm run lint` and `npm run format` before committing

3. **Before committing:**
   - Run `npm run type-check` to check for TypeScript errors
   - Run `npm run lint:check` to check for linting errors
   - Run `npm run format:check` to check code formatting
   - Run `npm test` to ensure all tests pass

4. **Committing:**
   - Write clear, descriptive commit messages
   - Husky will automatically run pre-commit hooks (lint-staged)
   - Before pushing, ensure pre-push hooks pass (type-check, lint, format, tests)

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules (no warnings allowed)
- Use Prettier for formatting
- Write meaningful variable and function names
- Add comments for complex logic

## Testing

- Write tests for all new features
- Maintain or improve test coverage
- Use descriptive test names
- Test both success and error cases

## Pull Request Process

1. Update README.md if needed
2. Update documentation if API changes
3. Ensure all CI checks pass
4. Request review from maintainers
5. Address review comments

## Questions?

Feel free to open an issue for questions or discussions.
