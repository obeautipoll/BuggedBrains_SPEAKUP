import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles-admin/admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  // Example hardcoded credentials (you can modify these)
  const validUser = {
    email: "admin@gmail.com",
    password: "qwerty",
  };

  try {
    // Check if entered credentials match
    if (
      formData.email === validUser.email &&
      formData.password === validUser.password
    ) {
      // Mock user data
      const mockStudent = {
        name: "John Doe",
        email: validUser.email,
      };

      // Save mock token & student info
      localStorage.setItem("token", "mockToken123");
      localStorage.setItem("student", JSON.stringify(mockStudent));

      alert("Login successful!");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password");
      alert("Invalid email or password");
    }
  } catch (err) {
    console.error("Error logging in:", err);
    setError("Something went wrong. Please try again.");
    alert("Something went wrong. Please try again.");
  }
};


    
  return (
    <div className="login-container">
    

      <div className="login-right">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 style={{ marginBottom: "30px", color: "var(--maroon)" }}>
            Login to Your Account
          </h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/admin/register")}
                style={{ color: "var(--maroon)", fontWeight: 600, cursor: "pointer" }}
              >
                Register here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
