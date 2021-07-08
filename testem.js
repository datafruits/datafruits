module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['chromium'],
  browser_args: {
    chromium: {
      dev: ['--remote-debugging-port=9222'],
    },
    Chrome: {
      dev: ['--remote-debugging-port=9222'],
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=9222',
        '--window-size=1440,900',
      ].filter(Boolean),
    },
  },
};
