import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Загрузка профиля
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

  // Загрузка транзакций
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

  return (
    <div>
      <h1>Dashboard</h1>

      {user && (
        <div>
          <p>User ID: {user.userId}</p>
        </div>
      )}

      <button onClick={logout}>Logout</button>

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