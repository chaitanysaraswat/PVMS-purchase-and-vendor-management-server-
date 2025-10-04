const { sql, poolPromise } = require("../config/db");

// =============================
// GET all Vendors
// =============================
exports.getVendors = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        Vendor_ID,
        Vendor_Name,
        Address,
        Phone,
        Email,
        GSTIN,
        Payment_Terms,
        Credit_Limit,
        Status,
        CreatedBy,
        CreatedAt,
        ModifiedBy,
        ModifiedAt
      FROM Vendors
      ORDER BY Vendor_ID ASC
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching vendors:", err);
    res.status(500).json({ error: err.message });
  }
};

// =============================
// CREATE Vendor
// =============================
exports.createVendor = async (req, res) => {
  try {
    const {
      Vendor_Name,
      Address,
      Phone,
      Email,
      GSTIN,
      Payment_Terms,
      Credit_Limit,
      Status = "Active",
      CreatedBy = "system" // you can later replace with logged-in user
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("Vendor_Name", sql.VarChar, Vendor_Name)
      .input("Address", sql.VarChar, Address || "")
      .input("Phone", sql.VarChar, Phone || "")
      .input("Email", sql.VarChar, Email || "")
      .input("GSTIN", sql.VarChar, GSTIN || "")
      .input("Payment_Terms", sql.VarChar, Payment_Terms || "")
      .input("Credit_Limit", sql.Decimal(10,2), Credit_Limit || 0)
      .input("Status", sql.VarChar, Status)
      .input("CreatedBy", sql.VarChar, CreatedBy)
      .query(`
        INSERT INTO Vendors 
        (Vendor_Name, Address, Phone, Email, GSTIN, Payment_Terms, Credit_Limit, Status, CreatedBy, CreatedAt)
        VALUES (@Vendor_Name, @Address, @Phone, @Email, @GSTIN, @Payment_Terms, @Credit_Limit, @Status, @CreatedBy, GETDATE())
      `);

    res.status(201).json({ message: "✅ Vendor created successfully" });
  } catch (err) {
    console.error("❌ Error creating vendor:", err);
    res.status(500).json({ error: err.message });
  }
};

// =============================
// UPDATE Vendor
// =============================
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Vendor_Name,
      Address,
      Phone,
      Email,
      GSTIN,
      Payment_Terms,
      Credit_Limit,
      Status,
      ModifiedBy = "system"
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("Vendor_ID", sql.Int, id)
      .input("Vendor_Name", sql.VarChar, Vendor_Name)
      .input("Address", sql.VarChar, Address || "")
      .input("Phone", sql.VarChar, Phone || "")
      .input("Email", sql.VarChar, Email || "")
      .input("GSTIN", sql.VarChar, GSTIN || "")
      .input("Payment_Terms", sql.VarChar, Payment_Terms || "")
      .input("Credit_Limit", sql.Decimal(10,2), Credit_Limit || 0)
      .input("Status", sql.VarChar, Status)
      .input("ModifiedBy", sql.VarChar, ModifiedBy)
      .query(`
        UPDATE Vendors
        SET Vendor_Name=@Vendor_Name,
            Address=@Address,
            Phone=@Phone,
            Email=@Email,
            GSTIN=@GSTIN,
            Payment_Terms=@Payment_Terms,
            Credit_Limit=@Credit_Limit,
            Status=@Status,
            ModifiedBy=@ModifiedBy,
            ModifiedAt=GETDATE()
        WHERE Vendor_ID=@Vendor_ID
      `);

    res.json({ message: "✅ Vendor updated successfully" });
  } catch (err) {
    console.error("❌ Error updating vendor:", err);
    res.status(500).json({ error: err.message });
  }
};

// =============================
// DELETE Vendor
// =============================
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool.request()
      .input("Vendor_ID", sql.Int, id)
      .query("DELETE FROM Vendors WHERE Vendor_ID=@Vendor_ID");

    res.json({ message: "🗑️ Vendor deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting vendor:", err);
    res.status(500).json({ error: err.message });
  }
};