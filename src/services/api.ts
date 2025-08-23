const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://159.65.30.119:8080/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  assignedStationIds?: string[];
}

export interface SigninRequest {
  username: string;
  password: string;
  stationId?: string;
}

export interface AuthResponse {
  token: string;
  type?: string | null;
  username: string;
  role: string;
  assignedStationIds: string[];
  // Optional fields that might be present
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
  station?: {
    id: string;
    name: string;
    location: string;
    status: string;
    ipAddress: string;
    printerName: string;
    cashDrawer: string;
  };
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
        };
      }
      
      return {
        success: true,
        data,
      };
    } else {
      const text = await response.text();
      
      if (!response.ok) {
        return {
          success: false,
          error: text || `HTTP ${response.status}`,
        };
      }
      
      return {
        success: true,
        data: text as T,
      };
    }
  }

  // Authentication endpoints
  async signup(request: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      return this.handleResponse<AuthResponse>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async signin(request: SigninRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      return this.handleResponse<AuthResponse>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<AuthResponse>> {
    return this.authenticatedRequest<AuthResponse>('/users/me');
  }

  // Generic authenticated request method
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });
      
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }
}

export const apiService = new ApiService();
