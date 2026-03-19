import { useLocation, Link } from "react-router-dom";
import GardenCanvas from "../components/GardenCanvas";

function formatLanguage(language) {
  const map = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    go: "Go",
    rust: "Rust",
    php: "PHP",
    css: "CSS",
    html: "HTML",
  };

  return map[language] || language;
}

function GardenPage() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return (
      <div className="app-shell">
        <div className="page-card">
          <h2 className="hero-title">No garden data found</h2>
          <p className="hero-subtitle">
            Your bugs are hiding. Go back and analyze some code first.
          </p>
          <Link className="back-link" to="/">
            ← Go back
          </Link>
        </div>
      </div>
    );
  }

  const fileName = data.meta?.fileName || "Pasted Code";
  const language = formatLanguage(
    data.meta?.language || data.summary?.language || "unknown",
  );

  return (
    <div className="app-shell">
      <div className="page-card">
        <h1 className="hero-title">Your Bug Garden</h1>

        <div className="analysis-meta">
          <div className="meta-pill">📄 {fileName}</div>
          <div className="meta-pill">🧠 {language}</div>
        </div>

        <div className="stats-row">
          <div className="stat-pill">Total Bugs: {data.summary.totalBugs}</div>
          <div className="stat-pill">
            Total Lines: {data.summary.totalLines}
          </div>
        </div>

        <GardenCanvas bugs={data.bugs} />

        <Link className="back-link" to="/">
          ← Analyze More Code
        </Link>
      </div>
    </div>
  );
}

export default GardenPage;
