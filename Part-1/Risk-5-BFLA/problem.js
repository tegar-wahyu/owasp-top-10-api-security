const express = require("express");
const app = express();
const port = 3000;

// Simulated user database with roles
const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "user" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "admin" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" }
];

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to simulate Alice as the logged-in user
app.use((req, res, next) => {
  // Simulate Alice (user ID 1) being logged in
  req.user = { id: 1, name: "Alice", role: "user" };
  next();
});

// TODO: Implement role-based authorization check
const requireAdmin = (req, res, next) => {};

// 🚨 Vulnerable admin endpoint: No role-based authorization check
app.get("/api/admin/users", (req, res) => {
  // This should only be accessible to admins, but there's no check!
  res.json({
    message: "Admin view: All users",
    users: users
  });
});

// Regular user endpoint (uses req.user from middleware)
app.get("/api/user/profile", (req, res) => {
  res.json({
    message: "Your profile",
    user: req.user // Reflects Alice from middleware
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* 🛑 ISSUE: Broken Function Level Authorizaion (BFLA)
 - The /api/admin/users endpoint exposes all user data and should be restricted to admins.
 - No check ensures the requester has the "admin" role.
 - A regular user (e.g., Alice) can access this endpoint and see sensitive data or perform privileged actions.
*/