import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem("token");

      // No token = no logged-in user
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me");

        setUser(data.user);
      } catch (error) {
        console.error("Get current user error:", error);

        // Invalid/expired token
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // ==========================================
  // SIGNUP
  // ==========================================

  const signup = async (name, email, password) => {
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save logged-in user
      setUser(data.user);

      toast.success("Account created successfully");

      return true;
    } catch (error) {
      console.error("Signup error:", error);

      toast.error(error.message || "Signup failed");

      return false;
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save user
      setUser(data.user);

      toast.success("Login Successful");

      return true;
    } catch (error) {
      console.error("Login error:", error);

      toast.error(error.message || "Login failed");

      return false;
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {
    localStorage.removeItem("token");

    setUser(null);

    toast.success("Logout Successful");
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const updateProfile = async (fields) => {
    try {
      const data = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(fields),
      });

      setUser((prev) => ({ ...prev, ...data.user }));

      toast.success("Profile updated");

      return true;
    } catch (error) {
      toast.error(error.message || "Update failed");

      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);