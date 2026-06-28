import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import PageLoader from "../components/PageLoader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />; // or a spinner component

  if (!user) return <Navigate to="/signin" replace />;

  return children;
}