#!/bin/bash

# Run linting
npm run eslint

# Check if linting failed
if [ $? -ne 0 ]; then
    echo -e "\n❌ Eslint check failed! Above files have some issues"
    echo -e "Please fix and commit the changes\n"
    exit 1
else
    echo "✅ Lint check good!"
fi