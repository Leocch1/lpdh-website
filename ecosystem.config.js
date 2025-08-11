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
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/lpdh-website/err.log',
    out_file: '/var/log/lpdh-website/out.log',
    log_file: '/var/log/lpdh-website/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // For clustering (uncomment if you have multiple CPU cores)
    // instances: 'max',
    // exec_mode: 'cluster'
  }]
}
