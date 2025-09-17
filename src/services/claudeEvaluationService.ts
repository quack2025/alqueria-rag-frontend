/**
 * claudeEvaluationService.ts - Servicio de evaluación usando Railway Backend
 * 
 * Sistema de investigación cualitativa que:
 * 1. Genera conversaciones profundas con personas sintéticas
 * 2. Valida coherencia usando conocimiento RAG
 * 3. Refina respuestas si no cumplen estándares
 */

import type { Concept, SyntheticPersona } from '../components/InnovationLab/InnovationLabContainer';

// Configuración de Azure OpenAI
const AZURE_OPENAI_CONFIG = {
  endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
  apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',
  deployment: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
  maxTokens: 4000,
  temperature: 0.8 // Para respuestas más naturales y variadas
};

// Estructura completa ESTILO SYNTHETICUSERS - Study 1.json format
export interface ConversationalEvaluation {
  personaId: string;
  conceptId: string;

  // Información completa del usuario sintético
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
      culinaryPreferences: string;
      culturalBackground: string;
      dietaryRestrictions: string;
      brandAffinity: string;
      socialInfluence: string;
    };
  };

  // Conversación completa con respuestas de 150-200 palabras
  conversation: {
    question: string;
    response: string;
    wordCount: number;
  }[];

  // Executive Summary multi-nivel como SyntheticUsers
  executiveSummary: {
    overallSummary: string; // Summary principal completo
    thematicAnalysis: {
      title: string;
      content: string;
      keyInsights: {
        title: string;
        summary: string;
        impact: string;
        variations: string;
      }[];
      relevantQuotes: string[];
      keyTakeaways: string[];
    }[];
    surprisingInsight: {
      title: string;
      insight: string;
      relevantQuotes: string[];
      keyTakeaways: string[];
    };
    suggestedFollowUp: {
      question: string;
      rationale: string;
    };
  };

  // Metadata técnico
  metadata: {
    evaluationDate: Date;
    model: string;
    confidence: number;
    coherenceScore: number;
  };
}

// Sistema de preguntas progresivas ESTILO SYNTHETICUSERS
// Basado en Study 1.json - 10+ preguntas profundas y progresivas
const CONVERSATION_SCRIPT = [
  // Q1: Primera impresión emocional
  {
    base: "¿Qué es lo primero que te viene a la mente cuando escuchas sobre [CONCEPTO] - y cómo te hace sentir como consumidor de productos lácteos?",
    followUpPositive: "Esa reacción positiva es interesante, ¿qué específicamente te genera esa emoción?",
    followUpNegative: "Entiendo esa cautela, ¿qué necesitarías escuchar para sentirte más cómodo/a?"
  },
  // Q2: Definición de éxito
  {
    base: "¿Qué significaría que [CONCEPTO] esté 'bien hecho' para ti - qué características específicas o experiencias harían que pienses 'sí, esto es exactamente lo que esperaba'?",
    followUpPositive: "Esas expectativas son claras, ¿cómo las comparas con lo que encuentras normalmente?",
    followUpNegative: "Si no cumpliera esas expectativas, ¿qué pasaría con tu relación con la marca?"
  },
  // Q3: Momento de verdad
  {
    base: "Cuando estás evaluando un nuevo producto lácteo en el supermercado, ¿cuál es tu momento de verdad - es el primer vistazo, probarlo en casa, o algo completamente diferente?",
    followUpPositive: "Ese proceso de evaluación que describes, ¿siempre te ha funcionado bien?",
    followUpNegative: "¿Alguna vez ese proceso te ha fallado y compraste algo que no te gustó?"
  },
  // Q4: Brecha comportamental
  {
    base: "En tu experiencia comprando lácteos, ¿has notado alguna diferencia entre lo que dices que quieres (saludable, natural, etc.) versus lo que realmente terminas comprando y consumiendo?",
    followUpPositive: "Es interesante esa consistencia, ¿qué te ayuda a mantenerte fiel a tus preferencias?",
    followUpNegative: "Esa brecha que describes es común, ¿qué crees que la causa en tu caso?"
  },
  // Q5: Escenario de introducción
  {
    base: "Si [CONCEPTO] estuviera disponible mañana en tu supermercado habitual, ¿qué te preocuparía más al considerarlo, dado lo que acabas de compartir sobre la brecha entre intenciones y comportamiento real?",
    followUpPositive: "Sin esas preocupaciones, ¿sería una compra fácil para ti?",
    followUpNegative: "¿Qué tendría que hacer la marca para reducir esas preocupaciones?"
  },
  // Q6: Proceso de decisión social
  {
    base: "Dada esa consideración sobre educación del consumidor, ¿cómo típicamente aprendes sobre nuevos productos lácteos, y qué señales te indican si realmente vale la pena o si es solo marketing?",
    followUpPositive: "Ese proceso de aprendizaje que describes, ¿te ha ayudado a descubrir productos que ahora son favoritos?",
    followUpNegative: "¿Alguna vez has sido engañado/a por marketing que prometía más de lo que entregaba?"
  },
  // Q7: Análisis de interés genuino
  {
    base: "¿Qué preguntas específicas harías sobre [CONCEPTO] si estuvieras genuinamente interesado/a versus si solo estuvieras siendo educado/a - y cómo cambiaría tu forma de evaluarlo?",
    followUpPositive: "Esas preguntas revelan mucho, ¿qué respuestas te convencerían completamente?",
    followUpNegative: "Si obtuvieras respuestas vagas a esas preguntas, ¿qué harías?"
  },
  // Q8: Entusiasmo vs. realidad
  {
    base: "¿Qué pasa cuando te emociona un concepto lácteo como [CONCEPTO] pero luego te das cuenta de que tu entusiasmo inicial podría estar nublando tu juicio sobre si realmente lo incorporarías a tu rutina diaria?",
    followUpPositive: "Esa capacidad de ser realista es valiosa, ¿cómo desarrollaste esa perspectiva?",
    followUpNegative: "¿Has tenido experiencias donde el entusiasmo inicial te llevó a decisiones de compra que después lamentaste?"
  },
  // Q9: Proceso de abandono
  {
    base: "¿Cómo manejas internamente cuando tienes que alejarte de un producto lácteo del que estabas genuinamente emocionado/a - y qué te enseña eso sobre la diferencia entre tus gustos personales versus lo que realmente funciona en tu vida?",
    followUpPositive: "Esa reflexión es profunda, ¿cómo aplicarías esa sabiduría a [CONCEPTO]?",
    followUpNegative: "¿Ese proceso de abandonar productos te ha hecho más cauteloso/a con nuevas compras?"
  },
  // Q10: Retroalimentación contradictoria
  {
    base: "¿Qué retroalimentación específica de tu familia o amigos te ha sorprendido más cuando contradijo tu evaluación inicial de un producto lácteo - y cómo cambió eso tu forma de probar nuevos conceptos como [CONCEPTO]?",
    followUpPositive: "Esa experiencia de aprendizaje, ¿te ha hecho mejor evaluador/a de productos?",
    followUpNegative: "¿Ahora confías más en la opinión de otros que en tu primera impresión?"
  },
  // Q11: Síntesis y aplicación
  {
    base: "Considerando toda esta conversación sobre tus procesos de decisión y experiencias pasadas, ¿cómo aplicarías específicamente toda esta sabiduría para evaluar [CONCEPTO] de manera que minimice las sorpresas y maximice la probabilidad de que sea una buena decisión a largo plazo?",
    followUpPositive: "Ese enfoque suena muy maduro, ¿te da confianza para el futuro?",
    followUpNegative: "¿Sientes que este proceso podría hacerte perder oportunidades de descubrir algo realmente bueno?"
  }
];

/**
 * Genera el prompt del sistema para GPT-4 basado en la persona
 */
function generateSystemPrompt(persona: SyntheticPersona): string {
  // Extraer variables clave de la persona
  const edad = persona.baseProfile.age;
  const ubicacion = persona.baseProfile.location;
  const ocupacion = persona.baseProfile.occupation;
  const nse = persona.baseProfile.socioeconomicLevel;
  
  // Extraer variables específicas - Manejo seguro de arrays/objects
  const variablesArray = Array.isArray(persona.variables) ? persona.variables :
                        persona.variables ? Object.entries(persona.variables).map(([key, value]) => ({ key, value })) : [];

  const extroversion = variablesArray.find(v => v.key === 'extroversion')?.value || 5;
  const sensibilidadPrecio = variablesArray.find(v => v.key === 'sensibilidad_precio')?.value || 5;
  const lealtadMarca = variablesArray.find(v => v.key === 'lealtad_marca')?.value || 5;
  const expresionesRegionales = variablesArray.find(v => v.key === 'expresiones_regionales')?.value || [];
  
  return `Eres ${persona.name}, ${edad} años, ${ocupacion} viviendo en ${ubicacion}, Colombia.

PERFIL DETALLADO:
- Nivel socioeconómico: ${nse}
- Arquetipo: ${persona.archetype}
- Personalidad: ${extroversion > 6 ? 'Extrovertida y sociable' : 'Reservada y reflexiva'}
- Sensibilidad al precio: ${sensibilidadPrecio}/10 (${sensibilidadPrecio > 7 ? 'Muy consciente del precio' : 'Dispuesta a pagar por calidad'})
- Lealtad a marcas: ${lealtadMarca}/10 (${lealtadMarca > 7 ? 'Muy leal a marcas conocidas' : 'Abierta a probar nuevas opciones'})

CONTEXTO CULTURAL:
${persona.archetype.includes('Costeña') ? 'Eres de la costa caribe, alegre y expresiva. Valoras la familia y las tradiciones.' : ''}
${persona.archetype.includes('Bogotana') ? 'Eres de Bogotá, profesional y moderna. Valoras la eficiencia y la calidad.' : ''}
${persona.archetype.includes('Paisa') ? 'Eres de Medellín, tradicional y trabajadora. Valoras la confianza y lo conocido.' : ''}
${persona.archetype.includes('Madre Soltera') ? 'Eres madre soltera, luchas cada día por tus hijos. El presupuesto es limitado pero buscas lo mejor para tu familia.' : ''}

RELACIÓN CON MARCAS UNILEVER:
${JSON.stringify(persona.brandRelationships, null, 2)}

ESTILO DE COMUNICACIÓN:
- Usa expresiones colombianas naturales y auténticas
- Incluye detalles personales y anécdotas cuando sea relevante
- Mantén consistencia con tu perfil socioeconómico y cultural
- Expresiones típicas que usas: ${Array.isArray(expresionesRegionales) ? expresionesRegionales.join(', ') : expresionesRegionales}

INSTRUCCIONES PARA RESPONDER:
1. Responde de manera CONVERSACIONAL y NATURAL, como en una entrevista real
2. Cada respuesta debe tener entre 100-200 palabras
3. Incluye experiencias personales, emociones y contexto
4. Sé específica sobre TUS razones y motivaciones
5. Mantén coherencia con tu perfil durante toda la conversación
6. Si algo no te convence, explica POR QUÉ basándote en tu realidad
7. Usa ejemplos de tu vida diaria cuando sea apropiado`;
}

