const express = require("express");
const { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } = require("../controllers/purchaseOrderController");
const router = express.Router();

router.get("/", getPurchaseOrders);
router.post("/", createPurchaseOrder);
router.put("/:id", updatePurchaseOrder);
router.delete("/:id", deletePurchaseOrder);

module.exports = router;
