import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  phoneNumber: string;
  fullName: string;
  location: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Always initialize with fresh dummy users for testing
    const dummyUsers = [
      {
        id: 'user1',
        email: 'user@test.com',
        password: 'test123',
        phoneNumber: '+1-555-0123',
        fullName: 'John Smith',
        location: 'New York, NY',
        role: 'user',
        progress: { currentStep: 0, completedSteps: [] }
      },
      {
        id: 'user2',
        email: 'admin@test.com',
        password: 'admin123',
        phoneNumber: '+1-555-0124',
        fullName: 'System Administrator',
        location: 'Seattle, WA',
        role: 'admin',
        progress: { currentStep: 0, completedSteps: [] }
      }
    ];
    localStorage.setItem('jobseeker_users', JSON.stringify(dummyUsers));

    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('jobseeker_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('jobseeker_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - check if user exists in localStorage
      const usersData = localStorage.getItem('jobseeker_users');
      if (!usersData) {
        throw new Error('No users found');
      }
      
      const users = JSON.parse(usersData);
      const existingUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!existingUser) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = existingUser;
      setUser(userWithoutPassword);
      localStorage.setItem('jobseeker_user', JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('jobseeker_users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === userData.email)) {
        throw new Error('User already exists');
      }
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        fullName: userData.fullName,
        location: userData.location,
        progress: {
          currentStep: 0,
          completedSteps: []
        }
      };
      
      // Save user with password for authentication
      users.push({ ...newUser, password: userData.password });
      localStorage.setItem('jobseeker_users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('jobseeker_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobseeker_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('jobseeker_user', JSON.stringify(updatedUser));
      
      // Update in users array as well
      const users = JSON.parse(localStorage.getItem('jobseeker_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        // Only update non-track-selection fields in the stored user data
        // This ensures we don't persist selectedTrack to force users back to selection
        const { selectedTrack, ...otherUpdates } = updates;
        users[userIndex] = { ...users[userIndex], ...otherUpdates };
        localStorage.setItem('jobseeker_users', JSON.stringify(users));
      }
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};