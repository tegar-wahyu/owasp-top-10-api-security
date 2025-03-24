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
    res.json({ users: ['user1', 'user2'] });
});

// Old version (v1) - Vulnerable
app.get('/api/v1/users', (req, res) => {
    // No authentication check
    // Exposing sensitive information
    const sensitiveData = {
        users: [
            { username: 'admin', password: 'admin123', email: 'admin@company.com' },
            { username: 'user', password: 'pass123', email: 'user@company.com' }
        ]
    };
    res.json(sensitiveData);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Documented endpoint: GET /api/v2/users');
    console.log('Old endpoint still accessible: GET /api/v1/users');
});

/* 🛑 ISSUE: Improper Inventory Management
    - The old version of the API (v1) is still accessible and exposes sensitive user information.
    - This can lead to data leakage and unauthorized access to sensitive information.
 */