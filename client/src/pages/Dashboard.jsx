import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

import SummaryCards from "./Dashboard/SummaryCards";
import ExpensePieChart from "./Dashboard/ExpensePieChart";
import MonthlyChart from "./Dashboard/MonthlyChart";
import TransactionTable from "./Dashboard/TransactionTable";

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

  useEffect(() => { fetchTransactions(); }, [search, filterType, filterCategory]);

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
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>
      {user && <p>User ID: {user.userId}</p>}
      <button onClick={logout}>Logout</button>

      <h2>Summary</h2>
      <SummaryCards balance={balance} income={income} expense={expense} />

      <h2>Expenses by Category</h2>
      <ExpensePieChart chartData={chartData} />

      <h2>Monthly Expenses</h2>
      <MonthlyChart monthlyData={monthlyData} />

      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

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
    </div>
  );
}