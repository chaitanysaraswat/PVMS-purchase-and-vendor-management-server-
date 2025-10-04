const { sql, poolPromise } = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("Username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE Username=@Username");

    if (result.recordset.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.recordset[0];
    const valid = await bcrypt.compare(password, user.PasswordHash);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.User_ID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, role: user.Role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};