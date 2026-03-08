const transactionModel = require('../models/transactionModel');

const create = async (userId, data) => {
  const { type, amount, category, description } = data;

  if (!['income', 'expense'].includes(type)) {
    throw new Error('Type must be income or expense');
  }

  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  return await transactionModel.createTransaction(
    userId,
    type,
    amount,
    category,
    description
  );
};

const getAll = async (userId, queryParams) => {
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 5;
  const offset = (page - 1) * limit;

  const filters = {
    type: queryParams.type,
    from: queryParams.from,
    to: queryParams.to,
    limit,
    offset,
  };

  const transactions = await transactionModel.getUserTransactions(userId, filters);
  const total = await transactionModel.countUserTransactions(userId, filters);

  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    data: transactions,
  };
};

const remove = async (userId, transactionId) => {
  const deleted = await transactionModel.deleteTransaction(userId, transactionId);

  if (!deleted) {
    throw new Error('Transaction not found');
  }

  return deleted;
};

module.exports = {
  create,
  getAll,
  remove,
};

const getBalance = async (userId) => {
  const summary = await transactionModel.getBalanceSummary(userId);

  const income = parseFloat(summary.income);
  const expenses = parseFloat(summary.expenses);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};

module.exports = {
  create,
  getAll,
  remove,
  getBalance,
};