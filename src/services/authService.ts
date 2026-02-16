import api from '@/lib/api';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  GoogleLoginRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/auth';

export const authService = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/login', data);
    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/register', data);
    return response.data;
  },

  /**
   * Login with Google OAuth
   */
  async googleLogin(data: GoogleLoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/google-login', data);
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<User> {
    const response = await api.get<User>('/api/user');
    return response.data;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await api.post('/api/logout');
  },

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/api/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/api/reset-password', data);
    return response.data;
  },

  /**
   * Save auth data to localStorage
   */
  saveAuth(user: User, token: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  },

  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  /**
   * Get auth user from localStorage
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Clear auth data from localStorage
   */
  clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
