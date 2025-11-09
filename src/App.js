import { useRoutes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";

// Styles
import "./styles/students.css";
import "./styles-admin/admin.css"; // Corrected the typo in the file name

// Auth components
import Login from "./components/auth/login";
import Register from "./components/auth/register";

// Layout and page components
import Header from "./components/header";

// Student Pages
import Dashboard from "./speakup-frontend/student-pages/Dashboard";
import FileComplaint from "./speakup-frontend/student-pages/ComplaintForm";
import Notifications from "./speakup-frontend/student-pages/Notifications";
import ComplaintHistory from "./speakup-frontend/student-pages/ComplaintHistory";

// Admin Pages
import AdminDashboard from "./speakup-frontend/admin-pages/admin-dashboard";
import AdminUserManage from "./speakup-frontend/admin-pages/admin-userManage";
import AdminMonitorComplaints from "./speakup-frontend/admin-pages/admin-monitoring";
import AdminAnalytics from "./speakup-frontend/admin-pages/admin-analytics";

// Staff / KASAMA Pages
import StaffDashboard from "./speakup-frontend/staff-pages/admin-dashboard";
import StaffMonitorComplaints from "./speakup-frontend/staff-pages/admin-monitoring";
import StaffAnalytics from "./speakup-frontend/staff-pages/admin-analytics";

const roleMatches = (userRole, required) => {
  if (!required) return true;
  const roles = Array.isArray(required) ? required : [required];
  return roles.map((role) => role.toLowerCase()).includes((userRole || "").toLowerCase());
};

const PrivateRoute = ({ element, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !roleMatches(user.role, requiredRole)) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

function App() {
  const resolveDefaultRoute = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?.role) return "/login";

      const role = storedUser.role.toLowerCase();
      if (role === "admin") return "/adashboard";
      if (role === "staff" || role === "kasama") return "/sdashboard";
      if (role === "student") return "/dashboard";
    } catch (error) {
      console.error("Failed to parse stored user:", error);
    }
    return "/login";
  };

  const defaultRoute = resolveDefaultRoute();

  const routesArray = [
    { path: "/", element: <Navigate to={defaultRoute} replace /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
      path: "/dashboard",
      element: <PrivateRoute element={<Dashboard />} requiredRole="student" />,
    },
    {
      path: "/file-complaint",
      element: <PrivateRoute element={<FileComplaint />} requiredRole="student" />,
    },
    {
      path: "/notifications",
      element: <PrivateRoute element={<Notifications />} requiredRole="student" />,
    },
    {
      path: "/history",
      element: <PrivateRoute element={<ComplaintHistory />} requiredRole="student" />,
    },
    {
      path: "/adashboard",
      element: <PrivateRoute element={<AdminDashboard />} requiredRole="admin" />,
    },
    {
      path: "/amanageusers",
      element: <PrivateRoute element={<AdminUserManage />} requiredRole="admin" />,
    },
    {
      path: "/aanalytics",
      element: <PrivateRoute element={<AdminAnalytics />} requiredRole="admin" />,
    },
    {
      path: "/amonitorcomplaints",
      element: <PrivateRoute element={<AdminMonitorComplaints />} requiredRole="admin" />,
    },
    {
      path: "/sdashboard",
      element: <PrivateRoute element={<StaffDashboard />} requiredRole={["staff", "kasama"]} />,
    },
    {
      path: "/smonitorcomplaints",
      element: <PrivateRoute element={<StaffMonitorComplaints />} requiredRole={["staff", "kasama"]} />,
    },
    {
      path: "/sanalytics",
      element: <PrivateRoute element={<StaffAnalytics />} requiredRole={["staff", "kasama"]} />,
    },
    { path: "*", element: <Navigate to={defaultRoute} replace /> },
  ];

  const routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
