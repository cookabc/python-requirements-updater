#!/bin/bash

# OpenVSX Extension Publishing Script
# Usage: ./publish-ovsx.sh

set -e

echo "🚀 OpenVSX Extension Publishing Script"
echo "======================================"

# Check if ovsx is available via npx
if ! npm list -g ovsx &> /dev/null; then
    echo "📦 'ovsx' will be run via npx..."
fi

# Load .env if it exists
if [ -f ".env" ]; then
    echo "📄 Loading environment variables from .env..."
    export $(grep -v '^#' .env | xargs)
fi

# Compile project
echo "🔨 Compiling TypeScript..."
npm run compile

# Check for icon file
if [ ! -f "icon.png" ]; then
    echo "⚠️  Warning: No icon.png found."
else
    echo "✅ Icon file found: icon.png"
fi

# Check git status
if [ -d ".git" ]; then
    echo "📝 Checking git status..."
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️  You have uncommitted changes."
        # Verify if we should proceed (non-interactive mode assumption: proceed or warn)
        echo "   Continuing with current files..."
    fi
fi

echo "📋 Current package info:"
echo "  Name: $(node -p "require('./package.json').name")"
echo "  Version: $(node -p "require('./package.json').version")"
echo "  Publisher: $(node -p "require('./package.json').publisher")"

echo ""

# Check for OVSX_PAT environment variable
if [ -z "$OVSX_PAT" ]; then
    echo "⚠️  OVSX_PAT environment variable is not set."
    echo "   You can set it with: export OVSX_PAT=your_token"
    echo "   Or the tool might prompt you for a token (if interactive)."
    
    echo "🚀 Publishing to OpenVSX (interactive/manual auth)..."
    npx ovsx publish
else
    echo "🔑 OVSX_PAT found."
    echo "🚀 Publishing to OpenVSX..."
    npx ovsx publish -p "$OVSX_PAT"
fi

echo ""
echo "🎉 Done! Check your extension at:"
echo "   https://open-vsx.org/extension/cookabc/python-requirements-updater"
