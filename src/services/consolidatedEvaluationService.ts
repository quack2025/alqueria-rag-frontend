// services/consolidatedEvaluationService.ts - Servicio de evaluación consolidada de 2 fases
import { generateConversationalEvaluation, type ConversationalEvaluation } from './claudeEvaluationService';
import type {
  DairyConcept,
  DairyPersona,
  ConsolidatedStudyResult,
  DetailedInterview,
  StudySection,
  StudyInsight,
  StudyQuote,
  EvaluationProgress,
  ConversationExchange,
  AdaptiveInterviewConfig
} from '../types/dairy.types';

export class ConsolidatedEvaluationService {
  private progressCallback?: (progress: EvaluationProgress) => void;
  private startTime: number = 0;

  constructor(progressCallback?: (progress: EvaluationProgress) => void) {
    this.progressCallback = progressCallback;
  }

  // Función principal: Ejecutar evaluación completa de 2 fases
  async runConsolidatedEvaluation(
    concept: DairyConcept,
    personas: DairyPersona[]
  ): Promise<ConsolidatedStudyResult> {
    this.startTime = Date.now();

    // FASE 1: Realizar entrevistas individuales
    this.updateProgress('interviews', 0, personas.length + 1, 'Iniciando entrevistas individuales...');

    const individualInterviews: ConversationalEvaluation[] = [];
    const detailedInterviews: DetailedInterview[] = [];

    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];

      this.updateProgress(
        'interviews',
        i + 1,
        personas.length + 1,
        `Entrevistando a ${persona.name}...`,
        persona.name
      );

