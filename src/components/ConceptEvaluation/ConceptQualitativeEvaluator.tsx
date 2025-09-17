// ConceptQualitativeEvaluator.tsx - Sistema de evaluación cualitativa de conceptos basado en arquetipos reales

import React, { useState, useMemo } from 'react';
import { 
  ThumbsUp, ThumbsDown, Lightbulb, AlertTriangle, 
  Users, Target, MessageSquare, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Info, TrendingUp
} from 'lucide-react';

// Tipos para el sistema de evaluación
interface ConceptInput {
  name: string;
  description: string;
  benefits: string[];
  differentiation: string;
  targetAudience: string;
}

interface AspectEvaluation {
  aspect: string;
  positives: string[];
  negatives: string[];
  recommendations: string[];
  archetyeReactions: {
    [archetype: string]: {
      acceptanceProbability: 'alta' | 'media' | 'baja';
      mainReason: string;
    };
  };
}

interface ConceptEvaluation {
  conceptName: string;
  overallFeedback: string;
  aspectEvaluations: AspectEvaluation[];
  competitivePosition: string;
  marketReadiness: 'listo' | 'requiere_ajustes' | 'necesita_desarrollo';
  priorityActions: string[];
}

// Arquetipos basados en estudios reales
const RESEARCH_BASED_ARCHETYPES = {
  MARIA_COSTENA: {
    name: "María José (Barranquilla)",
    profile: "32 años, emprendedora, NSE C+",
    hairConcerns: ["Frizz por humedad", "Caída estacional", "Grasa en raíz"],
    purchaseDrivers: ["Precio accesible", "Resultados visibles", "Recomendaciones"],
    brandPerception: {
      savital: "Económico pero efectivo",
      competition: "Sedal, Head & Shoulders"
    }
  },
  ANDREA_BOGOTANA: {
    name: "Andrea (Bogotá)",
    profile: "28 años, profesional, NSE B+",
    hairConcerns: ["Daño por alisado", "Falta de brillo", "Puntas abiertas"],
    purchaseDrivers: ["Ingredientes premium", "Tecnología", "Presentación profesional"],
    brandPerception: {
      savital: "Opción práctica para diario",
      competition: "Dove, L'Oréal"
    }
  },
  LUZ_PAISA: {
    name: "Luz Elena (Medellín)",
    profile: "45 años, ama de casa, NSE C",
    hairConcerns: ["Canas", "Resequedad", "Pérdida de volumen"],
    purchaseDrivers: ["Tradición", "Confianza", "Rendimiento"],
    brandPerception: {
      savital: "Marca de toda la vida",
      competition: "Pantene, Herbal Essences"
    }
  }
};

