// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'mktproxy-fe',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