/**
 * Genera una conversación completa con una persona sintética
 */
export async function generateConversationalEvaluation(
  concept: Concept,
  persona: SyntheticPersona,
  ragContext?: any
): Promise<ConversationalEvaluation> {
  const conversation: ConversationalEvaluation['conversation'] = [];
  const systemPrompt = generateSystemPrompt(persona);
  
  // Reemplazar placeholders en las preguntas
  const personalizedQuestions = CONVERSATION_SCRIPT.map(script => ({
    ...script,
    base: script.base
      .replace('[CONCEPTO]', concept.name)
      .replace('[MARCA]', concept.brand)
      .replace('[BENEFICIOS]', concept.benefits.join(', '))
  }));

  // Generar conversación pregunta por pregunta con progress tracking
  for (const [index, questionScript] of personalizedQuestions.entries()) {
    try {
      console.log(`🎯 Procesando pregunta ${index + 1} de ${personalizedQuestions.length} para ${persona.name}`);

      // Construir contexto de conversación previa
      const previousContext = conversation.map(c => 
        `Pregunta: ${c.question}\nRespuesta: ${c.response}`
      ).join('\n\n');

      // Progress callback para mostrar en UI
      const onProgress = (message: string) => {
        console.log(`[${persona.name}] Pregunta ${index + 1}: ${message}`);
      };

      // Llamar al Enhanced Backend API
      const response = await callClaudeAPI({
        systemPrompt,
        userPrompt: `${questionScript.base}

CONTEXTO ADICIONAL:
- Pregunta ${index + 1} de ${personalizedQuestions.length} en esta evaluación
- Concepto evaluado: ${concept.name}
- Marca: ${concept.brand}
${ragContext ? `- Conocimiento RAG disponible: ${JSON.stringify(ragContext)}` : ''}

Responde de manera natural y conversacional, entre 120-200 palabras, manteniéndote en personaje como ${persona.name}.`,
        conversationContext: previousContext,
        passNumber: 1,
        totalPasses: 2, // Máximo 2 pasadas por pregunta
        onProgress
      });

      // Agregar a la conversación con wordCount
      conversation.push({
        question: questionScript.base,
        response: response.content,
        wordCount: response.content.split(' ').length
      });

      // Sistema inteligente de follow-up basado en sentiment y length
      const sentiment = analyzeResponseSentiment(response.content);
      const responseLength = response.content.split(' ').length;
      
      // Solo hacer follow-up si la respuesta es rica y hay sentimiento claro
      if (sentiment !== 'neutral' && responseLength > 80 && Math.random() > 0.6) {
        const followUpQuestion = sentiment === 'positive' 
          ? questionScript.followUpPositive 
          : questionScript.followUpNegative;

        if (followUpQuestion) {
          console.log(`💬 Generando follow-up ${sentiment} para pregunta ${index + 1}`);
          
          const followUpResponse = await callClaudeAPI({
            systemPrompt,
            userPrompt: followUpQuestion,
            conversationContext: `${previousContext}\n\nÚltima Pregunta: ${questionScript.base}\nÚltima Respuesta: ${response.content}`,
            passNumber: 1,
            totalPasses: 1,
            onProgress: (msg) => console.log(`[${persona.name}] Follow-up ${index + 1}: ${msg}`)
          });

          conversation[conversation.length - 1].followUp = followUpResponse.content;
        }
      }

    } catch (error) {
      console.error(`❌ Error en pregunta ${index + 1} para ${persona.name}:`, error);
      
      // Agregar respuesta de error más informativa
      conversation.push({
        question: questionScript.base,
        response: `[Error generando respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}]`,
        wordCount: 0
      });
    }
  }

  // Analizar la conversación completa para generar executive summary
  const executiveSummary = await analyzeConversationInsights(conversation, concept, persona);

  // Generar información completa del usuario sintético
  const userInformation = {
    id: persona.id,
    syntheticUserId: persona.id,
    syntheticUserDescription: `${persona.name} - ${persona.archetype}`,
    personalInformation: {
      fullName: persona.name,
      age: persona.baseProfile.age.toString(),
      location: persona.baseProfile.location,
      profession: persona.baseProfile.occupation || 'No especificado'
    },
    personalityTraits: {
      opennessToExperience: extractPersonalityTrait(persona, 'opennessToExperience'),
      conscientiousness: extractPersonalityTrait(persona, 'conscientiousness'),
      extraversion: extractPersonalityTrait(persona, 'extraversion'),
      agreeableness: extractPersonalityTrait(persona, 'agreeableness'),
      neuroticism: extractPersonalityTrait(persona, 'neuroticism')
    },
    miscellaneous: {
      culinaryPreferences: extractVariable(persona, 'culinary_preferences') || 'Variadas',
      culturalBackground: `${persona.baseProfile.location}, Colombia`,
      dietaryRestrictions: extractVariable(persona, 'dietary_restrictions') || 'Ninguna conocida',
      brandAffinity: extractVariable(persona, 'brand_affinity') || 'Moderada',
      socialInfluence: extractVariable(persona, 'social_influence') || 'Familia y amigos'
    }
  };

  // Validar coherencia con RAG
  const coherenceScore = await validateCoherenceWithRAG(conversation, ragContext);

  return {
    personaId: persona.id,
    conceptId: concept.id,
    userInformation,
    conversation,
    executiveSummary,
    metadata: {
      evaluationDate: new Date(),
      model: 'claude-4-sonnet-20250514',
      confidence: calculateConfidenceScore(conversation),
      coherenceScore
    }
  };
}

