// lib/auth.ts - Sistema de autenticación simple

interface LoginResponse {
  success: boolean;
  token?: string;
  message: string;
  user?: {
    username: string;
    role: string;
  };
}

export const useAuth = () => {
  const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      // Fallback authentication for Unilever
      const fallbackAuth = {
        'admin': 'admin123',
        'user': 'user123',
        'unilever': 'unilever2024',
        'tigo': 'tigo2024'
      };

      // Check fallback first
      if (fallbackAuth[username] && fallbackAuth[username] === password) {
        const fallbackUser = {
          username: username,
          role: username === 'admin' ? 'admin' : 'user'
        };
        const fallbackToken = btoa(`${username}:${password}:${Date.now()}`);
        
        localStorage.setItem('tigo_auth_token', fallbackToken);
        localStorage.setItem('tigo_user', JSON.stringify(fallbackUser));
        
        return {
          success: true,
          token: fallbackToken,
          message: 'Login exitoso (local)',
          user: fallbackUser
        };
      }


      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('tigo_auth_token', data.token);
        localStorage.setItem('tigo_user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('tigo_auth_token');
    localStorage.removeItem('tigo_user');
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('tigo_auth_token');
  };

  const getUser = () => {
    const userStr = localStorage.getItem('tigo_user');
    return userStr ? JSON.parse(userStr) : null;
  };

  return {
    login,
    logout,
    isAuthenticated,
    getUser,
  };
};