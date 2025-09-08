// components/Config/StrategicConfigPanel.tsx - Panel de configuración estratégica

import React from 'react';
import { X, Target, TrendingUp, Zap, Lightbulb, BarChart3, Eye, Brain } from 'lucide-react';

export interface StrategicConfig {
  analysisType: 'descriptive' | 'strategic' | 'competitive' | 'innovation';
  insightDepth: 'surface' | 'deep' | 'expert';
  enableCrossDocumentAnalysis: boolean;
  enableTrendAnalysis: boolean;
  includeRecommendations: boolean;
  maxChunks: number;
}

interface StrategicConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: StrategicConfig;
  onChange: (config: StrategicConfig) => void;
}

const ANALYSIS_TYPES = [
  {
    id: 'descriptive' as const,
    name: 'Descriptivo',
    icon: Eye,
    color: 'text-blue-600 bg-blue-50',
    description: 'Análisis directo basado en datos disponibles'
  },
  {
    id: 'strategic' as const,
    name: 'Estratégico',
    icon: Target,
    color: 'text-purple-600 bg-purple-50',
    description: 'Análisis multicapa con framework estratégico'
  },
  {
    id: 'competitive' as const,
    name: 'Competitivo', 
    icon: TrendingUp,
    color: 'text-green-600 bg-green-50',
    description: 'Inteligencia competitiva y posicionamiento'
  },
  {
    id: 'innovation' as const,
    name: 'Innovación',
    icon: Lightbulb,
    color: 'text-orange-600 bg-orange-50',
    description: 'Identificación de oportunidades y gaps'
  }
];

const INSIGHT_DEPTHS = [
  {
    id: 'surface' as const,
    name: 'Resumen Ejecutivo',
    icon: BarChart3,
    description: 'Insights clave de forma concisa'
  },
  {
    id: 'deep' as const,
    name: 'Análisis Profundo',
    icon: Brain,
    description: 'Múltiples perspectivas y contexto'
  },
  {
    id: 'expert' as const,
    name: 'Nivel Experto',
    icon: Zap,
    description: 'Análisis exhaustivo con recomendaciones específicas'
  }
];

const StrategicConfigPanel: React.FC<StrategicConfigPanelProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
}) => {
  if (!isOpen) return null;

  const handleConfigChange = (updates: Partial<StrategicConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Configuración Estratégica
              </h2>
              <p className="text-sm text-gray-600">
                Personaliza tu análisis para insights más profundos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Tipo de Análisis */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              🎯 Tipo de Análisis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ANALYSIS_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleConfigChange({ analysisType: type.id })}
                    className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                      config.analysisType === type.id
                        ? type.color + ' border-current'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <p className="text-sm opacity-75">
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profundidad de Insights */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              🔍 Profundidad de Análisis
            </h3>
            <div className="space-y-2">
              {INSIGHT_DEPTHS.map((depth) => {
                const Icon = depth.icon;
                return (
                  <button
                    key={depth.id}
                    onClick={() => handleConfigChange({ insightDepth: depth.id })}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                      config.insightDepth === depth.id
                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{depth.name}</div>
                        <div className="text-sm opacity-75">{depth.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Opciones Avanzadas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ⚙️ Opciones Avanzadas
            </h3>
            <div className="space-y-4">
              {/* Cross-Document Analysis */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    Análisis Cruzado de Documentos
                  </div>
                  <div className="text-sm text-gray-600">
                    Conecta información de múltiples fuentes para insights más profundos
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableCrossDocumentAnalysis}
                    onChange={(e) => handleConfigChange({ enableCrossDocumentAnalysis: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Trend Analysis */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    Análisis de Tendencias
                  </div>
                  <div className="text-sm text-gray-600">
                    Identifica patrones evolutivos y proyecciones futuras
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableTrendAnalysis}
                    onChange={(e) => handleConfigChange({ enableTrendAnalysis: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Recommendations */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    Incluir Recomendaciones
                  </div>
                  <div className="text-sm text-gray-600">
                    Genera acciones específicas y estrategias concretas
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeRecommendations}
                    onChange={(e) => handleConfigChange({ includeRecommendations: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Max Chunks */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-900">
                      Documentos a Analizar
                    </div>
                    <div className="text-sm text-gray-600">
                      Cantidad máxima de documentos para el análisis
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-blue-600">
                    {config.maxChunks}
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={15}
                  step={1}
                  value={config.maxChunks}
                  onChange={(e) => handleConfigChange({ maxChunks: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3 (Rápido)</span>
                  <span>9 (Balanceado)</span>
                  <span>15 (Exhaustivo)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-gray-900 mb-2">
              📋 Configuración Actual
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Tipo:</span> {
                  ANALYSIS_TYPES.find(t => t.id === config.analysisType)?.name
                }
              </div>
              <div>
                <span className="font-medium">Profundidad:</span> {
                  INSIGHT_DEPTHS.find(d => d.id === config.insightDepth)?.name
                }
              </div>
              <div>
                <span className="font-medium">Opciones:</span> 
                {config.enableCrossDocumentAnalysis && ' • Análisis Cruzado'}
                {config.enableTrendAnalysis && ' • Tendencias'}
                {config.includeRecommendations && ' • Recomendaciones'}
                {!config.enableCrossDocumentAnalysis && !config.enableTrendAnalysis && !config.includeRecommendations && ' Ninguna'}
              </div>
              <div>
                <span className="font-medium">Documentos:</span> {config.maxChunks}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Aplicar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategicConfigPanel;