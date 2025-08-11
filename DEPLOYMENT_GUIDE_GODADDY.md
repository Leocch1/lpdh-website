# LPDH Website Deployment Guide - GoDaddy

## 🚀 Deployment Checklist

### Pre-Deployment Requirements:
- [ ] GoDaddy hosting account
- [ ] Domain name configured
- [ ] Sanity project setup
- [ ] Environment variables configured
- [ ] Database/email configurations tested
- [ ] SSL certificate (Let's Encrypt or GoDaddy SSL)

## Method 1: Static Export + GoDaddy Shared Hosting

### Step 1: Prepare Next.js for Static Export

1. Update `next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

2. Add export script to `package.json`:
```json
{
  "scripts": {
    "export": "next build && next export"
  }
}
```

3. Create `.env.production`:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=th6aca7s
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-production-token
EMAIL_USER=your-hospital-email@lpdhinc.com
EMAIL_PASS=your-app-password
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Step 2: Build and Export

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Export static files
npm run export
```

### Step 3: Upload to GoDaddy

1. Access GoDaddy File Manager or use FTP
2. Upload contents of `out/` folder to `public_html/`
3. Ensure index.html is in the root

## Method 2: Node.js Hosting (VPS/Dedicated Server)

### Step 1: Server Requirements

- Node.js 18+ support
- PM2 or similar process manager
- SSL certificate
- Domain pointing to server IP

### Step 2: Production Configuration

1. Update `package.json`:
```json
{
  "scripts": {
    "start": "next start -p 3000",
    "build": "next build"
  }
}
```

2. Create production environment file
3. Set up reverse proxy (Nginx)

### Step 3: Deploy with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "lpdh-website" -- start

# Set up auto-restart
pm2 startup
pm2 save
```

## Sanity Studio Deployment

### Option A: Deploy to Sanity's hosting
```bash
# Build and deploy studio
npm run build:sanity
sanity deploy
```

### Option B: Self-host Sanity Studio
1. Build studio: `npm run build:sanity`
2. Upload `dist/` contents to `/admin/` folder on your server
3. Access at: `https://yourdomain.com/admin`

## Environment Variables for Production

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=th6aca7s
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-production-token

# Email Configuration
EMAIL_USER=lpdhmail@lpdhinc.com
EMAIL_PASS=your-secure-app-password

# Site Configuration  
NEXT_PUBLIC_SITE_URL=https://lpdhinc.com

# Azure OAuth (if using)
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
```

## GoDaddy-Specific Configurations

### 1. cPanel File Manager Upload
- Compress your `out/` folder to ZIP
- Upload via cPanel File Manager
- Extract in `public_html/`

### 2. FTP Upload
- Use FileZilla or similar FTP client
- Connect with GoDaddy FTP credentials
- Upload all files from `out/` to `public_html/`

### 3. Database Configuration (if needed)
- Use GoDaddy's MySQL if storing data
- Update connection strings in your code

## SSL Certificate Setup

### Option A: GoDaddy SSL Certificate
1. Purchase SSL from GoDaddy
2. Install through cPanel
3. Force HTTPS redirects

### Option B: Let's Encrypt (VPS only)
```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot --nginx -d yourdomain.com
```

## Domain Configuration

1. **Point Domain to Server:**
   - A Record: @ → Your server IP
   - CNAME: www → yourdomain.com

2. **Update DNS:**
   - Wait 24-48 hours for propagation
   - Test with `nslookup yourdomain.com`

## Performance Optimization

### 1. Enable Compression
Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### 2. Browser Caching
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
</IfModule>
```

## Backup Strategy

### 1. Automated Backups
- Use GoDaddy's backup service
- Set up daily automated backups

### 2. Sanity Data Backup
```bash
# Export Sanity data
sanity dataset export production backup.tar.gz
```

## Monitoring and Maintenance

### 1. Uptime Monitoring
- Use services like UptimeRobot
- Set up email alerts

### 2. Performance Monitoring
- Google PageSpeed Insights
- GTmetrix for performance analysis

### 3. Security Updates
- Regularly update dependencies
- Monitor for security vulnerabilities

## Troubleshooting Common Issues

### 1. 404 Errors
- Ensure index.html is in root
- Check file permissions (644 for files, 755 for folders)

### 2. API Errors
- Verify environment variables
- Check CORS settings
- Ensure API endpoints are accessible

### 3. Email Issues
- Test SMTP settings
- Check firewall/port blocking
- Verify app password generation

## Production Deployment Checklist

- [ ] Code tested in staging environment
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Backup system in place
- [ ] Monitoring tools configured
- [ ] Error logging enabled
- [ ] Performance optimization applied
- [ ] Security headers configured
- [ ] Email functionality tested

## Support Contacts

- **GoDaddy Support:** Available 24/7
- **Sanity Support:** support@sanity.io
- **Next.js Documentation:** https://nextjs.org/docs
