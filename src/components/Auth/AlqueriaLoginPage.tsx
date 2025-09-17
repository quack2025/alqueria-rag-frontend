// AlqueriaLoginPage.tsx - Página de login para el sistema Alquería
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Milk, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth';

const AlqueriaLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Usuarios autorizados del sistema
      const validUsers = {
        'juan@genius-labs.com.co': 'genius2025',
        'daniela.correa@alqueria.com.co': 'alqueria2025',
        'juan.motta@alqueria.com.co': 'alqueria2025',
        'pruebas@genius-labs.com.co': 'genius2025'
      };

      if (validUsers[username] === password) {
        login(username);
        navigate('/', { replace: true });
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-alqueria-50 via-white to-alqueria-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-gradient-to-r from-alqueria-600 to-alqueria-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Milk className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Sistema RAG Alquería
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inteligencia Láctea Especializada
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-alqueria-500 focus:border-transparent"
                  placeholder="Ingresa tu usuario"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-alqueria-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-alqueria-600 hover:bg-alqueria-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alqueria-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          © 2025 Alquería - Sistema RAG Inteligente para el Sector Lácteo
        </p>
      </div>
    </div>
  );
};

export default AlqueriaLoginPage;