const { sql, poolPromise } = require("../config/db");

// =============================
// GET all Goods Receipts
// =============================
exports.getGoodsReceipts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        gr.GR_ID,
        gr.PO_ID,
        gr.GR_Date,
        gr.Quantity_Received,
        gr.Quantity_Ordered,
        gr.GST_Amount,
        gr.HSN_Code,
        po.PO_ID AS PO_Number,
        v.Vendor_Name,
        v.Vendor_ID
      FROM GoodsReceipts gr
      JOIN PurchaseOrders po ON gr.PO_ID = po.PO_ID
      JOIN Vendors v ON po.Vendor_ID = v.Vendor_ID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// =============================
// CREATE Goods Receipt
// =============================
exports.createGoodsReceipt = async (req, res) => {
  try {
    const { PO_ID, GR_Date, Quantity_Received, Quantity_Ordered, GST_Amount, HSN_Code } = req.body;
    const pool = await poolPromise;

    // 🔹 Fetch Vendor_ID automatically from the PurchaseOrder
    const poRes = await pool.request()
      .input("PO_ID", sql.Int, PO_ID)
      .query("SELECT Vendor_ID FROM PurchaseOrders WHERE PO_ID=@PO_ID");

    if (poRes.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid PO_ID - Purchase Order not found" });
    }

    const Vendor_ID = poRes.recordset[0].Vendor_ID;

    await pool.request()
      .input("PO_ID", sql.Int, PO_ID)
      .input("Vendor_ID", sql.Int, Vendor_ID)
      .input("GR_Date", sql.Date, GR_Date)
      .input("Quantity_Received", sql.Int, Quantity_Received)
      .input("Quantity_Ordered", sql.Int, Quantity_Ordered)
      .input("GST_Amount", sql.Decimal(10, 2), GST_Amount)
      .input("HSN_Code", sql.VarChar, HSN_Code || "")
      .query(`
        INSERT INTO GoodsReceipts (PO_ID, Vendor_ID, GR_Date, Quantity_Received, Quantity_Ordered, GST_Amount, HSN_Code)
        VALUES (@PO_ID, @Vendor_ID, @GR_Date, @Quantity_Received, @Quantity_Ordered, @GST_Amount, @HSN_Code)
      `);

    res.status(201).send("✅ Goods Receipt created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// =============================
// UPDATE Goods Receipt
// =============================
exports.updateGoodsReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { PO_ID, GR_Date, Quantity_Received, Quantity_Ordered, GST_Amount, HSN_Code } = req.body;
    const pool = await poolPromise;

    // fetch Vendor_ID again from PO
    const poRes = await pool.request()
      .input("PO_ID", sql.Int, PO_ID)
      .query("SELECT Vendor_ID FROM PurchaseOrders WHERE PO_ID=@PO_ID");

    if (poRes.recordset.length === 0) {
      return res.status(400).json({ error: "Invalid PO_ID - Purchase Order not found" });
    }

    const Vendor_ID = poRes.recordset[0].Vendor_ID;

    await pool.request()
      .input("GR_ID", sql.Int, id)
      .input("PO_ID", sql.Int, PO_ID)
      .input("Vendor_ID", sql.Int, Vendor_ID)
      .input("GR_Date", sql.Date, GR_Date)
      .input("Quantity_Received", sql.Int, Quantity_Received)
      .input("Quantity_Ordered", sql.Int, Quantity_Ordered)
      .input("GST_Amount", sql.Decimal(10, 2), GST_Amount)
      .input("HSN_Code", sql.VarChar, HSN_Code || "")
      .query(`
        UPDATE GoodsReceipts 
        SET PO_ID=@PO_ID, Vendor_ID=@Vendor_ID, GR_Date=@GR_Date, Quantity_Received=@Quantity_Received, 
            Quantity_Ordered=@Quantity_Ordered, GST_Amount=@GST_Amount, HSN_Code=@HSN_Code
        WHERE GR_ID=@GR_ID
      `);

    res.send("✅ Goods Receipt updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// =============================
// DELETE Goods Receipt
// =============================
exports.deleteGoodsReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input("GR_ID", sql.Int, id)
      .query("DELETE FROM GoodsReceipts WHERE GR_ID=@GR_ID");
    res.send("🗑️ Goods Receipt deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
