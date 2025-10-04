const { sql, poolPromise } = require("../config/db");

// GET all Purchase Orders
exports.getPurchaseOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        po.*, 
        v.Vendor_Name 
      FROM 
        PurchaseOrders po
      JOIN 
        Vendors v ON po.Vendor_ID = v.Vendor_ID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE Purchase Order
exports.createPurchaseOrder = async (req, res) => {
  try {
    const { Vendor_ID, PO_Date, Delivery_Date, Total_Value, GST_Rate, GST_Amount, HSN_Code } = req.body;
    const pool = await poolPromise;
    await pool.request()
       .input("Vendor_ID", sql.Int, Vendor_ID)
      .input("PO_Date", sql.Date, PO_Date)
      .input("Delivery_Date", sql.Date, Delivery_Date)
      .input("Total_Value", sql.Decimal(10, 2), Total_Value)
      .input("GST_Rate", sql.Decimal(5, 2), GST_Rate)
      .input("GST_Amount", sql.Decimal(10, 2), GST_Amount)
      .input("HSN_Code", sql.VarChar, HSN_Code || "")
      .query(`INSERT INTO PurchaseOrders (Vendor_ID, PO_Date, Delivery_Date, Total_Value, GST_Rate, GST_Amount, HSN_Code)
              VALUES (@Vendor_ID, @PO_Date, @Delivery_Date, @Total_Value, @GST_Rate, @GST_Amount, @HSN_Code)`);
    res.status(201).send("✅ Purchase Order created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE Purchase Order
exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { Vendor_ID, PO_Date, Delivery_Date, Total_Value, GST_Rate, GST_Amount, HSN_Code, PO_Status, Payment_Status } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input("PO_ID", sql.Int, id)
      .input("Vendor_ID", sql.Int, Vendor_ID)
      .input("PO_Date", sql.Date, PO_Date)
      .input("Delivery_Date", sql.Date, Delivery_Date)
      .input("Total_Value", sql.Decimal(10, 2), Total_Value)
      .input("GST_Rate", sql.Decimal(5, 2), GST_Rate)
      .input("GST_Amount", sql.Decimal(10, 2), GST_Amount)
      .input("HSN_Code", sql.VarChar, HSN_Code || "")
      .input("PO_Status", sql.VarChar, PO_Status || "Pending")
      .input("Payment_Status", sql.VarChar, Payment_Status || "Pending")
      .query(`UPDATE PurchaseOrders
              SET Vendor_ID=@Vendor_ID, PO_Date=@PO_Date, Delivery_Date=@Delivery_Date, Total_Value=@Total_Value,
                  GST_Rate=@GST_Rate, GST_Amount=@GST_Amount, HSN_Code=@HSN_Code, PO_Status=@PO_Status, Payment_Status=@Payment_Status
              WHERE PO_ID=@PO_ID`);
    res.send("✅ Purchase Order updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// DELETE Purchase Order
exports.deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input("PO_ID", sql.Int, id)
      .query("DELETE FROM PurchaseOrders WHERE PO_ID=@PO_ID");
    res.send("🗑️ Purchase Order deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
