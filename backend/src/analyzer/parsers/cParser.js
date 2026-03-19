const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function parseC(code, language = "c") {
  const bugs = [];
  const ext = language === "cpp" ? "cpp" : "c";
  const compiler = language === "cpp" ? "g++" : "gcc";
  const tempFile = path.join(__dirname, `temp_bug_garden.${ext}`);

  fs.writeFileSync(tempFile, code, "utf8");

  const result = spawnSync(compiler, ["-fsyntax-only", tempFile], {
    encoding: "utf8",
  });

  if (result.stderr) {
    const lines = result.stderr.split("\n").filter(Boolean);

    for (const entry of lines.slice(0, 3)) {
      const lineMatch = entry.match(/:(\d+):(\d+):/);

      bugs.push({
        type: "Compiler Kraken",
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

module.exports = { parseC };
