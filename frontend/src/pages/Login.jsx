import { useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      setUser(res.data);
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/station");
    } catch (err) {
      alert("Invalid Login Credentials!");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-[350px] text-white"
      >
        <h2 className="text-2xl font-bold mb-4">AeroFund Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
