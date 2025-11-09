import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = '/api'; 

// --- ¡IMPORTANTE! ---
// Este tipo DEBE COINCIDIR con el UsuarioSchema del backend
type Rol = {
  id: number;
  nombre: string;
};

type User = {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  legajo: number;
  rol: Rol; 
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOnLoad = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('No hay sesión activa');
        const userData: User = await response.json();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOnLoad();
  }, []);

  const login = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      const userData: User = await response.json();
      setUser(userData);


    } catch (error) {
      console.error("Error en el login:", error);
      setUser(null);
      throw error; 
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};