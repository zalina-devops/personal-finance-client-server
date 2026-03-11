// src/pages/Dashboard/SummaryCards.jsx
import React from "react";

const SummaryCards = ({ balance, income, expense }) => (
  <div style={{ display: "flex", gap: "20px", marginTop: "20px", marginBottom: "20px" }}>
    <div style={cardStyle}>
      <h3>Balance</h3>
      <p style={numberStyle}>${balance}</p>
    </div>
    <div style={{ ...cardStyle, background: "#e8f8f1", color: "green" }}>
      <h3>Income</h3>
      <p style={{ ...numberStyle, color: "green" }}>${income}</p>
    </div>
    <div style={{ ...cardStyle, background: "#fdecea", color: "red" }}>
      <h3>Expense</h3>
      <p style={{ ...numberStyle, color: "red" }}>${expense}</p>
    </div>
  </div>
);

const cardStyle = {
  background: "#f4f6f8",
  padding: "20px",
  borderRadius: "10px",
  width: "150px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const numberStyle = {
  fontSize: "20px",
  fontWeight: "bold"
};

export default SummaryCards;