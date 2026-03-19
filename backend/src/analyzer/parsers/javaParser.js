const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function parseJava(code) {
  const bugs = [];
  const tempFile = path.join(__dirname, "TempBugGarden.java");

  fs.writeFileSync(tempFile, code, "utf8");

  const result = spawnSync("javac", [tempFile], {
    encoding: "utf8",
  });

  if (result.stderr) {
    const lines = result.stderr.split("\n").filter(Boolean);

    for (const entry of lines.slice(0, 3)) {
      const lineMatch = entry.match(/TempBugGarden\.java:(\d+):/);

      bugs.push({
        type: "Bytecode Banshee",
        severity: "high",
        message: entry.trim(),
        line: lineMatch ? Number(lineMatch[1]) : null,
      });
    }
  }

  try {
    fs.unlinkSync(tempFile);
  } catch {}

  return bugs;
}

module.exports = { parseJava };
