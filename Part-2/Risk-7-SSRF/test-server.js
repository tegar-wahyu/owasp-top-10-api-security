const express = require("express");
const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Test server is running on port 8080!");
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});