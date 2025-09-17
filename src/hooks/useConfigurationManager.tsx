// hooks/useConfigurationManager.tsx - Centraliza toda la lógica de configuración

import { useState, useCallback } from 'react';
import type { StrategicConfig } from '../components/Config/StrategicConfigPanel';

// Tipos para configuración de respuestas
export interface ResponseSettings {
  extensionLevel: 'resumido' | 'normal' | 'detallado';
  responseStyle: 'ejecutivo' | 'tecnico' | 'comercial';
  enableVisualizations: boolean;
  detailLevel: number;
  language: 'español' | 'inglés';
  targetAudience: 'c-level' | 'gerentes' | 'analistas' | 'operativo';
  includeCitations: boolean;
  temporalContext: 'reciente' | 'completo';
  analysisType: 'descriptivo' | 'predictivo' | 'comparativo';
  outputFormat: 'narrativo' | 'bullets' | 'reporte';
}

// Estados de UI
export interface UIState {
  showFilters: boolean;
  showSearch: boolean;
  showConfig: boolean;
  showAdvancedSettings: boolean;
  showStrategicConfig: boolean;
  showStrategicQuestions: boolean;
}

// Configuración por defecto
const DEFAULT_RESPONSE_SETTINGS: ResponseSettings = {
  extensionLevel: 'normal',
  responseStyle: 'ejecutivo',
  enableVisualizations: true,
  detailLevel: 7,
  language: 'español',
  targetAudience: 'gerentes',
  includeCitations: true,
  temporalContext: 'completo',
  analysisType: 'descriptivo',
  outputFormat: 'narrativo'
};

const DEFAULT_STRATEGIC_CONFIG: StrategicConfig = {
  analysisType: 'strategic',
  insightDepth: 'deep',
  enableCrossDocumentAnalysis: true,
  enableTrendAnalysis: false,
  includeRecommendations: true,
  maxChunks: 8
};

const DEFAULT_UI_STATE: UIState = {
  showFilters: false,
  showSearch: false,
  showConfig: false,
  showAdvancedSettings: false,
  showStrategicConfig: false,
  showStrategicQuestions: false
};

export const useConfigurationManager = () => {
  // Estado de configuraciones
  const [responseSettings, setResponseSettings] = useState<ResponseSettings>(DEFAULT_RESPONSE_SETTINGS);
  const [strategicConfig, setStrategicConfig] = useState<StrategicConfig>(DEFAULT_STRATEGIC_CONFIG);
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [uiState, setUIState] = useState<UIState>(DEFAULT_UI_STATE);

  // Strategic Mode
  const [isStrategicMode, setIsStrategicMode] = useState(false);

  // Funciones para actualizar configuraciones
  const updateResponseSettings = useCallback((updates: Partial<ResponseSettings>) => {
    setResponseSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const updateStrategicConfig = useCallback((updates: Partial<StrategicConfig>) => {
    setStrategicConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateUIState = useCallback((updates: Partial<UIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  }, []);

  // Helper para cerrar todos los modals/drawers
  const closeAllModals = useCallback(() => {
    setUIState(DEFAULT_UI_STATE);
  }, []);

  // Helper para toggle strategic mode
  const toggleStrategicMode = useCallback(() => {
    setIsStrategicMode(prev => !prev);
    // Cerrar configuraciones al cambiar modo
    closeAllModals();
  }, [closeAllModals]);

  // Función para resetear configuraciones
  const resetConfigurations = useCallback(() => {
    setResponseSettings(DEFAULT_RESPONSE_SETTINGS);
    setStrategicConfig(DEFAULT_STRATEGIC_CONFIG);
    setActiveFilters(null);
    setIsStrategicMode(false);
    closeAllModals();
  }, [closeAllModals]);

  // Helper para verificar si hay configuraciones activas (no default)
  const hasActiveConfigurations = useCallback(() => {
    const responseChanged = JSON.stringify(responseSettings) !== JSON.stringify(DEFAULT_RESPONSE_SETTINGS);
    const strategicChanged = JSON.stringify(strategicConfig) !== JSON.stringify(DEFAULT_STRATEGIC_CONFIG);
    const filtersActive = activeFilters && Object.values(activeFilters).flat().filter(v => v).length > 0;
    
    return responseChanged || strategicChanged || filtersActive || isStrategicMode;
  }, [responseSettings, strategicConfig, activeFilters, isStrategicMode]);

  // Helper para conteo de filtros activos
  const getActiveFiltersCount = useCallback(() => {
    if (!activeFilters) return 0;
    return Object.values(activeFilters).flat().filter(v => v).length;
  }, [activeFilters]);

  return {
    // Estados
    responseSettings,
    strategicConfig,
    activeFilters,
    uiState,
    isStrategicMode,
    
    // Funciones de actualización
    updateResponseSettings,
    updateStrategicConfig,
    setActiveFilters,
    updateUIState,
    toggleStrategicMode,
    
    // Helpers
    closeAllModals,
    resetConfigurations,
    hasActiveConfigurations,
    getActiveFiltersCount,
    
    // Configuraciones por defecto para reset
    defaultResponseSettings: DEFAULT_RESPONSE_SETTINGS,
    defaultStrategicConfig: DEFAULT_STRATEGIC_CONFIG
  };
};