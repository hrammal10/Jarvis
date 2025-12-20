module.exports = {
    apps: [
        {
            name: 'jarvis',
            script: 'dist/index.js',
            cwd: __dirname,
            
            // Instances & execution
            instances: 1,
            exec_mode: 'fork',
            
            // Auto-restart settings
            autorestart: true,
            watch: false,
            max_restarts: 10,
            min_uptime: '10s',
            restart_delay: 5000,
            
            // Memory management
            max_memory_restart: '500M',
            
            // Logs
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            error_file: 'logs/jarvis-error.log',
            out_file: 'logs/jarvis-out.log',
            merge_logs: true,
            
            // Environment
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};

