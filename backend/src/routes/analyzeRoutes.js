const express = require("express");
const router = express.Router();
const { analyzeCode } = require("../analyzer/codeAnalyzer");

router.post("/", (req, res) => {
  const { code, language } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({
      error: "Code input is required.",
    });
  }

  const result = analyzeCode(code, language);
  res.json(result);
});

module.exports = router;
