// components/GeneralModule/ConfigurationDrawer.tsx - Panel lateral unificado para todas las configuraciones

import React from 'react';
import { X, Filter, Settings, Target, Lightbulb, Sliders } from 'lucide-react';
import { cn } from '../../lib/utils';
import AdvancedFilters from '../Filters/AdvancedFilters';
import StrategicConfigPanel, { type StrategicConfig } from '../Config/StrategicConfigPanel';
import StrategicQuestionSuggestions from '../Suggestions/StrategicQuestionSuggestions';
import type { StrategicQuestion } from '../../data/unileverStrategicQuestions';
import type { ResponseSettings, UIState } from '../../hooks/useConfigurationManager';

interface ConfigurationDrawerProps {
  // Estado UI
  uiState: UIState;
  onUIStateChange: (updates: Partial<UIState>) => void;
  
  // Configuraciones
  responseSettings: ResponseSettings;
  onResponseSettingsChange: (updates: Partial<ResponseSettings>) => void;
  strategicConfig: StrategicConfig;
  onStrategicConfigChange: (updates: Partial<StrategicConfig>) => void;
  activeFilters: any;
  onActiveFiltersChange: (filters: any) => void;
  
  // Strategic mode
  isStrategicMode: boolean;
  onStrategicModeToggle: () => void;
  
  // Handlers
  onStrategicQuestionSelect: (question: StrategicQuestion) => void;
  onResetAll: () => void;
}

const ConfigurationDrawer: React.FC<ConfigurationDrawerProps> = ({
  uiState,
  onUIStateChange,
  responseSettings,
  onResponseSettingsChange,
  strategicConfig,
  onStrategicConfigChange,
  activeFilters,
  onActiveFiltersChange,
  isStrategicMode,
  onStrategicModeToggle,
  onStrategicQuestionSelect,
  onResetAll
}) => {
  const isOpen = Object.values(uiState).some(Boolean);
  
  const closeAll = () => {
    onUIStateChange({
      showFilters: false,
      showSearch: false,
      showConfig: false,
      showAdvancedSettings: false,
      showStrategicConfig: false,
      showStrategicQuestions: false
    });
  };

  const tabs = [
    {
      key: 'showFilters',
      label: 'Filtros',
      icon: Filter,
      active: uiState.showFilters
    },
    {
      key: 'showAdvancedSettings',
      label: 'Respuestas',
      icon: Sliders,
      active: uiState.showAdvancedSettings
    },
    {
      key: 'showStrategicConfig',
      label: 'Estratégico',
      icon: Target,
      active: uiState.showStrategicConfig,
      disabled: !isStrategicMode
    },
    {
      key: 'showStrategicQuestions',
      label: 'Preguntas',
      icon: Lightbulb,
      active: uiState.showStrategicQuestions,
      disabled: !isStrategicMode
    },
    {
      key: 'showConfig',
      label: 'General',
      icon: Settings,
      active: uiState.showConfig
    }
  ];

  const activeTab = tabs.find(tab => tab.active);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={closeAll}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab?.label || 'Configuración'}
            </h2>
            <button
              onClick={closeAll}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => onUIStateChange({ [tab.key]: !tab.active })}
                  disabled={tab.disabled}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    tab.active
                      ? "bg-blue-100 text-blue-700"
                      : tab.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Filters */}
          {uiState.showFilters && (
            <div className="p-6">
              <AdvancedFilters
                filters={activeFilters}
                onFiltersChange={onActiveFiltersChange}
              />
            </div>
          )}

          {/* Advanced Settings */}
          {uiState.showAdvancedSettings && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nivel de extensión
                  </label>
                  <select
                    value={responseSettings.extensionLevel}
                    onChange={(e) => onResponseSettingsChange({ 
                      extensionLevel: e.target.value as ResponseSettings['extensionLevel'] 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="resumido">Resumido</option>
                    <option value="normal">Normal</option>
                    <option value="detallado">Detallado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Estilo de respuesta
                  </label>
                  <select
                    value={responseSettings.responseStyle}
                    onChange={(e) => onResponseSettingsChange({ 
                      responseStyle: e.target.value as ResponseSettings['responseStyle'] 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ejecutivo">Ejecutivo</option>
                    <option value="tecnico">Técnico</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Audiencia objetivo
                  </label>
                  <select
                    value={responseSettings.targetAudience}
                    onChange={(e) => onResponseSettingsChange({ 
                      targetAudience: e.target.value as ResponseSettings['targetAudience'] 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="c-level">C-Level</option>
                    <option value="gerentes">Gerentes</option>
                    <option value="analistas">Analistas</option>
                    <option value="operativo">Operativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nivel de detalle: {responseSettings.detailLevel}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={responseSettings.detailLevel}
                    onChange={(e) => onResponseSettingsChange({ 
                      detailLevel: parseInt(e.target.value) 
                    })}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Incluir visualizaciones
                  </label>
                  <input
                    type="checkbox"
                    checked={responseSettings.enableVisualizations}
                    onChange={(e) => onResponseSettingsChange({ 
                      enableVisualizations: e.target.checked 
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Incluir citas
                  </label>
                  <input
                    type="checkbox"
                    checked={responseSettings.includeCitations}
                    onChange={(e) => onResponseSettingsChange({ 
                      includeCitations: e.target.checked 
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Strategic Config */}
          {uiState.showStrategicConfig && isStrategicMode && (
            <div className="p-6">
              <StrategicConfigPanel
                config={strategicConfig}
                onConfigChange={onStrategicConfigChange}
              />
            </div>
          )}

          {/* Strategic Questions */}
          {uiState.showStrategicQuestions && isStrategicMode && (
            <div className="p-6">
              <StrategicQuestionSuggestions
                onQuestionSelect={onStrategicQuestionSelect}
              />
            </div>
          )}

          {/* General Config */}
          {uiState.showConfig && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Módulo RAG General
                  </h4>
                  <p className="text-sm text-blue-700">
                    Análisis basado en documentos reales de Unilever Colombia. 
                    Incluye datos de marcas, comportamiento del consumidor y tendencias de mercado.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Modo estratégico
                    </label>
                    <button
                      onClick={onStrategicModeToggle}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        isStrategicMode
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {isStrategicMode ? 'Activado' : 'Desactivado'}
                    </button>
                  </div>

                  <button
                    onClick={onResetAll}
                    className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Resetear todas las configuraciones
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfigurationDrawer;