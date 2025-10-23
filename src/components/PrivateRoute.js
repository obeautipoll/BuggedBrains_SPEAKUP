import { Navigate, Route } from "react-router-dom";
import { useAuth } from "./contexts/authContext"; // Import the useAuth hook

function PrivateRoute({ element, requiredRole, ...rest }) {
  const { userLoggedIn, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loader component
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" />; // Redirect if role doesn't match
  }

  return <Route {...rest} element={element} />;
}

export default PrivateRoute;
