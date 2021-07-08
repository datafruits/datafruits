'use strict';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = async function({ distDir, visit }) {
  let urls = [
        '/',
        '/timetable',
        '/about',
        '/subscribe',
        '/dj-inquiry',
        '/coc',
        '/djs',
        '/chat',
        '/sign-up',
  ];

  // need to recursively crawl all the links on every page somehow
  // also should exclude external links?
  let page = await visit('/timetable');
  if (page.statusCode === 200) {
    let html = await page.html();
    let dom = new JSDOM(html);
    for (let aTag of [...dom.window.document.querySelectorAll('a')]) {
      if (aTag.href) {
        urls.push(aTag.href);
      }
    }
  }

  return urls;
}
