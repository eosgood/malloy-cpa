# Pre-Push Checklist

## Before Every Push to Main Branch

### 1. Build Check ✅
- [ ] **Local build passes**: Run `npm run build` and verify no errors
- [ ] **TypeScript compilation**: No TypeScript errors in VS Code or terminal
- [ ] **ESLint passes**: Run `npm run lint` with no errors

### 2. File Tracking Check ✅
- [ ] **Check git status**: Run `git status` to see all changes
- [ ] **Stage all needed files**: Ensure new files (especially in `public/`) are added
- [ ] **Verify no untracked files**: Check for new assets, images, or config files
- [ ] **Review git diff**: Use `git diff --cached` to review staged changes

### 3. Development Server Check ✅
- [ ] **Local server runs**: `npm run dev` starts without errors
- [ ] **Pages load correctly**: Navigate through all routes (/, /about, /services, /contact)
- [ ] **No console errors**: Check browser console for JavaScript errors
- [ ] **Images load**: Verify all images and assets display correctly

### 4. Asset Verification ✅
- [ ] **New images committed**: Any new files in `public/` folder are tracked by git
- [ ] **Logo displays**: Home page logo renders correctly
- [ ] **Responsive design**: Check mobile and desktop layouts
- [ ] **Navigation works**: All header/footer links function

### 5. Code Quality ✅
- [ ] **No commented code**: Remove debug console.logs and commented sections  
- [ ] **Proper imports**: All imports resolve correctly
- [ ] **Clean commit message**: Descriptive commit message following convention

## Quick Commands

```bash
# Full pre-push check sequence
git status                    # Check file tracking
npm run lint                 # Check for linting errors  
npm run build                # Verify build passes
git diff --cached            # Review staged changes
git add .                    # Stage any missing files
git commit -m "Your message" # Commit with good message
git push origin main         # Push to trigger deployment
```

## Common Issues & Solutions

### Build Failing
- **Missing imports**: Check all import statements
- **TypeScript errors**: Fix type issues before pushing
- **Missing dependencies**: Run `npm install` if package.json changed

### Missing Files
- **New assets**: Always `git add` files in `public/` folder
- **Generated files**: Don't commit `.next/` or `node_modules/`
- **Config files**: Include new config files like `.env.local` (but not secrets)

### Deployment Issues
- **Environment variables**: Verify Vercel has required env vars
- **Build settings**: Check Vercel build configuration
- **Domain settings**: Ensure DNS/domain configuration is correct

## Automation Ideas
- Consider adding a pre-commit hook with `husky`
- Set up GitHub Actions for automated testing
- Use Vercel's build preview for staging changes

---
**Remember**: It's better to catch issues locally than in production! 🚀