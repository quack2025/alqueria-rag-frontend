// utils/queryEnhancer.ts - Sistema de Query Enhancement Automático para Marcas Menores

export interface MinorBrandConfig {
  brand: string;
  category: string;
  mainCompetitors: string[];
  contextualTerms: string[];
  typicalQuestions: string[];
  enhancementStrategy: 'competitive' | 'contextual' | 'comprehensive';
}

export const MINOR_BRANDS_CONFIG: Record<string, MinorBrandConfig> = {
  savital: {
    brand: 'Savital',
    category: 'Cuidado Capilar',
    mainCompetitors: ['Sedal', 'Dove', 'Pantene', 'H&S', 'Nutribela', 'Milagros'],
    contextualTerms: [
      'shampoo', 'cabello', 'cuidado capilar', 'cabello graso', 'cabello seco',
      'anticaspa', 'suavidad', 'brillo', 'hidratación', 'reparación'
    ],
    typicalQuestions: [
      'participación mercado', 'oportunidades', 'posicionamiento', 
      'percepción', 'ventajas', 'debilidades', 'estrategia'
    ],
    enhancementStrategy: 'competitive'
  },
  
  aromatel: {
    brand: 'Aromatel 3D',
    category: 'Cuidado del Hogar',
    mainCompetitors: ['Downy', 'Suavitel', 'Comfort', 'Vivere'],
    contextualTerms: [
      'suavizante', 'aroma', 'frescura', 'textil', 'lavandería',
      'duración aroma', 'cuidado ropa', 'suavidad'
    ],
    typicalQuestions: [
      'diferenciación', 'propuesta valor', 'ventaja competitiva',
      'percepción aroma', 'duración', 'preferencia'
    ],
    enhancementStrategy: 'contextual'
  },

  fab: {
    brand: 'Fab',
    category: 'Detergentes',
    mainCompetitors: ['OMO', 'Ariel', 'Ace', 'Skip'],
    contextualTerms: [
      'detergente', 'limpieza', 'manchas', 'blancura', 'color',
      'eficacia', 'rendimiento', 'lavado', 'polvo', 'líquido'
    ],
    typicalQuestions: [
      'performance limpieza', 'relación precio-calidad', 'segmento',
      'diferenciación', 'ventajas', 'percepción'
    ],
    enhancementStrategy: 'comprehensive'
  },

  ponds: {
    brand: "Pond's",
    category: 'Cuidado Facial',
    mainCompetitors: ['Nivea', 'L\'Oreal', 'Neutrogena', 'Clean & Clear'],
    contextualTerms: [
      'cuidado facial', 'limpiador', 'agua micelar', 'desmaquillante',
      'hidratación facial', 'piel grasa', 'piel seca', 'anti-edad'
    ],
    typicalQuestions: [
      'lanzamiento', 'tracking post lanzamiento', 'concept test',
      'percepción', 'atributos', 'diferenciación'
    ],
    enhancementStrategy: 'comprehensive'
  }
};

export class QueryEnhancer {
  
  /**
   * Detecta si una query está preguntando sobre una marca menor
   */
  static detectMinorBrand(query: string): MinorBrandConfig | null {
    const queryLower = query.toLowerCase();
    
    for (const [key, config] of Object.entries(MINOR_BRANDS_CONFIG)) {
      const brandName = config.brand.toLowerCase();
      
      // Variaciones del nombre de marca
      const brandVariations = [
        brandName,
        brandName.replace(/[''´]/g, ''), // Sin apostrofes
        brandName.replace(/\s/g, ''), // Sin espacios
        key // La clave también
      ];
      
      if (brandVariations.some(variation => queryLower.includes(variation))) {
        return config;
      }
    }
    
    return null;
  }
  
  /**
   * Determina el tipo de pregunta que se está haciendo
   */
  static determineQuestionType(query: string): 'opportunities' | 'positioning' | 'perception' | 'comparison' | 'performance' | 'general' {
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('oportunidad') || queryLower.includes('opportunity')) {
      return 'opportunities';
    }
    if (queryLower.includes('posicion') || queryLower.includes('position') || 
        queryLower.includes('compete') || queryLower.includes('vs')) {
      return 'positioning';
    }
    if (queryLower.includes('percep') || queryLower.includes('imagen') || 
        queryLower.includes('opinion') || queryLower.includes('consumer')) {
      return 'perception';
    }
    if (queryLower.includes('compar') || queryLower.includes('versus') || 
        queryLower.includes('diferenci') || queryLower.includes('ventaj')) {
      return 'comparison';
    }
    if (queryLower.includes('performance') || queryLower.includes('result') ||
        queryLower.includes('tracking') || queryLower.includes('metric')) {
      return 'performance';
    }
    
