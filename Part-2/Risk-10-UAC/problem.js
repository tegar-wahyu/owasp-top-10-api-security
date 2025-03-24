const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// UNSAFE: Blindly trusts and forwards external API data
app.get('/posts/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`);
        res.json(response.data);  // Directly forwarding without validation
    } catch (error) {
        res.status(500).send(error);  // Exposing error details
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

/* 🛑ISSUE: Unsafe Consumption of API
- The /unsafe/posts/:id endpoint blindly trusts and forwards data from an external API without validation.
- This can lead to security vulnerabilities, such as exposing sensitive data or allowing injection attacks.
*/