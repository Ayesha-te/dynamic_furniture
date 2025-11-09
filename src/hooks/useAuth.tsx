import { createContext, useContext, useEffect, useState } from "react";
import apiFetch from "@/lib/api";

type User = { id: number; username?: string; email?: string } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, first_name?: string, last_name?: string) => Promise<void>;
  logout: () => void;
} | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // on mount, try to get /accounts/me/
    const init = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return setLoading(false);
      try {
        const me = await apiFetch("/accounts/me/");
        setUser(me);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiFetch("/accounts/token/", {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
    });
    localStorage.setItem("access_token", data.access);
    if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
    const me = await apiFetch("/accounts/me/");
    setUser(me);
  };

  const register = async (username: string, email: string, password: string, first_name?: string, last_name?: string) => {
    const payload: any = { username, email, password };
    if (first_name) payload.first_name = first_name;
    if (last_name) payload.last_name = last_name;
    const data = await apiFetch("/accounts/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // auto-login after register
    await login(email, password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
