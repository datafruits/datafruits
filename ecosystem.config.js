/*global module*/
/*eslint-env node */

module.exports = {
  apps: [
    {
      script: 'fastboot_server/server.js',
      watch: '.',
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
