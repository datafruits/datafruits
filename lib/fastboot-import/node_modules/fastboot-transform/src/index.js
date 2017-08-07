'use strict';

var map = require('broccoli-stew').map;

/**
 * Utility that makes a given browser library complaint in FastBoot environment.
 */
module.exports = function(tree) {
  if (!tree) {
    throw new Error('`fastboot-transform` requires broccoli tree as input.');
  }

  return map(tree, '**/*.js', (content) => `if (typeof FastBoot === 'undefined') {\n${content}\n}`);
}
