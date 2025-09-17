// hooks/usePersonaFilters.ts - Custom hook para manejo de filtros de personas

import { useState, useMemo } from 'react';

export type PersonaSource = 'unilever' | 'all';
export type ViewMode = 'home' | 'chat' | 'evaluate' | 'edit' | 'dashboard';

export interface PersonaFilters {
  personaSource: PersonaSource;
  searchQuery: string;
  filterAge: string;
  filterCity: string; 
  filterNSE: string;
  filterHairConcern: string;
  showAdvancedFilters: boolean;
}

export interface PersonaFiltersActions {
  setPersonaSource: (source: PersonaSource) => void;
  setSearchQuery: (query: string) => void;
  setFilterAge: (age: string) => void;
  setFilterCity: (city: string) => void;
  setFilterNSE: (nse: string) => void;
  setFilterHairConcern: (concern: string) => void;
  setShowAdvancedFilters: (show: boolean) => void;
  resetFilters: () => void;
  getActiveFiltersCount: () => number;
}

const initialFilters: PersonaFilters = {
  personaSource: 'all',
  searchQuery: '',
  filterAge: 'all',
  filterCity: 'all',
  filterNSE: 'all',
  filterHairConcern: 'all',
  showAdvancedFilters: false,
};

export const usePersonaFilters = () => {
  const [filters, setFilters] = useState<PersonaFilters>(initialFilters);

  const actions: PersonaFiltersActions = {
    setPersonaSource: (source: PersonaSource) => 
      setFilters(prev => ({ ...prev, personaSource: source })),
    
    setSearchQuery: (query: string) => 
      setFilters(prev => ({ ...prev, searchQuery: query })),
    
    setFilterAge: (age: string) => 
      setFilters(prev => ({ ...prev, filterAge: age })),
    
    setFilterCity: (city: string) => 
      setFilters(prev => ({ ...prev, filterCity: city })),
    
    setFilterNSE: (nse: string) => 
      setFilters(prev => ({ ...prev, filterNSE: nse })),
    
    setFilterHairConcern: (concern: string) => 
      setFilters(prev => ({ ...prev, filterHairConcern: concern })),
    
    setShowAdvancedFilters: (show: boolean) => 
      setFilters(prev => ({ ...prev, showAdvancedFilters: show })),
    
    resetFilters: () => setFilters(initialFilters),
    
    getActiveFiltersCount: () => {
      let count = 0;
      if (filters.personaSource !== 'all') count++;
      if (filters.searchQuery.trim()) count++;
      if (filters.filterAge !== 'all') count++;
      if (filters.filterCity !== 'all') count++;
      if (filters.filterNSE !== 'all') count++;
      if (filters.filterHairConcern !== 'all') count++;
      return count;
    }
  };

  const filterConfig = useMemo(() => ({
    ageOptions: [
      { value: 'all', label: 'Todas las edades' },
      { value: '18-25', label: '18-25 años' },
      { value: '26-35', label: '26-35 años' },
      { value: '36-45', label: '36-45 años' },
      { value: '46+', label: '46+ años' }
    ],
    cityOptions: [
      { value: 'all', label: 'Todas' },
      { value: 'Bogotá', label: 'Bogotá' },
      { value: 'Barranquilla', label: 'Barranquilla' }
    ],
    nseOptions: [
      { value: 'all', label: 'Todos' },
      { value: 'C+', label: 'C+' },
      { value: 'C', label: 'C' }
    ],
    brandOptions: [
      { value: 'all', label: 'Todas' },
      { value: 'savital', label: 'Usuario Savital' },
      { value: 'competitor', label: 'Competencia' }
    ]
  }), []);

  return {
    filters,
    actions,
    filterConfig
  };
};