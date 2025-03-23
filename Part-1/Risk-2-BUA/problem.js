const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const app = express();
const port = 3000;

// Weak secret key
const JWT_SECRET = "secret";

// Mock database with hashed passwords
const users = [
  {
    id: 1,
    username: "alice",
    password: "$2a$12$riUzPVIb8xLpQR/PxYRpZekSJUzJEgI8/FUu56OSpIEl2COlmzx4q" // Pre-hashed "alicepassword"
  },
  {
    id: 2,
    username: "bob",
    password: "$2a$12$nDttis5U79FnLbzqclFIGONXA/LLxaWHuJQ/iXOis3vpuwHTu2Hk2" // Pre-hashed "bobpassword"
  }
];

app.use(express.json());

// TODO: Add rate limiting to prevent brute-force attacks

// Insecure login endpoint - only checks username
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Only checks if username exists, ignores password completely
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ error: `${username} not found` });
  }

  // TODO: Add password verification

  // Returns token even if password is incorrect
  const dummyToken = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({ message: "Login successful", token: dummyToken });
});

// Insecure profile endpoint
app.get("/profile", (req, res) => {
  const token = req.headers["token"];

  if (!token) {
    return res.json({ error: "Log in first" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    res.json({ username: user.username, password: user.password });
  } catch (err) {
    res.json({ error: "Bad token" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* ❌ WORSE Broken Authentication
 - Only validates username, password completely ignored
 - No brute-force protection
 - Leaky error messages
 - Weak JWT (simple secret, no expiration)
*/