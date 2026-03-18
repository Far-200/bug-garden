// Simple function to calculate a "bug score"
// based on number of issues detected in code

function calculateBugScore(issues) {
  if (!Array.isArray(issues)) return 0;

  let score = 0;

  issues.forEach((issue) => {
    if (issue.severity === "high") score += 5;
    else if (issue.severity === "medium") score += 3;
    else if (issue.severity === "low") score += 1;
  });

  return score;
}

module.exports = calculateBugScore;
