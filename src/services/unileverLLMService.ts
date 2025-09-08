// services/unileverLLMService.ts - Servicio mejorado para chat con LLM usando perfiles Unilever

import { EnhancedUnileverPersona, PersonaMoodState, TemporalContext, Interaction, ConsistencyWarning } from '../types/unileverPersona.types';
import { validatePersonaConsistency } from '../utils/personaValidation';

interface UnileverLLMRequest {
  userMessage: string;
  persona: EnhancedUnileverPersona;
  productContext?: {
    brand?: string;
    product?: string;
    campaign?: string;
  };
  conversationHistory: any[];
  systemPrompt?: string;
  context?: {
    moodState?: PersonaMoodState;
    temporalContext?: TemporalContext;
    recentInteractions?: Interaction[];
  };
}

interface UnileverLLMResponse {
  response: string;
  success: boolean;
  error?: string;
}

class UnileverLLMService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app';
  }

  /**
   * Genera una respuesta dinámica usando el LLM con el contexto de la persona
   */
  async generatePersonaResponse({
    userMessage,
    persona,
    productContext,
    conversationHistory
  }: UnileverLLMRequest): Promise<UnileverLLMResponse> {
    
    try {
      // Construir el system prompt con el contexto completo de la persona
      const systemPrompt = this.buildPersonaSystemPrompt(persona, productContext);
      
      const response = await fetch(`${this.baseUrl}/api/rag-creative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage,
          system_prompt: systemPrompt,
          conversation_history: conversationHistory,
          metadata_filter: {
            persona_id: persona.id,
            region: persona.location.region,
            nse: persona.demographics.nse_level
          },
          output_types: ['text'],
          temperature: 0.8, // Alta creatividad para respuestas más naturales
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        response: data.answer || data.response || data.text || '',
        success: true
      };

    } catch (error) {
      console.error('Error en Unilever LLM Service:', error);
      
      // Si falla el LLM, intentar con el endpoint alternativo
      return this.fallbackToRAGPure(userMessage, persona, conversationHistory);
    }
  }

  /**
   * Construye un system prompt detallado basado en la persona mejorada
   */
  private buildEnhancedPersonaPrompt(
    persona: EnhancedUnileverPersona, 
    context?: {
      moodState?: PersonaMoodState;
      temporalContext?: TemporalContext;
      recentInteractions?: Interaction[];
    }
  ): string {
    
    // Validar consistencia
    const warnings = validatePersonaConsistency(persona);
    if (warnings.length > 0) {
      console.warn('Persona consistency warnings:', warnings);
    }
    
    let prompt = `Eres ${persona.name}, ${persona.demographics.occupation} de ${persona.demographics.age} años en ${persona.location.city}.

CONTEXTO PERSONAL:
${persona.background_story}

${context?.moodState ? this.addMoodContext(persona, context.moodState) : ''}

COMPORTAMIENTO DE COMPRA:
- Compras ${persona.consumer_behavior.shopping_distribution.tiendas_barrio}% en tiendas de barrio, ${persona.consumer_behavior.shopping_distribution.supermercados}% en supermercados
- Sensibilidad al precio: ${persona.consumer_behavior.price_sensitivity}
- Investigas productos: ${persona.consumer_behavior.decision_drivers.research_behavior}
- Triggers de compra: ${persona.consumer_behavior.purchase_triggers?.join(', ') || 'promociones, necesidad, recomendaciones'}

CUIDADO PERSONAL:
- Tipo de cabello: ${persona.consumer_behavior.personal_care.hair_type} con preocupaciones por ${persona.consumer_behavior.personal_care.hair_concerns.join(', ')}
- Nivel de vanidad: ${persona.consumer_behavior.personal_care.vanity_level}
- Rutina de belleza: ${persona.consumer_behavior.personal_care.routine_complexity}
- Tiempo dedicado: ${persona.consumer_behavior.personal_care.time_for_beauty}

LIMPIEZA DEL HOGAR:
- Estándares de limpieza: ${persona.consumer_behavior.category_behavior.home_care.cleaning_standards}
- Marca principal detergente: ${persona.consumer_behavior.brand_usage.detergentes.marca_principal}
- Prioridad anti-manchas: ${persona.consumer_behavior.category_behavior.home_care.stain_fighting_priority}

COCINA Y ALIMENTOS:
- Cocinas: ${persona.consumer_behavior.category_behavior.food_behavior.cooking_frequency}
- Nivel culinario: ${persona.consumer_behavior.category_behavior.food_behavior.cooking_skill}
- Marca principal condimentos: ${persona.consumer_behavior.brand_usage.condimentos.marca_principal}

${context?.recentInteractions ? this.formatRecentInteractions(context.recentInteractions) : ''}

INSTRUCCIONES:
1. Responde como ${persona.name} en primera persona
2. Integra tu perfil completo, estado anímico y experiencias al evaluar
3. Sé auténtica pero natural - no exageres expresiones regionales
4. Enfócate en contenido basado en TU experiencia específica
5. No uses gestos descriptivos como "se rasca la cabeza"
6. Menciona marcas según TU historial real de uso
7. Refleja tu NSE (${persona.demographics.nse_level}) en decisiones y prioridades
8. Expresa dudas o contradicciones internas cuando sea natural
9. Si no tienes experiencia con algo, admítelo honestamente

Eres ${persona.name} - una persona real con experiencias, contradicciones y opiniones formadas por tu vida específica.`;

    // Añadir contexto temporal si existe
    if (context?.temporalContext) {
      prompt = this.addTemporalContext(prompt, context.temporalContext.current_date);
    }
    
    return prompt;
  }
  
  /**
   * Construye un system prompt detallado basado en la persona (versión legacy)
   */
  private buildPersonaSystemPrompt(persona: EnhancedUnileverPersona, productContext?: any): string {
    // Usar el nuevo prompt mejorado si tiene las propiedades necesarias
    if (persona.consumer_behavior.shopping_distribution && persona.consumer_behavior.personal_care) {
      return this.buildEnhancedPersonaPrompt(persona);
    }
    
    // Fallback al prompt original para compatibilidad
    return `Eres ${persona.name}, una persona real de ${persona.location.city}, ${persona.location.region}, Colombia.

PERFIL DETALLADO:
- Edad: ${persona.demographics.age} años
- Género: ${persona.demographics.gender === 'female' ? 'Mujer' : persona.demographics.gender === 'male' ? 'Hombre' : 'Persona'}
- Ocupación: ${persona.demographics.occupation}
- Nivel socioeconómico: ${persona.demographics.nse_level}
- Estado civil: ${persona.demographics.marital_status}
- Hijos: ${persona.demographics.children_count}
- Vive en: ${persona.demographics.housing_type} en ${persona.location.neighborhood || persona.location.city}

CONTEXTO DE VIDA:
${persona.background_story}

INSTRUCCIONES DE RESPUESTA:
1. Responde SIEMPRE en primera persona como ${persona.name}
2. Usa expresiones naturales y coloquiales de ${persona.location.region}, Colombia
3. Refleja tu nivel educativo (${persona.demographics.education_level}) y socioeconómico (${persona.demographics.nse_level})
4. Muestra tu personalidad basada en tu historia de vida y contexto
5. Si eres escéptica sobre algo, exprésalo naturalmente según tu perfil
6. Si algo te emociona, muéstralo de acuerdo a tu personalidad
7. Menciona experiencias personales relevantes cuando sea apropiado
8. Usa modismos y expresiones colombianas, especialmente de ${persona.location.region}
9. NO uses frases genéricas o roboticas, sé completamente humana y auténtica
10. Tu nivel de formalidad debe ser: ${persona.conversation_style.formality_level}

Recuerda: No eres un asistente virtual, eres ${persona.name}, una persona real con opiniones, dudas, preferencias y experiencias propias.`;
  }

  // Métodos auxiliares para contexto avanzado
  private addMoodContext(persona: EnhancedUnileverPersona, mood: PersonaMoodState): string {
    return `\nESTADO ACTUAL:\n- Te sientes: ${mood.current_mood}\n- Nivel de energía: ${mood.energy_level}\n- Presión de tiempo: ${mood.time_pressure}\n${mood.recent_life_events.length > 0 ? `- Eventos recientes: ${mood.recent_life_events.join(', ')}` : ''}`;
  }
  
  private addTemporalContext(prompt: string, currentDate: Date): string {
    const month = currentDate.toLocaleDateString('es-CO', { month: 'long' });
    return prompt + `\n\nCONTEXTO TEMPORAL:\n- Estamos en ${month}\n- Considera la época del año en tus respuestas`;
  }
  
  private formatRecentInteractions(interactions: Interaction[]): string {
    if (interactions.length === 0) return '';
    
    const recent = interactions.slice(-3); // Últimas 3 interacciones
    return `\nINTERACCIONES RECIENTES:\n${recent.map(i => 
      `- ${i.topic} (${i.sentiment}): ${i.key_insights.join(', ')}`
    ).join('\n')}`;
  }
  
  /**
   * Validar consistencia de la persona antes de generar respuesta
   */
  validatePersonaConsistency(persona: EnhancedUnileverPersona): ConsistencyWarning[] {
    return validatePersonaConsistency(persona);
  }
  
  /**
   * Fallback al endpoint RAG puro si falla el creativo
   */
  private async fallbackToRAGPure(
    userMessage: string, 
    persona: EnhancedUnileverPersona,
    conversationHistory: any[]
  ): Promise<UnileverLLMResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/rag-pure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage,
          metadata_filter: {
            region: persona.location.region
          },
          output_types: ['text']
        })
      });

      if (!response.ok) {
        throw new Error(`Error en fallback: ${response.status}`);
      }

      const data = await response.json();
      
      // Personalizar mínimamente la respuesta con el nombre de la persona
      const personalizedResponse = `Como ${persona.name}, te puedo decir que ${data.answer || data.response || data.text || 'no tengo información sobre eso'}`;
      
      return {
        response: personalizedResponse,
        success: true
      };
      
    } catch (error) {
      return {
        response: '',
        success: false,
        error: 'No se pudo conectar con el servicio'
      };
    }
  }

  /**
   * Verifica la salud del backend
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Genera preguntas sugeridas basadas en el perfil mejorado de la persona
   */
  async generateEnhancedSuggestedQuestions(persona: EnhancedUnileverPersona): Promise<string[]> {
    const suggestions = [];
    
    // Preguntas basadas en canales de compra
    const topChannel = Object.entries(persona.consumer_behavior.shopping_distribution)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topChannel) {
      const [channel, percentage] = topChannel;
      if (channel === 'tiendas_barrio' && percentage > 50) {
        suggestions.push('¿Qué es lo que más te gusta de comprar en la tienda del barrio?');
      } else if (channel === 'supermercados' && percentage > 40) {
        suggestions.push('¿Cómo decides entre un supermercado y otro?');
      }
    }
    
    // Preguntas basadas en cuidado personal
    const hairType = persona.consumer_behavior.personal_care.hair_type;
    if (hairType !== 'normal') {
      suggestions.push(`¿Qué productos específicos usas para tu cabello ${hairType}?`);
    }
    
    if (persona.consumer_behavior.personal_care.vanity_level === 'muy_alta') {
      suggestions.push('¿Cuánto tiempo dedicas diariamente a tu rutina de belleza?');
    }
    
    // Preguntas basadas en marcas
    const detergentBrand = persona.consumer_behavior.brand_usage.detergentes.marca_principal;
    if (detergentBrand) {
      suggestions.push(`¿Por qué elegiste ${detergentBrand} como tu detergente principal?`);
      if (detergentBrand === 'OMO') {
        suggestions.push('¿Qué diferencias notas entre OMO y otros detergentes?');
      }
    }
    
    // Preguntas basadas en presupuesto
    const budget = persona.consumer_behavior.monthly_fmcg_budget;
    if (budget < 100000) {
      suggestions.push('¿Cómo haces para que te rinda el presupuesto de productos del hogar?');
    } else if (budget > 200000) {
      suggestions.push('¿En qué productos prefieres invertir más dinero y por qué?');
    }
    
    return suggestions.slice(0, 6);
  }
  
  /**
   * Genera preguntas sugeridas basadas en el perfil de la persona (versión legacy)
   */
  async generateSuggestedQuestions(persona: EnhancedUnileverPersona): Promise<string[]> {
    const suggestions = [];
    
    // Preguntas generales de productos de consumo masivo
    const generalQuestions = [
      '¿Qué marcas de productos de aseo compras normalmente?',
      '¿Cuál es tu rutina de cuidado personal diaria?',
      '¿Dónde prefieres hacer tus compras del hogar?',
      '¿Qué es lo más importante para ti al elegir un producto?'
    ];
    
    // Usar preguntas mejoradas si tiene la estructura nueva
    if (persona.consumer_behavior.brand_usage) {
      return this.generateEnhancedSuggestedQuestions(persona);
    }
    
    // Fallback a preguntas básicas para compatibilidad
    const basicQuestions = [
      '¿Qué marcas de productos de aseo compras normalmente?',
      '¿Cuál es tu rutina de cuidado personal diaria?',
      '¿Dónde prefieres hacer tus compras del hogar?',
      '¿Qué es lo más importante para ti al elegir un producto?'
    ];
    
    suggestions.push(...basicQuestions);
    
    // Sugerencias basadas en el perfil demográfico
    if (persona.demographics.children_count > 0) {
      suggestions.push(`¿Qué productos buscas especialmente para el cuidado de tus hijos?`);
      suggestions.push(`¿Cómo decides qué productos son seguros para los niños?`);
    }
    
    // Sugerencias basadas en sensibilidad al precio
    if (persona.consumer_behavior.price_sensitivity === 'alta' || persona.consumer_behavior.price_sensitivity === 'muy_alta') {
      suggestions.push(`¿Cómo haces para que te rindan los productos de aseo?`);
      suggestions.push(`¿Qué estrategias usas para ahorrar en las compras?`);
    } else {
      suggestions.push(`¿Prefieres pagar más por mejor calidad o buscas precio?`);
    }
    
    // Sugerencias basadas en el arquetipo específico
    switch (persona.archetype) {
      case 'MADRE_MODERNA':
        suggestions.push(`¿Qué ingredientes evitas en los productos familiares?`);
        break;
      case 'PROFESIONAL_BEAUTY':
        suggestions.push(`¿Qué resultados buscas en tus productos de belleza?`);
        break;
      case 'AMA_CASA_TRADICIONAL':
        suggestions.push(`¿Cuáles son tus productos imprescindibles para el hogar?`);
        break;
      case 'MILLENNIALS_CONSCIENTE':
        suggestions.push(`¿Qué tan importante es que los productos sean sustentables?`);
        break;
      case 'HOMBRE_MODERNO':
        suggestions.push(`¿Qué buscas en productos específicos para hombres?`);
        break;
    }
    
    // Mezclar preguntas generales con específicas
    const allSuggestions = [...suggestions, ...generalQuestions];
    
    // Retornar una selección aleatoria de 4-6 preguntas
    const shuffled = allSuggestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(6, shuffled.length));
  }
}

export const unileverLLMService = new UnileverLLMService();
export type { UnileverLLMRequest, UnileverLLMResponse };

// Funciones de utilidad exportadas
export { validatePersonaConsistency } from '../utils/personaValidation';