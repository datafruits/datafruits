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

  const validUrls = [];

  const isValidUrl = (aTag) => {
    return !aTag.hostname &&
      !urls.includes(aTag.href.toLowerCase()) &&
      /^(\/)+\S+$/.test(aTag.href) &&
      !aTag.href.toLowerCase().includes('?');
  };

  // need to recursively crawl all the links on every page somehow
  for (const url of urls) {
    let page;
    try {
      page = await visit(url);
    } catch (err) {
      console.log(`Skipping ${url} due to error: ${err.message}`);
      continue;
    }
    if (page.statusCode === 200) {
      validUrls.push(url);
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
          let paginationPage;
          try {
            paginationPage = await visit(aTag.href);
          } catch (err) {
            console.log(`Skipping pagination ${aTag.href} due to error: ${err.message}`);
            continue;
          }
          if (paginationPage.statusCode === 200) {
            validUrls.push(aTag.href.toLowerCase());
            let html = await paginationPage.html();
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

  console.log('url count: ', validUrls.length);
  return validUrls;
};
