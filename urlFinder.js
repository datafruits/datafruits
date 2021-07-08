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
  for (const url of urls) {
    let page = await visit(url);
    if (page.statusCode === 200) {
      let html = await page.html();
      let dom = new JSDOM(html);
      for (let aTag of [...dom.window.document.querySelectorAll('a')]) {
        console.log(aTag.href);
        if (aTag.href) {
          console.log(aTag.hostname);
          console.log(aTag.host);
          // exclude external links
          //
          if(!aTag.hostname && !urls.includes(aTag.pathname)) {
            urls.push(aTag.pathname);
          }
        }
      }
    }
  }

  return urls;
}
