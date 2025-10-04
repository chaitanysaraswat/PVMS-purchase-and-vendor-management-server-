const express = require("express");
const { getVendors, addVendor, updateVendor, deleteVendor } = require("../controllers/vendorController");
const router = express.Router();

router.get("/", getVendors);
router.post("/", addVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);

module.exports = router;
