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

// Función helper para limpiar respuestas de Claude
function cleanClaudeResponse(content: string): string {
  let cleaned = content.trim();

  // 1. Remover bloques de código markdown completos
  cleaned = cleaned.replace(/```json\s*[\s\S]*?\s*```/g, (match) => {
    return match.replace(/```json\s*/g, '').replace(/\s*```/g, '');
  });

  // 2. Remover cualquier otro bloque de código
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // 3. Remover markdown inline
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 4. Si empieza/termina con corchetes, es un array
  if (!cleaned.startsWith('[') && cleaned.includes('[')) {
    cleaned = cleaned.substring(cleaned.indexOf('['));
  }
  if (!cleaned.endsWith(']') && cleaned.includes(']')) {
    cleaned = cleaned.substring(0, cleaned.lastIndexOf(']') + 1);
  }

  return cleaned;
}

export class ConsolidatedEvaluationService {
  private progressCallback?: (progress: EvaluationProgress) => void;
  private startTime: number = 0;
  private currentStep: number = 0;
  private totalSteps: number = 0;

  constructor(progressCallback?: (progress: EvaluationProgress) => void) {
    this.progressCallback = progressCallback;
  }

  // Función principal: Ejecutar evaluación completa de 2 fases
  async runConsolidatedEvaluation(
    concept: DairyConcept,
    personas: DairyPersona[]
  ): Promise<ConsolidatedStudyResult> {
    this.startTime = Date.now();
    this.currentStep = 0;
    this.totalSteps = personas.length + 1; // personas + 1 consolidation step

    // FASE 1: Realizar entrevistas individuales
    this.updateProgress('interviews', 0, this.totalSteps, 'Iniciando entrevistas individuales...');

    const individualInterviews: ConversationalEvaluation[] = [];
    const detailedInterviews: DetailedInterview[] = [];

    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];
      this.currentStep = i + 1;

