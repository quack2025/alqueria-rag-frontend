// =====================================================
// SERVICIO DE DATOS MOCK PARA TESTING INDEPENDIENTE
// Permite testing sin conexión al backend
// =====================================================

export interface MockRAGResponse {
  response: string;
  chunks_retrieved: number;
  similarity_scores: number[];
  sources: string[];
  metadata: {
    client: string;
    persona_used: string;
    query_type: string;
    processing_time: number;
  };
}

export interface MockQualitativeInsights {
  behavioralPatterns: string[];
  emotionalResonance: string[];
  perceptualGaps: string[];
  recommendations: string[];
}

// =====================================================
// MOCK RESPONSES POR CLIENTE
// =====================================================

// === ALQUERÍA MOCK RESPONSES ===
export const ALQUERIA_MOCK_RESPONSES: Record<string, MockRAGResponse> = {
  // Consulta sobre leche
  leche: {
    response: `Como Carmen Patricia, madre de familia en Bogotá, te puedo decir que la **leche Alquería** es parte fundamental en nuestro hogar.

## Mi Experiencia Personal
Uso leche Alquería **4 veces por semana** para mis hijos de 8 y 12 años. La prefiero **entera** porque siento que les da más nutrición, especialmente para el desayuno con cereales y el chocolate caliente de las noches frías bogotanas.

## Por Qué La Elijo
- **Confianza**: Es una marca colombiana que conozco desde niña
- **Precio justo**: Con mi sueldo de contadora ($3,500,000 COP), puedo mantenerla en el presupuesto familiar
- **Calidad**: Mis hijos crecen sanos y fuertes
- **Disponibilidad**: La encuentro en Éxito, Carulla y la tienda del barrio

## Comparación con Otras Marcas
He probado Colanta y Alpina, pero siempre regreso a Alquería. Es como esa receta de la abuela que nunca falla. Parmalat es más costosa y no siento tanta diferencia.

## Para Tu Familia
Si tienes niños, te recomiendo que pruebes. Es esa tranquilidad de saber que estás dando algo bueno, nutritivo y que rinde bien. Mi mamá siempre decía "leche buena, niños fuertes" y tenía razón.

¿Tienes hijos pequeños también? Te entiendo perfectamente esa preocupación por darles lo mejor.`,
    chunks_retrieved: 12,
    similarity_scores: [0.041, 0.038, 0.035, 0.032, 0.031],
    sources: [
      "Estudio_Alqueria_Familias_2024.pdf",
      "Consumer_Insights_Lacteos_Colombia.pdf",
      "Alqueria_Brand_Health_Tracking.pdf"
    ],
    metadata: {
      client: "alqueria",
      persona_used: "madre_nutricional",
      query_type: "product_inquiry",
      processing_time: 2.8
    }
  },

  // Consulta sobre yogurt
  yogurt: {
    response: `¡Hola! Soy Daniela, fitness enthusiast de Medellín, y el **yogurt Alquería** es mi aliado perfecto para mi estilo de vida activo.

## Mi Rutina Diaria
Como **yogurt Alquería griego TODOS los días** - es mi fuente principal de probióticos y proteína post-workout. Me encanta el natural sin azúcar porque se alinea con mis macros fitness.

## Por Qué Es Perfecto Para Fitness
- **Alto contenido proteico**: Ideal para recovery muscular
- **Probióticos**: Mi digestión funciona perfecto
- **Sin azúcar añadido**: No sabotea mis metas fitness
- **Textura cremosa**: Me satisface como snack saludable

## Mi Combo Favorito
Yogurt griego Alquería + berries + granola casera + chia seeds = **desayuno perfecto** que me da energía para mi rutina de gym (5 veces por semana).

## vs. Competencia
He probado Alpina y Danone, pero Alquería tiene mejor relación calidad-precio. Para mis $4,200,000 mensuales como UX designer, es una inversión inteligente en mi salud.

## Tip Fitness
Si estás en journey fitness como yo, te súper recomiendo incluirlo en tu meal prep dominical. Es versátil: smoothies, parfaits, salsas healthy para ensaladas.

¿También entrenas? ¡Te entiendo esa búsqueda del balance perfecto entre rico y saludable!`,
    chunks_retrieved: 11,
    similarity_scores: [0.039, 0.036, 0.034, 0.031, 0.029],
    sources: [
      "Alqueria_Yogurt_Consumer_Study_2024.pdf",
      "Fitness_Nutrition_Trends_Colombia.pdf",
      "Protein_Consumption_Urban_Youth.pdf"
    ],
    metadata: {
      client: "alqueria",
      persona_used: "joven_fitness",
      query_type: "product_inquiry",
      processing_time: 3.1
    }
  },

  // Consulta sobre tradición
  tradicion: {
    response: `¡Ave María! Soy María Esperanza, y te voy a contar sobre **Alquería con cariño de abuela** que lleva 40+ años comprando estos productos.

## La Historia de Siempre
Mijito, yo he comprado **leche y kumis Alquería** desde que se casó mi hija mayor. En esa época costaba pesitos, ahora son miles, pero la calidad sigue igual de buena.

## Tradición Familiar
- **Kumis Alquería**: Es el mismo sabor de toda la vida, cremosito y refrescante
- **Leche**: Para el café de las mañanas y la mazamorra de los domingos
- **Queso campesino**: Para las arepas de desayuno que le hago a mis nietos

## Sabiduría de Años
En mis 67 años he visto marcas venir y irse, pero Alquería permanece. Es como la receta del sancocho: algunos ingredientes cambian, pero la esencia se mantiene.

## Para los Nietos
Mis nietos de 8 y 11 años toman la misma leche Alquería que tomaron sus papás. Es esa continuidad que da tranquilidad. "Lo bueno, bueno se mantiene", como dice mi comadre.

## Consejo de Abuela
Si vas a formar familia, empezá con marcas de confianza. Alquería nunca me ha fallado. Con mi pensión de $1,800,000 cada peso cuenta, pero esto no es gasto, es inversión en salud familiar.

¿Verdad que hay marcas que son como familia? Esas nunca las cambias, mijito.`,
    chunks_retrieved: 10,
    similarity_scores: [0.037, 0.034, 0.031, 0.028, 0.027],
    sources: [
      "Alqueria_Heritage_Brand_Study.pdf",
      "Colombian_Family_Traditions_Dairy.pdf",
      "Generational_Brand_Loyalty_Research.pdf"
    ],
    metadata: {
      client: "alqueria",
      persona_used: "abuela_sabia",
      query_type: "brand_tradition",
      processing_time: 2.5
    }
  }
};

