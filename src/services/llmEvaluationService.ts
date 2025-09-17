/**
 * LLM Evaluation Service - 100% AI-powered concept evaluation
 * 
 * Features:
 * - Role prompting using all 80+ persona variables
 * - Configurable evaluation criticality
 * - Authentic persona responses
 * - Structured evaluation outputs
 */

import type { SyntheticPersona, Concept, EvaluationResult } from '../components/InnovationLab/InnovationLabContainer';

// ===== EVALUATION CONFIGURATION =====

export interface EvaluationSettings {
  criticality: 'optimistic' | 'neutral' | 'critical' | 'skeptical';
  focus: 'comprehensive' | 'benefits_focused' | 'risks_focused';
  depth: 'surface' | 'detailed' | 'expert_level';
  language: 'spanish' | 'english';
}

export interface LLMEvaluationRequest {
  concept: Concept;
  persona: SyntheticPersona;
  settings: EvaluationSettings;
}

// ===== PROMPT TEMPLATES =====

const CRITICALITY_MODIFIERS = {
  optimistic: {
    spanish: "Evalúa con una perspectiva positiva y entusiasta. Busca las oportunidades y beneficios potenciales. Mantén un tono esperanzador.",
    english: "Evaluate with a positive and enthusiastic perspective. Look for opportunities and potential benefits. Keep a hopeful tone."
  },
  neutral: {
    spanish: "Evalúa de manera equilibrada, considerando tanto aspectos positivos como áreas de mejora de forma objetiva.",
    english: "Evaluate in a balanced way, considering both positive aspects and areas for improvement objectively."
  },
  critical: {
    spanish: "Evalúa con ojo crítico, identificando posibles problemas y desafíos realistas. Sé honesta sobre las limitaciones.",
    english: "Evaluate critically, identifying possible problems and realistic challenges. Be honest about limitations."
  },
  skeptical: {
    spanish: "Evalúa con escepticismo, cuestionando claims y buscando evidencia. Mantén un enfoque analítico y cauteloso.",
    english: "Evaluate skeptically, questioning claims and seeking evidence. Maintain an analytical and cautious approach."
  }
};

const FOCUS_MODIFIERS = {
  comprehensive: {
    spanish: "Proporciona una evaluación integral que cubra todos los aspectos relevantes.",
    english: "Provide a comprehensive evaluation covering all relevant aspects."
  },
  benefits_focused: {
    spanish: "Enfócate principalmente en los beneficios y ventajas del concepto.",
    english: "Focus primarily on the benefits and advantages of the concept."
  },
  risks_focused: {
    spanish: "Enfócate principalmente en los riesgos y desafíos potenciales.",
    english: "Focus primarily on risks and potential challenges."
  }
};

const DEPTH_MODIFIERS = {
  surface: {
    spanish: "Proporciona una evaluación concisa y directa.",
    english: "Provide a concise and direct evaluation."
  },
  detailed: {
    spanish: "Proporciona una evaluación detallada con análisis profundo.",
    english: "Provide a detailed evaluation with in-depth analysis."
  },
  expert_level: {
    spanish: "Proporciona una evaluación experta con insights técnicos y del mercado.",
    english: "Provide an expert evaluation with technical and market insights."
  }
};

// ===== PERSONA CONTEXT BUILDER =====

export class PersonaContextBuilder {
  private persona: SyntheticPersona;

  constructor(persona: SyntheticPersona) {
    this.persona = persona;
  }

  /**
   * Build comprehensive role prompt using all 80+ variables
   */
  buildRolePrompt(language: string = 'spanish'): string {
    const lang = language as 'spanish' | 'english';
    
    const templates = {
      spanish: {
        identity: `Eres ${this.persona.name}, una ${this.persona.baseProfile.gender.toLowerCase()} de ${this.persona.baseProfile.age} años.`,
        archetype: `Tu arquetipo es: ${this.persona.archetype}.`,
        demographics: this.buildDemographics('spanish'),
        psychographics: this.buildPsychographics('spanish'),
        behaviors: this.buildBehaviors('spanish'),
        communication: this.buildCommunication('spanish')
      },
      english: {
        identity: `You are ${this.persona.name}, a ${this.persona.baseProfile.age}-year-old ${this.persona.baseProfile.gender.toLowerCase()}.`,
        archetype: `Your archetype is: ${this.persona.archetype}.`,
        demographics: this.buildDemographics('english'),
        psychographics: this.buildPsychographics('english'),
        behaviors: this.buildBehaviors('english'),
        communication: this.buildCommunication('english')
      }
    };

    const template = templates[lang];
    
    return `${template.identity} ${template.archetype}

${template.demographics}

${template.psychographics}

${template.behaviors}

${template.communication}

${lang === 'spanish' ? 
  'Responde siempre desde TU perspectiva personal, usando tu trasfondo, experiencias y forma de hablar natural.' :
  'Always respond from YOUR personal perspective, using your background, experiences and natural way of speaking.'
}`;
  }