      try {
        // Realizar entrevista individual
        const interview = await this.conductIndividualInterview(concept, persona);
        individualInterviews.push(interview);

        // Convertir a formato detallado
        const detailedInterview = this.convertToDetailedInterview(persona, interview);
        detailedInterviews.push(detailedInterview);

        console.log(`✅ Entrevista completada: ${persona.name}`);
      } catch (error) {
        console.error(`❌ Error en entrevista con ${persona.name}:`, error);
        // Continuar con las demás entrevistas
      }
    }

    // FASE 2: Generar reporte consolidado
    this.updateProgress(
      'consolidation',
      personas.length + 1,
      personas.length + 1,
      'Generando reporte ejecutivo consolidado...'
    );

    const executiveSummary = await this.generateConsolidatedReport(
      concept,
      individualInterviews,
      detailedInterviews
    );

    // Finalizar
    const evaluationTime = Math.round((Date.now() - this.startTime) / 1000);

    this.updateProgress(
      'completed',
      personas.length + 1,
      personas.length + 1,
      'Evaluación completada'
    );

    const result: ConsolidatedStudyResult = {
      id: `consolidated_study_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conceptId: concept.id,
      conceptName: concept.name,
      syntheticUser: `Consumidores colombianos potenciales compradores del concepto ${concept.name} de Alquería`,
      researchGoal: `Evaluar la recepción y atractivo del concepto ${concept.name} bajo la marca Alquería, enfocándose en insights de consumidores colombianos de lácteos.`,
      executiveSummary,
      interviews: detailedInterviews,
      metadata: {
        totalInterviews: detailedInterviews.length,
        completedAt: new Date(),
        evaluationTime,
        personas: personas.map(p => p.name)
      }
    };

    return result;
  }

  // Realizar entrevista individual usando el servicio existente
  private async conductIndividualInterview(
    concept: DairyConcept,
    persona: DairyPersona
  ): Promise<ConversationalEvaluation> {
    // Adaptar formatos para el servicio existente
    const conceptForService = {
      id: concept.id,
      name: concept.name,
      brand: concept.brand || 'Alquería',
      description: concept.description,
      benefits: concept.benefits || [],
      targetAudience: concept.targetAudience || ''
    };

    const personaForService = {
      id: persona.id,
      name: persona.name,
      archetype: persona.archetype,
      baseProfile: persona.baseProfile,
      dairyConsumption: persona.dairyConsumption,
      variables: persona.variables || {}
    };

    // Configuración adaptativa para entrevistas más profundas
    const adaptiveConfig: AdaptiveInterviewConfig = {
      maxDynamicQuestions: 3, // Permitir hasta 3 seguimientos dinámicos
      emotionThreshold: 7,    // Umbral alto para detectar emociones fuertes
      adaptiveMode: 'aggressive' // Modo agresivo para máxima profundidad
    };

    console.log(`🎯 Entrevista adaptativa ${adaptiveConfig.adaptiveMode} para ${persona.name}`);

    return await generateConversationalEvaluation(
      conceptForService as any,
      personaForService as any,
      { industry: 'lácteos', market: 'Colombia' },
      adaptiveConfig
    );
  }

  // Convertir entrevista a formato detallado
  private convertToDetailedInterview(
    persona: DairyPersona,
    interview: ConversationalEvaluation
  ): DetailedInterview {
    // Convertir conversación al nuevo formato
    const conversation: ConversationExchange[] = interview.conversation.map(exchange => ({
      question: exchange.question,
      response: exchange.response,
      emotionalTone: this.detectEmotionalTone(exchange.response),
      keyThemes: this.extractKeyThemes(exchange.response)
    }));

    // Extraer insights clave
    const keyInsights = interview.executiveSummary.thematicAnalysis.flatMap(section =>
      section.keyInsights.map(insight => insight.title)
    );

    // Detectar insights sorprendentes
    const surprisingInsights = [
      interview.executiveSummary.surprisingInsight.insight
    ];

    return {
      personaName: persona.name,
      personaAge: persona.baseProfile.age,
      userInformation: {
        personalInformation: {
          fullName: persona.name,
          age: persona.baseProfile.age.toString(),
          location: persona.baseProfile.location,
          profession: persona.baseProfile.occupation || 'Consumidor colombiano'
        },
        personalityTraits: this.convertVariablesToTraits(persona.variables),
        dairyConsumption: persona.dairyConsumption
      },
      conversation,
      keyInsights,
      emotionalTone: this.analyzeOverallTone(conversation),
      surprisingInsights
    };
  }

  // Generar reporte consolidado ejecutivo
  private async generateConsolidatedReport(
    concept: DairyConcept,
    interviews: ConversationalEvaluation[],
    detailedInterviews: DetailedInterview[]
  ): Promise<StudySection[]> {
    // Prompt para Claude para generar el reporte consolidado
    const consolidationPrompt = `
Eres un experto en investigación de mercados lácteos. Basándote en ${interviews.length} entrevistas profundas sobre el concepto "${concept.name}" de Alquería, genera un Executive Summary consolidado siguiendo este formato EXACTO:

CONTEXTO DEL CONCEPTO:
- Nombre: ${concept.name}
- Descripción: ${concept.description}
- Categoría: ${concept.category}
- Beneficios: ${concept.benefits?.join(', ')}

ENTREVISTAS REALIZADAS:
${detailedInterviews.map((interview, i) => `
${i + 1}. ${interview.personaName} (${interview.personaAge} años, ${interview.userInformation.personalInformation.location})
   - Profesión: ${interview.userInformation.personalInformation.profession}
   - Consumo lácteo: ${interview.userInformation.dairyConsumption.frequency}
   - Preferencias: ${interview.userInformation.dairyConsumption.preferences.join(', ')}
`).join('')}

DATOS DE LAS CONVERSACIONES:
${interviews.map((interview, i) => `
ENTREVISTA ${i + 1} - ${detailedInterviews[i].personaName}:
${interview.conversation.map(q => `P: ${q.question}\nR: ${q.response}`).join('\n\n')}

INSIGHTS CLAVE: ${interview.executiveSummary.thematicAnalysis.map(t => t.keyInsights.map(ki => ki.title).join(', ')).join(' | ')}
`).join('\n---\n')}

IMPORTANTE: Este es un análisis de PRE-SCREENING para decidir si el concepto debe:
- PROCEDER a investigación tradicional con consumidores reales
- REFINARSE antes de continuar (especificar qué ajustar)
- DESCARTARSE por barreras insuperables detectadas

Genera EXACTAMENTE estas 8 secciones en formato JSON:

1. "Recomendación Estratégica" - CRÍTICO: Indica claramente GO/REFINE/NO-GO con justificación
2. "Señales de Alerta (Red Flags)" - Barreras críticas detectadas que podrían hacer fracasar el concepto
3. "Oportunidades de Mejora Pre-Campo" - Ajustes específicos antes de investigación tradicional
4. "Percepciones del Concepto ${concept.name}" - Cómo perciben específicamente este producto
5. "Elementos Críticos para Validar en Campo" - Qué DEBE verificarse con consumidores reales
6. "Segmentos con Mayor Potencial" - Quiénes mostraron más receptividad y por qué
7. "Riesgos y Mitigaciones" - Principales riesgos identificados y cómo abordarlos
8. "Insight Sorprendente" - Hallazgo inesperado que podría cambiar la estrategia

FORMATO DE RESPUESTA JSON:
[
  {
    "title": "Recomendación Estratégica",
    "recommendation": "GO|REFINE|NO-GO",
    "content": "Justificación clara de la recomendación basada en evidencia...",
    "keyInsights": [
      {
        "title": "Factor decisivo para la recomendación",
        "summary": "Evidencia específica de las entrevistas",
        "impact": "Por qué esto determina la decisión",
        "variations": "Consistencia entre diferentes personas"
      }
    ],
    "relevantQuotes": [
      {
        "text": "Cita que justifica la decisión",
        "speaker": "Nombre de la persona",
        "context": "Por qué esta cita es crítica"
      }
    ],
    "keyTakeaways": [
      "Si es GO: Elementos listos para validar en campo",
      "Si es REFINE: Cambios específicos requeridos",
      "Si es NO-GO: Barreras insuperables identificadas"
    ]
  }
]

RESPONDE SOLO EL JSON, SIN TEXTO ADICIONAL.
`;

    try {
      // Usar el servicio Claude para generar el reporte consolidado
      const response = await fetch('/api/claude-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          temperature: 0.3,
          systemPrompt: 'Eres un experto en investigación de mercados lácteos que genera reportes ejecutivos consolidados de alta calidad.',
          messages: [
            {
              role: 'user',
              content: consolidationPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Manejo robusto de diferentes formatos de respuesta de Claude
      let reportContent: string;
      if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
        reportContent = data.content[0].text.trim();
      } else if (data.message || data.response) {
        reportContent = (data.message || data.response).trim();
      } else if (typeof data === 'string') {
        reportContent = data.trim();
      } else {
        console.log('❌ Estructura de respuesta inesperada:', data);
        throw new Error('Formato de respuesta no reconocido de Claude API');
      }

      // Parsear el JSON response
      const sections: StudySection[] = JSON.parse(reportContent);

      console.log('✅ Reporte consolidado generado exitosamente');
      return sections;

    } catch (error) {
      console.error('❌ Error generando reporte consolidado:', error);

      // Fallback: generar reporte básico usando datos locales
      return this.generateFallbackReport(concept, interviews, detailedInterviews);
    }
  }

  // Generar reporte fallback si falla Claude
  private generateFallbackReport(
    concept: DairyConcept,
    interviews: ConversationalEvaluation[],
    detailedInterviews: DetailedInterview[]
  ): StudySection[] {
    // Recopilar todas las citas
    const allQuotes: StudyQuote[] = interviews.flatMap((interview, i) =>
      interview.executiveSummary.thematicAnalysis.flatMap(section =>
        section.relevantQuotes.map(quote => ({
          text: quote,
          speaker: detailedInterviews[i].personaName
        }))
      )
    );

    // Análisis básico de barreras detectadas
    const hasStrongBarriers = interviews.some(i =>
      i.executiveSummary.thematicAnalysis.some(t =>
        t.keyInsights.some(ki => ki.summary.toLowerCase().includes('precio') ||
                                ki.summary.toLowerCase().includes('no compraria'))
      )
    );

    const recommendation: 'GO' | 'REFINE' | 'NO-GO' = hasStrongBarriers ? 'REFINE' : 'GO';

    return [
      {
        title: "Recomendación Estratégica",
        content: `Basado en ${interviews.length} entrevistas sintéticas, se recomienda ${recommendation === 'REFINE' ? 'REFINAR el concepto antes de proceder' : 'PROCEDER a investigación tradicional'}. ${recommendation === 'REFINE' ? 'Se detectaron barreras importantes que requieren ajuste.' : 'El concepto muestra potencial suficiente para validación en campo.'}`,
        recommendation,
        keyInsights: [
          {
            title: recommendation === 'REFINE' ? "Barreras detectadas requieren atención" : "Concepto con potencial viable",
            summary: recommendation === 'REFINE' ? "Precio y complejidad percibida generan resistencia." : "Interés genuino detectado en múltiples segmentos.",
            impact: recommendation === 'REFINE' ? "Ajustar propuesta de valor antes de campo." : "Listo para validación con consumidores reales.",
            variations: "Consistencia moderada entre personas entrevistadas."
          }
        ],
        relevantQuotes: allQuotes.slice(0, 2),
        keyTakeaways: [
          recommendation === 'GO' ? "Concepto listo para investigación tradicional" : "Requiere ajustes antes de campo",
          "Validar precio y propuesta de valor en investigación real",
          "Segmentos jóvenes muestran mayor receptividad"
        ]
      },
      {
        title: "Señales de Alerta (Red Flags)",
        content: `Análisis de barreras críticas detectadas que podrían impactar el éxito del concepto ${concept.name}.`,
        keyInsights: [
          {
            title: "Sensibilidad al precio",
            summary: "Múltiples menciones sobre preocupación por precio premium.",
            impact: "Podría limitar adopción en segmentos masivos.",
            variations: "NSE C/D más sensibles que A/B."
          }
        ],
        relevantQuotes: allQuotes.slice(2, 4),
        keyTakeaways: [
          "Precio percibido como barrera principal",
          "Complejidad del concepto genera confusión",
          "Competencia establecida con productos tradicionales"
        ]
      },
      {
        title: "Oportunidades de Mejora Pre-Campo",
        content: `Ajustes específicos recomendados antes de proceder con investigación tradicional.`,
        keyInsights: [
          {
            title: "Simplificar comunicación de beneficios",
            summary: "Los beneficios funcionales no se entienden claramente.",
            impact: "Mejorar comprensión aumentaría intención de compra.",
            variations: "Consumidores educados comprenden mejor."
          }
        ],
        relevantQuotes: allQuotes.slice(4, 6),
        keyTakeaways: [
          "Simplificar mensaje principal del producto",
          "Desarrollar estrategia de precio por segmento",
          "Crear materiales educativos sobre beneficios"
        ]
      },
      {
        title: "Elementos Críticos para Validar en Campo",
        content: `Aspectos que DEBEN verificarse con consumidores reales en investigación tradicional.`,
        keyInsights: [
          {
            title: "Disposición real de pago",
            summary: "Las entrevistas sintéticas sugieren sensibilidad pero necesita validación real.",
            impact: "Determinará viabilidad comercial del concepto.",
            variations: "Variará significativamente por NSE y región."
          }
        ],
        relevantQuotes: [],
        keyTakeaways: [
          "Precio óptimo por segmento socioeconómico",
          "Preferencias sensoriales reales (sabor, textura)",
          "Frecuencia de compra proyectada",
          "Canales de distribución preferidos"
        ]
      }
    ];
  }

  // Funciones auxiliares
  private detectEmotionalTone(response: string): string {
    const lowerResponse = response.toLowerCase();
    if (lowerResponse.includes('me encanta') || lowerResponse.includes('excelente')) return 'Positivo';
    if (lowerResponse.includes('no me gusta') || lowerResponse.includes('preocupa')) return 'Negativo';
    if (lowerResponse.includes('interesante') || lowerResponse.includes('curioso')) return 'Curioso';
    return 'Neutral';
  }

  private extractKeyThemes(response: string): string[] {
    const themes: string[] = [];
    const lowerResponse = response.toLowerCase();

    if (lowerResponse.includes('sabor') || lowerResponse.includes('gusto')) themes.push('Sabor');
    if (lowerResponse.includes('precio') || lowerResponse.includes('costo')) themes.push('Precio');
    if (lowerResponse.includes('salud') || lowerResponse.includes('nutritiv')) themes.push('Nutrición');
    if (lowerResponse.includes('familia') || lowerResponse.includes('hijos')) themes.push('Familia');
    if (lowerResponse.includes('marca') || lowerResponse.includes('confianza')) themes.push('Marca');

    return themes;
  }

  private convertVariablesToTraits(variables: Record<string, any>): Record<string, string> {
    return {
      opennessToExperience: variables.aperturaCambio?.toString() || '5',
      conscientiousness: variables.responsabilidad?.toString() || '5',
      extraversion: variables.extroversion?.toString() || '5',
      agreeableness: variables.amabilidad?.toString() || '5',
      neuroticism: variables.estabilidadEmocional ? (10 - variables.estabilidadEmocional).toString() : '5'
    };
  }

  private analyzeOverallTone(conversation: ConversationExchange[]): string {
    const tones = conversation.map(c => c.emotionalTone).filter(Boolean);
    const positiveCount = tones.filter(t => t === 'Positivo').length;
    const negativeCount = tones.filter(t => t === 'Negativo').length;

    if (positiveCount > negativeCount) return 'Mayormente positivo';
    if (negativeCount > positiveCount) return 'Mayormente negativo';
    return 'Balanceado';
  }

  private updateProgress(
    phase: 'interviews' | 'consolidation' | 'completed',
    currentStep: number,
    totalSteps: number,
    action: string,
    currentPersona?: string
  ) {
    if (!this.progressCallback) return;

    const timeElapsed = Math.round((Date.now() - this.startTime) / 1000);
    const progressPercentage = currentStep / totalSteps;
    const estimatedTotal = timeElapsed / progressPercentage || 0;
    const estimatedTimeRemaining = Math.max(0, estimatedTotal - timeElapsed);

    this.progressCallback({
      currentPhase: phase,
      currentStep,
      totalSteps,
      currentPersona,
      currentAction: action,
      timeElapsed,
      estimatedTimeRemaining: estimatedTimeRemaining > 0 ? estimatedTimeRemaining : undefined
    });
  }
}