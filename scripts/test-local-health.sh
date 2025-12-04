#!/bin/bash

# Local Health Check Script
# Tests if the site is running locally before deploying

echo "🏥 Running local health checks..."
echo ""

# Check if dev server is running
PORT=3000
if ! curl -s http://localhost:$PORT/ > /dev/null; then
  echo "❌ Development server is not running on port $PORT"
  echo ""
  echo "Start the dev server first:"
  echo "  npm run dev"
  echo ""
  echo "Then run this script again."
  exit 1
fi

echo "✅ Dev server is running on port $PORT"
echo ""

# Function to check a page
check_page() {
  local path=$1
  local name=$2
  
  echo -n "Checking $name ($path)... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT$path)
  
  if [ $response -eq 200 ]; then
    echo "✅ OK (HTTP $response)"
    return 0
  else
    echo "❌ FAILED (HTTP $response)"
    return 1
  fi
}

# Check all pages
FAILED=0

check_page "/" "Homepage" || FAILED=1
check_page "/about" "About page" || FAILED=1
check_page "/services" "Services page" || FAILED=1
check_page "/contact" "Contact page" || FAILED=1
check_page "/payment" "Payment page" || FAILED=1
check_page "/api/csrf" "CSRF API" || FAILED=1

echo ""
if [ $FAILED -eq 0 ]; then
  echo "✅ All pages are responding correctly!"
  exit 0
else
  echo "❌ Some pages failed. Check the development server logs."
  exit 1
fi
