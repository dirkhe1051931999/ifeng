module.exports = {
  apps: [{
    name: "ifeng-proxy",
    script: "bundle.js",
    instances: 1,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: "1m",
    exec_mode: 'cluster',
    out_file: './logs/out.log', // 指定标准输出日志文件
    error_file: './logs/error.log', // 指定错误输出日志文件
    log_date_format: 'YYYY-MM-DD HH:mm Z', // 日志时间格式
  }]
}