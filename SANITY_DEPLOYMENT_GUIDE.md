# Sanity CMS Deployment Guide

## Option 1: Deploy Sanity Studio to Sanity's Hosting (Recommended)

### Step 1: Install Sanity CLI
```bash
npm install -g @sanity/cli
```

### Step 2: Login to Sanity
```bash
sanity login
```

### Step 3: Deploy Studio
```bash
# Build the studio
npm run build

# Deploy to Sanity hosting
sanity deploy
```

### Step 4: Access Your Studio
- Your studio will be available at: `https://your-project-name.sanity.studio`
- Share this URL with content managers

## Option 2: Self-Host Sanity Studio on GoDaddy

### Step 1: Build Studio for Production
```bash
# Build the studio
npm run build
```

### Step 2: Upload Studio Files
1. Create a folder called `admin` in your GoDaddy `public_html/`
2. Upload contents of `dist/` folder to `public_html/admin/`

### Step 3: Access Your Self-Hosted Studio
- Your studio will be available at: `https://yourdomain.com/admin`

## Production Environment Setup

### 1. Create Production Dataset
```bash
# Create production dataset in Sanity
sanity dataset create production
```

### 2. Configure CORS for Your Domain
```bash
# Add your domain to CORS origins
sanity cors add https://yourdomain.com
sanity cors add https://www.yourdomain.com
```

### 3. Generate Production API Token
1. Go to https://sanity.io/manage
2. Select your project
3. Go to API tab
4. Create a new token with Editor permissions
5. Copy the token for your `.env.production` file

## Update Your Website Environment

Update your `.env.production`:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=th6aca7s
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-production-token-here
```

## Data Migration

### Export Development Data
```bash
sanity dataset export development development-backup.tar.gz
```

### Import to Production
```bash
sanity dataset import development-backup.tar.gz production
```

## Security Considerations

### 1. API Token Security
- Never expose API tokens in client-side code
- Use environment variables
- Regularly rotate tokens

### 2. CORS Configuration
- Only add necessary domains
- Avoid using wildcards in production

### 3. Dataset Permissions
- Use appropriate user roles
- Limit access to production dataset

## Backup Strategy

### Automated Backups
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
sanity dataset export production "backup_production_$DATE.tar.gz"
```

### Schedule Regular Backups
- Set up cron job for daily backups
- Store backups in secure location
- Test backup restoration regularly

## Monitoring

### 1. Usage Monitoring
- Monitor API usage in Sanity dashboard
- Set up usage alerts
- Track content updates

### 2. Performance Monitoring
- Monitor studio loading times
- Check API response times
- Monitor bandwidth usage

## Content Management Workflow

### 1. User Access
- Create user accounts for content managers
- Assign appropriate roles
- Provide studio URL and login instructions

### 2. Content Updates
- Changes in Sanity are immediately available via API
- Your Next.js website will fetch latest content
- No need to redeploy website for content changes

### 3. Schema Changes
- Schema changes require website redeployment
- Test schema changes in development first
- Coordinate with development team

## Troubleshooting

### Common Issues:

1. **Studio Won't Load**
   - Check CORS settings
   - Verify project ID and dataset name
   - Check browser console for errors

2. **API Errors**
   - Verify API token permissions
   - Check rate limits
   - Validate dataset existence

3. **Content Not Updating**
   - Check API token permissions
   - Verify dataset name in website config
   - Check network connectivity

### Support Resources:
- Sanity Documentation: https://sanity.io/docs
- Sanity Community: https://slack.sanity.io/
- Sanity Support: support@sanity.io
