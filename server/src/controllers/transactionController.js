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

    const { type, category, search, from, to } = req.query;

    let query = `SELECT * FROM transactions WHERE user_id = $1`;
    const params = [userId];

    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND category ILIKE $${params.length}`;
    }

    if (from && to) {
      params.push(from);
      params.push(to);
      query += ` AND created_at BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

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

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};