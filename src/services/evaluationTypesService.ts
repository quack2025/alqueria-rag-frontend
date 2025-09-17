/**
 * Qualitative Evaluation Service - Deep Consumer Insights
 * 
 * Focus on qualitative "why" insights instead of quantitative metrics:
 * - Concept Testing: Deep reasons for acceptance/rejection, credibility, differentiation
 * - Campaign Testing: Communication effectiveness, message appeal, creative elements
 */

import type { Concept, SyntheticPersona, EvaluationResult } from '../components/InnovationLab/InnovationLabContainer';
import type { EvaluationSettings } from './llmEvaluationService';
import { RAGEnhancedEvaluationEngine } from './ragIntegrationService';
import { evaluateWithTopicBasedAnalysis } from './syntheticUsersEvaluationService';

// ===== EVALUATION TYPE DEFINITIONS =====

export enum EvaluationType {
  QUALITATIVE_ANALYSIS = 'qualitative_analysis'  // Unified adaptive analysis (like syntheticusers.com)
}

export interface EvaluationTypeConfig {
  type: EvaluationType;
  name: string;
  description: string;
  icon: string;
  prompts: EvaluationPrompts;
  outputStructure: string[];
  focus: string[];
}

export interface EvaluationPrompts {
  spanish: {
    instructions: string;
    questions: string[];
    context: string;
  };
  english: {
    instructions: string;
    questions: string[];
    context: string;
  };
}

// ===== EVALUATION TYPE CONFIGURATIONS =====

export const EVALUATION_TYPES: { [key in EvaluationType]: EvaluationTypeConfig } = {
  [EvaluationType.QUALITATIVE_ANALYSIS]: {
    type: EvaluationType.QUALITATIVE_ANALYSIS,
    name: 'Análisis Cualitativo Avanzado',
    description: 'Análisis adaptativo profundo estilo syntheticusers.com con temas dinámicos según categoría y tipo de evaluación',
    icon: '🎯',
    prompts: {
      spanish: {
        instructions: 'Generar análisis temático adaptativo ultra-detallado basado en temas dinámicos relevantes para el concepto.',
        questions: [
          '¿Cuáles son los temas más relevantes para analizar este concepto?',
          '¿Qué percepciones iniciales genera en los consumidores?',
          '¿Qué expectativas y necesidades aborda?',
          '¿Cómo se integra en el contexto de uso actual?',
          '¿Qué factores influyen en la decisión de adopción?'
        ],
        context: 'Analizar TEMAS y PATRONES adaptativos según la categoría del concepto. Generar insights profundos estilo syntheticusers.com.'
      },
      english: {
        instructions: 'Generate adaptive ultra-detailed thematic analysis based on dynamic themes relevant to the concept.',
        questions: [
          'What are the most relevant themes to analyze this concept?',
          'What initial perceptions does it generate in consumers?',
          'What expectations and needs does it address?',
          'How does it integrate into current usage context?',
          'What factors influence adoption decisions?'
        ],
        context: 'Analyze adaptive THEMES and PATTERNS based on concept category. Generate deep insights syntheticusers.com style.'
      }
    },
    outputStructure: ['Temas Dinámicos Generados', 'Percepciones Iniciales', 'Expectativas y Necesidades', 'Integración Contextual', 'Factores de Decisión'],
    focus: ['dynamic_themes', 'initial_perceptions', 'expectations_needs', 'contextual_integration', 'decision_factors']
  }
};

// ===== QUALITATIVE EVALUATION ENGINE =====

