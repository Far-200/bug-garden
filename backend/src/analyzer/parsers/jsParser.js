const { parse } = require("@babel/parser");

function parseJavaScript(code) {
  const bugs = [];

  try {
    parse(code, {
      sourceType: "unambiguous",
      plugins: ["jsx"],
    });
  } catch (err) {
    bugs.push({
      type: "Syntax Specter",
      severity: "high",
      message: err.message.split("\n")[0],
      line: err.loc?.line || null,
    });
  }

  return bugs;
}

module.exports = { parseJavaScript };
