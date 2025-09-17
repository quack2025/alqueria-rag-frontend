/**
 * Servicio de Evaluación en 2 Fases Independientes
 * FASE 1: Entrevistas con usuarios sintéticos
 * FASE 2: Análisis de insights y recomendaciones para mejorar el concepto
 *
 * Objetivo: Pre-screening de conceptos para optimizar presupuesto de investigación
 */

import { generateConversationalEvaluation, type ConversationalEvaluation } from './claudeEvaluationService';
import type {
  DairyConcept,
  DairyPersona,
  DetailedInterview,
  EvaluationProgress,
} from '../types/dairy.types';

export interface InterviewsResult {
  concept: DairyConcept;
  interviews: ConversationalEvaluation[];
  detailedInterviews: DetailedInterview[];
  totalInterviews: number;
  completedAt: Date;
  evaluationTime: number;
}

export interface ConceptOptimizationInsight {
  category: 'CRÍTICO' | 'IMPORTANTE' | 'RECOMENDACIÓN';
  title: string;
  description: string;
  evidence: string[];
  actionItems: string[];
  impact: 'ALTO' | 'MEDIO' | 'BAJO';
}

export interface ConceptDecision {
  recommendation: 'PROCEDER' | 'REFINAR' | 'DESCARTAR';
  confidence: number; // 1-100
  reasoning: string;
  nextSteps: string[];
}

export interface ConceptAnalysisResult {
  decision: ConceptDecision;
  insights: ConceptOptimizationInsight[];
  keyFindings: {
    strengthPoints: string[];
    weaknessPoints: string[];
    surprisingFindings: string[];
  };
  targetOptimization: {
    messaging: string[];
    positioning: string[];
    features: string[];
    pricing: string[];
  };
  researchRecommendations: {
    mustValidate: string[];
    segments: string[];
    methodology: string[];
  };
  timeline: {
    analysisDate: Date;
    processingTime: number;
    basedOnInterviews: number;
  };
}

export class TwoPhaseEvaluationService {
  private progressCallback?: (progress: EvaluationProgress) => void;

  constructor(progressCallback?: (progress: EvaluationProgress) => void) {
    this.progressCallback = progressCallback;
  }

  /**
   * FASE 1: Realizar entrevistas sintéticas
   */
  async runInterviewPhase(
    concept: DairyConcept,
    personas: DairyPersona[]
  ): Promise<InterviewsResult> {
    const startTime = Date.now();

    this.updateProgress('interviews', 0, personas.length, 'Iniciando entrevistas sintéticas...');

    const interviews: ConversationalEvaluation[] = [];
    const detailedInterviews: DetailedInterview[] = [];

    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];

      this.updateProgress(
        'interviews',
        i + 1,
        personas.length,
        `Entrevistando a ${persona.name}...`,
        persona.name
      );

