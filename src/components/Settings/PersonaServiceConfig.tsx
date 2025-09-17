// components/Settings/PersonaServiceConfig.tsx - Configuración del servicio de personas

import React, { useState, useEffect } from 'react';
import { Settings, Cloud, Server, Cpu, Key, CheckCircle, AlertCircle } from 'lucide-react';
import ColombianPersonaService from '../../services/colombianPersonaService';

interface PersonaServiceConfigProps {
  onClose?: () => void;
}

export const PersonaServiceConfig: React.FC<PersonaServiceConfigProps> = ({ onClose }) => {
  const [config, setConfig] = useState(ColombianPersonaService.getConfig());
  const [azureApiKey, setAzureApiKey] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Obtener configuración actual
    setConfig(ColombianPersonaService.getConfig());
  }, []);

  const handleToggleAzure = () => {
    const newValue = !config.useAzureDirect;
    ColombianPersonaService.setUseAzureDirect(newValue);
    setConfig(prev => ({ ...prev, useAzureDirect: newValue }));
  };

  const handleToggleBackend = () => {
    const newValue = !config.useBackendRAG;
    ColombianPersonaService.setUseBackendRAG(newValue);
    setConfig(prev => ({ ...prev, useBackendRAG: newValue }));
  };

  const handleSetAzureKey = () => {
    if (azureApiKey.trim()) {
      ColombianPersonaService.setAzureApiKey(azureApiKey);
      alert('API Key configurada correctamente');
    }
  };

  const handleTestConnection = async () => {
    if (!testMessage.trim()) return;
    
    setIsTesting(true);
    setTestResult(null);

    try {
      const personaService = ColombianPersonaService.getInstance();
      const response = await personaService.sendMessage({
        query: testMessage,
        archetype: 'MADRE_MODERNA' as any
      });
      
      setTestResult(`✅ Test exitoso: ${response.response.substring(0, 200)}...`);
    } catch (error) {
      setTestResult(`❌ Error: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">🇨🇴 Sistema Completo de Personas Colombianas</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Method Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Método de Conexión</h3>
            
            {/* Azure Direct Option */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Genius Bot by Insight Genius</h4>
                    <p className="text-sm text-gray-600">
                      Conexión directa a Genius Bot con system prompts personalizados
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleAzure}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.useAzureDirect ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.useAzureDirect ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {config.useAzureDirect && (
                <div className="border-t border-gray-100 pt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key de Genius Bot
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={azureApiKey}
                      onChange={(e) => setAzureApiKey(e.target.value)}
                      placeholder="Ingresa tu API key de Genius Bot"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                      onClick={handleSetAzureKey}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      <Key className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tu API key se almacena localmente y no se envía a ningún servidor externo
                  </p>
                </div>
              )}
            </div>

            {/* Backend RAG Option */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Backend RAG Colombiano (Railway)</h4>
                    <p className="text-sm text-gray-600">
                      Sistema completo con 80+ variables por persona - Contexto cultural colombiano y marcas Unilever
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleBackend}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.useBackendRAG ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.useBackendRAG ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {config.useBackendRAG && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Endpoint: https://web-production-ef8db.up.railway.app/api/synthetic/chat</span>
                  </div>
                </div>
              )}
            </div>

            {/* Fallback Info */}
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Cpu className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Respuestas Simuladas (Fallback)</h4>
                  <p className="text-sm text-yellow-700">
                    Se usan automáticamente si fallan los métodos principales. 
                    Respuestas predefinidas para demostración.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Probar Configuración</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje de prueba
                </label>
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="¿Qué opinas de la marca Dove?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <button
                onClick={handleTestConnection}
                disabled={isTesting || !testMessage.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? 'Probando...' : 'Probar Conexión'}
              </button>

              {testResult && (
                <div className={`p-3 rounded-md text-sm ${
                  testResult.startsWith('✅') 
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {testResult}
                </div>
              )}
            </div>
          </div>

          {/* Current Config Display */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración Actual</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Genius Bot by Insight Genius:</span>
                  <span className={`font-medium ${config.useAzureDirect ? 'text-blue-600' : 'text-gray-500'}`}>
                    {config.useAzureDirect ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Backend RAG:</span>
                  <span className={`font-medium ${config.useBackendRAG ? 'text-green-600' : 'text-gray-500'}`}>
                    {config.useBackendRAG ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Orden de prioridad:</span>
                  <span className="text-gray-600">
                    {config.useAzureDirect ? '1. Azure → ' : ''}
                    {config.useBackendRAG ? '2. Backend RAG → ' : ''}
                    3. Simulado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end">
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};