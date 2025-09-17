// App.tsx - Sistema Alquería RAG con estructura completa como Unilever
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import LoginPage from './components/Auth/AlqueriaLoginPage';
import AlqueriaModuleSelector from './components/Landing/AlqueriaModuleSelector';
import AlqueriaIntelligentRAGModule from './components/Modules/AlqueriaIntelligentRAGModule';
import AlqueriaCreativeModule from './components/Modules/AlqueriaCreativeModule';
import AlqueriaInnovationLab from './components/Modules/AlqueriaInnovationLab';
import { cn } from './lib/utils';

// Componente de ruta protegida
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Componente de ruta pública (solo para no autenticados)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Log de inicialización
    console.log('🥛 Alquería RAG System iniciado');
    console.log('🔐 Usuario autenticado:', isAuthenticated());

    // Configurar título de la página
    document.title = 'Alquería RAG Intelligence System';

    // Agregar clase al body para estilos globales
    document.body.classList.add('alqueria-rag-app');

    return () => {
      document.body.classList.remove('alqueria-rag-app');
    };
  }, [isAuthenticated]);

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-alqueria-50 to-white font-sans antialiased')}>
      <Router>
        <Routes>
          {/* Ruta principal - Selector de módulos para usuarios autenticados */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <ProtectedRoute>
                  <AlqueriaModuleSelector />
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas - Módulos individuales */}
          <Route
            path="/intelligent"
            element={
              <ProtectedRoute>
                <AlqueriaIntelligentRAGModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/creative"
            element={
              <ProtectedRoute>
                <AlqueriaCreativeModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/innovation-lab"
            element={
              <ProtectedRoute>
                <AlqueriaInnovationLab />
              </ProtectedRoute>
            }
          />

          {/* Callback para magic link (futuro) */}
          <Route
            path="/auth/callback"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Página 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-alqueria-50 to-white">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Página no encontrada</p>
                  <button
                    onClick={() => window.history.back()}
                    className="btn-primary"
                  >
                    Volver atrás
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>

      {/* Debug info en desarrollo */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          <div>ENV: {import.meta.env.MODE}</div>
          <div>AUTH: {isAuthenticated() ? '✅' : '❌'}</div>
          <div>API: {import.meta.env.VITE_API_URL || 'https://alqueria-rag-backend-production.up.railway.app'}</div>
        </div>
      )}
    </div>
  );
};

export default App;