const { sql, poolPromise } = require("../config/db");

// GET GST Summary for all vendors
exports.getGSTSummary = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM GSTSummary");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET GST Summary for specific vendor
exports.getVendorGST = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("Vendor_ID", sql.Int, vendor_id)
      .query("SELECT * FROM GSTSummary WHERE Vendor_ID = @Vendor_ID");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
