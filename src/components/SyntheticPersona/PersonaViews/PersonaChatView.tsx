// PersonaViews/PersonaChatView.tsx - Vista de chat con personas sintéticas

import React from 'react';
import { MessageCircle, User, ArrowLeft } from 'lucide-react';
import PersonaChat from '../../Chat/PersonaChat';
import type { SelectedPersona } from '../hooks/usePersonaNavigation';

interface PersonaChatViewProps {
  persona: SelectedPersona;
  onBack: () => void;
}

const PersonaChatView: React.FC<PersonaChatViewProps> = ({
  persona,
  onBack
}) => {
  // Header de la vista de chat
  const renderChatHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a personas
        </button>
        
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            persona.source === 'savital' 
              ? 'bg-purple-100' 
              : 'bg-green-100'
          }`}>
            {persona.source === 'savital' ? (
              <MessageCircle className={`h-6 w-6 ${
                persona.source === 'savital' 
                  ? 'text-purple-600' 
                  : 'text-green-600'
              }`} />
            ) : (
              <User className="h-6 w-6 text-green-600" />
            )}
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {persona.data.name}
            </h1>
            <p className="text-gray-600">
              {persona.source === 'savital' 
                ? `${persona.data.age} años • ${persona.data.city} • ${persona.data.occupation}`
                : `Arquetipo ${persona.data.archetype?.replace(/_/g, ' ')}`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Información contextual de la persona
  const renderPersonaContext = () => (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {persona.source === 'savital' ? (
            <>
              <div>
                <span className="font-medium text-gray-700">NSE:</span>
                <span className="ml-2 text-gray-600">{persona.data.nse}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Ocupación:</span>
                <span className="ml-2 text-gray-600">{persona.data.occupation}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Relación Savital:</span>
                <span className={`ml-2 font-medium ${
                  persona.data.unilever_brands?.savital?.usage === 'regular'
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {persona.data.unilever_brands?.savital?.usage === 'regular'
                    ? 'Usuario Actual'
                    : 'Usa Competencia'
                  }
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="font-medium text-gray-700">Edad:</span>
                <span className="ml-2 text-gray-600">
                  {persona.data.demographics?.age || 'N/A'} años
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">NSE:</span>
                <span className="ml-2 text-gray-600">
                  {persona.data.demographics?.nse_level || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Ciudad:</span>
                <span className="ml-2 text-gray-600">
                  {persona.data.location?.city || 'N/A'}
                </span>
              </div>
            </>
          )}
        </div>
        
        {/* Insight clave */}
        {persona.source === 'savital' && persona.data.behavior?.product_usage?.pain_points?.[0] && (
          <div className="mt-3 p-3 bg-purple-100 rounded-lg">
            <p className="text-sm text-purple-800">
              <span className="font-medium">Preocupación principal:</span> {persona.data.behavior.product_usage.pain_points[0]}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {renderChatHeader()}
      {renderPersonaContext()}
      
      {/* Componente de chat */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            Chat con personas sintéticas en desarrollo.
            <br />
            Persona seleccionada: <strong>{persona.data.name}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaChatView;