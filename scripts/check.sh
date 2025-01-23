#!/bin/bash

echo "-------------Running checks-------------"

# Install
echo -e "\nRunning install..."
if npm install > /dev/null 2>&1; then
    echo "✅ Install: Success"
else
    echo "❌ Install: Failed"
    exit 1
fi

# Build
echo -e "\nRunning build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build: Success"
else
    echo "❌ Build: Failed"
    exit 1
fi

# Prettier
echo -e "\nRunning prettier..."
if npm run prettier > /dev/null 2>&1; then
    echo "✅ Formatting: Success"
else
    echo "❌ Formatting: Failed"
    # Run prettier --write if code is not formatted properly
    echo -e "\nFixing the formatting..."
    npm run prettier -- --write > /dev/null 2>&1
    echo "✅ Formatting: Success"
fi

echo -e "\n-------------All checks passed!-------------\n"
sleep 2

echo "🗑️ Cleaning up packages..."
rm -rf .svelte-kit/output