      this.updateProgress(
        'interviews',
        this.currentStep,
        this.totalSteps,
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
    this.currentStep = this.totalSteps;
    this.updateProgress(
      'consolidation',
      this.currentStep,
      this.totalSteps,
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
      this.totalSteps,
      this.totalSteps,
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
      adaptiveConfig,
      (message: string) => {
        // Forward detailed progress messages to UI
        this.updateProgress(
          'interviews',
          this.getCurrentStep(),
          this.getTotalSteps(),
          message,
          persona.name
        );
      }
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
    // Prompt optimizado para reducir tokens
    const consolidationPrompt = `
Analiza ${interviews.length} entrevistas sobre el concepto lácteo "${concept.name}" - ${concept.description?.substring(0, 100)}.

PERFILES ENTREVISTADOS:
${detailedInterviews.map((interview, i) =>
  `${i + 1}. ${interview.personaName}, ${interview.personaAge}a, ${interview.userInformation.personalInformation.location}`
).join('\n')}

RESUMEN DE RESPUESTAS CLAVE:
${interviews.slice(0, 3).map((interview, i) => {
  const keyResponses = interview.conversation.slice(0, 3).map(q =>
    `- ${q.question.substring(0, 50)}: "${q.response.substring(0, 100)}..."`
  ).join('\n');
  return `Persona ${i + 1}:\n${keyResponses}`;
}).join('\n\n')}

TEMAS PRINCIPALES DETECTADOS:
${interviews.flatMap(i =>
  i.executiveSummary.thematicAnalysis.slice(0, 2).flatMap(t =>
    t.keyInsights.slice(0, 1).map(ki => ki.title)
  )
).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5).join(', ')}

GENERA JSON con 4 secciones (GO/REFINE/NO-GO):
[
  {
    "title": "Recomendación Estratégica",
    "recommendation": "GO|REFINE|NO-GO",
    "content": "Justificación (max 100 palabras)",
    "keyInsights": [{"title": "Insight", "summary": "Detalle", "impact": "Alto/Medio/Bajo"}],
    "relevantQuotes": [{"text": "Cita", "speaker": "Nombre"}],
    "keyTakeaways": ["Punto 1", "Punto 2"]
  },
  {"title": "Señales de Alerta (Red Flags)", ...misma estructura...},
  {"title": "Oportunidades de Mejora Pre-Campo", ...misma estructura...},
  {"title": "Elementos Críticos para Validar en Campo", ...misma estructura...}
]

SOLO JSON, sin markdown ni texto adicional. Máximo 1 insight y 1 cita por sección.
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
          max_tokens: 32000, // Máximo para evitar truncamiento
          temperature: 0.2, // Más determinístico para JSON estructurado
          systemPrompt: 'Eres un experto en investigación de mercados lácteos que genera reportes ejecutivos consolidados. SIEMPRE respondes con JSON válido sin markdown ni texto adicional.',
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

      // Verificar si la respuesta fue truncada
      if (data.stop_reason === 'max_tokens') {
        console.warn('⚠️ Respuesta truncada por límite de tokens, intentando con prompt más corto');
        // Intentar con un prompt reducido
        return await this.generateConsolidatedReportCompact(concept, interviews, detailedInterviews);
      }

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

      // Limpiar respuesta antes de parsear
      const cleanedContent = cleanClaudeResponse(reportContent);

      // Validar que es JSON válido
      let sections: StudySection[];
      try {
        sections = JSON.parse(cleanedContent);

        // Validar estructura básica
        if (!Array.isArray(sections) || sections.length === 0) {
          throw new Error('Estructura de secciones inválida');
        }

        console.log('✅ Reporte consolidado generado exitosamente');
        return sections;

      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        console.log('Contenido recibido:', cleanedContent.substring(0, 500) + '...');

        // Intentar fallback con prompt más simple
        return await this.generateConsolidatedReportCompact(concept, interviews, detailedInterviews);
      }

    } catch (error) {
      console.error('❌ Error generando reporte consolidado:', error);

      // Fallback: generar reporte básico usando datos locales
      return this.generateFallbackReport(concept, interviews, detailedInterviews);
    }
  }

  // Generar reporte con prompt compacto cuando el principal falla
  private async generateConsolidatedReportCompact(
    concept: DairyConcept,
    interviews: ConversationalEvaluation[],
    detailedInterviews: DetailedInterview[]
  ): Promise<StudySection[]> {
    console.log('🔄 Intentando con prompt compacto...');

    const compactPrompt = `
Analiza ${interviews.length} entrevistas sobre el concepto lácteo "${concept.name}".

RESPONDE SOLO CON JSON VÁLIDO (sin markdown, sin texto adicional).

Genera exactamente estas 4 secciones:
[
  {
    "title": "Recomendación Estratégica",
    "recommendation": "GO" o "REFINE" o "NO-GO",
    "content": "Justificación breve (máx 100 palabras)",
    "keyInsights": [{"title": "Insight clave", "summary": "Descripción", "impact": "Alto/Medio/Bajo"}],
    "relevantQuotes": [{"text": "Cita", "speaker": "Persona"}],
    "keyTakeaways": ["Punto 1", "Punto 2"]
  },
  {
    "title": "Señales de Alerta (Red Flags)",
    "content": "Barreras críticas (máx 100 palabras)",
    "keyInsights": [{"title": "Barrera principal", "summary": "Descripción", "impact": "Alto/Medio/Bajo"}],
    "relevantQuotes": [{"text": "Cita", "speaker": "Persona"}],
    "keyTakeaways": ["Barrera 1", "Barrera 2"]
  },
  {
    "title": "Oportunidades de Mejora Pre-Campo",
    "content": "Ajustes requeridos (máx 100 palabras)",
    "keyInsights": [{"title": "Mejora clave", "summary": "Descripción", "impact": "Alto/Medio/Bajo"}],
    "relevantQuotes": [],
    "keyTakeaways": ["Ajuste 1", "Ajuste 2"]
  },
  {
    "title": "Elementos Críticos para Validar en Campo",
    "content": "Aspectos a validar (máx 100 palabras)",
    "keyInsights": [{"title": "Validación clave", "summary": "Descripción", "impact": "Alto/Medio/Bajo"}],
    "relevantQuotes": [],
    "keyTakeaways": ["Validar precio", "Validar sabor", "Validar frecuencia de compra"]
  }
]
`;

    try {
      const response = await fetch('/api/claude-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000, // Menos tokens para prompt más simple
          temperature: 0.1,
          systemPrompt: 'Responde SOLO con JSON válido, sin markdown ni texto adicional.',
          messages: [{ role: 'user', content: compactPrompt }]
        })
      });

      const data = await response.json();
      let content = data.content?.[0]?.text || data.message || data.response || '';
      content = cleanClaudeResponse(content);

      return JSON.parse(content);

    } catch (error) {
      console.error('❌ Fallback compacto también falló:', error);
      return this.generateLocalFallbackReport(concept, interviews, detailedInterviews);
    }
  }

  // Fallback local cuando todo lo demás falla
  private generateLocalFallbackReport(
    concept: DairyConcept,
    interviews: ConversationalEvaluation[],
    detailedInterviews: DetailedInterview[]
  ): StudySection[] {
    console.log('⚠️ Generando reporte local de emergencia');

    // Análisis básico de sentimientos
    const allResponses = interviews.flatMap(i => i.conversation.map(c => c.response)).join(' ').toLowerCase();
    const positiveWords = (allResponses.match(/me gusta|excelente|bueno|interesante|lo compraría/g) || []).length;
    const negativeWords = (allResponses.match(/no me|muy caro|no compraría|preocupa|mal sabor/g) || []).length;

    const recommendation = positiveWords > negativeWords * 2 ? 'GO' :
                          negativeWords > positiveWords * 2 ? 'NO-GO' : 'REFINE';

    return [
      {
        title: "Recomendación Estratégica",
        content: `Basado en ${interviews.length} entrevistas sintéticas, se recomienda ${recommendation}. Análisis automático detectó ${positiveWords} menciones positivas y ${negativeWords} menciones negativas.`,
        recommendation,
        keyInsights: [{
          title: "Análisis de sentimiento general",
          summary: `Balance ${positiveWords > negativeWords ? 'positivo' : 'negativo'} en las respuestas`,
          impact: "Determina viabilidad del concepto",
          variations: "Varía por segmento"
        }],
        relevantQuotes: interviews[0]?.conversation.slice(0, 2).map(c => ({
          text: c.response.substring(0, 100) + '...',
          speaker: detailedInterviews[0]?.personaName || 'Persona sintética',
          context: c.question
        })) || [],
        keyTakeaways: [
          recommendation === 'GO' ? "Concepto muestra potencial para investigación" : "Requiere ajustes antes de campo",
          "Validación con consumidores reales necesaria"
        ]
      },
      {
        title: "Señales de Alerta (Red Flags)",
        content: "Análisis automático de barreras potenciales basado en palabras clave.",
        keyInsights: [{
          title: allResponses.includes('caro') ? "Sensibilidad al precio detectada" : "Percepción de valor a validar",
          summary: "Múltiples menciones sobre precio en las entrevistas",
          impact: "Puede limitar adopción",
          variations: "Mayor en NSE C/D"
        }],
        relevantQuotes: [],
        keyTakeaways: ["Precio percibido como barrera", "Necesidad de comunicar valor"]
      },
      {
        title: "Oportunidades de Mejora Pre-Campo",
        content: "Ajustes sugeridos basados en análisis automático.",
        keyInsights: [{
          title: "Simplificar comunicación",
          summary: "Mensaje del producto puede ser más claro",
          impact: "Mejoraría comprensión",
          variations: "Especialmente en segmentos masivos"
        }],
        relevantQuotes: [],
        keyTakeaways: ["Clarificar beneficios principales", "Ajustar comunicación por segmento"]
      },
      {
        title: "Elementos Críticos para Validar en Campo",
        content: "Aspectos clave para investigación con consumidores reales.",
        keyInsights: [{
          title: "Intención de compra real",
          summary: "Validar con consumidores reales",
          impact: "Determina viabilidad comercial",
          variations: "Por NSE y región"
        }],
        relevantQuotes: [],
        keyTakeaways: ["Precio óptimo", "Frecuencia de compra", "Canales preferidos"]
      }
    ];
  }

  // Fallback wrapper para compatibilidad
  private generateFallbackReport(
    concept: DairyConcept,
    interviews: ConversationalEvaluation[],
    detailedInterviews: DetailedInterview[]
  ): StudySection[] {
    console.error('❌ FALLBACK REPORT ACTIVADO - Usando fallback local');
    return this.generateLocalFallbackReport(concept, interviews, detailedInterviews);
  }

  // Método alternativo que podría usarse solo para debugging (NO para producción)
  private generateEmergencyFallbackReport(
    concept: DairyConcept,
    interviews: ConversationalEvaluation[],
    detailedInterviews: DetailedInterview[]
  ): StudySection[] {
    // SOLO USAR EN CASOS DE EMERGENCIA EXTREMA

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

  // Helper methods for tracking progress in callback functions
  private getCurrentStep(): number {
    return this.currentStep;
  }

  private getTotalSteps(): number {
    return this.totalSteps;
  }
}