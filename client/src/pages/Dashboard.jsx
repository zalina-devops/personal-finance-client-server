import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // состояния для формы
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

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
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  // добавление транзакции
  const addTransaction = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/transactions", {
        type,
        amount,
        category,
      });

      // добавляем новую транзакцию в начало списка
      setTransactions([res.data, ...transactions]);

      // очищаем форму
      setAmount("");
      setCategory("");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {user && (
        <div>
          <p>User ID: {user.userId}</p>
        </div>
      )}

      <button onClick={logout}>Logout</button>

      <h2>Add Transaction</h2>

      <form onSubmit={addTransaction}> style={{ marginBottom: "20px" }}>
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

        <button type="submit">Add</button>
      </form>

      <h2>Transactions</h2>

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.type} | ${t.amount} | {t.category}
          </li>
        ))}
      </ul>
    </div>
  );
}