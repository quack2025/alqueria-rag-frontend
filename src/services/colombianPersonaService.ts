// services/colombianPersonaService.ts - Servicio completo para personas sintéticas colombianas

import type { ColombianPersona } from '../data/colombiaPersonaSystem';
import { COLOMBIAN_ARCHETYPES } from '../data/colombiaPersonaSystem';
import { UnileverArchetype } from '../types/unileverPersona.types';
import { detectLanguage, getMultilingualInstruction } from './languageDetection';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app';

export interface ColombianPersonaMessage {
  query: string;
  archetype: UnileverArchetype;
  language?: string; // Current i18n language
  context?: {
    conversation_history?: Array<{
      user: string;
      assistant: string;
      timestamp: string;
    }>;
  };
}

export interface ColombianPersonaResponse {
  response: string;
  persona_name: string;
  archetype: string;
  mood?: string;
  confidence?: number;
  cultural_authenticity_score?: number;
  personality_consistency_score?: number;
  brand_knowledge_demonstrated?: string[];
}

// Configuración del servicio
const COLOMBIAN_PERSONA_CONFIG = {
  useAzureDirect: false,
  useBackendRAG: true // El sistema completo usa principalmente backend RAG
};

export class ColombianPersonaService {
  private static instance: ColombianPersonaService;
  
  public static getInstance(): ColombianPersonaService {
    if (!ColombianPersonaService.instance) {
      ColombianPersonaService.instance = new ColombianPersonaService();
    }
    return ColombianPersonaService.instance;
  }

  // Métodos de configuración para compatibilidad
  public static getConfig() {
    return { ...COLOMBIAN_PERSONA_CONFIG };
  }

  public static setUseBackendRAG(enabled: boolean) {
    COLOMBIAN_PERSONA_CONFIG.useBackendRAG = enabled;
    console.log('🇨🇴 Colombian Backend RAG configurado:', enabled);
  }

  public static setUseAzureDirect(enabled: boolean) {
    COLOMBIAN_PERSONA_CONFIG.useAzureDirect = enabled;
    console.log('🇨🇴 Colombian Azure Direct configurado:', enabled);
  }

  public static setAzureApiKey(apiKey: string) {
    console.log('🔑 Colombian Azure API Key configurado');
    // TODO: Implementar almacenamiento de API key
  }

  async sendMessage(message: ColombianPersonaMessage): Promise<ColombianPersonaResponse> {
    console.log('🇨🇴 ColombianPersonaService: Generando respuesta auténtica', { 
      archetype: message.archetype, 
      query: message.query.substring(0, 100) + '...' 
    });

    try {
      // Obtener persona completa
      const persona = this.getPersonaData(message.archetype);
      
      // Detect language and add multilingual instruction
      const languageDetection = detectLanguage(message.query, message.language);
      const multilingualInstruction = getMultilingualInstruction(message.query, message.language);
      
      // Generar contexto ultra-completo para el LLM
      const ultraContextualPrompt = this.generateUltraContextualPrompt(persona, message.query, multilingualInstruction);
      
      // Verificar configuración y elegir método
      if (COLOMBIAN_PERSONA_CONFIG.useBackendRAG) {
        try {
          const response = await this.callEnhancedBackend(ultraContextualPrompt, persona, message);
          console.log('✅ ColombianPersonaService: Respuesta auténtica generada por backend');
          return response;
        } catch (backendError) {
          console.error('❌ Backend LLM falló - Sistema requiere LLM real:', backendError);
          throw new Error(`No se pudo conectar con el LLM backend. Error: ${backendError.message}. El sistema requiere conexión LLM para generar respuestas auténticas.`);
        }
      } else {
        console.error('❌ Backend RAG deshabilitado - No se pueden generar respuestas sin LLM');
        throw new Error('Sistema configurado para usar solo LLM real. Backend deshabilitado.');
      }
      
    } catch (error) {
      console.error('💥 Error en ColombianPersonaService:', error);
      throw error;
    }
  }

  private getPersonaData(archetype: UnileverArchetype): ColombianPersona {
    // Mapear arquetipos simples a los complejos
    const archetypeMapping = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: 'COSTENA_EMPRENDEDORA',
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: 'BOGOTANA_PROFESIONAL',
      [UnileverArchetype.PAISA_TRADICIONAL]: 'PAISA_TRADICIONAL',
      [UnileverArchetype.MADRE_MODERNA]: 'MADRE_MODERNA',
      // Fallbacks para arquetipos no completados aún
      [UnileverArchetype.CALENA_MODERNA]: 'BOGOTANA_PROFESIONAL',
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: 'PAISA_TRADICIONAL',
      [UnileverArchetype.HOMBRE_MODERNO]: 'PAISA_TRADICIONAL'
    };

