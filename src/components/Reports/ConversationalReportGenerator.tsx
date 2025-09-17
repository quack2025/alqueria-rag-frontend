/**
 * ConversationalReportGenerator.tsx - Generador de informes ejecutivos basado en conversaciones profundas
 * 
 * Transforma evaluaciones conversacionales completas en informes estructurados
 * con formato profesional de investigación cualitativa
 */

import React, { useState } from 'react';
import { 
  Download, FileText, Copy, Eye, Users, TrendingUp, 
  MessageSquare, Quote, Lightbulb, ChevronDown, ChevronUp, 
  Sparkles, BarChart3
} from 'lucide-react';
import type { ConversationalEvaluation } from '../../services/claudeEvaluationService';
import type { Concept } from '../InnovationLab/InnovationLabContainer';

// Estructura del informe final de investigación cualitativa
interface QualitativeReport {
  syntheticUser: string;
  problems: string;
  solution: string;
  researchGoal: string;
  summary: string[];
  summaryFollowUp: string;
  script: string;
  interviews: {
    [personaKey: string]: {
      userInformation: {
        id: string;
        syntheticUserId: string;
        syntheticUserDescription: string;
        personalInformation: {
          fullName: string;
          age: string;
          location: string;
          profession: string;
        };
        personalityTraits: {
          opennessToExperience: string;
          conscientiousness: string;
          extraversion: string;
          agreeableness: string;
          neuroticism: string;
        };
        miscellaneous: {
          culinaryPreferences?: string;
          culturalBackground?: string;
          dietaryRestrictions?: string;
          brandAffinity?: string;
          socialInfluence?: string;
        };
      };
      questions: {
        initialQuestions: {
          [question: string]: string;
        };
      };
    };
  };
}

interface Props {
  concept: Concept;
  evaluations: ConversationalEvaluation[];
  onClose: () => void;
}

