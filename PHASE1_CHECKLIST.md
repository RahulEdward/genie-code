# Phase 1: Fork and Rebrand Checklist

## Repository Setup
- [ ] Fork VS Code repository from https://github.com/microsoft/vscode
- [ ] Create new repository named "Genie-Editor"
- [ ] Set up proper git remotes (upstream to VS Code, origin to Genie)
- [ ] Create development branch

## Branding Files to Modify

### Package Configuration
- [ ] `package.json` - Update name, displayName, description
- [ ] `product.json` - Update product name, identifier, and branding
- [ ] `build/package.json` - Update build configuration

### Visual Assets
- [ ] Replace logo files in `resources/` directory
  - [ ] `resources/win32/code.ico` (Windows icon)
  - [ ] `resources/linux/code.png` (Linux icon)
  - [ ] `resources/darwin/code.icns` (macOS icon)
- [ ] Update splash screen images
- [ ] Replace application icons (16x16, 32x32, 48x48, 128x128, 256x256)
- [ ] Update marketplace/store assets

### UI Text and Strings
- [ ] `src/vs/workbench/browser/parts/titlebar/titlebarPart.ts` - Application title
- [ ] `src/vs/workbench/contrib/welcome/` - Welcome page content
- [ ] `src/vs/workbench/browser/parts/dialogs/dialogHandler.ts` - Dialog titles
- [ ] `src/vs/code/electron-main/app.ts` - Application name references
- [ ] Language files in `i18n/` directory

### Documentation
- [ ] Update main README.md
- [ ] Modify LICENSE file (add attribution)
- [ ] Update CONTRIBUTING.md
- [ ] Create CODE_OF_CONDUCT.md
- [ ] Update SECURITY.md

### Configuration Files
- [ ] `.vscode/settings.json` - Workspace settings
- [ ] `build/lib/branding.js` - Build-time branding
- [ ] `build/azure-pipelines/` - CI/CD pipeline names
- [ ] `extensions/theme-defaults/` - Default theme colors

### Application Identifiers
- [ ] Application ID in product.json
- [ ] Bundle identifier (macOS)
- [ ] AppUserModelID (Windows)
- [ ] Desktop file (Linux)

## Color Scheme Changes
- [ ] Define Genie color palette
- [ ] Update default theme colors
- [ ] Modify accent colors in UI
- [ ] Update syntax highlighting defaults

## Legal Compliance
- [ ] Review VS Code MIT license
- [ ] Add Microsoft attribution to LICENSE
- [ ] Create NOTICE file with third-party attributions
- [ ] Draft Genie terms of service
- [ ] Update privacy policy

## Testing
- [ ] Build application successfully
- [ ] Verify all branding appears correctly
- [ ] Test on Windows, macOS, and Linux
- [ ] Check for remaining VS Code references
- [ ] Validate icon rendering at all sizes

## Documentation
- [ ] Document build process
- [ ] Create branding guidelines
- [ ] Write contribution guide
- [ ] Document differences from VS Code
