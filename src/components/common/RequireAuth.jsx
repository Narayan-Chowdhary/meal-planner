import { Navigate, useLocation } from "react-router";
import { getCurrentUser } from "../../Services/session";

/**
 * Route guard. Guests are sent to the login page; when `role` is given, other
 * signed-in users are sent home instead.
 */
export default function RequireAuth({ role, children }) {
  const user = getCurrentUser();
  const location = useLocation();

  if (user.role === "guest") return <Navigate to="/" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/home" replace />;
  return children;
}
