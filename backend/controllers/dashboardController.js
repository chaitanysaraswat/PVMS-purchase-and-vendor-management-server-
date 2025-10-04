const { sql, poolPromise } = require("../config/db");

// GET dashboard stats (totals)
exports.getStats = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        (SELECT COUNT(*) FROM Vendors) AS totalVendors,
        (SELECT COUNT(*) FROM PurchaseOrders WHERE PO_Status='Pending') AS activePOs,
        (SELECT COUNT(*) FROM Inventory) AS totalInventoryItems,
        (SELECT COUNT(*) FROM GoodsReceipts WHERE GR_Status='Pending') AS pendingGRs
    `);

    res.json(result.recordset[0]); // send single stats object
  } catch (err) {
    res.status(500).send(err.message);
  }
};
