const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const port = 3000;

let totalStorageUsageMB = 0; // Track total storage usage in MB

// Middleware to parse JSON
app.use(express.json());

// Rate limiting: 5 requests per hour per IP
const dataLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 5, // Limit to 5 requests per IP
  message: { error: "Too many requests, limit is 5 per hour" }
});

// Secure API endpoint with validation and rate limiting
app.post("/api/data", dataLimiter, (req, res) => {
  const { fileName, fileSize } = req.body;

  const sizeInMB = parseFloat(fileSize);
  
  // Validation: Limit fileSize to 20 MB max
  if (sizeInMB > 20) {
    return res.status(400).json({ error: "fileSize cannot exceed 20 MB" });
  }

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

/* ✅ Mitigated Issues
 - Validation: fileSize limited to 20 MB
 - Rate Limiting: 5 requests per hour per IP
 - Still tracks totalStorageUsageMB, but with controlled input
*/