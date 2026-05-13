import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User, fetchUsers, createUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('lendly_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const users = await fetchUsers();
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!found) throw new Error('No user with that email');
      // Note: password is not stored in the current backend; this performs email-based login only
      setUser(found);
      localStorage.setItem('lendly_user', JSON.stringify(found));
    } catch (err) {
      setUser(null);
      localStorage.removeItem('lendly_user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const payload: Partial<User> = {
        name,
        email,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop`,
        isAdmin: false,
        joinDate: new Date().toISOString().split('T')[0],
        rating: 0,
        reviewCount: 0,
      };
      const created = await createUser(payload);
      setUser(created);
      localStorage.setItem('lendly_user', JSON.stringify(created));
    } catch (err) {
      setUser(null);
      localStorage.removeItem('lendly_user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lendly_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
