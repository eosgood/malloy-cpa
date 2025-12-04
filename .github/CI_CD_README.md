# CI/CD Documentation

This project uses GitHub Actions for continuous integration and deployment monitoring.

## Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**

- Push to `main` branch
- Pull requests to `main` branch

**What it does:**

- ✅ Installs dependencies
- ✅ Runs ESLint for code quality
- ✅ Runs TypeScript type checking
- ✅ Builds the Next.js application
- ✅ Checks for security vulnerabilities (npm audit)
- ✅ Reviews dependency changes (PRs only)

**Required for:**

- All pull requests must pass before merging
- Ensures code quality on every commit

---

### 2. Health Check (`.github/workflows/health-check.yml`)

**Triggers:**

- Every 30 minutes (automated)
- Manual trigger via GitHub Actions UI
- After pushes to `main` (post-deployment)

**What it checks:**

- Homepage (/)
- About page (/about)
- Services page (/services)
- Contact page (/contact)
- Payment page (/payment)
- CSRF API endpoint (/api/csrf)

**Notifications:**

- ❌ Fails if any page returns non-200 status
- Shows which specific page failed in the logs

---

### 3. Lighthouse Performance (`.github/workflows/lighthouse.yml`)

**Triggers:**

- Daily at 2 AM UTC
- Manual trigger via GitHub Actions UI
- After pushes to `main`

**What it does:**

- Runs Google Lighthouse audits on all pages
- Checks performance, accessibility, SEO, and best practices
- Uploads detailed reports as artifacts
- Provides public report links

---

## How to Use

### View Workflow Status

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. View all workflow runs and their status

### Manual Health Check

1. Go to Actions → Health Check
2. Click "Run workflow"
3. Select branch and run

### Fix CI Failures

**ESLint errors:**

```bash
npm run lint:fix
```

**TypeScript errors:**

```bash
npm run typecheck
```

**Build errors:**

```bash
npm run build
```

**Run all checks locally:**

```bash
npm test
```

---

## Environment Variables for CI

The CI pipeline uses dummy values for environment variables during build. These are **not** used in production:

- `ELAVON_MERCHANT_ID`
- `ELAVON_USER_ID`
- `ELAVON_PIN`
- `CSRF_SECRET`
- `RESEND_API_KEY`

Production values are managed in Vercel's dashboard.

---

## Monitoring Production

### Update Production URL

If your production URL changes, update these files:

- `.github/workflows/health-check.yml`
- `.github/workflows/lighthouse.yml`

Search for `malloy-cpa.vercel.app` and replace with your actual domain.

---

## GitHub Actions Badge

Add this to your README.md to show CI status:

```markdown
![CI](https://github.com/eosgood/malloy-cpa/workflows/CI/badge.svg)
![Health Check](https://github.com/eosgood/malloy-cpa/workflows/Production%20Health%20Check/badge.svg)
```

---

## Troubleshooting

### Health Check Fails

1. Check if site is actually down
2. Verify URL in workflow file
3. Check Vercel deployment status
4. Review error logs in Actions tab

### Lighthouse Fails

- Usually means performance regression
- Check uploaded artifacts for detailed reports
- Review recommendations in Lighthouse reports

### Build Fails in CI but works locally

- Clear `.next` directory and rebuild
- Check Node.js version (CI uses Node 20)
- Ensure all dependencies are in package.json

---

## Next Steps

Consider adding:

- Unit tests with Jest/Vitest
- E2E tests with Playwright
- Visual regression testing
- Automated dependency updates (Dependabot)
- Slack/Discord notifications on failures
