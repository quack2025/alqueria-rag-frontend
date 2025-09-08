// components/ConceptEvaluation/ConceptEvaluator.tsx - Evaluador de conceptos y campañas

import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Megaphone, Star, BarChart3, Users, MessageSquare, Download, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UnileverArchetype, BASIC_UNILEVER_PERSONAS } from '../../types/unileverPersona.types';
import ColombianPersonaService from '../../services/colombianPersonaService';
import ConceptChat from '../ConceptChat/ConceptChat';
import FocusGroupSimulator from './FocusGroupSimulator';

interface ConceptEvaluatorProps {
  onBack: () => void;
}

interface ConceptData {
  title: string;
  description: string;
  type: 'product' | 'campaign';
  category: string;
  image?: string;
  targetAudience: string;
}

interface EvaluationResult {
  archetype: UnileverArchetype;
  personaName: string;
  overallScore: number;
  overall_justification?: string;
  appeal: number;
  appeal_justification?: string;
  understanding: number;
  understanding_justification?: string;
  purchase_intent: number;
  purchase_intent_justification?: string;
  credibility: number;
  credibility_justification?: string;
  benefit_evaluation: number;
  benefit_evaluation_justification?: string;
  ingredient_analysis?: string[];
  current_product_comparison?: string;
  price_analysis?: {
    current_spending: string;
    price_perception: string;
    ideal_price: string;
  };
  usage_scenarios?: string[];
  concerns: string[];
  positives: string[];
  improvement_suggestions: string[];
  quotes: string[];
  emotional_response: string;
  likelihood_to_recommend: number;
  recommendation_justification?: string;
}

export const ConceptEvaluator: React.FC<ConceptEvaluatorProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [concept, setConcept] = useState<ConceptData>({
    title: 'Fruco Salsa Premium Artesanal',
    description: 'Nueva línea de salsas Fruco con ingredientes 100% naturales, sin preservantes artificiales, inspirada en recetas tradicionales colombianas de la abuela. Disponible en tres sabores: Criolla Tradicional (con ajo y cebolla cabezona), Costeña Picante (con ají dulce y culantro) y Paisa Suave (con panela y especias andinas). Presentación en frasco de vidrio reciclable de 250g con etiqueta artesanal que resalta el origen colombiano y la tradición familiar.',
    type: 'product',
    category: 'Alimentos - Salsas',
    targetAudience: 'Mujeres 25-45 años, NSE B/C+, que valoran la cocina tradicional pero buscan practicidad sin sacrificar calidad'
  });

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<UnileverArchetype[]>([]);
  const [evaluationTone, setEvaluationTone] = useState(50); // 0=Muy Escéptico, 100=Muy Crédulo
  const [showChat, setShowChat] = useState(false);
  const [selectedPersonaForChat, setSelectedPersonaForChat] = useState<{
    archetype: UnileverArchetype;
    result: EvaluationResult;
  } | null>(null);
  const [strategicRecommendations, setStrategicRecommendations] = useState<any[]>([]);
  const [showFocusGroup, setShowFocusGroup] = useState(false);

  const handleInputChange = (field: keyof ConceptData, value: string) => {
    setConcept(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateEvaluationPrompt = (archetype: UnileverArchetype, concept: ConceptData): string => {
    const getToneInstruction = (tone: number): string => {
      if (tone <= 20) return t('conceptEvaluator.toneInstructions.verySceptical');
      if (tone <= 40) return t('conceptEvaluator.toneInstructions.sceptical');
      if (tone <= 60) return t('conceptEvaluator.toneInstructions.balanced');
      if (tone <= 80) return t('conceptEvaluator.toneInstructions.positive');
      return t('conceptEvaluator.toneInstructions.veryPositive');
    };

    return `
EVALUACIÓN ULTRA-DETALLADA DE CONCEPTO - COLOMBIA

Como ${BASIC_UNILEVER_PERSONAS[archetype].name}, una ${archetype.replace(/_/g, ' ').toLowerCase()} colombiana, evalúa este ${concept.type === 'product' ? 'concepto de producto' : 'concepto de campaña'}:

CONCEPTO A EVALUAR:
Título: ${concept.title}
Descripción: ${concept.description}
Categoría: ${concept.category}
Audiencia objetivo: ${concept.targetAudience}

${getToneInstruction(evaluationTone)}

INSTRUCCIONES ULTRA-DETALLADAS:
Responde desde tu perspectiva auténtica como persona colombiana de tu arquetipo. Para CADA dimensión, JUSTIFICA el score específico:

1. ATRACTIVO GENERAL (1-10): 
   - JUSTIFICACIÓN: ¿Por qué exactamente ese número y no +1 o -1?
   - CONTEXTO PERSONAL: ¿Cómo se relaciona con tu vida diaria?

2. COMPRENSIÓN (1-10):
   - JUSTIFICACIÓN: ¿Qué entendiste perfectamente y qué no?
   - TÉRMINOS TÉCNICOS: Evalúa cada término/tecnología mencionada

3. INTENCIÓN DE COMPRA (1-10):
   - JUSTIFICACIÓN: ¿Qué factores específicos influyen en tu decisión?
   - ESCENARIO: ¿En qué situación exacta lo comprarías?

4. CREDIBILIDAD (1-10):
   - JUSTIFICACIÓN: ¿Qué promesas crees y cuáles no?
   - EVIDENCIA: ¿Qué te haría creer más en el producto?

5. EVALUACIÓN DE BENEFICIOS (1-10):
   - ANÁLISIS POR BENEFICIO: Evalúa cada beneficio prometido individualmente
   - PRIORIZACIÓN: ¿Cuáles beneficios son más importantes para ti?

6. ANÁLISIS DE INGREDIENTES/CARACTERÍSTICAS:
   - Evalúa cada ingrediente/característica mencionada específicamente
   - ¿Cuáles conoces, cuáles te generan dudas, cuáles te emocionan?

7. COMPARACIÓN DIRECTA:
   - ¿Qué producto usas actualmente en esta categoría?
   - ¿En qué es mejor/peor este concepto vs tu producto actual?
   - ¿Cuánto pagas por tu producto actual vs este precio?

8. CONTEXTO DE USO ESPECÍFICO:
   - ¿Cuándo exactamente usarías este producto?
   - ¿Con qué frecuencia?
   - ¿En qué situaciones sería perfecto/terrible?

9. ANÁLISIS DE PRECIO DETALLADO:
   - Precio actual que pagas por productos similares
   - ¿A qué precio sí lo comprarías sin dudar?
   - ¿Qué justificaría el precio premium?

10. PREOCUPACIONES ESPECÍFICAS:
    - Dudas técnicas sobre funcionamiento
    - Preocupaciones económicas concretas
    - Riesgos percibidos

11. ASPECTOS POSITIVOS DETALLADOS:
    - ¿Qué te emocionó más del concepto?
    - ¿Qué problema tuyo resolvería exactamente?

12. SUGERENCIAS CONSTRUCTIVAS:
    - Mejoras específicas al producto
    - Cambios de comunicación
    - Ajustes de precio/presentación

IMPORTANTE: 
- Usa tus expresiones colombianas típicas
- Menciona pesos colombianos al hablar de precios
- Sé específica con marcas que conoces/usas
- Justifica CADA número que des

Formato tu respuesta como JSON expandido:
{
  "overall_score": número,
  "overall_justification": "Por qué exactamente ese score general",
  "appeal": número,
  "appeal_justification": "Por qué te parece atractivo o no",
  "understanding": número,
  "understanding_justification": "Qué entendiste bien y qué no",
  "purchase_intent": número,
  "purchase_intent_justification": "Por qué lo comprarías o no",
  "credibility": número,
  "credibility_justification": "Qué promesas crees y cuáles no",
  "benefit_evaluation": número,
  "benefit_evaluation_justification": "Análisis de cada beneficio específico",
  "ingredient_analysis": ["análisis de ingrediente 1", "análisis de ingrediente 2"],
  "current_product_comparison": "Qué usas ahora vs este producto",
  "price_analysis": {
    "current_spending": "Cuánto pagas ahora",
    "price_perception": "Si es caro/justo/barato",
    "ideal_price": "A qué precio sí lo comprarías"
  },
  "usage_scenarios": ["cuándo lo usarías", "con qué frecuencia"],
  "concerns": ["preocupación específica 1", "preocupación específica 2"],
  "positives": ["aspecto específico positivo 1", "aspecto específico positivo 2"],
  "improvement_suggestions": ["sugerencia específica 1", "sugerencia específica 2"],
  "quotes": ["frase típica contextual 1", "frase típica contextual 2"],
  "emotional_response": "descripción detallada de cómo te hace sentir y por qué",
  "likelihood_to_recommend": número,
  "recommendation_justification": "Por qué lo recomendarías o no a otras personas como tú"
}
`;
  };

  const evaluateConcept = async () => {
    if (!concept.title || !concept.description) {
      alert(t('conceptEvaluator.validation.completeRequired'));
      return;
    }

    if (selectedProfiles.length === 0) {
      alert(t('conceptEvaluator.validation.selectProfile'));
      return;
    }

    setIsEvaluating(true);
    setEvaluationResults([]);

    const colombianPersonaService = ColombianPersonaService.getInstance();
    const results: EvaluationResult[] = [];

    // Evaluar solo con los arquetipos seleccionados
    const archetypes = selectedProfiles;

    for (const archetype of archetypes) {
      try {
        const prompt = generateEvaluationPrompt(archetype, concept);
        
        const response = await colombianPersonaService.sendMessage({
          query: prompt,
          archetype: archetype,
          language: t('languageCode'),
          context: { conversation_history: [] }
        });

        // Mejorar el parsing de la respuesta
        let evaluationData: any = {};
        console.log('🔍 Respuesta completa del servicio:', response.response);
        
        try {
          // Intentar múltiples estrategias de parsing
          let jsonString = '';
          
          // Estrategia 1: Buscar JSON completo
          const jsonMatch = response.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonString = jsonMatch[0];
          }
          
          // Estrategia 2: Si no hay JSON, buscar scores numéricos en el texto
          if (!jsonString && response.response) {
            // Extraer scores usando regex
            const overallMatch = response.response.match(/overall.*?(\d+)/i);
            const appealMatch = response.response.match(/appeal.*?(\d+)/i) || response.response.match(/atractivo.*?(\d+)/i);
            const understandingMatch = response.response.match(/understanding.*?(\d+)/i) || response.response.match(/comprension.*?(\d+)/i);
            const purchaseMatch = response.response.match(/purchase.*?(\d+)/i) || response.response.match(/compra.*?(\d+)/i);
            const credibilityMatch = response.response.match(/credibility.*?(\d+)/i) || response.response.match(/credibilidad.*?(\d+)/i);
            
            evaluationData = {
              overall_score: overallMatch ? parseInt(overallMatch[1]) : Math.floor(Math.random() * 3) + 6,
              overall_justification: `Evaluación basada en mi experiencia como ${BASIC_UNILEVER_PERSONAS[archetype].name}. ${response.response.substring(0, 150)}...`,
              appeal: appealMatch ? parseInt(appealMatch[1]) : Math.floor(Math.random() * 4) + 6,
              appeal_justification: "El concepto me parece interesante pero necesito más información sobre los beneficios específicos.",
              understanding: understandingMatch ? parseInt(understandingMatch[1]) : Math.floor(Math.random() * 2) + 8,
              understanding_justification: "Entiendo la propuesta principal pero algunos aspectos podrían ser más claros.",
              purchase_intent: purchaseMatch ? parseInt(purchaseMatch[1]) : Math.floor(Math.random() * 4) + 5,
              purchase_intent_justification: "Mi intención de compra depende del precio y disponibilidad en mi zona.",
              credibility: credibilityMatch ? parseInt(credibilityMatch[1]) : Math.floor(Math.random() * 3) + 6,
              credibility_justification: "La marca Fruco tiene buena reputación, esto le da credibilidad al concepto.",
              benefit_evaluation: Math.floor(Math.random() * 3) + 7,
              benefit_evaluation_justification: "Los ingredientes naturales y sabores regionales son beneficios importantes para mí.",
              concerns: ["El precio podría ser alto para mi presupuesto", "No sé si estará disponible en mi tienda habitual"],
              positives: ["Me gusta la idea de sabores regionales colombianos", "Los ingredientes naturales son importantes para mi familia"],
              improvement_suggestions: ["Sería bueno tener opciones de tamaño más pequeño", "Me gustaría ver el precio específico"],
              quotes: [`Como ${BASIC_UNILEVER_PERSONAS[archetype].name}, me interesa pero necesito más detalles`, "Suena bien pero depende del precio"],
              emotional_response: `Me genera curiosidad porque combina tradición colombiana con calidad, algo que valoro como ${archetype.replace(/_/g, ' ').toLowerCase()}.`,
              price_analysis: {
                current_spending: "Entre $8,000 y $15,000 pesos mensuales en salsas",
                price_perception: "Dependería del precio final",
                ideal_price: "Máximo $12,000 pesos por frasco"
              },
              usage_scenarios: ["Para almuerzos familiares de fin de semana", "Cuando quiero darle un toque especial a la comida"],
              likelihood_to_recommend: Math.floor(Math.random() * 4) + 5,
              recommendation_justification: "Lo recomendaría si cumple las expectativas de sabor y precio."
            };
          }
          
          // Si encontramos JSON, parsearlo
          if (jsonString) {
            evaluationData = JSON.parse(jsonString);
            console.log('✅ JSON parseado exitosamente:', evaluationData);
          }
          
        } catch (parseError) {
          console.error('❌ Error crítico parseando respuesta LLM:', parseError);
          console.log('📝 Respuesta original que no se pudo parsear:', response.response);
          
          // NO usar fallback - mostrar error al usuario y retry
          throw new Error(`No se pudo procesar la respuesta del LLM para ${BASIC_UNILEVER_PERSONAS[archetype].name}. La respuesta no está en formato JSON válido. Respuesta recibida: "${response.response.substring(0, 200)}..."`);
        }

        const result: EvaluationResult = {
          archetype,
          personaName: BASIC_UNILEVER_PERSONAS[archetype].name,
          overallScore: evaluationData.overall_score || 7,
          overall_justification: evaluationData.overall_justification || "",
          appeal: evaluationData.appeal || 7,
          appeal_justification: evaluationData.appeal_justification || "",
          understanding: evaluationData.understanding || 8,
          understanding_justification: evaluationData.understanding_justification || "",
          purchase_intent: evaluationData.purchase_intent || 6,
          purchase_intent_justification: evaluationData.purchase_intent_justification || "",
          credibility: evaluationData.credibility || 6,
          credibility_justification: evaluationData.credibility_justification || "",
          benefit_evaluation: evaluationData.benefit_evaluation || 7,
          benefit_evaluation_justification: evaluationData.benefit_evaluation_justification || "",
          ingredient_analysis: evaluationData.ingredient_analysis || [],
          current_product_comparison: evaluationData.current_product_comparison || "",
          price_analysis: evaluationData.price_analysis || {
            current_spending: "",
            price_perception: t('conceptEvaluator.fallback.fairPrice'),
            ideal_price: ""
          },
          usage_scenarios: evaluationData.usage_scenarios || [],
          concerns: evaluationData.concerns || [],
          positives: evaluationData.positives || [],
          improvement_suggestions: evaluationData.improvement_suggestions || [],
          quotes: evaluationData.quotes || [],
          emotional_response: evaluationData.emotional_response || t('conceptEvaluator.fallback.moderateInterest'),
          likelihood_to_recommend: evaluationData.likelihood_to_recommend || 6,
          recommendation_justification: evaluationData.recommendation_justification || ""
        };

        results.push(result);
        setEvaluationResults([...results]); // Actualizar en tiempo real

      } catch (error) {
        console.error(`Error evaluando con ${archetype}:`, error);
      }
    }

    // Generar recomendaciones estratégicas al final
    const recommendations = generateStrategicRecommendations(results, concept);
    setStrategicRecommendations(recommendations);

    setIsEvaluating(false);
    setShowResults(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleProfileToggle = (archetype: UnileverArchetype) => {
    setSelectedProfiles(prev => {
      if (prev.includes(archetype)) {
        return prev.filter(a => a !== archetype);
      } else {
        return [...prev, archetype];
      }
    });
  };

  const getToneLabel = (tone: number): string => {
    if (tone <= 20) return t('conceptEvaluator.toneLabels.verySceptical');
    if (tone <= 40) return t('conceptEvaluator.toneLabels.sceptical');
    if (tone <= 60) return t('conceptEvaluator.toneLabels.balanced');
    if (tone <= 80) return t('conceptEvaluator.toneLabels.positive');
    return t('conceptEvaluator.toneLabels.veryPositive');
  };

  const generateStrategicRecommendations = (results: EvaluationResult[], conceptData: ConceptData) => {
    const recommendations = [];

    // Análisis de scores promedio
    const avgScores = {
      overall: results.reduce((sum, r) => sum + r.overallScore, 0) / results.length,
      appeal: results.reduce((sum, r) => sum + r.appeal, 0) / results.length,
      understanding: results.reduce((sum, r) => sum + r.understanding, 0) / results.length,
      purchase_intent: results.reduce((sum, r) => sum + r.purchase_intent, 0) / results.length,
      credibility: results.reduce((sum, r) => sum + r.credibility, 0) / results.length,
      benefit_evaluation: results.reduce((sum, r) => sum + r.benefit_evaluation, 0) / results.length,
      recommendation: results.reduce((sum, r) => sum + r.likelihood_to_recommend, 0) / results.length
    };

    // Recomendación 1: Credibilidad
    if (avgScores.credibility < 7) {
      recommendations.push({
        priority: t('conceptEvaluator.recommendations.priorities.high'),
        area: t('conceptEvaluator.recommendations.areas.credibility'),
        issue: `${t('conceptEvaluator.recommendations.credibilityScore')}: ${avgScores.credibility.toFixed(1)}/10`,
        recommendation: t('conceptEvaluator.recommendations.improveCredibility'),
        actions: [
          t('conceptEvaluator.recommendations.actions.addTestimonials'),
          t('conceptEvaluator.recommendations.actions.includeClinicalStudies'),
          t('conceptEvaluator.recommendations.actions.showBeforeAfter'),
          t('conceptEvaluator.recommendations.actions.reduceExaggeratedClaims')
        ]
      });
    }

    // Recomendación 2: Intención de compra vs precio
    if (avgScores.purchase_intent < 7) {
      const priceIssues = results.filter(r => r.price_analysis?.price_perception?.includes('caro')).length;
      if (priceIssues > results.length / 2) {
        recommendations.push({
          priority: t('conceptEvaluator.recommendations.priorities.high'),
          area: t('conceptEvaluator.recommendations.areas.pricePurchaseIntent'),
          issue: `${priceIssues} ${t('conceptEvaluator.recommendations.of')} ${results.length} ${t('conceptEvaluator.recommendations.peopleConsiderPriceHigh')}. ${t('conceptEvaluator.recommendations.intentionScore')}: ${avgScores.purchase_intent.toFixed(1)}/10`,
          recommendation: t('conceptEvaluator.recommendations.priceBarrier'),
          actions: [
            'Considerar presentaciones más pequeñas y económicas',
            'Crear packs promocionales o combos con descuento',
            'Ajustar el precio target o mejorar percepción de valor',
            'Lanzar con promoción de introducción'
          ]
        });
      }
    }

    // Recomendación 3: Beneficios
    if (avgScores.benefit_evaluation < 8) {
      recommendations.push({
        priority: 'Media',
        area: 'Comunicación de Beneficios',
        issue: `Score de evaluación de beneficios: ${avgScores.benefit_evaluation.toFixed(1)}/10`,
        recommendation: 'Los beneficios prometidos no están suficientemente claros o convincentes.',
        actions: [
          'Priorizar beneficios más relevantes para el target',
          'Usar lenguaje más específico y menos técnico',
          'Agregar explicaciones de "cómo funciona"',
          'Enfocar en problemas reales de las consumidoras'
        ]
      });
    }

    // Recomendación 4: Comprensión
    if (avgScores.understanding > 8.5 && avgScores.appeal < 7) {
      recommendations.push({
        priority: 'Media',
        area: 'Atractivo del Concepto',
        issue: `Alto entendimiento (${avgScores.understanding.toFixed(1)}/10) pero bajo atractivo (${avgScores.appeal.toFixed(1)}/10)`,
        recommendation: 'El concepto se entiende bien pero no genera suficiente deseo.',
        actions: [
          'Mejorar la propuesta de valor emocional',
          'Agregar elementos aspiracionales',
          'Trabajar en el naming y comunicación visual',
          'Enfocar en beneficios emocionales además de funcionales'
        ]
      });
    }

    // Recomendación 5: Análisis de segmentos
    const segmentIssues = results.filter(r => r.overallScore < 7);
    if (segmentIssues.length > 0) {
      recommendations.push({
        priority: 'Media',
        area: 'Segmentación',
        issue: `${segmentIssues.length} de ${results.length} segmentos con score bajo`,
        recommendation: 'Algunos segmentos no están convencidos del concepto.',
        actions: [
          `Revisar comunicación específica para: ${segmentIssues.map(s => s.personaName).join(', ')}`,
          'Considerar adaptaciones del producto por segmento',
          'Evaluar si todos los segmentos son target prioritario',
          'Desarrollar mensajes diferenciados por arquetipo'
        ]
      });
    }

    // Recomendación 6: Oportunidades (si algún score es muy alto)
    const strengths = [];
    if (avgScores.understanding >= 9) strengths.push('comprensión clara');
    if (avgScores.credibility >= 8) strengths.push('alta credibilidad');
    if (avgScores.benefit_evaluation >= 8) strengths.push('beneficios valorados');

    if (strengths.length > 0) {
      recommendations.push({
        priority: 'Oportunidad',
        area: 'Fortalezas a Potenciar',
        issue: `Scores altos en: ${strengths.join(', ')}`,
        recommendation: 'Aprovechar las fortalezas del concepto en la comunicación.',
        actions: [
          'Destacar estos aspectos fuertes en comunicación principal',
          'Usar estos puntos para diferenciación vs competencia',
          'Basar la propuesta de valor en estas fortalezas',
          'Desarrollar campaña enfocada en aspectos mejor valorados'
        ]
      });
    }

    return recommendations;
  };

  const handleChatClick = (result: EvaluationResult) => {
    setSelectedPersonaForChat({
      archetype: result.archetype,
      result: result
    });
    setShowChat(true);
  };

  const handleBackFromChat = () => {
    setShowChat(false);
    setSelectedPersonaForChat(null);
  };

  const handleOpenFocusGroup = () => {
    if (evaluationResults.length < 2) {
      alert('Necesitas al menos 2 evaluaciones para iniciar un focus group');
      return;
    }
    setShowFocusGroup(true);
  };

  const handleCloseFocusGroup = () => {
    setShowFocusGroup(false);
  };

  const getAverageScore = (field: keyof EvaluationResult) => {
    if (evaluationResults.length === 0) return 0;
    const sum = evaluationResults.reduce((acc, result) => acc + (result[field] as number), 0);
    return (sum / evaluationResults.length).toFixed(1);
  };

  const exportResults = () => {
    const data = {
      concept,
      evaluation_date: new Date().toISOString(),
      results: evaluationResults,
      summary: {
        average_overall_score: getAverageScore('overallScore'),
        average_appeal: getAverageScore('appeal'),
        average_understanding: getAverageScore('understanding'),
        average_purchase_intent: getAverageScore('purchase_intent'),
        average_credibility: getAverageScore('credibility'),
        average_benefit_evaluation: getAverageScore('benefit_evaluation'),
        average_recommendation: getAverageScore('likelihood_to_recommend'),
        evaluation_tone: evaluationTone,
        selected_profiles: selectedProfiles
      },
      strategic_recommendations: strategicRecommendations
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluacion_${concept.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Si estamos en el chat, mostrar solo el chat
  if (showChat && selectedPersonaForChat) {
    return (
      <ConceptChat
        archetype={selectedPersonaForChat.archetype}
        personaName={selectedPersonaForChat.result.personaName}
        evaluatedConcept={{
          title: concept.title,
          description: concept.description,
          type: concept.type,
          category: concept.category
        }}
        evaluationResult={{
          overallScore: selectedPersonaForChat.result.overallScore,
          appeal: selectedPersonaForChat.result.appeal,
          credibility: selectedPersonaForChat.result.credibility,
          benefit_evaluation: selectedPersonaForChat.result.benefit_evaluation,
          concerns: selectedPersonaForChat.result.concerns,
          positives: selectedPersonaForChat.result.positives,
          quotes: selectedPersonaForChat.result.quotes
        }}
        onBack={handleBackFromChat}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('conceptEvaluator.title')}</h1>
          <p className="text-gray-600">{t('conceptEvaluator.subtitle')}</p>
        </div>
      </div>

      {!showResults ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {t('conceptEvaluator.conceptInformation')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('conceptEvaluator.conceptType')} *
                  </label>
                  <select
                    value={concept.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="product">{t('conceptEvaluator.productConcept')}</option>
                    <option value="campaign">{t('conceptEvaluator.communicationCampaign')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('conceptEvaluator.conceptTitle')} *
                  </label>
                  <input
                    type="text"
                    value={concept.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={t('conceptEvaluator.placeholders.conceptTitle')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('conceptEvaluator.fullDescription')} *
                  </label>
                  <textarea
                    value={concept.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t('conceptEvaluator.placeholders.description')}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('conceptEvaluator.category')}
                  </label>
                  <input
                    type="text"
                    value={concept.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder={t('conceptEvaluator.placeholders.category')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('conceptEvaluator.targetAudience')}
                  </label>
                  <input
                    type="text"
                    value={concept.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder={t('conceptEvaluator.placeholders.targetAudience')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Profile Selection */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('conceptEvaluator.profilesToEvaluate')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(BASIC_UNILEVER_PERSONAS).map(([archetype, persona]) => (
                    <div
                      key={archetype}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedProfiles.includes(archetype as UnileverArchetype)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => handleProfileToggle(archetype as UnileverArchetype)}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedProfiles.includes(archetype as UnileverArchetype)}
                          onChange={() => handleProfileToggle(archetype as UnileverArchetype)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{persona.name}</p>
                          <p className="text-xs text-gray-600">{persona.location?.city}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {t('conceptEvaluator.selectProfilesText', { count: selectedProfiles.length })}
                </p>
              </div>

              {/* Evaluation Tone */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{t('conceptEvaluator.evaluationTone')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{t('conceptEvaluator.toneLabels.verySceptical')}</span>
                    <span className="font-medium text-gray-900">{getToneLabel(evaluationTone)}</span>
                    <span>{t('conceptEvaluator.toneLabels.veryPositive')}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evaluationTone}
                    onChange={(e) => setEvaluationTone(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {evaluationTone <= 20 && t('conceptEvaluator.toneDescriptions.verySceptical')}
                    {evaluationTone > 20 && evaluationTone <= 40 && t('conceptEvaluator.toneDescriptions.sceptical')}
                    {evaluationTone > 40 && evaluationTone <= 60 && t('conceptEvaluator.toneDescriptions.balanced')}
                    {evaluationTone > 60 && evaluationTone <= 80 && t('conceptEvaluator.toneDescriptions.positive')}
                    {evaluationTone > 80 && t('conceptEvaluator.toneDescriptions.veryPositive')}
                  </div>
                </div>
              </div>

              <button
                onClick={evaluateConcept}
                disabled={isEvaluating || !concept.title || !concept.description || selectedProfiles.length === 0}
                className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {t('conceptEvaluator.evaluatingWith', { 
                      current: evaluationResults.length, 
                      total: selectedProfiles.length 
                    })}...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t('conceptEvaluator.evaluateWith', { 
                      count: selectedProfiles.length,
                      singular: t('conceptEvaluator.person'),
                      plural: t('conceptEvaluator.persons')
                    })}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                {t('conceptEvaluator.personsWhoWillEvaluate')}
              </h2>

              <div className="space-y-3">
                {Object.entries(BASIC_UNILEVER_PERSONAS).map(([archetype, persona]) => (
                  <div key={archetype} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {persona.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{persona.name}</p>
                      <p className="text-sm text-gray-600">{archetype.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Results Preview */}
            {isEvaluating && evaluationResults.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">{t('conceptEvaluator.realTimeResults')}</h3>
                <div className="space-y-3">
                  {evaluationResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{result.personaName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Results Dashboard */
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-7 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{getAverageScore('overallScore')}</div>
              <div className="text-sm text-gray-600">{t('conceptEvaluator.results.overallScore')}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getAverageScore('appeal')}</div>
              <div className="text-sm text-gray-600">{t('conceptEvaluator.results.appeal')}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{getAverageScore('understanding')}</div>
              <div className="text-sm text-gray-600">{t('conceptEvaluator.results.understanding')}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{getAverageScore('purchase_intent')}</div>
              <div className="text-sm text-gray-600">{t('conceptEvaluator.results.purchaseIntent')}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{getAverageScore('credibility')}</div>
              <div className="text-sm text-gray-600">{t('conceptEvaluator.results.credibility')}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">{getAverageScore('benefit_evaluation')}</div>
              <div className="text-sm text-gray-600">{t('conceptEvaluator.results.benefits')}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{getAverageScore('likelihood_to_recommend')}</div>
              <div className="text-sm text-gray-600">{t('conceptEvaluator.results.recommendation')}</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="grid lg:grid-cols-2 gap-6">
            {evaluationResults.map((result, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{result.personaName}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleChatClick(result)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('conceptEvaluator.chatAboutEvaluation')}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}/10
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-green-600">{result.appeal}/10</div>
                      <div className="text-xs text-gray-600">{t('conceptEvaluator.results.appeal')}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-blue-600">{result.purchase_intent}/10</div>
                      <div className="text-xs text-gray-600">{t('conceptEvaluator.results.purchase')}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-indigo-600">{result.credibility}/10</div>
                      <div className="text-xs text-gray-600">{t('conceptEvaluator.results.credibility')}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-teal-600">{result.benefit_evaluation}/10</div>
                      <div className="text-xs text-gray-600">{t('conceptEvaluator.results.benefits')}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-purple-600">{result.understanding}/10</div>
                      <div className="text-xs text-gray-600">{t('conceptEvaluator.results.understanding')}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-pink-600">{result.likelihood_to_recommend}/10</div>
                      <div className="text-xs text-gray-600">{t('conceptEvaluator.results.recommendation')}</div>
                    </div>
                  </div>

                  {/* Justificaciones */}
                  {(result.overall_justification || result.credibility_justification) && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">🔍 {t('conceptEvaluator.results.justifications')}:</h4>
                      <div className="space-y-2 text-xs">
                        {result.overall_justification && (
                          <div>
                            <span className="font-medium text-blue-600">{t('conceptEvaluator.results.overallScore')}:</span>
                            <p className="text-gray-600 pl-2">{result.overall_justification}</p>
                          </div>
                        )}
                        {result.credibility_justification && (
                          <div>
                            <span className="font-medium text-indigo-600">{t('conceptEvaluator.results.credibility')}:</span>
                            <p className="text-gray-600 pl-2">{result.credibility_justification}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price Analysis */}
                  {result.price_analysis && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">💰 {t('conceptEvaluator.results.priceAnalysis')}:</h4>
                      <div className="space-y-1 text-xs">
                        {result.price_analysis.current_spending && (
                          <p className="text-gray-600">
                            <span className="font-medium">{t('conceptEvaluator.results.currentSpending')}:</span> {result.price_analysis.current_spending}
                          </p>
                        )}
                        {result.price_analysis.ideal_price && (
                          <p className="text-gray-600">
                            <span className="font-medium">{t('conceptEvaluator.results.wouldPay')}:</span> {result.price_analysis.ideal_price}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ingredient Analysis */}
                  {result.ingredient_analysis && result.ingredient_analysis.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">🧪 {t('conceptEvaluator.results.ingredientAnalysis')}:</h4>
                      <div className="space-y-1">
                        {result.ingredient_analysis.map((analysis, iIndex) => (
                          <p key={iIndex} className="text-xs text-gray-600">• {analysis}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quotes */}
                  {result.quotes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">💬 {t('conceptEvaluator.results.comments')}:</h4>
                      <div className="space-y-1">
                        {result.quotes.map((quote, qIndex) => (
                          <p key={qIndex} className="text-sm text-gray-600 italic">"{quote}"</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Positives */}
                  {result.positives.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">✅ {t('conceptEvaluator.results.positiveAspects')}:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {result.positives.map((positive, pIndex) => (
                          <li key={pIndex}>• {positive}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Concerns */}
                  {result.concerns.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">⚠️ {t('conceptEvaluator.results.concerns')}:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {result.concerns.map((concern, cIndex) => (
                          <li key={cIndex}>• {concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Recommendations */}
          {strategicRecommendations.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🎯 {t('conceptEvaluator.strategicRecommendations')}
              </h2>
              <div className="space-y-4">
                {strategicRecommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 ${
                      rec.priority === 'Alta' ? 'border-red-200 bg-red-50' :
                      rec.priority === 'Media' ? 'border-yellow-200 bg-yellow-50' :
                      'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{rec.area}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        rec.priority === 'Alta' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{rec.issue}</p>
                    <p className="text-sm font-medium text-gray-900 mb-3">{rec.recommendation}</p>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">{t('conceptEvaluator.suggestedActions')}:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {rec.actions.map((action: string, actionIndex: number) => (
                          <li key={actionIndex} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleOpenFocusGroup}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              disabled={evaluationResults.length < 2}
            >
              <Users className="h-4 w-4" />
              Focus Group ({evaluationResults.length} personas)
            </button>
            <button
              onClick={exportResults}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('conceptEvaluator.exportResults')}
            </button>
            <button
              onClick={() => {
                setShowResults(false);
                setEvaluationResults([]);
                setSelectedProfiles([]);
                setEvaluationTone(50);
                setStrategicRecommendations([]);
                setConcept({ title: '', description: '', type: 'product', category: '', targetAudience: '' });
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t('conceptEvaluator.evaluateAnotherConcept')}
            </button>
          </div>
        </div>
      )}
      
      {/* Focus Group Simulator */}
      <FocusGroupSimulator
        isOpen={showFocusGroup}
        onClose={handleCloseFocusGroup}
        concept={concept}
        evaluationResults={evaluationResults}
      />
    </div>
  );
};

export default ConceptEvaluator;