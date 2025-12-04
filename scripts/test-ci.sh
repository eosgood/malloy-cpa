#!/bin/bash

# Local CI/CD Testing Script
# This simulates what GitHub Actions will run

set -e  # Exit on any error

echo "🔍 Running local CI/CD checks..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any checks fail
FAILED=0

# 1. ESLint
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Running ESLint..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if npm run lint; then
  echo -e "${GREEN}✅ ESLint passed${NC}"
else
  echo -e "${RED}❌ ESLint failed${NC}"
  FAILED=1
fi
echo ""

# 2. TypeScript
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Running TypeScript type checking..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if npm run typecheck; then
  echo -e "${GREEN}✅ TypeScript passed${NC}"
else
  echo -e "${RED}❌ TypeScript failed${NC}"
  FAILED=1
fi
echo ""

# 3. Build
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Building Next.js application..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if npm run build; then
  echo -e "${GREEN}✅ Build passed${NC}"
else
  echo -e "${RED}❌ Build failed${NC}"
  FAILED=1
fi
echo ""

# 4. Security Audit
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Running security audit..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if npm audit --audit-level=high; then
  echo -e "${GREEN}✅ No high-severity vulnerabilities${NC}"
else
  echo -e "${YELLOW}⚠️  Security vulnerabilities found (non-blocking)${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Safe to commit and push.${NC}"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Fix the issues before committing.${NC}"
  echo ""
  echo "Tips:"
  echo "  - Run 'npm run lint:fix' to auto-fix ESLint errors"
  echo "  - Run 'npm run typecheck' to see TypeScript errors"
  echo "  - Run 'npm run build' to test the build"
  exit 1
fi
