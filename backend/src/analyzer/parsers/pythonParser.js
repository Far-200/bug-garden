const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function parsePython(code) {
  const bugs = [];
  const tempFile = path.join(__dirname, "temp_bug_garden.py");

  fs.writeFileSync(tempFile, code, "utf8");

  const result = spawnSync("python", ["-m", "py_compile", tempFile], {
    encoding: "utf8",
  });

  if (result.stderr) {
    const lineMatch = result.stderr.match(/line (\d+)/i);

    bugs.push({
      type: "Indentation Imp",
      severity: "high",
      message: result.stderr.trim().split("\n").slice(-1)[0],
      line: lineMatch ? Number(lineMatch[1]) : null,
    });
  }

  try {
    fs.unlinkSync(tempFile);
  } catch {}

  return bugs;
}

module.exports = { parsePython };
