require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const vendorRoutes = require("./routes/vendorRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const goodsReceiptRoutes = require("./routes/goodsReceiptRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const gstRoutes = require("./routes/gstRoutes");

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/vendors", vendorRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/goods-receipts", goodsReceiptRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/gst", gstRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
