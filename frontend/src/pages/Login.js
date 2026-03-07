import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);

      // ⚠ Temporary manual role set (until backend fixed)
        localStorage.setItem("role", res.data.role);
      alert("Login Successful ✅");

      navigate("/"); // Proper redirect

      window.location.reload(); // Force App to re-read token

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <br /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;