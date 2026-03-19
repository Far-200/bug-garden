const { runParsers } = require("./parserRouter");

function analyzeCode(code, language = "javascript") {
  const bugs = [];
  const lines = code.split("\n");
  const totalLines = lines.length;

  const pushBug = (type, severity, message, line = null, suggestion = null) => {
    bugs.push({
      type,
      severity,
      message,
      line,
      suggestion,
    });
  };

  // Parser / compiler-backed bugs first
  const parserBugs = runParsers(code, language).map((bug) => ({
    ...bug,
    suggestion:
      bug.suggestion ||
      getSuggestionForBugType(bug.type, language, bug.message, bug.line),
  }));

  bugs.push(...parserBugs);

  const codeLikeLanguages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "cpp",
    "csharp",
    "go",
    "rust",
    "php",
  ];

  const styleLanguages = ["css", "html"];

  // General checks
  const loopMatches = code.match(/\b(for|while)\b/g) || [];
  if (loopMatches.length >= 3 && codeLikeLanguages.includes(language)) {
    pushBug(
      "Loop Leech",
      "medium",
      "Too many loops detected. This code may be harder to maintain.",
      null,
      "Try breaking nested loops into smaller helper functions or simplifying the logic.",
    );
  }

  const alreadyHasCriticalParserBug = bugs.some(
    (bug) =>
      bug.type === "Syntax Specter" ||
      bug.type === "Type Wraith" ||
      bug.type === "Compiler Kraken" ||
      bug.type === "Bytecode Banshee" ||
      bug.type === "Indentation Imp",
  );

  if (
    ["javascript", "typescript", "python", "java", "php"].includes(language) &&
    !alreadyHasCriticalParserBug &&
    !code.includes("try") &&
    !code.includes("catch")
  ) {
    pushBug(
      "Null Snake",
      "high",
      "No error handling found. Dangerous little jungle.",
      null,
      "Wrap risky operations in try/catch or add proper error handling for safer execution.",
    );
  }

  if (totalLines > 50) {
    pushBug(
      "Spaghetti Vine",
      "medium",
      "This code block is getting long and tangled.",
      null,
      "Split this file or function into smaller, more focused sections.",
    );
  }

  const varMatches =
    code.match(/\b(let|const|var|int|float|double|string|char|bool)\b/g) || [];
  if (varMatches.length > 15 && codeLikeLanguages.includes(language)) {
    pushBug(
      "Chaos Beetle",
      "low",
      "Lots of variables detected. Consider breaking the logic apart.",
      null,
      "Reduce variable clutter by extracting repeated logic into smaller functions.",
    );
  }

  if (styleLanguages.includes(language) && totalLines > 120) {
    pushBug(
      "Cascade Creeper",
      "low",
      "Large style/layout file detected. Consider splitting sections into smaller parts.",
      null,
      "Split styles into multiple files or organize them by component/section.",
    );
  }

  // C / C++ heuristics
  if (language === "c" || language === "cpp") {
    const trimmedLines = lines.map((line) => line.trim());

    trimmedLines.forEach((line, index) => {
      if (!line) return;

      const shouldIgnore =
        line.startsWith("#") ||
        line.endsWith("{") ||
        line.endsWith("}") ||
        line.endsWith(";") ||
        line.startsWith("for") ||
        line.startsWith("while") ||
        line.startsWith("if") ||
        line.startsWith("else") ||
        line.startsWith("//") ||
        line.startsWith("/*") ||
        line.startsWith("*");

      if (shouldIgnore) return;

      const looksLikeStatement =
        line.includes("=") ||
        /\bprintf\s*\(/.test(line) ||
        /\bscanf\s*\(/.test(line) ||
        line.startsWith("return");

      if (looksLikeStatement) {
        pushBug(
          "Semicolon Slug",
          "high",
          "Possible missing semicolon detected in C/C++ code.",
          index + 1,
          "Add ';' at the end of this statement.",
        );
      }
    });

    const hasPrintf = /\bprintf\s*\(/.test(code);
    const hasStdio = /#include\s*[<"]stdio\.h[>"]/.test(code);

    if (hasPrintf && !hasStdio) {
      pushBug(
        "Header Hermit",
        "medium",
        "printf detected without stdio.h include.",
        null,
        "Add `#include <stdio.h>` at the top of the file.",
      );
    }

    const hasForLoop = /\bfor\s*\((.*?)\)/.test(code);
    const declaresI =
      /\b(int|long|size_t)\s+i\b/.test(code) ||
      /\bfor\s*\(\s*(int|long|size_t)\s+i/.test(code);
    const usesIInFor = /\bfor\s*\([^)]*\bi\b/.test(code);

    if (hasForLoop && usesIInFor && !declaresI) {
      const forLineIndex = lines.findIndex((line) => /\bfor\s*\(/.test(line));

      pushBug(
        "Phantom Iterator",
        "high",
        "Loop variable may be used without declaration.",
        forLineIndex >= 0 ? forLineIndex + 1 : null,
        language === "c" || language === "cpp"
          ? "Declare the loop variable inside the loop, for example: `for (int i = 0; ... )`."
          : "Declare the loop variable before using it.",
      );
    }
  }

  // JavaScript / TypeScript heuristics
  if (language === "javascript" || language === "typescript") {
    if (code.includes("console.log") && !code.includes("try")) {
      const consoleLineIndex = lines.findIndex((line) =>
        line.includes("console.log"),
      );

      pushBug(
        "Console Crow",
        "low",
        "Console logging found without surrounding safeguards.",
        consoleLineIndex >= 0 ? consoleLineIndex + 1 : null,
        "Use logging intentionally, and add error handling around risky operations when needed.",
      );
    }
  }

  return {
    summary: {
      totalLines,
      totalBugs: bugs.length,
      language,
    },
    bugs,
  };
}

function getSuggestionForBugType(type, language, message, line) {
  const suggestions = {
    "Syntax Specter":
      "Check the syntax near the reported line and fix missing brackets, quotes, or punctuation.",
    "Type Wraith":
      "Review the type syntax near the reported line and fix invalid TypeScript annotations.",
    "Indentation Imp":
      "Fix indentation and syntax near the reported line, then run the code again.",
    "Compiler Kraken":
      "Read the compiler error carefully and correct the syntax or declaration near the reported line.",
    "Bytecode Banshee":
      "Fix the Java syntax or class structure near the reported line and recompile.",
    "Semicolon Slug": "Add ';' at the end of the affected statement.",
    "Header Hermit": "Add `#include <stdio.h>` at the top of the file.",
    "Phantom Iterator":
      "Declare the loop variable before using it, or declare it directly in the `for` loop.",
    "Loop Leech":
      "Reduce nesting or extract loop logic into smaller functions.",
    "Null Snake": "Add try/catch or other language-appropriate error handling.",
    "Spaghetti Vine":
      "Split the file or function into smaller, clearer sections.",
    "Chaos Beetle": "Reduce variable clutter by refactoring repeated logic.",
    "Cascade Creeper":
      "Break styles into smaller files or organize by component/section.",
    "Console Crow":
      "Remove debug logging or wrap risky code with better error handling.",
  };

  return suggestions[type] || null;
}

module.exports = { analyzeCode };
