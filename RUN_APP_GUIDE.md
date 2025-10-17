# 🚀 How to Run Genie App

**Current Status:** Build dependencies incomplete due to native module issues

---

## ⚠️ Current Situation

The VS Code build process is complex and requires:
1. All npm dependencies (1500+ packages)
2. Native modules compiled (failing on Windows)
3. TypeScript compilation
4. Electron packaging

**Problem:** Native modules won't compile, blocking full build.

---

## ✅ 3 Ways to Run Genie

### Method 1: Use Pre-built VS Code (Recommended - 5 minutes)

This is the **fastest** way to see your Genie branding in action:

#### Step 1: Download VS Code
```cmd
# Download from https://code.visualstudio.com/
# Or use portable version
```

#### Step 2: Locate Installation
```cmd
# Default location:
C:\Users\[YourName]\AppData\Local\Programs\Microsoft VS Code\
```

#### Step 3: Replace Files
```cmd
# Copy your modified files:
copy D:\folder\vscode\product.json "C:\Users\[YourName]\AppData\Local\Programs\Microsoft VS Code\resources\app\product.json"

# Copy themes:
xcopy D:\folder\vscode\extensions\theme-defaults\themes\*.json "C:\Users\[YourName]\AppData\Local\Programs\Microsoft VS Code\resources\app\extensions\theme-defaults\themes\" /Y
```

#### Step 4: Launch
```cmd
code.exe
```

**Result:** You'll see Genie branding and themes!

---

### Method 2: Use VS Code Insiders (Development Version)

#### Step 1: Download VS Code Insiders
```cmd
# Download from https://code.visualstudio.com/insiders/
```

#### Step 2: Replace Configuration
Same as Method 1, but in Insiders directory

#### Step 3: Test
Launch and verify Genie branding

---

### Method 3: Fix Build Issues (Advanced - 2-4 hours)

#### Step 1: Clean Install
```cmd
cd vscode
rmdir /s /q node_modules
del package-lock.json
```

#### Step 2: Install Python 3.11 (if not already)
```cmd
# Download from https://www.python.org/downloads/
# Make sure to add to PATH
```

#### Step 3: Install Windows Build Tools
```cmd
npm install --global windows-build-tools
```

#### Step 4: Install Dependencies
```cmd
npm install
```

#### Step 5: Compile
```cmd
npm run compile
```

#### Step 6: Run
```cmd
.\scripts\code.bat
```

---

## 🎯 Quick Test (Method 1 Detailed)

### Windows Quick Commands:

```cmd
@echo off
echo Copying Genie files to VS Code...

REM Set paths
set VSCODE_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code
set GENIE_PATH=D:\folder\vscode

REM Backup original files
echo Creating backup...
copy "%VSCODE_PATH%\resources\app\product.json" "%VSCODE_PATH%\resources\app\product.json.backup"

REM Copy Genie files
echo Copying product.json...
copy "%GENIE_PATH%\product.json" "%VSCODE_PATH%\resources\app\product.json"

echo Copying themes...
xcopy "%GENIE_PATH%\extensions\theme-defaults\themes\*.json" "%VSCODE_PATH%\resources\app\extensions\theme-defaults\themes\" /Y

echo Done! Launch VS Code to see Genie branding.
pause
```

Save this as `apply-genie-branding.bat` and run it.

---

## 🧪 What to Test

After applying Genie branding:

### 1. Title Bar
- [ ] Shows "Genie" instead of "Visual Studio Code"

### 2. Themes
- [ ] "Genie Dark" available in theme picker
- [ ] "Genie Light" available
- [ ] "Genie Dark+" available
- [ ] "Genie Light+" available

### 3. Colors
- [ ] Activity bar badge is purple (#7B2CBF)
- [ ] Remote status is orange (#FF6B35)
- [ ] Selection highlight is purple

### 4. About Dialog
- [ ] Shows Genie information (if product.json applied)

---

## 📝 Verification Script

Create `test-genie.bat`:

```cmd
@echo off
echo Testing Genie Installation...
echo.

REM Check if VS Code is installed
if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\Code.exe" (
    echo [OK] VS Code found
) else (
    echo [ERROR] VS Code not found
    exit /b 1
)

REM Check if product.json was modified
findstr /C:"Genie" "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\resources\app\product.json" >nul
if %errorlevel%==0 (
    echo [OK] Genie branding applied
) else (
    echo [WARNING] Genie branding not found
)

REM Check themes
if exist "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\resources\app\extensions\theme-defaults\themes\dark_vs.json" (
    findstr /C:"Genie Dark" "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\resources\app\extensions\theme-defaults\themes\dark_vs.json" >nul
    if %errorlevel%==0 (
        echo [OK] Genie themes found
    ) else (
        echo [WARNING] Genie themes not applied
    )
)

echo.
echo Test complete!
pause
```

---

## 🔧 Troubleshooting

### Issue: "Access Denied" when copying files
**Solution:** Run Command Prompt as Administrator

### Issue: VS Code won't start after changes
**Solution:** Restore backup:
```cmd
copy "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\resources\app\product.json.backup" "C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\resources\app\product.json"
```

### Issue: Themes don't appear
**Solution:** 
1. Restart VS Code
2. Press Ctrl+K Ctrl+T to open theme picker
3. Look for "Genie" themes

### Issue: Title still shows "Visual Studio Code"
**Solution:** product.json might not be applied correctly. Check file permissions.

---

## 💡 Best Approach

**For immediate testing:** Use Method 1 (5 minutes)
- Download VS Code
- Copy your files
- Test branding

**For development:** Fix build issues later
- Focus on icon design first
- Get build working when needed
- Use Method 1 for quick iterations

---

## 🎨 What You'll See

After applying Genie branding:

```
Title Bar: "Genie - [filename]"
Themes: Genie Dark, Genie Light, Genie Dark+, Genie Light+
Colors: Purple activity bar, orange accents
Config: .genie folder (if fresh install)
```

---

## 📊 Success Metrics

| Item | Expected | How to Verify |
|------|----------|---------------|
| Title | "Genie" | Check title bar |
| Themes | 4 Genie themes | Ctrl+K Ctrl+T |
| Colors | Purple/Orange | Check activity bar |
| Config | .genie folder | Check user folder |

---

## 🚀 Next Steps

1. **Try Method 1** - Fastest way to see results
2. **Take screenshots** - Document your branding
3. **Design icons** - Create Genie lamp logo
4. **Fix build** - Work on native modules later

---

**Recommendation:** Start with Method 1 to see your work in action immediately! 🧞
