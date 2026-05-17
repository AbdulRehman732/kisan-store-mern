import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        localStorage.removeItem('sessionExpiration');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Listen for login/logout in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sessionExpiration') {
        if (!e.newValue) {
          setUser(null);
          window.location.hash = '#/login';
        } else if (!user) {
          // If a new session started in another tab, we should probably check auth
          api.get('/auth/me').then(res => setUser(res.data.user)).catch(() => {});
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Inactivity and Expiration Logic
  useEffect(() => {
    let interval;
    const FOUR_MINUTES = 4 * 60 * 1000;

    const resetTimer = () => {
      if (user) {
        localStorage.setItem('sessionExpiration', (Date.now() + FOUR_MINUTES).toString());
      }
    };

    if (user) {
      // Initialize if not set
      if (!localStorage.getItem('sessionExpiration')) {
        resetTimer();
      }

      // Check for expiration every second
      interval = setInterval(() => {
        const expirationTime = localStorage.getItem('sessionExpiration');
        if (expirationTime && Date.now() > parseInt(expirationTime)) {
          handleAutoLogout();
        }
      }, 1000);

      // Listen for user activity
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('scroll', resetTimer);
    } else {
      localStorage.removeItem('sessionExpiration');
    }

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [user]);

  const handleAutoLogout = () => {
    alert('Your session has expired due to 4 minutes of inactivity. Please login again.');
    logout();
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sessionExpiration', (Date.now() + 4 * 60 * 1000).toString());
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
      localStorage.removeItem('sessionExpiration');
      window.location.hash = '#/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);