    return 'general';
  }
  
  /**
   * Mejora automáticamente una query para una marca menor
   */
  static enhanceQuery(originalQuery: string, brandConfig: MinorBrandConfig): {
    enhancedQuery: string;
    searchStrategy: any;
    reasoning: string;
  } {
    const questionType = this.determineQuestionType(originalQuery);
    const brand = brandConfig.brand;
    
    let enhancedQuery = originalQuery;
    let reasoning = '';
    
    switch (brandConfig.enhancementStrategy) {
      case 'competitive':
        // Agregar contexto competitivo automáticamente
        const topCompetitors = brandConfig.mainCompetitors.slice(0, 3).join(' ');
        enhancedQuery = `${originalQuery} versus ${topCompetitors} comparación competitiva ${brandConfig.category}`;
        reasoning = `Agregado contexto competitivo automático vs ${topCompetitors} para mejor recuperación de datos comparativos`;
        break;
        
      case 'contextual':
        // Agregar términos contextuales de la categoría
        const contextTerms = brandConfig.contextualTerms.slice(0, 4).join(' ');
        enhancedQuery = `${originalQuery} ${contextTerms} ${brandConfig.category} mercado Colombia`;
        reasoning = `Agregado contexto de categoría ${brandConfig.category} para mejor recuperación temática`;
        break;
        
      case 'comprehensive':
        // Estrategia completa: competencia + contexto + términos específicos
        const competitors = brandConfig.mainCompetitors.slice(0, 2).join(' vs ');
        const context = brandConfig.contextualTerms.slice(0, 3).join(' ');
        enhancedQuery = `${originalQuery} ${brand} vs ${competitors} ${context} ${brandConfig.category} insights mercado`;
        reasoning = `Estrategia comprehensive: competencia + contexto + términos específicos para máxima recuperación`;
        break;
    }
    
    // Configuración de búsqueda específica para marcas menores
    const searchStrategy = {
      maxChunks: 15, // Más chunks para mayor cobertura
      endpoint: '/api/rag-pure',
      customization: {
        detail_level: 12,
        language: 'español',
        target_audience: 'brand_managers',
        client_context: 'unilever',
        market_focus: 'colombia_fmcg',
        competitive_landscape: brandConfig.mainCompetitors.slice(0, 5),
        // Configuración específica para marcas menores
        minor_brand_context: true,
        brand_name: brand,
        category: brandConfig.category,
        comparison_strategy: 'competitive_contextualization',
        // Threshold más bajo para incluir más contenido relevante
        similarity_threshold: 0.022,
        include_competitive_analysis: true,
        regional_differentiation: true,
        methodology_focus: 'competitive_positioning_analysis'
      },
      search_configuration: {
        temporal_ranking: 'balanced',
        prioritize_recent: false,
        historical_boost: true,
        similarity_threshold: 0.022, // Más bajo para marcas menores
        max_chunks: 15
      }
    };
    
    return {
      enhancedQuery,
      searchStrategy,
      reasoning
    };
  }
  
  /**
   * Genera términos de búsqueda optimizados para una marca menor
   */
  static generateOptimizedSearchTerms(
    originalQuery: string, 
    brandConfig: MinorBrandConfig,
    attempt: number = 1
  ): string {
    const brand = brandConfig.brand;
    const competitors = brandConfig.mainCompetitors;
    const questionType = this.determineQuestionType(originalQuery);
    
    if (attempt === 1) {
      // Primera búsqueda: enfoque específico con contexto competitivo
      switch (questionType) {
        case 'opportunities':
          return `${brand} oportunidades crecimiento vs ${competitors[0]} ${competitors[1]} ${brandConfig.category} mercado Colombia`;
          
        case 'positioning':
          return `${brand} posicionamiento competitivo vs ${competitors.slice(0, 3).join(' ')} ${brandConfig.category}`;
          
        case 'perception':
          return `${brand} percepción consumidor imagen marca vs competencia ${brandConfig.category}`;
          
        case 'comparison':
          return `${brand} vs ${competitors.slice(0, 2).join(' vs ')} comparación ${brandConfig.category} ventajas diferenciación`;
          
        case 'performance':
          return `${brand} performance resultados tracking métricas ${brandConfig.category} market share`;
          
        default:
          return `${originalQuery} ${brand} ${competitors[0]} ${competitors[1]} ${brandConfig.category} insights`;
      }
    } else {
      // Segunda búsqueda: más amplia si la primera no fue exitosa
      const allCompetitors = competitors.slice(0, 4).join(' ');
      const contextTerms = brandConfig.contextualTerms.slice(0, 3).join(' ');
      return `${brand} ${allCompetitors} ${contextTerms} ${brandConfig.category} Colombia mercado análisis competitivo ${originalQuery}`;
    }
  }
  
  /**
   * Evalúa si una respuesta es suficiente para una marca menor
   */
  static evaluateResponseQuality(response: string, brandConfig: MinorBrandConfig): {
    quality: 'excellent' | 'good' | 'insufficient';
    hasBrandMention: boolean;
    hasCompetitiveContext: boolean;
    hasInsights: boolean;
    suggestions: string[];
  } {
    const responseLower = response.toLowerCase();
    const brandLower = brandConfig.brand.toLowerCase();
    
    const hasBrandMention = responseLower.includes(brandLower) || 
                           responseLower.includes(brandLower.replace(/[''´]/g, ''));
    
    const hasCompetitiveContext = brandConfig.mainCompetitors.some(competitor =>
      responseLower.includes(competitor.toLowerCase())
    );
    
    const hasInsights = [
      'oportunidad', 'ventaja', 'fortaleza', 'debilidad', 'diferenciación',
      'posicionamiento', 'percepción', 'market share', 'participación'
    ].some(insight => responseLower.includes(insight));
    
    let quality: 'excellent' | 'good' | 'insufficient';
    const suggestions: string[] = [];
    
    if (hasBrandMention && hasCompetitiveContext && hasInsights) {
      quality = 'excellent';
    } else if (hasBrandMention && (hasCompetitiveContext || hasInsights)) {
      quality = 'good';
      if (!hasCompetitiveContext) suggestions.push('Agregar más contexto competitivo');
      if (!hasInsights) suggestions.push('Incluir más insights accionables');
    } else {
      quality = 'insufficient';
      if (!hasBrandMention) suggestions.push('La marca no fue mencionada específicamente');
      if (!hasCompetitiveContext) suggestions.push('Falta contexto competitivo');
      if (!hasInsights) suggestions.push('Necesita insights más profundos');
    }
    
    return {
      quality,
      hasBrandMention,
      hasCompetitiveContext,
      hasInsights,
      suggestions
    };
  }
}

export default QueryEnhancer;