// src/pages/Dashboard/MonthlyChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const MonthlyChart = ({ monthlyData }) => (
  <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
    <LineChart width={500} height={300} data={monthlyData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="amount" stroke="#ff6b6b" strokeWidth={3} />
    </LineChart>
  </div>
);

export default MonthlyChart;