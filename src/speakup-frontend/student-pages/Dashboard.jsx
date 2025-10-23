import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/students.css";
import SideBar from "../student-pages/components/SideBar";
import MainNavbar from "./components/MainNavbar";
import { useAuth } from "../../contexts/authContext";  // Import useAuth to access currentUser


const Dashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate();

  const [complaints] = useState([
    {
      id: 1,
      description:
        "The air conditioning unit in Room 11 has not been functioning properly for two weeks, making it difficult to concentrate during afternoon classes. We hope it can be checked or reported soon.",
      category: "Facilities",
      date: "10.05.2025",
      status: "Resolved",
    },
    {
      id: 2,
      description:
        "Some course requirements overlap heavily across subjects, making it hard for students to manage deadlines. It would help if professors coordinated their schedules to avoid workload congestion.",
      category: "Academic",
      date: "10.14.2025",
      status: "Pending",
    },
    {
      id: 3,
      description:
        "There are limited study tables in the library during peak hours, and some outlets don't work. It would be helpful if more seating and functional charging stations were made available for students.",
      category: "Campus Services",
      date: "10.16.2025",
      status: "Pending",
    },
    {
      id: 4,
      description:
        "The campus Wi-Fi often disconnects, especially in the library area. It's hard to access the LMS for online quizzes and lecture materials due to unstable internet.",
      category: "Technology/Internet",
      date: "09.23.2025",
      status: "In Progress",
    },
  ]);

  return (
    <div className="container dashboard-page">
      <SideBar />

      <div className="main-content">
        <MainNavbar />

       

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              Your voice is the foundation of institutional growth.
            </div>
          </div>
          <p>
            Welcome to the MSU-IIT Complaint System. Here you can submit concerns,
            track their progress, and view resolution history.
          </p>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-label">Total Concerns Filed</div>
            <div className="stat-number">{complaints.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Currently in Progress</div>
            <div className="stat-number">
              {complaints.filter((c) => c.status === "In Progress").length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Resolved & Closed</div>
            <div className="stat-number">
              {complaints.filter((c) => c.status === "Resolved").length}
            </div>
          </div>
        </div>

        <div className="tracking-container">
          <div className="tracking-header">Tracking Progress</div>

          <table className="complain-table">
            <thead>
              <tr>
                <th style={{ width: "60%" }}>Complaint</th>
                <th style={{ width: "15%" }}>Category</th>
                <th style={{ width: "10%" }}>Date Filed</th>
                <th style={{ width: "15%" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  onClick={() => navigate(`/complaint/${complaint.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="complain-description">{complaint.description}</td>
                  <td>{complaint.category}</td>
                  <td>{complaint.date}</td>
                  <td>
                    <span className={`status ${complaint.status.toLowerCase()}`}>
                      {complaint.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="view-history">
            <a href="/history">View Entire History</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
