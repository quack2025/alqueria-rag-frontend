// PersonaGrid/UnileverPersonaCard.tsx - Card especializada para arquetipos Unilever

import React from 'react';
import { User, Eye, MessageCircle } from 'lucide-react';

interface UnileverPersonaCardProps {
  persona: any;
  onSelect: (persona: any, source: 'savital' | 'unilever') => void;
  onEvaluate?: (persona: any, source: 'savital' | 'unilever') => void;
}

const UnileverPersonaCard: React.FC<UnileverPersonaCardProps> = ({
  persona,
  onSelect,
  onEvaluate
}) => {
  const handleEvaluateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEvaluate?.(persona, 'unilever');
  };

  const getArchetypeDisplayName = (archetype: string) => {
    return archetype
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Header con gradiente verde Unilever */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">{persona.name}</h3>
              <p className="text-sm opacity-90">
                {getArchetypeDisplayName(persona.archetype)}
              </p>
            </div>
          </div>
          
          {onEvaluate && (
            <button
              onClick={handleEvaluateClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/20 rounded-lg"
              title="Evaluar con este arquetipo"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          {persona.demographics?.age && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Edad:</span>
              <span>{persona.demographics.age} años</span>
            </div>
          )}
          
          {persona.demographics?.nse_level && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">NSE:</span>
              <span>{persona.demographics.nse_level}</span>
            </div>
          )}
          
          {persona.location?.city && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Ciudad:</span>
              <span>{persona.location.city}</span>
            </div>
          )}
        </div>

        {/* Descripción del arquetipo si está disponible */}
        {persona.description && (
          <div className="p-3 bg-green-50 rounded-lg mb-4">
            <p className="text-sm text-green-800 text-center">
              {persona.description.substring(0, 120)}
              {persona.description.length > 120 ? '...' : ''}
            </p>
          </div>
        )}

        {/* Acción principal - Ver en evaluador */}
        <div 
          onClick={() => onSelect(persona, 'unilever')}
          className="cursor-pointer p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
        >
          <p className="text-sm text-green-800 text-center flex items-center justify-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Interactuar con arquetipo
          </p>
        </div>
      </div>

      {/* Indicador de estado en hover */}
      <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default UnileverPersonaCard;