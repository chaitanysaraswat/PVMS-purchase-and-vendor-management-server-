const express = require("express");
const { getGoodsReceipts, createGoodsReceipt, updateGoodsReceipt, deleteGoodsReceipt } = require("../controllers/goodsReceiptController");
const router = express.Router();

router.get("/", getGoodsReceipts);
router.post("/", createGoodsReceipt);
router.put("/:id", updateGoodsReceipt);
router.delete("/:id", deleteGoodsReceipt);

module.exports = router;
