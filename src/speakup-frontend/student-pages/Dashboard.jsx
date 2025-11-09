import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/students.css";
import SideBar from "../student-pages/components/SideBar";
import MainNavbar from "./components/MainNavbar";
import { useAuth } from "../../contexts/authContext";  // Import useAuth to access currentUser
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State for complaints and counts of different statuses
  const [complaints, setComplaints] = useState([]);
  const [complaintsCount, setComplaintsCount] = useState({
    filed: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0,
    closed: 0,
  });

  // Fetch complaints from Firebase and update the state
 useEffect(() => {
  const fetchComplaints = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "complaints"),
        where("userId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const complaintList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Set complaints state
      setComplaints(complaintList);

      // Initialize status counts
      const statusCounts = {
        filed: 0,
        pending: 0,
        resolved: 0,
        inProgress: 0,
        closed: 0,
      };

      // Count complaints based on their status
      complaintList.forEach((complaint) => {
        const status = complaint.status?.toLowerCase();
        if (status === "filed") statusCounts.filed++;
        if (status === "closed") statusCounts.closed++;
        if (status === "resolved") statusCounts.resolved++;
        if (status === "in-progress") statusCounts.inProgress++;
      });

      // Update the counts state
      setComplaintsCount(statusCounts);
    } catch (error) {
      console.error("❌ Error fetching complaints:", error);
    }
  };

  fetchComplaints();
}, [currentUser]);

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
            <div className="stat-label">Total Complaints Filed</div>
            <div className="stat-number">{complaints.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Currently in Progress</div>
            <div className="stat-number">
              {complaintsCount.inProgress}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Resolved &amp; Closed</div>
            <div className="stat-number">
              {complaintsCount.resolved + complaintsCount.closed}
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
        onClick={() => navigate(`/complaint/${complaint.id}`)} // Navigate to complaint details
        style={{ cursor: "pointer" }}
      >
        {/* Complaint Description */}
        <td className="complain-description">
          {complaint.concernDescription ||
            complaint.otherDescription ||
            complaint.incidentDescription ||
            complaint.facilityDescription ||
            complaint.concernFeedback ||
            "No description provided"}
                </td>

                {/* Category */}
                <td>{complaint.category || "—"}</td>

                {/* Date Filed */}
                <td>{complaint.submissionDate?.toDate().toLocaleDateString() || "—"}</td>

                {/* Complaint Status */}
                <td>
                  <span className={`status ${complaint.status?.toLowerCase() || "pending"}`}>
                    {complaint.status || "Pending"}
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
