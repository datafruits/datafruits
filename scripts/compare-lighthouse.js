/* eslint-disable no-console */
const path = require("path");
const fs = require("fs");

const PR_FILE = path.resolve(process.env.PR_FILE);
const BASE_FILE = path.resolve(process.env.BASE_FILE);

const prLighthouse = JSON.parse(fs.readFileSync(PR_FILE));
const baseLighthouse = JSON.parse(fs.readFileSync(BASE_FILE));

const getData = ({ audits }) => audits;

const prData = getData(prLighthouse);
const baseData = getData(baseLighthouse);

const diffKeys = Object.keys(prData).filter(
  (id) => baseData[id].score !== prData[id].score
);

const percentDiffs = [];
const scoreDiffs = [];

const generateTableRow = (id) => {
  const { score: prScore, title, description } = prData[id];
  const { score: baseScore } = baseData[id];

  const scoreDiff = prScore - baseScore;
  const percentDiff = Math.round((scoreDiff / baseScore) * 100);
  const percentDiffText =
    percentDiff > 0 ? `+${percentDiff}%` : `${percentDiff}%`;

  scoreDiffs.push(scoreDiff);
  percentDiffs.push(percentDiff);

  return `| ${title} | ${baseScore} | ${prScore} | ${percentDiffText} | ${description} |`;
};

const tableHeader = `| Audit | \`master\` | \`${process.env.GITHUB_REF}\` | Diff. % | Description |`;
const tableData = diffKeys.map((id) => generateTableRow(id)).join("\n");

const avgPercentDiff =
  Math.round(
    (percentDiffs.reduce((a, b) => a + b, 0) / percentDiffs.length) * 100
  ) / 100;
const avgScoreDiff =
  Math.round(
    (scoreDiffs.reduce((a, b) => a + b, 0) / scoreDiffs.length) * 100
  ) / 100;

const introText = `This PR impacts the following lighthouse metrics:`;
const collapsibleText = `<details><summary>avg. diff: ${avgScoreDiff} (${avgPercentDiff}%)</summary>\n<p>\n`;
const outroText = "\n</p></details>";

const commentOutput = [
  introText,
  collapsibleText,
  tableHeader,
  "|-|-|-|-|-|",
  tableData,
  outroText,
].join("\n");

const outFile = path.resolve(process.cwd(), "comment-lighthouse.md");

fs.writeFileSync(outFile, commentOutput);
console.log(`Successfully wrote results to ${outFile}!`);
