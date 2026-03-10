const pool = require("../config/db");

exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, type, amount, category]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id=$1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM transactions WHERE id=$1",
      [id]
    );

    res.json({ message: "Transaction deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category } = req.body;

    const result = await pool.query(
      `UPDATE transactions
       SET type=$1, amount=$2, category=$3
       WHERE id=$4 AND user_id=$5
       RETURNING *`,
      [type, amount, category, id, req.user.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};