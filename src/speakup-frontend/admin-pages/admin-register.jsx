import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles-admin/admin.css";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    refers: "",
    office:"",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // simple client-side password check
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    alert("Passwords do not match."); // 👈 alert for mismatch
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/admin/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Registration failed");
      alert(data.message || "Registration failed"); 
      return;
    }

    setSuccess("Registration successful! Redirecting to login...");
    alert("Registration successful! Redirecting to login..."); // 👈 success feedback

    setTimeout(() => navigate("/admin/login"), 2000);
  } catch (err) {
    console.error("Error registering:", err);
    setError("Something went wrong. Please try again later.");
    alert("Something went wrong. Please try again later."); // 👈 alert for network/server errors
  }
};


  return (
    <div className="login-container">
      

      <div className="login-right">
        <form className="login-form" onSubmit={handleRegister}>
          <h2 style={{ marginBottom: "30px", color: "var(--maroon)" }}>
            Create Your Account
          </h2>

          <div className="form-group">
            <label htmlFor="regEmail">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="regPassword">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="office">Office/Organization</label>
            <input
              type="text"
              name="offic"
              placeholder="Enter your office/organization"
              value={formData.office}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="refers">Who referred this to you?</label>
            <input
              type="text"
              name="refers"
              placeholder="Enter referrer's name"
              value={formData.refers}
              onChange={handleChange}
              required
            />
          </div>




          <button type="submit" className="btn btn-primary btn-block">
            Register
          </button>

          <div className="login-footer">
            <p>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/admin/login")}
                style={{ color: "var(--maroon)", fontWeight: 600, cursor: "pointer" }}
              >
                Login hawdere
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