export class QualitativeEvaluationEngine extends RAGEnhancedEvaluationEngine {
  /**
   * Generate qualitative evaluation based on specific evaluation type
   */
  async generateQualitativeEvaluation(
    concept: Concept,
    persona: SyntheticPersona,
    evaluationType: EvaluationType,
    settings: EvaluationSettings
  ): Promise<EvaluationResult> {
    const typeConfig = EVALUATION_TYPES[evaluationType];
    
    // All evaluations now use unified topic-based analysis
    if (evaluationType === EvaluationType.QUALITATIVE_ANALYSIS) {
      return this.generateTopicBasedAnalysis(concept, persona, settings);
    }
    
    try {
      // Build specialized qualitative prompt
      const qualitativePrompt = this.buildQualitativePrompt(concept, typeConfig, settings);
      
      // Skip RAG context for qualitative evaluation (not needed)
      const ragContext = null;
      
      // Build enhanced role prompt focused on authentic personal perspective
      const rolePrompt = this.buildPersonalRolePrompt(persona, typeConfig, ragContext, settings.language);
      
      // Call LLM with qualitative prompts (direct call without RAG complexity)
      const llmResponse = await this.callLLMAPIDirect(rolePrompt, qualitativePrompt, settings);
      
      // Parse with qualitative-specific structure
      return this.parseQualitativeResponse(llmResponse, concept.id, persona.id, typeConfig);
      
    } catch (error) {
      console.error(`Qualitative evaluation (${evaluationType}) failed:`, error);
      return await this.generateRAGEnhancedEvaluation({ concept, persona, settings });
    }
  }

  /**
   * Generate topic-based analysis (SyntheticUsers style)
   */
  private async generateTopicBasedAnalysis(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): Promise<EvaluationResult> {
    console.log('🎯 Generating SyntheticUsers-style topic-based analysis...');
    
    try {
      // Use external topic-based evaluation service
      const topicResult = await evaluateWithTopicBasedAnalysis(concept, persona, settings);
      
      // Convert TopicBasedEvaluationResult to EvaluationResult
      const evaluationResult: EvaluationResult = {
        conceptId: topicResult.conceptId,
        personaId: topicResult.personaId,
        aspects: topicResult.aspects,
        overallAcceptance: topicResult.overallAcceptance,
        quote: topicResult.quote,
        keyDrivers: topicResult.keyDrivers,
        suggestions: topicResult.suggestions,
        // Store additional topic data in suggestions for now
        topicAnalysis: {
          executiveSummary: topicResult.executiveSummary,
          topicInsights: topicResult.topicInsights,
          surprisingInsight: topicResult.surprisingInsight,
          detailedAnalysis: topicResult.detailedTopicAnalysis
        }
      };
      
      return evaluationResult;
      
    } catch (error) {
      console.error('Topic-based analysis failed:', error);
      throw error;
    }
  }

  /**
   * Build qualitative prompt focused on "why" insights
   */
  private buildQualitativePrompt(
    concept: Concept,
    typeConfig: EvaluationTypeConfig,
    settings: EvaluationSettings
  ): string {
    const lang = settings.language as 'spanish' | 'english';
    const prompts = typeConfig.prompts[lang];
    
    const conceptDescription = `
CONCEPTO A EVALUAR:
- Nombre: ${concept.name}
- Marca: ${concept.brand}
- Categoría: ${concept.category}
- Descripción: ${concept.description}
- Beneficios: ${concept.benefits.join(', ')}
- Público objetivo: ${concept.targetAudience}
${concept.price ? `- Precio: $${concept.price}` : ''}
${concept.differentiation ? `- Diferenciación: ${concept.differentiation}` : ''}
`;

    const questions = prompts.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');

    return `${conceptDescription}

TIPO DE EVALUACIÓN: ${typeConfig.name}
${typeConfig.description}

INSTRUCCIONES IMPORTANTES:
${prompts.instructions}

CONTEXTO:
${prompts.context}

PREGUNTAS PARA REFLEXIONAR:
${questions}

FORMATO DE RESPUESTA CUALITATIVO:
Responde en formato JSON con esta estructura exacta, enfocándote en RAZONES específicas y detalladas:

{
  "quote": "Tu reacción personal completa sobre el concepto en primera persona (mínimo 2 oraciones)",
  "overall_feeling": "positiva|neutral|negativa",
  "aspects": {
    ${typeConfig.outputStructure.map((structure, i) => `
    "${structure.toLowerCase().replace(/\s+/g, '_').replace(/ñ/g, 'n')}": {
      "positives": ["razón positiva específica 1", "razón positiva específica 2"],
      "negatives": ["razón negativa específica 1", "razón negativa específica 2"],  
      "recommendations": ["recomendación específica 1", "recomendación específica 2"]
    }${i < typeConfig.outputStructure.length - 1 ? ',' : ''}`).join('')}
  },
  "key_drivers": ["driver de decisión 1", "driver de decisión 2", "driver de decisión 3"],
  "suggestions": ["mejora específica 1", "mejora específica 2"]
}

INSTRUCCIONES PARA INSIGHTS PROFUNDOS:
• Conecta con TUS experiencias específicas (familia, trabajo, estrés económico)
• Analiza ingredientes: conocidos vs desconocidos  
• Muestra conflictos: lo que quieres vs lo que puedes permitirte
• Detecta señales de precio/premium en la descripción
• Sugiere mejoras específicas para tu segmento socioeconómico

FORMATO REQUERIDO - USA ESTRUCTURA EXACTA DE CLAUDE.AI:
NO uses el formato JSON anterior. En su lugar, responde como lo haría Claude.ai con esta estructura:

{
  "quote": "Tu reacción personal auténtica en 2-3 oraciones con lenguaje natural y específico",
  "overall_feeling": "positiva|neutral|negativa", 
  "razones_para_comprar": ["Razón específica conectada a tu experiencia personal", "Otra razón con contexto de tu vida real"],
  "razones_para_no_comprar": ["Barrera específica relacionada con tu situación", "Otra barrera con contexto económico/personal"],
  "credibilidad": {
    "positivo": ["Aspecto creíble basado en tu conocimiento/experiencia"],
    "negativo": ["Aspecto que genera dudas específicas"]
  },
  "diferenciacion": "Tu percepción específica sobre diferenciación vs similitudes con otros productos",
  "identificacion_problema": "Tu conexión personal específica con el problema que resuelve",
  "sugerencias_mejora": ["Mejora específica para tu segmento", "Otra mejora accionable"]
}

CRÍTICO: Cada respuesta debe ser ESPECÍFICA a tu perfil de 80+ variables, no genérica.`;
  }

