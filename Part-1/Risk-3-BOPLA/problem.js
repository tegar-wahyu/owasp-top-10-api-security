const express = require("express");
const app = express();
const port = 3000;

// Mock database
let users = [
  { id: 1, username: "alice", isAdmin: false, email: "alice@example.com", ssn: "123-45-6789" },
  { id: 2, username: "bob", isAdmin: false, email: "bob@example.com", ssn: "987-65-4321" }
];

app.use(express.json());

// Middleware to simulate Alice as the logged-in user
app.use((req, res, next) => {
  // Simulate Alice (user ID 1) being logged in
  req.user = { id: 1, name: "Alice", isAdmin: false };
  next();
});

// Vulnerable profile update endpoint
app.post("/update-profile", (req, res) => {
  const { id, username, isAdmin, email, ssn } = req.body; // Accepts any field from request

  let user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // 🚨 Mass Assignment Vulnerability: Blindly updates any property sent in the request
  user.username = username || user.username;
  user.email = email || user.email;
  if (isAdmin !== undefined) user.isAdmin = isAdmin; // Allows privilege escalation
  if (ssn !== undefined) user.ssn = ssn; // Allows modification of sensitive data

  // 🚨 Excessive Data Exposure: Returns the entire user object, including sensitive fields
  res.json({ message: "Profile updated", user });
});

// Insecure profile read endpoint
app.get("/profile/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Return all fields
  res.json(user);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* 🛑 ISSUE: Broken Object Property Level Authorization (BOPLA)
 - Mass Assignment: Alice can modify `isAdmin` and `ssn` without authorization
 - Excessive Data Exposure: Full user object (including sensitive `ssn` and `isAdmin`) returned
 - Middleware ensures only Alice's profile (id: 1) is accessed
*/