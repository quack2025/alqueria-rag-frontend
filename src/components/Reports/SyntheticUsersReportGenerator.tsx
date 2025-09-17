/**
 * SyntheticUsersReportGenerator.tsx - Generador de informes ejecutivos tipo SyntheticUsers.com
 * 
 * Transforma los resultados de evaluación del Innovation Lab en informes
 * estructurados estilo SyntheticUsers con executive summary, insights clave,
 * y entrevistas detalladas.
 */

import React, { useState } from 'react';
import { 
  Download, FileText, Copy, Eye, Users, TrendingUp, 
  MessageSquare, Quote, Lightbulb, ChevronDown, ChevronUp 
} from 'lucide-react';
import type { EvaluationResult, Concept, SyntheticPersona } from '../InnovationLab/InnovationLabContainer';

interface SyntheticUsersReport {
  syntheticUser: string;
  researchGoal: string;
  summary: string[];
  executiveSummary: {
    keyInsights: {
      title: string;
      summary: string;
      impact: string;
      variations: string;
      quotes: string[];
    }[];
    surprisingInsight?: {
      title: string;
      summary: string;
      impact: string;
      quotes: string[];
    };
    keyTakeaways: string[];
  };
  interviews: {
    [personaName: string]: {
      userInformation: {
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
          brandAffinity?: string;
          unileverUsage?: string;
        };
      };
      conversation: {
        [question: string]: string;
      };
    };
  };
  generatedAt: Date;
}

interface Props {
  concept: Concept;
  evaluationResults: EvaluationResult[];
  personas: SyntheticPersona[];
  onClose: () => void;
}

