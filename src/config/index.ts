// config/index.ts - Configuración básica para Unilever RAG System

export const CHAT_MODES = [
  {
    id: 'general' as const,
    name: 'RAG Puro',
    description: 'Respuestas basadas exclusivamente en datos de Unilever',
    icon: 'FileText'
  },
  {
    id: 'creative' as const,
    name: 'Insights Creativos',
    description: 'Análisis estratégicos con visualizaciones y recomendaciones',
    icon: 'Sparkles'
  },
  {
    id: 'hybrid' as const,
    name: 'RAG Híbrido',
    description: 'Balance personalizable entre datos y insights creativos',
    icon: 'Zap'
  }
];

// Configuración específica de Unilever
export const UNILEVER_CONFIG = {
  MAIN_BRANDS: [
    // Alimentos
    'Fruco', 'Hellmann\'s', 'Knorr', 'Lipton', 'Maizena',
    // Cuidado personal
    'Dove', 'Axe', 'Rexona', 'Savital', 'Pond\'s',
    // Cuidado del hogar
    'Fab', 'Aromatel 3D'
  ],
  CATEGORIES: [
    'Alimentos', 'Cuidado Personal', 'Cuidado del Hogar'
  ],
  REGIONS: [
    'Latin America', 'North America', 'Europe', 
    'Asia Pacific', 'Africa'
  ],
  PERSONAS: [
    'Madre Moderna', 'Profesional Beauty', 'Ama de Casa Experta',
    'Millennial Consciente', 'Senior Tradicional', 'Joven Trendy', 
    'Hombre Moderno'
  ]
};