      try {
        // Realizar entrevista individual
        const interview = await this.conductIndividualInterview(concept, persona);
        interviews.push(interview);

        // Convertir a formato detallado
        const detailedInterview = this.convertToDetailedInterview(persona, interview);
        detailedInterviews.push(detailedInterview);

        console.log(`✅ Entrevista completada: ${persona.name}`);

        // Pausa entre entrevistas para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Error en entrevista con ${persona.name}:`, error);
        throw new Error(`No se pudo completar la entrevista con ${persona.name}. Error: ${error.message}. El sistema requiere que todas las entrevistas se completen exitosamente usando Genius Bot. Por favor, verifique la conexión e intente nuevamente.`);
      }
    }

    const evaluationTime = Math.round((Date.now() - startTime) / 1000);

    this.updateProgress(
      'completed',
      personas.length,
      personas.length,
      'Entrevistas completadas'
    );

    return {
      concept,
      interviews,
      detailedInterviews,
      totalInterviews: interviews.length,
      completedAt: new Date(),
      evaluationTime
    };
  }

  /**
   * FASE 2: Análisis de insights y optimización del concepto
   */
  async runAnalysisPhase(interviewsResult: InterviewsResult): Promise<ConceptAnalysisResult> {
    const startTime = Date.now();

    this.updateProgress('consolidation', 0, 5, 'Analizando entrevistas para optimización...');

    try {
      // Paso 1: Preparar datos consolidados de todas las entrevistas
      const consolidatedData = this.prepareConsolidatedData(interviewsResult);

      this.updateProgress('consolidation', 1, 5, 'Generando insights de optimización...');

      // Paso 2: Generar insights de optimización usando Claude
      const optimizationPrompt = this.buildOptimizationPrompt(interviewsResult, consolidatedData);

      this.updateProgress('consolidation', 2, 5, 'Consultando experto en optimización de conceptos...');

      const response = await this.callClaudeForAnalysis(optimizationPrompt);

      this.updateProgress('consolidation', 3, 5, 'Procesando recomendaciones estratégicas...');

      // Paso 3: Parsear y estructurar resultados
      const analysisResult = this.parseAnalysisResponse(response, interviewsResult);

      this.updateProgress('consolidation', 4, 5, 'Finalizando reporte de optimización...');

      // Paso 4: Enriquecer con análisis automático adicional
      const enrichedResult = this.enrichWithAutomaticAnalysis(analysisResult, interviewsResult);

      this.updateProgress('completed', 5, 5, 'Análisis de optimización completado');

      const processingTime = Math.round((Date.now() - startTime) / 1000);

      return {
        ...enrichedResult,
        timeline: {
          analysisDate: new Date(),
          processingTime,
          basedOnInterviews: interviewsResult.totalInterviews
        }
      };

    } catch (error) {
      console.error('❌ Error en análisis de optimización:', error);
      throw new Error(`No se pudo completar el análisis de optimización para el concepto "${interviewsResult.concept.name}". Error: ${error.message}. Por favor, verifique la conexión con Genius Bot e intente nuevamente.`);
    }
  }

  /**
   * Función combinada para casos donde se quiera ejecutar todo de una vez
   */
  async runCompleteEvaluation(
    concept: DairyConcept,
    personas: DairyPersona[]
  ): Promise<{ interviews: InterviewsResult; analysis: ConceptAnalysisResult }> {

    // Fase 1: Entrevistas
    const interviews = await this.runInterviewPhase(concept, personas);

    // Pausa entre fases
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Fase 2: Análisis
    const analysis = await this.runAnalysisPhase(interviews);

    return { interviews, analysis };
  }

  // Métodos privados de apoyo

  private async conductIndividualInterview(
    concept: DairyConcept,
    persona: DairyPersona
  ): Promise<ConversationalEvaluation> {
    // Configuración adaptativa para entrevistas enfocadas en optimización
    const config = {
      interviewStyle: 'optimization-focused',
      questionDepth: 'medium',
      focusAreas: ['concept-clarity', 'barrier-identification', 'improvement-opportunities'],
      timeLimit: 'moderate'
    };

    return await generateConversationalEvaluation(concept, persona, config);
  }

  private convertToDetailedInterview(
    persona: DairyPersona,
    interview: ConversationalEvaluation
  ): DetailedInterview {
    return {
      personaId: persona.id,
      personaName: persona.name,
      personaAge: persona.demographics.age,
      userInformation: {
        personalInformation: {
          name: persona.name,
          age: persona.demographics.age,
          location: persona.demographics.location,
          profession: persona.demographics.profession,
          familyStatus: persona.demographics.familyStatus || 'No especificado',
          socialClass: persona.demographics.socialClass
        },
        dairyConsumption: {
          frequency: persona.dairyHabits?.frequency || 'Regular',
          preferences: persona.dairyHabits?.preferences || ['Lácteos tradicionales'],
          brandPreferences: persona.dairyHabits?.brandPreferences || ['Alquería', 'Alpina'],
          purchaseFactors: persona.dairyHabits?.purchaseFactors || ['Calidad', 'Precio']
        }
      },
      interviewData: interview,
      timestamp: new Date()
    };
  }

  private prepareConsolidatedData(interviewsResult: InterviewsResult): string {
    const { concept, interviews, detailedInterviews } = interviewsResult;

    return `
DATOS CONSOLIDADOS DE ${interviews.length} ENTREVISTAS SINTÉTICAS

CONCEPTO EVALUADO:
- Nombre: ${concept.name}
- Descripción: ${concept.description}
- Categoría: ${concept.category}
- Beneficios prometidos: ${concept.benefits?.join(', ')}
- Público objetivo: ${concept.targetAudience}

PERFILES ENTREVISTADOS:
${detailedInterviews.map((interview, i) => `
${i + 1}. ${interview.personaName}
   - Edad: ${interview.personaAge} años
   - Ubicación: ${interview.userInformation.personalInformation.location}
   - Profesión: ${interview.userInformation.personalInformation.profession}
   - Clase social: ${interview.userInformation.personalInformation.socialClass}
   - Consumo lácteo: ${interview.userInformation.dairyConsumption.frequency}
   - Marcas preferidas: ${interview.userInformation.dairyConsumption.brandPreferences.join(', ')}
`).join('')}

CONVERSACIONES COMPLETAS:
${interviews.map((interview, i) => `
--- ENTREVISTA ${i + 1}: ${detailedInterviews[i].personaName} ---
${interview.conversation.map(exchange => `
PREGUNTA: ${exchange.question}
RESPUESTA: ${exchange.response}
`).join('\n')}

INSIGHTS CLAVE DE ESTA ENTREVISTA:
${interview.executiveSummary?.thematicAnalysis.map(theme =>
  theme.keyInsights.map(insight => `• ${insight.title}: ${insight.summary}`).join('\n')
).join('\n') || 'Insights pendientes de procesamiento'}
`).join('\n\n')}
`;
  }

  private buildOptimizationPrompt(
    interviewsResult: InterviewsResult,
    consolidatedData: string
  ): string {
    return `
# ANÁLISIS DE OPTIMIZACIÓN DE CONCEPTO LÁCTEO

Eres un experto consultor en innovación de productos lácteos con 20+ años de experiencia ayudando a empresas como Alquería, Alpina y Nestlé a optimizar conceptos antes de invertir en investigación tradicional.

## OBJETIVO
Analizar las entrevistas sintéticas para determinar si el concepto "${interviewsResult.concept.name}" debe:
1. **PROCEDER** a investigación tradicional (está listo)
2. **REFINAR** antes de testear (necesita ajustes específicos)
3. **DESCARTAR** (barreras insuperables)

## DATOS A ANALIZAR
${consolidatedData}

## ANÁLISIS REQUERIDO

### 1. DECISIÓN ESTRATÉGICA
- Recomendación clara: PROCEDER/REFINAR/DESCARTAR
- Nivel de confianza (1-100)
- Justificación basada en evidencia de las entrevistas
- Próximos pasos específicos

### 2. INSIGHTS DE OPTIMIZACIÓN
Identifica 5-8 insights categorizados como:
- **CRÍTICO**: Debe solucionarse o el concepto fallará
- **IMPORTANTE**: Mejora significativa probable
- **RECOMENDACIÓN**: Optimización incremental

Para cada insight incluye:
- Descripción del problema/oportunidad
- Evidencia específica de las entrevistas
- Acciones recomendadas
- Impacto esperado (ALTO/MEDIO/BAJO)

### 3. HALLAZGOS CLAVE
- **Fortalezas**: Qué funciona bien del concepto
- **Debilidades**: Qué genera resistencia o confusión
- **Hallazgos sorprendentes**: Insights inesperados

### 4. OPTIMIZACIONES ESPECÍFICAS
- **Messaging**: Cómo comunicar mejor el concepto
- **Posicionamiento**: Dónde ubicarlo en el mercado
- **Features**: Qué características ajustar
- **Precio**: Expectativas de precio detectadas

### 5. RECOMENDACIONES PARA INVESTIGACIÓN
- **Debe validarse**: Aspectos críticos para confirmar en campo
- **Segmentos prioritarios**: Dónde enfocar la investigación
- **Metodología sugerida**: Cómo estructura la investigación tradicional

## FORMATO DE RESPUESTA
Responde en JSON con esta estructura exacta:

{
  "decision": {
    "recommendation": "PROCEDER|REFINAR|DESCARTAR",
    "confidence": 85,
    "reasoning": "Justificación clara basada en evidencia...",
    "nextSteps": ["Acción 1", "Acción 2", "Acción 3"]
  },
  "insights": [
    {
      "category": "CRÍTICO",
      "title": "Confusión sobre beneficios principales",
      "description": "Los consumidores no comprenden claramente qué hace diferente al producto",
      "evidence": ["Cita 1 de entrevista", "Cita 2 de entrevista"],
      "actionItems": ["Simplificar mensaje", "Clarificar beneficio único"],
      "impact": "ALTO"
    }
  ],
  "keyFindings": {
    "strengthPoints": ["Fortaleza 1", "Fortaleza 2"],
    "weaknessPoints": ["Debilidad 1", "Debilidad 2"],
    "surprisingFindings": ["Hallazgo inesperado 1"]
  },
  "targetOptimization": {
    "messaging": ["Mensaje optimizado 1", "Mensaje optimizado 2"],
    "positioning": ["Posición sugerida 1"],
    "features": ["Ajuste de feature 1"],
    "pricing": ["Expectativa de precio detectada"]
  },
  "researchRecommendations": {
    "mustValidate": ["Aspecto crítico a validar", "Hipótesis a confirmar"],
    "segments": ["Segmento prioritario 1", "Segmento prioritario 2"],
    "methodology": ["Método sugerido 1", "Técnica recomendada 2"]
  }
}

**IMPORTANTE**: Sé específico, accionable y basa TODAS las recomendaciones en evidencia clara de las entrevistas. Este análisis determinará si Alquería invierte miles de dólares en investigación tradicional.
`;
  }

  private async callClaudeForAnalysis(prompt: string): Promise<string> {
    const response = await fetch('/api/claude-evaluation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.2,
        systemPrompt: 'Eres un experto consultor en optimización de conceptos lácteos que genera análisis estratégicos de alta precisión.',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Manejo robusto de respuesta (igual que arreglamos arriba)
    if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
      return data.content[0].text.trim();
    } else if (data.message || data.response) {
      return (data.message || data.response).trim();
    } else if (typeof data === 'string') {
      return data.trim();
    } else {
      console.log('❌ Estructura de respuesta inesperada:', data);
      throw new Error('Formato de respuesta no reconocido de Claude API');
    }
  }

  private parseAnalysisResponse(
    response: string,
    interviewsResult: InterviewsResult
  ): ConceptAnalysisResult {
    try {
      // Limpiar respuesta si viene con markdown
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const parsed = JSON.parse(cleanResponse);

      return {
        decision: parsed.decision,
        insights: parsed.insights || [],
        keyFindings: parsed.keyFindings || {
          strengthPoints: [],
          weaknessPoints: [],
          surprisingFindings: []
        },
        targetOptimization: parsed.targetOptimization || {
          messaging: [],
          positioning: [],
          features: [],
          pricing: []
        },
        researchRecommendations: parsed.researchRecommendations || {
          mustValidate: [],
          segments: [],
          methodology: []
        },
        timeline: {
          analysisDate: new Date(),
          processingTime: 0,
          basedOnInterviews: interviewsResult.totalInterviews
        }
      };
    } catch (error) {
      console.error('❌ Error parseando respuesta de análisis:', error);
      throw new Error('No se pudo parsear la respuesta del análisis');
    }
  }

  private enrichWithAutomaticAnalysis(
    result: ConceptAnalysisResult,
    interviewsResult: InterviewsResult
  ): ConceptAnalysisResult {
    // Añadir análisis automático adicional basado en patrones detectados

    // Detectar menciones de precio como barrera
    const priceBarriers = interviewsResult.interviews.filter(interview =>
      interview.conversation.some(exchange =>
        exchange.response.toLowerCase().includes('caro') ||
        exchange.response.toLowerCase().includes('precio')
      )
    ).length;

    if (priceBarriers > interviewsResult.totalInterviews * 0.4) {
      result.insights.push({
        category: 'CRÍTICO',
        title: 'Resistencia significativa al precio',
        description: `${priceBarriers}/${interviewsResult.totalInterviews} entrevistados expresaron preocupación por el precio`,
        evidence: ['Análisis automático de patrones en respuestas'],
        actionItems: ['Revisar estrategia de precio', 'Comunicar mejor value proposition'],
        impact: 'ALTO'
      });
    }

    return result;
  }

  // ELIMINADO: generateFallbackAnalysis - No más respuestas hardcoded
  // El sistema ahora siempre requiere API real o falla explícitamente

  // ELIMINADO: createFallbackInterview - No más entrevistas falsas
  // El sistema ahora falla explícitamente si una entrevista no se puede completar

  private updateProgress(
    phase: 'interviews' | 'consolidation' | 'completed',
    current: number,
    total: number,
    action: string,
    persona?: string
  ) {
    if (this.progressCallback) {
      this.progressCallback({
        currentPhase: phase,
        currentStep: current,
        totalSteps: total,
        currentPersona: persona,
        currentAction: action,
        timeElapsed: 0 // Se puede calcular si es necesario
      });
    }
  }
}

export const twoPhaseEvaluationService = new TwoPhaseEvaluationService();