import { useState } from "react";
import API from "../api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered Successfully ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="form-container">
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <br /><br />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <br /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <br /><br />

        <select name="role" onChange={handleChange}>
          <option value="attendee">attendee</option>
          <option value="organizer">Organizer</option>
        </select>

        <br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;