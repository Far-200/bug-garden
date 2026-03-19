const express = require("express");
const cors = require("cors");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Bug Garden backend is alive 🌱" });
});

app.use("/api/analyze", analyzeRoutes);

module.exports = app;
