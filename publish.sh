#!/bin/bash

# VS Code Extension Publishing Script
# Usage: ./publish.sh

set -e

echo "🚀 VS Code Extension Publishing Script"
echo "======================================"

# Check if vsce is installed
if ! command -v vsce &> /dev/null; then
    echo "📦 Installing vsce (VS Code Extension Manager)..."
    npm install -g @vscode/vsce
fi

# Compile project
echo "🔨 Compiling TypeScript..."
npm run compile

# Check for icon file
if [ ! -f "icon.png" ]; then
    echo "⚠️  Warning: No icon.png found. The extension will use default icon."
    echo "   Create a 128x128 PNG icon for better presentation."
    # Temporarily remove icon configuration
    sed -i.bak 's/.*"icon": "icon.png",.*//g' package.json
else
    echo "✅ Icon file found: icon.png"
fi

# Check git status
if [ -d ".git" ]; then
    echo "📝 Checking git status..."
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  You have uncommitted changes. Consider committing them first."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

echo "📋 Current package info:"
echo "  Name: $(node -p "require('./package.json').name")"
echo "  Version: $(node -p "require('./package.json').version")"
echo "  Publisher: $(node -p "require('./package.json').publisher")"

echo ""
echo "🎯 Choose publishing option:"
echo "1) Package only (.vsix file)"
echo "2) Publish to marketplace"
echo "3) Publish patch version (x.x.X)"
echo "4) Publish minor version (x.X.x)"
echo "5) Publish major version (X.x.x)"

read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "📦 Creating package..."
        vsce package
        echo "✅ Package created successfully!"
        ;;
    2)
        echo "🚀 Publishing to marketplace..."
        vsce publish
        echo "✅ Published successfully!"
        ;;
    3)
        echo "🚀 Publishing patch version..."
        vsce publish patch
        echo "✅ Patch version published successfully!"
        ;;
    4)
        echo "🚀 Publishing minor version..."
        vsce publish minor
        echo "✅ Minor version published successfully!"
        ;;
    5)
        echo "🚀 Publishing major version..."
        vsce publish major
        echo "✅ Major version published successfully!"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Restore icon configuration (if removed)
if [ -f "package.json.bak" ]; then
    mv package.json.bak package.json
fi

echo ""
echo "🎉 Done! Check your extension at:"
echo "   https://marketplace.visualstudio.com/items?itemName=cookabc.python-requirements-updater"