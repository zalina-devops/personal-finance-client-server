import React from 'react';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const SummaryCards = ({ transactions, balance, income, expense }) => {
  let totalIncome = income;
  let totalExpense = expense;
  let totalBalance = balance;

  // Если передан массив транзакций — используем его для расчётов
  if (transactions && Array.isArray(transactions)) {
    totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    totalBalance = totalIncome - totalExpense;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
      {/* Balance Card */}
      <div className="summary-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="summary-card balance">
          <FaWallet size={24} />
          <h3>Balance</h3>
          <p className="amount">${totalBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Income Card */}
      <div className="summary-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
        <div className="summary-card income">
          <FaArrowUp size={24} />
          <h3>Income</h3>
          <p className="amount">${totalIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Expense Card */}
      <div className="summary-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
        <div className="summary-card expense">
          <FaArrowDown size={24} />
          <h3>Expense</h3>
          <p className="amount">${totalExpense.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;