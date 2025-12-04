# Testing CI/CD Locally

Before pushing your code, you can test what GitHub Actions will run locally.

## Quick Start

### Run Full CI Pipeline Locally

```bash
npm run test:ci
```

This runs the same checks as GitHub Actions:

- ✅ ESLint
- ✅ TypeScript type checking
- ✅ Next.js build
- ✅ Security audit

---

## Individual Commands

### 1. Lint Check

```bash
npm run lint
```

Auto-fix issues:

```bash
npm run lint:fix
```

### 2. Type Check

```bash
npm run typecheck
```

### 3. Build

```bash
npm run build
```

### 4. Security Audit

```bash
npm audit --audit-level=high
```

### 5. Local Health Check

First, start the dev server:

```bash
npm run dev
```

Then in another terminal:

```bash
npm run test:health
```

This checks if all pages respond correctly.

---

## Testing GitHub Actions Workflows Locally

You can use [act](https://github.com/nektos/act) to run GitHub Actions workflows on your machine.

### Install act

```bash
# macOS
brew install act

# Or use the installer script
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### Run CI Workflow

```bash
# Run the CI workflow
act -W .github/workflows/ci.yml

# Run a specific job
act -W .github/workflows/ci.yml -j quality-checks
```

### Run with Secrets

Create a `.secrets` file (don't commit this!):

```bash
ELAVON_MERCHANT_ID=test
ELAVON_USER_ID=test
ELAVON_PIN=test
CSRF_SECRET=test-secret-key-minimum-32-characters-long
RESEND_API_KEY=test
```

Then run:

```bash
act -W .github/workflows/ci.yml --secret-file .secrets
```

---

## Before Committing Checklist

Run this command to check everything:

```bash
npm run test:ci
```

If all checks pass, you're good to commit and push!

---

## Troubleshooting

### "Permission denied" errors

Make scripts executable:

```bash
chmod +x scripts/*.sh
```

### Build fails with "CSRF_SECRET not set"

For local testing, create a `.env.local` file:

```bash
CSRF_SECRET=local-test-secret-key-minimum-32-characters-long
ELAVON_MERCHANT_ID=test
ELAVON_USER_ID=test
ELAVON_PIN=test
RESEND_API_KEY=test
```

### TypeScript errors in node_modules

Clear cache and reinstall:

```bash
rm -rf .next node_modules
npm install
npm run typecheck
```

---

## Pre-commit Hook (Optional)

To automatically run checks before every commit, add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
npm run test:ci
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

Now checks run automatically before each commit!
