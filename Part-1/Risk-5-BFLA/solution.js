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

// Middleware for admin-only access
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};

// Secure admin endpoint with role-based authorization
app.get("/api/admin/users", requireAdmin, (req, res) => {
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

/* ✅ Fix: Broken Function Level Authorizaion (BFLA)
 - /api/admin/users endpoint now restricted to users with "admin" role
 - Role-based authorization check prevents non-admin users (e.g., Alice) from accessing sensitive data
 - Regular user endpoints remain accessible to all authenticated users
*/