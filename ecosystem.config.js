module.exports = {
  apps: [
    {
      name: "test_mktproxy",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: "https://api.mktproxy.com",
        PORT: 3001,
      }
    },
    {
      name: "socket-server",
      script: "tsx",
      args: "server/socket-server.ts",
      env: {
        NODE_ENV: "production"
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      error_file: "./logs/socket-error.log",
      out_file: "./logs/socket-out.log",
      log_file: "./logs/socket-combined.log",
      time: true
    }
  ]
}