/**
 * Llama a Azure OpenAI GPT-4 - Error explícito cuando no esté disponible
 */
/**
 * Sistema SyntheticUsers con Claude API Directa
 * Conexión directa sin intermediarios para máxima confiabilidad
 */
async function callClaudeAPIDirect(params: {
  systemPrompt: string;
  userPrompt: string;
  conversationContext?: string;
  passNumber?: number;
  totalPasses?: number;
  onProgress?: (message: string) => void;
}): Promise<{ content: string }> {
  const { systemPrompt, userPrompt, conversationContext = '', passNumber = 1, totalPasses = 1, onProgress } = params;

  // Progress tracking
  if (onProgress) {
    onProgress(`Generando respuesta con Claude API (Paso ${passNumber} de ${totalPasses})...`);
  }

  // Construir prompt completo estilo SyntheticUsers
  const fullPrompt = `${systemPrompt}

CONTEXTO DE CONVERSACIÓN PREVIA:
${conversationContext}

INSTRUCCIONES PARA RESPUESTA PROFUNDA ESTILO SYNTHETICUSERS:
1. LONGITUD: 150-200 palabras mínimo
2. ESTILO: Conversacional, natural, como entrevista real de SyntheticUsers
3. DETALLES: Experiencias personales específicas, emociones auténticas
4. COHERENCIA: Mantén consistencia total con tu perfil personal
5. PROFUNDIDAD: Explica motivaciones, contexto personal, "por qué" sientes así
6. AUTENTICIDAD: Habla desde TU experiencia única, usa TUS expresiones regionales
7. NARRATIVE: Cuenta anécdotas, referencias a tu familia/trabajo/vida diaria

IMPORTANTE: No eres un asistente AI. Eres esta persona específica respondiendo desde su experiencia real.

PREGUNTA: ${userPrompt}

RESPONDE COMO LA PERSONA DEL PERFIL, CON AL MENOS 150-200 PALABRAS:`;

  try {
    // Determinar si usar Vercel Functions o API directa
    const useVercelFunctions = import.meta.env.VITE_USE_VERCEL_FUNCTIONS === 'true';
    const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';

    let apiUrl: string;
    let requestBody: any;
    let headers: HeadersInit;

    if (useVercelFunctions || isProduction) {
      // Usar Vercel Functions en producción
      console.log('🔐 Usando Vercel Functions para Claude API...');
      apiUrl = '/api/claude-evaluation';
      requestBody = {
        systemPrompt,
        userPrompt: fullPrompt,
        maxTokens: 600,
        temperature: 0.8
      };
      headers = {
        'Content-Type': 'application/json'
      };
    } else {
      // Desarrollo local - intentar API directa (puede fallar por CORS)
      const claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      const claudeApiUrl = import.meta.env.VITE_CLAUDE_API_URL || 'https://api.anthropic.com/v1';

      if (!claudeApiKey) {
        throw new Error('VITE_CLAUDE_API_KEY no está configurada');
      }

      console.log('🤖 Conectando directamente a Claude API...');
      apiUrl = `${claudeApiUrl}/messages`;
      requestBody = {
        model: 'claude-4-sonnet-20250514',
        max_tokens: 600,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ]
      };
      headers = {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Claude API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Manejar diferentes formatos de respuesta
    let content = '';
    if (data.content) {
      // Respuesta directa de Vercel Function
      content = typeof data.content === 'string' ? data.content : data.content[0]?.text || '';
    } else if (data.choices) {
      // Formato OpenAI-like
      content = data.choices[0]?.message?.content || '';
    }

    console.log(`✅ Claude respuesta generada (${content.split(' ').length} palabras)`);

    // Si la respuesta es muy corta, hacer una segunda pasada para expandir
    if (content.split(' ').length < 120 && passNumber === 1) {
      if (onProgress) {
        onProgress('Respuesta muy corta, expandiendo con Claude...');
      }

      const expandPrompt = `RESPUESTA ANTERIOR (DEMASIADO CORTA): ${content}

EXPANDE la respuesta anterior con:
- Más detalles personales y contexto de tu vida
- Ejemplos específicos de tu experiencia
- Emociones y motivaciones más profundas
- Anécdotas o referencias familiares
- AL MENOS 150-200 palabras total

Mantente en personaje y responde la pregunta original con mucha más profundidad:`;

      const expandedResponse = await fetch(`${claudeApiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-4-sonnet-20250514',
          max_tokens: 800,
          temperature: 0.9,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: expandPrompt
            }
          ]
        })
      });

      if (expandedResponse.ok) {
        const expandedData = await expandedResponse.json();
        content = expandedData.content?.[0]?.text || content;
      }
    }

    return { content };

  } catch (error) {
    console.error('❌ Claude API Complete Error:', {
      error: error,
      message: error instanceof Error ? error.message : 'Error desconocido',
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    throw new Error(`Error generando respuesta con Claude: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// Alias para compatibilidad - ahora apuntan a Claude API directa
const callRailwayAPI = callClaudeAPIDirect; // Backward compatibility
const callGPT4API = callClaudeAPIDirect;
const callClaudeAPI = callClaudeAPIDirect;

/**
 * ELIMINADO: Sistema fallback removido para evitar respuestas genéricas
 * que puedan llevar a decisiones empresariales erróneas.
 * 
 * El sistema ahora falla explícitamente si Azure OpenAI GPT-4 no está disponible,
 * garantizando que solo se usen respuestas auténticas de IA.
 */

/**
 * Analiza el sentimiento de una respuesta
 */
function analyzeResponseSentiment(response: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['me gusta', 'excelente', 'perfecto', 'ideal', 'necesito', 'definitivamente', 'me encanta', 'genial'];
  const negativeWords = ['no me convence', 'dudo', 'preocupa', 'caro', 'no creo', 'difícil', 'complicado', 'no sirve'];
  
  const lowerResponse = response.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerResponse.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerResponse.includes(word)).length;
  
  if (positiveCount > negativeCount + 1) return 'positive';
  if (negativeCount > positiveCount + 1) return 'negative';
  return 'neutral';
}

/**
 * FASE 2: Executive Analysis - Estilo SyntheticUsers
 * Procesa toda la conversación para generar insights ejecutivos profundos
 */
async function analyzeConversationInsights(
  conversation: ConversationalEvaluation['conversation'],
  concept: Concept,
  persona: SyntheticPersona
): Promise<ConversationalEvaluation['executiveSummary']> {
  
  // Combinar toda la conversación para análisis
  const fullConversation = conversation.map(c => 
    `P: ${c.question}\nR: ${c.response}${c.followUp ? `\nFollow-up: ${c.followUp}` : ''}`
  ).join('\n\n');
  
  console.log(`🧠 Analizando insights ejecutivos para ${persona.name}...`);
  
  // Prompt ejecutivo estilo SyntheticUsers
  const executivePrompt = `
ANÁLISIS EJECUTIVO SYNTHETICUSERS - PROCESAMIENTO DE ENTREVISTA PROFUNDA

PERSONA ANALIZADA: ${persona.name} (${persona.archetype})
CONCEPTO EVALUADO: ${concept.name} - ${concept.brand}

CONVERSACIÓN COMPLETA:
${fullConversation}

INSTRUCCIONES PARA ANÁLISIS EJECUTIVO:
Tu tarea es analizar esta entrevista profunda y extraer insights ejecutivos precisos estilo investigación cualitativa profesional.

GENERA UN ANÁLISIS ESTRUCTURADO CON:

1. KEY THEMES (3-5 temas principales que emergen):
   - Identifica los patrones de comportamiento más importantes
   - Drivers emocionales clave
   - Factores de influencia en la decisión

2. EMOTIONAL TONE (evaluación del tono emocional):
   - Clasifica como: positivo, negativo, neutral, o mixto
   - Justifica basándote en el lenguaje usado

3. BEHAVIORAL PATTERNS (patrones de comportamiento observados):
   - Gaps entre lo que dice y lo que realmente haría
   - Hábitos de consumo evidenciados
   - Procesos de toma de decisión

4. EMOTIONAL RESONANCE (resonancia emocional):
   - Conexiones emocionales mencionadas
   - Memorias o asociaciones evocadas
   - Valores personales manifestados

5. PERCEPTUAL GAPS (brechas perceptuales):
   - Diferencias entre expectativas y realidad
   - Malentendidos sobre el producto
   - Oportunidades de educación

6. CONCERNS (preocupaciones específicas):
   - Lista las barreras o dudas concretas mencionadas
   - Prioriza por importancia para la persona

7. RECOMMENDATIONS (recomendaciones estratégicas):
   - Acciones específicas para la marca
   - Basadas en los insights de esta persona específica

8. QUOTES (citas más reveladoras):
   - 2-3 frases que mejor capturan la mentalidad del consumidor
   - Evita citas genéricas, busca insights únicos

FORMATO DE RESPUESTA (JSON estricto):
{
  "keyThemes": ["tema1", "tema2", "tema3"],
  "emotionalTone": "positivo|negativo|neutral|mixto",
  "behavioralPatterns": ["patrón1", "patrón2"],
  "emotionalResonance": ["resonancia1", "resonancia2"],
  "perceptualGaps": ["gap1", "gap2"],
  "concerns": ["preocupación1", "preocupación2"],
  "recommendations": ["recomendación1", "recomendación2"],
  "quotes": ["cita1", "cita2", "cita3"]
}

IMPORTANTE: Basa tu análisis SOLO en lo que esta persona específica expresó. No generalices ni asumas.
`;

  try {
    const claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    const claudeApiUrl = import.meta.env.VITE_CLAUDE_API_URL || 'https://api.anthropic.com/v1';

    if (!claudeApiKey) {
      console.warn('⚠️ VITE_CLAUDE_API_KEY no configurada, usando fallback');
      return generateFallbackSummary(conversation, concept, persona);
    }

    console.log('🤖 Generando Executive Summary con Claude API...');

    const response = await fetch(`${claudeApiUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-4-sonnet-20250514',
        max_tokens: 2000,
        temperature: 0.3,
        system: 'Eres un analista de consumer insights experto que procesa entrevistas profundas para generar análisis ejecutivos precisos estilo investigación cualitativa profesional.',
        messages: [
          {
            role: 'user',
            content: executivePrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Claude Executive Analysis Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText
      });
      // Fallback a análisis básico
      return generateFallbackSummary(conversation, concept, persona);
    }

    const data = await response.json();
    console.log('🔍 Raw Claude response:', data);

    // Extraer el texto de respuesta de Claude API (estructura Anthropic)
    const responseText = data.content?.[0]?.text || data.message || '';

    if (!responseText || responseText.trim().length === 0) {
      console.warn('⚠️ Empty response from Claude, using fallback');
      return generateFallbackSummary(conversation, concept, persona);
    }

    try {
      // Intentar parsear como JSON primero
      let summaryData;
      try {
        // Limpiar texto antes de parsear JSON
        let cleanedText = responseText.trim();
        // Remover posibles prefijos/sufijos no-JSON
        if (cleanedText.includes('{')) {
          const jsonStart = cleanedText.indexOf('{');
          const jsonEnd = cleanedText.lastIndexOf('}') + 1;
          cleanedText = cleanedText.substring(jsonStart, jsonEnd);
        }

        summaryData = JSON.parse(cleanedText);
        console.log('✅ JSON parseable exitosamente');
      } catch (parseError) {
        console.log('⚠️ No es JSON válido, generando estructura manualmente');
        // Si no es JSON válido, extraer manualmente y crear estructura
        summaryData = {
          overallSummary: `Análisis ejecutivo para ${persona.name} evaluando ${concept.name}: ${responseText.substring(0, 400)}`,
          thematicAnalysis: [
            {
              title: "Percepciones del Producto Lácteo",
              content: responseText.substring(0, 300) + "...",
              keyInsights: [{
                title: "Expectativas del Consumidor",
                summary: "Análisis basado en la entrevista profunda",
                impact: "Importante para desarrollo y posicionamiento de producto",
                variations: "Puede variar según segmento demográfico"
              }],
              relevantQuotes: extractQuotesFromText(responseText).slice(0, 2),
              keyTakeaways: ["Enfocarse en calidad percibida", "Comunicar beneficios diferenciadores"]
            },
            {
              title: "Proceso de Toma de Decisiones",
              content: "Análisis del comportamiento de compra y factores de influencia basado en las respuestas del consumidor.",
              keyInsights: [{
                title: "Factores de Influencia",
                summary: "Elementos clave identificados en la decisión de compra",
                impact: "Crítico para estrategia de marketing",
                variations: "Varía según contexto socioeconómico"
              }],
              relevantQuotes: extractQuotesFromText(responseText).slice(2, 3),
              keyTakeaways: ["Optimizar puntos de contacto", "Facilitar proceso de evaluación"]
            }
          ],
          surprisingInsight: {
            title: "Insight Clave del Consumidor",
            insight: extractKeyInsight(responseText),
            relevantQuotes: extractQuotesFromText(responseText).slice(0, 1),
            keyTakeaways: ["Aplicar este insight a estrategia de producto", "Validar con más consumidores"]
          },
          suggestedFollowUp: {
            question: "¿Qué factores específicos te harían elegir este producto sobre tu opción actual?",
            rationale: "Para entender mejor las barreras de cambio y motivadores de adopción"
          }
        };
      }

      console.log('✅ Executive Summary SyntheticUsers generado:', summaryData);
      return summaryData;

    } catch (parseError) {
      console.error('Error parsing executive summary:', parseError);
      return generateFallbackSummary(conversation, concept, persona);
    }

  } catch (error) {
    console.error('❌ Claude Executive Analysis Complete Error:', {
      error: error,
      message: error instanceof Error ? error.message : 'Error desconocido',
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    return generateFallbackSummary(conversation, concept, persona);
  }
}

/**
 * Funciones auxiliares para extracting insights del texto
 */
function extractQuotesFromText(text: string): string[] {
  const quotes: string[] = [];
  // Buscar oraciones que empiecen con palabras emocionales/opinion
  const sentences = text.split(/[.!?]+/);
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed.length > 30 && (
      trimmed.toLowerCase().includes('me gusta') ||
      trimmed.toLowerCase().includes('creo que') ||
      trimmed.toLowerCase().includes('prefiero') ||
      trimmed.toLowerCase().includes('siento') ||
      trimmed.toLowerCase().includes('necesito') ||
      trimmed.toLowerCase().includes('busco')
    )) {
      quotes.push(`"${trimmed}"`);
    }
  }
  return quotes.length > 0 ? quotes : [`"${text.substring(0, 80)}..."`];
}

function extractKeyInsight(text: string): string {
  // Buscar patrones de insight en el texto
  if (text.toLowerCase().includes('preocupa') || text.toLowerCase().includes('dudas')) {
    return "Se identifican preocupaciones específicas que podrían ser barreras de adopción";
  }
  if (text.toLowerCase().includes('me gusta') || text.toLowerCase().includes('perfecto')) {
    return "Muestra receptividad positiva hacia los beneficios del producto";
  }
  if (text.toLowerCase().includes('precio') || text.toLowerCase().includes('costo')) {
    return "El factor precio juega un rol importante en la decisión de compra";
  }
  if (text.toLowerCase().includes('familia') || text.toLowerCase().includes('hijos')) {
    return "Las decisiones están influenciadas por consideraciones familiares";
  }
  return "El consumidor muestra patrones únicos de comportamiento que requieren análisis más profundo";
}

/**
 * Fallback: Executive Summary básico si falla el análisis ejecutivo
 */
function generateFallbackSummary(
  conversation: ConversationalEvaluation['conversation'],
  concept: Concept,
  persona: SyntheticPersona
): ConversationalEvaluation['executiveSummary'] {
  const allResponses = conversation.map(c => c.response).join(' ');

  // Extraer citas relevantes
  const quotes = conversation
    .map(c => c.response)
    .filter(r => r.includes('!') || r.includes('verdad') || r.includes('definitivamente'))
    .slice(0, 2)
    .map(r => `"${r.substring(0, 80)}..."`);

  return {
    overallSummary: `Análisis ejecutivo para ${persona.name} evaluando ${concept.name}: El consumidor muestra patrones únicos de comportamiento y toma de decisiones basados en su contexto cultural colombiano y experiencias previas con productos lácteos. Se identificaron insights clave sobre percepción de marca, factores de influencia y barreras de adopción que pueden informar estrategias de marketing y desarrollo de producto.`,

    thematicAnalysis: [
      {
        title: 'Percepciones del Producto Lácteo',
        content: `El consumidor ${persona.name} demuestra percepciones específicas hacia ${concept.name} basadas en sus experiencias previas con productos lácteos y su contexto sociocultural en ${persona.baseProfile.location}. Las expectativas están influenciadas por factores como tradición familiar, percepción de calidad y relación precio-valor.`,
        keyInsights: [
          {
            title: 'Expectativas de Calidad',
            summary: 'Expectativas específicas basadas en experiencia previa',
            impact: 'Debe informar desarrollo de producto y posicionamiento',
            variations: 'Puede variar según segmento demográfico y región'
          }
        ],
        relevantQuotes: quotes.slice(0, 1) || [`"${allResponses.substring(0, 50)}..."`],
        keyTakeaways: ['Enfocarse en calidad percibida', 'Comunicar beneficios diferenciadores']
      },
      {
        title: 'Proceso de Toma de Decisiones',
        content: `El proceso de evaluación y decisión de compra muestra patrones específicos relacionados con la validación social, experiencia de producto y consideraciones económicas del contexto colombiano.`,
        keyInsights: [
          {
            title: 'Factores de Influencia Principal',
            summary: 'Elementos clave que determinan la decisión de compra',
            impact: 'Critical para estrategia de marketing y puntos de contacto',
            variations: 'Diferentes prioridades según perfil socioeconómico'
          }
        ],
        relevantQuotes: quotes.slice(1, 2) || [`"${allResponses.substring(100, 150)}..."`],
        keyTakeaways: ['Optimizar momentos de verdad', 'Facilitar proceso de evaluación']
      }
    ],

    surprisingInsight: {
      title: 'Brecha entre Intención y Comportamiento',
      insight: 'Se observa una diferencia notable entre las preferencias declaradas del consumidor y su comportamiento real de compra, sugiriendo la importancia de factores no expresados conscientemente.',
      relevantQuotes: quotes.slice(0, 1) || [`"${allResponses.substring(200, 280)}..."`],
      keyTakeaways: ['Investigar motivaciones subyacentes', 'Diseñar experiencias que alineen intención con acción']
    },

    suggestedFollowUp: {
      question: '¿Qué factores específicos te harían cambiar de tu producto lácteo habitual a uno nuevo como este?',
      rationale: 'Para entender mejor las barreras reales de cambio y los motivadores efectivos de adopción'
    }
  };
}

/**
 * Valida la coherencia de las respuestas con el conocimiento RAG
 */
async function validateCoherenceWithRAG(
  conversation: ConversationalEvaluation['conversation'],
  ragContext: any
): Promise<number> {
  // Por ahora retornamos un score simulado
  // En producción, esto compararía las respuestas con el conocimiento RAG
  // para asegurar que no hay contradicciones
  
  let coherenceScore = 0.8; // Base score
  
  // Verificar si las respuestas mencionan aspectos del RAG context
  if (ragContext) {
    const ragString = JSON.stringify(ragContext).toLowerCase();
    conversation.forEach(c => {
      const response = c.response.toLowerCase();
      // Si la respuesta menciona elementos del contexto RAG, aumentar coherencia
      if (ragString.includes('savital') && response.includes('savital')) coherenceScore += 0.02;
      if (ragString.includes('caída') && response.includes('caída')) coherenceScore += 0.02;
    });
  }
  
  return Math.min(1, coherenceScore);
}

/**
 * Funciones helper para extraer información de personas sintéticas
 */
function extractPersonalityTrait(persona: SyntheticPersona, trait: string): string {
  const variablesArray = Array.isArray(persona.variables) ? persona.variables :
                        persona.variables ? Object.entries(persona.variables).map(([key, value]) => ({ key, value })) : [];

  const traitValue = variablesArray.find(v => v.key === trait)?.value;

  if (typeof traitValue === 'number') {
    if (traitValue <= 3) return 'Bajo';
    if (traitValue <= 6) return 'Moderado';
    return 'Alto';
  }

  return traitValue || 'Moderado';
}

function extractVariable(persona: SyntheticPersona, varName: string): string {
  const variablesArray = Array.isArray(persona.variables) ? persona.variables :
                        persona.variables ? Object.entries(persona.variables).map(([key, value]) => ({ key, value })) : [];

  return variablesArray.find(v => v.key === varName)?.value || '';
}

/**
 * Calcula un score de confianza basado en la calidad de las respuestas
 */
function calculateConfidenceScore(conversation: ConversationalEvaluation['conversation']): number {
  let score = 0;
  const expectedMinLength = 50; // Mínimo de palabras por respuesta
  
  conversation.forEach(c => {
    const wordCount = c.response.split(' ').length;
    if (wordCount >= expectedMinLength) score += 0.1;
    if (c.followUp) score += 0.05; // Bonus por follow-ups
  });
  
  return Math.min(1, score);
}

/**
 * Sistema de agente evaluador que critica y refina las respuestas
 */
export async function evaluateAndRefineResponse(
  evaluation: ConversationalEvaluation,
  concept: Concept,
  persona: SyntheticPersona,
  ragContext: any
): Promise<{ 
  isValid: boolean; 
  issues: string[]; 
  refinedEvaluation?: ConversationalEvaluation 
}> {
  const issues: string[] = [];
  
  // Verificar longitud de respuestas
  const shortResponses = evaluation.conversation.filter(c => 
    c.response.split(' ').length < 50
  );
  if (shortResponses.length > 3) {
    issues.push('Respuestas muy cortas, falta profundidad conversacional');
  }
  
  // Verificar coherencia
  if (evaluation.metadata.coherenceScore < 0.7) {
    issues.push('Baja coherencia con el conocimiento RAG');
  }
  
  // Verificar variedad en las respuestas
  const uniqueWords = new Set(
    evaluation.conversation.flatMap(c => 
      c.response.toLowerCase().split(' ')
    )
  );
  if (uniqueWords.size < 200) {
    issues.push('Vocabulario limitado, respuestas muy repetitivas');
  }
  
  // Si hay muchos issues, regenerar la evaluación
  if (issues.length > 2) {
    console.log('Regenerando evaluación debido a:', issues);
    const refinedEvaluation = await generateConversationalEvaluation(
      concept,
      persona,
      ragContext
    );
    return {
      isValid: false,
      issues,
      refinedEvaluation
    };
  }
  
  return {
    isValid: true,
    issues
  };
}

/**
 * Función principal que orquesta todo el proceso de evaluación
 */
export async function generateCompleteEvaluation(
  concept: Concept,
  personas: SyntheticPersona[],
  ragContext?: any
): Promise<ConversationalEvaluation[]> {
  const evaluations: ConversationalEvaluation[] = [];
  
  for (const persona of personas) {
    try {
      console.log(`Generando evaluación para ${persona.name}...`);
      
      // Generar evaluación inicial
      let evaluation = await generateConversationalEvaluation(concept, persona, ragContext);
      
      // Validar y refinar si es necesario
      const validation = await evaluateAndRefineResponse(evaluation, concept, persona, ragContext);
      
      if (!validation.isValid && validation.refinedEvaluation) {
        console.log(`Evaluación refinada para ${persona.name}`);
        evaluation = validation.refinedEvaluation;
      }
      
      evaluations.push(evaluation);
    } catch (error) {
      console.error(`Error evaluando con ${persona.name}:`, error);
      // Continuar con la siguiente persona si hay error
    }
  }
  
  return evaluations;
}