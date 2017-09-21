/* eslint-env node */
'use strict';

const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const fastbootTransform = require('fastboot-transform');
const path = require('path');
const existSync = require('exists-sync');

module.exports = {
  name: 'fastboot-import',

  /*isDevelopingAddon: function() {
    return true;
  }*/

  /**
   * Hook to read all browser specific libraries from bower and wrap them up with FastBoot check.
   * They by default are under the vendor tree.
   *
   * @param {Broccoli} tree
   */
  treeForVendor(tree) {
    let trees = [];

    if (tree) {
      trees.push(tree);
    }
    const app = this._findHost();
    const jplayerDir = path.join(this.project.root, app.bowerDirectory, 'jPlayer', 'dist', 'jplayer');

    if (existSync(jplayerDir)) {
      // Funnel the browser lib from bower with providing destDir as the lib (this is optional). If you don't
      // provide `destDir` it will default to `vendor/yourlib.js`. If you provide destDir it will default to:
      // `vendor/destDirName/yourlib.js`
      const browserTrees = fastbootTransform(new Funnel(jplayerDir, {
         files: ['jquery.jplayer.min.js'],
         destDir: 'jplayer'
       }));
       trees.push(browserTrees);
    }

    const jqueryTextcompleteDir = path.join(this.project.root, app.bowerDirectory, 'jquery-textcomplete', 'dist');

    if (existSync(jqueryTextcompleteDir)) {
      // Funnel the browser lib from bower with providing destDir as the lib (this is optional). If you don't
      // provide `destDir` it will default to `vendor/yourlib.js`. If you provide destDir it will default to:
      // `vendor/destDirName/yourlib.js`
      const browserTrees = fastbootTransform(new Funnel(jqueryTextcompleteDir, {
         files: ['jquery.textcomplete.min.js'],
         destDir: 'jquery-textcomplete'
       }));
       trees.push(browserTrees);
    }

    const masonryDir = path.join(this.project.root, app.bowerDirectory, 'masonry', 'dist');

    if (existSync(masonryDir)) {
      // Funnel the browser lib from bower with providing destDir as the lib (this is optional). If you don't
      // provide `destDir` it will default to `vendor/yourlib.js`. If you provide destDir it will default to:
      // `vendor/destDirName/yourlib.js`
      const browserTrees = fastbootTransform(new Funnel(masonryDir, {
         files: ['masonry.pkgd.min.js'],
         destDir: 'masonry'
       }));
       trees.push(browserTrees);
    }

    const imagesloadedDir = path.join(this.project.root, app.bowerDirectory, 'imagesloaded');

    if (existSync(imagesloadedDir)) {
      // Funnel the browser lib from bower with providing destDir as the lib (this is optional). If you don't
      // provide `destDir` it will default to `vendor/yourlib.js`. If you provide destDir it will default to:
      // `vendor/destDirName/yourlib.js`
      const browserTrees = fastbootTransform(new Funnel(imagesloadedDir, {
         files: ['imagesloaded.pkgd.min.js'],
         destDir: 'imagesloaded'
       }));
       trees.push(browserTrees);
    }

    return new Merge(trees);
  },

  included(app) {
    this._super.included(app);

    // import the above library into vendor.js that was merged with the vendor trees. In browser the library will be eval'd and run
    // In fastboot, the library will not be eval'd
    app.import('vendor/jplayer/jquery.jplayer.min.js');
    app.import('vendor/jquery-textcomplete/jquery.textcomplete.min.js');
    app.import('vendor/masonry/masonry.pkgd.min.js');
    app.import('vendor/imagesloaded/imagesloaded.pkgd.min.js');
  }
};
