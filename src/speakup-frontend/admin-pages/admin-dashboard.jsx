import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext'; // Import useAuth for fetching user data
import { BarChart3, Users, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import '../../styles-admin/admin.css';
import SideBar from './components/SideBar';
import AdminNavbar from './components/NavBar';
import UrgentComplaintsWidget from './components/urgency-level';

const AdminDashboard = () => {
  const { currentUser, userRole } = useAuth();  // Get currentUser and userRole from AuthContext
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [complaints] = useState([
    {
      id: 'CMP-001',
      college: 'CCS',
      urgency: 'High',
      category: 'Facilities',
      date: '2024-10-15',
      status: 'Pending',
    },
    {
      id: 'CMP-002',
      college: 'CSM',
      urgency: 'Medium',
      category: 'Academic',
      date: '2024-10-14',
      status: 'In Progress',
    },
    {
      id: 'CMP-003',
      college: 'CHS',
      urgency: 'Low',
      category: 'Services',
      date: '2024-10-13',
      status: 'Resolved',
    },
    {
      id: 'CMP-004',
      college: 'COE',
      urgency: 'High',
      category: 'Safety',
      date: '2024-10-15',
      status: 'Pending',
    },
    {
      id: 'CMP-005',
      college: 'CED',
      urgency: 'Medium',
      category: 'Facilities',
      date: '2024-10-12',
      status: 'In Progress',
    },
  ]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      case 'low':
        return 'urgency-low';
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'in progress':
        return 'status-progress';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="main-content">
        <AdminNavbar />

        {/* Admin Greeting and Role */}
        <div className="admin-greeting">
          <p className="text-2xl font-bold pt-14">
            {getGreeting()}, {currentUser?.displayName || currentUser?.email || 'Admin'}!
          </p>
          <p className="text-lg">{userRole || 'Admin Role'}</p>
        </div>

        {/* Analytics Cards */}
        <div className="analytics-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.total}</h3>
              <p className="stat-label">Total Complaints</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.pending}</h3>
              <p className="stat-label">Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon progress">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.inProgress}</h3>
              <p className="stat-label">In Progress</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon resolved">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.resolved}</h3>
              <p className="stat-label">Resolved</p>
            </div>
          </div>
        </div>

        <UrgentComplaintsWidget />

        {/* Complaints Table */}
        {/* Table and other content here */}
      </main>
    </div>
  );
};

export default AdminDashboard;
