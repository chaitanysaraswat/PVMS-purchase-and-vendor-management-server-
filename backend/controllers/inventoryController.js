const { sql, poolPromise } = require("../config/db");

// GET inventory
exports.getInventory = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Inventory");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// CREATE item
exports.createInventoryItem = async (req, res) => {
  try {
    const { Item_Name, Stock_Quantity, Reorder_Level, Supplier_ID, Unit_Price, HSN_Code } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input("Item_Name", sql.VarChar, Item_Name)
      .input("Stock_Quantity", sql.Int, Stock_Quantity)
      .input("Reorder_Level", sql.Int, Reorder_Level)
      .input("Supplier_ID", sql.Int, Supplier_ID)
      .input("Unit_Price", sql.Decimal(10, 2), Unit_Price)
      .input("HSN_Code", sql.VarChar, HSN_Code || "")
      .query(`INSERT INTO Inventory (Item_Name, Stock_Quantity, Reorder_Level, Supplier_ID, Unit_Price, HSN_Code)
              VALUES (@Item_Name, @Stock_Quantity, @Reorder_Level, @Supplier_ID, @Unit_Price, @HSN_Code)`);
    res.status(201).send("✅ Inventory Item created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// UPDATE item
exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { Item_Name, Stock_Quantity, Reorder_Level, Supplier_ID, Unit_Price, HSN_Code } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input("Item_ID", sql.Int, id)
      .input("Item_Name", sql.VarChar, Item_Name)
      .input("Stock_Quantity", sql.Int, Stock_Quantity)
      .input("Reorder_Level", sql.Int, Reorder_Level)
      .input("Supplier_ID", sql.Int, Supplier_ID)
      .input("Unit_Price", sql.Decimal(10, 2), Unit_Price)
      .input("HSN_Code", sql.VarChar, HSN_Code || "")
      .query(`UPDATE Inventory
              SET Item_Name=@Item_Name, Stock_Quantity=@Stock_Quantity, Reorder_Level=@Reorder_Level,
                  Supplier_ID=@Supplier_ID, Unit_Price=@Unit_Price, HSN_Code=@HSN_Code
              WHERE Item_ID=@Item_ID`);
    res.send("✅ Inventory Item updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// DELETE item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input("Item_ID", sql.Int, id)
      .query("DELETE FROM Inventory WHERE Item_ID=@Item_ID");
    res.send("🗑️ Inventory Item deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
