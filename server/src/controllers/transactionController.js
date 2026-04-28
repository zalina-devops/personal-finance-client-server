const pool = require("../config/db");

exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category } = req.body;
    const userId = req.user.userId;

    // === ВАЛИДАЦИЯ ===
    if (!type || !['expense', 'income'].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type. Must be 'expense' or 'income'" });
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({ message: "Category is required and cannot be empty" });
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, amount, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, type, amount, category.trim()]
    );

    res.status(201).json(result.rows[0]);   // ← 201 Created
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
      params.push(from, to);
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

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category } = req.body;
    const userId = req.user.userId;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    // Простая валидация (можно усилить)
    if (type && !['expense', 'income'].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }
    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }
    if (category !== undefined && (!category || category.trim() === '')) {
      return res.status(400).json({ message: "Category cannot be empty" });
    }

    const result = await pool.query(
      `UPDATE transactions
       SET type = COALESCE($1, type),
           amount = COALESCE($2, amount),
           category = COALESCE($3, category)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [type, amount, category ? category.trim() : null, Number(id), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found or not owned by user" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await pool.query(
      `DELETE FROM transactions 
       WHERE id = $1 AND user_id = $2 
       RETURNING id`,
      [Number(id), userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found or not owned by user" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};