  /**
   * Build demographics section from variables
   */
  private buildDemographics(lang: 'spanish' | 'english'): string {
    const demographicVars = this.persona.variables.filter(v => 
      v.category === 'Demografía Básica' || v.category === 'Ubicación y Geografía'
    );

    const location = `${this.persona.baseProfile.location}`;
    const socioeconomic = this.persona.baseProfile.socioeconomicLevel;
    const occupation = this.persona.baseProfile.occupation;
    
    const income = demographicVars.find(v => v.key === 'ingreso_mensual')?.value || 'No especificado';
    const education = demographicVars.find(v => v.key === 'educacion')?.value || 'No especificado';
    
    if (lang === 'spanish') {
      return `DEMOGRAFÍA:
- Vives en ${location}
- NSE: ${socioeconomic}
- Ocupación: ${occupation}
- Ingresos: ${typeof income === 'number' ? `$${income.toLocaleString()} COP mensuales` : income}
- Educación: ${education}`;
    } else {
      return `DEMOGRAPHICS:
- You live in ${location}
- Socioeconomic level: ${socioeconomic}
- Occupation: ${occupation}
- Income: ${typeof income === 'number' ? `$${income.toLocaleString()} COP monthly` : income}
- Education: ${education}`;
    }
  }

  /**
   * Build personality profile from variables
   */
  private buildPsychographics(lang: 'spanish' | 'english'): string {
    const psychoVars = this.persona.variables.filter(v => 
      v.category === 'Psicografía y Personalidad'
    );

    const traits = psychoVars.map(v => {
      if (v.type === 'range' && typeof v.value === 'number') {
        const level = v.value >= 8 ? 'muy alta' : v.value >= 6 ? 'alta' : v.value >= 4 ? 'media' : 'baja';
        return `${v.key}: ${level} (${v.value}/10)`;
      }
      return `${v.key}: ${v.value}`;
    }).join(', ');

    if (lang === 'spanish') {
      return `PERSONALIDAD:
${traits}

VALORES Y MOTIVACIONES:
${this.persona.psychographics?.valores?.join(', ') || 'Familia, trabajo, crecimiento personal'}`;
    } else {
      return `PERSONALITY:
${traits}

VALUES AND MOTIVATIONS:
${this.persona.psychographics?.valores?.join(', ') || 'Family, work, personal growth'}`;
    }
  }

  /**
   * Build behavior patterns from variables
   */
  private buildBehaviors(lang: 'spanish' | 'english'): string {
    const behaviorVars = this.persona.variables.filter(v => 
      v.category === 'Comportamiento de Compra' || 
      v.category === 'Hábitos Digitales' ||
      v.category === 'Cuidado Personal' ||
      v.category === 'Relación con Marcas'
    );

    const purchaseFreq = behaviorVars.find(v => v.key === 'frecuencia_compra')?.value || 'Mensual';
    const pricesensitivity = behaviorVars.find(v => v.key === 'sensibilidad_precio')?.value || 5;
    const brandLoyalty = behaviorVars.find(v => v.key === 'lealtad_marca')?.value || 5;
    
    if (lang === 'spanish') {
      return `COMPORTAMIENTO DE COMPRA:
- Frecuencia de compra: ${purchaseFreq}
- Sensibilidad al precio: ${pricesensitivity}/10
- Lealtad a marcas: ${brandLoyalty}/10
- Canal principal: ${this.persona.behaviors?.compra?.canal_principal || 'Supermercado'}

RELACIÓN CON MARCAS:
${Object.entries(this.persona.brandRelationships || {}).map(([brand, data]: [string, any]) => 
  `- ${brand}: ${data.uso} (percepción: ${data.percepcion})`
).join('\n')}`;
    } else {
      return `PURCHASE BEHAVIOR:
- Purchase frequency: ${purchaseFreq}
- Price sensitivity: ${pricesensitivity}/10
- Brand loyalty: ${brandLoyalty}/10
- Main channel: ${this.persona.behaviors?.compra?.canal_principal || 'Supermarket'}

BRAND RELATIONSHIPS:
${Object.entries(this.persona.brandRelationships || {}).map(([brand, data]: [string, any]) => 
  `- ${brand}: ${data.uso} (perception: ${data.percepcion})`
).join('\n')}`;
    }
  }

