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

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'CASHIER';
  stationIds?: string[]; // Set<UUID> in backend
}

export interface User {
  id: string; // UUID in backend
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'CASHIER';
  enabled: boolean;
  assignedStations?: Station[];
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

export interface Store {
  id?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  status: string;
  zipCode: string;
  email: string;
  website: string;
}

export interface Station {
  id?: string;
  name: string;
  location: string;
  status: string;
  ipAddress: string;
  printerName: string;
  cashDrawer: string;
  // Additional fields that might be useful for the frontend
  assignedUsers?: string[];
  lastActivity?: string;
}

export interface LoginHistory {
  id?: string;
  userId: string;
  username: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  userAgent?: string;
  sessionDuration?: number;
  status?: string; // Made optional since it might be undefined from API
  stationId?: string;
  stationName?: string;
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

  // User Management endpoints
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    console.log('🔍 Making GET request to:', `${API_BASE_URL}/auth/users`);
    console.log('🔑 Auth headers:', this.getAuthHeaders());
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      const result = await this.handleResponse<User[]>(response);
      console.log('📝 Get All Users API Response:', result);
      return result;
    } catch (error) {
      console.error('❌ Get All Users Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async createUser(user: CreateUserRequest): Promise<ApiResponse<User>> {
    console.log('🔍 Making POST request to:', `${API_BASE_URL}/auth/users`);
    console.log('📋 User data:', user);
    console.log('🔑 Auth headers:', this.getAuthHeaders());
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(user),
      });
      
      const result = await this.handleResponse<User>(response);
      console.log('📝 Create User API Response:', result);
      return result;
    } catch (error) {
      console.error('❌ Create User Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<AuthResponse>> {
    return this.authenticatedRequest<AuthResponse>('/users/me', {
      method: 'GET'
    });
  }

  // Store Management
  async getStores(): Promise<ApiResponse<Store[]>> {
    return this.authenticatedRequest<Store[]>('/admin/stores', {
      method: 'GET'
    });
  }

  async getStore(id: string): Promise<ApiResponse<Store>> {
    return this.authenticatedRequest<Store>(`/admin/stores/${id}`, {
      method: 'GET'
    });
  }

  async createStore(store: Omit<Store, 'id'>): Promise<ApiResponse<Store>> {
    return this.authenticatedRequest<Store>('/admin/stores', {
      method: 'POST',
      body: JSON.stringify(store),
    });
  }

  async updateStore(id: string, store: Omit<Store, 'id'>): Promise<ApiResponse<Store>> {
    return this.authenticatedRequest<Store>(`/admin/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(store),
    });
  }

  async deleteStore(id: string): Promise<ApiResponse<void>> {
    return this.authenticatedRequest<void>(`/admin/stores/${id}`, {
      method: 'DELETE',
    });
  }

  // Station Management
  async getStations(): Promise<ApiResponse<Station[]>> {
    return this.authenticatedRequest<Station[]>('/admin/stations', {
      method: 'GET'
    });
  }

  async getStation(id: string): Promise<ApiResponse<Station>> {
    return this.authenticatedRequest<Station>(`/admin/stations/${id}`, {
      method: 'GET'
    });
  }

  async createStation(station: Omit<Station, 'id'>): Promise<ApiResponse<Station>> {
    return this.authenticatedRequest<Station>('/admin/stations', {
      method: 'POST',
      body: JSON.stringify(station),
    });
  }

  async updateStation(id: string, station: Omit<Station, 'id'>): Promise<ApiResponse<Station>> {
    return this.authenticatedRequest<Station>(`/admin/stations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(station),
    });
  }

  async deleteStation(id: string): Promise<ApiResponse<void>> {
    return this.authenticatedRequest<void>(`/admin/stations/${id}`, {
      method: 'DELETE',
    });
  }

  // Login History
  async getLoginHistory(): Promise<ApiResponse<LoginHistory[]>> {
    console.log('🔍 Making GET request to:', `${API_BASE_URL}/admin/loginHistory`);
    console.log('🔑 Auth headers:', this.getAuthHeaders());
    
    const result = await this.authenticatedRequest<LoginHistory[]>('/admin/loginHistory', {
      method: 'GET'
    });
    
    console.log('📝 API Response:', result);
    return result;
  }

  // Test API connection
  async testConnection(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return {
          success: true,
          data: { status: 'connected', url: API_BASE_URL }
        };
      } else {
        return {
          success: false,
          error: `API not reachable: ${response.status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  // Generic authenticated request method
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const defaultOptions: RequestInit = {
        method: 'GET', // Default method
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send credentials unless needed
        ...options
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
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
