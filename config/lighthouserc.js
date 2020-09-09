module.exports = {
  ci: {
    collect: {
      method: 'node',
      headful: false,
      url: 'http://localhost:4200',
      startServerCommand: 'ember serve environment=production',
      startServerReadyPattern: 'Build successful',
      startServerReadyTimeout: 75000,
      settings: {
        skipAudits: ['is-on-https', 'uses-http2', 'color-contrast', 'redirects-http'],
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'filesystem',
      outputDir: 'lhci',
      reportFilenamePattern: 'lighthouse-report-%%DATE%%.%%EXTENSION%%',
    },
  },
};
