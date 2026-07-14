const fs = require("fs");
const path = require("path");

const readDB = (filename) => {
  const filepath = path.join(_dirname, "../data", filename);
  const raw = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(raw);
};

const writeDB = (filename, data) => {
  const filepath = path.join(_dirname, "../data", filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };
