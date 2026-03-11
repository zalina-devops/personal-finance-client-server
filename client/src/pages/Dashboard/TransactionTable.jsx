// src/pages/Dashboard/TransactionTable.jsx
import React from "react";

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
}) => (
  <div>
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
        {transactions.map((t) => (
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
  </div>
);

export default TransactionTable;