  /**
   * Build communication style from variables
   */
  private buildCommunication(lang: 'spanish' | 'english'): string {
    const commVars = this.persona.variables.filter(v => 
      v.category === 'Comunicación y Lenguaje'
    );

    const formality = commVars.find(v => v.key === 'nivel_formalidad')?.value || 'Neutral';
    const expressions = commVars.find(v => v.key === 'expresiones_regionales')?.value || [];
    
    if (lang === 'spanish') {
      return `COMUNICACIÓN:
- Nivel de formalidad: ${formality}
- Expresiones típicas: ${Array.isArray(expressions) ? expressions.join(', ') : expressions}
- Estilo: Auténtico, directo, con personalidad regional colombiana`;
    } else {
      return `COMMUNICATION:
- Formality level: ${formality}
- Typical expressions: ${Array.isArray(expressions) ? expressions.join(', ') : expressions}
- Style: Authentic, direct, with Colombian regional personality`;
    }
  }
}

// ===== LLM EVALUATION ENGINE =====

export class LLMEvaluationEngine {
  private apiUrl: string;
  private apiKey?: string;

  constructor(apiUrl?: string, apiKey?: string) {
    // Use existing Unilever RAG backend or fallback
    this.apiUrl = apiUrl || import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app';
    this.apiKey = apiKey;
  }

  /**
   * Generate LLM-powered evaluation using role prompting
   */
  async generateEvaluation(request: LLMEvaluationRequest): Promise<EvaluationResult> {
    try {
      const { concept, persona, settings } = request;
      
      // Build comprehensive role prompt
      const contextBuilder = new PersonaContextBuilder(persona);
      const rolePrompt = contextBuilder.buildRolePrompt(settings.language);
      
      // Build evaluation prompt
      const evaluationPrompt = this.buildEvaluationPrompt(concept, settings);
      
      // Call LLM API
      const llmResponse = await this.callLLMAPI(rolePrompt, evaluationPrompt, settings);
      
      // Parse and structure response
      return this.parseEvaluationResponse(llmResponse, concept.id, persona.id);
      
    } catch (error) {
      console.error('LLM Evaluation failed:', error);
      throw new Error(`Evaluation failed: ${error}`);
    }
  }

  /**
   * Build evaluation prompt with criticality settings
   */
  private buildEvaluationPrompt(concept: Concept, settings: EvaluationSettings): string {
    const lang = settings.language;
    const criticality = CRITICALITY_MODIFIERS[settings.criticality][lang];
    const focus = FOCUS_MODIFIERS[settings.focus][lang];
    const depth = DEPTH_MODIFIERS[settings.depth][lang];

    const conceptDescription = `
CONCEPTO A EVALUAR:
- Nombre: ${concept.name}
- Marca: ${concept.brand}
- Categoría: ${concept.category}
- Descripción: ${concept.description}
- Beneficios: ${concept.benefits.join(', ')}
- Público objetivo: ${concept.targetAudience}
- Diferenciación: ${concept.differentiation}
${concept.price ? `- Precio: $${concept.price}` : ''}
${concept.ingredients ? `- Ingredientes: ${concept.ingredients.join(', ')}` : ''}
`;

    if (lang === 'spanish') {
      return `${conceptDescription}

INSTRUCCIONES DE EVALUACIÓN:
${criticality}
${focus}
${depth}

FORMATO DE RESPUESTA:
Responde en formato JSON con esta estructura exacta:
{
  "quote": "Tu opinión personal sobre el concepto en primera persona, usando tu forma natural de hablar",
  "overall_acceptance": "alta|media|baja",
  "aspects": {
    "nombre_y_posicionamiento": {
      "positives": ["aspecto positivo 1", "aspecto positivo 2"],
      "negatives": ["aspecto negativo 1", "aspecto negativo 2"],
      "recommendations": ["recomendación 1", "recomendación 2"]
    },
    "beneficios": {
      "positives": ["beneficio relevante 1", "beneficio relevante 2"],
      "negatives": ["preocupación 1", "preocupación 2"],
      "recommendations": ["sugerencia 1", "sugerencia 2"]
    },
    "precio_valor": {
      "positives": ["aspecto positivo precio", "aspecto positivo valor"],
      "negatives": ["preocupación precio", "preocupación valor"],
      "recommendations": ["recomendación precio", "recomendación valor"]
    }
  },
  "key_drivers": ["driver 1", "driver 2", "driver 3"],
  "suggestions": ["sugerencia general 1", "sugerencia general 2", "sugerencia general 3"]
}

IMPORTANTE: Responde SIEMPRE como ${settings.language === 'spanish' ? 'tú mismo' : 'yourself'}, usando tu personalidad, trasfondo y forma de expresarte natural.`;
    } else {
      return `${conceptDescription}

EVALUATION INSTRUCTIONS:
${criticality}
${focus}
${depth}

RESPONSE FORMAT:
Respond in JSON format with this exact structure:
{
  "quote": "Your personal opinion about the concept in first person, using your natural way of speaking",
  "overall_acceptance": "high|medium|low",
  "aspects": {
    "name_and_positioning": {
      "positives": ["positive aspect 1", "positive aspect 2"],
      "negatives": ["negative aspect 1", "negative aspect 2"],
      "recommendations": ["recommendation 1", "recommendation 2"]
    },
    "benefits": {
      "positives": ["relevant benefit 1", "relevant benefit 2"],
      "negatives": ["concern 1", "concern 2"],
      "recommendations": ["suggestion 1", "suggestion 2"]
    },
    "price_value": {
      "positives": ["positive price aspect", "positive value aspect"],
      "negatives": ["price concern", "value concern"],
      "recommendations": ["price recommendation", "value recommendation"]
    }
  },
  "key_drivers": ["driver 1", "driver 2", "driver 3"],
  "suggestions": ["general suggestion 1", "general suggestion 2", "general suggestion 3"]
}

IMPORTANT: Always respond as yourself, using your personality, background and natural way of expressing yourself.`;
    }
  }

