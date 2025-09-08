// components/Campaign/ColombianArchetypeSelector.tsx - Selector de arquetipos colombianos para evaluación

import React, { useState } from 'react';
import { 
  Users, Play, CheckCircle, AlertTriangle, Info, 
  TrendingUp, Target, MapPin, Heart, Coffee, Zap, Home
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ColombianArchetype } from '../../types/colombianPersona.types';
import type { CampaignConcept } from '../../types/campaign.types';

interface ColombianArchetypeSelectorProps {
  concept: CampaignConcept;
  onStartEvaluation: (selectedArchetypes: string[]) => void;
  onBack: () => void;
}

const ColombianArchetypeSelector: React.FC<ColombianArchetypeSelectorProps> = ({ 
  concept, 
  onStartEvaluation, 
  onBack 
}) => {
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Información detallada de cada arquetipo colombiano
  const archetypeDetails = {
    [ColombianArchetype.COSTENA_EMPRENDEDORA]: {
      name: 'Costeña Emprendedora',
      icon: '🏖️',
      description: 'Mujeres emprendedoras de la costa atlántica',
      characteristics: ['Sociable y trabajadora', 'Sensible al calor', 'Enfoque familiar', 'Adaptable'],
      demographics: '28-35 años • Barranquilla/Cartagena • NSE B/C+',
      color: 'orange',
      location: 'Costa Atlántica',
      unilever_focus: {
        primary: ['Fruco', 'Dove', 'Rexona'],
        usage: 'Productos resistentes al calor y humedad'
      },
      insights: [
        'Valora productos que funcionen con el clima tropical',
        'Influenciada por comunidad y redes sociales locales',
        'Busca rendimiento y durabilidad en productos'
      ],
      concerns: [
        '¿Funcionará con este calor?',
        '¿El precio es justo para mi presupuesto?',
        '¿Qué dirán mis clientas/amigas?'
      ],
      regional_traits: ['Expresiva', 'Caribeña', 'Hospitalaria', 'Resiliente']
    },
    
    [ColombianArchetype.BOGOTANA_PROFESIONAL]: {
      name: 'Bogotana Profesional',
      icon: '🏢',
      description: 'Profesionales urbanas de la capital',
      characteristics: ['Health-conscious', 'Premium-oriented', 'Urbana sofisticada', 'Eco-friendly'],
      demographics: '26-38 años • Bogotá • NSE A/B+',
      color: 'blue',
      location: 'Región Andina - Bogotá',
      unilever_focus: {
        primary: ['Dove Premium', 'Suave Professional', 'Knorr Orgánico'],
        usage: 'Líneas premium y productos saludables'
      },
      insights: [
        'Dispuesta a pagar más por calidad e ingredientes premium',
        'Muy influenciada por reviews online y estudios científicos',
        'Busca productos que se adapten a su estilo de vida urbano'
      ],
      concerns: [
        '¿Es realmente premium/orgánico?',
        '¿Es cruelty-free y sostenible?',
        '¿Se adapta a mi rutina ocupada?'
      ],
      regional_traits: ['Sofisticada', 'Profesional', 'Cosmopolita', 'Exigente']
    },
    
    [ColombianArchetype.PAISA_TRADICIONAL]: {
      name: 'Paisa Tradicional',
      icon: '👨‍👩‍👧‍👦',
      description: 'Amas de casa tradicionales de Antioquia',
      characteristics: ['Familiar', 'Tradicionalista', 'Ahorradora', 'Leal a marcas'],
      demographics: '35-50 años • Medellín/Municipios • NSE B/C+',
      color: 'green',
      location: 'Antioquia - Valle de Aburrá',
      unilever_focus: {
        primary: ['OMO', 'Fruco', 'Dove Familiar'],
        usage: 'Productos familiares de confianza y tradición'
      },
      insights: [
        'Extremadamente leal a marcas que han funcionado en su familia',
        'Muy influenciada por recomendaciones de familia y vecinas',
        'Prioriza productos que cuiden a toda la familia'
      ],
      concerns: [
        '¿Será mejor que lo que uso desde siempre?',
        '¿Cómo reaccionarán mis hijos al cambio?',
        '¿Funcionará igual de bien pero más caro?'
      ],
      regional_traits: ['Familiar', 'Trabajadora', 'Hospitalaria', 'Conservadora']
    },
    
    [ColombianArchetype.CALENA_MODERNA]: {
      name: 'Caleña Moderna',
      icon: '💃',
      description: 'Jóvenes modernas del Valle del Cauca',
      characteristics: ['Trendy', 'Social', 'Fitness-oriented', 'Conscious consumer'],
      demographics: '22-32 años • Cali • NSE B/C+',
      color: 'purple',
      location: 'Valle del Cauca',
      unilever_focus: {
        primary: ['Dove Natural', 'Suave Sin Sulfatos', 'Productos Eco'],
        usage: 'Productos naturales y trendy para lifestyle activo'
      },
      insights: [
        'Muy influenciada por tendencias de wellness y beauty',
        'Activa en redes sociales, comparte experiencias',
        'Valora ingredientes naturales y sostenibilidad'
      ],
      concerns: [
        '¿Es realmente natural/orgánico como dicen?',
        '¿Está de moda o se está quedando atrás?',
        '¿Es Instagram-worthy?'
      ],
      regional_traits: ['Alegre', 'Social', 'Moderna', 'Consciente']
    },
    
    [ColombianArchetype.LLANERA_EMPRENDEDORA]: {
      name: 'Llanera Emprendedora',
      icon: '🌾',
      description: 'Mujeres trabajadoras de los Llanos Orientales',
      characteristics: ['Rural', 'Trabajadora', 'Práctica', 'Resistente'],
      demographics: '30-45 años • Villavicencio/Meta • NSE C+/C',
      color: 'yellow',
      location: 'Llanos Orientales',
      unilever_focus: {
        primary: ['OMO Potente', 'Rexona Resistente', 'Fruco Tradicional'],
        usage: 'Productos duraderos para trabajo pesado y vida rural'
      },
      insights: [
        'Necesita productos que rindan mucho y sean efectivos',
        'Valora la durabilidad sobre la sofisticación',
        'Influenciada por comunidad rural y tradición'
      ],
      concerns: [
        '¿Funcionará con tanto polvo y trabajo pesado?',
        '¿Lo consigo fácil en mi pueblo?',
        '¿Vale la pena gastar más o sigo con lo de siempre?'
      ],
      regional_traits: ['Fuerte', 'Práctica', 'Tradicional', 'Comunitaria']
    }
  };

  const toggleArchetype = (archetype: string) => {
    setSelectedArchetypes(prev => 
      prev.includes(archetype) 
        ? prev.filter(a => a !== archetype)
        : [...prev, archetype]
    );
  };

  const handleStartEvaluation = async () => {
    if (selectedArchetypes.length === 0) return;
    
    setIsEvaluating(true);
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onStartEvaluation(selectedArchetypes);
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = {
      orange: isSelected 
        ? 'bg-orange-500 text-white border-orange-500' 
        : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100',
      blue: isSelected 
        ? 'bg-blue-500 text-white border-blue-500' 
        : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100',
      green: isSelected 
        ? 'bg-green-500 text-white border-green-500' 
        : 'bg-green-50 text-green-900 border-green-200 hover:bg-green-100',
      purple: isSelected 
        ? 'bg-purple-500 text-white border-purple-500' 
        : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100',
      yellow: isSelected 
        ? 'bg-yellow-500 text-white border-yellow-500' 
        : 'bg-yellow-50 text-yellow-900 border-yellow-200 hover:bg-yellow-100',
    };
    return baseClasses[color as keyof typeof baseClasses] || baseClasses.blue;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Selección de Arquetipos Colombianos
            </h2>
            <p className="text-gray-600">
              Elige los perfiles de consumidoras para evaluar tu concepto
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Concepto a evaluar:</p>
              <p>"{concept.name}" - {concept.type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Arquetipos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(archetypeDetails).map(([key, details]) => {
          const isSelected = selectedArchetypes.includes(key);
          
          return (
            <div
              key={key}
              onClick={() => toggleArchetype(key)}
              className={cn(
                'relative cursor-pointer border-2 rounded-xl p-6 transition-all duration-200',
                getColorClasses(details.color, isSelected),
                'hover:shadow-lg hover:scale-105'
              )}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              )}
              
              {/* Archetype header */}
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{details.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight">
                    {details.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 opacity-75" />
                    <span className="text-xs opacity-90">
                      {details.location}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm mb-4 opacity-90">
                {details.description}
              </p>
              
              {/* Demographics */}
              <div className="text-xs opacity-80 mb-3 font-medium">
                {details.demographics}
              </div>
              
              {/* Key characteristics */}
              <div className="space-y-2 mb-4">
                {details.characteristics.slice(0, 2).map((char, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      isSelected ? "bg-white" : "bg-current opacity-60"
                    )} />
                    <span>{char}</span>
                  </div>
                ))}
              </div>
              
              {/* Unilever focus */}
              <div className="border-t border-current border-opacity-20 pt-3">
                <div className="text-xs font-medium mb-1">
                  Marcas principales:
                </div>
                <div className="text-xs opacity-90">
                  {details.unilever_focus.primary.join(' • ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      {selectedArchetypes.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Arquetipos seleccionados ({selectedArchetypes.length})
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedArchetypes.map(archetype => (
              <span
                key={archetype}
                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                <span>{archetypeDetails[archetype as ColombianArchetype].icon}</span>
                {archetypeDetails[archetype as ColombianArchetype].name}
              </span>
            ))}
          </div>
          
          <div className="text-sm text-gray-600">
            <p>
              Se generarán {selectedArchetypes.length * 3} personas sintéticas 
              (3 variantes por arquetipo) para una evaluación completa y balanceada.
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Volver al concepto
        </button>
        
        <div className="flex items-center gap-3">
          {selectedArchetypes.length === 0 && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Selecciona al menos un arquetipo</span>
            </div>
          )}
          
          <button
            onClick={handleStartEvaluation}
            disabled={selectedArchetypes.length === 0 || isEvaluating}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
              selectedArchetypes.length > 0 && !isEvaluating
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Iniciando evaluación...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Iniciar evaluación con {selectedArchetypes.length} arquetipo{selectedArchetypes.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Additional info */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          💡 Tip: Selecciona arquetipos diversos para obtener una evaluación más rica y representativa
          del mercado colombiano femenino
        </p>
      </div>
    </div>
  );
};

export default ColombianArchetypeSelector;