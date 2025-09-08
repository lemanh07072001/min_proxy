module.exports = {
  apps: [{
    name: "next-app",
    script: "npm",
    args: "start",
    env: {
      NODE_ENV: "production",
      NEXT_PUBLIC_API_URL: "https://api.minhan.online"
    }
  }]
}