  /**
   * Call LLM API directly without RAG context (for qualitative evaluations)
   */
  private async callLLMAPIDirect(rolePrompt: string, evaluationPrompt: string, settings: EvaluationSettings): Promise<string> {
    const combinedPrompt = `${rolePrompt}\n\n${evaluationPrompt}`;
    
    console.log('🔍 DEBUGGING API CALL:', {
      promptLength: combinedPrompt.length,
      url: `${this.apiUrl}/api/synthetic/chat`,
      promptPreview: combinedPrompt.substring(0, 200) + '...'
    });
    
    // Try synthetic chat endpoint first (better for persona-based evaluations)
    try {
      const requestBody = {
        message: combinedPrompt,
        persona: "dynamic_archetype", 
        creativity_level: 0.7
      };
      
      console.log('🔍 REQUEST BODY PREVIEW:', JSON.stringify(requestBody).substring(0, 300) + '...');
      
      const response = await fetch(`${this.apiUrl}/api/synthetic/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('🔍 RESPONSE STATUS:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS - Response data keys:', Object.keys(data));
        return data.message || data.response || data.result;
      } else {
        // Log detailed error
        const errorText = await response.text();
        console.error('❌ SYNTHETIC CHAT ERROR:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        });
      }
    } catch (error) {
      console.error('🚨 SYNTHETIC CHAT NETWORK ERROR:', error);
    }

    // Fallback to rag-creative
    try {
      const requestBody = {
        query: combinedPrompt,
        enable_creative: true,
        max_chunks: 3,
        hybrid_ratio: 10
      };
      
      console.log('🔍 TRYING RAG-CREATIVE FALLBACK:', {
        url: `${this.apiUrl}/api/rag-creative`,
        requestBodyPreview: JSON.stringify(requestBody).substring(0, 300) + '...'
      });
      
      const response = await fetch(`${this.apiUrl}/api/rag-creative`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('🔍 RAG-CREATIVE RESPONSE STATUS:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ RAG-CREATIVE SUCCESS - Response data keys:', Object.keys(data));
        return data.answer || data.response || data.result;
      } else {
        const errorText = await response.text();
        console.error('❌ RAG-CREATIVE ERROR:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        });
        throw new Error(`RAG-Creative API call failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('🚨 RAG-CREATIVE NETWORK ERROR:', error);
      throw new Error(`Both API endpoints failed: ${error.message}`);
    }
  }

  /**
   * Call LLM API with role prompt and evaluation request
   */
  private async callLLMAPI(rolePrompt: string, evaluationPrompt: string, settings: EvaluationSettings): Promise<string> {
    try {
      // For qualitative evaluations, use direct API call without RAG context
      return await this.callLLMAPIDirect(rolePrompt, evaluationPrompt, settings);
      
    } catch (error) {
      // Network or other errors - be transparent
      throw new Error(`Sistema de evaluación no disponible: ${error instanceof Error ? error.message : 'Error de conexión'}. Intente más tarde.`);
    }
  }


  /**
   * Parse LLM response into structured evaluation
   */
  private parseEvaluationResponse(llmResponse: string, conceptId: string, personaId: string): EvaluationResult {
    try {
      // Try to parse JSON response
      const parsed = JSON.parse(llmResponse);
      
      // Map to EvaluationResult structure
      const aspects: { [aspect: string]: { positives: string[]; negatives: string[]; recommendations: string[]; score?: number } } = {};
      
      if (parsed.aspects) {
        Object.entries(parsed.aspects).forEach(([key, value]: [string, any]) => {
          aspects[this.translateAspectKey(key)] = {
            positives: Array.isArray(value.positives) ? value.positives : [],
            negatives: Array.isArray(value.negatives) ? value.negatives : [],
            recommendations: Array.isArray(value.recommendations) ? value.recommendations : [],
            score: value.score || this.calculateScoreFromFeedback(value)
          };
        });
      }

      return {
        conceptId,
        personaId,
        aspects,
        overallAcceptance: this.mapAcceptance(parsed.overall_acceptance),
        quote: parsed.quote || 'Evaluación completada.',
        keyDrivers: Array.isArray(parsed.key_drivers) ? parsed.key_drivers : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
      };
      
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      
      // Fallback: create structured response from free text
      return this.createFallbackResponse(llmResponse, conceptId, personaId);
    }
  }

  /**
   * Translate aspect keys from English/Spanish
   */
  private translateAspectKey(key: string): string {
    const translations: { [key: string]: string } = {
      'nombre_y_posicionamiento': 'Nombre y Posicionamiento',
      'name_and_positioning': 'Nombre y Posicionamiento',
      'beneficios': 'Beneficios',
      'benefits': 'Beneficios',
      'precio_valor': 'Precio-Valor',
      'price_value': 'Precio-Valor'
    };
    
    return translations[key] || key;
  }

  /**
   * Map acceptance levels
   */
  private mapAcceptance(acceptance: string): 'alta' | 'media' | 'baja' {
    const lowAcceptance = ['low', 'baja', 'bajo'];
    const highAcceptance = ['high', 'alta', 'alto'];
    
    if (lowAcceptance.includes(acceptance?.toLowerCase())) return 'baja';
    if (highAcceptance.includes(acceptance?.toLowerCase())) return 'alta';
    return 'media';
  }

  /**
   * Calculate score from positive/negative feedback balance
   */
  private calculateScoreFromFeedback(feedback: any): number {
    const positives = Array.isArray(feedback.positives) ? feedback.positives.length : 0;
    const negatives = Array.isArray(feedback.negatives) ? feedback.negatives.length : 0;
    
    if (positives === 0 && negatives === 0) return 6.0;
    
    const ratio = positives / Math.max(positives + negatives, 1);
    return Math.round((ratio * 10) * 10) / 10; // Scale to 0-10, round to 1 decimal
  }

  /**
   * Create fallback response when JSON parsing fails
   */
  private createFallbackResponse(text: string, conceptId: string, personaId: string): EvaluationResult {
    return {
      conceptId,
      personaId,
      aspects: {
        'Evaluación General': {
          positives: ['Evaluación completada por LLM'],
          negatives: ['Respuesta no estructurada'],
          recommendations: ['Revisar formato de respuesta'],
          score: 6.0
        }
      },
      overallAcceptance: 'media',
      quote: text.substring(0, 200) + '...',
      keyDrivers: ['Respuesta LLM'],
      suggestions: ['Mejorar estructura de respuesta']
    };
  }
}

// ===== DEFAULT SETTINGS =====

export const DEFAULT_EVALUATION_SETTINGS: EvaluationSettings = {
  criticality: 'neutral',
  focus: 'comprehensive',
  depth: 'detailed',
  language: 'spanish'
};

// ===== EXPORT MAIN FUNCTION =====

/**
 * Main evaluation function using LLM
 */
export async function evaluateConceptWithLLM(
  concept: Concept,
  persona: SyntheticPersona,
  settings: Partial<EvaluationSettings> = {}
): Promise<EvaluationResult> {
  const engine = new LLMEvaluationEngine();
  const fullSettings = { ...DEFAULT_EVALUATION_SETTINGS, ...settings };
  
  return engine.generateEvaluation({
    concept,
    persona,
    settings: fullSettings
  });
}