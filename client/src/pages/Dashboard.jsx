import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");


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
		const res = await API.get("/transactions", {
		  params: {
			search,
			type: filterType,
			category: filterCategory
		  }
		});

		setTransactions(res.data);

	  } catch (err) {
		console.error(err);
	  }
	};	

	useEffect(() => {
	  fetchTransactions();
	}, [search, filterType, filterCategory]);

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

	const monthlyTotals = {};

	transactions.forEach((t) => {
	  if (t.type !== "expense") return;

	  const date = new Date(t.created_at);
	  const month = date.toLocaleString("default", { month: "short" });

	  if (!monthlyTotals[month]) {
		monthlyTotals[month] = 0;
	  }

	  monthlyTotals[month] += Number(t.amount);
	});

	const monthlyData = Object.keys(monthlyTotals).map((month) => ({
	  month,
	  amount: monthlyTotals[month],
	}));

  const COLORS = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#1a535c"];

	return (
	  <div
		style={{
		  maxWidth: "1000px",
		  margin: "0 auto",
		  padding: "20px",
		  fontFamily: "Arial"
		}}
	  >
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
			background: "#f4f6f8",
			padding: "20px",
			borderRadius: "10px",
			width: "150px",
			textAlign: "center",
			boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
		  }}
		>
          <h3>Balance</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
			${balance}
		  </p>
        </div>

		<div
		  style={{
			background: "#e8f8f1",
			padding: "20px",
			borderRadius: "10px",
			width: "150px",
			textAlign: "center",
			color: "green",
			boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
		  }}
		>
			<h3>Income</h3>
			  <p style={{ fontSize: "20px", fontWeight: "bold", color: "green" }}>
				${income}
			  </p>
			</div>

		<div
		  style={{
			background: "#fdecea",
			padding: "20px",
			borderRadius: "10px",
			width: "150px",
			textAlign: "center",
			color: "red",
			boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
		  }}
		>
          <h3>Expense</h3>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}>${expense}</p>
        </div>
      </div>

      <h2>Expenses by Category</h2>

	  <div style={{ display: "flex", justifyContent: "center" }}>	
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
	  
		<h2>Monthly Expenses</h2>

		<div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
		  <LineChart
			width={500}
			height={300}
			data={monthlyData}
		  >
			<CartesianGrid strokeDasharray="3 3" />

			<XAxis dataKey="month" />

			<YAxis />

			<Tooltip />

			<Line
			  type="monotone"
			  dataKey="amount"
			  stroke="#ff6b6b"
			  strokeWidth={3}
			/>
		  </LineChart>
		</div>
	  
	<h2>Filters</h2>

	<div style={{ justifyContent: "center", marginBottom: "30px", display: "flex", gap: "10px" }}>

	  <input
		type="text"
		placeholder="Search category..."
		value={search}
		onChange={(e) => setSearch(e.target.value)}
	  />

	  <select
		value={filterType}
		onChange={(e) => setFilterType(e.target.value)}
	  >
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

	</div>

		<button
		  onClick={() => {
			setSearch("");
			setFilterType("");
			setFilterCategory("");
		  }}
		>
		  Reset
		</button>

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

	<table
	  style={{
		borderCollapse: "collapse",
		width: "100%",
		marginTop: "20px"
	  }}
	>
		<thead
		  style={{
			background: "#f4f6f8"
		  }}
		>
          <tr>
            <th style={{ padding: "8px" }}>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
			<tr
			  key={t.id}
			  style={{
				borderBottom: "1px solid #eee"
			  }}
			>
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
