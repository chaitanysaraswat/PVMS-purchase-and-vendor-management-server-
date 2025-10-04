const express = require("express");
const router = express.Router();
const controller = require("../controllers/gstController");

router.get("/", controller.getGSTSummary);
router.get("/:vendor_id", controller.getVendorGST);

module.exports = router;
