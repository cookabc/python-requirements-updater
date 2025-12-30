# Python Requirements Updater

Smart version management for Python requirements.txt files with one-click updates and breaking change detection.

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/cookabc.python-requirements-updater)](https://marketplace.visualstudio.com/items?itemName=cookabc.python-requirements-updater)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/cookabc.python-requirements-updater)](https://marketplace.visualstudio.com/items?itemName=cookabc.python-requirements-updater)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🔍 **Smart Version Detection** - Automatically detects `requirements.txt` files and displays version information
- 🎯 **Risk Analysis** - Distinguishes between safe updates (patch/minor) and risky updates (major versions)
- 🖱️ **One-Click Updates** - Click on version hints to update to the latest version instantly
- ⚠️ **Safety Confirmation** - Shows confirmation dialogs for major version updates to prevent breaking changes
- 📊 **Status Bar Display** - Real-time display of updatable package count
- 🌍 **Multi-language Support** - Supports Chinese, English, Japanese, Korean, and more languages
- 💾 **Smart Caching** - Reduces network requests and improves response speed

## 🚀 Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Python Requirements Updater"
4. Click Install

Or install from command line:
```bash
code --install-extension cookabc.python-requirements-updater
```

## 🚀 Usage

1. Open any `requirements.txt` file
2. The extension automatically shows status for each dependency:
   - `✓ Up to date` - Package is already latest version
   - `↗ Update to X.X.X` - Safe update available (click to update)
   - `⚠️ Update to X.X.X Major` - Major version update (use caution)

### Batch Updates

- Click the status bar update notification
- Or use Command Palette: `Ctrl+Shift+P` → "Update All Packages"
- Automatically separates safe updates from risky major version updates

## ⚙️ Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `pyDepsHint.enabled` | `true` | Enable/disable the extension |
| `pyDepsHint.showPrerelease` | `false` | Include pre-release versions |
| `pyDepsHint.cacheTTLMinutes` | `60` | Cache TTL in minutes |

## 🏗️ Project Structure

```
src/
├── core/           # Core business logic
│   ├── cache.ts           # Cache management
│   ├── parser.ts          # Dependency parsing
│   ├── versionAnalyzer.ts # Version risk analysis
│   └── versionResolver.ts # Version resolution
├── providers/      # Service providers
│   ├── codeLensProvider.ts # CodeLens provider
│   ├── pypiClient.ts      # PyPI API client
│   └── versionService.ts  # Version service
├── utils/          # Utility functions
│   ├── configuration.ts   # Configuration management
│   ├── i18n.ts           # Internationalization
│   └── statusBar.ts      # Status bar management
├── types/          # Type definitions
│   └── index.ts
└── extension.ts    # Extension entry point
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Run tests
npm test

# Package extension
npx vsce package
```

## 📄 License

MIT
