// src/pages/Dashboard/ExpensePieChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ExpensePieChart = ({ chartData }) => {
  // Если данных нет, показываем заглушку
  if (!chartData || chartData.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '300px',
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-secondary)',
        fontSize: '1rem'
      }}>
        <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍃</span>
        <p>Нет расходов за период</p>
        <p style={{ fontSize: '0.875rem' }}>Добавьте первую транзакцию</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ExpensePieChart;