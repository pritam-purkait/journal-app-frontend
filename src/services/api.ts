const API_BASE_URL = 'https://journal-app-backend-springboot-obkk.onrender.com/journal';
//http://localhost:8080/journal
//https://journal-app-backend-springboot-obkk.onrender.com/journal

// Add debugging
console.log('API Base URL:', API_BASE_URL);

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return response.text() as unknown as T;
  }

  // Auth endpoints
  async login(credentials: { userName: string; password: string }): Promise<string> {
    console.log('Attempting login to:', `${API_BASE_URL}/public/login`);
    console.log('Credentials:', { userName: credentials.userName, password: '***' });
    
    try {
    const response = await fetch(`${API_BASE_URL}/public/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
      console.log('Login response received:', response);
      
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', response.status, errorText);
      throw new Error('Invalid credentials');
    }
    
    return response.text(); // JWT token as plain text
    } catch (error) {
      console.error('Login fetch error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async signup(userData: { userName: string; password: string; email?: string; sentimentAnalysis?: boolean }) {
    const response = await fetch(`${API_BASE_URL}/public/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    return response.json();
  }

  async healthCheck(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/public/health-check`);
    return response.text();
  }

  // Journal endpoints
  async getAllEntries() {
    const response = await fetch(`${API_BASE_URL}/journal`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async createEntry(entry: { title: string; content: string; sentiment?: string }) {
    const response = await fetch(`${API_BASE_URL}/journal`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(entry)
    });
    return this.handleResponse(response);
  }

  async getEntryById(id: string) {
    const response = await fetch(`${API_BASE_URL}/journal/id/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async updateEntry(id: string, entry: { title: string; content: string; sentiment?: string }) {
    const response = await fetch(`${API_BASE_URL}/journal/id/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(entry)
    });
    return this.handleResponse(response);
  }

  async deleteEntry(id: string) {
    const response = await fetch(`${API_BASE_URL}/journal/id/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to delete entry');
    }
  }

  // User endpoints
  async getUserGreeting() {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<string>(response);
  }

  async updateUser(userData: { userName: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to update user');
    }
  }

  async deleteUser() {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok && response.status !== 204) {
      throw new Error('Failed to delete user');
    }
  }
}

export const apiService = new ApiService();