module.exports = {
  apps: [{
    name: "ifeng-proxy",
    script: "index.js",
    instances: 1,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: "1m"
  }]
}