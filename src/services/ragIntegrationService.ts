/**
 * RAG Integration Service - Enhanced evaluation with Unilever document context
 * 
 * Features:
 * - Fetch relevant context from existing Unilever RAG backend
 * - Enhance persona prompts with real market data
 * - Competitive intelligence integration
 * - Category-specific insights from documents
 */

import type { Concept, SyntheticPersona, EvaluationResult } from '../components/InnovationLab/InnovationLabContainer';
import type { EvaluationSettings, LLMEvaluationRequest } from './llmEvaluationService';
import { LLMEvaluationEngine, PersonaContextBuilder } from './llmEvaluationService';

// ===== RAG CONTEXT TYPES =====

export interface RAGContext {
  relevant_chunks: RAGChunk[];
  category_insights: string[];
  brand_intelligence: BrandIntelligence;
  competitive_landscape: CompetitiveInfo[];
  market_trends: string[];
}

export interface RAGChunk {
  content: string;
  source: string;
  similarity_score: number;
  metadata: {
    brand?: string;
    category?: string;
    region?: string;
    date?: string;
  };
}

export interface BrandIntelligence {
  brand_perception: string[];
  market_position: string;
  target_audience: string[];
  competitive_advantages: string[];
  challenges: string[];
}

export interface CompetitiveInfo {
  competitor: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
}

// ===== RAG-ENHANCED EVALUATION ENGINE =====

export class RAGEnhancedEvaluationEngine extends LLMEvaluationEngine {
  private ragApiUrl: string;

  constructor(ragApiUrl?: string, apiKey?: string) {
    super(ragApiUrl, apiKey);
    this.ragApiUrl = ragApiUrl || import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app';
  }

  /**
   * Generate evaluation enhanced with RAG context from Unilever documents
   * Note: RAG context temporarily disabled - using direct LLM evaluation for qualitative analysis
   */
  async generateRAGEnhancedEvaluation(request: LLMEvaluationRequest): Promise<EvaluationResult> {
    try {
      const { concept, persona, settings } = request;
      
      // Skip RAG context for qualitative evaluation (not needed and avoids 404 errors)
      const ragContext = null;
      
      // Build enhanced role prompt with persona context
      const contextBuilder = new PersonaContextBuilder(persona);
      const baseRolePrompt = contextBuilder.buildRolePrompt(settings.language);
      
      // For qualitative evaluation, use direct prompting without RAG context
      const evaluationPrompt = this.buildEvaluationPrompt(concept, settings);
      
      // Call LLM directly without RAG context
      const llmResponse = await this.callLLMAPI(baseRolePrompt, evaluationPrompt, settings);
      
      // Parse response (no RAG enrichment needed for qualitative evaluation)
      const evaluation = this.parseEvaluationResponse(llmResponse, concept.id, persona.id);
      return evaluation;
      
    } catch (error) {
      console.error('RAG-enhanced evaluation failed, falling back to standard LLM:', error);
      return super.generateEvaluation(request);
    }
  }

