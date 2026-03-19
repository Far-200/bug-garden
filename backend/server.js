const app = require("./src/app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Bug Garden server running on http://localhost:${PORT}`);
});
