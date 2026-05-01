import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <p className="status-card">Verification de la session admin...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/connexion" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
