import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

// Inverse of ProtectedRoute: wraps routes that should only be visible to
// signed-OUT users (signin, signup). If a session already exists, bounce
// straight to /home instead of showing the auth form again.
//
// No loading guard needed here — AuthProvider itself renders nothing
// (`if (!authReady) return null`) until the initial session check
// resolves, so by the time this component ever renders, `user` already
// reflects the real auth state. No flash-of-wrong-UI is possible.
export default function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
}