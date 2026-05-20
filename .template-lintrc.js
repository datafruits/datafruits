'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-bare-strings': true,
    'no-implicit-this': {
      allow: [
        'current-timezone',
        'random-loading-message',
        'random-loading-spinner',
      ],
    },
    'no-curly-component-invocation': {
      allow: [
        'current-timezone',
        'random-loading-message',
        'random-loading-spinner',
      ],
    },
  },
};
