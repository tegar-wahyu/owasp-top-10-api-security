const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Misconfiguration 1: Allowing all origins in CORS
app.use(cors());

// Misconfiguration 2: Exposing server information
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Express 4.17.1');
    res.setHeader('Server', 'Apache/2.4.1');
    next();
});

// Simulated database
const users = [
    { id: 1, username: 'admin', password: 'admin123', isAdmin: true },
    { id: 2, username: 'user', password: 'password123', isAdmin: false }
];

// Misconfiguration 3: Debug endpoint left enabled in production
app.get('/debug/users', (req, res) => {
    res.json(users);
});

// Misconfiguration 4: Detailed error messages exposing system information
app.get('/api/user/:id', (req, res) => {
    try {
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (!user) {
            throw new Error(`User not found in database: ${process.env.DB_NAME}`);
        }
        res.json(user);
    } catch (error) {
        // Exposing detailed error information
        res.status(500).json({
            error: error.message,
            stack: error.stack,
            serverInfo: {
                nodeVersion: process.version,
                environment: process.env.NODE_ENV,
                serverPath: __dirname
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

/* 🛑 ISSUES: Security Misconfigurations
- CORS Misconfiguration: Allowing all origins can lead to Cross-Origin Resource Sharing vulnerabilities.
- Exposing Server Information: Including headers like 'X-Powered-By' and 'Server' can give attackers information about the server.
- Debug Endpoint: Leaving debug endpoints enabled in production can expose sensitive information.
- Detailed Error Messages: Exposing detailed error messages can give attackers insights into the server's internal workings.
*/