// PersonaGrid/PersonaGridContainer.tsx - Grid simplificado de arquetipos Unilever

import React from 'react';
import { Users, AlertCircle, Scissors } from 'lucide-react';
import type { PersonaFilters } from '../hooks/usePersonaFilters';
import type { UnileverSyntheticPersona } from '../../../types/unileverPersona.types';
import UnileverPersonaCard from './UnileverPersonaCard';

interface PersonaGridContainerProps {
  personas: UnileverSyntheticPersona[];
  filters: PersonaFilters;
  onPersonaSelect: (persona: UnileverSyntheticPersona, source: 'unilever') => void;
  onEvaluatePersona?: (persona: UnileverSyntheticPersona, source: 'unilever') => void;
  onEditPersona?: (persona: UnileverSyntheticPersona, source: 'unilever') => void;
}

const PersonaGridContainer: React.FC<PersonaGridContainerProps> = ({
  personas,
  filters,
  onPersonaSelect,
  onEvaluatePersona,
  onEditPersona
}) => {
  // Validar que personas existe
  if (!personas || personas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-amber-50 rounded-full p-4 mb-4">
          <AlertCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No se encontraron personas
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Ajusta los filtros de búsqueda para encontrar arquetipos que coincidan con tus criterios.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 rounded-lg p-2">
          <Scissors className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Arquetipos Unilever con Perfiles Capilares
          </h3>
          <p className="text-sm text-gray-600">
            {personas.length} arquetipo{personas.length !== 1 ? 's' : ''} encontrado{personas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Grid de personas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona) => (
          <UnileverPersonaCard
            key={persona.id}
            persona={persona}
            onClick={() => onPersonaSelect(persona, 'unilever')}
            onEvaluate={onEvaluatePersona ? () => onEvaluatePersona(persona, 'unilever') : undefined}
            onEdit={onEditPersona ? () => onEditPersona(persona, 'unilever') : undefined}
          />
        ))}
      </div>

      {/* Footer con estadísticas capilares */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Tipos de Cabello</span>
          </div>
          <p className="text-xs text-purple-700">
            {[...new Set(personas.map(p => p.hair_profile.hair_type))].join(', ')}
          </p>
        </div>
        
        <div className="bg-pink-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="h-4 w-4 text-pink-600" />
            <span className="text-sm font-medium text-pink-900">Texturas</span>
          </div>
          <p className="text-xs text-pink-700">
            {[...new Set(personas.map(p => p.hair_profile.hair_texture))].join(', ')}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Preocupaciones Top</span>
          </div>
          <p className="text-xs text-blue-700">
            {[...new Set(personas.flatMap(p => p.hair_profile.main_concerns.slice(0, 1)))].join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaGridContainer;