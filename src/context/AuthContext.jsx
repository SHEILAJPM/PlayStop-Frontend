import { createContext, useContext, useState } from 'react';
import { resetSessionExpired } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('playspot-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('playspot-user');
      return null;
    }
  });

  const login = (userData) => {
    resetSessionExpired();
    setUser(userData);
    localStorage.setItem('playspot-user', JSON.stringify(userData));
  };

  const logout = () => {
    const token = localStorage.getItem('token');

    setUser(null);
    localStorage.removeItem('playspot-user');
    localStorage.removeItem('token');
    localStorage.removeItem('playspot-avatar');

    // Best-effort: invalida el token del lado del servidor (logout real).
    // No bloquea el logout visual si falla o no hay red.
    if (token) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
