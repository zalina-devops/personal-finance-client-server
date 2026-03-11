import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // состояния формы
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // загрузка профиля
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (error) {
        alert("Not authorized");
      }
    };

    loadUser();
  }, []);

  // загрузка транзакций
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // добавление или редактирование транзакции
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/transactions/${editingId}`, {
          type,
          amount,
          category,
        });
      } else {
        await API.post("/transactions", {
          type,
          amount,
          category,
        });
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

  const editTransaction = (transaction) => {
    setType(transaction.type);
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setEditingId(transaction.id);
  };

  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  const expenseTransactions = transactions.filter(
    (t) => t.type === "expense"
  );

  const categoryTotals = {};

  expenseTransactions.forEach((t) => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = 0;
    }

    categoryTotals[t.category] += Number(t.amount);
  });

  const chartData = Object.keys(categoryTotals).map((category) => ({
    name: category,
    value: categoryTotals[category],
  }));

  const COLORS = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#1a535c"];

  return (
    <div>
      <h1>Dashboard</h1>

      {user && (
        <div>
          <p>User ID: {user.userId}</p>
        </div>
      )}

      <button onClick={logout}>Logout</button>

      <h2>Summary</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            width: "120px",
            textAlign: "center",
          }}
        >
          <h3>Balance</h3>
          <p>${balance}</p>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            width: "120px",
            textAlign: "center",
            color: "green",
          }}
        >
          <h3>Income</h3>
          <p>${income}</p>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            width: "120px",
            textAlign: "center",
            color: "red",
          }}
        >
          <h3>Expense</h3>
          <p>${expense}</p>
        </div>
      </div>

      <h2>Expenses by Category</h2>

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

      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <h2>Transactions</h2>

      <table style={{ borderCollapse: "collapse", width: "400px" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px" }}>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td style={{ padding: "8px" }}>{t.type}</td>
              <td>${t.amount}</td>
              <td>{t.category}</td>

              <td>
                <button onClick={() => editTransaction(t)}>✏️</button>

                <button
                  onClick={() => deleteTransaction(t.id)}
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
}
