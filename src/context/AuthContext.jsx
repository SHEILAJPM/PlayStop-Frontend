import { createContext, useContext, useState } from 'react';

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
    setUser(userData);
    localStorage.setItem('playspot-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('playspot-user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
