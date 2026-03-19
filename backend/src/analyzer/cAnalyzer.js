const { exec } = require("child_process");
const fs = require("fs");

function analyzeC(code) {
  return new Promise((resolve) => {
    const file = "temp.c";

    fs.writeFileSync(file, code);

    exec(`gcc -fsyntax-only ${file}`, (err, stdout, stderr) => {
      const bugs = [];

      if (stderr) {
        bugs.push({
          type: "Compiler Kraken",
          severity: "high",
          message: stderr.split("\n")[0],
        });
      }

      fs.unlinkSync(file);

      resolve(bugs);
    });
  });
}

module.exports = analyzeC;
