import React, { useState, useMemo, useEffect } from "react";

const TransactionTable = ({
  transactions,
  onEdit,
  onDelete,
  search,
  setSearch,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  onResetFilters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType ? t.type === filterType : true;
      const matchesCategory = filterCategory ? t.category.toLowerCase().includes(filterCategory.toLowerCase()) : true;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, filterType, filterCategory]);

  const totalPages = Math.ceil(filteredTransactions.length / limit);
  const pageTransactions = filteredTransactions.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  return (
    <div className="transactions-container">
      {/* Фильтры */}
      <div className="filters-bar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="form-select">
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Filter category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-input"
        />
        <button onClick={onResetFilters} className="btn btn-outline">Reset</button>
      </div>

      <div className="transactions-table-wrapper" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
          <thead>
            <tr style={{ background: 'transparent' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500 }}>Amount</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '2rem', display: 'block' }}>📭</span>
                  {transactions.length === 0 ? 'Нет транзакций. Добавьте первую!' : 'Ничего не найдено по фильтру'}
                </td>
              </tr>
            ) : (
              pageTransactions.map((t) => (
                <tr key={t.id} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge ${t.type}`}>{t.type}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: t.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    ${t.amount}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>{t.category}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button onClick={() => onEdit(t)} className="icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '0.5rem' }}>
                      ✏️
                    </button>
                    <button onClick={() => onDelete(t.id)} className="icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {filteredTransactions.length > 0 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginTop: '2rem' }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="btn btn-outline" disabled={currentPage === 1}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
              style={{ minWidth: '2.5rem' }}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="btn btn-outline" disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;