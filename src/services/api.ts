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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  assignedStations: Station[];
  createdAt?: string;
  lastLogin?: string;
  permissions?: string[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  stationIds: string[];
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

  // Utility to remove circular references from objects
  private removeCircularReferences(obj: any, seen = new WeakSet()): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (seen.has(obj)) {
      return '[Circular]';
    }

    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map(item => this.removeCircularReferences(item, seen));
    }

    const cleaned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cleaned[key] = this.removeCircularReferences(obj[key], seen);
      }
    }

    seen.delete(obj);
    return cleaned;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        // Get raw text first to handle malformed JSON
        const responseText = await response.text();
        console.log('🔍 Raw response text:', responseText.substring(0, 500) + '...');
        
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('✅ JSON parsed successfully');
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError);
          console.error('❌ Failed text preview:', responseText.substring(0, 200) + '...');
          
          // Handle circular reference patterns
          let cleanedJson = responseText;
          
          // Pattern 1: Remove excessive closing brackets ]}]}]}]}]
          if (responseText.includes(']}]}]}]')) {
            console.log('⚠️ Detected excessive closing brackets, cleaning...');
            cleanedJson = responseText.replace(/(\]\}){2,}\}*$/g, '}');
          }
          
          // Pattern 2: Try to extract valid JSON before circular reference starts
          const circularMatch = responseText.match(/^(\[.*?\]|\{.*?\}?)(?:\]\})*$/);
          if (circularMatch && circularMatch[1]) {
            try {
              // Ensure proper closing for arrays/objects
              let validJson = circularMatch[1];
              if (validJson.startsWith('[') && !validJson.endsWith(']')) {
                validJson += ']';
              } else if (validJson.startsWith('{') && !validJson.endsWith('}')) {
                validJson += '}';
              }
              
              data = JSON.parse(validJson);
              console.log('✅ Recovery successful with circular reference cleaning');
            } catch (recoveryError) {
              console.error('❌ Recovery attempt failed:', recoveryError);
            }
          }
          
          // If still no data, try the cleaned version
          if (!data) {
            try {
              data = JSON.parse(cleanedJson);
              console.log('✅ Cleaned JSON parsing successful');
            } catch (finalError) {
              return {
                success: false,
                error: `JSON parsing failed: Circular reference detected. Backend needs @JsonIgnore on User-Station relationship.`,
              };
            }
          }
        }
        
        // Clean any circular references from the parsed data
        data = this.removeCircularReferences(data);
        console.log('🧹 Data cleaned of circular references');
        
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
    } catch (error) {
      console.error('❌ Response handling error:', error);
      return {
        success: false,
        error: `Response handling failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    return this.authenticatedRequest<AuthResponse>('/users/me', {
      method: 'GET'
    });
  }

  // User Management
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    console.log('🔍 Fetching all users from /auth/users');
    const response = await this.authenticatedRequest<User[]>('/auth/users', {
      method: 'GET'
    });
    
    // Filter out problematic users causing circular reference
    if (response.success && response.data) {
      const problematicUserId = "54dd9ab7-eec3-4dcd-9f6c-84ebf10a3a09";
      
      // Filter out the known problematic user and any users with circular references
      response.data = response.data.filter(user => {
        // Remove known problematic user
        if (user.id === problematicUserId) {
          console.log(`🚫 Filtered out known problematic user ${user.id}`);
          return false;
        }
        
        // Check for potential circular references in assignedStations
        if (user.assignedStations && Array.isArray(user.assignedStations)) {
          try {
            // Try to stringify the user to detect circular references
            JSON.stringify(user);
            return true;
          } catch (error) {
            console.log(`🚫 Filtered out user ${user.id} due to circular reference`);
            return false;
          }
        }
        
        return true;
      });
      
      console.log(`✅ Returning ${response.data.length} users after filtering`);
    }
    
    return response;
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    console.log('🔍 Creating new user:', userData);
    return this.authenticatedRequest<User>('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData)
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