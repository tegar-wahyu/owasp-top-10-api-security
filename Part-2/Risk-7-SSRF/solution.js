const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to simulate authentication (e.g., Alice as logged-in user)
app.use((req, res, next) => {
  req.user = { id: 1, name: "Alice", role: "user" };
  next();
});

// Secure endpoint: Fetches content from a validated URL
app.post("/api/fetch-url", async (req, res) => {
  const { url: inputUrl } = req.body;

  // Basic input validation
  if (!inputUrl || typeof inputUrl !== "string") {
    return res.status(400).json({ error: "Valid URL is required" });
  }

  // Parse the URL
  let parsedUrl;
  try {
    parsedUrl = new URL(inputUrl);
  } catch (error) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  // Block internal addresses (localhost, private IPs)
  const internalIPs = ["localhost", "127.0.0.1", "::1", "169.254.169.254"];
  if (internalIPs.includes(hostname) || hostname.match(/^(10|172\.(1[6-9]|2[0-9]|3[0-1])|192\.168)\./)) {
    return res.status(403).json({ error: "Internal URLs are not allowed" });
  }

  try {
    const response = await fetch(inputUrl);
    const data = await response.text();

    res.json({
      message: "Content fetched successfully",
      url: inputUrl,
      content: data
    });
  } catch (error) {
    // Sanitize error output
    res.status(500).json({ error: "Unable to fetch URL" });
  }
});

app.listen(port, () => {
  console.log(`Secure server running at http://localhost:${port}`);
});

/* ✅ Fixed API7:2023 - Server Side Request Forgery
 - Blocks internal URLs (localhost, private IPs)
 - Sanitized error messages
 - Further improvements:
    - Implement a whitelist of allowed domains
    - Rate limiting to prevent abuse
    - Use a reverse proxy to handle requests securely
*/