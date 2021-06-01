/*global module*/
/*eslint-env node */

module.exports = {
  apps: [
    {
      script: 'fastboot_server/server.js',
      watch: '.',
      max_memory_restart: '300M',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],

  deploy: {
    production: {
      'pre-deploy-local': '',
      'post-deploy': 'yarn install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
