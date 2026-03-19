const ts = require("typescript");
const fs = require("fs");
const path = require("path");

function parseTypeScript(code) {
  const bugs = [];
  const tempFile = path.join(__dirname, "temp_bug_garden.ts");

  fs.writeFileSync(tempFile, code, "utf8");

  const program = ts.createProgram([tempFile], {
    noEmit: true,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    strict: true,
  });

  const diagnostics = ts.getPreEmitDiagnostics(program);

  diagnostics.slice(0, 5).forEach((diag) => {
    const message = ts.flattenDiagnosticMessageText(diag.messageText, "\n");

    let line = null;
    if (diag.file && typeof diag.start === "number") {
      const pos = diag.file.getLineAndCharacterOfPosition(diag.start);
      line = pos.line + 1;
    }

    bugs.push({
      type: "Type Wraith",
      severity: "high",
      message,
      line,
      suggestion:
        "Fix the TypeScript type mismatch or invalid type usage near this line.",
    });
  });

  try {
    fs.unlinkSync(tempFile);
  } catch {}

  return bugs;
}

module.exports = { parseTypeScript };
