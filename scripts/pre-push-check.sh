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

# 4. Type check
echo "🔎 4. Running TypeScript type check..."
if npx tsc --noEmit; then
    echo "✅ Type check passed"
else
    echo "❌ Type check failed - fix errors before pushing"
    exit 1
fi
echo ""

# 5. Build check
echo "🏗️  5. Testing production build..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - fix errors before pushing"
    exit 1
fi
echo ""

# 6. Show commits not yet pushed
echo "📝 6. Commits not yet pushed:"
UNPUSHED=$(git log @{u}.. --oneline 2>/dev/null || true)
if [ -n "$UNPUSHED" ]; then
    echo "$UNPUSHED"
else
    echo "⚠️  No unpushed commits (or no upstream set)"
fi
echo ""

echo "✨ Pre-push checks completed!"
echo ""
echo "🎯 Ready to push? Run:"
echo "   git push origin main"
echo ""