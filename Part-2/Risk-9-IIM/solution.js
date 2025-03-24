const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Current version (v2) - Properly secured
app.get('/api/v2/users', (req, res) => {
  // Simulating proper authentication check
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  // Return only safe data
  res.json({ users: ['user1', 'user2'] });
});

// Fix: Removed the old vulnerable endpoint (/api/v1/users)
// No longer accessible, preventing exposure of sensitive data

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Documented endpoint: GET /api/v2/users');
});

/* ✅ FIXED: Improper Assets Management
  - Removed the old, vulnerable /api/v1/users endpoint.
  - Only the secure /api/v2/users endpoint remains, requiring authentication.
  - No sensitive data (e.g., passwords, emails) is exposed.
*/