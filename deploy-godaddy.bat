@echo off
REM LPDH Website Deployment Script for GoDaddy (Windows)
REM Run this script to prepare your website for deployment

echo 🏥 LPDH Hospital Website - GoDaddy Deployment Preparation
echo =========================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ package.json not found. Are you in the project root?
    pause
    exit /b 1
)

if not exist "next.config.ts" (
    echo ❌ next.config.ts not found. This doesn't appear to be a Next.js project.
    pause
    exit /b 1
)

echo ✅ Project structure validated
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check for environment file
echo 🔧 Checking environment configuration...
if not exist ".env.production" (
    echo ⚠️  .env.production not found
    echo Please create .env.production based on .env.production.example
    echo Make sure to update these values:
    echo   - SANITY_API_TOKEN
    echo   - EMAIL_USER and EMAIL_PASS
    echo   - NEXT_PUBLIC_SITE_URL
    echo.
)

REM Build the project
echo 🏗️  Building the project...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Project built successfully
echo.

REM Create deployment folder
echo 📁 Preparing deployment files...
if not exist "deployment" mkdir deployment

REM Copy built files
if exist "out" (
    xcopy "out\*" "deployment\" /E /I /Y >nul
    echo ✅ Static files copied to deployment folder
) else if exist ".next" (
    echo ⚠️  Standard build detected. For shared hosting, consider static export.
    echo Your built files are in .next folder
) else (
    echo ❌ No build output found
    pause
    exit /b 1
)

REM Copy .htaccess if it exists
if exist ".htaccess.example" (
    copy ".htaccess.example" "deployment\.htaccess" >nul
    echo ✅ .htaccess file prepared
)

REM Create deployment instructions
echo Creating upload instructions...
(
echo 🏥 LPDH Hospital Website - GoDaddy Upload Instructions
echo ====================================================
echo.
echo 1. ACCESS GODADDY cPANEL:
echo    - Log in to your GoDaddy account
echo    - Go to Web Hosting
echo    - Launch cPanel
echo.
echo 2. UPLOAD FILES:
echo    Option A: File Manager
echo    - Open File Manager
echo    - Navigate to public_html folder
echo    - Upload ALL files from this deployment folder
echo    - Extract if uploaded as ZIP
echo.
echo    Option B: FTP Upload
echo    - Use FileZilla or similar FTP client
echo    - Connect with your GoDaddy FTP credentials
echo    - Upload all files to public_html/
echo.
echo 3. SET PERMISSIONS:
echo    - Files: 644 ^(read/write for owner, read for others^)
echo    - Folders: 755 ^(read/write/execute for owner, read/execute for others^)
echo.
echo 4. SSL CERTIFICATE:
echo    - Enable SSL in GoDaddy cPanel
echo    - Force HTTPS redirects ^(included in .htaccess^)
echo.
echo 5. ENVIRONMENT VARIABLES ^(if using Node.js hosting^):
echo    - Set up environment variables in cPanel
echo    - Use the values from your .env.production file
echo.
echo 6. TEST YOUR WEBSITE:
echo    - Visit https://yourdomain.com
echo    - Test contact form functionality
echo    - Verify Sanity CMS integration
echo    - Check all pages load correctly
echo.
echo 🔧 TROUBLESHOOTING:
echo - 404 errors: Ensure index.html is in public_html root
echo - Images not loading: Check file permissions and paths
echo - Contact form issues: Verify email settings and SMTP configuration
echo.
echo 📞 SUPPORT:
echo - GoDaddy Support: 24/7 phone and chat support
echo - For technical issues: Check console logs in browser developer tools
) > "deployment\UPLOAD_INSTRUCTIONS.txt"

echo.
echo 🎉 Deployment preparation complete!
echo.
echo 📋 Next Steps:
echo 1. Review your .env.production file
echo 2. Upload contents of 'deployment' folder to GoDaddy public_html/
echo 3. Follow instructions in deployment/UPLOAD_INSTRUCTIONS.txt
echo 4. Test your website functionality
echo.
echo 📁 Deployment files are ready in: ./deployment/
dir deployment

echo.
echo ✅ Ready for GoDaddy upload!
pause
