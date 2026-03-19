const { parseJavaScript } = require("./parsers/jsParser");
const { parseTypeScript } = require("./parsers/tsParser");
const { parseCSS } = require("./parsers/cssParser");
const { parsePython } = require("./parsers/pythonParser");
const { parseC } = require("./parsers/cParser");
const { parseJava } = require("./parsers/javaParser");

function runParsers(code, language) {
  switch (language) {
    case "javascript":
      return parseJavaScript(code);
    case "typescript":
      return parseTypeScript(code);
    case "css":
      return parseCSS(code);
    case "python":
      return parsePython(code);
    case "c":
    case "cpp":
      return parseC(code, language);
    case "java":
      return parseJava(code);
    default:
      return [];
  }
}

module.exports = { runParsers };
