# Pre-commit Hook Documentation

## Overview

This project uses **Husky** and **lint-staged** to automatically run code quality checks before each commit. This ensures that only properly formatted and linted code is committed to the repository.

## What happens during pre-commit?

### 1. **Automatic Code Formatting**

- **Prettier** formats all staged files to ensure consistent code style
- **ESLint** auto-fixes issues that can be automatically resolved

### 2. **Code Quality Checks**

- **ESLint** runs on all TypeScript/JavaScript files
- **Prettier** checks formatting on JSON and Markdown files
- Only critical errors will block commits (warnings are allowed)

## Configuration

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  }
}
```

### Lint-staged Configuration

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --ignore-pattern '*.config.js'",
      "prettier --write"
    ],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## How to use

### Normal Development Workflow

1. Make your code changes
2. `git add .` (stage your changes)
3. `git commit -m "Your commit message"`
4. The pre-commit hook will automatically run:
   - Format your code with Prettier
   - Fix linting issues with ESLint
   - Check for critical errors

### Manual Commands

```bash
# Run ESLint on all files
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check if files are properly formatted
npm run format:check
```

## Enabling Strict Mode

Currently, the pre-commit hook is set to allow commits with warnings. To enable strict mode that blocks commits with any errors:

1. Edit `.husky/pre-commit`
2. Uncomment the lines for strict error checking:
   ```bash
   echo "🔍 Checking for critical linting issues..."
   npm run lint -- --max-warnings 200 --quiet
   if [ $? -ne 0 ]; then
     echo "❌ ESLint found critical syntax errors that need manual fixing. Please fix them before committing."
     exit 1
   fi
   ```

## Bypassing the Hook (Emergency Only)

If you need to bypass the pre-commit hook in an emergency:

```bash
git commit -m "Emergency commit" --no-verify
```

**Note**: This should only be used in emergencies as it bypasses all quality checks.

## Files Affected by the Hook

### Linted and Formatted:

- `*.js`, `*.jsx`, `*.ts`, `*.tsx` files
- `*.json` and `*.md` files (formatting only)

### Ignored:

- `node_modules/`
- `.expo/`
- `dist/` and `build/`
- `*.d.ts` files
- `metro.config.js`
- `eslint.config.js`

## Benefits

✅ **Consistent Code Style**: All code follows the same formatting rules
✅ **Automatic Fixes**: Many linting issues are fixed automatically
✅ **Prevent Broken Code**: Critical errors are caught before commit
✅ **Team Collaboration**: Everyone's code looks and behaves the same way
✅ **Reduced Code Review Time**: Less time spent on style/formatting issues

## Troubleshooting

### Hook not running?

```bash
# Ensure husky is installed
npm run prepare

# Check if hook is executable
chmod +x .husky/pre-commit
```

### Too many warnings?

The hook is configured to allow up to 200 warnings. If you hit this limit:

1. Fix the critical issues first
2. Gradually reduce warnings over time
3. Adjust `--max-warnings` in the hook if needed

### Hook failing on specific files?

Check the ESLint configuration in `eslint.config.js` to ensure problem files are properly ignored or configured.
