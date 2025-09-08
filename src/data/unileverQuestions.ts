// data/unileverQuestions.ts - Preguntas sugeridas específicas para Unilever RAG System

export interface QuestionCategory {
  name: string;
  icon: string;
  questions: string[];
}

// Preguntas categorizadas basadas en análisis RAG de Unilever
export const SUGGESTED_QUESTIONS: QuestionCategory[] = [
  {
    name: "Marcas y Productos",
    icon: "🏷️",
    questions: [
      "¿Cuáles son las percepciones principales sobre Dove?",
      "¿Cómo se posiciona Fruco versus la competencia?",
      "¿Qué insights tienes sobre Knorr en el mercado?",
      "¿Cuál es el perfil del consumidor de Hellmann's?",
      "¿Cómo ha evolucionado la marca Savital?",
      "¿Qué diferenciadores tiene Pond's versus otras marcas?",
      "¿Cuáles son las oportunidades para Axe?",
      "¿Qué fortalezas tiene el portfolio de Fab y Aromatel 3D?",
      "¿Cómo perciben los consumidores Rexona?",
      "¿Qué oportunidades tiene Lipton en Colombia?",
      "¿Cuál es la posición de Maizena en el mercado?"
    ]
  },
  {
    name: "Segmentación y Audiencias",
    icon: "👥",
    questions: [
      "¿Cuáles son los segmentos principales de consumidores?",
      "¿Cómo varía el comportamiento por edad y género?",
      "¿Qué caracteriza a las madres de familia en el mercado?",
      "¿Cuáles son las diferencias entre NSE A/B y C/D?",
      "¿Cómo segmentar el mercado de cuidado personal?",
      "¿Qué motiva a los millennials en sus compras?",
      "¿Cuáles son los drivers de los consumidores premium?",
      "¿Cómo se comportan los early adopters?"
    ]
  },
  {
    name: "Comportamiento del Consumidor",
    icon: "🛒",
    questions: [
      "¿Cuáles son los momentos de consumo principales?",
      "¿Qué factores influyen en la decisión de compra?",
      "¿Cómo es el journey del consumidor de productos de belleza?",
      "¿Qué rol juega el precio en la elección de marca?",
      "¿Cuáles son las ocasiones de uso más importantes?",
      "¿Cómo impacta la sustentabilidad en las decisiones?",
      "¿Qué importancia tienen las recomendaciones?",
      "¿Cuáles son las barreras para probar nuevos productos?"
    ]
  },
  {
    name: "Tendencias y Mercado",
    icon: "📈",
    questions: [
      "¿Cuáles son las tendencias emergentes en cuidado personal?",
      "¿Cómo está evolucionando el mercado de limpieza del hogar?",
      "¿Qué cambios se observan post-pandemia?",
      "¿Cuál es el impacto del e-commerce?",
      "¿Cómo influyen las redes sociales en el consumo?",
      "¿Qué tendencias de sustentabilidad son relevantes?",
      "¿Cuáles son las oportunidades de crecimiento?",
      "¿Qué amenazas competitivas existen?"
    ]
  },
  {
    name: "Competencia y Posicionamiento",
    icon: "⚔️",
    questions: [
      "¿Cómo se compara Unilever versus P&G?",
      "¿Cuáles son las ventajas competitivas principales?",
      "¿Qué amenazas representan las marcas locales?",
      "¿Cómo posicionarse mejor en el segmento premium?",
      "¿Cuáles son las brechas versus la competencia?",
      "¿Qué oportunidades de diferenciación existen?",
      "¿Cómo defenderse de ataques competitivos?",
      "¿Qué estrategias usan los competidores exitosamente?"
    ]
  },
  {
    name: "Innovación y Productos",
    icon: "🔬",
    questions: [
      "¿Qué necesidades no satisfechas identificas?",
      "¿Cuáles son las oportunidades de innovación?",
      "¿Qué atributos de producto son más valorados?",
      "¿Cómo optimizar el packaging?",
      "¿Qué tecnologías son relevantes para incorporar?",
      "¿Cuáles son las expectativas de performance?",
      "¿Qué formatos alternativos tienen potencial?",
      "¿Cómo adaptar productos a mercados locales?"
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