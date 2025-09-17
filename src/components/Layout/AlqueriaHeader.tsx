import React from 'react';
import { Milk, Activity, RefreshCw } from 'lucide-react';

interface AlqueriaHeaderProps {
  backendHealth: any;
  onRefreshHealth: () => void;
}

export const AlqueriaHeader: React.FC<AlqueriaHeaderProps> = ({
  backendHealth,
  onRefreshHealth
}) => {
  const isHealthy = backendHealth?.status === 'healthy';
  const documentsCount = backendHealth?.documents_available || 734;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-alqueria-600 rounded-lg flex items-center justify-center">
              <Milk className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Sistema RAG Alquería
              </h1>
              <p className="text-sm text-gray-500">
                Inteligencia Láctea Especializada
              </p>
            </div>
          </div>

          {/* Estado del backend */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Activity
                  className={`h-4 w-4 ${
                    isHealthy ? 'text-green-500' : 'text-red-500'
                  }`}
                />
                <span className="text-sm font-medium">
                  {isHealthy ? 'Activo' : 'Desconectado'}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                {documentsCount} docs
              </div>

              <button
                onClick={onRefreshHealth}
                className="p-1 hover:bg-gray-100 rounded"
                title="Actualizar estado"
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Indicador visual del estado */}
            <div
              className={`w-3 h-3 rounded-full ${
                isHealthy ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
          </div>
        </div>

        {/* Información adicional del backend */}
        {backendHealth && (
          <div className="mt-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
            <div className="flex items-center justify-between">
              <span>
                Backend: {backendHealth.service || 'Alquería RAG Production'}
              </span>
              <span>
                Índice: {backendHealth.search_index || 'alqueria-documents'}
              </span>
              <span>
                Última actualización: {backendHealth.timestamp ?
                  new Date(backendHealth.timestamp).toLocaleTimeString('es-ES') :
                  'Desconocido'
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};