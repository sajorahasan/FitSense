#!/bin/bash

# FitSense Development Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up FitSense development environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check if Convex CLI is available
if ! command -v npx convex &> /dev/null; then
    echo "⚠️  Convex CLI not found. Installing globally..."
    pnpm add -g convex
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example files to .env and fill in your API keys"
echo "2. Run 'pnpm backend' to start the Convex development server"
echo "3. Run 'pnpm mobile' to start the Expo development server"
echo "4. Follow the README.md for detailed setup instructions"
echo ""
echo "Happy coding! 🎉"
