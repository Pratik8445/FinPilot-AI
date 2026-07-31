import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, getCurrentUser } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true); // true on mount while we validate token

  // On mount, if there's a stored token try to fetch the current user
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setToken(storedToken);
      } catch {
        // Token is invalid/expired — clear it
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const tokenData = await loginUser({ email, password });
    const { access_token } = tokenData;

    localStorage.setItem('access_token', access_token);
    setToken(access_token);

    // Fetch user profile after storing token
    const userData = await getCurrentUser();
    setUser(userData);

    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
