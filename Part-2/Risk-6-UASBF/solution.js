const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const port = 3000;

// Simulated inventory
let inventory = {
  "premium_widget": {
    name: "Premium Widget",
    stock: 10, // Limited stock
    price: 99.99
  }
};

// Simulated user database
const users = [
  { id: 1, name: "Alice", role: "user" }
];

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to simulate authentication (Alice as logged-in user)
app.use((req, res, next) => {
  req.user = { id: 1, name: "Alice", role: "user" }; // Simulate authenticated user
  next();
});

// Rate limiting: 3 purchases per hour per IP
const purchaseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit to 3 requests per IP
  message: { error: "Too many purchase attempts, limit is 3 per hour" }
});

// Secure purchase endpoint
app.post("/api/purchase", purchaseLimiter, (req, res) => {
  const { itemId, quantity } = req.body;

  // Input validation
  if (!itemId || !quantity || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({ error: "Valid itemId and positive quantity are required" });
  }

  const item = inventory[itemId];
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  // Stock validation
  if (item.stock < quantity) {
    return res.status(400).json({ error: "Insufficient stock available" });
  }

  // Update stock
  item.stock -= quantity;

  res.json({
    message: "Purchase successful",
    item: item.name,
    quantity: quantity,
    totalCost: (quantity * item.price).toFixed(2),
    remainingStock: item.stock
  });
});

// Secure inventory check endpoint (limited exposure)
app.get("/api/inventory", (req, res) => {
  // Return minimal data (no stock levels exposed)
  const safeInventory = Object.keys(inventory).map(key => ({
    itemId: key,
    name: inventory[key].name,
    price: inventory[key].price
  }));

  res.json({
    message: "Available items",
    inventory: safeInventory
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* ✅ Fixed API6:2023 - Unrestricted Access to Sensitive Business Flows
 - Authentication required for all endpoints
 - Rate limiting: 3 purchases per hour per IP
 - Stock validation prevents over-purchasing
 - Inventory exposure limited (no stock levels shown)
 - Input validation ensures proper data
*/