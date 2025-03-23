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

// Vulnerable purchase endpoint: No access controls or rate limiting
app.post("/api/purchase", (req, res) => {
  const { itemId, quantity } = req.body;

  // 🚨 No validation: Accepts any itemId and quantity
  if (!itemId || !quantity) {
    return res.status(400).json({ error: "itemId and quantity are required" });
  }

  const item = inventory[itemId];
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  // 🚨 No stock check or user-specific limits: Allows unlimited purchases
  item.stock -= quantity; // Stock can go negative!

  res.json({
    message: "Purchase successful",
    item: item.name,
    quantity: quantity,
    totalCost: (quantity * item.price).toFixed(2),
    remainingStock: item.stock
  });
});

// Vulnerable inventory check endpoint: Exposes stock levels to anyone
app.get("/api/inventory", (req, res) => {
  // 🚨 No restrictions: Anyone can see the full inventory
  res.json({
    message: "Current inventory",
    inventory: inventory
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/* ❌ SIMULATED API6:2023 - Unrestricted Access to Sensitive Business Flows
 - /api/purchase allows anyone to buy items without authentication or rate limiting
 - No stock validation: Stock can go negative, enabling over-purchasing
 - No user-specific limits: Bots could buy out inventory instantly
 - /api/inventory exposes stock levels to anyone, aiding attackers in targeting low-stock items
*/