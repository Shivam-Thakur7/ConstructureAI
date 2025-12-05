const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class AuthService {
  async getGoogleAuthUrl() {
    try {
      const response = await fetch(`${API_URL}/auth/google/login`);
      if (!response.ok) {
        throw new Error('Failed to get auth URL');
      }
      const data = await response.json();
      return data.authorization_url;
    } catch (error) {
      console.error('Get auth URL error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No auth token');
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          throw new Error('Session expired');
        }
        throw new Error('Failed to get user data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token even if request fails
      localStorage.removeItem('auth_token');
      throw error;
    }
  }

  async checkPermissions() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return false;
      }

      const response = await fetch(`${API_URL}/auth/check-permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.all_permissions_granted;
    } catch (error) {
      console.error('Check permissions error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
