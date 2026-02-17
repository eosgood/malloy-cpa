#!/bin/bash

# Helper script to update production URL in CI/CD workflows
# Idempotent: safe to run multiple times with the same or different URLs
#
# Usage: ./scripts/update-production-url.sh <your-production-url>

if [ -z "$1" ]; then
  echo "Usage: ./scripts/update-production-url.sh <your-production-url>"
  echo "Example: ./scripts/update-production-url.sh https://malloycpa.com"
  echo ""
  echo "This replaces any https:// URL in workflow curl/lighthouse targets."
  echo ""
  echo "To find your actual Vercel URL, run:"
  echo "  vercel ls"
  exit 1
fi

NEW_URL="$1"

# Strip trailing slash for consistent replacement
NEW_URL="${NEW_URL%/}"

# Validate it looks like a URL
if [[ ! "$NEW_URL" =~ ^https:// ]]; then
  echo "❌ URL must start with https://"
  exit 1
fi

WORKFLOW_DIR=".github/workflows"

if [ ! -d "$WORKFLOW_DIR" ]; then
  echo "❌ $WORKFLOW_DIR directory not found"
  exit 1
fi

# Replace any existing https:// domain in health check curl commands and lighthouse URLs
# This makes the script idempotent — works regardless of what URL is currently there
for file in "$WORKFLOW_DIR/health-check.yml" "$WORKFLOW_DIR/lighthouse.yml"; do
  if [ -f "$file" ]; then
    # Match https://[domain]/ or https://[domain]/path patterns
    sed -i.bak -E "s|https://[a-zA-Z0-9._-]+\.(app\|com\|dev\|io\|net\|org)/|${NEW_URL}/|g" "$file" && rm -f "${file}.bak"
    echo "✅ Updated $(basename "$file")"
  else
    echo "⚠️  $(basename "$file") not found, skipping"
  fi
done

echo ""
echo "Done! Production URL updated to: $NEW_URL"
echo ""
echo "Verify with:"
echo "  grep -n '$NEW_URL' $WORKFLOW_DIR/*.yml"
echo ""
echo "Don't forget to commit:"
echo "  git add $WORKFLOW_DIR/"
echo "  git commit -m 'Update production URL to $NEW_URL'"
