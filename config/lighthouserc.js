module.exports = {
  ci: {
    collect: {
      method: 'node',
      headful: false,
      url: 'http://0.0.0.0:3000',
      startServerCommand: 'node fastboot_server/server.js',
      startServerReadyPattern: 'HTTP server started;'
    },
    assert: {
      preset: 'lighthouse:recommended'
    },
    upload: {
      target: 'temporary-public-storage'
    },
  },
};
