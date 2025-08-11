#!/bin/bash

# LPDH Hospital Website - Node.js Deployment Script
# For GoDaddy VPS/Dedicated Server

set -e  # Exit on any error

echo "🏥 LPDH Hospital Website - Node.js Deployment"
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Configuration
PROJECT_NAME="lpdh-website"
PROJECT_DIR="/var/www/$PROJECT_NAME"
NGINX_AVAILABLE="/etc/nginx/sites-available/$PROJECT_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"
LOG_DIR="/var/log/$PROJECT_NAME"

print_info "Starting deployment process..."

# Step 1: System updates
print_info "Step 1: Updating system packages..."
apt update && apt upgrade -y
print_status "System packages updated"

# Step 2: Install Node.js
print_info "Step 2: Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    print_status "Node.js installed successfully"
else
    NODE_VERSION=$(node --version)
    print_status "Node.js already installed: $NODE_VERSION"
fi

# Step 3: Install additional dependencies
print_info "Step 3: Installing additional dependencies..."
apt install -y git nginx

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    print_status "PM2 installed successfully"
else
    print_status "PM2 already installed"
fi

# Step 4: Create project directory
print_info "Step 4: Setting up project directory..."
mkdir -p $PROJECT_DIR
mkdir -p $LOG_DIR
chown -R www-data:www-data $PROJECT_DIR
chown -R www-data:www-data $LOG_DIR
print_status "Project directories created"

# Step 5: Deploy application files
print_info "Step 5: Deploying application..."
print_warning "Please ensure your code is uploaded to $PROJECT_DIR"
print_info "You can use: git clone, scp, or file upload"

# Check if package.json exists
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    print_warning "package.json not found in $PROJECT_DIR"
    print_info "Please upload your project files first, then run this script again"
    exit 1
fi

# Step 6: Install dependencies and build
print_info "Step 6: Installing dependencies and building..."
cd $PROJECT_DIR
sudo -u www-data npm install
sudo -u www-data npm run build
print_status "Application built successfully"

# Step 7: Configure PM2
print_info "Step 7: Configuring PM2..."
if [ -f "$PROJECT_DIR/ecosystem.config.js" ]; then
    pm2 delete $PROJECT_NAME 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    print_status "PM2 configured and application started"
else
    print_warning "ecosystem.config.js not found, creating basic configuration..."
    cat > $PROJECT_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$PROJECT_DIR',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF
    chown www-data:www-data $PROJECT_DIR/ecosystem.config.js
    pm2 start $PROJECT_DIR/ecosystem.config.js
    pm2 save
    print_status "Basic PM2 configuration created and started"
fi

# Step 8: Configure Nginx
print_info "Step 8: Configuring Nginx..."
if [ -f "$PROJECT_DIR/nginx.conf" ]; then
    cp $PROJECT_DIR/nginx.conf $NGINX_AVAILABLE
else
    print_warning "nginx.conf not found, creating basic configuration..."
    cat > $NGINX_AVAILABLE << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
fi

# Enable the site
ln -sf $NGINX_AVAILABLE $NGINX_ENABLED
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if nginx -t; then
    systemctl restart nginx
    print_status "Nginx configured and restarted"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Step 9: Configure firewall
print_info "Step 9: Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
print_status "Firewall configured"

# Step 10: Set up PM2 startup
print_info "Step 10: Setting up PM2 startup script..."
pm2 startup systemd -u www-data --hp /var/www
print_status "PM2 startup script configured"

# Step 11: SSL Certificate setup
print_info "Step 11: SSL Certificate setup..."
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    print_status "Certbot installed"
fi

print_warning "SSL certificate setup requires your domain to be pointed to this server"
print_info "Run the following command once DNS is configured:"
print_info "sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"

# Step 12: Final verification
print_info "Step 12: Verifying deployment..."

# Check if PM2 is running
if pm2 list | grep -q $PROJECT_NAME; then
    print_status "Application is running with PM2"
else
    print_error "Application is not running"
fi

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
    print_status "Nginx is running"
else
    print_error "Nginx is not running"
fi

# Check if port 3000 is listening
if netstat -tlnp | grep -q ":3000"; then
    print_status "Application is listening on port 3000"
else
    print_warning "Application may not be listening on port 3000"
fi

echo ""
print_status "🎉 Deployment completed successfully!"
echo ""
print_info "📋 Next Steps:"
print_info "1. Point your domain DNS to this server's IP address"
print_info "2. Run SSL certificate setup: sudo certbot --nginx -d yourdomain.com"
print_info "3. Update your .env.production file with correct values"
print_info "4. Test your website functionality"
echo ""
print_info "🔧 Management Commands:"
print_info "- View application status: sudo pm2 status"
print_info "- View logs: sudo pm2 logs $PROJECT_NAME"
print_info "- Restart application: sudo pm2 restart $PROJECT_NAME"
print_info "- Reload Nginx: sudo systemctl reload nginx"
echo ""
print_info "📁 Important Paths:"
print_info "- Application: $PROJECT_DIR"
print_info "- Logs: $LOG_DIR"
print_info "- Nginx config: $NGINX_AVAILABLE"
echo ""

# Display current status
print_info "🔍 Current Status:"
pm2 list
systemctl status nginx --no-pager -l

print_status "Your LPDH Hospital website is now running on Node.js! 🏥"
