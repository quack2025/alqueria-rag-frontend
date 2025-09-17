// data/unileverQuestions.ts - Preguntas sugeridas específicas para Unilever RAG System

export interface QuestionCategory {
  name: string;
  icon: string;
  questions: string[];
}

// Preguntas optimizadas basadas en testing RAG - Solo alto rendimiento
export const SUGGESTED_QUESTIONS: QuestionCategory[] = [
  {
    name: "Marcas y Productos",
    icon: "🏷️",
    questions: [
      "¿Cuáles son las percepciones principales sobre Dove?",
      "¿Cómo se posiciona Fruco versus la competencia?",
      "¿Qué diferenciadores tiene Pond's versus otras marcas?",
      "¿Cómo ha evolucionado la marca Savital en el mercado capilar?",
      "¿Qué fortalezas competitivas tiene el portfolio de limpieza Unilever?"
    ]
  },
  {
    name: "Segmentación y Audiencias",
    icon: "👥",
    questions: [
      "¿Cuáles son los segmentos principales de consumidores?",
      "¿Cómo varía el comportamiento por edad y género?",
      "¿Qué patrones demográficos definen las preferencias de marca?",
      "¿Cómo se diferencian los hábitos entre NSE A/B versus C/D?"
    ]
  },
  {
    name: "Comportamiento del Consumidor",
    icon: "🛒",
    questions: [
      "¿Qué factores influyen en la decisión de compra?",
      "¿Cuáles son los drivers de lealtad hacia las marcas Unilever?",
      "¿Cómo impactan precio y calidad en la selección de productos?",
      "¿Qué motivaciones subyacen en las ocasiones de uso?"
    ]
  },
  {
    name: "Tendencias y Mercado",
    icon: "📈",
    questions: [
      "¿Cuáles son las tendencias emergentes en cuidado personal?",
      "¿Cómo están evolucionando las preferencias post-pandemia?",
      "¿Qué oportunidades presenta el crecimiento de productos naturales?",
      "¿Cuáles son los insights sobre sustentabilidad en FMCG?"
    ]
  },
  {
    name: "Análisis Transversales",
    icon: "🔍",
    questions: [
      "¿Cómo las evaluaciones de marca influyen en estrategias de desarrollo de productos a través de diferentes categorías?",
      "¿Qué patrones comunes de percepción del consumidor se observan entre alimentos, cuidado personal y limpieza del hogar?",
      "¿Cómo se correlacionan las fortalezas de marca entre Dove, Fruco y Pond's en diferentes segmentos demográficos?",
      "¿Qué insights transversales sobre calidad percibida emergen al comparar múltiples estudios de Unilever?",
      "¿Cómo varían los factores de decisión de compra entre las diferentes categorías del portfolio Unilever?"
    ]
  },
  {
    name: "Insights Estratégicos",
    icon: "⚡",
    questions: [
      "¿Qué oportunidades de cross-selling existen entre marcas del portfolio?",
      "¿Cómo pueden las fortalezas de una categoría fortalecer otras marcas Unilever?",
      "¿Qué sinergias de posicionamiento se identifican entre cuidado personal y alimentos?",
      "¿Cómo optimizar la arquitectura de marca considerando los insights de múltiples estudios?"
    ]
  }
];

// Preguntas rápidas por perfil de usuario
export const QUICK_QUESTIONS_BY_PERSONA = {
  MADRE_MODERNA: [
    "¿Qué buscan las mamás en productos de cuidado infantil?",
    "¿Cuáles son las preocupaciones principales sobre ingredientes?",
    "¿Cómo eligen productos para toda la familia?"
  ],
  PROFESIONAL_BEAUTY: [
    "¿Qué resultados esperan de productos premium?",
    "¿Cuáles son las rutinas de cuidado más populares?",
    "¿Qué importancia tiene la eficacia clínica?"
  ],
  AMA_DE_CASA_EXPERTA: [
    "¿Qué valoran más en productos de limpieza?",
    "¿Cómo evalúan la relación precio-calidad?",
    "¿Cuáles son los trucos de limpieza más efectivos?"
  ],
  MILLENNIALS_CONSCIENTE: [
    "¿Qué importancia tiene la sustentabilidad?",
    "¿Cómo influyen las marcas con propósito?",
    "¿Qué certificaciones buscan en productos?"
  ],
  SENIOR_TRADICIONAL: [
    "¿Qué valoran en marcas de confianza?",
    "¿Cuáles son las preferencias tradicionales?",
    "¿Cómo adaptar productos para seniors?"
  ],
  JOVEN_TRENDY: [
    "¿Qué productos están trending actualmente?",
    "¿Cómo impactan las redes sociales en compras?",
    "¿Qué buscan en packaging instagrameable?"
  ],
  HOMBRE_MODERNO: [
    "¿Cuáles son las necesidades específicas masculinas?",
    "¿Qué esperan de productos para hombres?",
    "¿Cómo simplificar rutinas masculinas?"
  ]
};

// Contextos específicos para preguntas avanzadas
export const ADVANCED_QUERY_CONTEXTS = {
  BRAND_DEEP_DIVE: {
    name: "Análisis Profundo de Marca",
    prompt_template: "Analiza {brand} considerando: posicionamiento actual, percepciones del consumidor, competitive frame, oportunidades de crecimiento y recomendaciones estratégicas."
  },
  CONSUMER_JOURNEY: {
    name: "Journey del Consumidor",
    prompt_template: "Describe el customer journey para {category} desde awareness hasta loyalty, incluyendo touchpoints, momentos de verdad y oportunidades de mejora."
  },
  COMPETITIVE_ANALYSIS: {
    name: "Análisis Competitivo",
    prompt_template: "Compara {brand} versus principales competidores en términos de: posicionamiento, fortalezas, debilidades, estrategias y recommendations."
  },
  MARKET_OPPORTUNITY: {
    name: "Oportunidades de Mercado",
    prompt_template: "Identifica oportunidades para {category} considerando: gaps del mercado, necesidades no satisfechas, tendencias emergentes y potential de crecimiento."
  },
  INNOVATION_INSIGHTS: {
    name: "Insights de Innovación",
    prompt_template: "¿Qué oportunidades de innovación existen en {category}? Considera: unmet needs, technological advances, consumer expectations y competitive gaps."
  }
};

// Preguntas trending basadas en temas actuales
export const TRENDING_TOPICS = [
  "¿Cómo está impactando la sustentabilidad en las decisiones de compra?",
  "¿Qué cambios ha traído el e-commerce al consumo de FMCG?",
  "¿Cuál es el rol de la salud mental en productos de cuidado personal?",
  "¿Cómo adaptar marcas para la nueva normalidad post-COVID?",
  "¿Qué oportunidades hay en productos multifuncionales?",
  "¿Cuál es el impacto de TikTok en beauty trends?",
  "¿Cómo están cambiando las rutinas de limpieza del hogar?",
  "¿Qué relevancia tienen los productos clean beauty?"
];

export default {
  SUGGESTED_QUESTIONS,
  QUICK_QUESTIONS_BY_PERSONA,
  ADVANCED_QUERY_CONTEXTS,
  TRENDING_TOPICS
};