import React from 'react';
import { FaWallet, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const SummaryCards = ({ balance, income, expense }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
    <div className="summary-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
      <div className="summary-card balance">
	    <FaWallet size={24} />
        <h3>Balance</h3>
        <p className="amount">${balance}</p>
	  </div>
    </div>
    <div className="summary-card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
      <div className="summary-card income">
	    <FaArrowUp size={24} />
        <h3>Income</h3>
        <p className="amount">${income}</p>
	  </div>
    </div>
    <div className="summary-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
      <div className="summary-card expense">
	    <FaArrowDown size={24} />
        <h3>Expense</h3>
        <p className="amount">${expense}</p>
	  </div>
    </div>
  </div>
);

export default SummaryCards;