  /**
   * Build role prompt emphasizing personal authenticity
   */
  private buildPersonalRolePrompt(
    persona: SyntheticPersona,
    typeConfig: EvaluationTypeConfig,
    ragContext: any,
    language: string = 'spanish'
  ): string {
    // Get ultra-sophisticated prompt using ALL 80+ variables
    const contextBuilder = new (class { 
      buildRolePrompt(lang: string) { 
        const lang_typed = lang as 'spanish' | 'english';
        const isSpanish = lang_typed === 'spanish';
        
        return `Eres ${persona.name}, ${persona.baseProfile.age} años, ${persona.archetype} de ${persona.baseProfile.location}.

PERFIL COMPLETO:
${this.buildCompactProfile(persona, isSpanish)}

${isSpanish ? 
  `CONTEXTO CRÍTICO: Responde desde tu perspectiva auténtica usando TU experiencia específica.
   Conecta el concepto con tu realidad: ingresos ${this.getVar(persona.variables || [], 'ingreso_mensual') || 'limitados'} COP/mes, 
   sensibilidad precio ${this.getVar(persona.variables || [], 'sensibilidad_precio') || 5}/10, 
   prioridades familiares vs personales. Explica el POR QUÉ detrás de cada opinión.` :
  `CRITICAL CONTEXT: Respond from your authentic perspective using YOUR specific experience.
   Connect concept with your reality: income, price sensitivity, family vs personal priorities.
   Explain the WHY behind each opinion.`}`;
      }
      
      buildCompactProfile(persona: any, isSpanish: boolean): string {
        const vars = persona.variables || [];
        const income = this.getVar(vars, 'ingreso_mensual') || 'No especificado';
        const personalBudget = this.getVar(vars, 'presupuesto_personal') || 'Limitado';
        const priceSensitivity = this.getVar(vars, 'sensibilidad_precio') || 5;
        const children = this.getVar(vars, 'dependientes') || this.getVar(vars, 'hijos') || 0;
        const savitalUse = this.getVar(vars, 'savital_uso') || 'No especificado';
        const savitalPerception = this.getVar(vars, 'savital_percepcion') || 'No conoce bien';
        const psycho = persona.psychographics || {};
        const behaviors = persona.behaviors || {};
        
        return `• NSE: ${persona.baseProfile.socioeconomicLevel}, Ingreso: $${typeof income === 'number' ? income.toLocaleString() : income} COP
• Hijos: ${children}, Presupuesto personal: $${typeof personalBudget === 'number' ? personalBudget.toLocaleString() : personalBudget} COP
• Sensibilidad precio: ${priceSensitivity}/10 ${priceSensitivity >= 8 ? '(EXTREMA)' : priceSensitivity >= 6 ? '(Alta)' : '(Moderada)'}
• Savital: Uso: ${savitalUse}, Percepción: "${savitalPerception}"
• Valores: ${Array.isArray(psycho.valores) ? psycho.valores.slice(0,3).join(', ') : 'Familia, Trabajo'}
• Expresiones: ${behaviors.comunicacion?.expresiones?.slice(0,2).join(', ') || 'Regionales'}`;
      }
      
      buildDemographicSection(persona: any, isSpanish: boolean): string {
        const vars = persona.variables || [];
        const income = this.getVar(vars, 'ingreso_mensual') || 'No especificado';
        const personalBudget = this.getVar(vars, 'presupuesto_personal') || 'Limitado';
        const children = this.getVar(vars, 'dependientes') || this.getVar(vars, 'hijos') || 0;
        const education = this.getVar(vars, 'educacion') || this.getVar(vars, 'nivel_educativo') || persona.baseProfile.occupation;
        const maritalStatus = this.getVar(vars, 'estado_civil') || 'No especificado';
        
        return `- Edad: ${persona.baseProfile.age} años
- Ubicación: ${persona.baseProfile.location} 
- NSE: ${persona.baseProfile.socioeconomicLevel}
- Ocupación: ${persona.baseProfile.occupation}
- Estado civil: ${maritalStatus}
- Dependientes: ${children} ${children > 0 ? (isSpanish ? 'hijos' : 'children') : ''}
- Ingreso mensual: $${typeof income === 'number' ? income.toLocaleString() : income} COP
- Presupuesto personal: $${typeof personalBudget === 'number' ? personalBudget.toLocaleString() : personalBudget} COP
- Educación: ${education}`;
      }
      
      buildBehavioralSection(persona: any, isSpanish: boolean): string {
        const vars = persona.variables || [];
        const priceSensitivity = this.getVar(vars, 'sensibilidad_precio') || 5;
        const brandLoyalty = this.getVar(vars, 'lealtad_marca') || 5;
        const innovation = this.getVar(vars, 'apertura_innovacion') || 5;
        const channel = this.getVar(vars, 'canal_compra_principal') || 'Supermercado';
        const frequency = this.getVar(vars, 'frecuencia_compra_cuidado') || 'Mensual';
        
        return `- Sensibilidad al precio: ${priceSensitivity}/10 ${priceSensitivity >= 8 ? '(EXTREMA)' : priceSensitivity >= 6 ? '(Alta)' : '(Moderada)'}
- Lealtad a marcas: ${brandLoyalty}/10
- Apertura a innovación: ${innovation}/10
- Canal principal de compra: ${channel}
- Frecuencia de compra: ${frequency}
- Busca promociones: ${this.getVar(vars, 'busca_promociones') || 'A veces'}
- Factor principal de decisión: ${this.getVar(vars, 'factor_decision') || 'Precio y calidad'}`;
      }
      
      buildPsychologySection(persona: any, isSpanish: boolean): string {
        const vars = persona.variables || [];
        const psycho = persona.psychographics || {};
        
        return `- Extroversión: ${this.getVar(vars, 'extroversion') || psycho.personalidad?.extroversion || 5}/10
- Apertura mental: ${this.getVar(vars, 'apertura') || psycho.personalidad?.apertura || 5}/10
- Responsabilidad: ${this.getVar(vars, 'responsabilidad') || psycho.personalidad?.responsabilidad || 5}/10
- Amabilidad: ${this.getVar(vars, 'amabilidad') || 8}/10
- Neuroticismo/Estrés: ${this.getVar(vars, 'neuroticismo') || 5}/10
- Valores principales: ${Array.isArray(psycho.valores) ? psycho.valores.join(', ') : 'Familia, Trabajo, Honestidad'}
- Motivaciones: ${Array.isArray(psycho.motivaciones) ? psycho.motivaciones.join(', ') : 'Estabilidad familiar'}
- Preocupaciones: ${Array.isArray(psycho.preocupaciones) ? psycho.preocupaciones.join(', ') : 'Economía, Futuro'}`;
      }
      
      buildLifeContextSection(persona: any, isSpanish: boolean): string {
        const vars = persona.variables || [];
        const behaviors = persona.behaviors || {};
        
        return `- Situación familiar: ${this.getVar(vars, 'prioridad_gastos') || 'Familia primero'}
- Tiempo personal: ${this.getVar(vars, 'tiempo_personal') || 'Limitado'}
- Aspiraciones: ${this.getVar(vars, 'aspiraciones') || 'Progreso familiar'}
- Horas de trabajo: ${this.getVar(vars, 'horas_trabajo') || 'Tiempo completo'}
- Ingresos extra: ${this.getVar(vars, 'ingreso_extra') || 'Ninguno'}
- Ahorro mensual: ${this.getVar(vars, 'ahorro_mensual') || 'Limitado'}`;
      }
      
      buildBrandRelationshipSection(persona: any, isSpanish: boolean): string {
        const vars = persona.variables || [];
        const brands = persona.brandRelationships || {};
        
        let brandSection = '';
        // Savital specific
        const savitalUse = this.getVar(vars, 'savital_uso') || brands.savital?.uso || 'No usa';
        const savitalPerception = this.getVar(vars, 'savital_percepcion') || brands.savital?.percepcion || 'No conoce bien';
        brandSection += `- Savital: Uso: ${savitalUse}, Percepción: "${savitalPerception}"\\n`;
        
        // Other Unilever brands
        if (brands.dove) {
          brandSection += `- Dove: ${brands.dove.percepcion || 'Marca premium'}\\n`;
        }
        if (brands.fruco) {
          brandSection += `- Fruco: ${brands.fruco.percepcion || 'Marca tradicional'}\\n`;
        }
        
        return brandSection;
      }
      
      buildCommunicationSection(persona: any, isSpanish: boolean): string {
        const vars = persona.variables || [];
        const behaviors = persona.behaviors || {};
        const expressions = this.getVar(vars, 'expresiones_regionales') || this.getVar(vars, 'expresiones') || behaviors.comunicacion?.expresiones || ['expressions regionales'];
        
        return `- Estilo comunicación: ${behaviors.comunicacion?.estilo || 'Directo y honesto'}
- Expresiones típicas: ${Array.isArray(expressions) ? expressions.join(', ') : expressions}
- Nivel formalidad: ${this.getVar(vars, 'nivel_formalidad') || 'Informal'}
- Dialecto/Región: ${this.getVar(vars, 'dialecto') || 'Regional'}`;
      }
      
      getVar(variables: any[], key: string) {
        const variable = variables.find(v => v.key === key);
        return variable ? variable.value : null;
      }
    });
    
    const basePrompt = contextBuilder.buildRolePrompt(language);
    // Skip RAG enhancement for qualitative evaluation
    const enhancedPrompt = basePrompt;

    const lang = language as 'spanish' | 'english';
    
    const typeSpecificContext = lang === 'spanish' ?
      `\n\nPARA ESTA EVALUACIÓN CUALITATIVA "${typeConfig.name}":
- Enfócate específicamente en: ${typeConfig.focus.join(', ')}
- Explica siempre el "POR QUÉ" detrás de cada opinión
- Usa ejemplos de tu experiencia personal cuando sea relevante
- Sé específico y detallado en tus razones` :
      `\n\nFOR THIS QUALITATIVE EVALUATION "${typeConfig.name}":
- Focus specifically on: ${typeConfig.focus.join(', ')}
- Always explain the "WHY" behind each opinion
- Use examples from your personal experience when relevant
- Be specific and detailed in your reasons`;

    return enhancedPrompt + typeSpecificContext;
  }

