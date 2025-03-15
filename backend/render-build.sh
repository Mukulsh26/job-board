#!/bin/bash

echo "🚀 Running Render Build Script"

# Install dependencies
npm install

# Ensure Puppeteer downloads Chromium
npx puppeteer browsers install chrome

echo "✅ Build script completed successfully"
