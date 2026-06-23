import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  console.log('user from Protected Route: ', user)

  if (!user) return <Navigate to="/signin" replace />;

  return children;
}