    const complexArchetype = archetypeMapping[archetype] || 'MADRE_MODERNA';
    const persona = COLOMBIAN_ARCHETYPES[complexArchetype];
    
    if (!persona) {
      throw new Error(`Persona no encontrada para arquetipo: ${archetype}`);
    }
    
    return persona;
  }

  private generateUltraContextualPrompt(persona: ColombianPersona, query: string, multilingualInstruction?: string): string {
    return `
${multilingualInstruction || ''}

IDENTITY ULTRA-DETALLADA - COLOMBIA:
Eres ${persona.name}, ${persona.age} años, de ${persona.location.city}, ${persona.location.department}, Colombia.

=== PERFIL SOCIOECONÓMICO ===
- NSE: ${persona.socioeconomics.nse_level}, Ingreso: $${persona.socioeconomics.monthly_income.toLocaleString()} COP mensuales
- Ocupación: ${persona.socioeconomics.occupation}
- Educación: ${persona.socioeconomics.education_level}
- Estrato: ${persona.location.neighborhood_type}

=== CONTEXTO FAMILIAR ===
- Estado civil: ${persona.family.marital_status}
- Hijos: ${persona.family.has_children ? `Sí, edades: ${persona.family.children_ages.join(', ')} años` : 'No'}
- Composición hogar: ${persona.family.household_composition}
- Rol familiar: ${persona.family.family_role}

=== PERSONALIDAD (ESCALA 1-10) ===
- Apertura: ${persona.personality.openness}/10
- Responsabilidad: ${persona.personality.conscientiousness}/10
- Extroversión: ${persona.personality.extraversion}/10
- Amabilidad: ${persona.personality.agreeableness}/10
- Valores tradicionales: ${persona.personality.traditional_values}/10
- Lealtad a marcas: ${persona.personality.brand_loyalty}/10
- Sensibilidad precio: ${persona.personality.price_sensitivity}/10

=== COMPORTAMIENTO FMCG ===
- Presupuesto mensual FMCG: $${persona.fmcg_behavior.monthly_fmcg_budget.toLocaleString()} COP
- Frecuencia compras: ${persona.fmcg_behavior.shopping_frequency}
- Canal principal: ${persona.fmcg_behavior.primary_shopping_channel}
- Tendencia cambio marca: ${persona.fmcg_behavior.brand_switching_tendency}
- Sensibilidad promociones: ${persona.fmcg_behavior.promotion_sensitivity}/10

=== RELACIÓN CON MARCAS UNILEVER ===

DOVE:
- Conocimiento: ${persona.unilever_brands.dove.awareness}/10
- Uso: ${persona.unilever_brands.dove.usage}
- Percepción: ${persona.unilever_brands.dove.perception.join(', ')}
- Precio: ${persona.unilever_brands.dove.price_perception}
- Confianza: ${persona.unilever_brands.dove.trust_level}/10
- Productos específicos: ${persona.unilever_brands.dove.specific_products_used.join(', ')}
- Barreras: ${persona.unilever_brands.dove.barriers.join(', ')}

FRUCO:
- Conocimiento: ${persona.unilever_brands.fruco.awareness}/10
- Uso: ${persona.unilever_brands.fruco.usage}
- Percepción: ${persona.unilever_brands.fruco.perception.join(', ')}
- vs Casero: ${persona.unilever_brands.fruco.vs_homemade_preference}/10
- Asociación tradición: ${persona.unilever_brands.fruco.tradition_association}/10
- Ocasiones uso: ${persona.unilever_brands.fruco.usage_occasions.join(', ')}
- Barreras: ${persona.unilever_brands.fruco.barriers.join(', ')}

OMO:
- Conocimiento: ${persona.unilever_brands.omo.awareness}/10
- Uso: ${persona.unilever_brands.omo.usage}
- Percepción: ${persona.unilever_brands.omo.perception.join(', ')}
- Efectividad: ${persona.unilever_brands.omo.effectiveness_rating}/10
- vs Competencia: ${persona.unilever_brands.omo.vs_competition}
- Usos específicos: ${persona.unilever_brands.omo.specific_uses.join(', ')}
- Barreras: ${persona.unilever_brands.omo.barriers.join(', ')}

SUAVE:
- Conocimiento: ${persona.unilever_brands.suave.awareness}/10
- Uso: ${persona.unilever_brands.suave.usage}
- Percepción: ${persona.unilever_brands.suave.perception.join(', ')}
- Precio: ${persona.unilever_brands.suave.price_perception}
- Necesidades cabello: ${persona.unilever_brands.suave.hair_specific_needs.join(', ')}
- Barreras: ${persona.unilever_brands.suave.barriers.join(', ')}

CIF:
- Conocimiento: ${persona.unilever_brands.cif.awareness}/10
- Uso: ${persona.unilever_brands.cif.usage}
- Percepción: ${persona.unilever_brands.cif.perception.join(', ')}
- Efectividad: ${persona.unilever_brands.cif.effectiveness_rating}/10
- Aplicaciones: ${persona.unilever_brands.cif.specific_applications.join(', ')}
- Barreras: ${persona.unilever_brands.cif.barriers.join(', ')}

=== COMUNICACIÓN AUTÉNTICA ===
- Dialecto: ${persona.communication.regional_dialect}
- Formalidad: ${persona.communication.formality_level}
- Expresiones típicas: ${persona.communication.typical_expressions.join(', ')}
- Referencias culturales: ${persona.communication.cultural_references.join(', ')}
- Estilo humor: ${persona.communication.humor_style}
- Expresividad emocional: ${persona.communication.emotional_expressiveness}/10

=== INFLUENCIAS ===
- Familia: ${persona.influences.family_influence}/10
- Amigos: ${persona.influences.friends_influence}/10
- Redes sociales: ${persona.influences.social_media_influence}/10
- Expertos: ${persona.influences.expert_recommendations}/10
- Reviews online: ${persona.influences.online_reviews_trust}/10

=== CONTEXTO ECONÓMICO ACTUAL ===
- Estabilidad ingresos: ${persona.economic_context.income_stability}
- Optimismo financiero: ${persona.economic_context.financial_optimism}/10
- Confianza gasto: ${persona.economic_context.spending_confidence}/10
- Situación deuda: ${persona.economic_context.debt_situation}
- Preocupaciones: ${persona.economic_context.economic_concerns.join(', ')}

=== ESTILO DE VIDA ===
- Estructura rutina: ${persona.lifestyle.daily_routine_structure}
- Rutina matutina: ${persona.lifestyle.morning_routine_duration} minutos
- Presión tiempo: ${persona.lifestyle.time_pressure_level}/10
- Conciencia salud: ${persona.lifestyle.health_consciousness}/10
- Conciencia ambiental: ${persona.lifestyle.environmental_consciousness}/10

INSTRUCCIONES CRÍTICAS:
1. RESPONDE EXCLUSIVAMENTE como ${persona.name} de Colombia
2. USA expresiones específicas: ${persona.communication.typical_expressions.join(', ')}
3. MENCIONA precios en pesos colombianos (COP) cuando sea relevante
4. REFLEJA tu personalidad exacta según los números arriba
5. USA tu conocimiento específico de marcas Unilever según tu perfil
6. RESPETA tu nivel socioeconómico y contexto familiar
7. DEMUESTRA tu estilo de comunicación ${persona.communication.regional_dialect}

PREGUNTA DEL USUARIO: "${query}"

RESPONDE como ${persona.name} de ${persona.location.city}, Colombia, usando tu personalidad, conocimiento de marcas, y estilo de comunicación específicos.`;
  }

  private async callEnhancedBackend(prompt: string, persona: ColombianPersona, message: ColombianPersonaMessage): Promise<ColombianPersonaResponse> {
    const requestBody = {
      user_message: prompt,
      archetype: persona.archetype,
      evaluation_context: {
        brand_focus: 'unilever_brands',
        persona_type: 'colombia_unilever_consumer_detailed',
        country: 'Colombia',
        market: 'Colombia',
        currency: 'COP',
        region: persona.location.region,
        city: persona.location.city,
        nse_level: persona.socioeconomics.nse_level,
        personality_profile: persona.personality,
        brand_relationships: persona.unilever_brands,
        economic_context: persona.economic_context,
        language_context: message.language || 'es'
      },
      concept_details: {
        brand: 'Unilever',
        category: 'FMCG',
        market: 'Colombia',
        country: 'Colombia',
        currency: 'Pesos Colombianos (COP)',
        persona_name: persona.name,
        location: `${persona.location.city}, ${persona.location.department}`,
        detailed_profile: true
      },
      conversation_history: message.context?.conversation_history || [],
      creativity_level: 85, // Más creatividad para respuestas auténticas
      language: 'spanish',
      cultural_context: 'colombia_detailed'
    };

    console.log('📡 Enviando perfil completo al backend:', {
      endpoint: `${API_BASE_URL}/api/synthetic/chat`,
      persona: persona.name,
      archetype: persona.archetype,
      city: persona.location.city,
      nse: persona.socioeconomics.nse_level
    });

    const response = await fetch(`${API_BASE_URL}/api/synthetic/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    return {
      response: data.response || 'Respuesta no válida',
      persona_name: persona.name,
      archetype: message.archetype,
      confidence: data.confidence || 0.9,
      mood: this.determineMood(persona, message.query),
      cultural_authenticity_score: this.calculateCulturalAuthenticity(data.response, persona),
      personality_consistency_score: this.calculatePersonalityConsistency(data.response, persona),
      brand_knowledge_demonstrated: this.extractBrandKnowledge(data.response)
    };
  }

  private generateAdvancedLocalResponse(persona: ColombianPersona, query: string, multilingualInstruction?: string): Promise<ColombianPersonaResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Detectar idioma del query
        const languageDetection = detectLanguage(query);
        const language = languageDetection.responseLanguage || 'es';
        
        const response = this.generateContextualResponseAdvanced(query, persona, language);
        resolve({
          response,
          persona_name: persona.name,
          archetype: persona.archetype,
          confidence: 0.8,
          mood: this.determineMood(persona, query),
          cultural_authenticity_score: 0.85,
          personality_consistency_score: 0.9,
          brand_knowledge_demonstrated: this.extractBrandKnowledge(response)
        });
      }, 1800 + Math.random() * 800); // Simular tiempo de pensamiento
    });
  }

  private generateContextualResponseAdvanced(query: string, persona: ColombianPersona, language: string = 'es'): string {
    const lowerQuery = query.toLowerCase();
    
    // Generar respuesta basada en contexto completo
    let baseResponse = '';
    let brandMentioned = '';
    
    // Detectar marca específica
    if (lowerQuery.includes('dove')) {
      baseResponse = this.generateDoveResponseAdvanced(persona);
      brandMentioned = 'Dove';
    } else if (lowerQuery.includes('fruco')) {
      baseResponse = this.generateFrucoResponseAdvanced(persona);
      brandMentioned = 'Fruco';
    } else if (lowerQuery.includes('omo')) {
      baseResponse = this.generateOMOResponseAdvanced(persona);
      brandMentioned = 'OMO';
    } else if (lowerQuery.includes('suave')) {
      baseResponse = this.generateSuaveResponseAdvanced(persona);
      brandMentioned = 'Suave';
    } else if (lowerQuery.includes('cif')) {
      baseResponse = this.generateCifResponseAdvanced(persona);
      brandMentioned = 'Cif';
    } else {
      baseResponse = this.generateGeneralResponseAdvanced(persona, query);
    }
    
    // Agregar toque personal basado en personalidad
    let finalResponse = this.addPersonalityTouch(baseResponse, persona, brandMentioned);
    
    // Traducir respuesta si no es español
    if (language !== 'es') {
      finalResponse = this.translateResponse(finalResponse, language, persona);
    }
    
    return finalResponse;
  }

  private generateDoveResponseAdvanced(persona: ColombianPersona): string {
    const dove = persona.unilever_brands.dove;
    const expressions = persona.communication.typical_expressions;
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    
    if (dove.usage === 'exclusiva' || dove.usage === 'regular') {
      return `${randomExpression} Mire, Dove para mí es... ${dove.perception.join(' y ')}. Yo lo uso ${dove.specific_products_used.join(', ')} porque ${dove.trust_level >= 8 ? 'confío plenamente' : 'me parece bueno'}. ${dove.price_perception === 'caro' ? 'Sí, no es barato' : 'El precio me parece justo'}, pero ${dove.barriers.length > 0 ? dove.barriers[0] : 'vale la pena la inversión'}.`;
    } else {
      return `Pues Dove... lo conozco, ${dove.perception.join(', ')}, pero ${dove.barriers.join(' y ')}. ${randomExpression}`;
    }
  }

  private generateFrucoResponseAdvanced(persona: ColombianPersona): string {
    const fruco = persona.unilever_brands.fruco;
    const expressions = persona.communication.typical_expressions;
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    
    if (fruco.tradition_association >= 8) {
      return `¡Ay, Fruco! ${randomExpression} Esa es ${fruco.perception.join(', ')}, ${fruco.usage_occasions.join(', ')}. ${fruco.vs_homemade_preference >= 6 ? 'Aunque a veces hago casera' : 'Prefiero la casera, pero'} cuando no hay tiempo, Fruco siempre está ahí.`;
    } else {
      return `Fruco... ${fruco.perception.join(', ')}, pero ${fruco.barriers.join(' y ')}. ${randomExpression}`;
    }
  }

  private generateOMOResponseAdvanced(persona: ColombianPersona): string {
    const omo = persona.unilever_brands.omo;
    const expressions = persona.communication.typical_expressions;
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    
    if (omo.effectiveness_rating >= 8) {
      return `OMO, ${randomExpression} ${omo.perception.join(' y ')}. Lo uso para ${omo.specific_uses.join(', ')} porque ${omo.vs_competition}. ${omo.effectiveness_rating}/10 en efectividad, se lo recomiendo.`;
    } else {
      return `OMO es ${omo.perception.join(', ')}, pero ${omo.barriers.join(' y ')}. ${randomExpression}`;
    }
  }

  private generateSuaveResponseAdvanced(persona: ColombianPersona): string {
    const suave = persona.unilever_brands.suave;
    const expressions = persona.communication.typical_expressions;
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    
    return `Suave ${suave.perception.join(', ')}, ${randomExpression} Para ${suave.hair_specific_needs.join(' y ')}, ${suave.price_perception === 'justo' ? 'el precio está bien' : 'está económico'}. ${suave.barriers.length > 0 ? 'Aunque ' + suave.barriers[0] : 'Me funciona bien'}.`;
  }

  private generateCifResponseAdvanced(persona: ColombianPersona): string {
    const cif = persona.unilever_brands.cif;
    const expressions = persona.communication.typical_expressions;
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    
    return `Cif es ${cif.perception.join(' y ')}, ${randomExpression} Para ${cif.specific_applications.join(', ')} es efectivo ${cif.effectiveness_rating}/10. ${cif.barriers.length > 0 ? 'Eso sí, ' + cif.barriers.join(' y ') : 'Lo recomiendo'}.`;
  }

  private generateGeneralResponseAdvanced(persona: ColombianPersona, query: string): string {
    const expressions = persona.communication.typical_expressions;
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    
    // Respuesta contextual basada en personalidad y situación
    let response = `${randomExpression} `;
    
    if (persona.personality.extraversion >= 7) {
      response += "¡Con mucho gusto le cuento! ";
    } else {
      response += "Bueno, pues le explico... ";
    }
    
    // Agregar contexto económico si es relevante
    if (query.toLowerCase().includes('precio') || query.toLowerCase().includes('caro')) {
      response += `Con mi presupuesto de $${persona.fmcg_behavior.monthly_fmcg_budget.toLocaleString()} pesos al mes para productos del hogar, `;
    }
    
    // Agregar contexto familiar si es relevante
    if (persona.family.has_children && (query.toLowerCase().includes('familia') || query.toLowerCase().includes('niños'))) {
      response += `Con mis ${persona.family.children_ages.length} ${persona.family.children_ages.length === 1 ? 'hijo' : 'hijos'}, `;
    }
    
    return response + "siempre busco lo mejor para mi hogar y familia.";
  }

  private addPersonalityTouch(response: string, persona: ColombianPersona, brand: string): string {
    // Agregar detalles según personalidad
    if (persona.personality.conscientiousness >= 8) {
      response += " Siempre me fijo bien en todo antes de comprar.";
    }
    
    if (persona.personality.price_sensitivity >= 7) {
      response += ` Eso sí, con $${persona.socioeconomics.monthly_income.toLocaleString()} pesos de ingreso, uno tiene que ser cuidadoso con el dinero.`;
    }
    
    if (persona.location.region === 'costa_caribe' && Math.random() > 0.5) {
      response += " Aquí en la costa sabemos lo que está bueno.";
    }
    
    return response;
  }

  private determineMood(persona: ColombianPersona, query: string): string {
    if (persona.personality.extraversion >= 7) return 'alegre';
    if (persona.personality.neuroticism >= 7) return 'preocupada';
    if (query.toLowerCase().includes('problema')) return 'comprensiva';
    return 'amigable';
  }

  private calculateCulturalAuthenticity(response: string, persona: ColombianPersona): number {
    let score = 0.5; // Base
    
    // Check for regional expressions
    persona.communication.typical_expressions.forEach(expr => {
      if (response.toLowerCase().includes(expr.toLowerCase())) score += 0.1;
    });
    
    // Check for Colombian peso references
    if (response.includes('peso') || response.includes('COP')) score += 0.1;
    
    // Check for Colombian cultural references
    if (response.includes('Colombia') || response.includes(persona.location.city)) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private calculatePersonalityConsistency(response: string, persona: ColombianPersona): number {
    let score = 0.7; // Base
    
    // Check personality traits reflection
    if (persona.personality.extraversion >= 7 && 
        (response.includes('¡') || response.includes('me encanta') || response.includes('súper'))) {
      score += 0.1;
    }
    
    if (persona.personality.conscientiousness >= 8 && 
        (response.includes('siempre') || response.includes('cuidadoso') || response.includes('fijo'))) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  }

  private extractBrandKnowledge(response: string): string[] {
    const brands = ['Dove', 'Fruco', 'OMO', 'Suave', 'Cif'];
    return brands.filter(brand => response.toLowerCase().includes(brand.toLowerCase()));
  }

  private translateResponse(response: string, language: string, persona: ColombianPersona): string {
    if (language === 'en') {
      return this.translateToEnglish(response, persona);
    } else if (language === 'fr') {
      return this.translateToFrench(response, persona);
    }
    return response; // fallback to original Spanish
  }

  private translateToEnglish(response: string, persona: ColombianPersona): string {
    // Simple pattern-based translation maintaining Colombian context
    let translated = response;
    
    // Colombian expressions to English equivalents
    const expressions = {
      'Ay, qué belleza': 'Oh, how wonderful',
      'Eso está buenísimo': 'That\'s really great',
      'Mi amor': 'my dear',
      'Mi niña': 'my girl',
      'Pues': 'Well',
      'Mire': 'Look',
      'Súper': 'Super',
      'Bacano': 'Cool',
      '¡Ave María!': 'My goodness!',
      'sí está bueno': 'it\'s really good',
      'Para mi familia': 'For my family'
    };

    for (const [spanish, english] of Object.entries(expressions)) {
      translated = translated.replace(new RegExp(spanish, 'gi'), english);
    }

    // Brand-specific terms
    translated = translated.replace(/lo uso/gi, 'I use it');
    translated = translated.replace(/me gusta/gi, 'I like it');
    translated = translated.replace(/confío/gi, 'I trust');
    translated = translated.replace(/precio/gi, 'price');
    translated = translated.replace(/marca/gi, 'brand');
    
    // Add English introduction maintaining persona
    if (!translated.includes('Hello') && !translated.includes('Hi')) {
      translated = `Hello, I'm ${persona.name}, ${persona.age} years old from ${persona.location.city}, Colombia. ${translated}`;
    }

    return translated;
  }

  private translateToFrench(response: string, persona: ColombianPersona): string {
    // Simple pattern-based translation maintaining Colombian context
    let translated = response;
    
    // Colombian expressions to French equivalents
    const expressions = {
      'Ay, qué belleza': 'Oh, comme c\'est beau',
      'Eso está buenísimo': 'C\'est vraiment excellent',
      'Mi amor': 'mon amour',
      'Mi niña': 'ma petite',
      'Pues': 'Eh bien',
      'Mire': 'Regardez',
      'Súper': 'Super',
      'Bacano': 'Cool',
      '¡Ave María!': 'Mon Dieu!',
      'sí está bueno': 'c\'est vraiment bon',
      'Para mi familia': 'Pour ma famille'
    };

    for (const [spanish, french] of Object.entries(expressions)) {
      translated = translated.replace(new RegExp(spanish, 'gi'), french);
    }

    // Brand-specific terms
    translated = translated.replace(/lo uso/gi, 'je l\'utilise');
    translated = translated.replace(/me gusta/gi, 'j\'aime');
    translated = translated.replace(/confío/gi, 'je fais confiance');
    translated = translated.replace(/precio/gi, 'prix');
    translated = translated.replace(/marca/gi, 'marque');
    
    // Add French introduction maintaining persona
    if (!translated.includes('Bonjour') && !translated.includes('Salut')) {
      translated = `Bonjour, je suis ${persona.name}, ${persona.age} ans de ${persona.location.city}, Colombie. ${translated}`;
    }

    return translated;
  }
}

export default ColombianPersonaService;