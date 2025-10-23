import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/students.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
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
    const response = await fetch("http://localhost:5000/api/students/register", {
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
      alert(data.message || "Registration failed"); // 👈 alert for backend error (e.g., email already used)
      return;
    }

    setSuccess("Registration successful! Redirecting to login...");
    alert("Registration successful! Redirecting to login..."); // 👈 success feedback

    setTimeout(() => navigate("/student/login"), 2000);
  } catch (err) {
    console.error("Error registering:", err);
    setError("Something went wrong. Please try again later.");
    alert("Something went wrong. Please try again later."); // 👈 alert for network/server errors
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

        <div style={{ marginTop: "40px" }}>
          <h3>Your Voice Matters!</h3>
          <p>Register now to submit your complaints and help improve our campus!</p>
        </div>
      </div>

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
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              name="studentId"
              placeholder="Enter your student ID"
              value={formData.studentId}
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
                onClick={() => navigate("/student/login")}
                style={{ color: "var(--maroon)", fontWeight: 600, cursor: "pointer" }}
              >
                Login heawdre
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
