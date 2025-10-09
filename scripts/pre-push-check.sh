#!/bin/bash

# Pre-push verification script for Malloy CPA Next.js site
# Run this before pushing to catch common issues

set -e  # Exit on any error

echo "🚀 Running pre-push checks for Malloy CPA..."
echo ""

# 1. Check git status
echo "📋 1. Checking git status..."
git status
echo ""

# 2. Check for untracked files that might be needed
echo "📂 2. Checking for untracked files..."
UNTRACKED_FILES=$(git ls-files --others --exclude-standard)
if [ -n "$UNTRACKED_FILES" ]; then
    echo "⚠️  Warning: Found untracked files:"
    echo "$UNTRACKED_FILES"
    echo ""
    echo "❓ Do you need to add any of these files? (especially images in public/)"
    echo ""
else
    echo "✅ No untracked files found"
    echo ""
fi

# 3. Run linting
echo "🔍 3. Running ESLint..."
if npm run lint; then
    echo "✅ ESLint passed"
else
    echo "❌ ESLint failed - fix errors before pushing"
    exit 1
fi
echo ""

# 4. Build check
echo "🏗️  4. Testing production build..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - fix errors before pushing"
    exit 1
fi
echo ""

# 5. Check if dev server would start (quick check)
echo "🌐 5. Checking if development server starts..."
timeout 10s npm run dev > /dev/null 2>&1 || echo "⚠️  Dev server check (this is normal to timeout)"
echo ""

# 6. Show staged changes for review
echo "📝 6. Staged changes for commit:"
if git diff --cached --name-only | grep -q .; then
    git diff --cached --name-only
    echo ""
    echo "📖 Review changes with: git diff --cached"
else
    echo "⚠️  No files staged for commit"
fi
echo ""

echo "✨ Pre-push checks completed!"
echo ""
echo "🎯 Ready to push? Run:"
echo "   git commit -m 'Your descriptive message'"
echo "   git push origin main"
echo ""