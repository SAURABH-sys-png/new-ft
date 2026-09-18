import { createContext, useContext, useState, useCallback } from 'react';
import { authLogin, authSignup, authLogout } from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('dr_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('dr_token') || null);

  const saveAuth = useCallback((userData, tokenStr) => {
    localStorage.setItem('dr_token', tokenStr);
    localStorage.setItem('dr_user', JSON.stringify(userData));
    setToken(tokenStr);
    setUser(userData);
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await authLogin({ identifier, password });
    saveAuth(data.user, data.token);
    return data;
  }, [saveAuth]);

  const signup = useCallback(async ({ username, password, email, mobileNumber }) => {
    const body = { username, password };
    if (email) body.email = email;
    if (mobileNumber) body.mobileNumber = mobileNumber;
    const data = await authSignup(body);
    saveAuth(data.user, data.token);
    return data;
  }, [saveAuth]);

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } catch {
      // Token may already be invalid — that's fine
    } finally {
      localStorage.removeItem('dr_token');
      localStorage.removeItem('dr_user');
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
