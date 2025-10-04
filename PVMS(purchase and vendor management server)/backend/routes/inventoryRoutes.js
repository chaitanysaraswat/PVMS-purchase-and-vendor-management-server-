const express = require("express");
const { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require("../controllers/inventoryController");
const router = express.Router();

router.get("/", getInventory);
router.post("/", createInventoryItem);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

module.exports = router;
