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

// Secure profile update endpoint
app.post("/update-profile", (req, res) => {
  const { username, email } = req.body; // Whitelist only allowed fields

  // Use the authenticated user's ID (Alice, id: 1) from middleware, ignore req.body.id
  let user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Only update permitted fields (prevents mass assignment)
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  // Sensitive fields like `isAdmin` and `ssn` are NOT updated

  // Return only safe, non-sensitive data
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  res.status(200).json({ message: "Profile updated", user: safeUser });
});

// Secure profile read endpoint
app.get("/profile/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Restrict access to only the authenticated user's profile (Alice, id: 1)
  if (userId !== req.user.id) {
    return res.status(403).json({ error: "Unauthorized access to this profile" });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Return only safe, non-sensitive data (prevents excessive data exposure)
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  res.status(200).json(safeUser);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* ✅ Fix: Broken Object Property Level Authorization (BOPLA)
 - Mass Assignment: Only whitelisted fields (`username`, `email`) can be updated
 - Excessive Data Exposure: Only safe fields (`id`, `username`, `email`) are returned
 - Access Control: Alice can only update/view her own profile (id: 1)
*/