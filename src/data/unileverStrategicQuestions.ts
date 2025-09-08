// data/unileverStrategicQuestions.ts - Preguntas estratégicas para Unilever

import type { StrategicConfig } from '../components/Config/StrategicConfigPanel';

export interface StrategicQuestion {
  id: string;
  question: string;
  category: string;
  expectedInsights: string[];
  recommendedConfig: Partial<StrategicConfig>;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export const UNILEVER_STRATEGIC_QUESTIONS: StrategicQuestion[] = [
  // === DOVE STRATEGY ===
  {
    id: 'dove_positioning_colombia',
    question: '¿Cómo se posiciona Dove frente a la competencia en el mercado colombiano de cuidado personal?',
    category: 'Estrategia Dove',
    expectedInsights: [
      'Share of voice vs P&G y competencia local',
      'Ventajas competitivas diferenciadas', 
      'Percepción de marca premium vs masivo'
    ],
    recommendedConfig: {
      analysisType: 'competitive',
      insightDepth: 'deep',
      enableCrossDocumentAnalysis: true,
      includeRecommendations: true
    },
    difficulty: 'intermediate'
  },
  {
    id: 'dove_self_esteem_impact',
    question: '¿Qué impacto real tiene la campaña de autoestima de Dove en la conexión emocional con consumidores?',
    category: 'Estrategia Dove',
    expectedInsights: [
      'Métricas de engagement emocional',
      'Diferenciación vs competencia funcional',
      'ROI de inversión en purpose marketing'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'expert',
      enableTrendAnalysis: true,
      includeRecommendations: true
    },
    difficulty: 'advanced'
  },

  // === COMPETITIVE ANALYSIS ===
  {
    id: 'unilever_vs_pg_colombia',
    question: '¿Dónde gana y dónde pierde Unilever vs P&G en las categorías principales en Colombia?',
    category: 'Análisis Competitivo',
    expectedInsights: [
      'Fortalezas por categoría (Home Care, Personal Care)',
      'Gaps competitivos específicos',
      'Oportunidades de disrupcíón'
    ],
    recommendedConfig: {
      analysisType: 'competitive',
      insightDepth: 'expert',
      enableCrossDocumentAnalysis: true,
      maxChunks: 12
    },
    difficulty: 'advanced'
  },
  {
    id: 'fruco_vs_heinz_strategy',
    question: '¿Qué estrategias específicas puede usar Fruco para defenderse mejor de Heinz y marcas premium?',
    category: 'Análisis Competitivo',
    expectedInsights: [
      'Drivers de lealtad hacia Fruco',
      'Vulnerabilidades ante ataque premium',
      'Tácticas de defensa probadas'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'deep',
      includeRecommendations: true,
      maxChunks: 8
    },
    difficulty: 'intermediate'
  },

  // === PORTFOLIO STRATEGY ===
  {
    id: 'unilever_portfolio_gaps',
    question: '¿Qué gaps estratégicos tiene el portfolio de Unilever en Colombia y cómo llenarlos?',
    category: 'Estrategia de Portfolio',
    expectedInsights: [
      'Categorías sub-representadas',
      'Oportunidades de extensión de marca',
      'Priorización por potencial de ROI'
    ],
    recommendedConfig: {
      analysisType: 'innovation',
      insightDepth: 'expert',
      enableCrossDocumentAnalysis: true,
      enableTrendAnalysis: true,
      includeRecommendations: true
    },
    difficulty: 'advanced'
  },
  {
    id: 'brand_architecture_optimization',
    question: '¿Cómo puede optimizar Unilever su arquitectura de marcas para mayor sinergia y eficiencia?',
    category: 'Estrategia de Portfolio',
    expectedInsights: [
      'Overlaps y canibalización entre marcas',
      'Oportunidades de co-branding',
      'Eficiencias en marketing y distribución'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'deep',
      enableCrossDocumentAnalysis: true,
      maxChunks: 10
    },
    difficulty: 'advanced'
  },

  // === INNOVATION OPPORTUNITIES ===
  {
    id: 'personal_care_innovation_trends',
    question: '¿Qué tendencias emergentes en cuidado personal representan las mayores oportunidades de innovación?',
    category: 'Innovación',
    expectedInsights: [
      'Necesidades no satisfechas identificadas',
      'Tendencias de ingredientes y formatos',
      'Oportunidades de disrupción'
    ],
    recommendedConfig: {
      analysisType: 'innovation',
      insightDepth: 'deep',
      enableTrendAnalysis: true,
      includeRecommendations: true
    },
    difficulty: 'intermediate'
  },
  {
    id: 'sustainability_premium_opportunities',
    question: '¿Dónde puede Unilever capturar premium con productos sustentables sin perder participación de mercado?',
    category: 'Innovación',
    expectedInsights: [
      'Disposición a pagar por sustentabilidad por segmento',
      'Categorías con mayor potencial eco-premium',
      'Estrategias de comunicación sustentable efectivas'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'expert',
      enableTrendAnalysis: true,
      includeRecommendations: true,
      maxChunks: 10
    },
    difficulty: 'advanced'
  },

  // === CONSUMER EVOLUTION ===
  {
    id: 'post_covid_behavior_changes',
    question: '¿Cómo han evolucionado permanentemente los comportamientos de compra post-COVID y qué significa para Unilever?',
    category: 'Evolución del Consumidor',
    expectedInsights: [
      'Cambios permanentes vs temporales',
      'Nuevas ocasiones de uso y necesidades',
      'Adaptaciones requeridas por marca'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'deep',
      enableTrendAnalysis: true,
      enableCrossDocumentAnalysis: true
    },
    difficulty: 'intermediate'
  },
  {
    id: 'digital_native_engagement',
    question: '¿Cómo debe evolucionar la estrategia de Unilever para conectar mejor con consumidores digitales nativos?',
    category: 'Evolución del Consumidor',
    expectedInsights: [
      'Gaps en engagement digital por marca',
      'Formatos de contenido más efectivos',
      'Influencers vs traditional advertising ROI'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'deep',
      includeRecommendations: true,
      maxChunks: 8
    },
    difficulty: 'intermediate'
  },

  // === MARKET TRENDS ===
  {
    id: 'premiumization_vs_value_trends',
    question: '¿En qué categorías debe Unilever apostar por premiumización vs value strategy en el contexto económico actual?',
    category: 'Tendencias de Mercado',
    expectedInsights: [
      'Elasticidad precio por categoría y NSE',
      'Oportunidades de premiumización sostenible',
      'Estrategias value que no dañen marca'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'expert',
      enableTrendAnalysis: true,
      includeRecommendations: true,
      maxChunks: 12
    },
    difficulty: 'advanced'
  },
  {
    id: 'channel_evolution_strategy',
    question: '¿Cómo está evolucionando el landscape de canales y qué requiere esto de la estrategia go-to-market?',
    category: 'Tendencias de Mercado',
    expectedInsights: [
      'Crecimiento e-commerce vs tradicional por categoría',
      'Importancia creciente de D1, Ara, hard discount',
      'Adaptaciones requeridas en activación por canal'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'deep',
      enableTrendAnalysis: true,
      enableCrossDocumentAnalysis: true
    },
    difficulty: 'intermediate'
  },

  // === QUICK WINS ===
  {
    id: 'short_term_growth_opportunities',
    question: '¿Cuáles son las 3 oportunidades de crecimiento más rápidas de ejecutar para Unilever en los próximos 6 meses?',
    category: 'Quick Wins',
    expectedInsights: [
      'Tácticas de activación inmediatas',
      'Optimizaciones de producto/precio rápidas',
      'Oportunidades de distribución sin explotar'
    ],
    recommendedConfig: {
      analysisType: 'strategic',
      insightDepth: 'deep',
      includeRecommendations: true,
      maxChunks: 8
    },
    difficulty: 'basic'
  },
  {
    id: 'low_hanging_fruit_share_gains',
    question: '¿Dónde puede Unilever ganar share fácilmente aprovechando debilidades puntuales de la competencia?',
    category: 'Quick Wins',
    expectedInsights: [
      'Vulnerabilidades específicas de competidores',
      'Ventajas competitivas sub-explotadas',
      'Tácticas de marketing warfare efectivas'
    ],
    recommendedConfig: {
      analysisType: 'competitive',
      insightDepth: 'deep',
      includeRecommendations: true
    },
    difficulty: 'basic'
  }
];

// Función para obtener preguntas por categoría
export const getQuestionsByCategory = (category?: string): StrategicQuestion[] => {
  if (!category) return UNILEVER_STRATEGIC_QUESTIONS;
  return UNILEVER_STRATEGIC_QUESTIONS.filter(q => q.category === category);
};

// Función para obtener preguntas por dificultad
export const getQuestionsByDifficulty = (difficulty: 'basic' | 'intermediate' | 'advanced'): StrategicQuestion[] => {
  return UNILEVER_STRATEGIC_QUESTIONS.filter(q => q.difficulty === difficulty);
};

// Obtener todas las categorías
export const getCategories = (): string[] => {
  const categories = [...new Set(UNILEVER_STRATEGIC_QUESTIONS.map(q => q.category))];
  return categories.sort();
};

// Preguntas recomendadas para empezar
export const getRecommendedStarterQuestions = (): StrategicQuestion[] => {
  return [
    UNILEVER_STRATEGIC_QUESTIONS.find(q => q.id === 'dove_positioning_colombia')!,
    UNILEVER_STRATEGIC_QUESTIONS.find(q => q.id === 'fruco_vs_heinz_strategy')!,
    UNILEVER_STRATEGIC_QUESTIONS.find(q => q.id === 'short_term_growth_opportunities')!,
    UNILEVER_STRATEGIC_QUESTIONS.find(q => q.id === 'post_covid_behavior_changes')!
  ];
};