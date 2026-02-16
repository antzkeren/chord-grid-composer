import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { User, LoginRequest, RegisterRequest, GoogleLoginRequest } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  googleLogin: (data: GoogleLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isAuthenticated = !!user;

  // Initialize auth state from localStorage (only once)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const savedUser = authService.getUser();

        if (token && savedUser) {
          setUser(savedUser);
          // Optionally validate token with backend
          try {
            const currentUser = await authService.getMe();
            setUser(currentUser);
            authService.saveAuth(currentUser, token);
          } catch {
            // Token invalid, clear auth
            authService.clearAuth();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuth();
      } finally {
        setIsLoading(false);
        setHasInitialized(true);
      }
    };

    if (!hasInitialized) {
      initAuth();
    }
  }, [hasInitialized]);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setUser(response.user);
    authService.saveAuth(response.user, response.token);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.user);
    authService.saveAuth(response.user, response.token);
  };

  const googleLogin = async (data: GoogleLoginRequest) => {
    const response = await authService.googleLogin(data);
    setUser(response.user);
    authService.saveAuth(response.user, response.token);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearAuth();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const currentUser = await authService.getMe();
    setUser(currentUser);
    const token = authService.getToken();
    if (token) {
      authService.saveAuth(currentUser, token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
