// hooks/usePersonaData.ts - Custom hook para manejo de datos de personas sintéticas

import { useMemo } from 'react';
import { BASIC_UNILEVER_PERSONAS } from '../../../types/unileverPersona.types';
import type { UnileverArchetype, UnileverSyntheticPersona } from '../../../types/unileverPersona.types';
import type { PersonaFilters } from './usePersonaFilters';

export interface PersonaStats {
  totalPersonas: number;
  avgAge: number;
  citiesRepresented: string[];
  hairTypes: string[];
  mainConcerns: string[];
}

// Convertir los arquetipos básicos en personas completas
const createCompletePersonas = (): UnileverSyntheticPersona[] => {
  return Object.entries(BASIC_UNILEVER_PERSONAS).map(([archetype, basic]) => ({
    id: archetype.toLowerCase(),
    name: basic.name || 'Persona Sin Nombre',
    archetype: archetype as UnileverArchetype,
    demographics: basic.demographics || {
      age: 30,
      gender: 'female' as const,
      nse_level: 'C',
      income_bracket_cop: [0, 0] as [number, number],
      education_level: '',
      occupation: '',
      household_size: 0,
      marital_status: '',
      children_count: 0,
      housing_type: ''
    },
    location: basic.location || {
      city: 'Bogotá',
      department: 'Cundinamarca',
      region: 'Central',
      country: 'Colombia'
    },
    psychographics: {
      lifestyle: '',
      values: [],
      interests: [],
      media_consumption: [],
      social_media: [],
      hobbies: [],
      aspirations: [],
      frustrations: [],
      brand_relationships: {
        trusted_brands: [],
        avoided_brands: []
      }
    },
    conversation_style: {
      tone: 'amigable',
      vocabulary_level: 'medio',
      common_phrases: [],
      expressions: [],
      topics_of_interest: [],
      communication_style: 'directo',
      question_patterns: []
    },
    hair_profile: basic.hair_profile || {
      hair_type: 'normal',
      hair_texture: 'liso',
      main_concerns: [],
      washing_frequency: 'diario',
      styling_habits: [],
      damage_level: 'bajo',
      chemical_treatments: [],
      preferred_brands: [],
      product_usage_patterns: []
    },
    predefined_questions: [],
    interaction_history: [],
    role_instructions: '',
    system_prompt: '',
    active: true,
    created_at: new Date(),
    updated_at: new Date()
  }));
};

export const usePersonaData = (filters: PersonaFilters) => {
  const allPersonas = useMemo(() => createCompletePersonas(), []);

  // Filtrar personas según filtros aplicados
  const filteredPersonas = useMemo(() => {
    return allPersonas.filter(persona => {
      // Filtro por búsqueda
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          persona.name.toLowerCase().includes(query) ||
          persona.demographics.occupation?.toLowerCase().includes(query) ||
          persona.location.city.toLowerCase().includes(query) ||
          persona.archetype.toLowerCase().includes(query) ||
          persona.hair_profile.main_concerns.some(concern => 
            concern.toLowerCase().includes(query)
          );
        if (!matchesSearch) return false;
      }

      // Filtro por edad
      if (filters.filterAge !== 'all') {
        const age = persona.demographics.age;
        switch (filters.filterAge) {
          case '18-25': if (age < 18 || age > 25) return false; break;
          case '26-35': if (age < 26 || age > 35) return false; break;
          case '36-45': if (age < 36 || age > 45) return false; break;
          case '46+': if (age < 46) return false; break;
        }
      }

      // Filtro por ciudad
      if (filters.filterCity !== 'all' && persona.location.city !== filters.filterCity) {
        return false;
      }

      // Filtro por NSE
      if (filters.filterNSE !== 'all' && persona.demographics.nse_level !== filters.filterNSE) {
        return false;
      }

      // Filtro por preocupación capilar
      if (filters.filterHairConcern !== 'all') {
        const hasMatchingConcern = persona.hair_profile.main_concerns.some(concern =>
          concern.toLowerCase().includes(filters.filterHairConcern.toLowerCase())
        );
        if (!hasMatchingConcern) return false;
      }

      return true;
    });
  }, [allPersonas, filters]);

  // Estadísticas simplificadas
  const stats = useMemo((): PersonaStats => {
    const totalPersonas = filteredPersonas.length;
    const avgAge = totalPersonas > 0 
      ? Math.round(filteredPersonas.reduce((sum, p) => sum + p.demographics.age, 0) / totalPersonas)
      : 0;

    const citiesRepresented = [...new Set(filteredPersonas.map(p => p.location.city))];
    const hairTypes = [...new Set(filteredPersonas.map(p => p.hair_profile.hair_type))];
    const mainConcerns = [...new Set(
      filteredPersonas.flatMap(p => p.hair_profile.main_concerns)
    )].slice(0, 5); // Top 5 preocupaciones

    return {
      totalPersonas,
      avgAge,
      citiesRepresented,
      hairTypes,
      mainConcerns
    };
  }, [filteredPersonas]);

  // Solo trabajamos con personas Unilever ahora
  const getPersonaDetails = (personaId: string) => {
    return filteredPersonas.find(p => p.id === personaId);
  };

  return {
    personas: filteredPersonas,
    stats,
    getPersonaDetails
  };
};