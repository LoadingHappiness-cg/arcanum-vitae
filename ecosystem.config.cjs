module.exports = {
  apps: [
    {
      name: 'arcanum-vitae',
      script: 'npm',
      args: 'run start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
