const pool = require('../config/db');

const createTransaction = async (userId, type, amount, category, description) => {
  const query = `
    INSERT INTO transactions (user_id, type, amount, category, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [userId, type, amount, category, description];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getUserTransactions = async (userId, filters) => {
  const { type, from, to, limit, offset } = filters;

  let query = `
    SELECT * FROM transactions
    WHERE user_id = $1
  `;

  const values = [userId];
  let paramIndex = 2;

  if (type) {
    query += ` AND type = $${paramIndex++}`;
    values.push(type);
  }

  if (from) {
    query += ` AND created_at >= $${paramIndex++}`;
    values.push(from);
  }

  if (to) {
    query += ` AND created_at <= $${paramIndex++}`;
    values.push(to);
  }

  query += `
    ORDER BY created_at DESC
    LIMIT $${paramIndex++}
    OFFSET $${paramIndex}
  `;

  values.push(limit);
  values.push(offset);

  const { rows } = await pool.query(query, values);
  return rows;
};

const countUserTransactions = async (userId, filters) => {
  const { type, from, to } = filters;

  let query = `
    SELECT COUNT(*) FROM transactions
    WHERE user_id = $1
  `;

  const values = [userId];
  let paramIndex = 2;

  if (type) {
    query += ` AND type = $${paramIndex++}`;
    values.push(type);
  }

  if (from) {
    query += ` AND created_at >= $${paramIndex++}`;
    values.push(from);
  }

  if (to) {
    query += ` AND created_at <= $${paramIndex++}`;
    values.push(to);
  }

  const { rows } = await pool.query(query, values);
  return parseInt(rows[0].count);
};

const deleteTransaction = async (userId, transactionId) => {
  const query = `
    DELETE FROM transactions
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [transactionId, userId]);
  return rows[0];
};

module.exports = {
  createTransaction,
  getUserTransactions,
  deleteTransaction,
};

const getBalanceSummary = async (userId) => {
  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses
    FROM transactions
    WHERE user_id = $1;
  `;

  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

module.exports = {
  createTransaction,
  getUserTransactions,
  deleteTransaction,
  getBalanceSummary,
  countUserTransactions,
};