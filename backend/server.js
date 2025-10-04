require("dotenv").config();
const express = require("express");
const path = require("path");

const vendorRoutes = require("./routes/vendorRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const goodsReceiptRoutes = require("./routes/goodsReceiptRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const gstRoutes = require("./routes/gstRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // ✅ added

const cors = require("cors");
const app = express();
app.use(cors());
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json()); // ✅ replaces bodyParser.json()

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/vendors", vendorRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/goods-receipts", goodsReceiptRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/gst", gstRoutes);
app.use("/api/dashboard", dashboardRoutes); // ✅ added

// Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
