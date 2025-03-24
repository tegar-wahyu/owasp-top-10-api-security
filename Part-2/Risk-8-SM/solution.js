const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Fix 1: Configure CORS with specific, trusted origins
const corsOptions = {
  origin: 'http://trusted-domain.com', // Replace with your actual domain
  methods: ['GET', 'POST'], // Restrict allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Restrict headers
};
app.use(cors(corsOptions));

// Fix 2: Remove or obscure server information headers
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By'); // Remove default Express header
  res.setHeader('Server', 'WebServer'); // Generic server name
  next();
});

// Simulated database
const users = [
  { id: 1, username: 'admin', password: 'admin123', isAdmin: true },
  { id: 2, username: 'user', password: 'password123', isAdmin: false }
];

// Fix 3: Remove debug endpoint (commented out or conditional)
// Only enable in development, not production
if (process.env.NODE_ENV === 'development') {
  app.get('/debug/users', (req, res) => {
    res.json(users);
  });
}

// Fix 4 Generic error handling, no sensitive info exposed
app.get('/api/user/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    // Generic error message
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: user.id, username: user.username }); // Only safe data
});

// Global error handler to catch unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack); // Log internally for debugging
  res.status(500).json({ error: 'Something went wrong' }); // Generic response
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* ✅ FIXED: Security Misconfigurations
- CORS: Restricted to specific origins, methods, and headers.
- Server Info: Removed 'X-Powered-By' and used a generic 'Server' value.
- Debug Endpoint: Disabled in production (only active in development).
- Error Messages: Generic responses, no system details exposed.
*/