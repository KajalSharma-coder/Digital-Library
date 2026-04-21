import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("dlms-auth");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const persistUser = (data) => {
    setUser(data);
    if (data) {
      localStorage.setItem("dlms-auth", JSON.stringify(data));
    } else {
      localStorage.removeItem("dlms-auth");
    }
  };

  const login = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", values);
      persistUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/google", { credential });
      persistUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", values);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => persistUser(null);

  useEffect(() => {
    const hydrate = async () => {
      if (!user?.token) return;
      try {
        await api.get("/auth/me");
      } catch (_error) {
        persistUser(null);
      }
    };

    hydrate();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, googleLogin, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
