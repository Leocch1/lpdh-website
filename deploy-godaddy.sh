#!/bin/bash

# LPDH Website Deployment Script for GoDaddy
# Run this script to prepare your website for deployment

echo "🏥 LPDH Hospital Website - GoDaddy Deployment Preparation"
echo "========================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required files exist
echo -e "\n📋 Checking project structure..."

if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

if [ ! -f "next.config.ts" ]; then
    print_error "next.config.ts not found. This doesn't appear to be a Next.js project."
    exit 1
fi

print_status "Project structure validated"

# Install dependencies
echo -e "\n📦 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check for environment file
echo -e "\n🔧 Checking environment configuration..."
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found"
    echo -e "Please create .env.production based on .env.production.example"
    echo -e "Make sure to update these values:"
    echo -e "  - SANITY_API_TOKEN"
    echo -e "  - EMAIL_USER and EMAIL_PASS"
    echo -e "  - NEXT_PUBLIC_SITE_URL"
fi

# Build the project
echo -e "\n🏗️  Building the project..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Project built successfully"
else
    print_error "Build failed. Please check the errors above."
    exit 1
fi

# Create static export for GoDaddy shared hosting
echo -e "\n📤 Creating static export..."

# Check if we need to modify next.config.ts for static export
if ! grep -q "output.*export" next.config.ts; then
    print_warning "Your next.config.ts may need modification for static export"
    echo -e "For GoDaddy shared hosting, you may need to add:"
    echo -e "  output: 'export',"
    echo -e "  trailingSlash: true,"
    echo -e "  images: { unoptimized: true }"
fi

# Create deployment folder
echo -e "\n📁 Preparing deployment files..."
mkdir -p deployment

# Copy built files
if [ -d "out" ]; then
    cp -r out/* deployment/
    print_status "Static files copied to deployment folder"
elif [ -d ".next" ]; then
    print_warning "Standard build detected. For shared hosting, consider static export."
    echo -e "Your built files are in .next folder"
else
    print_error "No build output found"
    exit 1
fi

# Copy .htaccess if it exists
if [ -f ".htaccess.example" ]; then
    cp .htaccess.example deployment/.htaccess
    print_status ".htaccess file prepared"
fi

# Create deployment instructions
cat > deployment/UPLOAD_INSTRUCTIONS.txt << EOF
🏥 LPDH Hospital Website - GoDaddy Upload Instructions
====================================================

1. ACCESS GODADDY cPANEL:
   - Log in to your GoDaddy account
   - Go to Web Hosting
   - Launch cPanel

2. UPLOAD FILES:
   Option A: File Manager
   - Open File Manager
   - Navigate to public_html folder
   - Upload ALL files from this deployment folder
   - Extract if uploaded as ZIP

   Option B: FTP Upload
   - Use FileZilla or similar FTP client
   - Connect with your GoDaddy FTP credentials
   - Upload all files to public_html/

3. SET PERMISSIONS:
   - Files: 644 (read/write for owner, read for others)
   - Folders: 755 (read/write/execute for owner, read/execute for others)

4. SSL CERTIFICATE:
   - Enable SSL in GoDaddy cPanel
   - Force HTTPS redirects (included in .htaccess)

5. ENVIRONMENT VARIABLES (if using Node.js hosting):
   - Set up environment variables in cPanel
   - Use the values from your .env.production file

6. TEST YOUR WEBSITE:
   - Visit https://yourdomain.com
   - Test contact form functionality
   - Verify Sanity CMS integration
   - Check all pages load correctly

🔧 TROUBLESHOOTING:
- 404 errors: Ensure index.html is in public_html root
- Images not loading: Check file permissions and paths
- Contact form issues: Verify email settings and SMTP configuration

📞 SUPPORT:
- GoDaddy Support: 24/7 phone and chat support
- For technical issues: Check console logs in browser developer tools
EOF

echo -e "\n🎉 Deployment preparation complete!"
echo -e "\n📋 Next Steps:"
echo -e "1. Review your .env.production file"
echo -e "2. Upload contents of 'deployment' folder to GoDaddy public_html/"
echo -e "3. Follow instructions in deployment/UPLOAD_INSTRUCTIONS.txt"
echo -e "4. Test your website functionality"

echo -e "\n📁 Deployment files are ready in: ./deployment/"
ls -la deployment/

print_status "Ready for GoDaddy upload!"
