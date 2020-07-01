/* eslint-disable no-console */
const path = require("path");
const fs = require("fs");

const PR_FILE = path.resolve(process.env.PR_FILE);
const BASE_FILE = path.resolve(process.env.BASE_FILE);

const prBundle = JSON.parse(fs.readFileSync(PR_FILE));
const baseBundle = JSON.parse(fs.readFileSync(BASE_FILE));

/**
 *
 * @param {string} label e.g. "some/bundle.js (3.22 kb)"
 */
const withoutBytes = (label) => label.slice(0, label.lastIndexOf("(") - 1);

// https://stackoverflow.com/a/18650828
/**
 *
 * @param {number} bytes the number of bytes
 * @param {number} decimals desired number of decimal places
 */
const makeNice = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// this is really bad.
let cumulativeByteDiff = 0;

/**
 *
 * @param {number} prBytes number of bytes in PR
 * @param {number} baseBytes number of bytes in master
 */
const byteDiff = (prBytes, baseBytes) => {
  const sign = prBytes > baseBytes ? "+" : "-";

  // haha scope? what is that?
  cumulativeByteDiff += prBytes - baseBytes;

  return sign + makeNice(Math.abs(prBytes - baseBytes));
};

/**
 *
 * @param {{ label?: string, sizes?: { compressed: number }}} prGroup
 * @param {{ label?: string, sizes?: { compressed: number }}} baseGroup
 */
const generateTableRow = (prGroup, baseGroup) => {
  let name = "";

  if (prGroup.label) {
    name = prGroup.label.includes("(")
      ? withoutBytes(prGroup.label)
      : prGroup.label;
  } else if (baseGroup.label) {
    name = baseGroup.label.includes("(")
      ? withoutBytes(baseGroup.label)
      : baseGroup.label;
  } else {
    name = "ERROR";
  }

  let baseBytes = 0;
  let prBytes = 0;

  if ("sizes" in baseGroup) {
    baseBytes = baseGroup.sizes.compressed;
  }

  if ("sizes" in prGroup) {
    prBytes = prGroup.sizes.compressed;
  }

  return `| ${[
    name,
    makeNice(baseBytes),
    makeNice(prBytes),
    byteDiff(prBytes, baseBytes),
  ].join(" | ")} |`;
};

/**
 *
 * @param {{ sizes: { weight: number } }} param0 group
 * @param {{ sizes: { weight: number } }} param1 group
 */
const groupsAreEqual = ({ sizes: prSizes }, { sizes: baseSizes }) =>
  prSizes.weight === baseSizes.weight;

const compareBundlesAndGenerateTableBody = () => {
  const uniqueGroups = [...prBundle.groups, ...baseBundle.groups].filter(
    (value, i, self) =>
      self.findIndex((group) => group.label === value.label) === i
  );

  const tableRows = uniqueGroups.map(({ label }) => {
    const prIndex = prBundle.groups.findIndex((group) => group.label === label);
    const baseIndex = baseBundle.groups.findIndex(
      (group) => group.label === label
    );

    if (prIndex < 0) {
      return generateTableRow({}, baseBundle.groups[baseIndex]);
    }

    if (baseIndex < 0) {
      return generateTableRow(prBundle.groups[prIndex], {});
    }

    const prGroup = prBundle.groups[prIndex];
    const baseGroup = baseBundle.groups[baseIndex];

    if (groupsAreEqual(prGroup, baseGroup)) {
      return "";
    }

    // TODO: recurse to find exact differences

    return generateTableRow(prGroup, baseGroup);
  });

  return tableRows.filter((row) => row !== "").join("\n");
};

const tableHeader = `| bundle | \`master\` | \`${process.env.GITHUB_REF}\` | Diff. |`;
const tableBody = compareBundlesAndGenerateTableBody();

const totalDiff = `${cumulativeByteDiff > 0 ? "+" : "-"}${makeNice(
  Math.abs(cumulativeByteDiff)
)}`;

const introText = `This PR ${
  cumulativeByteDiff > 0 ? "increases" : "decreases"
} bundle size.`;
const collapsibleText = `<details><summary>Total diff: ${totalDiff}</summary>\n<p>\n`;
const outroText = "\n</p></details>";

const commentOutput =
  tableBody !== "\n"
    ? [
        introText,
        collapsibleText,
        tableHeader,
        "|-|-|-|-|",
        tableBody,
        outroText,
      ].join("\n")
    : "This PR does not impact bundle size.";

const outFile = path.resolve(process.cwd(), "comment-bundle.md");

fs.writeFileSync(outFile, commentOutput);
console.log(`Successfully wrote results to ${outFile}!`);
