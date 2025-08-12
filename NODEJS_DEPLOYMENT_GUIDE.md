# 🏥 LPDH Hospital Website - Node.js Hosting Deployment (GoDaddy VPS)

## Prerequisites for Node.js Hosting

### GoDaddy Requirements:
- ✅ GoDaddy VPS or Dedicated Server (NOT shared hosting)
- ✅ SSH access to your server
- ✅ Root or sudo privileges
- ✅ Node.js 18+ support
- ✅ Domain pointed to your server IP

### Server Specifications (Minimum):
- **RAM:** 2GB (4GB recommended)
- **Storage:** 20GB SSD
- **Bandwidth:** Unlimited
- **OS:** Ubuntu 20.04+ or CentOS 8+

---

## 🚀 Deployment Steps

### Step 1: Server Setup

#### Connect to Your GoDaddy VPS:
```bash
# Replace with your server IP
ssh root@your-server-ip
```

#### Update System:
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Node.js 18+:
```bash
# Install NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Install Additional Dependencies:
```bash
# Install Git
sudo apt install git -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y
```

### Step 2: Deploy Your Application

#### Clone Your Repository:
```bash
# Navigate to web directory
cd /var/www

# Clone your repository
sudo git clone https://github.com/Leocch1/lpdh-website.git
sudo chown -R www-data:www-data lpdh-website
cd lpdh-website
```

#### Install Dependencies:
```bash
sudo npm install
```

#### Create Production Environment:
```bash
sudo nano .env.production
```

Add your production environment variables:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=th6aca7s
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skIat8RHAvJkCWUSgcSSlZMs8hptZgpZmFKrO2HeQXQdyF52EgR6exTDgzNJPa9nyi8rH0rDiZReIN3oetsxpLpvzPvfG3PHcsCt0gSzTD3Q6Vu0SvokTWyoAQNpSSzaRsyyREAyWoNQEKqnbokuiAVaehTEL9IpvdyE6Xcfy1PtBYKk3l7o

# Hospital email configuration
EMAIL_USER=your-email@your-domain.com
EMAIL_PASS=your-email-app-password
GMAIL_ACCOUNT=your-gmail@gmail.com

# Azure OAuth2 (for Microsoft 365)
AZURE_CLIENT_ID=your-azure-client-id-here
AZURE_CLIENT_SECRET=your-azure-client-secret-here
AZURE_TENANT_ID=your-azure-tenant-id-here

# Site URL (replace with your domain)
NEXT_PUBLIC_SITE_URL=https://lpdhinc.com

# Node.js environment
NODE_ENV=production
PORT=3000
```

#### Build the Application:
```bash
sudo npm run build
```

### Step 3: Configure PM2 Process Manager

#### Create PM2 Configuration:
```bash
sudo nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'lpdh-website',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/lpdh-website',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/lpdh-website/err.log',
    out_file: '/var/log/lpdh-website/out.log',
    log_file: '/var/log/lpdh-website/combined.log',
    time: true
  }]
}
```

#### Create Log Directory:
```bash
sudo mkdir -p /var/log/lpdh-website
sudo chown -R www-data:www-data /var/log/lpdh-website
```

#### Start Application with PM2:
```bash
# Start the application
sudo pm2 start ecosystem.config.js

# Save PM2 configuration
sudo pm2 save

# Set up PM2 to start on system boot
sudo pm2 startup systemd
```

### Step 4: Configure Nginx Reverse Proxy

#### Create Nginx Configuration:
```bash
sudo nano /etc/nginx/sites-available/lpdh-website
```

```nginx
server {
    listen 80;
    server_name lpdhinc.com www.lpdhinc.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lpdhinc.com www.lpdhinc.com;

    # SSL Configuration (will be set up with Certbot)
    ssl_certificate /etc/letsencrypt/live/lpdhinc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lpdhinc.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Image optimization
    location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Enable the Site:
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/lpdh-website /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: SSL Certificate with Let's Encrypt

#### Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### Generate SSL Certificate:
```bash
# Replace with your actual domain
sudo certbot --nginx -d lpdhinc.com -d www.lpdhinc.com
```

#### Set up Auto-renewal:
```bash
# Test renewal
sudo certbot renew --dry-run

# The renewal cron job is automatically created
```

### Step 6: Firewall Configuration

#### Configure UFW Firewall:
```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

---

## 🔧 Management Commands

### Application Management:
```bash
# View application status
sudo pm2 status

# View logs
sudo pm2 logs lpdh-website

# Restart application
sudo pm2 restart lpdh-website

# Stop application
sudo pm2 stop lpdh-website

# Monitor resources
sudo pm2 monit
```

### Deployment Updates:
```bash
# Navigate to project directory
cd /var/www/lpdh-website

# Pull latest changes
sudo git pull origin master

# Install new dependencies (if any)
sudo npm install

# Rebuild application
sudo npm run build

# Restart with PM2
sudo pm2 restart lpdh-website
```

### Nginx Management:
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

---

## 📊 Monitoring and Maintenance

### Server Monitoring:
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check Node.js processes
ps aux | grep node
```

### Application Logs:
```bash
# PM2 logs
sudo pm2 logs lpdh-website --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Database Backup (if using):
```bash
# Example for PostgreSQL
pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## 🔒 Security Best Practices

### System Security:
```bash
# Update system regularly
sudo apt update && sudo apt upgrade -y

# Configure fail2ban
sudo apt install fail2ban -y

# Regular security audits
sudo npm audit
```

### Application Security:
- Keep dependencies updated
- Use environment variables for secrets
- Enable security headers (configured in Nginx)
- Regular SSL certificate renewal
- Monitor access logs

---

## 🚀 Performance Optimization

### Node.js Optimization:
- Use PM2 clustering for multiple cores
- Enable gzip compression (configured)
- Implement caching strategies
- Optimize database queries

### Server Optimization:
- Enable HTTP/2 (configured)
- Use CDN for static assets
- Implement rate limiting
- Monitor and optimize memory usage

---

## 📞 Support and Troubleshooting

### Common Issues:

1. **Application Won't Start:**
   ```bash
   sudo pm2 logs lpdh-website
   # Check for Node.js errors
   ```

2. **502 Bad Gateway:**
   ```bash
   # Check if Node.js is running
   sudo pm2 status
   
   # Check Nginx configuration
   sudo nginx -t
   ```

3. **SSL Issues:**
   ```bash
   # Renew certificate manually
   sudo certbot renew
   ```

### Emergency Recovery:
```bash
# Quick restart everything
sudo systemctl restart nginx
sudo pm2 restart all
```

---

## ✅ Final Verification

After deployment, verify:
- [ ] Website loads at https://yourdomain.com
- [ ] Contact form sends emails
- [ ] Lab appointment system works
- [ ] Sanity CMS integration functional
- [ ] All pages load without errors
- [ ] Mobile responsiveness verified
- [ ] SSL certificate valid
- [ ] Performance acceptable (< 3 seconds load time)

**Your LPDH Hospital website is now running on Node.js with full server-side capabilities!** 🎉
