@echo off
setlocal enabledelayedexpansion

echo 🚀 VS Code Extension Publishing Script
echo ======================================

REM Check if vsce is installed
where vsce >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing vsce (VS Code Extension Manager)...
    npm install -g @vscode/vsce
)

REM Compile project
echo 🔨 Compiling TypeScript...
npm run compile

REM Check for icon file
if exist "icon.png" (
    echo ✅ Icon file found: icon.png
) else (
    echo ⚠️  Warning: No icon.png found. The extension will use default icon.
    echo    Create a 128x128 PNG icon for better presentation.
)

echo 📋 Current package info:
for /f "tokens=*" %%i in ('node -p "require('./package.json').name"') do set name=%%i
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set version=%%i
for /f "tokens=*" %%i in ('node -p "require('./package.json').publisher"') do set publisher=%%i

echo   Name: !name!
echo   Version: !version!
echo   Publisher: !publisher!

echo.
echo 🎯 Choose publishing option:
echo 1) Package only (.vsix file)
echo 2) Publish to marketplace
echo 3) Publish patch version (x.x.X)
echo 4) Publish minor version (x.X.x)
echo 5) Publish major version (X.x.x)

set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    echo 📦 Creating package...
    vsce package
    echo ✅ Package created successfully!
) else if "%choice%"=="2" (
    echo 🚀 Publishing to marketplace...
    vsce publish
    echo ✅ Published successfully!
) else if "%choice%"=="3" (
    echo 🚀 Publishing patch version...
    vsce publish patch
    echo ✅ Patch version published successfully!
) else if "%choice%"=="4" (
    echo 🚀 Publishing minor version...
    vsce publish minor
    echo ✅ Minor version published successfully!
) else if "%choice%"=="5" (
    echo 🚀 Publishing major version...
    vsce publish major
    echo ✅ Major version published successfully!
) else (
    echo ❌ Invalid choice. Exiting.
    exit /b 1
)

echo.
echo 🎉 Done! Check your extension at:
echo    https://marketplace.visualstudio.com/items?itemName=cookabc.python-requirements-updater

pause