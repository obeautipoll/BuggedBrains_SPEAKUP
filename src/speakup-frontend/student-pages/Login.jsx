import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/students.css";

const Login = () => {
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
    email: "student@gmail.com",
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
      navigate("/dashboard");
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
      <div className="login-left">
        <div className="login-logo">SpeakUp</div>
        <div className="login-subtitle">
          MSU-IIT Student-Centered Digital Complaint Resolution System
        </div>
        <p>
          Ensures efficient, transparent, and fair handling of student complaints
          at MSU-IIT through the established student-centered complaint resolution system.
        </p>

        <div className="complaint-examples">
          <h3>Your Voice Matters!</h3>
          <p>
            Have some complaint? Sign in now and share yours with us anonymously!
          </p>

          <div className="complaint-item">
            <p>
              "The air conditioning unit in Room 11 has not been functioning properly
              for two weeks, making it difficult to concentrate during afternoon classes."
            </p>
          </div>
          <div className="complaint-item">
            <p>
              "Some course requirements overlap heavily across subjects,
              making it hard for students to manage deadlines."
            </p>
          </div>
        </div>
      </div>

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
                onClick={() => navigate("/student/register")}
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

export default Login;