  /**
   * Fetch relevant context from Unilever RAG system
   */
  private async fetchRAGContext(concept: Concept, persona: SyntheticPersona): Promise<RAGContext> {
    try {
      // Build context query based on concept and persona
      const contextQuery = this.buildContextQuery(concept, persona);
      
      // Call existing RAG backend
      const response = await fetch(`${this.ragApiUrl}/api/rag-context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: contextQuery,
          brand: concept.brand,
          category: concept.category,
          max_chunks: 8,
          include_competitive: true,
          include_trends: true
        })
      });

      if (!response.ok) {
        throw new Error(`RAG context fetch failed: ${response.status}`);
      }

      const data = await response.json();
      return this.parseRAGResponse(data);
      
    } catch (error) {
      console.warn('Failed to fetch RAG context, using fallback:', error);
      return this.createFallbackRAGContext(concept);
    }
  }

  /**
   * Build context query for RAG system
   */
  private buildContextQuery(concept: Concept, persona: SyntheticPersona): string {
    const queryElements = [
      concept.category,
      concept.brand,
      ...concept.benefits,
      persona.baseProfile.location.split(',')[0], // City
      persona.baseProfile.socioeconomicLevel,
      persona.archetype
    ];

    return `${concept.category} ${concept.brand} consumer insights perception target audience ${queryElements.join(' ')}`;
  }

  /**
   * Parse RAG response into structured context
   */
  private parseRAGResponse(data: any): RAGContext {
    return {
      relevant_chunks: data.chunks?.map((chunk: any) => ({
        content: chunk.content || chunk.text,
        source: chunk.source || 'Unilever Document',
        similarity_score: chunk.similarity_score || 0.8,
        metadata: {
          brand: chunk.metadata?.brand,
          category: chunk.metadata?.category,
          region: chunk.metadata?.region,
          date: chunk.metadata?.date
        }
      })) || [],
      category_insights: data.category_insights || [],
      brand_intelligence: {
        brand_perception: data.brand_perception || [],
        market_position: data.market_position || 'Established player',
        target_audience: data.target_audience || [],
        competitive_advantages: data.competitive_advantages || [],
        challenges: data.challenges || []
      },
      competitive_landscape: data.competitive_landscape || [],
      market_trends: data.market_trends || []
    };
  }

  /**
   * Create fallback RAG context when API fails
   */
  private createFallbackRAGContext(concept: Concept): RAGContext {
    return {
      relevant_chunks: [],
      category_insights: [`${concept.category} es una categoría competitiva en el mercado colombiano`],
      brand_intelligence: {
        brand_perception: [`${concept.brand} es reconocida en el mercado`],
        market_position: 'Posicionada en el segmento medio',
        target_audience: [concept.targetAudience],
        competitive_advantages: concept.benefits,
        challenges: ['Competencia intensa', 'Sensibilidad al precio']
      },
      competitive_landscape: [],
      market_trends: ['Crecimiento del e-commerce', 'Preferencia por productos naturales']
    };
  }

  /**
   * Enhance role prompt with RAG context
   */
  private enhanceRolePromptWithRAG(
    basePrompt: string, 
    ragContext: RAGContext, 
    language: string = 'spanish'
  ): string {
    const lang = language as 'spanish' | 'english';
    
    // Build market intelligence section
    const marketIntelligence = this.buildMarketIntelligenceSection(ragContext, lang);
    
    // Build competitive awareness section
    const competitiveAwareness = this.buildCompetitiveAwarenessSection(ragContext, lang);
    
    return `${basePrompt}

${marketIntelligence}

${competitiveAwareness}

${lang === 'spanish' ? 
  'Usa esta información de mercado real para informar tu evaluación, pero mantén tu perspectiva personal auténtica.' :
  'Use this real market information to inform your evaluation, but maintain your authentic personal perspective.'
}`;
  }

  /**
   * Build market intelligence section from RAG context
   */
  private buildMarketIntelligenceSection(ragContext: RAGContext, lang: 'spanish' | 'english'): string {
    if (ragContext.relevant_chunks.length === 0) return '';

    const header = lang === 'spanish' ? 'INFORMACIÓN DE MERCADO:' : 'MARKET INTELLIGENCE:';
    
    const insights = ragContext.relevant_chunks
      .slice(0, 3)
      .map(chunk => `- ${chunk.content.substring(0, 150)}...`)
      .join('\n');

    const trends = ragContext.market_trends
      .slice(0, 3)
      .map(trend => `- ${trend}`)
      .join('\n');

    return `${header}
${insights}

${lang === 'spanish' ? 'TENDENCIAS DE MERCADO:' : 'MARKET TRENDS:'}
${trends}`;
  }

  /**
   * Build competitive awareness section
   */
  private buildCompetitiveAwarenessSection(ragContext: RAGContext, lang: 'spanish' | 'english'): string {
    if (ragContext.competitive_landscape.length === 0) return '';

    const header = lang === 'spanish' ? 'PANORAMA COMPETITIVO:' : 'COMPETITIVE LANDSCAPE:';
    
    const competitors = ragContext.competitive_landscape
      .slice(0, 3)
      .map(comp => `- ${comp.competitor}: ${comp.positioning}`)
      .join('\n');

    return `${header}
${competitors}`;
  }

  /**
   * Build evaluation prompt enhanced with RAG context
   */
  private buildRAGEnhancedEvaluationPrompt(
    concept: Concept,
    ragContext: RAGContext,
    settings: EvaluationSettings
  ): string {
    const basePrompt = this.buildEvaluationPrompt(concept, settings);
    
    // Add market context section
    const marketContext = this.buildMarketContextSection(ragContext, settings.language);
    
    return `${basePrompt}

${marketContext}

${settings.language === 'spanish' ?
  'IMPORTANTE: Considera esta información de mercado real en tu evaluación, pero mantén tu perspectiva personal y auténtica.' :
  'IMPORTANT: Consider this real market information in your evaluation, but maintain your personal and authentic perspective.'
}`;
  }

  /**
   * Build market context section for evaluation
   */
  private buildMarketContextSection(ragContext: RAGContext, language: string = 'spanish'): string {
    const lang = language as 'spanish' | 'english';
    
    let contextSection = lang === 'spanish' ? 'CONTEXTO DE MERCADO:\n' : 'MARKET CONTEXT:\n';
    
    // Add brand intelligence
    if (ragContext.brand_intelligence.brand_perception.length > 0) {
      contextSection += `${lang === 'spanish' ? 'Percepción de marca:' : 'Brand perception:'} ${ragContext.brand_intelligence.brand_perception.slice(0, 2).join(', ')}\n`;
    }
    
    // Add competitive advantages
    if (ragContext.brand_intelligence.competitive_advantages.length > 0) {
      contextSection += `${lang === 'spanish' ? 'Ventajas competitivas:' : 'Competitive advantages:'} ${ragContext.brand_intelligence.competitive_advantages.slice(0, 2).join(', ')}\n`;
    }
    
    // Add market trends
    if (ragContext.market_trends.length > 0) {
      contextSection += `${lang === 'spanish' ? 'Tendencias:' : 'Trends:'} ${ragContext.market_trends.slice(0, 2).join(', ')}\n`;
    }
    
    return contextSection;
  }

  /**
   * Enrich evaluation with RAG insights
   */
  private enrichEvaluationWithRAGInsights(
    evaluation: EvaluationResult,
    ragContext: RAGContext
  ): EvaluationResult {
    // Add market-informed suggestions
    const ragSuggestions = [
      ...evaluation.suggestions,
      ...this.generateRAGBasedSuggestions(ragContext)
    ].slice(0, 6); // Limit to 6 total suggestions

    // Enhance key drivers with market intelligence
    const enhancedKeyDrivers = [
      ...evaluation.keyDrivers,
      ...ragContext.brand_intelligence.competitive_advantages.slice(0, 2)
    ].slice(0, 5);

    return {
      ...evaluation,
      suggestions: ragSuggestions,
      keyDrivers: enhancedKeyDrivers
    };
  }

  /**
   * Generate RAG-based suggestions
   */
  private generateRAGBasedSuggestions(ragContext: RAGContext): string[] {
    const suggestions: string[] = [];
    
    // Based on market trends
    if (ragContext.market_trends.includes('productos naturales')) {
      suggestions.push('Considerar destacar ingredientes naturales');
    }
    
    if (ragContext.market_trends.includes('e-commerce')) {
      suggestions.push('Optimizar para venta digital');
    }
    
    // Based on competitive landscape
    if (ragContext.competitive_landscape.length > 0) {
      suggestions.push('Diferenciarse claramente de competidores principales');
    }
    
    return suggestions.slice(0, 2);
  }
}

// ===== ENHANCED EVALUATION FUNCTIONS =====

/**
 * Main function for RAG-enhanced concept evaluation
 */
export async function evaluateConceptWithRAG(
  concept: Concept,
  persona: SyntheticPersona,
  settings: Partial<EvaluationSettings> = {}
): Promise<EvaluationResult> {
  const engine = new RAGEnhancedEvaluationEngine();
  const fullSettings = { ...settings } as EvaluationSettings;
  
  return engine.generateRAGEnhancedEvaluation({
    concept,
    persona,
    settings: fullSettings
  });
}

/**
 * Multi-agent evaluation with RAG context
 */
export async function evaluateConceptWithMultiAgentRAG(
  concept: Concept,
  persona: SyntheticPersona,
  baseSettings: Partial<EvaluationSettings> = {}
): Promise<EvaluationResult> {
  const engine = new RAGEnhancedEvaluationEngine();
  
  const agents = [
    { ...baseSettings, criticality: 'neutral' as const },
    { ...baseSettings, criticality: 'critical' as const },
    { ...baseSettings, criticality: 'optimistic' as const }
  ];

  // Run multiple RAG-enhanced evaluations in parallel
  const evaluations = await Promise.all(
    agents.map(agentSettings => 
      engine.generateRAGEnhancedEvaluation({
        concept,
        persona,
        settings: agentSettings as EvaluationSettings
      })
    )
  );

  // Consolidate multiple perspectives (using method from base class)
  return consolidateRAGMultipleViews(evaluations, concept.id, persona.id);
}

/**
 * Consolidate multiple RAG-enhanced evaluations
 */
function consolidateRAGMultipleViews(
  evaluations: EvaluationResult[],
  conceptId: string,
  personaId: string
): EvaluationResult {
  if (evaluations.length === 0) {
    throw new Error('No evaluations to consolidate');
  }

  // Enhanced consolidation logic that preserves RAG insights
  const allAspects: { [key: string]: { positives: string[]; negatives: string[]; recommendations: string[]; score?: number; } } = {};
  
  evaluations.forEach(evaluation => {
    Object.entries(evaluation.aspects).forEach(([aspectKey, aspectValue]) => {
      if (!allAspects[aspectKey]) {
        allAspects[aspectKey] = { positives: [], negatives: [], recommendations: [] };
      }
      
      allAspects[aspectKey].positives.push(...aspectValue.positives);
      allAspects[aspectKey].negatives.push(...aspectValue.negatives);
      allAspects[aspectKey].recommendations.push(...aspectValue.recommendations);
    });
  });

  // Remove duplicates and prioritize RAG-informed insights
  Object.keys(allAspects).forEach(key => {
    allAspects[key].positives = [...new Set(allAspects[key].positives)].slice(0, 5);
    allAspects[key].negatives = [...new Set(allAspects[key].negatives)].slice(0, 5);
    allAspects[key].recommendations = [...new Set(allAspects[key].recommendations)].slice(0, 5);
  });

  // Determine overall acceptance with RAG context
  const acceptanceLevels = evaluations.map(e => e.overallAcceptance);
  const avgAcceptance = acceptanceLevels.filter(a => a === 'alta').length >= acceptanceLevels.length / 2 
    ? 'alta' 
    : acceptanceLevels.filter(a => a === 'baja').length >= acceptanceLevels.length / 2 
      ? 'baja' 
      : 'media';

  // Combine quotes with market intelligence
  const combinedQuote = `Análisis multi-perspectiva: ${evaluations.map(e => e.quote.split(',')[0]).join(' • ')}`;

  // Merge all insights
  const allKeyDrivers = [...new Set(evaluations.flatMap(e => e.keyDrivers))];
  const allSuggestions = [...new Set(evaluations.flatMap(e => e.suggestions))];

  return {
    conceptId,
    personaId,
    aspects: allAspects,
    overallAcceptance: avgAcceptance,
    quote: combinedQuote.length > 250 ? combinedQuote.substring(0, 250) + '...' : combinedQuote,
    keyDrivers: allKeyDrivers.slice(0, 6),
    suggestions: allSuggestions.slice(0, 8)
  };
}