const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

// SAFE: Validates and sanitizes external API data
app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  // Fix 1: Validate input
  if (!/^\d+$/.test(postId) || parseInt(postId) < 1 || parseInt(postId) > 100) {
    return res.status(400).json({ error: 'Invalid post ID. Must be a number between 1 and 100' });
  }

  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    const externalData = response.data;

    // Fix 2: Sanitize and filter response data
    const safeData = {
      id: externalData.id,
      title: externalData.title,
      body: externalData.body
    };

    // Ensure all expected fields are present and safe
    if (!safeData.id || !safeData.title || !safeData.body) {
      throw new Error('Incomplete data from external API');
    }

    res.json(safeData);
  } catch (error) {
    // Fix 3: Generic error handling, no details exposed
    console.error('Error fetching post:', error.message); // Log internally
    res.status(500).json({ error: 'Unable to fetch post' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* ✅ FIXED: Unsafe Consumption of APIs
- Input Validation: Ensures post ID is a valid number within expected range.
- Data Sanitization: Only forwards specific, safe fields from the external API.
- Error Handling: Generic response, no sensitive error details exposed.
*/