const SyntheticUsersReportGenerator: React.FC<Props> = ({ 
  concept, 
  evaluationResults, 
  personas, 
  onClose 
}) => {
  const [generatedReport, setGeneratedReport] = useState<SyntheticUsersReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<'summary' | 'interviews'>('summary');
  const [expandedInterview, setExpandedInterview] = useState<string | null>(null);

  // Generar el informe completo estilo SyntheticUsers
  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simular el procesamiento (en producción esto llamaría al backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const report: SyntheticUsersReport = {
        syntheticUser: `Consumidores potenciales de ${concept.name} bajo la marca ${concept.brand}`,
        researchGoal: `Evaluar la recepción y el atractivo del concepto ${concept.name} en la categoría ${concept.category}`,
        summary: generateExecutiveSummary(),
        executiveSummary: {
          keyInsights: generateKeyInsights(),
          surprisingInsight: generateSurprisingInsight(),
          keyTakeaways: generateKeyTakeaways()
        },
        interviews: generateDetailedInterviews(),
        generatedAt: new Date()
      };
      
      setGeneratedReport(report);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generar resumen ejecutivo basado en los resultados
  const generateExecutiveSummary = (): string[] => {
    const highAcceptance = evaluationResults.filter(r => r.overallAcceptance === 'alta').length;
    const mediumAcceptance = evaluationResults.filter(r => r.overallAcceptance === 'media').length;
    const lowAcceptance = evaluationResults.filter(r => r.overallAcceptance === 'baja').length;
    
    return [
      `## Executive Summary\n\nEste informe examina la recepción y el atractivo del concepto **${concept.name}** bajo la marca **${concept.brand}**, enfocándose en insights de ${evaluationResults.length} perfiles de consumidores colombianos potenciales.\n\n### Resultados Generales\n\n- **Aceptación Alta**: ${highAcceptance} de ${evaluationResults.length} perfiles (${Math.round(highAcceptance/evaluationResults.length*100)}%)\n- **Aceptación Media**: ${mediumAcceptance} de ${evaluationResults.length} perfiles (${Math.round(mediumAcceptance/evaluationResults.length*100)}%)\n- **Aceptación Baja**: ${lowAcceptance} de ${evaluationResults.length} perfiles (${Math.round(lowAcceptance/evaluationResults.length*100)}%)\n\n### Beneficios Más Valorados\n\n${concept.benefits.map(benefit => `- **${benefit}**: Resonó especialmente con perfiles de NSE medio-alto`).join('\n')}\n\n### Key Takeaways\n\n- La diferenciación del concepto es clave para la adopción\n- Los factores culturales influyen significativamente en la percepción\n- El precio-valor debe estar alineado con las expectativas del segmento`
    ];
  };

  // Generar insights clave del análisis
  const generateKeyInsights = () => {
    const allAspects = evaluationResults.flatMap(r => Object.keys(r.aspects));
    const uniqueAspects = [...new Set(allAspects)];
    
    return uniqueAspects.slice(0, 3).map(aspect => ({
      title: `Percepción de ${aspect}`,
      summary: `Los participantes mostraron perspectivas variadas sobre ${aspect.toLowerCase()}, con énfasis en la importancia de la autenticidad y relevancia cultural.`,
      impact: `Esta percepción influye directamente en la decisión de compra y la disposición a pagar premium por el producto.`,
      variations: `Los perfiles de mayor NSE muestran mayor apertura a innovación, mientras que perfiles tradicionales priorizan familiaridad.`,
      quotes: evaluationResults
        .filter(r => r.aspects[aspect])
        .slice(0, 2)
        .map(r => r.quote)
    }));
  };

  // Generar insight sorprendente
  const generateSurprisingInsight = () => {
    const unexpectedPositives = evaluationResults
      .filter(r => r.overallAcceptance === 'alta')
      .map(r => r.keyDrivers)
      .flat();
    
    return {
      title: "Gap entre Expectativas y Comportamiento Real",
      summary: "Existe una diferencia notable entre lo que los consumidores dicen buscar en un producto y lo que realmente valoran al momento de la compra.",
      impact: "Este insight sugiere que las estrategias de marketing deben enfocarse tanto en beneficios racionales como en conexiones emocionales auténticas.",
      quotes: evaluationResults.slice(0, 2).map(r => r.quote)
    };
  };

  // Generar conclusiones clave
  const generateKeyTakeaways = (): string[] => {
    return [
      "La autenticidad cultural es fundamental para la aceptación del producto",
      "El precio-valor debe estar claramente comunicado y justificado", 
      "Los beneficios funcionales deben complementarse con aspectos emocionales",
      "La educación del consumidor sobre diferenciación es crítica para el éxito"
    ];
  };

  // Generar entrevistas detalladas estilo SyntheticUsers
  const generateDetailedInterviews = () => {
    const interviews: SyntheticUsersReport['interviews'] = {};
    
    evaluationResults.forEach((result, idx) => {
      const persona = personas.find(p => p.id === result.personaId);
      if (!persona) return;
      
      const personaKey = `${persona.name.split(' ')[0]}, ${persona.baseProfile.age}`;
      
      // Extraer variables específicas para el perfil
      const extroversion = persona.variables.find(v => v.key === 'extroversion')?.value || '5';
      const apertura = persona.variables.find(v => v.key === 'apertura')?.value || '5';
      const responsabilidad = persona.variables.find(v => v.key === 'responsabilidad')?.value || '5';
      const culturalBackground = persona.variables.find(v => v.key === 'region')?.value || 'Andina';
      const brandAffinity = persona.variables.find(v => v.key === 'lealtad_marca')?.value || '5';
      
      interviews[personaKey] = {
        userInformation: {
          personalInformation: {
            fullName: persona.name,
            age: persona.baseProfile.age.toString(),
            location: persona.baseProfile.location,
            profession: persona.baseProfile.occupation
          },
          personalityTraits: {
            opennessToExperience: apertura.toString(),
            conscientiousness: responsabilidad.toString(), 
            extraversion: extroversion.toString(),
            agreeableness: '4',
            neuroticism: '3'
          },
          miscellaneous: {
            culturalBackground: culturalBackground,
            brandAffinity: brandAffinity > 7 ? 'Marcas premium' : 'Marcas de valor',
            unileverUsage: Object.keys(persona.brandRelationships || {}).join(', ')
          }
        },
        conversation: generateConversationQuestions(result, persona, concept)
      };
    });
    
    return interviews;
  };

  // Generar preguntas y respuestas conversacionales
  const generateConversationQuestions = (result: EvaluationResult, persona: SyntheticPersona, concept: Concept) => {
    return {
      [`¿Qué viene a tu mente cuando escuchas "${concept.name}"?`]: `${result.quote} Me parece interesante porque ${result.keyDrivers.slice(0, 2).join(' y ')}.`,
      
      [`¿Cómo crees que este producto se compara con ${concept.brand} tradicional?`]: `Creo que ${concept.name} ${result.overallAcceptance === 'alta' ? 'representa una evolución natural' : 'podría ser muy diferente'} de lo que espero de ${concept.brand}. ${Object.entries(result.aspects)[0]?.[1]?.positives[0] || 'Tiene potencial'}.`,
      
      [`¿Qué te motivaría a probar ${concept.name} por primera vez?`]: `${result.keyDrivers[0] || 'La curiosidad'} sería mi principal motivación. También ${result.suggestions[0] || 'si lo recomendara alguien de confianza'}.`,
      
      [`¿Qué preocupaciones tendrías antes de comprarlo?`]: `${Object.entries(result.aspects)[0]?.[1]?.negatives[0] || 'El precio podría ser una consideración'}. También me preguntaría si ${Object.entries(result.aspects)[1]?.[1]?.negatives[0] || 'realmente cumple lo que promete'}.`,
      
      [`¿Cómo explicarías este producto a un amigo?`]: `Le diría que es ${concept.description}. Lo que me llama la atención es ${result.keyDrivers.slice(0, 2).join(' y ')}, aunque ${Object.entries(result.aspects)[0]?.[1]?.recommendations[0] || 'habría que probarlo para estar seguro'}.`
    };
  };

  // Exportar como JSON
  const exportAsJSON = () => {
    if (!generatedReport) return;
    
    const dataStr = JSON.stringify(generatedReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${concept.name.replace(/\s+/g, '_')}_SyntheticUsers_Report_${new Date().toISOString().split('T')[0]}.json`;
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
      alert('✅ Informe copiado al clipboard');
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Informe SyntheticUsers</h2>
                <p className="text-violet-100">Evaluación de "{concept.name}"</p>
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
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-violet-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Generar Informe Ejecutivo
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Convierte los resultados de evaluación en un informe estructurado 
                  estilo SyntheticUsers.com con executive summary, insights clave, 
                  y entrevistas conversacionales detalladas.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Concepto:</span>
                      <p className="font-medium text-gray-900">{concept.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Evaluaciones:</span>
                      <p className="font-medium text-gray-900">{evaluationResults.length} personas</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Generando Informe...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Generar Informe SyntheticUsers
                    </div>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Estado con informe generado
            <div className="space-y-6">
              {/* Navigation tabs */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveSection('summary')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeSection === 'summary'
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Executive Summary
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('interviews')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeSection === 'interviews'
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Entrevistas ({Object.keys(generatedReport.interviews).length})
                    </div>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </button>
                  <button
                    onClick={exportAsJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Exportar JSON
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto">
                {activeSection === 'summary' && (
                  <div className="space-y-6">
                    {/* Executive Summary */}
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: generatedReport.summary[0]?.replace(/\n/g, '<br />') || '' 
                      }} />
                    </div>

                    {/* Key Insights */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-violet-600" />
                        Insights Clave
                      </h3>
                      
                      {generatedReport.executiveSummary.keyInsights.map((insight, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                          <div className="text-sm text-gray-600 space-y-2">
                            <p><strong>Summary:</strong> {insight.summary}</p>
                            <p><strong>Impact:</strong> {insight.impact}</p>
                            <p><strong>Variations:</strong> {insight.variations}</p>
                            {insight.quotes.length > 0 && (
                              <div className="mt-3">
                                <p className="font-medium text-gray-700 mb-1">Citas relevantes:</p>
                                {insight.quotes.map((quote, qIdx) => (
                                  <blockquote key={qIdx} className="border-l-4 border-violet-200 pl-4 italic text-gray-600">
                                    "{quote}"
                                  </blockquote>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Surprising Insight */}
                    {generatedReport.executiveSummary.surprisingInsight && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <Quote className="h-5 w-5" />
                          Insight Sorprendente
                        </h3>
                        <div className="text-sm text-amber-800 space-y-2">
                          <p><strong>Summary:</strong> {generatedReport.executiveSummary.surprisingInsight.summary}</p>
                          <p><strong>Impact:</strong> {generatedReport.executiveSummary.surprisingInsight.impact}</p>
                        </div>
                      </div>
                    )}

                    {/* Key Takeaways */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                      <ul className="space-y-2">
                        {generatedReport.executiveSummary.keyTakeaways.map((takeaway, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeSection === 'interviews' && (
                  <div className="space-y-4">
                    {Object.entries(generatedReport.interviews).map(([personaKey, interview]) => (
                      <div key={personaKey} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setExpandedInterview(
                            expandedInterview === personaKey ? null : personaKey
                          )}
                          className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {interview.userInformation.personalInformation.fullName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {interview.userInformation.personalInformation.age} años • 
                                {interview.userInformation.personalInformation.location} • 
                                {interview.userInformation.personalInformation.profession}
                              </p>
                            </div>
                            {expandedInterview === personaKey ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {expandedInterview === personaKey && (
                          <div className="border-t border-gray-200 p-4 space-y-4">
                            {/* Personality info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">Rasgos de Personalidad</h5>
                                <div className="space-y-1">
                                  <div>Apertura: {interview.userInformation.personalityTraits.opennessToExperience}/10</div>
                                  <div>Extroversión: {interview.userInformation.personalityTraits.extraversion}/10</div>
                                  <div>Responsabilidad: {interview.userInformation.personalityTraits.conscientiousness}/10</div>
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">Información Adicional</h5>
                                <div className="space-y-1">
                                  <div>Región: {interview.userInformation.miscellaneous.culturalBackground}</div>
                                  <div>Afinidad: {interview.userInformation.miscellaneous.brandAffinity}</div>
                                  <div>Uso Unilever: {interview.userInformation.miscellaneous.unileverUsage}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Conversation */}
                            <div>
                              <h5 className="font-medium text-gray-700 mb-3">Conversación</h5>
                              <div className="space-y-3">
                                {Object.entries(interview.conversation).map(([question, answer], idx) => (
                                  <div key={idx} className="space-y-2">
                                    <p className="font-medium text-gray-800 text-sm">{question}</p>
                                    <p className="text-gray-600 text-sm pl-4 border-l-2 border-gray-200">
                                      {answer}
                                    </p>
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

export default SyntheticUsersReportGenerator;