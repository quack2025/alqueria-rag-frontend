// lib/auth.ts - Sistema de autenticación para Alquería

interface User {
  username: string;
  role: string;
}

export const useAuth = () => {
  const login = (username: string): void => {
    const user: User = {
      username,
      role: 'user'
    };

    const token = `alqueria_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    localStorage.setItem('alqueria_auth_token', token);
    localStorage.setItem('alqueria_user', JSON.stringify(user));

    // Disparar evento personalizado para notificar cambio de autenticación
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { authenticated: true, user } }));
  };

  const logout = () => {
    localStorage.removeItem('alqueria_auth_token');
    localStorage.removeItem('alqueria_user');

    // Disparar evento personalizado para notificar logout
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { authenticated: false, user: null } }));
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('alqueria_auth_token');
  };

  const getUser = (): User | null => {
    const userStr = localStorage.getItem('alqueria_user');
    return userStr ? JSON.parse(userStr) : null;
  };

  return {
    login,
    logout,
    isAuthenticated,
    getUser,
  };
};