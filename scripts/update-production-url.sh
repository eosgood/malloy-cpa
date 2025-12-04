#!/bin/bash

# Helper script to update production URL in CI/CD workflows
# Usage: ./scripts/update-production-url.sh <your-production-url>

if [ -z "$1" ]; then
  echo "Usage: ./scripts/update-production-url.sh <your-production-url>"
  echo "Example: ./scripts/update-production-url.sh https://malloyaccounting.com"
  echo ""
  echo "Current placeholder URL: https://malloy-cpa.vercel.app"
  echo ""
  echo "To find your actual Vercel URL, run:"
  echo "  vercel ls"
  exit 1
fi

NEW_URL="$1"
OLD_URL="https://malloy-cpa.vercel.app"

echo "Updating production URL from $OLD_URL to $NEW_URL"

# Update health-check.yml
sed -i.bak "s|$OLD_URL|$NEW_URL|g" .github/workflows/health-check.yml && rm .github/workflows/health-check.yml.bak
echo "✅ Updated health-check.yml"

# Update lighthouse.yml
sed -i.bak "s|$OLD_URL|$NEW_URL|g" .github/workflows/lighthouse.yml && rm .github/workflows/lighthouse.yml.bak
echo "✅ Updated lighthouse.yml"

echo ""
echo "Done! Production URL updated to: $NEW_URL"
echo "Don't forget to commit these changes:"
echo "  git add .github/workflows/"
echo "  git commit -m 'Update production URL in CI/CD workflows'"
