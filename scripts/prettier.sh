#!/bin/bash

# Run linting
npm run prettier

# Check if formatting failed
if [ $? -ne 0 ]; then
    echo -e "\n❌ Prettier check failed! Above files are not formatted properly"
    echo -e "Run *npm run format* to fix the issues\n"
    exit 1
else
    echo "✅ Prettier check good!"
fi
