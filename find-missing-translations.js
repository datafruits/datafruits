/* eslint-env node*/
/* global require, module, process */

var {parse} = require('path');
var jsonDiff = require('json-diff');
const prototype = "./translations/en.json";
const data = require(prototype);
const langs = ["./translations/en-us.json",
"./translations/cn.json",
"./translations/es.json",
"./translations/ja.json",
"./translations/ko.json",
];
var debug = false;
if (process.argv.length > 2) {
    debug = process.argv[2] === "-d";
}
for (const lang of langs) {
    const dataLang = require(lang);
    const diffData = jsonDiff.diff(data, dataLang);
    if (typeof(diffData) === 'undefined') {
        console.log(`${prototype} and ${lang} are identical`);
        console.log('===============================');
        continue;
    }
    const diffKeys = Object.keys(diffData);
    const missingKey = /__deleted$/;
    const missingKeys = diffKeys.filter(k => missingKey.test(k));
    const friendlyMissingKeys = missingKeys.map(k => k.replace(missingKey, ''));

    const parsedLang = parse(lang);
    const changedKeys = diffKeys.filter(k => missingKeys.indexOf(k) === -1);
    var addedKeys= [];
    var modifiedKeys = [];
    for (const key of changedKeys) {
        if (key.endsWith("__added")){
            addedKeys.push(key.replace("__added", ""));
            continue;
        }
        const jsonObject = diffData[key];
        const jsonType = typeof(jsonObject);
        switch (jsonType) {
            case "object":
                // object contains recursively embedded __new and __old fields within
                modifiedKeys.push(key);
                break;
            case "string":
                // this "object" doesn't exist in the main translation file
                throw new Error(`Expected to filter "${key}" earlier!`);
            default:
                console.error(key);
                throw Error(`Unrecognized type encountered "${jsonType}`);
        }
    }

    console.log(`${parsedLang.base} audit details:`);
    console.log(`${friendlyMissingKeys.length} missing keys`);
    if (debug) printKeys(friendlyMissingKeys);

    console.log(`${addedKeys.length} added keys`);
    if (debug) printKeys(addedKeys);

    console.log(`${modifiedKeys.length} modified keys`);
    if (debug) printKeys(modifiedKeys);

    console.log('===============================');

    if (!debug & (friendlyMissingKeys.length > 0 || addedKeys.length > 0 || modifiedKeys.length > 0)) console.log("to view keys, add '-- -d' at the end of this script (npm run audit-translate -- -d)`");
}
function printKeys(keys) {
    for (const key of keys) {
        console.log(`\t${key}`);
    }
}
