import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (userName: string, password: string) => Promise<void>;
  signup: (userData: { userName: string; password: string; email?: string; sentimentAnalysis?: boolean }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (userName: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = await apiService.login({ userName, password });
      localStorage.setItem('jwt_token', token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: { userName: string; password: string; email?: string; sentimentAnalysis?: boolean }) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.signup(userData);
      // Auto-login after signup
      await login(userData.userName, userData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      signup,
      logout,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};