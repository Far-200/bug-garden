const csstree = require("css-tree");

function parseCSS(code) {
  const bugs = [];

  try {
    csstree.parse(code, { positions: true });
  } catch (err) {
    bugs.push({
      type: "Cascade Creeper",
      severity: "high",
      message: err.message.split("\n")[0],
      line: err.line || null,
    });
  }

  return bugs;
}

module.exports = { parseCSS };
