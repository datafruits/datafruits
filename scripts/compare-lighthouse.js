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

const generateTableRow = (id) => {
  const { score: prScore, title, description } = prData[id];
  const { score: baseScore } = baseData[id];

  const scoreDiff = Math.round(((prScore - baseScore) / baseScore) * 100);
  const scoreDiffText = scoreDiff > 0 ? `+${scoreDiff}%` : `${scoreDiff}%`;

  return `| ${title} | ${baseScore} | ${prScore} | ${scoreDiffText} | ${description} |`;
};

const tableHeader = `| Audit | \`master\` | \`${process.env.GITHUB_REF}\` | Diff. % | Description |`;
const tableData = diffKeys.map((id) => generateTableRow(id)).join("\n");

const introText = "This PR impacts the following lighthouse metrics:\n";
const commentOutput = [introText, tableHeader, "|-|-|-|-|-|", tableData].join(
  "\n"
);

const outFile = path.resolve(process.cwd(), "comment.md");

fs.writeFileSync(outFile, commentOutput);
console.log(`Successfully wrote results to ${outFile}!`);
