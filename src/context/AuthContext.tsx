import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: { username?: string; password?: string; photoUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao iniciar, se houver token salvo, valida com o backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.access_token);
      setUser(res.user);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', { email, username, password });
      localStorage.setItem('token', res.access_token);
      setUser(res.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await api.post('/auth/forgot-password', { email });
      return true;
    } catch {
      return false;
    }
  };

  const updateProfile = async (data: { username?: string; password?: string; photoUrl?: string }) => {
    const updated = await api.put('/account/profile', data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}