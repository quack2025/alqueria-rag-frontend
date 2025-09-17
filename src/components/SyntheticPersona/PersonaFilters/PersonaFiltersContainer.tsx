// PersonaFilters/PersonaFiltersContainer.tsx - Contenedor de filtros modulares

import React from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import type { PersonaFilters, PersonaFiltersActions } from '../hooks/usePersonaFilters';
import type { PersonaStats } from '../hooks/usePersonaData';

interface PersonaFiltersContainerProps {
  filters: PersonaFilters;
  actions: PersonaFiltersActions;
  config: {
    ageOptions: { value: string; label: string }[];
    cityOptions: { value: string; label: string }[];
    nseOptions: { value: string; label: string }[];
    brandOptions: { value: string; label: string }[];
  };
  stats: PersonaStats;
}

const PersonaFiltersContainer: React.FC<PersonaFiltersContainerProps> = ({
  filters,
  actions,
  config,
  stats
}) => {
  const activeFiltersCount = actions.getActiveFiltersCount();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        {/* Barra de búsqueda principal */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ocupación, ciudad..."
              value={filters.searchQuery}
              onChange={(e) => actions.setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            {filters.searchQuery && (
              <button
                onClick={() => actions.setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => actions.setShowAdvancedFilters(!filters.showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              filters.showAdvancedFilters || activeFiltersCount > 0
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={actions.resetFilters}
              className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar
            </button>
          )}
        </div>

        {/* Filtros avanzados */}
        {filters.showAdvancedFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Filtro de fuente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuente
                </label>
                <select
                  value={filters.personaSource}
                  onChange={(e) => actions.setPersonaSource(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">Todas</option>
                  <option value="savital">Solo Savital</option>
                  <option value="unilever">Solo Unilever</option>
                </select>
              </div>

              {/* Filtro de edad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <select
                  value={filters.filterAge}
                  onChange={(e) => actions.setFilterAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  {config.ageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <select
                  value={filters.filterCity}
                  onChange={(e) => actions.setFilterCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  {config.cityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de NSE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NSE
                </label>
                <select
                  value={filters.filterNSE}
                  onChange={(e) => actions.setFilterNSE(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  {config.nseOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <select
                  value={filters.filterBrand}
                  onChange={(e) => actions.setFilterBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  {config.brandOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Indicadores de resultados */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            {filters.personaSource === 'all' || filters.personaSource === 'savital' ? (
              <span>
                {stats.totalSavital} usuarias Savital encontradas
                {stats.citiesRepresented.length > 0 && (
                  <span className="text-gray-500">
                    {' '}• {stats.citiesRepresented.join(', ')}
                  </span>
                )}
              </span>
            ) : null}
            
            {filters.personaSource === 'all' && stats.totalSavital > 0 && stats.totalUnilever > 0 && (
              <span className="mx-2">+</span>
            )}
            
            {filters.personaSource === 'all' || filters.personaSource === 'unilever' ? (
              <span>{stats.totalUnilever} arquetipos Unilever</span>
            ) : null}
          </div>

          {stats.avgAge > 0 && (
            <div className="text-gray-500">
              Edad promedio: {stats.avgAge} años
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaFiltersContainer;