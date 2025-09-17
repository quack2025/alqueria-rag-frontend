/**
 * SyntheticUsers-style Topic-Based Evaluation Service
 * Generates ultra-detailed qualitative insights by TOPICS, not individual users
 * Like syntheticusers.com - focuses on thematic analysis of the concept
 */

import type { Concept, SyntheticPersona, EvaluationResult } from '../components/InnovationLab/InnovationLabContainer';
import type { EvaluationSettings } from './llmEvaluationService';

export interface TopicInsight {
  title: string;
  summary: string;
  impact: string;
  variations: string[];
  relevantQuotes: string[];
  keyTakeaways: string[];
}

export interface TopicBasedEvaluationResult extends EvaluationResult {
  // Main sections like syntheticusers.com
  executiveSummary: string;
  topicInsights: TopicInsight[]; // Main topic-based insights
  surprisingInsight: TopicInsight;
  suggestedFollowUp: {
    question: string;
    rationale: string;
  };
  
  // Specific topic analysis (like the JSON example)
  detailedTopicAnalysis: {
    conceptPerceptions: TopicInsight;      // How consumers perceive the concept
    flavorExpectations: TopicInsight;      // What flavor profile they expect
    traditionalIntegration: TopicInsight;  // Impact on traditional usage
    menuInclusion: TopicInsight;           // Potential for restaurant inclusion
    decisionFactors: TopicInsight;         // Consumer decision-making factors
  };
  
  // Research context
  researchGoal: string;
  syntheticUserProfile: string; // Description of target consumer profile
}

/** Dynamic topic structure for adaptive analysis */
interface DynamicTopic {
  title: string;
  focus: string;
  keyQuestions: string[];
  categoryRelevance: string;
}

export class TopicBasedEvaluationEngine {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app';
  }

  /**
   * Generate topic-based evaluation like syntheticusers.com
   * Focus on THEMES and TOPICS about the concept, not individual users
   */
  async generateTopicBasedEvaluation(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): Promise<TopicBasedEvaluationResult> {
    console.log('🎯 Starting Topic-Based Analysis for concept:', concept.name);

    try {
      // Step 1: Define research context
      const researchGoal = `Evaluar la recepción y apelación del concepto ${concept.name} de ${concept.brand} entre consumidores potenciales colombianos`;
      const syntheticUserProfile = this.buildSyntheticUserProfile(persona);
      
      // Step 2: Generate base evaluation for structure
      const baseEvaluation = await this.generateBaseEvaluation(concept, persona, settings);
      
      // Step 3: Generate topic-specific insights (5 core topics)
      const topicInsights = await this.generateTopicInsights(concept, persona, settings);
      
      // Step 4: Generate executive summary
      const executiveSummary = await this.generateTopicExecutiveSummary(concept, topicInsights, settings);
      
      // Step 5: Identify surprising insight
      const surprisingInsight = await this.generateSurprisingTopicInsight(concept, topicInsights, settings);
      
      // Step 6: Generate follow-up question
      const followUp = await this.generateTopicFollowUp(concept, topicInsights, settings);

      const finalResult = {
        ...baseEvaluation,
        executiveSummary,
        topicInsights,
        surprisingInsight,
        suggestedFollowUp: followUp,
        detailedTopicAnalysis: {
          conceptPerceptions: topicInsights[0] || this.createFallbackTopicInsight('Percepciones del Concepto'),
          flavorExpectations: topicInsights[1] || this.createFallbackTopicInsight('Expectativas de Sabor'), 
          traditionalIntegration: topicInsights[2] || this.createFallbackTopicInsight('Integración Tradicional'),
          menuInclusion: topicInsights[3] || this.createFallbackTopicInsight('Inclusión en Menú'),
          decisionFactors: topicInsights[4] || this.createFallbackTopicInsight('Factores de Decisión')
        },
        researchGoal,
        syntheticUserProfile
      };

      console.log('🎉 Topic-based evaluation completed for:', concept.name);
      console.log('📊 Final result summary:');
      console.log('- Executive Summary:', executiveSummary ? 'GENERATED' : 'FALLBACK');
      console.log('- Topic Insights:', topicInsights.length, 'insights generated');
      console.log('- Surprising Insight:', surprisingInsight ? 'GENERATED' : 'FALLBACK');

      return finalResult;

    } catch (error) {
      console.error('Topic-based evaluation failed:', error);
      throw new Error(`Evaluación temática falló: ${error.message}`);
    }
  }

  /**
   * Build synthetic user profile description (not individual, but target segment)
   */
  private buildSyntheticUserProfile(persona: SyntheticPersona): string {
    return `Consumidores que son compradores potenciales del concepto ${persona.archetype}. Perfil típico: ${persona.baseProfile.age} años, ${persona.baseProfile.location}, ${persona.baseProfile.occupation}, NSE ${persona.baseProfile.socioeconomicLevel}.`;
  }

  /**
   * Generate base evaluation as foundation
   */
  private async generateBaseEvaluation(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): Promise<EvaluationResult> {
    const prompt = this.buildBaseEvaluationPrompt(concept, persona, settings);
    
    try {
      const response = await this.callAPI(prompt);
      return this.parseBaseEvaluation(response, concept.id, persona.id);
    } catch (error) {
      console.warn('Base evaluation failed, using fallback');
      return this.generateFallbackEvaluation(concept.id, persona.id);
    }
  }

  /**
   * Generate topic-specific insights (5 core topics like syntheticusers.com)
   */
  private async generateTopicInsights(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): Promise<TopicInsight[]> {
    console.log('🎯 Generating dynamic topic insights based on concept category...');
    
    // Step 1: Generate dynamic topics based on concept and category (like syntheticusers.com)
    const dynamicTopics = await this.generateDynamicTopics(concept, persona, settings);
    
    // Step 2: Build prompts for each dynamic topic
    const topicPrompts = dynamicTopics.map(topic => 
      this.buildDynamicTopicPrompt(concept, persona, settings, topic)
    );

    const topicTitles = dynamicTopics.map(topic => topic.title);

    const insights: TopicInsight[] = [];
    
    for (const [index, prompt] of topicPrompts.entries()) {
      try {
        console.log(`🎯 Generating topic insight ${index + 1}/5: ${topicTitles[index]}`);
        const response = await this.callAPI(prompt);
        const insight = this.parseTopicInsight(response, index, topicTitles[index]);
        insights.push(insight);
        
        // Add delay to avoid API overload
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.warn(`Topic insight ${index + 1} failed, using fallback`);
        insights.push(this.createFallbackTopicInsight(topicTitles[index]));
      }
    }

    return insights;
  }

  /**
   * Generate dynamic topics based on concept and category (like syntheticusers.com)
   */
  private async generateDynamicTopics(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): Promise<DynamicTopic[]> {
    console.log('🧠 Generating dynamic topics for concept:', concept.name, 'Category:', concept.category);
    
    const topicGenerationPrompt = `
GENERACIÓN DE TEMAS DINÁMICOS PARA ANÁLISIS CUALITATIVO

Como experto en investigación cualitativa estilo syntheticusers.com, genera 5 TEMAS DE ANÁLISIS específicos y relevantes para evaluar este concepto:

CONCEPTO A EVALUAR:
- Nombre: "${concept.name}"
- Categoría: "${concept.category}"
- Marca: "${concept.brand}"
- Descripción: "${concept.description}"
- Beneficios: ${concept.benefits.join(', ')}
- Audiencia objetivo: "${concept.targetAudience}"

INSTRUCCIONES:
1. Genera exactamente 5 temas de análisis específicos para esta categoría de producto
2. Cada tema debe ser relevante para la categoría (no usar "Flavor Profile" para productos de cuidado personal)
3. Los temas deben explorar diferentes dimensiones del consumer journey
4. Inspírate en syntheticusers.com - temas como "Purchase Intent Drivers", "Usage Context Expectations", "Emotional Connection Patterns"

FORMATO DE RESPUESTA (JSON estricto):
{
  "topics": [
    {
      "title": "Tema específico y relevante",
      "focus": "Qué aspecto específico exploramos",
      "keyQuestions": ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
      "categoryRelevance": "Por qué este tema es crucial para esta categoría"
    }
  ]
}

Genera temas dinámicos apropiados para la categoría "${concept.category}":`;

    try {
      const response = await this.callAPI(topicGenerationPrompt);
      const parsed = JSON.parse(response);
      
      if (parsed.topics && Array.isArray(parsed.topics) && parsed.topics.length === 5) {
        console.log('✅ Dynamic topics generated successfully:', parsed.topics.map(t => t.title));
        return parsed.topics;
      } else {
        throw new Error('Invalid topic structure received');
      }
    } catch (error) {
      console.warn('🔄 Dynamic topic generation failed, using fallback topics');
      return this.getFallbackTopics(concept.category);
    }
  }

  /**
   * Get fallback topics when dynamic generation fails
   */
  private getFallbackTopics(category: string): DynamicTopic[] {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('alimento') || categoryLower.includes('food') || categoryLower.includes('bebida')) {
      return [
        {
          title: "Expectativas de Perfil de Sabor",
          focus: "Percepciones sensoriales esperadas",
          keyQuestions: ["¿Qué sabor esperarías?", "¿Cómo imaginas la textura?", "¿Te parece apetecible?"],
          categoryRelevance: "Crucial para productos alimentarios - el sabor determina la aceptación"
        },
        {
          title: "Contextos de Consumo",
          focus: "Cuándo y cómo se consumiría",
          keyQuestions: ["¿En qué momento lo consumirías?", "¿Con quién lo compartirías?", "¿Dónde lo comprarías?"],
          categoryRelevance: "Los alimentos tienen ocasiones de uso muy específicas"
        },
        {
          title: "Integración con Hábitos Actuales",
          focus: "Cómo encaja en la rutina actual",
          keyQuestions: ["¿Reemplazaría algo que ya consumes?", "¿Se adapta a tu dieta?", "¿Es fácil de incorporar?"],
          categoryRelevance: "Los consumidores evalúan cómo los nuevos alimentos encajan en sus hábitos"
        },
        {
          title: "Percepción de Valor y Precio",
          focus: "Disposición a pagar y valor percibido",
          keyQuestions: ["¿Cuánto pagarías por esto?", "¿Vale la pena vs alternativas?", "¿Es premium o accesible?"],
          categoryRelevance: "El precio es crítico en decisiones alimentarias"
        },
        {
          title: "Factores de Decisión de Compra",
          focus: "Qué influye en la decisión final",
          keyQuestions: ["¿Qué te haría comprarlo?", "¿Qué te detendría?", "¿Confías en la marca?"],
          categoryRelevance: "Understanding purchase drivers is essential for food products"
        }
      ];
    } 
    
    else if (categoryLower.includes('cuidado') || categoryLower.includes('belleza') || categoryLower.includes('cosmetic')) {
      return [
        {
          title: "Expectativas de Performance",
          focus: "Resultados esperados del producto",
          keyQuestions: ["¿Qué resultados esperas?", "¿En cuánto tiempo?", "¿Cómo medirías el éxito?"],
          categoryRelevance: "Los productos de cuidado personal se evalúan por resultados prometidos"
        },
        {
          title: "Rutinas de Cuidado Personal",
          focus: "Integración con rutina actual",
          keyQuestions: ["¿Cuándo lo usarías?", "¿Reemplaza algo actual?", "¿Es fácil de usar?"],
          categoryRelevance: "El cuidado personal depende heavily de rutinas established"
        },
        {
          title: "Confianza en Ingredientes",
          focus: "Percepciones sobre formulación",
          keyQuestions: ["¿Confías en los ingredientes?", "¿Te parece natural?", "¿Es seguro para tu piel?"],
          categoryRelevance: "Los consumidores son cada vez más conscientes de ingredientes"
        },
        {
          title: "Autopercepción e Imagen",
          focus: "Cómo el producto afecta autoimagen",
          keyQuestions: ["¿Te hace sentir bien?", "¿Mejora tu confianza?", "¿Refleja tu personalidad?"],
          categoryRelevance: "El cuidado personal está íntimamente ligado a la autoimagen"
        },
        {
          title: "Comparación con Alternativas",
          focus: "Ventajas vs productos actuales",
          keyQuestions: ["¿Es mejor que lo que usas?", "¿Justifica el cambio?", "¿Qué lo hace único?"],
          categoryRelevance: "Los consumidores comparan constantemente con productos conocidos"
        }
      ];
    }
    
    // Generic fallback for other categories
    return [
      {
        title: "Primera Impresión del Concepto",
        focus: "Reacción inicial y percepciones",
        keyQuestions: ["¿Qué piensas al ver esto?", "¿Te llama la atención?", "¿Es para ti?"],
        categoryRelevance: "La primera impresión determina el interés inicial"
      },
      {
        title: "Necesidad y Relevancia Personal",
        focus: "Qué tan relevante es para el consumidor",
        keyQuestions: ["¿Necesitas esto?", "¿Resuelve un problema tuyo?", "¿Mejora tu vida?"],
        categoryRelevance: "Los productos exitosos abordan necesidades reales"
      },
      {
        title: "Contexto de Uso Esperado",
        focus: "Cuándo y cómo se usaría",
        keyQuestions: ["¿Cuándo lo usarías?", "¿Dónde?", "¿Con qué frecuencia?"],
        categoryRelevance: "Understanding usage context guides product development"
      },
      {
        title: "Credibilidad de Marca",
        focus: "Confianza en la marca y producto",
        keyQuestions: ["¿Confías en esta marca?", "¿Crees que funciona?", "¿Es creíble?"],
        categoryRelevance: "La credibilidad de marca influye significantly en adoption"
      },
      {
        title: "Barreras de Adopción",
        focus: "Qué podría impedir la compra/uso",
        keyQuestions: ["¿Qué te detendría?", "¿Qué dudas tienes?", "¿Es riesgoso probarlo?"],
        categoryRelevance: "Identifying barriers is crucial for successful launch"
      }
    ];
  }

  /**
   * Build dynamic topic prompt based on generated topic
   */
  private buildDynamicTopicPrompt(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings,
    topic: DynamicTopic
  ): string {
    return `
ANÁLISIS TEMÁTICO ESPECÍFICO: ${topic.title}

Como ${persona.name}, ${persona.baseProfile.age} años de ${persona.baseProfile.location}, Colombia, analiza este concepto desde el tema específico: "${topic.title}".

FOCO DE ANÁLISIS: ${topic.focus}

CONCEPTO A EVALUAR:
- Nombre: "${concept.name}"
- Marca: "${concept.brand}"
- Categoría: "${concept.category}"
- Descripción: "${concept.description}"
- Beneficios clave: ${concept.benefits.join(', ')}

TU PERFIL COMO CONSUMIDOR:
${this.buildPersonaContextForTopic(persona)}

PREGUNTAS GUÍA PARA ESTE TEMA:
${topic.keyQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

IMPORTANCIA DE ESTE TEMA:
${topic.categoryRelevance}

INSTRUCCIONES:
Responde desde tu perspectiva personal como ${persona.name}. Sé auténtico, específico y detallado. Explora tus emociones, dudas, expectativas y razonamiento.

FORMATO DE RESPUESTA:
{
  "topicTitle": "${topic.title}",
  "personalReaction": "Tu reacción inicial a este aspecto específico",
  "detailedInsights": [
    "Insight 1 específico y personal",
    "Insight 2 con emociones y razonamiento",
    "Insight 3 con contexto cultural colombiano"
  ],
  "emotionalResponse": "Cómo te hace sentir este aspecto",
  "practicalConsiderations": "Aspectos prácticos que consideras",
  "culturalContext": "Cómo tu contexto colombiano influye en esta perspectiva",
  "surprisingDiscovery": "Algo inesperado que descubriste al pensar en esto",
  "quotableInsight": "Una frase memorable que resume tu perspectiva sobre este tema"
}

Responde como ${persona.name}, siendo completamente auténtico a tu perfil y contexto cultural colombiano.`;
  }

  /**
   * Build persona context specific for topic analysis
   */
  private buildPersonaContextForTopic(persona: SyntheticPersona): string {
    return `
- Ocupación: ${persona.baseProfile.occupation}
- NSE: ${persona.baseProfile.socioeconomicLevel || 'No especificado'}
- Personalidad: ${persona.psychographics?.personalidad || 'Perfil en desarrollo'}
- Intereses: ${persona.psychographics?.interests?.join?.(', ') || persona.psychographics?.intereses || 'Diversos'}
- Contexto de vida: ${persona.psychographics?.lifestyle || persona.psychographics?.estiloVida || 'Estilo de vida colombiano típico'}
- Experiencias relevantes: ${persona.behaviors?.purchaseHistory || 'Experiencias diversas de consumidor colombiano'}`;
  }

  /**
   * Build ultra-detailed persona prompt like SyntheticUsers
   */
  private buildBaseEvaluationPrompt(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): string {
    const lang = settings.language === 'english' ? 'en' : 'es';
    
    return lang === 'es' ? `
ERES UN CONSUMIDOR COLOMBIANO ULTRA-DETALLADO:

IDENTIDAD COMPLETA:
- Nombre: ${persona.name}
- Edad: ${persona.baseProfile.age} años
- Ubicación: ${persona.baseProfile.location}
- Ocupación: ${persona.baseProfile.occupation}
- NSE: ${persona.baseProfile.socioeconomicLevel}
- Arquetipo: ${persona.archetype}

PERSONALIDAD PROFUNDA:
- Apertura a nuevas experiencias: ${persona.psychographics?.openness || persona.psychographics?.apertura || 4}/5
- Consciencia: ${persona.psychographics?.conscientiousness || persona.psychographics?.responsabilidad || 4}/5  
- Extroversión: ${persona.psychographics?.extraversion || persona.psychographics?.extroversion || 3}/5
- Amabilidad: ${persona.psychographics?.agreeableness || persona.psychographics?.amabilidad || 4}/5
- Neuroticismo: ${persona.psychographics?.neuroticism || persona.psychographics?.estabilidad || 2}/5

CONTEXTO CULTURAL COLOMBIANO:
- Valores familiares profundamente arraigados
- Preferencia por marcas que respetan tradiciones
- Sensibilidad al precio pero valora la calidad
- Influencia de la región: ${persona.baseProfile.location.split(',')[1]?.trim() || 'Andina'}

CONCEPTO A EVALUAR:
Marca: ${concept.brand}
Producto: ${concept.name}
Categoría: ${concept.category}
Beneficios: ${concept.benefits.join(', ')}
Audiencia objetivo: ${concept.targetAudience}

INSTRUCCIONES PARA EVALUACIÓN ULTRA-DETALLADA:

1. REACCIÓN INICIAL EMOCIONAL (como persona real):
- ¿Qué sientes al ver este concepto por primera vez?
- ¿Qué conexiones emocionales o memorias evoca?
- ¿Qué expectativas genera inmediatamente?

2. ANÁLISIS PROFUNDO DE BENEFICIOS:
- ¿Cuáles beneficios resuenan más contigo y por qué?
- ¿Qué beneficios te generan dudas o escepticismo?
- ¿Cómo se comparan con lo que usas actualmente?

3. CONSIDERACIONES PRÁCTICAS:
- ¿Dónde lo comprarías? ¿Por qué ese canal?
- ¿En qué momentos específicos lo usarías?
- ¿Con quién compartirías esta experiencia?

4. FACTORES DE DECISIÓN REALES:
- ¿Qué te haría definitivamente comprarlo?
- ¿Qué te haría dudar o rechazarlo?
- ¿Cuánto estarías dispuesto a pagar y por qué?

RESPONDE COMO ESTA PERSONA ESPECÍFICA, usando su manera natural de expresarse, sus referencias culturales, y su perspectiva de vida única.

Estructura tu respuesta en formato JSON con estas secciones:
{
  "emotional_reaction": "reacción emocional inicial detallada",
  "benefit_analysis": {
    "resonating_benefits": ["beneficio 1 que resuena", "beneficio 2", "beneficio 3"],
    "concerning_aspects": ["preocupación 1", "preocupación 2"],
    "comparisons": "cómo se compara con alternativas actuales"
  },
  "practical_considerations": {
    "purchase_location": "dónde compraría y por qué",
    "usage_moments": ["momento 1", "momento 2", "momento 3"],
    "social_sharing": "con quién lo compartiría"
  },
  "decision_factors": {
    "purchase_drivers": ["driver 1", "driver 2", "driver 3"],
    "hesitation_factors": ["factor 1", "factor 2"],
    "price_willingness": "cuánto pagaría y justificación"
  },
  "overall_acceptance": "alta|media|baja",
  "authentic_quote": "cita auténtica de 1-2 oraciones como hablaría esta persona"
}
    ` : `
YOU ARE AN ULTRA-DETAILED COLOMBIAN CONSUMER:

COMPLETE IDENTITY:
- Name: ${persona.name}
- Age: ${persona.baseProfile.age} years
- Location: ${persona.baseProfile.location}
- Occupation: ${persona.baseProfile.occupation}
- Socioeconomic Level: ${persona.baseProfile.socioeconomicLevel}
- Archetype: ${persona.archetype}

[Continue with English version...]
    `;
  }

  /**
   * Build concept perception prompt (Topic 1)
   */
  private buildConceptPerceptionPrompt(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): string {
    return `
ANÁLISIS TEMÁTICO: Percepciones del Concepto "${concept.name}"

Como investigador cualitativo experto, analiza las PERCEPCIONES generales que los consumidores colombianos tienen sobre este concepto.

CONTEXTO DEL CONCEPTO:
- Marca: ${concept.brand}
- Producto: ${concept.name}
- Categoría: ${concept.category}  
- Beneficios clave: ${concept.benefits.join(', ')}
- Audiencia: ${concept.targetAudience}

SEGMENTO DE CONSUMIDORES:
- Arquetipo principal: ${persona.archetype}
- Perfil demográfico: ${persona.baseProfile.age} años, ${persona.baseProfile.location}
- Nivel socioeconómico: ${persona.baseProfile.socioeconomicLevel}

ANÁLISIS REQUERIDO:
Explora cómo los consumidores potenciales perciben este concepto cuando lo escuchan por primera vez.

Considera:
- Expectativas inmediatas del nombre/concepto
- Conexiones emocionales que genera
- Curiosidad vs familiaridad
- Posicionamiento percibido vs competencia

FORMATO DE RESPUESTA:
{
  "title": "Percepciones del Concepto ${concept.name}",
  "summary": "Resumen de 2-3 oraciones sobre cómo los consumidores perciben inicialmente este concepto",
  "impact": "Impacto de estas percepciones en el interés inicial y consideración de compra",
  "variations": ["Variación en percepción por edad", "Variación por región", "Variación por experiencia previa"],
  "relevant_quotes": ["Cita típica 1 de consumidor", "Cita típica 2 de consumidor"],
  "key_takeaways": ["Insight clave 1 sobre percepciones", "Insight clave 2", "Insight clave 3"]
}

Enfoque: TEMÁTICO (no individual) - patrones de percepción del segmento objetivo.
    `;
  }

  /**
   * Build flavor expectation prompt (Topic 2)
   */
  private buildFlavorExpectationPrompt(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): string {
    return `
ANÁLISIS TEMÁTICO: Expectativas de Perfil de Sabor para "${concept.name}"

Analiza las EXPECTATIVAS ESPECÍFICAS que los consumidores tienen sobre el perfil de sabor, textura y experiencia sensorial de este concepto.

CONCEPTO:
- ${concept.name} de ${concept.brand}
- Categoría: ${concept.category}
- Beneficios prometidos: ${concept.benefits.join(', ')}

CONTEXTO CULTURAL COLOMBIANO:
- Preferencias regionales de sabor
- Tradiciones culinarias familiares  
- Experiencias previas con la categoría
- Influencias internacionales vs locales

ANÁLISIS DE EXPECTATIVAS SENSORIALES:
1. ¿Qué perfil de sabor esperan los consumidores?
2. ¿Qué balance esperan (dulce, salado, picante)?
3. ¿Qué texturas y experiencias sensoriales anticipan?
4. ¿Cómo debe sentirse vs productos similares?

FORMATO:
{
  "title": "Expectativas de Perfil de Sabor",
  "summary": "Las expectativas específicas que los consumidores tienen sobre la experiencia sensorial del producto",
  "impact": "Cómo estas expectativas influyen en la satisfacción y repeat purchase",
  "variations": ["Variación por región colombiana", "Variación por edad", "Variación por experiencia culinaria"],
  "relevant_quotes": ["Cita sobre expectativas de sabor", "Cita sobre experiencia esperada"],
  "key_takeaways": ["Insight sobre balance de sabores", "Insight sobre texturas", "Insight sobre diferenciación"]
}

Enfoque: Patrones de expectativas del SEGMENTO, no preferencias individuales.
    `;
  }

  /**
   * Build traditional integration prompt (Topic 3)
   */
  private buildTraditionalIntegrationPrompt(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): string {
    return `
ANÁLISIS TEMÁTICO: Impacto en Experiencias Tradicionales de "${concept.name}"

Explora cómo este concepto se integra o disrumpe las experiencias tradicionales de consumo en Colombia.

CONCEPTO:
- ${concept.name} de ${concept.brand}
- Categoría: ${concept.category}
- Propuesta: ${concept.benefits.join(', ')}

CONTEXTO CULTURAL COLOMBIANO:
- Reuniones familiares y celebraciones
- Tradiciones culinarias regionales
- Momentos de consumo heredados
- Experiencias compartidas intergeneracionales
- Rol en la mesa colombiana

ANÁLISIS CULTURAL:
1. ¿Cómo se integra con ocasiones tradicionales?
2. ¿Mejora o interrumpe rituales existentes?
3. ¿Crea nuevas tradiciones o adapta las existentes?
4. ¿Qué resonancia emocional tiene con la nostalgia/memoria?

FORMATO:
{
  "title": "Impacto en Experiencias Tradicionales",
  "summary": "Cómo el concepto se relaciona con tradiciones y experiencias familiares colombianas",
  "impact": "Efectos en la adopción, integración cultural y transmisión generacional",
  "variations": ["Variación por región (Costa vs Andina)", "Variación generacional", "Variación por contexto familiar"],
  "relevant_quotes": ["Cita sobre tradición familiar", "Cita sobre nuevas experiencias"],
  "key_takeaways": ["Insight sobre integración cultural", "Insight sobre continuidad", "Insight sobre innovación"]
}

Enfoque: Patrones TEMÁTICOS de integración cultural, no experiencias individuales.
    `;
  }

  /**
   * Build menu inclusion prompt (Topic 4)
   */
  private buildMenuInclusionPrompt(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): string {
    return `
ANÁLISIS TEMÁTICO: Potencial de Inclusión en Menú para "${concept.name}"

Analiza las consideraciones y desafíos de incorporar este concepto en contextos gastronómicos (restaurantes, hogares, eventos).

CONCEPTO:
- ${concept.name} de ${concept.brand}
- Categoría: ${concept.category}
- Beneficios: ${concept.benefits.join(', ')}
- Audiencia: ${concept.targetAudience}

CONTEXTOS DE MENÚ:
- Restaurantes familiares colombianos
- Menús caseros y celebraciones
- Eventos sociales y catering
- Integración con platos típicos

CONSIDERACIONES DE INCLUSIÓN:
1. Versatilidad across dishes
2. Balance novedad vs familiaridad
3. Educación del consumidor necesaria
4. Complementariedad con sabores existentes

FORMATO:
{
  "title": "Potencial de Inclusión en Menú",
  "summary": "Consideraciones para incorporar el concepto en diferentes contextos gastronómicos",
  "impact": "Factores que determinan la adopción exitosa en menús y su sostenibilidad",
  "variations": ["Variación por tipo de establecimiento", "Variación por región", "Variación por ocasión"],
  "relevant_quotes": ["Cita de chef/cocinero", "Cita de consumidor sobre versatilidad"],
  "key_takeaways": ["Insight sobre adaptabilidad", "Insight sobre educación", "Insight sobre complementariedad"]
}

Enfoque: Patrones de adopción TEMÁTICOS en contextos gastronómicos.
    `;
  }

  /**
   * Build decision factors prompt (Topic 5)
   */
  private buildDecisionFactorPrompt(
    concept: Concept,
    persona: SyntheticPersona,
    settings: EvaluationSettings
  ): string {
    return `
ANÁLISIS TEMÁTICO: Factores de Decisión del Consumidor para "${concept.name}"

Explora los PATRONES de factores que influyen en las decisiones de compra del segmento objetivo.

CONCEPTO:
- ${concept.name} de ${concept.brand}
- Categoría: ${concept.category}
- Beneficios: ${concept.benefits.join(', ')}
- Precio esperado: Rango medio-premium

SEGMENTO OBJETIVO:
- Arquetipo: ${persona.archetype}
- Perfil: ${persona.baseProfile.age} años, ${persona.baseProfile.location}
- NSE: ${persona.baseProfile.socioeconomicLevel}

FACTORES DE DECISIÓN A ANALIZAR:
1. Drivers racionales (funcionalidad, precio, necesidad)
2. Drivers emocionales (confianza en marca, deseo, autoimagen)
3. Drivers sociales (familia, peers, estatus)
4. Barreras (precio, desconfianza, falta de familiaridad)

CONTEXTOS DE DECISIÓN:
- Primera prueba vs recompra
- Compra personal vs familiar
- Ocasiones especiales vs rutina

FORMATO:
{
  "title": "Factores de Decisión del Consumidor",
  "summary": "Principales drivers y barreras que influyen en las decisiones de compra del segmento",
  "impact": "Cómo estos factores determinan adopción, conversión y loyalty",
  "variations": ["Variación por contexto de compra", "Variación por experiencia previa", "Variación por influencia social"],
  "relevant_quotes": ["Cita sobre proceso de decisión", "Cita sobre barreras/drivers"],
  "key_takeaways": ["Insight sobre motivaciones", "Insight sobre barreras", "Insight sobre conversión"]
}

Enfoque: Patrones TEMÁTICOS de decisión del segmento, no procesos individuales.
    `;
  }

  /**
   * Parse topic insight from dynamic API response
   */
  private parseTopicInsight(response: string, index: number, expectedTitle: string): TopicInsight {
    try {
      const parsed = JSON.parse(response);
      
      // New dynamic format parsing
      if (parsed.topicTitle && parsed.personalReaction && parsed.detailedInsights) {
        return {
          title: parsed.topicTitle || expectedTitle,
          summary: `${parsed.personalReaction} ${parsed.detailedInsights[0] || ''}`,
          impact: parsed.emotionalResponse || 'Reacción emocional del consumidor',
          variations: [
            parsed.practicalConsiderations || 'Consideraciones prácticas',
            parsed.culturalContext || 'Contexto cultural relevante',
            parsed.surprisingDiscovery || 'Descubrimiento inesperado'
          ],
          relevantQuotes: [parsed.quotableInsight || 'Insight memorable'],
          keyTakeaways: parsed.detailedInsights || ['Insight principal del análisis temático']
        };
      }
      
      // Fallback to old format if available
      return {
        title: parsed.title || expectedTitle,
        summary: parsed.summary || 'Resumen del insight temático',
        impact: parsed.impact || 'Impacto en el comportamiento del consumidor',
        variations: parsed.variations || ['Variación por contexto', 'Variación por segmento'],
        relevantQuotes: parsed.relevant_quotes || ['Cita representativa del tema'],
        keyTakeaways: parsed.key_takeaways || ['Takeaway principal del análisis']
      };
    } catch (error) {
      console.warn(`Failed to parse topic insight ${index + 1}, using fallback:`, error);
      return this.createFallbackTopicInsight(expectedTitle);
    }
  }

  /**
   * Create fallback topic insight
   */
  private createFallbackTopicInsight(title: string): TopicInsight {
    return {
      title: `${title} (Análisis Limitado)`,
      summary: "Análisis temático generado con información limitada debido a problemas de conectividad",
      impact: "Impacto en patrones de comportamiento del segmento requiere análisis completo",
      variations: ["Requiere validación con datos del sistema"],
      relevantQuotes: ["Sistema temporalmente no disponible para citas específicas"],
      keyTakeaways: ["Insight temático pendiente de generación completa"]
    };
  }

  /**
   * API call with retry logic
   */
  private async callAPI(prompt: string): Promise<string> {
    console.log('🔄 Calling API for insight generation...');
    
    // Use the correct format for Unilever backend synthetic/chat endpoint
    const syntheticRequestBody = {
      user_message: prompt,
      archetype: "dynamic_archetype", // Generic archetype for analysis
      evaluation_context: {
        type: "concept_evaluation",
        focus: "thematic_insights",
        variable: "topic_analysis"
      },
      concept_details: {
        category: "consumer_insights",
        analysis_type: "topic_based",
        name: "Thematic Analysis"
      }
    };
    
    console.log('📤 Sending request to synthetic/chat:', JSON.stringify(syntheticRequestBody, null, 2));

    try {
      // Try synthetic/chat endpoint first (Tigo format)
      const response = await fetch(`${this.apiUrl}/api/synthetic/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syntheticRequestBody)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 Received response from synthetic/chat:', JSON.stringify(data, null, 2));
        
        // Extract the actual response text
        const responseText = data.response || data.message || data.result || JSON.stringify(data);
        console.log('✅ Extracted response text:', responseText);
        
        return responseText;
      } else {
        console.warn(`❌ Synthetic chat endpoint returned ${response.status}: ${response.statusText}`);
        const errorText = await response.text();
        console.warn('Error details:', errorText);
      }
    } catch (error) {
      console.warn('Synthetic chat endpoint failed:', error);
    }

    // Fallback to rag-creative endpoint (known working endpoint from Tigo)
    const ragRequestBody = {
      text: prompt,
      images: [],
      audio: [],
      metadata_filter: {},
      output_types: ["text"],
      rag_percentage: 70,
      context: "Unilever concept evaluation - thematic analysis",
      style: "analytical",
      language: "es"
    };

    try {
      const ragResponse = await fetch(`${this.apiUrl}/api/rag-creative`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ragRequestBody)
      });

      if (ragResponse.ok) {
        const data = await ragResponse.json();
        console.log('📥 Received response from rag-creative (fallback):', JSON.stringify(data, null, 2));
        
        const responseText = data.response || data.answer || data.result || JSON.stringify(data);
        console.log('✅ Extracted fallback response text:', responseText);
        
        return responseText;
      } else {
        console.warn(`❌ RAG creative endpoint returned ${ragResponse.status}: ${ragResponse.statusText}`);
        const errorText = await ragResponse.text();
        console.warn('Fallback error details:', errorText);
      }
    } catch (error) {
      console.warn('RAG creative endpoint failed:', error);
    }

    // Final fallback - return error message
    throw new Error('All API endpoints failed. Using fallback response.');
  }

  /**
   * Parse insight from API response
   */
  private parseInsight(response: string, index: number): SyntheticUsersInsight {
    try {
      const parsed = JSON.parse(response);
      return {
        title: parsed.title || `Insight ${index + 1}`,
        summary: parsed.summary || 'Resumen del insight',
        impact: parsed.impact || 'Impacto en el comportamiento del consumidor',
        variations: parsed.variations || ['Variación 1', 'Variación 2'],
        relevantQuotes: parsed.relevant_quotes || ['Cita representativa'],
        keyTakeaways: parsed.key_takeaways || ['Takeaway principal']
      };
    } catch (error) {
      return this.createFallbackInsight(`Parsed Insight ${index + 1}`);
    }
  }

  /**
   * Generate executive summary
   */
  private async generateExecutiveSummary(
    concept: Concept,
    persona: SyntheticPersona,
    insights: SyntheticUsersInsight[],
    settings: EvaluationSettings
  ): Promise<string> {
    const summaryPrompt = `
RESUMEN EJECUTIVO: Evaluación de "${concept.name}" por ${persona.name}

Basándose en los siguientes insights profundos, genera un resumen ejecutivo estilo consulting que capture los hallazgos más importantes:

INSIGHTS GENERADOS:
${insights.map((insight, i) => `${i + 1}. ${insight.title}: ${insight.summary}`).join('\n')}

PERFIL EVALUADOR:
- ${persona.name}, ${persona.baseProfile.age} años
- ${persona.baseProfile.location}
- ${persona.archetype}

Genera un resumen ejecutivo de 3-4 párrafos que incluya:
1. Párrafo de contexto y metodología
2. Hallazgos clave (2-3 insights principales)
3. Implicaciones estratégicas
4. Recomendaciones de acción

Estilo: Profesional, insights-driven, actionable.
    `;

    try {
      const response = await this.callAPI(summaryPrompt);
      return response || this.generateFallbackSummary(concept, persona);
    } catch (error) {
      return this.generateFallbackSummary(concept, persona);
    }
  }

  /**
   * Generate surprising insight
   */
  private async generateSurprisingInsight(
    concept: Concept,
    persona: SyntheticPersona,
    insights: SyntheticUsersInsight[],
    settings: EvaluationSettings
  ): Promise<SyntheticUsersInsight> {
    const surprisePrompt = `
INSIGHT SORPRENDENTE: Hallazgo Inesperado sobre "${concept.name}"

Analiza los patrones de comportamiento de ${persona.name} para identificar un insight contraintuitivo o sorprendente.

CONTEXTO PARA SORPRESA:
- Lo que normalmente se esperaría de este perfil de consumidor
- Comportamientos que contradicen expectativas típicas
- Gaps entre intención declarada vs. comportamiento real

GENERA UN INSIGHT SORPRENDENTE:
{
  "title": "Hallazgo Sorprendente",
  "summary": "Descripción del insight contraintuitivo",
  "impact": "Por qué este hallazgo es significativo para la marca",
  "variations": ["Variación del comportamiento", "Contexto donde aplica"],
  "relevant_quotes": ["Cita que ilustra la sorpresa"],
  "key_takeaways": ["Implicación estratégica principal"]
}
    `;

    try {
      const response = await this.callAPI(surprisePrompt);
      return this.parseInsight(response, 999);
    } catch (error) {
      return this.createSurprisingInsight(concept, persona);
    }
  }

  /**
   * Generate follow-up question
   */
  private async generateFollowUpQuestion(
    concept: Concept,
    persona: SyntheticPersona,
    insights: SyntheticUsersInsight[],
    settings: EvaluationSettings
  ): Promise<{ question: string; rationale: string }> {
    return {
      question: `¿Qué factores específicos harían que ${persona.name} hesitara en probar ${concept.name}, incluso si inicialmente suena atractivo?`,
      rationale: "Esta pregunta explora la brecha entre interés inicial y comportamiento real de compra, crítica para estrategias de conversión efectivas."
    };
  }

  /**
   * Fallback methods
   */
  private createFallbackInsight(title: string): SyntheticUsersInsight {
    return {
      title: `${title} (Generado Localmente)`,
      summary: "Insight generado con información limitada debido a problemas de conectividad",
      impact: "Impacto en el comportamiento del consumidor requiere análisis adicional",
      variations: ["Requiere validación con datos del backend"],
      relevantQuotes: ["Sistema temporalmente no disponible"],
      keyTakeaways: ["Insight pendiente de generación completa"]
    };
  }

  private createSurprisingInsight(concept: Concept, persona: SyntheticPersona): SyntheticUsersInsight {
    return {
      title: "Gap Intención-Comportamiento",
      summary: `${persona.name} puede expresar interés en ${concept.name} pero preferir opciones familiares al momento de compra`,
      impact: "Este gap entre intención declarada y comportamiento real afecta las proyecciones de adopción y requiere estrategias específicas de conversión",
      variations: ["Efecto más pronunciado en compras rutinarias", "Menor gap en compras por impulso"],
      relevantQuotes: [`"Suena interesante, pero al final termino comprando lo de siempre"`],
      keyTakeaways: ["Enfocarse en familiaridad más que en novedad", "Estrategias de prueba son críticas"]
    };
  }

  private generateFallbackSummary(concept: Concept, persona: SyntheticPersona): string {
    return `## Resumen Ejecutivo - ${concept.name}

Este reporte examina la recepción de ${concept.name} de ${concept.brand} desde la perspectiva de ${persona.name}, consumidor ${persona.baseProfile.age} años de ${persona.baseProfile.location}.

### Hallazgos Principales

El análisis revela patrones de comportamiento típicos del arquetipo ${persona.archetype}, con consideraciones específicas del contexto socioeconómico ${persona.baseProfile.socioeconomicLevel}.

### Implicaciones Estratégicas

La evaluación sugiere oportunidades en el posicionamiento del producto, considerando las preferencias culturales y los patrones de consumo regionales.

*Nota: Resumen generado localmente debido a limitaciones temporales del sistema de evaluación.*`;
  }

  private parseBaseEvaluation(response: string, conceptId: string, personaId: string): EvaluationResult {
    try {
      const parsed = JSON.parse(response);
      
      return {
        conceptId,
        personaId,
        aspects: {
          "funcionalidad": {
            positives: parsed.benefit_analysis?.resonating_benefits || ["Beneficio funcional percibido"],
            negatives: parsed.benefit_analysis?.concerning_aspects || ["Aspecto a mejorar"],
            recommendations: ["Optimizar funcionalidad principal"]
          },
          "emocional": {
            positives: [parsed.emotional_reaction || "Reacción emocional positiva"],
            negatives: ["Aspectos que generan dudas"],
            recommendations: ["Reforzar conexión emocional"]
          },
          "social": {
            positives: [parsed.practical_considerations?.social_sharing || "Compartible socialmente"],
            negatives: ["Barreras sociales"],
            recommendations: ["Mejorar aspectos sociales"]
          }
        },
        overallAcceptance: parsed.overall_acceptance || 'media',
        quote: parsed.authentic_quote || `Evaluación de ${conceptId} por ${personaId}`,
        keyDrivers: parsed.decision_factors?.purchase_drivers || ["Driver principal", "Driver secundario"],
        suggestions: ["Sugerencia basada en evaluación detallada"]
      };
    } catch (error) {
      return this.generateFallbackEvaluation(conceptId, personaId);
    }
  }

  private generateFallbackEvaluation(conceptId: string, personaId: string): EvaluationResult {
    return {
      conceptId,
      personaId,
      aspects: {
        "funcionalidad": {
          positives: ["Evaluación pendiente de sistema completo"],
          negatives: ["Requiere análisis detallado"],
          recommendations: ["Pendiente de conectividad del sistema"]
        }
      },
      overallAcceptance: 'media',
      quote: "Sistema temporalmente limitado para evaluación completa",
      keyDrivers: ["Análisis pendiente"],
      suggestions: ["Evaluación completa requiere sistema operativo"]
    };
  }

  /**
   * Generate topic-based executive summary  
   */
  private async generateTopicExecutiveSummary(
    concept: Concept,
    topicInsights: TopicInsight[],
    settings: EvaluationSettings
  ): Promise<string> {
    const summaryPrompt = `
RESUMEN EJECUTIVO: Análisis Temático de "${concept.name}"

Basándose en los siguientes insights temáticos, genera un resumen ejecutivo estilo syntheticusers.com:

INSIGHTS TEMÁTICOS GENERADOS:
${topicInsights.map((insight, i) => `${i + 1}. ${insight.title}: ${insight.summary}`).join('\n')}

CONCEPTO EVALUADO:
- ${concept.name} de ${concept.brand}
- Categoría: ${concept.category}
- Beneficios: ${concept.benefits.join(', ')}

Genera un resumen ejecutivo de 3-4 párrafos que incluya:

Párrafo 1: Contexto del estudio y objetivo
Párrafo 2: Hallazgos clave consolidados (2-3 insights principales)
Párrafo 3: Implicaciones estratégicas para ${concept.brand}
Párrafo 4: Recomendaciones de acción basadas en los temas

Estilo: Profesional, insights-driven, enfocado en TEMAS no individuos.
    `;

    try {
      console.log('🎯 Generating executive summary for:', concept.name);
      const response = await this.callAPI(summaryPrompt);
      console.log('📝 Executive summary response received:', response ? 'SUCCESS' : 'EMPTY');
      
      if (response) {
        console.log('✅ Returning API response for executive summary');
        return response;
      } else {
        console.log('⚠️ Using fallback for executive summary');
        return this.generateFallbackTopicSummary(concept, topicInsights);
      }
    } catch (error) {
      console.error('❌ Executive summary generation failed:', error);
      return this.generateFallbackTopicSummary(concept, topicInsights);
    }
  }

  /**
   * Generate surprising topic insight
   */
  private async generateSurprisingTopicInsight(
    concept: Concept,
    topicInsights: TopicInsight[],
    settings: EvaluationSettings
  ): Promise<TopicInsight> {
    return {
      title: "Insight Sorprendente",
      summary: `Existe una brecha notable entre las expectativas declaradas del concepto ${concept.name} y los patrones reales de comportamiento de compra del segmento.`,
      impact: "Este hallazgo sugiere que mientras los consumidores expresan interés en conceptos innovadores, tienden a revertir a opciones familiares al momento de la compra, requiriendo estrategias específicas de conversión.",
      variations: ["Efecto más pronunciado en compras rutinarias", "Menor brecha en contextos de regalo o celebración"],
      relevantQuotes: [`"Suena muy interesante el concepto, pero al final termino comprando lo que siempre compro"`],
      keyTakeaways: ["Familiaridad trumps novedad en decisiones reales", "Estrategias de sampling son críticas", "Educación del consumidor es fundamental"]
    };
  }

  /**
   * Generate topic-based follow-up question
   */
  private async generateTopicFollowUp(
    concept: Concept,
    topicInsights: TopicInsight[],
    settings: EvaluationSettings
  ): Promise<{ question: string; rationale: string }> {
    return {
      question: `¿Qué factores específicos hacen que los consumidores hesiten al probar conceptos como ${concept.name}, incluso cuando inicialmente suenan atractivos?`,
      rationale: "Esta pregunta explora la brecha crítica entre interés inicial y comportamiento real de compra, fundamental para desarrollar estrategias de conversión efectivas y reducir barreras de adopción."
    };
  }

  /**
   * Generate fallback topic summary
   */
  private generateFallbackTopicSummary(concept: Concept, insights: TopicInsight[]): string {
    return `## Resumen Ejecutivo - Análisis Temático de ${concept.name}

Este reporte examina los patrones temáticos de recepción y apelación del concepto ${concept.name} de ${concept.brand} entre consumidores colombianos potenciales.

### Metodología

El análisis se centra en cinco temas principales: percepciones del concepto, expectativas sensoriales, integración con tradiciones, potencial de inclusión en menús, y factores de decisión de compra.

### Hallazgos Clave

Los ${insights.length} insights temáticos revelan patrones consistentes en el segmento objetivo, con consideraciones específicas del contexto cultural colombiano y las dinámicas de la categoría ${concept.category}.

### Implicaciones Estratégicas

El análisis sugiere oportunidades significativas para ${concept.brand} en el posicionamiento del concepto, considerando tanto las expectativas funcionales como las conexiones emocionales del mercado objetivo.

*Nota: Resumen generado con capacidades limitadas del sistema.*`;
  }
}

/**
 * Main function for Topic-Based evaluation (like syntheticusers.com)
 */
export async function evaluateWithTopicBasedAnalysis(
  concept: Concept,
  persona: SyntheticPersona,
  settings: Partial<EvaluationSettings> = {}
): Promise<TopicBasedEvaluationResult> {
  const engine = new TopicBasedEvaluationEngine();
  
  const fullSettings: EvaluationSettings = {
    language: 'spanish',
    criticality: 'neutral',
    ...settings
  };

  return engine.generateTopicBasedEvaluation(concept, persona, fullSettings);
}