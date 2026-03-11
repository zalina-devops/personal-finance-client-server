import React, { useState, useMemo } from "react";

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

  // Отфильтрованные транзакции
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

  // Сбрасываем страницу, если фильтр изменился и текущая страница стала недоступна
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  return (
    <div>
      {/* Фильтры */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Filter category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
        <button onClick={onResetFilters}>Reset</button>
      </div>

      {/* Таблица */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ background: "#f4f6f8" }}>
          <tr>
            <th style={{ padding: "8px" }}>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageTransactions.map((t) => (
            <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{t.type}</td>
              <td>${t.amount}</td>
              <td>{t.category}</td>
              <td>
                <button onClick={() => onEdit(t)}>✏️</button>
                <button
                  onClick={() => onDelete(t.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginLeft: "10px"
                  }}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "5px" }}>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? "bold" : "normal"
            }}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </div>
  );
};

export default TransactionTable;