// unileverFilterService.ts - Servicio de filtros avanzados para sistema RAG Unilever
// Integra todas las mejoras de TIGO: normalización, context building, estrategias específicas

interface UnileverFilterState {
  regions: string[];
  years: number[];
  brands: string[];
  categories: string[];
  methodologies: string[];
  studyTypes: string[];
  audienceSegments: string[];
  minConfidence: number;
  ragPercentage: number;
}

interface FilteredRAGRequest {
  text: string;
  images: any[];
  audio: any[];
  metadata_filter: object;
  output_types: string[];
  rag_percentage: number;
  context: string;
  style: string;
  language: string;
  search_configuration: object;
  customization: object;
}

class UnileverFilterService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app';
  }

  /**
   * Normaliza texto para mejorar búsquedas (aplicando aprendizajes del problema Pond's)
   */
  private normalizeSearchText(text: string): string {
    return text
      // Normalizar apostrofes y acentos
      .replace(/['´`]/g, "'")
      // Normalizar marcas específicas
      .replace(/pond['''´`]?s/gi, "Pond's")
      .replace(/hellmann['''´`]?s/gi, "Hellmann's")
      .replace(/ben\s*&\s*jerry['''´`]?s/gi, "Ben & Jerry's")
      // Normalizar términos FMCG
      .replace(/personal\s*care/gi, "Personal Care")
      .replace(/home\s*care/gi, "Home Care")
      .replace(/foods?\s*&\s*refreshment/gi, "Foods & Refreshment")
      // Unificar espacios múltiples
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Genera variaciones de búsqueda para mejorar recall
   */
  private generateSearchVariations(query: string, filters: UnileverFilterState): string[] {
    const normalized = this.normalizeSearchText(query);
    const variations: string[] = [normalized];

    // Agregar variaciones por marca seleccionada
    filters.brands.forEach(brand => {
      if (!normalized.toLowerCase().includes(brand.toLowerCase())) {
        variations.push(`${normalized} ${brand}`);
        variations.push(`${brand} ${normalized}`);
      }
    });

    // Agregar variaciones por categoría
    filters.categories.forEach(category => {
      if (!normalized.toLowerCase().includes(category.toLowerCase())) {
        variations.push(`${normalized} ${category}`);
      }
    });

    // Agregar sinónimos específicos
    const synonyms = {
      'insight': ['análisis', 'datos', 'información', 'estudio'],
      'consumidor': ['consumer', 'cliente', 'usuario', 'shopper'],
      'mercado': ['market', 'industria', 'sector'],
      'percepción': ['perception', 'imagen', 'posicionamiento'],
      'competencia': ['competition', 'rival', 'competitor']
    };

    Object.entries(synonyms).forEach(([term, syns]) => {
      if (normalized.toLowerCase().includes(term)) {
        syns.forEach(syn => {
          variations.push(normalized.replace(new RegExp(term, 'gi'), syn));
        });
      }
    });

    return [...new Set(variations)]; // Remover duplicados
  }

  /**
   * Construye contexto especializado basado en filtros aplicados
   */
  private buildFilteredContext(query: string, filters: UnileverFilterState): string {
    const sections: string[] = [];

    // Contexto base Unilever
    sections.push(`CONTEXTO UNILEVER LATAM:
- Portfolio: 20+ marcas FMCG (Personal Care, Home Care, Foods & Refreshment)
- Mercado principal: Colombia, México, Brasil, Argentina, Perú, Chile
- Competencia: P&G, Colgate-Palmolive, Nestlé, Johnson & Johnson
- Focus: Consumer insights, brand equity, category leadership`);

    // Contexto por marcas seleccionadas
    if (filters.brands.length > 0) {
      const brandContext = this.getBrandContext(filters.brands);
      sections.push(`MARCAS ESPECÍFICAS: ${filters.brands.join(', ')}\n${brandContext}`);
    }

    // Contexto por categorías
    if (filters.categories.length > 0) {
      sections.push(`CATEGORÍAS DE ANÁLISIS: ${filters.categories.join(', ')}
- Enfoque en performance competitivo y drivers de crecimiento
- Análisis de consumer journey y momentos de verdad`);
    }

    // Contexto por segmentos de audiencia
    if (filters.audienceSegments.length > 0) {
      sections.push(`SEGMENTOS OBJETIVO: ${filters.audienceSegments.join(', ')}
- Análisis específico por perfil demográfico y psicográfico
- Insights comportamentales y drivers de decisión por segmento`);
    }

    // Contexto temporal
    if (filters.years.length > 0) {
      sections.push(`PERÍODO DE ANÁLISIS: ${Math.min(...filters.years)}-${Math.max(...filters.years)}
- Evolución temporal de métricas clave
- Comparación pre/post eventos significativos`);
    }

    // Contexto geográfico
    if (filters.regions.length > 0) {
      sections.push(`REGIONES: ${filters.regions.join(', ')}
- Diferenciación cultural y de mercado por región
- Adaptación de insights a contextos locales`);
    }

    // Balance RAG/LLM explicado
    const ragLabel = this.getRagBalanceLabel(filters.ragPercentage);
    sections.push(`BALANCE ANÁLISIS: ${ragLabel} (${filters.ragPercentage}% documentos + ${100 - filters.ragPercentage}% inferencial)
- Priorizar ${filters.ragPercentage >= 60 ? 'datos documentados' : 'análisis inferencial'}
- Nivel de creatividad: ${filters.ragPercentage < 50 ? 'Alto' : 'Moderado'}`);

    return sections.join('\n\n');
  }

  /**
   * Proporciona contexto específico por marca Unilever
   */
  private getBrandContext(brands: string[]): string {
    const contexts: { [key: string]: string } = {
      'Dove': 'Beauty & wellbeing, autoestima, ingredientes premium, competencia vs L\'Oréal/P&G',
      'Fruco': 'Líder en salsas Colombia, tradición familiar, competencia vs Nestlé/Colgate',
      'OMO': 'Detergente premium, limpieza superior, competencia vs P&G/Colgate',
      'Cif': 'Limpieza especializada, eficacia, competencia vs SC Johnson/P&G',
      'Suave': 'Cuidado capilar accesible, relación calidad-precio, competencia vs L\'Oréal/P&G',
      'Pond\'s': 'Cuidado facial, tradición + modernidad, competencia vs L\'Oréal/P&G',
      'Hellmann\'s': 'Mayonesa premium, calidad culinaria, competencia vs Nestlé',
      'Knorr': 'Condimentos y bases, practicidad culinaria, competencia vs Nestlé/McCormick',
      'Rexona': 'Antitranspirante, protección duradera, competencia vs P&G/Colgate',
      'Axe': 'Fragancias masculinas jóvenes, seducción, competencia vs P&G/Coty'
    };

    return brands
      .map(brand => contexts[brand] || `${brand}: Marca Unilever con enfoque específico`)
      .join('\n- ');
  }

  /**
   * Obtiene etiqueta de balance RAG/LLM
   */
  private getRagBalanceLabel(percentage: number): string {
    if (percentage >= 80) return 'Datos Documentados';
    if (percentage >= 60) return 'Híbrido Documental';
    if (percentage >= 40) return 'Híbrido Balanceado';
    if (percentage >= 20) return 'Híbrido Creativo';
    return 'Análisis Inferencial';
  }

  /**
   * Construye metadata_filter para el backend
   */
  private buildMetadataFilter(filters: UnileverFilterState): object {
    const metadataFilter: any = {};

    if (filters.brands.length > 0) {
      metadataFilter.brands = filters.brands;
    }

    if (filters.categories.length > 0) {
      metadataFilter.categories = filters.categories;
    }

    if (filters.regions.length > 0) {
      metadataFilter.regions = filters.regions;
    }

    if (filters.years.length > 0) {
      metadataFilter.years = filters.years;
    }

    if (filters.methodologies.length > 0) {
      metadataFilter.methodologies = filters.methodologies;
    }

    if (filters.studyTypes.length > 0) {
      metadataFilter.study_types = filters.studyTypes;
    }

    if (filters.audienceSegments.length > 0) {
      metadataFilter.audience_segments = filters.audienceSegments;
    }

    if (filters.minConfidence > 0) {
      metadataFilter.min_confidence = filters.minConfidence / 100;
    }

    return metadataFilter;
  }

  /**
   * Determina estrategia de chunks basada en filtros
   */
  private getChunkStrategy(filters: UnileverFilterState): { maxChunks: number; threshold: number } {
    let maxChunks = 12; // Default mejorado (vs 5 anterior)
    let threshold = 0.025; // Default

    // Ajustar por especificidad de marcas
    if (filters.brands.includes("Pond's")) {
      maxChunks = 15;
      threshold = 0.020; // Threshold más bajo para Pond's (aprendizaje aplicado)
    }

    if (filters.brands.length === 1) {
      maxChunks = 10; // Enfoque específico
      threshold = 0.022;
    }

    if (filters.brands.length > 3) {
      maxChunks = 15; // Mayor cobertura para múltiples marcas
    }

    // Ajustar por balance RAG/LLM
    if (filters.ragPercentage >= 80) {
      maxChunks = 18; // Maximizar datos documentados
      threshold = 0.020;
    } else if (filters.ragPercentage <= 30) {
      maxChunks = 8; // Menor dependencia de documentos
      threshold = 0.030;
    }

    return { maxChunks, threshold };
  }

  /**
   * Ejecuta consulta RAG con filtros aplicados
   */
  async executeFilteredQuery(
    query: string, 
    filters: UnileverFilterState,
    endpoint: '/api/rag-pure' | '/api/rag-creative' | '/api/rag-hybrid' = '/api/rag-pure'
  ): Promise<any> {
    try {
      const token = localStorage.getItem('unilever_auth_token');
      
      // Normalizar y preparar query
      const normalizedQuery = this.normalizeSearchText(query);
      const searchVariations = this.generateSearchVariations(normalizedQuery, filters);
      const contextualizedQuery = this.buildFilteredContext(normalizedQuery, filters);
      
      // Determinar estrategia de chunks
      const { maxChunks, threshold } = this.getChunkStrategy(filters);
      
      // Construir request optimizado
      const requestBody: FilteredRAGRequest = {
        text: contextualizedQuery,
        images: [],
        audio: [],
        metadata_filter: this.buildMetadataFilter(filters),
        output_types: ["text", "table", "chart"],
        rag_percentage: filters.ragPercentage,
        context: "Unilever LATAM FMCG - Consumer insights & brand intelligence",
        style: "executive_strategic_analysis",
        language: "es",
        search_configuration: {
          max_chunks: maxChunks,
          similarity_threshold: threshold,
          search_variations: searchVariations,
          temporal_ranking: filters.ragPercentage >= 60 ? 'balanced' : 'creative',
          prioritize_recent: false, // Aplicando aprendizaje de datos históricos
          historical_boost: true
        },
        customization: {
          client_context: 'unilever',
          market_focus: 'colombia_fmcg_latam',
          competitive_landscape: ['P&G', 'Nestlé', 'Colgate-Palmolive', 'Johnson & Johnson'],
          regional_priorities: filters.regions.length > 0 ? filters.regions : ['Colombia', 'LATAM'],
          brand_focus: filters.brands.length > 0 ? filters.brands : 'all_portfolio',
          category_focus: filters.categories.length > 0 ? filters.categories : 'all_categories',
          audience_segmentation: filters.audienceSegments.length > 0 ? filters.audienceSegments : 'general',
          methodology_focus: 'consumer_insights_brand_health',
          detail_level: maxChunks,
          multi_brand_analysis: filters.brands.length > 1,
          include_competitive_analysis: true,
          regional_differentiation: filters.regions.length > 1,
          temporal_comparison: filters.years.length > 1
        }
      };

      console.log(`🎯 Unilever Filtered Query: ${endpoint}`);
      console.log(`📊 Filters Applied: ${Object.entries(filters).filter(([k,v]) => Array.isArray(v) ? v.length > 0 : v > 0).length}`);
      console.log(`⚡ RAG Balance: ${this.getRagBalanceLabel(filters.ragPercentage)} (${filters.ragPercentage}%)`);
      console.log(`📄 Max Chunks: ${maxChunks}, Threshold: ${threshold}`);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Filtered query executed successfully');

      // Agregar metadata de filtros aplicados a la respuesta
      return {
        ...data,
        applied_filters: {
          total_filters: Object.entries(filters).filter(([k,v]) => Array.isArray(v) ? v.length > 0 : v > 0).length,
          rag_balance: this.getRagBalanceLabel(filters.ragPercentage),
          search_strategy: {
            max_chunks: maxChunks,
            similarity_threshold: threshold,
            variations_generated: searchVariations.length
          },
          brands_analyzed: filters.brands,
          categories_analyzed: filters.categories,
          regions_analyzed: filters.regions,
          audience_segments: filters.audienceSegments
        }
      };

    } catch (error) {
      console.error('❌ Error in filtered RAG query:', error);
      throw error;
    }
  }

  /**
   * Genera recomendaciones de filtros basadas en query
   */
  suggestFilters(query: string): Partial<UnileverFilterState> {
    const suggestions: Partial<UnileverFilterState> = {};
    const queryLower = query.toLowerCase();

    // Detectar marcas mencionadas
    const detectedBrands: string[] = [];
    const brandKeywords = {
      'dove': ['dove', 'belleza', 'cuidado personal', 'autoestima'],
      'fruco': ['fruco', 'salsa', 'tomate', 'condimento'],
      'omo': ['omo', 'detergente', 'lavado', 'ropa'],
      'cif': ['cif', 'limpieza', 'cocina', 'baño'],
      'suave': ['suave', 'shampoo', 'cabello', 'pelo'],
      'pond\'s': ['ponds', 'pond', 'crema', 'facial', 'cuidado facial'],
      'hellmann\'s': ['hellmann', 'mayonesa', 'aderezo'],
      'knorr': ['knorr', 'sopa', 'caldo', 'condimento']
    };

    Object.entries(brandKeywords).forEach(([brand, keywords]) => {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        detectedBrands.push(brand.charAt(0).toUpperCase() + brand.slice(1));
      }
    });

    if (detectedBrands.length > 0) {
      suggestions.brands = detectedBrands;
    }

    // Detectar categorías
    if (queryLower.includes('personal care') || queryLower.includes('cuidado personal') || queryLower.includes('belleza')) {
      suggestions.categories = ['Personal Care'];
    } else if (queryLower.includes('home care') || queryLower.includes('limpieza') || queryLower.includes('hogar')) {
      suggestions.categories = ['Home Care'];
    } else if (queryLower.includes('alimentos') || queryLower.includes('foods') || queryLower.includes('cocina')) {
      suggestions.categories = ['Foods & Refreshment'];
    }

    // Detectar segmentos de audiencia
    if (queryLower.includes('madres') || queryLower.includes('mamás') || queryLower.includes('familia')) {
      suggestions.audienceSegments = ['Madres Millennials'];
    } else if (queryLower.includes('jóvenes') || queryLower.includes('millennials') || queryLower.includes('gen z')) {
      suggestions.audienceSegments = ['Jóvenes Gen Z'];
    } else if (queryLower.includes('profesional') || queryLower.includes('ejecutiv') || queryLower.includes('urbano')) {
      suggestions.audienceSegments = ['Profesionales Urbanos'];
    }

    // Sugerir balance RAG/LLM
    if (queryLower.includes('específic') || queryLower.includes('exacto') || queryLower.includes('data')) {
      suggestions.ragPercentage = 80; // Más documentado
    } else if (queryLower.includes('insight') || queryLower.includes('estrategi') || queryLower.includes('oportunidad')) {
      suggestions.ragPercentage = 40; // Más inferencial
    }

    return suggestions;
  }
}

export const unileverFilterService = new UnileverFilterService();
export type { UnileverFilterState, FilteredRAGRequest };