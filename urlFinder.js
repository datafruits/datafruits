/*eslint-env node */
/* global require, module */
'use strict';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = async function ({ _distDir, visit }) {
  let urls = [
    '/',
    //    '/timetable',
    //'/podcasts',
    '/about',
    '/subscribe',
    '/dj-inquiry',
    '/coc',
    //'/djs',
    '/chat',
    '/sign-up',
    '/forum',
    '/wiki',
    '/shows',
    '/support'
  ];

  const isValidUrl = (aTag) => {
    return !aTag.hostname &&
      !urls.includes(aTag.href.toLowerCase()) &&
      /^(\/)+\S+$/.test(aTag.href) &&
      !aTag.href.toLowerCase().includes('?');
  };

  // need to recursively crawl all the links on every page somehow
  for (const url of urls) {
    let page = await visit(url);
    if (page.statusCode === 200) {
      let html = await page.html();
      let dom = new JSDOM(html);
      for (let aTag of [...dom.window.document.querySelectorAll('a')]) {
        if (aTag.href) {
          if (isValidUrl(aTag)) {
            urls.push(aTag.href.toLowerCase());
          }
        }
      }
      if (['/podcasts', '/forum', '/wiki', '/shows'].includes(url)) {
        for (let aTag of [...dom.window.document.querySelectorAll('span.pagination a')]) {
          page = await visit(aTag.href);
          if (page.statusCode === 200) {
            let html = await page.html();
            let dom = new JSDOM(html);
            for (let aTag of [...dom.window.document.querySelectorAll('a')]) {
              if (aTag.href) {
                if (isValidUrl(aTag)) {
                  urls.push(aTag.href.toLowerCase());
                }
              }
            }
          }
        }
      }
    }
  }

  console.log('url count: ', urls.length);
  return urls;
};
