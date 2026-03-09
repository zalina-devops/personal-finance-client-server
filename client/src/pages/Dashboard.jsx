import { useEffect, useState } from "react";
import { getProfile } from "../api/user";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  
  const [user, setUser] = useState(null);

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

  return (
    <div>
      <h1>Dashboard</h1>

      {user && (
        <div>
          <p>User ID: {user.userId}</p>
        </div>
      )}
	  
	  <button onClick={logout}>Logout</button>
    </div>
  );
}