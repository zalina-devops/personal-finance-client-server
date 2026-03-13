import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/user";
import API from "../api/api";
import { mockTransactions } from '../api/mockData';
import SummaryCards from "./Dashboard/SummaryCards";
import ExpensePieChart from "./Dashboard/ExpensePieChart";
import MonthlyChart from "./Dashboard/MonthlyChart";
import TransactionTable from "./Dashboard/TransactionTable";
import logo from '/logo.png';
import { useTheme } from '../context/ThemeContext';


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

  // Определяем, используем ли моки (в продакшене или по флагу)
  const useMock = import.meta.env.PROD || import.meta.env.VITE_USE_MOCK === 'true';

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Загрузка пользователя и транзакций
  useEffect(() => {
    if (useMock) {
      // В демо-режиме: устанавливаем тестового пользователя и мок-транзакции
      console.log('Demo mode: setting mock user and transactions');
      setUser({ userId: 1, username: "demo" });
      setTransactions(mockTransactions);
    } else {
      // В реальном режиме: получаем профиль и транзакции
      getProfile()
        .then(data => {
          setUser(data.user);
        })
        .catch(() => alert("Not authorized"));

      fetchTransactions();
    }
  }, []); // Пустой массив, чтобы выполнить только один раз

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions", {
        params: { search, type: filterType, category: filterCategory }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Обработчики для демо-режима (ничего не делают или показывают сообщение)
	const handleSubmit = async (e) => {
	  e.preventDefault();

	  // Валидация
	  if (!amount || Number(amount) <= 0) {
		alert('Сумма должна быть положительным числом');
		return;
	  }
	  if (!category.trim()) {
		alert('Категория не может быть пустой');
		return;
	  }

	  try {
		if (editingId) {
		  await API.put(`/transactions/${editingId}`, { type, amount, category });
		} else {
		  await API.post("/transactions", { type, amount, category });
		}
		await fetchTransactions();
		setAmount("");
		setCategory("");
		setType("expense");
		setEditingId(null);
	  } catch (err) {
		console.error(err);
	  }
	};

  const editTransaction = (t) => {
    if (useMock) {
      alert("Редактирование отключено в демо-режиме");
      return;
    }
    setType(t.type);
    setAmount(t.amount);
    setCategory(t.category);
    setEditingId(t.id);
  };

  const deleteTransaction = async (id) => {
    if (useMock) {
      alert("Удаление отключено в демо-режиме");
      return;
    }
    await API.delete(`/transactions/${id}`);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Фильтры для демо работают автоматически, потому что таблица фильтрует
  const resetFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterCategory("");
  };

  // Вычисления для графиков
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  const chartData = Object.entries(
    transactions.filter(t => t.type === "expense").reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const monthlyData = Object.entries(
    transactions.filter(t => t.type === "expense").reduce((acc, t) => {
      const month = new Date(t.created_at).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + Number(t.amount);
      return acc;
    }, {})
  ).map(([month, amount]) => ({ month, amount }));

  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="dashboard">
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={logo} alt="MyFinance" height="36" />
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>MyFinance</h1>
        </div>
        {user && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
		    <button onClick={toggleTheme} className="btn btn-outline" style={{ minWidth: '40px' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
            <span style={{ color: 'var(--text-secondary)' }}>User ID: {user.userId}</span>
            <button onClick={logout} className="btn btn-outline">Logout</button>
          </div>
        )}
      </header>

      <section className="summary-cards" style={{ marginBottom: '1.5rem' }}>
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