const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const port = 3000;

let totalStorageUsageMB = 0; // Track total storage usage in MB

// Middleware to parse JSON (No restrictions, allowing large payloads)
app.use(express.json());

// 🚨 Simulated API endpoint (No rate limiting or restrictions)
app.post("/api/data", (req, res) => {
  const { fileName, fileSize } = req.body;

  const sizeInMB = parseFloat(fileSize);
  totalStorageUsageMB += sizeInMB;

  res.json({
    message: "Simulated data received!",
    fileName: fileName,
    fileSize: fileSize,
    totalStorageUsageMB: totalStorageUsageMB.toFixed(2)
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* 🛑 ISSUE: Unrestricted Resource Consumption
 - No input validation: Accepts any fileSize
 - No rate limiting: Open to abuse via repeated requests leading to excessive storage usage
*/