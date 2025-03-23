const express = require("express");
const app = express();
const port = 3000;

// Mock database
const users = [
  { id: 1, name: "Alice", role: "user" },
  { id: 2, name: "Bob", role: "admin" }
];

const records = [
  { id: 1, ownerId: 1, data: "Alice's private data" },
  { id: 2, ownerId: 2, data: "Bob's private data" }
];

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to simulate Alice as the logged-in user
app.use((req, res, next) => {
  // Simulate Alice (user ID 1) being logged in
  req.user = { id: 1, name: "Alice", role: "user" };
  next();
});

// Insecure endpoint: No authorization check
app.get("/records/:id", (req, res) => {
  const recordId = parseInt(req.params.id);
  const record = records.find(r => r.id === recordId);

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  // 🚨 Only the owner reaches this point
  res.json({
    loggedInUser: req.user.name, // Show who's logged in
    record: record
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/*
 🛑 ISSUE: Broken Object Level Authorization (BOLA)
 - Alice is logged in (ID 1), but she can access Bob's record (ID 2) by changing the URL
 - No check ensures the logged-in user owns the requested record
 - Unauthorized access to sensitive data is possible
*/