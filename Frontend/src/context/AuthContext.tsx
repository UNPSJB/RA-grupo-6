import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Recupera sesión guardada
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // 🔐 Login hardcodeado
  const login = async (username: string, password: string) => {
    // Esto luego se reemplazará por un fetch al backend
    if (username === 'docente' && password === '1234') {
      const loggedUser = { username: 'docente', role: 'DOCENTE' };
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
    } else if (username === 'estudiante' && password === '1234') {
      const loggedUser = { username: 'estudiante', role: 'ESTUDIANTE' };
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
    } else {
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
