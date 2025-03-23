const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const app = express();
const port = 3000;

// Strong secret key (should be stored in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "v3ryStr0ngS3cr3tK3y!2025"; // Use a long, random string

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

// Rate limiting to prevent brute-force attacks (max 5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per IP
  message: { error: "Too many login attempts, please try again later" }
});

// Secure login endpoint
app.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Find user
  const user = users.find(u => u.username === username);
  if (!user) {
    // Generic error to prevent username enumeration
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate secure JWT with expiration
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour
  );

  res.json({ message: "Login successful", token });
});

// Secure profile endpoint
app.get("/profile", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return only safe data (no password)
    res.json({ username: user.username });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* ✅ Fixed Authentication
 - Passwords hashed with bcrypt
 - Proper password verification
 - Strong JWT secret with expiration
 - Rate limiting against brute-force attacks
 - No leaky error messages (prevents enumeration)
 - Secure token validation
 - Sensitive data (password) not exposed
*/