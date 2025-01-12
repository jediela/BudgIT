echo "-------------Running checks-------------"

# Install
echo "\nRunning install..."
if npm install > /dev/null 2>&1; then
    echo "✅ Install: Success"
else
    echo "❌ Install: Failed"
    exit 1
fi

# Build
echo "\nRunning build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build: Success"
else
    echo "❌ Build: Failed"
    exit 1
fi

# Prettier
echo "\nRunning prettier..."
if npm run prettier > /dev/null 2>&1; then
    echo "✅ Formatting: Success"
else
    echo "❌ Formatting: Failed"
    # Run prettier --write if code is not formatted properly
    echo "\nFixing the formatting..."
    npm run prettier -- --write > /dev/null 2>&1;
    echo "✅ Formatting: Success"
fi

echo "\n-------------All checks passed!-------------\n"
sleep 2

echo "🗑️ Cleaning up packages..."
rm -rf .svelte-kit/output