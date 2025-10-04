const { sql, poolPromise } = require("../config/db");

// GET all Purchase Orders
exports.getPurchaseOrders = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        po.PO_ID,
        po.Vendor_ID,
        po.PO_Date,
        po.Delivery_Date,
        po.PO_Status,
        po.Total_Value,
        po.Payment_Status,
        po.GST_Rate,
        po.GST_Amount,
        po.HSN_Code,
        v.Vendor_Name
      FROM PurchaseOrders po
      JOIN Vendors v ON po.Vendor_ID = v.Vendor_ID
      ORDER BY po.PO_ID ASC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching purchase orders:", err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE Purchase Order
exports.createPurchaseOrder = async (req, res) => {
  try {
    let {
      Vendor_ID,
      PO_Date,
      Delivery_Date,
      Total_Value,
      GST_Rate = 0,
      GST_Amount = 0,
      HSN_Code = null,
      PO_Status = "Pending",
      Payment_Status = "Pending",
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("Vendor_ID", sql.Int, Vendor_ID)
      .input("PO_Date", sql.Date, PO_Date)
      .input("Delivery_Date", sql.Date, Delivery_Date || null)
      .input("Total_Value", sql.Decimal(10, 2), parseFloat(Total_Value))
      .input("GST_Rate", sql.Decimal(5, 2), parseFloat(GST_Rate))
      .input("GST_Amount", sql.Decimal(10, 2), parseFloat(GST_Amount))
      .input("HSN_Code", sql.VarChar, HSN_Code || null)
      .input("PO_Status", sql.VarChar, PO_Status)
      .input("Payment_Status", sql.VarChar, Payment_Status)
      .query(`
        INSERT INTO PurchaseOrders 
        (Vendor_ID, PO_Date, Delivery_Date, Total_Value, GST_Rate, GST_Amount, HSN_Code, PO_Status, Payment_Status)
        VALUES (@Vendor_ID, @PO_Date, @Delivery_Date, @Total_Value, @GST_Rate, @GST_Amount, @HSN_Code, @PO_Status, @Payment_Status)
      `);

    res.status(201).json({ message: "✅ Purchase Order created successfully" });
  } catch (err) {
    console.error("❌ Error creating purchase order:", err);
    res.status(500).json({ error: err.message });
  }
};

// =============================
// UPDATE Purchase Order
// =============================
exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      Vendor_ID,
      PO_Date,
      Delivery_Date,
      Total_Value,
      GST_Rate = 0,
      GST_Amount = 0,
      HSN_Code = null,
      PO_Status = "Pending",
      Payment_Status = "Pending",
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("PO_ID", sql.Int, id)
      .input("Vendor_ID", sql.Int, Vendor_ID)
      .input("PO_Date", sql.Date, PO_Date)
      .input("Delivery_Date", sql.Date, Delivery_Date || null)
      .input("Total_Value", sql.Decimal(10, 2), parseFloat(Total_Value))
      .input("GST_Rate", sql.Decimal(5, 2), parseFloat(GST_Rate))
      .input("GST_Amount", sql.Decimal(10, 2), parseFloat(GST_Amount))
      .input("HSN_Code", sql.VarChar, HSN_Code || null)
      .input("PO_Status", sql.VarChar, PO_Status)
      .input("Payment_Status", sql.VarChar, Payment_Status)
      .query(`
        UPDATE PurchaseOrders
        SET Vendor_ID=@Vendor_ID, PO_Date=@PO_Date, Delivery_Date=@Delivery_Date, Total_Value=@Total_Value,
            GST_Rate=@GST_Rate, GST_Amount=@GST_Amount, HSN_Code=@HSN_Code, PO_Status=@PO_Status, Payment_Status=@Payment_Status,
            ModifiedBy = SYSTEM_USER, ModifiedAt = GETDATE()
        WHERE PO_ID=@PO_ID
      `);

    res.json({ message: "✅ Purchase Order updated successfully" });
  } catch (err) {
    console.error("❌ Error updating purchase order:", err);
    res.status(500).json({ error: err.message });
  }
};

// =============================
// DELETE Purchase Order
// =============================
exports.deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input("PO_ID", sql.Int, id)
      .query("DELETE FROM PurchaseOrders WHERE PO_ID=@PO_ID");

    res.json({ message: "🗑️ Purchase Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting purchase order:", err);
    res.status(500).json({ error: err.message });
  }
};
