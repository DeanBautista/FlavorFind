import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { logoutUser } from "../api/userApi";
import apiClient from "../api/userApi";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authReady, setAuthReady] = useState(false);  // ← prevent flash of wrong UI

  // ── Check auth on every page load/refresh ──────────────────
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setAuthReady(true);
        return;
      }

      try {
        // 1. Refresh the access token
        const { data } = await apiClient.post("/users/refresh");
        localStorage.setItem("accessToken", data.accessToken);

        // 2. Fetch fresh user data instead of trusting the localStorage snapshot
        const { data: userData } = await apiClient.get("/users/me");
        localStorage.setItem("user", JSON.stringify(userData.user)); // ← keep storage in sync
        setUser(userData.user);                                       // ← always fresh
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    checkAuth();
  }, []);

  const login = ({ accessToken, user }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ← Don't render children until auth check is done
  // prevents flickering between logged-in and logged-out UI
  if (!authReady) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};