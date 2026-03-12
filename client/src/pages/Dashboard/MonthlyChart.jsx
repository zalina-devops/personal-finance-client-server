// src/pages/Dashboard/MonthlyChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const MonthlyChart = ({ monthlyData }) => (
  <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
	<LineChart width={500} height={300} data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
	  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
	  <YAxis tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
	  <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)' }} />
	  <Line type="monotone" dataKey="amount" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-blue)' }} activeDot={{ r: 6 }} />
	</LineChart>
  </div>
);

export default MonthlyChart;