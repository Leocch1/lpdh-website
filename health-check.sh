#!/bin/bash

# LPDH Website Health Check Script
# Run this to verify your deployment is working correctly

echo "🏥 LPDH Hospital Website - Health Check"
echo "======================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_service() {
    local service=$1
    local description=$2
    
    if systemctl is-active --quiet $service; then
        echo -e "${GREEN}✅ $description is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $description is not running${NC}"
        return 1
    fi
}

check_port() {
    local port=$1
    local description=$2
    
    if netstat -tlnp | grep -q ":$port"; then
        echo -e "${GREEN}✅ $description (port $port) is listening${NC}"
        return 0
    else
        echo -e "${RED}❌ $description (port $port) is not listening${NC}"
        return 1
    fi
}

check_url() {
    local url=$1
    local description=$2
    
    if curl -s -o /dev/null -w "%{http_code}" $url | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ $description is accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ $description is not accessible${NC}"
        return 1
    fi
}

echo "🔍 System Services Check:"
check_service nginx "Nginx Web Server"
check_service ufw "UFW Firewall"

echo ""
echo "🔍 Application Check:"
if pm2 list | grep -q "lpdh-website"; then
    echo -e "${GREEN}✅ LPDH Website PM2 process is running${NC}"
else
    echo -e "${RED}❌ LPDH Website PM2 process is not running${NC}"
fi

echo ""
echo "🔍 Port Check:"
check_port 80 "HTTP"
check_port 443 "HTTPS"
check_port 3000 "Next.js Application"

echo ""
echo "🔍 URL Accessibility Check:"
check_url "http://localhost:3000" "Local Next.js Application"
check_url "http://localhost" "Local Nginx Proxy"

# Check SSL certificate if domain is configured
if [ ! -z "$1" ]; then
    DOMAIN=$1
    echo ""
    echo "🔍 Domain Check for: $DOMAIN"
    check_url "https://$DOMAIN" "Production Website"
    
    # Check SSL certificate expiry
    if command -v openssl &> /dev/null; then
        SSL_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
        if [ ! -z "$SSL_EXPIRY" ]; then
            echo -e "${GREEN}✅ SSL Certificate expires: $SSL_EXPIRY${NC}"
        fi
    fi
fi

echo ""
echo "🔍 Resource Usage:"
echo "Memory Usage:"
free -h | grep -E "Mem|Swap"
echo ""
echo "Disk Usage:"
df -h / | tail -1
echo ""
echo "CPU Load:"
uptime

echo ""
echo "🔍 Recent Logs:"
echo "PM2 Logs (last 10 lines):"
pm2 logs lpdh-website --lines 10 --nostream 2>/dev/null || echo "No PM2 logs available"

echo ""
echo "Nginx Error Logs (last 5 lines):"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No Nginx error logs"

echo ""
echo "🔍 Security Check:"
if ufw status | grep -q "Status: active"; then
    echo -e "${GREEN}✅ Firewall is active${NC}"
    ufw status numbered | head -10
else
    echo -e "${YELLOW}⚠️  Firewall status unknown${NC}"
fi

echo ""
echo "📊 Summary:"
echo "Run this command with your domain to check external accessibility:"
echo "sudo bash health-check.sh yourdomain.com"
echo ""
echo "🔧 Quick Troubleshooting:"
echo "- Restart app: sudo pm2 restart lpdh-website"
echo "- Restart nginx: sudo systemctl restart nginx"
echo "- View detailed logs: sudo pm2 logs lpdh-website"
echo "- Check nginx config: sudo nginx -t"
