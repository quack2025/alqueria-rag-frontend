// config/clientStrategies.ts - Configuración específica por cliente para respuestas optimizadas

export interface ClientStrategy {
  id: string;
  name: string;
  description: string;
  brands: string[];
  market_context: string;
  target_audience: string;
  competitive_landscape: string[];
  regional_focus: string[];
  key_metrics: string[];
  insights_priorities: string[];
  prompt_modifiers: {
    system_context: string;
    analysis_focus: string[];
    response_style: string;
    methodology_emphasis: string;
  };
}

export const CLIENT_STRATEGIES: Record<string, ClientStrategy> = {
  UNILEVER: {
    id: 'unilever',
    name: 'Unilever Colombia',
    description: 'Multinacional FMCG con portfolio diversificado en Colombia y Latinoamérica',
    brands: [
      // Alimentos
      'Fruco', 'Hellmann\'s', 'Knorr', 'Lipton', 'Maizena',
      // Cuidado Personal  
      'Dove', 'Axe', 'Rexona', 'Savital', 'Pond\'s',
      // Cuidado del Hogar
      'Fab', 'Aromatel 3D'
    ],
    market_context: 'colombia_fmcg_multinational',
    target_audience: 'brand_managers_category_directors',
    competitive_landscape: [
      'P&G', 'Colgate-Palmolive', 'Nestlé', 'Johnson & Johnson',
      'Henkel', 'Reckitt', 'Alpina', 'Grupo Nutresa'
    ],
    regional_focus: ['Colombia', 'Latin America', 'Centroamérica'],
    key_metrics: [
      'Market Share', 'Brand Health', 'Consumer Perception', 'Purchase Intent',
      'Usage Frequency', 'Brand Equity', 'Price Elasticity', 'Distribution'
    ],
    insights_priorities: [
      'Consumer Journey', 'Competitive Positioning', 'Innovation Opportunities',
      'Regional Differences', 'Demographic Segmentation', 'Trend Analysis'
    ],
    prompt_modifiers: {
      system_context: 'Eres un consultor estratégico especializado en FMCG multinacionales con profundo conocimiento del mercado colombiano y latinoamericano.',
      analysis_focus: [
        'Portfolio cross-brand analysis',
        'Competitive benchmarking vs P&G',
        'Regional market differences',
        'Consumer demographic segmentation',
        'Brand equity evolution'
      ],
      response_style: 'executive_comprehensive_strategic',
      methodology_emphasis: 'quantitative_qualitative_balanced'
    }
  },

  TIGO: {
    id: 'tigo',
    name: 'TIGO Honduras',
    description: 'Operador líder de telecomunicaciones en Honduras con enfoque en conectividad y servicios digitales',
    brands: ['TIGO', 'TIGO Money', 'TIGO Business', 'TIGO Home'],
    market_context: 'honduras_telecommunications',
    target_audience: 'telecom_executives_marketing_directors',
    competitive_landscape: [
      'Claro Honduras', 'Hondutel', 'Celtel', 'Cable providers locales'
    ],
    regional_focus: ['Honduras', 'Tegucigalpa', 'San Pedro Sula', 'Rural areas'],
    key_metrics: [
      'ARPU', 'Churn Rate', 'Net Promoter Score', 'Network Coverage',
      'Data Usage', 'Market Share by Segment', 'Customer Acquisition Cost'
    ],
    insights_priorities: [
      'Digital Transformation', 'Rural Connectivity', 'Youth Engagement',
      'Financial Services Adoption', 'B2B Growth Opportunities'
    ],
    prompt_modifiers: {
      system_context: 'Eres un consultor especializado en telecomunicaciones centroamericanas con expertise en el mercado hondureño.',
      analysis_focus: [
        'Telecom market dynamics in Honduras',
        'Digital services penetration',
        'Rural vs urban usage patterns',
        'Youth demographic preferences',
        'B2B digital transformation needs'
      ],
      response_style: 'telecom_technical_strategic',
      methodology_emphasis: 'usage_data_behavioral_analysis'
    }
  },

  NESTLE: {
    id: 'nestle',
    name: 'Nestlé Latinoamérica',
    description: 'Líder mundial en nutrición, salud y bienestar con fuerte presencia en bebidas y alimentos de conveniencia',
    brands: [
      // Bebidas
      'Nescafé', 'Milo', 'Nescao', 'Nestea',
      // Alimentos
      'Maggi', 'KitKat', 'Chocapic', 'Nestlé Cereales',
      // Nutrición
      'Nan', 'Nestum', 'Nestlé Fitness'
    ],
    market_context: 'latam_food_beverages_nutrition',
    target_audience: 'nutrition_experts_brand_managers',
    competitive_landscape: [
      'Unilever', 'Mondelez', 'PepsiCo', 'Coca-Cola Company',
      'Grupo Nutresa', 'Alpina', 'Danone'
    ],
    regional_focus: ['Colombia', 'México', 'Brasil', 'Argentina', 'Chile'],
    key_metrics: [
      'Category Growth', 'Nutritional Profile Preference', 'Convenience Factor',
      'Brand Love', 'Moment-based Consumption', 'Health Consciousness Impact'
    ],
    insights_priorities: [
      'Health & Wellness Trends', 'Convenience vs Nutrition Balance',
      'Generational Preferences', 'Morning Routine Evolution',
      'Premium vs Mainstream Positioning'
    ],
    prompt_modifiers: {
      system_context: 'Eres un consultor especializado en alimentos, bebidas y nutrición con expertise en tendencias de salud y conveniencia.',
      analysis_focus: [
        'Nutrition and health trends impact',
        'Convenience moment analysis',
        'Generational taste preferences',
        'Morning and snacking occasions',
        'Premium positioning opportunities'
      ],
      response_style: 'nutrition_focused_consumer_centric',
      methodology_emphasis: 'health_trends_usage_occasions'
    }
  },

  ALPINA: {
    id: 'alpina',
    name: 'Alpina Colombia',
    description: 'Líder en lácteos y nutrición en Colombia con enfoque en proteína, salud y bienestar familiar',
    brands: [
      'Alpina', 'Yogurt Griego Alpina', 'Leche Alpina', 'Kumis Alpina',
      'Arequipe Alpina', 'Avena Alpina', 'Finesse', 'Regeneris'
    ],
    market_context: 'colombia_dairy_nutrition',
    target_audience: 'nutrition_experts_family_health_advocates',
    competitive_landscape: [
      'Danone', 'Parmalat', 'Colanta', 'Alquería', 'Nestlé Dairy',
      'Productos locales regionales'
    ],
    regional_focus: ['Colombia', 'Bogotá', 'Medellín', 'Cali', 'Costa Atlántica'],
    key_metrics: [
      'Protein Content Awareness', 'Family Health Impact', 'Digestive Health',
      'Calcium Absorption', 'Taste Preference', 'Regional Preferences'
    ],
    insights_priorities: [
      'Family Nutrition Education', 'Protein Trends', 'Digestive Health',
      'Regional Taste Preferences', 'Healthy Aging Solutions',
      'Children Nutrition Needs'
    ],
    prompt_modifiers: {
      system_context: 'Eres un consultor especializado en nutrición láctea y salud familiar con profundo conocimiento del mercado colombiano.',
      analysis_focus: [
        'Dairy nutrition trends in Colombia',
        'Family health and wellness priorities',
        'Protein consumption patterns',
        'Regional taste and texture preferences',
        'Age-specific nutritional needs'
      ],
      response_style: 'nutrition_scientific_family_oriented',
      methodology_emphasis: 'nutritional_benefits_family_usage'
    }
  }
};

