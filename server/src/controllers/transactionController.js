const transactionService = require('../services/transactionService');

const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    const transaction = await transactionService.create(userId, req.body);

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await transactionService.getAll(userId, req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await transactionService.remove(userId, id);

    res.json({ message: 'Transaction deleted', deleted });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
};

const getBalance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const balance = await transactionService.getBalance(userId);

    res.json(balance);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getBalance,
};