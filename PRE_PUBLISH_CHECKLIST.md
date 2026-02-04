# 📋 Pre-Publishing Checklist

## ✅ Required Items

### 1. Account Setup
- [ ] Create Azure DevOps account: https://dev.azure.com
- [ ] Generate Personal Access Token (Marketplace permissions)
- [ ] Save Token (needed for publishing)

### 2. Project Files
- [x] package.json configuration complete
- [x] README.md documentation complete
- [x] CHANGELOG.md version history
- [x] LICENSE file exists
- [x] icon.png icon file (128x128)
- [x] Code compiles without errors

### 3. GitHub Repository
- [ ] Create GitHub repository: `python-dependencies-updater`
- [ ] Push code to repository
- [ ] Ensure repository is public
- [ ] Repository URL matches package.json

### 4. Functionality Testing
- [x] Basic functionality works
- [x] Multi-language support works
- [x] Configuration options work
- [x] Error handling works correctly

## 🚀 Quick Publishing Steps

### Method 1: Use Script (Recommended)
```bash
# Publish to both marketplaces (Universe)
./publish.sh all

# Publish to VS Code Marketplace only
./publish.sh vsx

# Publish to OpenVSX only
./publish.sh ovsx
```

### Method 2: Manual Publishing
```bash
# 1. Install vsce
npm install -g @vscode/vsce

# 2. Login (first time)
vsce login cookabc
# Enter your Personal Access Token

# 3. Compile
npm run compile

# 4. Publish
vsce publish
```

## 📝 Post-Publishing Tasks

### Immediate Checks
- [ ] Confirm extension displays correctly on VS Code Marketplace
- [ ] Test installation and basic functionality
- [ ] Check description, screenshots, links

### Promotion & Optimization
- [ ] Add README badges to GitHub
- [ ] Share on social media
- [ ] Post in tech communities
- [ ] Collect user feedback

### Ongoing Maintenance
- [ ] Monitor download count and ratings
- [ ] Respond to user comments
- [ ] Handle GitHub Issues
- [ ] Regular feature updates

## ⚠️ Common Issues

### Publishing Failures
1. **Token Expired**: Regenerate Personal Access Token
2. **Insufficient Permissions**: Ensure Token has Marketplace permissions
3. **Version Conflict**: Check if version number already exists

### Icon Issues
1. **No Icon**: Temporarily remove icon config from package.json
2. **Icon Not Showing**: Ensure filename and path are correct
3. **Blurry Icon**: Use 128x128 high-quality PNG

### Repository Issues
1. **404 Error**: Ensure GitHub repository is public
2. **Link Error**: Check URLs in package.json

## 📞 Get Help

- **VS Code Publishing Docs**: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **vsce Tool Docs**: https://github.com/microsoft/vscode-vsce
- **Issue Reporting**: GitHub Issues

---

Ready to publish! 🎉