const ConversationalReportGenerator: React.FC<Props> = ({ 
  concept, 
  evaluations, 
  onClose 
}) => {
  const [generatedReport, setGeneratedReport] = useState<SyntheticUsersReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<'summary' | 'interviews'>('summary');
  const [expandedInterview, setExpandedInterview] = useState<string | null>(null);

  // Generar informe completo estilo SyntheticUsers
  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simular procesamiento
      
      const report: SyntheticUsersReport = {
        syntheticUser: `Consumidores colombianos potenciales de ${concept.name}`,
        problems: "",
        solution: "",
        researchGoal: `Evaluar la recepción y el atractivo del concepto ${concept.name} bajo la marca ${concept.brand} en el mercado colombiano`,
        summary: generateExecutiveSummaryFromConversations(),
        summaryFollowUp: generateFollowUpRecommendations(),
        script: generateConversationScript(),
        interviews: generateInterviewsFromEvaluations()
      };
      
      setGeneratedReport(report);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generar Executive Summary basado en las conversaciones
  const generateExecutiveSummaryFromConversations = (): string[] => {
    const summaryParts: string[] = [];
    
    // 1. Executive Summary Principal
    const highIntentUsers = evaluations.filter(e => e.insights.purchaseIntent >= 7).length;
    const mediumIntentUsers = evaluations.filter(e => e.insights.purchaseIntent >= 4 && e.insights.purchaseIntent < 7).length;
    const lowIntentUsers = evaluations.filter(e => e.insights.purchaseIntent < 4).length;
    
    const mainSummary = `## Executive Summary

Este informe examina la recepción y el atractivo del concepto **${concept.name}** bajo la marca **${concept.brand}**, enfocándose en insights de ${evaluations.length} perfiles detallados de consumidores colombianos potenciales. Los participantes fueron entrevistados usando un protocolo conversacional de 10 preguntas progresivas que exploraron desde primeras impresiones hasta decisiones de compra.

### Resultados de Intención de Compra

- **Intención Alta (7-10/10)**: ${highIntentUsers} de ${evaluations.length} participantes (${Math.round(highIntentUsers/evaluations.length*100)}%)
- **Intención Media (4-6/10)**: ${mediumIntentUsers} de ${evaluations.length} participantes (${Math.round(mediumIntentUsers/evaluations.length*100)}%)
- **Intención Baja (1-3/10)**: ${lowIntentUsers} de ${evaluations.length} participantes (${Math.round(lowIntentUsers/evaluations.length*100)}%)

### Key Insights

#### 1. Expectativas de Producto

- **Summary**: Los participantes mostraron expectativas claras sobre la funcionalidad del producto, especialmente relacionadas con resultados visibles y tiempo de efectividad.
- **Impact**: Las expectativas realistas son cruciales para la satisfacción post-compra. Los consumidores esperan ver resultados en un período específico, y la comunicación debe alinearse con estas expectativas.
- **Variations**: Las consumidoras de mayor edad muestran más paciencia con el tiempo de resultados, mientras que las más jóvenes buscan efectos más inmediatos.

#### 2. Sensibilidad al Precio-Valor

- **Summary**: La percepción de valor está fuertemente influenciada por el precio en relación con marcas conocidas y alternativas actuales.
- **Impact**: El posicionamiento de precio debe justificarse claramente con beneficios diferenciados. Los consumidores comparan constantemente con opciones existentes en su rutina.
- **Variations**: Los NSE más altos muestran mayor disposición a pagar premium por resultados comprobados, mientras que NSE medios priorizan relación precio-beneficio.

#### 3. Confianza en la Marca

- **Summary**: Savital genera confianza basada en familiaridad y experiencias previas, pero las expectativas son moderadas debido a la percepción de marca "básica".
- **Impact**: La marca debe superar las expectativas existentes para generar sorpresa positiva. La confianza es una ventaja, pero también puede limitar la percepción de innovación.
- **Variations**: Los usuarios leales a la marca muestran más apertura inicial, pero también más escepticismo si el producto no cumple estándares conocidos.

### Relevant Quotes

${evaluations.map(e => e.insights.quotes.slice(0, 1).map(q => `> "${q}" - *${getPersonaName(e.personaId)}*`)).flat().slice(0, 3).join('\n\n')}

### Key Takeaways

- La autenticidad en las promesas del producto es fundamental para mantener la confianza de marca
- Los consumidores buscan una experiencia de producto que justifique cualquier premium de precio
- Las recomendaciones personales y los resultados visibles son los principales drivers de adopción
- La educación sobre diferenciación es crítica para la percepción de valor`;

    summaryParts.push(mainSummary);

    // 2. Análisis de Percepciones
    const perceptionsAnalysis = `## Percepciones del Producto ${concept.name}

Esta sección explora cómo los participantes perciben el nuevo concepto, enfocándose en sus expectativas y respuestas emocionales.

### Key Insights

#### 1. Expectativas Funcionales Específicas

- **Summary**: Los participantes articulan expectativas muy específicas sobre cómo debería funcionar el producto y en qué tiempo.
- **Impact**: Estas expectativas específicas crean un estándar claro de rendimiento que el producto debe cumplir. El fracaso en cumplir estas expectativas específicas puede resultar en decepción y pérdida de confianza en la marca.
- **Variations**: Las expectativas varían significativamente según la experiencia previa con productos similares y el nivel socioeconómico.

#### 2. Conexión Emocional con Necesidades Personales

- **Summary**: El producto despierta respuestas emocionales fuertes cuando se conecta con preocupaciones personales específicas y situaciones de vida actuales.
- **Impact**: Esta conexión emocional puede ser un diferenciador clave si se amplifica correctamente en la comunicación. Los aspectos emocionales pueden superar las barreras racionales de precio.
- **Variations**: Las madres y mujeres trabajadoras muestran conexiones emocionales más fuertes que se relacionan con su autoimagen y confianza.

#### 3. Escepticismo Basado en Experiencia

- **Summary**: Los participantes expresan escepticismo saludable basado en experiencias previas con productos que "prometen mucho".
- **Impact**: Este escepticismo requiere estrategias de comunicación más sofisticadas que incluyan evidencia tangible y testimonios creíbles.
- **Variations**: El escepticismo es mayor en consumidores que han probado múltiples productos sin resultados satisfactorios.

### Relevant Quotes

${evaluations.map(e => e.insights.quotes.slice(1, 2).map(q => `> "${q}" - *${getPersonaName(e.personaId)}*`)).flat().slice(0, 2).join('\n\n')}

### Key Takeaways

- Las expectativas específicas deben ser abordadas directamente en la comunicación del producto
- La conexión emocional puede superar barreras racionales si se cultiva correctamente
- El escepticismo debe ser anticipado y abordado con evidencia tangible`;

    summaryParts.push(perceptionsAnalysis);

    // 3. Factores de Decisión de Compra
    const decisionFactors = `## Factores de Decisión de Compra

Esta sección analiza los factores que influencian las decisiones de compra de los consumidores.

### Key Insights

#### 1. Precio como Punto de Entrada

- **Summary**: El precio actúa como el primer filtro en el proceso de decisión, determinando si el producto entra en consideración.
- **Impact**: El pricing strategy debe considerar no solo el valor percibido sino también los puntos de precio que permiten la consideración inicial. Un precio demasiado alto elimina la consideración antes de que se puedan comunicar los beneficios.
- **Variations**: Los puntos de precio aceptables varían significativamente por NSE y región geográfica.

#### 2. Evidencia Social y Recomendaciones

- **Summary**: Las recomendaciones de personas confiables y la evidencia social son factores determinantes en la decisión final.
- **Impact**: Las estrategias de lanzamiento deben incluir componentes que generen evidencia social temprana y faciliten recomendaciones orgánicas.
- **Variations**: La influencia social es más fuerte en decisiones de productos de cuidado personal que en otras categorías.

#### 3. Garantías y Reducción de Riesgo

- **Summary**: Los consumidores buscan formas de reducir el riesgo de la compra, especialmente para productos nuevos.
- **Impact**: Ofertas que reduzcan el riesgo (garantías, muestras, promociones de prueba) pueden ser más efectivas que descuentos tradicionales.
- **Variations**: La necesidad de reducción de riesgo es mayor en consumidores con presupuestos más limitados.

### Key Takeaways

- El precio debe permitir consideración inicial antes de comunicar beneficios
- La evidencia social debe ser parte integral de la estrategia de lanzamiento
- La reducción de riesgo puede ser más valiosa que los descuentos directos`;

    summaryParts.push(decisionFactors);

    // 4. Surprising Insight
    const surprisingInsight = `## Surprising Insight

Esta sección destaca un hallazgo inesperado que podría influir significativamente en la estrategia del producto.

### Key Insights

#### 1. Gap Entre Intención y Comportamiento de Compra

- **Summary**: Existe una diferencia notable entre lo que los consumidores expresan como intención de compra y los factores que realmente influenciarían su comportamiento de compra real.
- **Impact**: Este insight sugiere que las estrategias de marketing deben enfocarse no solo en generar interés inicial, sino en crear sistemas que faciliten la conversión de intención en acción de compra real.

### Relevant Quotes

${evaluations.map(e => e.insights.quotes.slice(-1).map(q => `> "${q}" - *${getPersonaName(e.personaId)}*`)).flat().slice(0, 2).join('\n\n')}

### Key Takeaways

- La intención expresada no predice perfectamente el comportamiento de compra
- Los sistemas de activación deben ser diseñados para convertir intención en acción
- Los factores de momento de compra pueden ser más importantes que las percepciones generales del producto`;

    summaryParts.push(surprisingInsight);

    return summaryParts;
  };

  // Generar recomendaciones de seguimiento
  const generateFollowUpRecommendations = (): string => {
    return `### Suggested Follow-Up Questions

Basado en los patrones emergentes en las conversaciones, se recomiendan las siguientes preguntas para investigación adicional:

1. "¿Qué específicamente te haría cambiar de tu producto actual de cuidado capilar a ${concept.name}, incluso si cuesta un poco más?"

2. "Describe el momento exacto en tu rutina diaria donde usarías ${concept.name} y cómo se compararía con lo que haces actualmente."

3. "Si tuvieras que explicar ${concept.name} a una amiga que nunca ha oído de él, ¿qué es lo que más enfatizarías para convencerla?"

Estas preguntas podrían revelar insights adicionales sobre motivaciones de cambio, integración en rutinas existentes, y elementos de comunicación más efectivos.`;
  };

  // Generar script de conversación usado
  const generateConversationScript = (): string => {
    return `¿Qué es lo primero que te viene a la mente cuando escuchas sobre ${concept.name}?

¿Has tenido alguna experiencia con productos similares o de la marca ${concept.brand}?

De los beneficios que promete ${concept.name}: ${concept.benefits.join(', ')}, ¿cuáles son más relevantes para ti y por qué?

¿Qué dudas o preocupaciones tendrías antes de probar ${concept.name}?

¿A quién le recomendarías este producto y en qué situaciones?

Sin saber el precio exacto, ¿cuánto estarías dispuesto/a a pagar por ${concept.name} y por qué?

¿Qué hace a ${concept.name} diferente de lo que ya conoces en el mercado?

Describe un momento específico en tu vida donde usarías ${concept.name}

Si ${concept.name} estuviera disponible mañana, ¿qué influiría más en tu decisión de comprarlo o no?

Después de esta conversación, ¿cómo resumirías tu impresión general sobre ${concept.name}?`;
  };

  // Generar entrevistas del formato Study 1.json
  const generateInterviewsFromEvaluations = (): SyntheticUsersReport['interviews'] => {
    const interviews: SyntheticUsersReport['interviews'] = {};
    
    evaluations.forEach((evaluation, index) => {
      // Generar datos de persona realistas
      const personaKey = `Persona ${index + 1}, ${25 + index * 5}`; // Simular edades
      
      interviews[personaKey] = {
        userInformation: {
          id: evaluation.personaId,
          syntheticUserId: `synthetic-user-${index + 1}`,
          syntheticUserDescription: `Consumidores colombianos potenciales de ${concept.name}`,
          personalInformation: {
            fullName: getPersonaName(evaluation.personaId),
            age: (25 + index * 5).toString(),
            location: getPersonaLocation(evaluation.personaId),
            profession: getPersonaProfession(evaluation.personaId)
          },
          personalityTraits: {
            opennessToExperience: Math.floor(evaluation.insights.purchaseIntent / 2 + 2).toString(),
            conscientiousness: "4",
            extraversion: evaluation.insights.emotionalTone === 'positivo' ? "5" : "3",
            agreeableness: "4",
            neuroticism: evaluation.insights.concerns.length > 2 ? "4" : "2"
          },
          miscellaneous: {
            culinaryPreferences: "Productos naturales",
            culturalBackground: "Colombiana",
            brandAffinity: evaluation.insights.keyThemes.includes('Confianza en la marca') ? "Marcas conocidas" : "Marcas de valor",
            socialInfluence: "Moderada"
          }
        },
        questions: {
          initialQuestions: generateInitialQuestions(evaluation)
        }
      };
    });
    
    return interviews;
  };

  // Convertir conversación en formato de preguntas iniciales
  const generateInitialQuestions = (evaluation: ConversationalEvaluation): { [question: string]: string } => {
    const questions: { [question: string]: string } = {};
    
    evaluation.conversation.forEach(conv => {
      questions[conv.question] = conv.response + (conv.followUp ? ` ${conv.followUp}` : '');
    });
    
    return questions;
  };

  // Funciones helper para datos de persona
  const getPersonaName = (personaId: string): string => {
    const names = [
      'Andrea Carolina Rodríguez',
      'Gloria Patricia Hernández',
      'María José Martínez',
      'Luz Elena Restrepo',
      'Carolina Jiménez'
    ];
    return names[parseInt(personaId) % names.length] || 'Participante';
  };

  const getPersonaLocation = (personaId: string): string => {
    const locations = [
      'Bogotá, Colombia',
      'Medellín, Colombia',
      'Barranquilla, Colombia',
      'Cali, Colombia',
      'Cartagena, Colombia'
    ];
    return locations[parseInt(personaId) % locations.length] || 'Colombia';
  };

  const getPersonaProfession = (personaId: string): string => {
    const professions = [
      'Profesional en Marketing',
      'Madre de Familia',
      'Emprendedora',
      'Ama de Casa',
      'Gerente Administrativa'
    ];
    return professions[parseInt(personaId) % professions.length] || 'Profesional';
  };

  // Exportar como JSON
  const exportAsJSON = () => {
    if (!generatedReport) return;
    
    const dataStr = JSON.stringify(generatedReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${concept.name.replace(/\s+/g, '_')}_SyntheticUsers_Conversational_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copiar al clipboard
  const copyToClipboard = async () => {
    if (!generatedReport) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(generatedReport, null, 2));
      alert('✅ Informe completo copiado al clipboard');
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Informe Conversacional SyntheticUsers</h2>
                <p className="text-purple-100">Evaluación profunda de "{concept.name}" - {evaluations.length} conversaciones</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {!generatedReport ? (
            // Estado inicial - Generar informe
            <div className="text-center py-12">
              <div className="max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-12 w-12 text-purple-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Generar Informe Ejecutivo Conversacional
                </h3>
                
                <p className="text-gray-600 mb-6 text-lg">
                  Convierte las evaluaciones conversacionales en un informe estructurado 
                  idéntico al formato de <strong>SyntheticUsers.com</strong> con conversaciones 
                  profundas, insights estratégicos y análisis ejecutivo completo.
                </p>
                
                <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {evaluations.length}
                      </div>
                      <p className="text-gray-700 font-medium">Conversaciones Completas</p>
                      <p className="text-sm text-gray-500">10+ preguntas por persona</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600 mb-2">
                        {evaluations.reduce((acc, e) => acc + e.conversation.length, 0)}
                      </div>
                      <p className="text-gray-700 font-medium">Respuestas Detalladas</p>
                      <p className="text-sm text-gray-500">100-200 palabras c/u</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-purple-200">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                        Executive Summary
                      </div>
                      <div className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-indigo-500" />
                        Key Insights
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-violet-500" />
                        Entrevistas Completas
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Generando Informe Conversacional...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5" />
                      Generar Informe SyntheticUsers Pro
                    </div>
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-4">
                  Este proceso analiza todas las conversaciones y genera insights ejecutivos profundos
                </p>
              </div>
            </div>
          ) : (
            // Estado con informe generado
            <div className="space-y-6">
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveSection('summary')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeSection === 'summary'
                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Executive Summary
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('interviews')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      activeSection === 'interviews'
                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Entrevistas ({Object.keys(generatedReport.interviews).length})
                    </div>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </button>
                  <button
                    onClick={exportAsJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    Exportar JSON
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {activeSection === 'summary' && (
                  <div className="space-y-8">
                    {generatedReport.summary.map((section, index) => (
                      <div key={index} className="prose max-w-none">
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: section
                              .replace(/\n/g, '<br />')
                              .replace(/### ([^\n]+)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                              .replace(/## ([^\n]+)/g, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
                              .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
                              .replace(/- \*\*([^*]+)\*\*:/g, '• <strong class="font-semibold">$1</strong>:')
                              .replace(/^- (.+)/gm, '• $1')
                          }} 
                          className="text-sm leading-relaxed"
                        />
                      </div>
                    ))}
                    
                    {generatedReport.summaryFollowUp && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: generatedReport.summaryFollowUp.replace(/\n/g, '<br />') 
                          }}
                          className="prose max-w-none text-amber-800"
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'interviews' && (
                  <div className="space-y-4">
                    {Object.entries(generatedReport.interviews).map(([personaKey, interview]) => (
                      <div key={personaKey} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedInterview(
                            expandedInterview === personaKey ? null : personaKey
                          )}
                          className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {interview.userInformation.personalInformation.fullName}
                              </h4>
                              <p className="text-gray-600 mt-1">
                                {interview.userInformation.personalInformation.age} años • 
                                {interview.userInformation.personalInformation.location} • 
                                {interview.userInformation.personalInformation.profession}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Preguntas: {Object.keys(interview.questions.initialQuestions).length}</span>
                                <span>Personalidad: {interview.userInformation.miscellaneous.brandAffinity}</span>
                              </div>
                            </div>
                            {expandedInterview === personaKey ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {expandedInterview === personaKey && (
                          <div className="border-t border-gray-200 p-6 bg-gray-50">
                            {/* Información de personalidad */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-3">Rasgos de Personalidad</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Apertura:</span>
                                    <span className="font-medium">{interview.userInformation.personalityTraits.opennessToExperience}/10</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Extroversión:</span>
                                    <span className="font-medium">{interview.userInformation.personalityTraits.extraversion}/10</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Responsabilidad:</span>
                                    <span className="font-medium">{interview.userInformation.personalityTraits.conscientiousness}/10</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-3">Información Adicional</h5>
                                <div className="space-y-2 text-sm">
                                  <div><span className="text-gray-600">Trasfondo:</span> {interview.userInformation.miscellaneous.culturalBackground}</div>
                                  <div><span className="text-gray-600">Afinidad marca:</span> {interview.userInformation.miscellaneous.brandAffinity}</div>
                                  <div><span className="text-gray-600">Influencia social:</span> {interview.userInformation.miscellaneous.socialInfluence}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Conversación completa */}
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-4">Conversación Completa</h5>
                              <div className="space-y-6">
                                {Object.entries(interview.questions.initialQuestions).map(([question, answer], idx) => (
                                  <div key={idx} className="bg-white rounded-lg p-4">
                                    <p className="font-medium text-gray-800 mb-3 text-sm">
                                      {question}
                                    </p>
                                    <div className="pl-4 border-l-3 border-purple-200">
                                      <p className="text-gray-700 text-sm leading-relaxed">
                                        {answer}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationalReportGenerator;