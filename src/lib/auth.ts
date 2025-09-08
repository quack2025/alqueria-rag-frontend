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
    // Credenciales locales para acceso rápido
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'unilever', password: 'unilever2024', role: 'user' },
      { username: 'user', password: 'user123', role: 'user' },
      { username: 'demo', password: 'demo', role: 'demo' }
    ];

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    const validUser = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (validUser) {
      const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = {
        username: validUser.username,
        role: validUser.role
      };

      localStorage.setItem('unilever_auth_token', token);
      localStorage.setItem('unilever_user', JSON.stringify(user));

      return {
        success: true,
        token,
        message: 'Login exitoso',
        user
      };
    }

    return {
      success: false,
      message: 'Credenciales incorrectas. Prueba: admin/admin123 o unilever/unilever2024'
    };
  };

  const logout = () => {
    localStorage.removeItem('unilever_auth_token');
    localStorage.removeItem('unilever_user');
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('unilever_auth_token');
  };

  const getUser = () => {
    const userStr = localStorage.getItem('unilever_user');
    return userStr ? JSON.parse(userStr) : null;
  };

  return {
    login,
    logout,
    isAuthenticated,
    getUser,
  };
};