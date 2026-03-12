// src/pages/Dashboard/ExpensePieChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ExpensePieChart = ({ chartData }) => (
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

export default ExpensePieChart;