// Función para detectar automáticamente el cliente basado en la query
export const detectClient = (query: string): ClientStrategy | null => {
  const queryLower = query.toLowerCase();
  
  // Detección específica por marca/contexto
  for (const [clientId, strategy] of Object.entries(CLIENT_STRATEGIES)) {
    // Verificar marcas específicas
    const brandMatch = strategy.brands.some(brand => 
      queryLower.includes(brand.toLowerCase())
    );
    
    // Verificar contexto de mercado
    const contextKeywords = [
      ...strategy.brands.map(b => b.toLowerCase()),
      strategy.market_context.replace(/_/g, ' '),
      ...strategy.competitive_landscape.map(c => c.toLowerCase()),
      clientId.toLowerCase()
    ];
    
    const contextMatch = contextKeywords.some(keyword =>
      queryLower.includes(keyword)
    );
    
    if (brandMatch || contextMatch) {
      return strategy;
    }
  }
  
  return null;
};

// Función para modificar la estrategia de búsqueda basada en el cliente
export const adaptSearchStrategy = (
  baseStrategy: any,
  clientStrategy: ClientStrategy,
  query: string
): any => {
  return {
    ...baseStrategy,
    searchTerms: `${baseStrategy.searchTerms} ${clientStrategy.brands.slice(0, 3).join(' ')}`,
    customization: {
      ...baseStrategy.customization,
      client_context: clientStrategy.id,
      market_focus: clientStrategy.market_context,
      competitive_landscape: clientStrategy.competitive_landscape.slice(0, 5),
      regional_priorities: clientStrategy.regional_focus,
      target_audience: clientStrategy.target_audience,
      methodology_focus: clientStrategy.prompt_modifiers.methodology_emphasis
    }
  };
};