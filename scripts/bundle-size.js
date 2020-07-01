const { Builder, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const htmlparser2 = require("htmlparser2");
const fs = require("fs");
const path = require("path");

const getPageSource = async () => {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
      new chrome.Options().headless().windowSize({ width: 640, height: 480 })
    )
    .build();
  await driver.get("http://localhost:4200/_analyze");
  // Why tf is this "analyse" with an s but the page is "analyze" with a z
  await driver.wait(until.titleContains("Broccoli Concat Analyser"));
  return driver.getPageSource();
};

const getStats = (source) => {
  let scriptContent = "";
  let isCurrentlyParsingJS = false;

  const parser = new htmlparser2.Parser({
    onopentag(name) {
      if (name === "script") {
        isCurrentlyParsingJS = true;
      }
    },
    onclosetag(name) {
      if (name === "script") {
        isCurrentlyParsingJS = false;
      }
    },
    ontext(data) {
      if (isCurrentlyParsingJS && data.includes("var SUMMARY =")) {
        scriptContent = data.slice(data.indexOf("{") - 1);
      }
    },
  });

  parser.write(source);

  return JSON.parse(scriptContent);
};

const writeStatsToFile = (stats) => {
  const fp = path.resolve(process.cwd(), "bundle-size.json");
  const stringStats = JSON.stringify(stats);

  fs.writeFileSync(fp, stringStats);
};

getPageSource()
  .then((source) => getStats(source))
  .then((stats) => writeStatsToFile(stats));
