import React, { createContext, useState, useEffect } from 'react';
import { loginApi, signupApi, verify2FA } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const res = await loginApi({ emailOrUsername, password });
      const { token, user: userData, username } = res.data;
      const finalUser = userData || { username };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(finalUser));
      setUser(finalUser);

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const signupStart = async ({ email, phone, username, password }) => {
    try {
      const res = await signupApi({ email, phone, username, password });
      return { ok: true, message: res.data.message };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const signupVerify = async ({ email, code, phone, username, password }) => {
    try {
      const res = await verify2FA({ email, code, phone, username, password });
      const { token, user: userData } = res.data;
      const finalUser = userData || { username };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(finalUser));
      setUser(finalUser);

      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Verification failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, signupStart, signupVerify }}
    >
      {children}
    </AuthContext.Provider>
  );
};
