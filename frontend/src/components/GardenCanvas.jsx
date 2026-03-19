const bugIcons = {
  "Loop Leech": "🪱",
  "Null Snake": "🐍",
  "Chaos Beetle": "🪲",
  "Spaghetti Vine": "🌿",
  "Clone Mushroom": "🍄",
  "Cascade Creeper": "🕸️",
  "Semicolon Slug": "🐌",
  "Header Hermit": "🦀",
  "Phantom Iterator": "👻",
  "Console Crow": "🐦",
  "Syntax Specter": "👻",
  "Type Wraith": "🧊",
  "Indentation Imp": "😈",
  "Compiler Kraken": "🦑",
  "Bytecode Banshee": "👹",
};

const positions = [
  { top: "18%", left: "12%" },
  { top: "30%", left: "68%" },
  { top: "58%", left: "22%" },
  { top: "62%", left: "75%" },
  { top: "42%", left: "45%" },
  { top: "20%", left: "48%" },
];

function GardenCanvas({ bugs }) {
  if (!bugs.length) {
    return (
      <div className="empty-state">
        Clean garden. No bug creatures spawned 🌸
      </div>
    );
  }

  return (
    <div className="garden-wrapper">
      <div className="garden-field">
        <div className="garden-moon" />
        <div className="garden-ground" />

        {bugs.map((bug, index) => {
          const pos = positions[index % positions.length];

          return (
            <div
              key={index}
              className={`garden-bug severity-${bug.severity}`}
              style={{ top: pos.top, left: pos.left }}
              title={`${bug.type}${bug.line ? ` • line ${bug.line}` : ""}`}
            >
              <span className="garden-bug-icon">
                {bugIcons[bug.type] || "🐛"}
              </span>
              <span className="garden-bug-name">{bug.type}</span>
            </div>
          );
        })}
      </div>

      <div className="bug-grid">
        {bugs.map((bug, index) => (
          <div className={`bug-card ${bug.severity}`} key={index}>
            <div className={`severity-badge severity-${bug.severity}`}>
              {bug.severity} severity
            </div>

            <h3 className="bug-title">
              {bugIcons[bug.type] || "🐛"} {bug.type}
            </h3>

            {bug.line && <p className="bug-line">Line {bug.line}</p>}

            <p className="bug-message">{bug.message}</p>

            {bug.suggestion && (
              <div className="bug-fix">💡 Suggested Fix: {bug.suggestion}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GardenCanvas;
