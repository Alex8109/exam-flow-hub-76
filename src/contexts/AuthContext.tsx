import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User> = {
  'student@test.com': {
    id: '1',
    name: 'राहुल शर्मा',
    email: 'student@test.com',
    role: 'student'
  },
  'admin@test.com': {
    id: '2', 
    name: 'प्रिया सिंह',
    email: 'admin@test.com',
    role: 'admin'
  },
  'super@test.com': {
    id: '3',
    name: 'डॉ. विकास गुप्ता',
    email: 'super@test.com',
    role: 'super_admin'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers[email];
    if (foundUser && password === 'password') {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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