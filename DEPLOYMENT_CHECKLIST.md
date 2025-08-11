# 🏥 LPDH Hospital Website - Complete Deployment Checklist

## Pre-Deployment Preparation

### ✅ Domain and Hosting Setup
- [ ] GoDaddy hosting account active
- [ ] Domain name configured and pointed to hosting
- [ ] SSL certificate ordered/configured
- [ ] Email accounts created (lpdhmail@lpdhinc.com)

### ✅ Environment Configuration
- [ ] `.env.production` created with correct values
- [ ] Sanity production dataset created
- [ ] Production API token generated
- [ ] Email SMTP settings tested
- [ ] CORS configured for production domain

### ✅ Code Preparation
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Contact form working with email notifications
- [ ] Lab appointment system functional
- [ ] All images loading correctly
- [ ] Mobile responsiveness verified

## Deployment Options

### 🎯 **Recommended for Beginners: Static Export**

#### Step 1: Prepare for Static Export
1. **Update `next.config.ts`:**
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
```

2. **Update `package.json` scripts:**
```json
{
  "scripts": {
    "export": "next build",
    "deploy": "next build && next export"
  }
}
```

#### Step 2: Build and Export
```bash
# Run the deployment script
./deploy-godaddy.bat

# Or manually:
npm install
npm run build
```

#### Step 3: Upload to GoDaddy
1. **Via cPanel File Manager:**
   - Login to GoDaddy cPanel
   - Open File Manager
   - Navigate to `public_html`
   - Upload all files from `out` folder
   - Extract if uploaded as ZIP

2. **Via FTP:**
   - Use FileZilla or similar
   - Connect with GoDaddy FTP credentials
   - Upload all files to `public_html`

### 🚀 **For Advanced Users: Node.js Hosting (VPS)**

#### Requirements:
- GoDaddy VPS or Dedicated Server
- Node.js 18+ support
- SSH access

#### Deployment Steps:
```bash
# On your server
git clone your-repository
cd lpdh-website
npm install
npm run build
npm start
```

## Sanity CMS Deployment

### Option A: Sanity Hosting (Recommended)
```bash
# Install Sanity CLI
npm install -g @sanity/cli

# Login and deploy
sanity login
sanity deploy
```
- Studio URL: `https://your-project.sanity.studio`

### Option B: Self-Host on GoDaddy
1. Build studio: `npm run build`
2. Upload `dist` contents to `public_html/admin/`
3. Access at: `https://yourdomain.com/admin`

## Configuration Files

### 1. Environment Variables (.env.production)
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=th6aca7s
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skXXXXXXXXXXXXXXXXXXXX
EMAIL_USER=lpdhmail@lpdhinc.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_SITE_URL=https://lpdhinc.com
```

### 2. .htaccess (for shared hosting)
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Enable Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
```

## Post-Deployment Testing

### ✅ Website Functionality
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] About page with history section loads
- [ ] Services page displays correctly
- [ ] Find Doctor page functional
- [ ] Lab scheduling with eligibility check works
- [ ] Contact form submits successfully
- [ ] Contact directories page loads
- [ ] Careers page displays job openings

### ✅ Technical Verification
- [ ] SSL certificate active (https://)
- [ ] Mobile responsiveness verified
- [ ] Page load speeds acceptable (<3 seconds)
- [ ] All images loading from Sanity CDN
- [ ] No JavaScript console errors
- [ ] SEO meta tags present

### ✅ Content Management
- [ ] Sanity Studio accessible
- [ ] Content editors can login
- [ ] Content changes reflect on website
- [ ] Image uploads working
- [ ] All schema fields functional

### ✅ Email System
- [ ] Contact form emails received
- [ ] Appointment notifications working
- [ ] Email formatting correct
- [ ] No spam folder issues

## Performance Optimization

### 1. Image Optimization
- [ ] Images compressed and optimized
- [ ] WebP format where possible
- [ ] Proper alt tags for accessibility

### 2. Caching Configuration
- [ ] Browser caching enabled
- [ ] CDN configured (if using)
- [ ] Static assets cached properly

### 3. SEO Optimization
- [ ] Meta descriptions on all pages
- [ ] Proper heading structure (H1, H2, H3)
- [ ] Schema markup for medical practice
- [ ] Google Analytics configured
- [ ] Google Search Console setup

## Security Checklist

### ✅ Basic Security
- [ ] SSL certificate installed and forced
- [ ] Strong passwords for all accounts
- [ ] Regular backups scheduled
- [ ] Security headers configured
- [ ] Environment variables secured

### ✅ Data Protection
- [ ] Patient data handling compliant
- [ ] Contact form data secured
- [ ] Email communications encrypted
- [ ] Access logs monitored

## Maintenance Plan

### Daily Tasks
- [ ] Check website functionality
- [ ] Monitor email notifications
- [ ] Review contact form submissions

### Weekly Tasks
- [ ] Review website analytics
- [ ] Check for broken links
- [ ] Monitor site performance
- [ ] Review and respond to patient inquiries

### Monthly Tasks
- [ ] Update content in Sanity CMS
- [ ] Review and update doctor profiles
- [ ] Update service offerings
- [ ] Check for security updates
- [ ] Backup website and database

### Quarterly Tasks
- [ ] Review hosting performance
- [ ] Update dependencies
- [ ] Performance audit
- [ ] Security assessment
- [ ] User feedback review

## Support and Documentation

### Quick Reference
- **Website:** https://lpdhinc.com
- **Admin Panel:** https://lpdhinc.com/admin (or Sanity hosted)
- **GoDaddy Support:** 24/7 phone and chat
- **Sanity Support:** support@sanity.io

### Emergency Contacts
- **Hosting Issues:** GoDaddy Support
- **Technical Issues:** Development team
- **Content Issues:** Sanity Studio access

### Documentation
- `DEPLOYMENT_GUIDE_GODADDY.md` - Detailed deployment instructions
- `SANITY_DEPLOYMENT_GUIDE.md` - CMS-specific deployment
- This checklist - Complete deployment verification

---

## 🎉 Deployment Complete!

Once all items are checked off, your LPDH Hospital website should be fully functional and ready to serve patients with:

- ✅ Professional medical website
- ✅ Online appointment scheduling
- ✅ Contact management system
- ✅ Content management via Sanity CMS
- ✅ Email notification system
- ✅ Mobile-responsive design
- ✅ Security and performance optimizations

**Welcome to your new digital presence for Las Piñas Doctors Hospital!** 🏥