  /**
   * Parse response with qualitative-specific structure
   */
  private parseQualitativeResponse(
    llmResponse: string,
    conceptId: string,
    personaId: string,
    typeConfig: EvaluationTypeConfig
  ): EvaluationResult {
    try {
      const parsed = JSON.parse(llmResponse);
      
      // Map aspects using Claude.ai format (more sophisticated)
      const aspects: { [aspect: string]: { positives: string[]; negatives: string[]; recommendations: string[]; score?: number } } = {};
      
      // Handle Claude.ai format: razones_para_comprar, razones_para_no_comprar, credibilidad
      if (parsed.razones_para_comprar) {
        aspects['Razones Para Comprar'] = {
          positives: Array.isArray(parsed.razones_para_comprar) ? parsed.razones_para_comprar : [],
          negatives: [],
          recommendations: []
        };
      }
      
      if (parsed.razones_para_no_comprar) {
        aspects['Razones Para NO Comprar'] = {
          positives: [],
          negatives: Array.isArray(parsed.razones_para_no_comprar) ? parsed.razones_para_no_comprar : [],
          recommendations: []
        };
      }
      
      if (parsed.credibilidad) {
        aspects['Credibilidad'] = {
          positives: Array.isArray(parsed.credibilidad.positivo) ? parsed.credibilidad.positivo : [],
          negatives: Array.isArray(parsed.credibilidad.negativo) ? parsed.credibilidad.negativo : [],
          recommendations: []
        };
      }
      
      // Add additional insights from Claude.ai format
      if (parsed.diferenciacion) {
        aspects['Diferenciación'] = {
          positives: [parsed.diferenciacion],
          negatives: [],
          recommendations: []
        };
      }
      
      if (parsed.identificacion_problema) {
        aspects['Identificación con Problema'] = {
          positives: [parsed.identificacion_problema],
          negatives: [],
          recommendations: []
        };
      }
      
      // Fallback to old format if new format not found
      if (Object.keys(aspects).length === 0 && parsed.aspects) {
        Object.entries(parsed.aspects).forEach(([key, value]: [string, any]) => {
          const friendlyKey = typeConfig.outputStructure.find(s => 
            s.toLowerCase().replace(/\s+/g, '_').replace(/ñ/g, 'n') === key
          ) || key.replace(/_/g, ' ');
          
          aspects[friendlyKey] = {
            positives: Array.isArray(value.positives) ? value.positives : [],
            negatives: Array.isArray(value.negatives) ? value.negatives : [],
            recommendations: Array.isArray(value.recommendations) ? value.recommendations : []
          };
        });
      }

      // Map feeling to acceptance
      const feelingToAcceptance = (feeling: string) => {
        switch (feeling?.toLowerCase()) {
          case 'positiva': return 'alta' as const;
          case 'negativa': return 'baja' as const;
          default: return 'media' as const;
        }
      };

      return {
        conceptId,
        personaId,
        aspects,
        overallAcceptance: feelingToAcceptance(parsed.overall_feeling),
        quote: parsed.quote || 'Evaluación cualitativa completada.',
        keyDrivers: Array.isArray(parsed.sugerencias_mejora) ? parsed.sugerencias_mejora : 
                   Array.isArray(parsed.key_drivers) ? parsed.key_drivers : [],
        suggestions: Array.isArray(parsed.sugerencias_mejora) ? parsed.sugerencias_mejora :
                    Array.isArray(parsed.suggestions) ? parsed.suggestions : []
      };
      
    } catch (error) {
      console.error('Failed to parse qualitative response:', error);
      return this.createFallbackResponse(llmResponse, conceptId, personaId);
    }
  }