// === UNILEVER MOCK RESPONSES ===
export const UNILEVER_MOCK_RESPONSES: Record<string, MockRAGResponse> = {
  dove: {
    response: `Como Catalina, profesional bogotana, **Dove** es mi marca de confianza para el cuidado personal diario.

## Mi Experiencia
Uso Dove todos los días en mi rutina matutina antes del trabajo. El shampoo y acondicionador me dan esa hidratación perfecta que necesito en el clima frío de Bogotá.

## Por Qué Dove
- **Ingredientes premium**: Siento la diferencia en mi cabello
- **Hidratación profunda**: Perfecto para nuestro clima bogotano
- **Confianza profesional**: Es una marca que refleja mi estilo de vida
- **Resultados consistentes**: Siempre me veo impecable para el trabajo

¿También trabajas en oficina? Sabes que la primera impresión es clave.`,
    chunks_retrieved: 8,
    similarity_scores: [0.033, 0.031, 0.029, 0.027, 0.025],
    sources: [
      "Dove_Colombia_Consumer_Study.pdf",
      "Professional_Women_Beauty_Habits.pdf"
    ],
    metadata: {
      client: "unilever",
      persona_used: "bogotana_profesional",
      query_type: "brand_experience",
      processing_time: 3.2
    }
  }
};

