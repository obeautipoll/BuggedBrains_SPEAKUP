import React from 'react';
// Assuming you are using react-router-dom v6+ for navigation
import { useNavigate } from 'react-router-dom';
import "../../../styles-admin/sidebar-admin.css" // Optional: for component-specific styling

const SideBar = () => {
  // Get the navigation function
  const navigate = useNavigate();

  // Define the navigation logic
  const handleNavigation = (page) => {
    switch (page) {
      case "logout":
        // TODO: clear session or token (e.g., localStorage.removeItem('token'))
        navigate("/admin/login");
        break;
      case "admin-dashboard":
        navigate("/admin/dashboard");
        break;
      case "admin-monitoring":
        navigate("/admin/monitor-complaints");
        break;
      case "admin-userManage":
        navigate("/admin/userManage");
        break;
      case "admin-analytics":
        navigate("/admin/analytics");
        break;
      case "admin-settings":
        navigate("/admin/settings");
        break;
      case "admin-notifications":
        navigate("/admin/notifications");
        break;
      default:
        // Handle unexpected page value if necessary
        console.error("Unknown navigation page:", page);
    }
  };

  return (
    <nav className="sidebar-container"> {/* Use a semantic element for the navbar */}
      <div className="sidebar-content-wrapper"> {/* Optional wrapper */}
        {/* You can add a logo or title here */}
        {/* <div className="navbar-logo">MyApp</div> */}
        <div className="logo">
          <h1> SpeakUp </h1>
          <p> MSU-IIT Complaint System Admin Side</p>
        </div>
        
        <ul className="sidebar-links">
          <li 
            className={window.location.pathname === "/admin/dashboard" ? "active" : ""}
            onClick={() => handleNavigation("admin-dashboard")}
          >
            <i className="fa-solid fa-gauge"></i> Dashboard
          </li>

          <li 
            className={window.location.pathname === "/admin/monitor-complaints" ? "active" : ""}
            onClick={() => handleNavigation("admin-monitoring")}
          >
            <i className="fa-solid fa-file-lines"></i> Monitor Complaints
          </li>

          <li 
            className={window.location.pathname === "/admin/userManage" ? "active" : ""}
            onClick={() => handleNavigation("admin-userManage")}
          >
            <i className="fa-solid fa-users"></i> User Management
          </li>

          <li 
            className={window.location.pathname === "/admin/analytics" ? "active" : ""}
            onClick={() => handleNavigation("admin-analytics")}
          >
            <i className="fa-solid fa-chart-bar"></i> Reports & Analytics
          </li>

          <li 
            className={window.location.pathname === "/admin/notifications" ? "active" : ""}
            onClick={() => handleNavigation("admin-notifications")}
          >
            <i className="fa-solid fa-bell"></i> Notifications
          </li>


          <li 
            className={window.location.pathname === "/admin/setting" ? "active" : ""}
            onClick={() => handleNavigation("admin-setting")}
          >
            <i className="fa-solid fa-gear"></i> Settings
          </li>

          <li
            onClick={() => {
              const confirmLogout = window.confirm("Are you sure you want to log out?");
              if (confirmLogout) {
                handleNavigation("logout");
                alert("You have been logged out successfully!");
              }
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default SideBar;