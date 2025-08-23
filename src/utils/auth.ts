import { AuthResponse } from '@/services/api';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  assignedStations: any[];
  station?: {
    id: string;
    name: string;
    location: string;
    status: string;
    ipAddress: string;
    printerName: string;
    cashDrawer: string;
  };
  loginTime: string;
}

class AuthManager {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'current_user';

  // Save authentication data
  setAuth(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    
    // Transform the response to match our expected user format
    const userData = {
      id: authResponse.id || 0,
      firstName: authResponse.firstName || authResponse.username,
      lastName: authResponse.lastName || '',
      username: authResponse.username,
      email: authResponse.email || `${authResponse.username}@example.com`,
      role: authResponse.role,
      status: authResponse.status || 'Active',
      assignedStations: authResponse.assignedStationIds || [],
      station: authResponse.station,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if token is expired (basic check)
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decode JWT token (without verification - just for expiration check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Clear authentication data
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Update user data (useful when user profile changes)
  updateUser(userData: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
  }

  // Get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }
}

export const authManager = new AuthManager();
