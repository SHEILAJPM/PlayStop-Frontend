import { createContext, useContext, useState } from 'react';
import { resetSessionExpired, getCsrfHeader } from '../services/api.js';

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
    setUser(null);
    localStorage.removeItem('playspot-user');
    localStorage.removeItem('playspot-avatar');

    // Best-effort: invalida el token del lado del servidor (logout real) y
    // limpia la cookie httpOnly. La sesión viaja por cookie, así que basta
    // con incluir credenciales; no bloquea el logout visual si falla o no
    // hay red.
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    getCsrfHeader().then((headers) => fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers,
    })).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