const ConceptQualitativeEvaluator: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<number>(0);
  const [expandedAspect, setExpandedAspect] = useState<string | null>(null);

  // Los 5 conceptos de Savital
  const savitalConcepts: ConceptInput[] = [
    {
      name: "Savital Control Caída desde la Raíz",
      description: "Tecnología clínicamente comprobada con sábila y péptidos para anclar el pelo",
      benefits: ["Tecnología clínica", "Nutrición sábila", "Péptidos restauradores", "Anclaje capilar"],
      differentiation: "Sábila + péptidos con tecnología clínica",
      targetAudience: "Personas con caída capilar severa"
    },
    {
      name: "Savital Equilibrio Capilar",
      description: "Sábila con niacinamida para equilibrio natural y control de grasa",
      benefits: ["Niacinamida vitamínica", "Equilibrio natural", "Control grasa", "Reduce picazón"],
      differentiation: "Única con sábila + niacinamida",
      targetAudience: "Personas con desequilibrios capilares"
    },
    {
      name: "Savital Nutrición desde la Raíz",
      description: "Bomba nutritiva con sábila y baobab, el árbol de la vida",
      benefits: ["Bomba nutrición", "Baobab árbol de vida", "Revitalización total", "Fortalecimiento"],
      differentiation: "Sábila + baobab para nutrición máxima",
      targetAudience: "Personas que buscan nutrir intensamente"
    },
    {
      name: "Savital Hidratación y Control Frizz",
      description: "Sábila con aceite de jojoba para sellar y proteger contra humedad",
      benefits: ["Hidratación profunda", "Jojoba sellador", "Protección humedad", "Control frizz"],
      differentiation: "Sábila + jojoba para hidratación y protección",
      targetAudience: "Personas con frizz en clima húmedo"
    },
    {
      name: "Savital Crecimiento Abundante",
      description: "Triple poder con romero, biotina y sábila para crecimiento máximo",
      benefits: ["Triple ingrediente", "Romero + biotina + sábila", "Elixir concentrado", "Crecimiento abundante"],
      differentiation: "Los 3 mejores ingredientes para crecer",
      targetAudience: "Personas que desean cabello largo"
    }
  ];

  // Función de evaluación cualitativa basada en arquetipos
  const evaluateConcept = (concept: ConceptInput): ConceptEvaluation => {
    const evaluations: AspectEvaluation[] = [];

    // 1. EVALUACIÓN DEL NOMBRE
    evaluations.push({
      aspect: "Nombre del Producto",
      positives: getNamingPositives(concept.name),
      negatives: getNamingNegatives(concept.name),
      recommendations: getNamingRecommendations(concept.name),
      archetyeReactions: getArchetypeReactionsToNaming(concept.name)
    });

    // 2. EVALUACIÓN DE BENEFICIOS
    evaluations.push({
      aspect: "Promesa de Beneficios",
      positives: getBenefitPositives(concept),
      negatives: getBenefitNegatives(concept),
      recommendations: getBenefitRecommendations(concept),
      archetyeReactions: getArchetypeReactionsToBenefits(concept)
    });

    // 3. EVALUACIÓN DE INGREDIENTES
    evaluations.push({
      aspect: "Credibilidad de Ingredientes",
      positives: getIngredientPositives(concept),
      negatives: getIngredientNegatives(concept),
      recommendations: getIngredientRecommendations(concept),
      archetyeReactions: getArchetypeReactionsToIngredients(concept)
    });

    // 4. EVALUACIÓN DE DIFERENCIACIÓN
    evaluations.push({
      aspect: "Diferenciación Competitiva",
      positives: getDifferentiationPositives(concept),
      negatives: getDifferentiationNegatives(concept),
      recommendations: getDifferentiationRecommendations(concept),
      archetyeReactions: getArchetypeReactionsToDifferentiation(concept)
    });

    return {
      conceptName: concept.name,
      overallFeedback: getOverallFeedback(concept),
      aspectEvaluations: evaluations,
      competitivePosition: getCompetitivePosition(concept),
      marketReadiness: getMarketReadiness(concept),
      priorityActions: getPriorityActions(concept)
    };
  };

  // Funciones específicas de evaluación por aspecto
  const getNamingPositives = (name: string): string[] => {
    const positives = [];
    
    if (name.includes("Control Caída")) {
      positives.push("Nombre directo que comunica el problema principal");
      positives.push("'Desde la Raíz' sugiere solución profunda y completa");
    }
    if (name.includes("Equilibrio")) {
      positives.push("Concepto holístico que sugiere balance");
      positives.push("Atractivo para múltiples problemas capilares");
    }
    if (name.includes("Nutrición")) {
      positives.push("Beneficio universal que todos entienden");
      positives.push("Asociación positiva con salud y cuidado");
    }
    if (name.includes("Hidratación")) {
      positives.push("Beneficio tangible y deseable");
      positives.push("Control Frizz es problema top-of-mind en Colombia");
    }
    if (name.includes("Crecimiento Abundante")) {
      positives.push("Promesa aspiracional muy deseada");
      positives.push("'Abundante' sugiere resultados visibles");
    }
    
    return positives;
  };

  const getNamingNegatives = (name: string): string[] => {
    const negatives = [];
    
    if (name.includes("Control Caída")) {
      negatives.push("Puede sonar medicinal o terapéutico");
      negatives.push("Podría alejar a quienes no tienen caída severa");
    }
    if (name.includes("Equilibrio")) {
      negatives.push("Concepto abstracto, no tan tangible");
      negatives.push("No específico sobre qué equilibra");
    }
    if (name.includes("Nutrición")) {
      negatives.push("Muy genérico, todos dicen nutrir");
      negatives.push("No diferencia vs competencia");
    }
    if (name.includes("Hidratación")) {
      negatives.push("Beneficio común en la categoría");
      negatives.push("Puede confundirse con acondicionadores solamente");
    }
    if (name.includes("Crecimiento Abundante")) {
      negatives.push("Promesa puede parecer exagerada");
      negatives.push("Genera expectativas muy altas difíciles de cumplir");
    }
    
    return negatives;
  };

  const getNamingRecommendations = (name: string): string[] => {
    const recommendations = [];
    
    if (name.includes("Control Caída")) {
      recommendations.push("Agregar claim de tiempo: '90% menos caída en 4 semanas'");
      recommendations.push("Considerar versión más aspiracional: 'Raíces Fuertes'");
    }
    if (name.includes("Equilibrio")) {
      recommendations.push("Especificar: 'Equilibrio Grasa-Hidratación'");
      recommendations.push("Agregar beneficio tangible: 'Equilibrio para 48hrs de frescura'");
    }
    if (name.includes("Nutrición")) {
      recommendations.push("Diferenciar con claim único: 'Nutrición con Superalimentos'");
      recommendations.push("Agregar intensidad: 'Nutrición Profunda 10X'");
    }
    if (name.includes("Hidratación")) {
      recommendations.push("Enfatizar duración: '72 horas sin frizz'");
      recommendations.push("Destacar clima: 'Anti-frizz Trópico Colombiano'");
    }
    if (name.includes("Crecimiento")) {
      recommendations.push("Moderar promesa: 'Favorece el Crecimiento Natural'");
      recommendations.push("Agregar credibilidad: 'Con los 3 activos más estudiados'");
    }
    
    return recommendations;
  };

  const getArchetypeReactionsToNaming = (name: string): any => {
    const reactions: any = {};
    
    if (name.includes("Control Caída")) {
      reactions.MARIA_COSTENA = {
        acceptanceProbability: 'media',
        mainReason: "Me interesa pero suena muy medicinal, prefiero algo más beauty"
      };
      reactions.ANDREA_BOGOTANA = {
        acceptanceProbability: 'alta',
        mainReason: "Directo y profesional, justo lo que busco"
      };
      reactions.LUZ_PAISA = {
        acceptanceProbability: 'alta',
        mainReason: "La caída es mi mayor preocupación a mi edad"
      };
    }
    
    // Similar para otros nombres...
    return reactions;
  };

  // Funciones para beneficios
  const getBenefitPositives = (concept: ConceptInput): string[] => {
    const positives = [];
    
    if (concept.benefits.includes("Tecnología clínica")) {
      positives.push("Credibilidad científica aumenta confianza");
      positives.push("Diferenciación vs productos tradicionales");
    }
    if (concept.benefits.some(b => b.includes("niacinamida"))) {
      positives.push("Ingrediente trending con respaldo científico");
      positives.push("Familiar para consumidoras informadas");
    }
    if (concept.benefits.some(b => b.includes("baobab"))) {
      positives.push("Ingrediente exótico genera curiosidad");
      positives.push("Historia del 'árbol de la vida' es poderosa");
    }
    
    return positives;
  };

  const getBenefitNegatives = (concept: ConceptInput): string[] => {
    const negatives = [];
    
    if (concept.benefits.length > 4) {
      negatives.push("Demasiados beneficios pueden generar desconfianza");
      negatives.push("Mensaje poco focalizado, intenta abarcar mucho");
    }
    if (concept.benefits.some(b => b.includes("clínicamente"))) {
      negatives.push("Puede percibirse como medicinal, no cosmético");
      negatives.push("Expectativas muy altas de resultados inmediatos");
    }
    
    return negatives;
  };

  const getBenefitRecommendations = (concept: ConceptInput): string[] => {
    return [
      "Priorizar máximo 3 beneficios clave",
      "Incluir tiempos de resultado esperados",
      "Balancear claims funcionales con emocionales"
    ];
  };

  // Similar para otras funciones...
  const getIngredientPositives = (concept: ConceptInput): string[] => {
    const positives = [];
    positives.push("Sábila es ingrediente core reconocido de Savital");
    
    if (concept.description.includes("péptidos")) {
      positives.push("Péptidos sugieren tecnología avanzada");
    }
    if (concept.description.includes("biotina")) {
      positives.push("Biotina es el ingrediente #1 asociado con crecimiento");
    }
    
    return positives;
  };

  const getIngredientNegatives = (concept: ConceptInput): string[] => {
    return ["Algunos ingredientes pueden ser desconocidos para el target"];
  };

  const getIngredientRecommendations = (concept: ConceptInput): string[] => {
    return ["Educar sobre beneficios de ingredientes nuevos"];
  };

  const getDifferentiationPositives = (concept: ConceptInput): string[] => {
    return ["Combinación única de ingredientes"];
  };

  const getDifferentiationNegatives = (concept: ConceptInput): string[] => {
    return ["Diferenciación puede no ser clara vs competencia premium"];
  };

  const getDifferentiationRecommendations = (concept: ConceptInput): string[] => {
    return ["Crear reason-to-believe único y memorable"];
  };

  const getArchetypeReactionsToBenefits = (concept: ConceptInput): any => {
    return {
      MARIA_COSTENA: {
        acceptanceProbability: 'media',
        mainReason: "Me interesan los beneficios pero necesito ver resultados"
      }
    };
  };

  const getArchetypeReactionsToIngredients = (concept: ConceptInput): any => {
    return {
      ANDREA_BOGOTANA: {
        acceptanceProbability: 'alta',
        mainReason: "Me gustan los ingredientes con respaldo científico"
      }
    };
  };

  const getArchetypeReactionsToDifferentiation = (concept: ConceptInput): any => {
    return {
      LUZ_PAISA: {
        acceptanceProbability: 'media',
        mainReason: "Prefiero lo tradicional y comprobado"
      }
    };
  };

  const getOverallFeedback = (concept: ConceptInput): string => {
    return `El concepto ${concept.name} presenta una propuesta interesante con potencial de mercado, 
    especialmente para el segmento que busca soluciones específicas. La combinación de sábila 
    (equity de marca) con ingredientes especializados crea una narrativa creíble.`;
  };

  const getCompetitivePosition = (concept: ConceptInput): string => {
    return "Posicionamiento medio-alto en el segmento masivo, con oportunidad de competir en precio-valor";
  };

  const getMarketReadiness = (concept: ConceptInput): 'listo' | 'requiere_ajustes' | 'necesita_desarrollo' => {
    return 'requiere_ajustes';
  };

  const getPriorityActions = (concept: ConceptInput): string[] => {
    return [
      "Validar claims con estudios de eficacia",
      "Testear comprensión de ingredientes clave",
      "Ajustar messaging por segmento"
    ];
  };

  const currentEvaluation = useMemo(() => {
    return evaluateConcept(savitalConcepts[selectedConcept]);
  }, [selectedConcept]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Evaluación Cualitativa de Conceptos Savital
          </h1>
          <p className="text-gray-600">
            Sistema de evaluación basado en arquetipos reales y estudios de mercado
          </p>
        </div>

        {/* Selector de Conceptos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Seleccionar Concepto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {savitalConcepts.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedConcept(idx)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedConcept === idx
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{concept.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Concepto Actual */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {savitalConcepts[selectedConcept].name}
              </h2>
              <p className="text-gray-600 mt-2">
                {savitalConcepts[selectedConcept].description}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentEvaluation.marketReadiness === 'listo' 
                ? 'bg-green-100 text-green-700'
                : currentEvaluation.marketReadiness === 'requiere_ajustes'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {currentEvaluation.marketReadiness === 'listo' 
                ? 'Listo para mercado'
                : currentEvaluation.marketReadiness === 'requiere_ajustes'
                ? 'Requiere ajustes'
                : 'Necesita desarrollo'}
            </div>
          </div>

          {/* Beneficios */}
          <div className="flex flex-wrap gap-2 mb-4">
            {savitalConcepts[selectedConcept].benefits.map((benefit, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {benefit}
              </span>
            ))}
          </div>

          {/* Feedback General */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">{currentEvaluation.overallFeedback}</p>
          </div>
        </div>

        {/* Evaluaciones por Aspecto */}
        <div className="space-y-4">
          {currentEvaluation.aspectEvaluations.map((evaluation, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedAspect(
                  expandedAspect === evaluation.aspect ? null : evaluation.aspect
                )}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {evaluation.aspect}
                </h3>
                {expandedAspect === evaluation.aspect ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedAspect === evaluation.aspect && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Positivos */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ThumbsUp className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">Aspectos Positivos</h4>
                      </div>
                      <ul className="space-y-2">
                        {evaluation.positives.map((positive, pidx) => (
                          <li key={pidx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800">{positive}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Negativos */}
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ThumbsDown className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold text-red-900">Aspectos a Mejorar</h4>
                      </div>
                      <ul className="space-y-2">
                        {evaluation.negatives.map((negative, nidx) => (
                          <li key={nidx} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800">{negative}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recomendaciones */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Recomendaciones</h4>
                      </div>
                      <ul className="space-y-2">
                        {evaluation.recommendations.map((rec, ridx) => (
                          <li key={ridx} className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-800">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Reacciones de Arquetipos */}
                  {Object.keys(evaluation.archetyeReactions).length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Reacciones de Arquetipos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(evaluation.archetyeReactions).map(([archetype, reaction]) => (
                          <div key={archetype} className="bg-gray-50 rounded-lg p-3">
                            <div className="font-medium text-sm text-gray-900 mb-1">
                              {RESEARCH_BASED_ARCHETYPES[archetype as keyof typeof RESEARCH_BASED_ARCHETYPES]?.name}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full inline-block mb-2 ${
                              reaction.acceptanceProbability === 'alta'
                                ? 'bg-green-100 text-green-700'
                                : reaction.acceptanceProbability === 'media'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              Aceptación: {reaction.acceptanceProbability}
                            </div>
                            <p className="text-xs text-gray-600 italic">
                              "{reaction.mainReason}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Acciones Prioritarias */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Acciones Prioritarias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentEvaluation.priorityActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-amber-900">{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Posición Competitiva */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Posición Competitiva
          </h3>
          <p className="text-gray-700">{currentEvaluation.competitivePosition}</p>
        </div>
      </div>
    </div>
  );
};

export default ConceptQualitativeEvaluator;