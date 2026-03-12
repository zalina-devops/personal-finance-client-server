import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

import SummaryCards from "./Dashboard/SummaryCards";
import ExpensePieChart from "./Dashboard/ExpensePieChart";
import MonthlyChart from "./Dashboard/MonthlyChart";
import TransactionTable from "./Dashboard/TransactionTable";
import { mockTransactions } from '../api/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => { getProfile().then(data => setUser(data.user)).catch(() => alert("Not authorized")); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions", { params: { search, type: filterType, category: filterCategory } });
      setTransactions(res.data);
    } catch (err) { console.error(err); }
  };

  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

	// Внутри компонента, в функции fetchTransactions (или в useEffect) делаем:
	useEffect(() => {
	  if (useMock) {
		setTransactions(mockTransactions);
	  } else {
		fetchTransactions();
	  }
	}, [search, filterType, filterCategory]); // зависимости для реального API, для моков они не нужны — можно оставить пустой массив, но тогда моки не будут обновляться при изменении фильтров. Чтобы фильтры работали с моками, нужно либо вызывать setTransactions(mockTransactions) при изменении фильтров, либо реализовать фильтрацию на клиенте. Лучше оставить так, как есть — в демо пусть фильтры работают, но для этого нужно фильтровать моки.

	// Для демо можно просто загрузить моки один раз и дальше фильтровать на клиенте через фильтры, которые уже есть в TransactionTable. Для этого достаточно один раз установить transactions = mockTransactions, а таблица сама отфильтрует по search и filterType, filterCategory. То есть никакой дополнительной логики не нужно.

	useEffect(() => {
	  if (useMock) {
		setTransactions(mockTransactions);
	  } else {
		fetchTransactions();
	  }
	}, []); // пустой массив — моки загрузятся один раз, а фильтры уже работают в таблице

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/transactions/${editingId}`, { type, amount, category });
      } else {
        await API.post("/transactions", { type, amount, category });
      }
      await fetchTransactions();
      setAmount(""); setCategory(""); setType("expense"); setEditingId(null);
    } catch (err) { console.error(err); }
  };

  const editTransaction = (t) => { setType(t.type); setAmount(t.amount); setCategory(t.category); setEditingId(t.id); };
  const deleteTransaction = async (id) => { await API.delete(`/transactions/${id}`); setTransactions(prev => prev.filter(t => t.id !== id)); };

  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  const chartData = Object.entries(transactions.filter(t => t.type === "expense").reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + Number(t.amount); return acc; }, {})).map(([name, value]) => ({ name, value }));

  const monthlyData = Object.entries(transactions.filter(t => t.type === "expense").reduce((acc, t) => { const month = new Date(t.created_at).toLocaleString("default", { month: "short" }); acc[month] = (acc[month] || 0) + Number(t.amount); return acc; }, {})).map(([month, amount]) => ({ month, amount }));

  const resetFilters = () => { setSearch(""); setFilterType(""); setFilterCategory(""); };

  return (
	// Внутри return Dashboard.jsx
	<div className="dashboard">
		<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
		  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
			<img src="/logo.png" alt="MyFinance" height="36" />
			<h1 style={{ margin: 0, fontSize: '1.8rem' }}>MyFinance</h1>
		  </div>
		  {user && (
			<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
			  <span style={{ color: 'var(--text-secondary)' }}>User ID: {user.userId}</span>
			  <button onClick={logout} className="btn btn-outline">Logout</button>
			</div>
		  )}
		</header>

	  <section className="summary-cards">
		<SummaryCards balance={balance} income={income} expense={expense} />
	  </section>

	  <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
		<div className="chart-card">
		  <h2>Expenses by Category</h2>
		  <ExpensePieChart chartData={chartData} />
		</div>
		<div className="chart-card">
		  <h2>Monthly Expenses</h2>
		  <MonthlyChart monthlyData={monthlyData} />
		</div>
	  </div>

	  <div className="add-transaction-card" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
		<h2 style={{ marginTop: 0 }}>Add Transaction</h2>
		<form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
		  <select value={type} onChange={(e) => setType(e.target.value)} className="form-select">
			<option value="expense">Expense</option>
			<option value="income">Income</option>
		  </select>
		  <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-input" />
		  <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="form-input" />
		  <button type="submit" className="btn btn-primary">{editingId ? "Update" : "Add"}</button>
		</form>
	  </div>

	  <section className="transactions-section">
		<h2>Transactions</h2>
		<TransactionTable
		  transactions={transactions}
		  onEdit={editTransaction}
		  onDelete={deleteTransaction}
		  search={search}
		  setSearch={setSearch}
		  filterType={filterType}
		  setFilterType={setFilterType}
		  filterCategory={filterCategory}
		  setFilterCategory={setFilterCategory}
		  onResetFilters={resetFilters}
		/>
	  </section>
	</div>
  );
}