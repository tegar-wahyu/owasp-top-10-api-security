const express = require("express");
const fetch = require("node-fetch"); // For making HTTP requests
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to simulate authentication (e.g., Alice as logged-in user)
app.use((req, res, next) => {
  req.user = { id: 1, name: "Alice", role: "user" };
  next();
});

// Vulnerable endpoint: Fetches content from a user-supplied URL
app.post("/api/fetch-url", async (req, res) => {
  const { url } = req.body;

  // 🚨 No validation: Blindly accepts any URL from the user
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // 🚨 SSRF Vulnerability: Makes a server-side request to the user-supplied URL
    const response = await fetch(url);
    const data = await response.text();

    res.json({
      message: "Content fetched successfully",
      url: url,
      content: data
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch URL",
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* ❌ SIMULATED API7:2023 - Server Side Request Forgery
 - /api/fetch-url accepts any URL without validation
 - Allows requests to internal services (e.g., localhost, metadata endpoints)
 - No restrictions on external URLs, enabling abuse (e.g., fetching malicious content)
 - Exposes server-side errors, aiding attackers
*/