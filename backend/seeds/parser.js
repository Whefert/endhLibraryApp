const csv = require("csv-parser");
const fs = require("fs");
const results = [];

console.log(results);

const end = new Promise(function (resolve, reject) {
  fs.on("end", () => resolve(results));
  fs.on("error", reject);
});

module.exports = { end };