  /**
   * Create fallback response for parsing errors
   */
  private createFallbackResponse(llmResponse: string, conceptId: string, personaId: string): EvaluationResult {
    return {
      conceptId,
      personaId,
      aspects: {
        'Evaluación General': {
          positives: ['Evaluación procesada'],
          negatives: ['Error en el formato de respuesta'],
          recommendations: ['Revisar configuración']
        }
      },
      overallAcceptance: 'media',
      quote: llmResponse.substring(0, 200) + '...',
      keyDrivers: ['Procesamiento fallback'],
      suggestions: ['Intentar nuevamente']
    };
  }
}

// ===== EXPORT MAIN FUNCTION =====

/**
 * Main function for qualitative evaluation
 */
export async function evaluateConceptByType(
  concept: Concept,
  persona: SyntheticPersona,
  evaluationType: EvaluationType,
  settings: Partial<EvaluationSettings> = {}
): Promise<EvaluationResult> {
  const engine = new QualitativeEvaluationEngine();
  const fullSettings = { 
    criticality: 'neutral',
    focus: 'comprehensive',
    depth: 'detailed',
    language: 'spanish',
    ...settings 
  } as EvaluationSettings;
  
  return engine.generateQualitativeEvaluation(concept, persona, evaluationType, fullSettings);
}