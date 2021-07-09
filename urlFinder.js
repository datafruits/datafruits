'use strict';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = async function ({ distDir, visit }) {
  let urls = [
    '/',
    '/timetable',
    '/podcasts',
    '/about',
    '/subscribe',
    '/dj-inquiry',
    '/coc',
    '/djs',
    '/chat',
    '/sign-up',
  ];

  // need to recursively crawl all the links on every page somehow
  for (const url of urls) {
    let page = await visit(url);
    if (page.statusCode === 200) {
      let html = await page.html();
      let dom = new JSDOM(html);
      for (let aTag of [...dom.window.document.querySelectorAll('a')]) {
        if (aTag.href) {
          console.log(aTag.hostname);
          console.log(aTag.host);
          // exclude external links
          //
          console.log(aTag.href);
          if (!aTag.hostname && !urls.includes(aTag.href)) {
            urls.push(aTag.href);
          }
        }
      }
      if (url === '/podcasts') {
        for (let aTag of [...dom.window.document.querySelectorAll('span.pagination a')]) {
          page = await visit(url);
          if (page.statusCode === 200) {
            let html = await page.html();
            let dom = new JSDOM(html);
            for (let aTag of [...dom.window.document.querySelectorAll('a')]) {
              if (aTag.href) {
                console.log(aTag.hostname);
                console.log(aTag.host);
                // exclude external links
                //
                console.log(aTag.href);
                if (!aTag.hostname && !urls.includes(aTag.href)) {
                  urls.push(aTag.href);
                }
              }
            }
          }
        }
      }
    }
  }

  return urls;
};
