// FilterIntegration.tsx - Integración de filtros avanzados con módulos RAG
// Conecta AdvancedFilters con IntelligentRAGModule aplicando mejoras de TIGO

import React, { useState, useEffect } from 'react';
import { Filter, Sparkles, Zap, TrendingUp } from 'lucide-react';
import AdvancedFilters from './AdvancedFilters';
import { unileverFilterService, type UnileverFilterState } from '../../services/unileverFilterService';
import { cn } from '../../lib/utils';

interface FilterIntegrationProps {
  onFilteredQuery: (query: string, filters: UnileverFilterState) => Promise<any>;
  currentQuery?: string;
  className?: string;
}

const FilterIntegration: React.FC<FilterIntegrationProps> = ({
  onFilteredQuery,
  currentQuery = '',
  className
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<UnileverFilterState>({
    regions: [],
    years: [],
    brands: [],
    categories: [],
    methodologies: [],
    studyTypes: [],
    audienceSegments: [],
    minConfidence: 0,
    ragPercentage: 60
  });
  const [suggestedFilters, setSuggestedFilters] = useState<Partial<UnileverFilterState>>({});

  // Generar sugerencias cuando cambia el query
  useEffect(() => {
    if (currentQuery && currentQuery.length > 10) {
      const suggestions = unileverFilterService.suggestFilters(currentQuery);
      setSuggestedFilters(suggestions);
    } else {
      setSuggestedFilters({});
    }
  }, [currentQuery]);

  const hasActiveFilters = () => {
    return activeFilters.regions.length > 0 || 
           activeFilters.years.length > 0 || 
           activeFilters.brands.length > 0 ||
           activeFilters.categories.length > 0 ||
           activeFilters.methodologies.length > 0 ||
           activeFilters.studyTypes.length > 0 ||
           activeFilters.audienceSegments.length > 0 ||
           activeFilters.minConfidence > 0 ||
           activeFilters.ragPercentage !== 60;
  };

  const getActiveFiltersCount = () => {
    return activeFilters.regions.length + 
           activeFilters.years.length + 
           activeFilters.brands.length +
           activeFilters.categories.length +
           activeFilters.methodologies.length +
           activeFilters.studyTypes.length +
           activeFilters.audienceSegments.length +
           (activeFilters.minConfidence > 0 ? 1 : 0) +
           (activeFilters.ragPercentage !== 60 ? 1 : 0);
  };

  const getRagBalanceLabel = (percentage: number) => {
    if (percentage >= 80) return 'Documentos';
    if (percentage >= 60) return 'Híbrido Doc';
    if (percentage >= 40) return 'Balanceado';
    if (percentage >= 20) return 'Híbrido Cre';
    return 'Inferencial';
  };

  const getRagBalanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-blue-700 bg-blue-100';
    if (percentage >= 60) return 'text-green-700 bg-green-100';
    if (percentage >= 40) return 'text-purple-700 bg-purple-100';
    if (percentage >= 20) return 'text-orange-700 bg-orange-100';
    return 'text-pink-700 bg-pink-100';
  };

  const applyFilters = (newFilters: UnileverFilterState) => {
    setActiveFilters(newFilters);
    
    // Si hay un query activo, ejecutar búsqueda filtrada inmediatamente
    if (currentQuery) {
      handleFilteredSearch(currentQuery, newFilters);
    }
  };

  const applySuggestions = () => {
    const merged = {
      ...activeFilters,
      ...suggestedFilters
    };
    setActiveFilters(merged);
    
    if (currentQuery) {
      handleFilteredSearch(currentQuery, merged);
    }
  };

  const clearFilters = () => {
    const defaultFilters: UnileverFilterState = {
      regions: [],
      years: [],
      brands: [],
      categories: [],
      methodologies: [],
      studyTypes: [],
      audienceSegments: [],
      minConfidence: 0,
      ragPercentage: 60
    };
    setActiveFilters(defaultFilters);
  };

  const handleFilteredSearch = async (query: string, filters: UnileverFilterState) => {
    try {
      await onFilteredQuery(query, filters);
    } catch (error) {
      console.error('Error in filtered search:', error);
    }
  };

  const hasSuggestions = () => {
    return Object.values(suggestedFilters).some(v => 
      Array.isArray(v) ? v.length > 0 : v !== undefined && v !== 0 && v !== 60
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Control Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          {/* Botón principal de filtros */}
          <button
            onClick={() => setIsFiltersOpen(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
              hasActiveFilters()
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filtros Avanzados</span>
            {hasActiveFilters() && (
              <span className="bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>

          {/* Sugerencias automáticas */}
          {hasSuggestions() && (
            <button
              onClick={applySuggestions}
              className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg border border-amber-300 hover:bg-amber-200 transition-colors text-sm"
            >
              <Sparkles className="h-3 w-3" />
              <span>Aplicar sugerencias</span>
            </button>
          )}

          {/* Limpiar filtros */}
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Estado actual */}
        <div className="flex items-center gap-3">
          {hasActiveFilters() && (
            <>
              <div className="text-sm text-gray-600">
                {getActiveFiltersCount()} filtros activos
              </div>
              
              <div className={cn(
                "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                getRagBalanceColor(activeFilters.ragPercentage)
              )}>
                <Zap className="h-3 w-3" />
                {getRagBalanceLabel(activeFilters.ragPercentage)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Resumen de filtros activos */}
      {hasActiveFilters() && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-900">
              Configuración Activa
            </div>
            <div className="text-xs text-gray-500">
              Balance: {activeFilters.ragPercentage}% datos + {100 - activeFilters.ragPercentage}% análisis
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {activeFilters.brands.length > 0 && (
              <div>
                <div className="font-medium text-blue-700 mb-1">Marcas ({activeFilters.brands.length})</div>
                <div className="text-gray-600">{activeFilters.brands.slice(0, 3).join(', ')}{activeFilters.brands.length > 3 && ` +${activeFilters.brands.length - 3}`}</div>
              </div>
            )}

            {activeFilters.categories.length > 0 && (
              <div>
                <div className="font-medium text-purple-700 mb-1">Categorías ({activeFilters.categories.length})</div>
                <div className="text-gray-600">{activeFilters.categories.slice(0, 2).join(', ')}{activeFilters.categories.length > 2 && ` +${activeFilters.categories.length - 2}`}</div>
              </div>
            )}

            {activeFilters.audienceSegments.length > 0 && (
              <div>
                <div className="font-medium text-green-700 mb-1">Audiencias ({activeFilters.audienceSegments.length})</div>
                <div className="text-gray-600">{activeFilters.audienceSegments.slice(0, 2).join(', ')}{activeFilters.audienceSegments.length > 2 && ` +${activeFilters.audienceSegments.length - 2}`}</div>
              </div>
            )}

            {activeFilters.regions.length > 0 && (
              <div>
                <div className="font-medium text-indigo-700 mb-1">Regiones ({activeFilters.regions.length})</div>
                <div className="text-gray-600">{activeFilters.regions.slice(0, 2).join(', ')}{activeFilters.regions.length > 2 && ` +${activeFilters.regions.length - 2}`}</div>
              </div>
            )}

            {activeFilters.years.length > 0 && (
              <div>
                <div className="font-medium text-orange-700 mb-1">Período</div>
                <div className="text-gray-600">{Math.min(...activeFilters.years)}-{Math.max(...activeFilters.years)}</div>
              </div>
            )}

            {activeFilters.minConfidence > 0 && (
              <div>
                <div className="font-medium text-gray-700 mb-1">Confianza Mínima</div>
                <div className="text-gray-600">≥{activeFilters.minConfidence}%</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sugerencias basadas en query */}
      {hasSuggestions() && !hasActiveFilters() && (
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <div className="text-sm font-medium text-amber-900">
              Sugerencias de Filtrado
            </div>
          </div>
          
          <div className="text-xs text-amber-700 mb-3">
            Basado en tu consulta "{currentQuery.slice(0, 50)}..."
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {suggestedFilters.brands && suggestedFilters.brands.length > 0 && (
              <div className="bg-white rounded p-2 border border-amber-200">
                <div className="font-medium text-blue-700">Marcas Detectadas</div>
                <div className="text-gray-600">{suggestedFilters.brands.join(', ')}</div>
              </div>
            )}

            {suggestedFilters.categories && suggestedFilters.categories.length > 0 && (
              <div className="bg-white rounded p-2 border border-amber-200">
                <div className="font-medium text-purple-700">Categorías</div>
                <div className="text-gray-600">{suggestedFilters.categories.join(', ')}</div>
              </div>
            )}

            {suggestedFilters.audienceSegments && suggestedFilters.audienceSegments.length > 0 && (
              <div className="bg-white rounded p-2 border border-amber-200">
                <div className="font-medium text-green-700">Audiencias</div>
                <div className="text-gray-600">{suggestedFilters.audienceSegments.join(', ')}</div>
              </div>
            )}

            {suggestedFilters.ragPercentage && suggestedFilters.ragPercentage !== 60 && (
              <div className="bg-white rounded p-2 border border-amber-200">
                <div className="font-medium text-gray-700">Balance Sugerido</div>
                <div className={cn(
                  "text-xs px-2 py-1 rounded",
                  getRagBalanceColor(suggestedFilters.ragPercentage)
                )}>
                  {getRagBalanceLabel(suggestedFilters.ragPercentage)} ({suggestedFilters.ragPercentage}%)
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de filtros avanzados */}
      <AdvancedFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={applyFilters}
      />
    </div>
  );
};

export default FilterIntegration;