// === MOCK QUALITATIVE INSIGHTS ===
export const MOCK_QUALITATIVE_INSIGHTS: Record<string, MockQualitativeInsights> = {
  alqueria_familias: {
    behavioralPatterns: [
      "Compra familiar semanal de lácteos como rutina establecida",
      "Decisión de compra influenciada por nutrición infantil",
      "Preferencia por marcas colombianas tradicionales",
      "Consumo intensificado en desayunos familiares"
    ],
    emotionalResonance: [
      "Confianza generacional - 'la marca de toda la vida'",
      "Orgullo por elegir productos colombianos",
      "Tranquilidad nutricional para el desarrollo infantil",
      "Conexión emocional con tradiciones culinarias familiares"
    ],
    perceptualGaps: [
      "Desconocimiento sobre nuevos productos Alquería",
      "Percepción de menor innovación vs. competencia internacional",
      "Falta de comunicación sobre beneficios nutricionales específicos",
      "Limitada asociación con tendencias fitness modernas"
    ],
    recommendations: [
      "Fortalecer comunicación sobre tradición e innovación",
      "Desarrollar líneas premium manteniendo accesibilidad",
      "Crear contenido educativo nutricional para madres",
      "Expandir presencia en canales digitales familiares"
    ]
  }
};

// =====================================================
// SERVICIO MOCK PRINCIPAL
// =====================================================
export class MockDataService {

  // === OBTENER RESPUESTA MOCK SEGÚN CLIENTE Y QUERY ===
  static getMockResponse(clientId: string, query: string): MockRAGResponse {
    const queryLower = query.toLowerCase();

    if (clientId === 'alqueria') {
      // Detectar tipo de query para Alquería
      if (queryLower.includes('leche')) {
        return ALQUERIA_MOCK_RESPONSES.leche;
      } else if (queryLower.includes('yogurt') || queryLower.includes('fitness') || queryLower.includes('proteína')) {
        return ALQUERIA_MOCK_RESPONSES.yogurt;
      } else if (queryLower.includes('tradición') || queryLower.includes('familia') || queryLower.includes('kumis')) {
        return ALQUERIA_MOCK_RESPONSES.tradicion;
      } else {
        // Default Alquería response
        return ALQUERIA_MOCK_RESPONSES.leche;
      }
    } else if (clientId === 'unilever') {
      // Detectar tipo de query para Unilever
      if (queryLower.includes('dove')) {
        return UNILEVER_MOCK_RESPONSES.dove;
      } else {
        // Default Unilever response
        return UNILEVER_MOCK_RESPONSES.dove;
      }
    }

    // Fallback
    return ALQUERIA_MOCK_RESPONSES.leche;
  }

  // === OBTENER INSIGHTS CUALITATIVOS MOCK ===
  static getMockInsights(clientId: string, query: string): MockQualitativeInsights {
    if (clientId === 'alqueria') {
      return MOCK_QUALITATIVE_INSIGHTS.alqueria_familias;
    }

    // Default insights
    return MOCK_QUALITATIVE_INSIGHTS.alqueria_familias;
  }

  // === SIMULAR DELAY DE PROCESAMIENTO ===
  static async simulateProcessingDelay(minMs: number = 1000, maxMs: number = 3000): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // === GENERAR RESPUESTA MOCK COMPLETA ===
  static async generateMockRAGResponse(
    clientId: string,
    personaId: string,
    query: string
  ): Promise<{
    response: MockRAGResponse;
    insights: MockQualitativeInsights;
  }> {
    // Simular delay de procesamiento
    await this.simulateProcessingDelay(1500, 3500);

    const response = this.getMockResponse(clientId, query);
    const insights = this.getMockInsights(clientId, query);

    // Actualizar metadata con persona específica
    response.metadata.persona_used = personaId;

    return {
      response,
      insights
    };
  }
}

// =====================================================
// FUNCIONES DE CONVENIENCIA
// =====================================================
export const getMockResponseForQuery = (clientId: string, query: string) => {
  return MockDataService.getMockResponse(clientId, query);
};

export const generateFullMockResponse = (clientId: string, personaId: string, query: string) => {
  return MockDataService.generateMockRAGResponse(clientId, personaId, query);
};