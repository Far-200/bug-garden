import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const extensionToLanguage = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  java: "java",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  php: "php",
  css: "css",
  html: "html",
  htm: "html",
};

function detectLanguageFromCode(code) {
  const text = code.trim();

  if (!text) return "javascript";

  // HTML
  if (
    /<!DOCTYPE html>|<html|<body|<div|<head|<main|<section|<p|<span/i.test(text)
  ) {
    return "html";
  }

  // CSS
  if (
    /(^|\n)\s*[@.#]?[a-zA-Z][\w\-:\s>,()[\]"'=]*\s*\{[\s\S]*?:[\s\S]*?;?/m.test(
      text,
    ) &&
    !/\b(class|interface|function|if|for|while)\b/.test(text)
  ) {
    return "css";
  }

  // Java
  if (
    /\bSystem\.out\.println\b|\bpublic\s+class\b|\bpublic\s+static\s+void\s+main\b/.test(
      text,
    )
  ) {
    return "java";
  }

  // Python
  if (
    /\bdef\s+\w+\s*\(|\bprint\s*\(|\bimport\s+\w+|\bif\s+__name__\s*==\s*['"]__main__['"]/.test(
      text,
    )
  ) {
    return "python";
  }

  // C#
  if (
    /\busing\s+System\b|\bnamespace\s+\w+|\bConsole\.WriteLine\b/.test(text)
  ) {
    return "csharp";
  }

  // Go
  if (/\bpackage\s+main\b|\bfunc\s+main\s*\(|\bfmt\.Println\b/.test(text)) {
    return "go";
  }

  // Rust
  if (/\bfn\s+main\s*\(|\blet\s+mut\b|\bprintln!\s*\(/.test(text)) {
    return "rust";
  }

  // PHP
  if (/<\?php|\becho\b|\$\w+/.test(text)) {
    return "php";
  }

  // TypeScript
  if (
    /\binterface\s+\w+\b|\btype\s+\w+\s*=|:\s*(string|number|boolean|any|unknown|never|void)\b|\bimplements\b|\benum\b/.test(
      text,
    )
  ) {
    return "typescript";
  }

  // JavaScript
  if (
    /\bconst\b|\blet\b|\bvar\b|\bconsole\.log\b|\bfunction\b|=>|\bdocument\.querySelector\b|\bwindow\./.test(
      text,
    )
  ) {
    return "javascript";
  }

  // C++
  if (
    /^\s*#include\s*<(iostream|vector|string|map|set|bits\/stdc\+\+\.h)>/m.test(
      text,
    ) ||
    /\bstd::\w+|\bcout\s*<<|\bcin\s*>>|\busing\s+namespace\s+std\b/.test(text)
  ) {
    return "cpp";
  }

  // C fallback
  if (
    /^\s*#include\s*<stdio\.h>/m.test(text) ||
    /\bint\s+main\s*\(/.test(text) ||
    /\bprintf\s*\(/.test(text) ||
    /\bscanf\s*\(/.test(text) ||
    /\bchar\s+\w+(\[[^\]]*\])?\s*;/.test(text)
  ) {
    return "c";
  }

  return "javascript";
}

function UploadPage() {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const detectedLanguage = useMemo(() => {
    if (fileName) {
      const ext = fileName.split(".").pop()?.toLowerCase();
      if (ext && extensionToLanguage[ext]) {
        return extensionToLanguage[ext];
      }
    }
    return detectLanguageFromCode(code);
  }, [code, fileName]);

  const effectiveLanguage =
    selectedLanguage === "auto" ? detectedLanguage : selectedLanguage;

  const readFile = (file) => {
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(String(e.target?.result || ""));
    };
    reader.readAsText(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    readFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    readFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleAnalyze = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: effectiveLanguage,
        }),
      });

      const data = await res.json();

      navigate("/garden", {
        state: {
          ...data,
          meta: {
            fileName: fileName || "Pasted Code",
            language: effectiveLanguage,
          },
        },
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Backend had a dramatic little collapse.");
    }
  };

  return (
    <div className="app-shell">
      <div className="page-card">
        <h1 className="hero-title">Bug Garden</h1>
        <p className="hero-subtitle">
          Paste your code or drop a file into the garden and let the creatures
          hatch.
        </p>

        <div
          className={`upload-panel ${isDragging ? "drag-active" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <label className="upload-box">
            <input
              type="file"
              className="file-input"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.h,.cpp,.cc,.cxx,.hpp,.cs,.go,.rs,.php,.css,.html,.htm"
              onChange={handleFileChange}
            />
            <span className="upload-icon">📂</span>
            <span className="upload-title">Drag & drop a code file here</span>
            <span className="upload-subtext">
              Or click to choose one manually
            </span>
            <span className="upload-subtext">
              Supported: JS, JSX, TS, TSX, PY, JAVA, C, CPP, C#, GO, RUST, PHP,
              CSS, HTML
            </span>
            {fileName && (
              <span className="file-name">Selected: {fileName}</span>
            )}
          </label>
        </div>

        <div className="divider">
          <span>or paste code below</span>
        </div>

        <div className="input-row">
          <label className="input-label">Language</label>
          <select
            className="language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="auto">Auto Detect ({effectiveLanguage})</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>

        <textarea
          className="code-textarea"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (fileName) setFileName("");
          }}
          placeholder="Paste your code here..."
        />

        <div className="detect-note">
          Detected language: <strong>{effectiveLanguage}</strong>
        </div>

        <div className="actions">
          <button className="primary-btn" onClick={handleAnalyze}>
            Analyze Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
