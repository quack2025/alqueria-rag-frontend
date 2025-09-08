// utils/colombianCampaignEvaluator.ts - Evaluador de campañas adaptado para consumidoras colombianas

import type { CampaignConcept, EvaluationSession, SegmentReaction } from '../types/campaign.types';
import type { ColombianSyntheticPersona, ColombianArchetype } from '../types/colombianPersona.types';
import { generateColombianPersona } from './colombianPersonaGenerator';
import { COLOMBIAN_CONSUMER_PROFILES } from '../data/colombianConsumerProfiles';

export interface ColombianEvaluationConfig {
  concept: CampaignConcept;
  selectedArchetypes: ColombianArchetype[];
  personasPerArchetype?: number;
  evaluationDepth?: 'quick' | 'standard' | 'deep';
  focusCategories?: string[]; // ['personal_care', 'foods', 'home_care']
}

export interface ColombianPersonaReaction {
  persona: ColombianSyntheticPersona;
  overall_score: number; // 0-100
  reaction_details: {
    initial_interest: number; // 0-100
    brand_fit: number; // 0-100
    regional_relevance: number; // 0-100
    price_acceptance: number; // 0-100
    purchase_intent: number; // 0-100
    recommendation_likelihood: number; // 0-100
  };
  qualitative_feedback: {
    positive_aspects: string[];
    concerns: string[];
    suggestions: string[];
    regional_adaptations: string[];
    competitive_comparisons: string[];
  };
  conversation_snippets: {
    initial_reaction: string;
    detailed_opinion: string;
    final_thoughts: string;
    authentic_language: string[];
  };
  unilever_brand_impact: {
    brand_trust_influence: number; // 0-100
    category_experience_relevance: number; // 0-100
    cross_selling_opportunities: string[];
  };
}

export class ColombianCampaignEvaluator {
  
  static async evaluateConcept(config: ColombianEvaluationConfig): Promise<EvaluationSession> {
    const { concept, selectedArchetypes, personasPerArchetype = 3 } = config;
    
    // Generar personas para cada arquetipo
    const allPersonas: ColombianSyntheticPersona[] = [];
    const reactions: SegmentReaction[] = [];
    
    for (const archetype of selectedArchetypes) {
      // Generar múltiples personas por arquetipo para mayor diversidad
      const archetypePersonas = Array.from({ length: personasPerArchetype }, () => 
        generateColombianPersona(archetype)
      );
      
      allPersonas.push(...archetypePersonas);
      
      // Evaluar reacciones del arquetipo
      const archetypeReaction = await this.evaluateArchetypeReaction(
        concept, 
        archetype, 
        archetypePersonas
      );
      
      reactions.push(archetypeReaction);
    }
    
    // Generar insights agregados
    const insights = this.generateInsights(reactions, concept);
    
    const session: EvaluationSession = {
      id: `colombian-eval-${Date.now()}`,
      concept,
      created_at: new Date(),
      status: 'completed',
      reactions,
      summary: insights.overall_performance || 'Evaluación completada',
      selected_archetypes: selectedArchetypes
    };
    
    return session;
  }
  
  private static async evaluateArchetypeReaction(
    concept: CampaignConcept,
    archetype: ColombianArchetype,
    personas: ColombianSyntheticPersona[]
  ): Promise<SegmentReaction> {
    
    const baseProfile = COLOMBIAN_CONSUMER_PROFILES[archetype];
    
    // Simular reacciones individuales de cada persona
    const individualReactions = personas.map(persona => 
      this.simulatePersonaReaction(concept, persona)
    );
    
    // Agregar resultados
    const aggregatedScores = this.aggregateScores(individualReactions);
    const qualitativeFeedback = this.aggregateQualitativeFeedback(individualReactions);
    
    // Generar reacción del arquetipo
    const reaction: SegmentReaction = {
      archetype: archetype,
      demographics: `${baseProfile.age_range[0]}-${baseProfile.age_range[1]} años, ${baseProfile.location}, ${baseProfile.nse_level}`,
      scores: aggregatedScores,
      feedback: qualitativeFeedback,
      conversation_examples: this.generateConversationExamples(personas, concept)
    };
    
    return reaction;
  }
  
  private static simulatePersonaReaction(
    concept: CampaignConcept, 
    persona: ColombianSyntheticPersona
  ): ColombianPersonaReaction {
    
    const baseProfile = COLOMBIAN_CONSUMER_PROFILES[persona.archetype];
    
    // Simular scores basados en características de la persona
    const initialInterest = this.calculateInitialInterest(concept, persona);
    const brandFit = this.calculateBrandFit(concept, persona);
    const regionalRelevance = this.calculateRegionalRelevance(concept, persona);
    const priceAcceptance = this.calculatePriceAcceptance(concept, persona);
    const purchaseIntent = this.calculatePurchaseIntent(concept, persona);
    const recommendationLikelihood = this.calculateRecommendationLikelihood(concept, persona);
    
    const overallScore = Math.round(
      (initialInterest + brandFit + regionalRelevance + priceAcceptance + purchaseIntent + recommendationLikelihood) / 6
    );
    
    return {
      persona,
      overall_score: overallScore,
      reaction_details: {
        initial_interest: initialInterest,
        brand_fit: brandFit,
        regional_relevance: regionalRelevance,
        price_acceptance: priceAcceptance,
        purchase_intent: purchaseIntent,
        recommendation_likelihood: recommendationLikelihood
      },
      qualitative_feedback: {
        positive_aspects: this.generatePositiveAspects(concept, persona),
        concerns: this.generateConcerns(concept, persona),
        suggestions: this.generateSuggestions(concept, persona),
        regional_adaptations: this.generateRegionalAdaptations(concept, persona),
        competitive_comparisons: this.generateCompetitiveComparisons(concept, persona)
      },
      conversation_snippets: {
        initial_reaction: this.generateInitialReaction(concept, persona),
        detailed_opinion: this.generateDetailedOpinion(concept, persona),
        final_thoughts: this.generateFinalThoughts(concept, persona),
        authentic_language: baseProfile.communication.regional_expressions.slice(0, 3)
      },
      unilever_brand_impact: {
        brand_trust_influence: this.calculateBrandTrustInfluence(concept, persona),
        category_experience_relevance: this.calculateCategoryRelevance(concept, persona),
        cross_selling_opportunities: this.identifyCrossSellingOpportunities(concept, persona)
      }
    };
  }
  
  // Métodos de cálculo de scores
  private static calculateInitialInterest(concept: CampaignConcept, persona: ColombianSyntheticPersona): number {
    let score = 50; // Base neutral
    
    // Ajustar por categoría
    const category = concept.technical_specs?.unilever_category;
    if (category === 'personal_care' && persona.characteristics.personal_care.dove_usage_frequency !== 'nunca') {
      score += 20;
    }
    if (category === 'foods' && persona.characteristics.food_consumption.fruco_usage_frequency !== 'nunca') {
      score += 20;
    }
    if (category === 'home_care' && persona.characteristics.home_care.omo_usage_frequency !== 'nunca') {
      score += 20;
    }
    
    // Ajustar por innovación
    if (persona.characteristics.personal_care.innovation_openness === 'muy_alta') {
      score += 15;
    } else if (persona.characteristics.personal_care.innovation_openness === 'baja') {
      score -= 10;
    }
    
    return Math.max(0, Math.min(100, score + this.randomVariation(10)));
  }
  
  private static calculateBrandFit(concept: CampaignConcept, persona: ColombianSyntheticPersona): number {
    let score = 60; // Base positiva para marcas Unilever
    
    const brand = concept.technical_specs?.unilever_brand;
    
    // Ajustar por lealtad de marca
    if (persona.characteristics.personal_care.brand_loyalty === 'muy_alta') {
      score += 20;
    }
    
    // Ajustar por experiencia con la marca
    if (brand === 'Dove' && persona.characteristics.personal_care.dove_usage_frequency === 'diario') {
      score += 25;
    }
    if (brand === 'Fruco' && persona.characteristics.food_consumption.fruco_usage_frequency === 'semanal') {
      score += 25;
    }
    if (brand === 'OMO' && persona.characteristics.home_care.omo_usage_frequency === 'semanal') {
      score += 25;
    }
    
    return Math.max(0, Math.min(100, score + this.randomVariation(10)));
  }
  
  private static calculateRegionalRelevance(concept: CampaignConcept, persona: ColombianSyntheticPersona): number {
    let score = 70; // Base buena para contexto colombiano
    
    const conceptRegion = concept.technical_specs?.regional_focus;
    const personaRegion = persona.characteristics.colombian_context.region;
    
    // Máximo score si coincide la región
    if (conceptRegion === 'nacional' || conceptRegion === personaRegion) {
      score = 85;
    }
    
    // Ajustar por orgullo regional
    score += Math.floor(persona.characteristics.colombian_context.regional_pride / 10);
    
    return Math.max(0, Math.min(100, score + this.randomVariation(8)));
  }
  
  private static calculatePriceAcceptance(concept: CampaignConcept, persona: ColombianSyntheticPersona): number {
    let score = 50;
    
    // Ajustar por sensibilidad al precio
    if (persona.characteristics.food_consumption.price_sensitivity === 'muy_alta') {
      score -= 20;
    } else if (persona.characteristics.food_consumption.price_sensitivity === 'baja') {
      score += 20;
    }
    
    // Ajustar por NSE
    if (persona.characteristics.demographics.income_bracket.includes('A')) {
      score += 25;
    } else if (persona.characteristics.demographics.income_bracket.includes('D')) {
      score -= 15;
    }
    
    return Math.max(0, Math.min(100, score + this.randomVariation(15)));
  }
  
  private static calculatePurchaseIntent(concept: CampaignConcept, persona: ColombianSyntheticPersona): number {
    let score = 40; // Base conservadora
    
    // Basado en otros scores
    const interest = this.calculateInitialInterest(concept, persona);
    const brandFit = this.calculateBrandFit(concept, persona);
    const priceAcceptance = this.calculatePriceAcceptance(concept, persona);
    
    score = Math.floor((interest + brandFit + priceAcceptance) / 3 * 0.8); // Descuento para realismo
    
    return Math.max(0, Math.min(100, score + this.randomVariation(12)));
  }
  
  private static calculateRecommendationLikelihood(concept: CampaignConcept, persona: ColombianSyntheticPersona): number {
    const purchaseIntent = this.calculatePurchaseIntent(concept, persona);
    let score = purchaseIntent - 10; // Típicamente menor que intención de compra
    
    // Ajustar por influencia familiar
    if (persona.characteristics.colombian_context.family_influence_level > 80) {
      score += 10;
    }
    
    return Math.max(0, Math.min(100, score + this.randomVariation(8)));
  }
  
  private static calculateBrandTrustInfluence(concept: CampaignConcept, persona: ColombianSyntheticPersona): number {
    return 70 + this.randomVariation(20); // Alta confianza en marcas Unilever
  }
  
  private static calculateCategoryRelevance(concept: CampaignConcept, persona: ColombianSyntheticPersona): number {
    const category = concept.technical_specs?.unilever_category;
    
    if (category === 'personal_care' && persona.characteristics.personal_care.beauty_routine !== 'minima') {
      return 80 + this.randomVariation(15);
    }
    if (category === 'foods' && persona.characteristics.food_consumption.cooking_frequency === 'diario') {
      return 85 + this.randomVariation(10);
    }
    if (category === 'home_care' && persona.characteristics.home_care.household_responsibilities.cleaning_responsibility_level > 70) {
      return 80 + this.randomVariation(15);
    }
    
    return 60 + this.randomVariation(20);
  }
  
  // Métodos de generación de feedback cualitativo
  private static generatePositiveAspects(concept: CampaignConcept, persona: ColombianSyntheticPersona): string[] {
    const baseProfile = COLOMBIAN_CONSUMER_PROFILES[persona.archetype];
    const aspects = [];
    
    aspects.push(`Me gusta que sea de ${concept.technical_specs?.unilever_brand}, es una marca de confianza`);
    
    if (concept.benefits && concept.benefits.length > 0) {
      aspects.push(`Los beneficios están buenos: ${concept.benefits[0]}`);
    }
    
    if (baseProfile.communication.excitement_moments.length > 0) {
      aspects.push(baseProfile.communication.excitement_moments[0]);
    }
    
    // Específico por región
    if (persona.location.region === 'costa_atlantica') {
      aspects.push('Se ve que entiende nuestro clima y necesidades');
    }
    
    return aspects.slice(0, 3);
  }
  
  private static generateConcerns(concept: CampaignConcept, persona: ColombianSyntheticPersona): string[] {
    const baseProfile = COLOMBIAN_CONSUMER_PROFILES[persona.archetype];
    return baseProfile.communication.skepticism_points.slice(0, 2);
  }
  
  private static generateSuggestions(concept: CampaignConcept, persona: ColombianSyntheticPersona): string[] {
    const suggestions = [];
    
    if (persona.location.region === 'costa_atlantica') {
      suggestions.push('Que sea resistente al calor y la humedad');
    }
    
    if (persona.characteristics.food_consumption.price_sensitivity === 'muy_alta') {
      suggestions.push('Un precio más accesible para familias');
    }
    
    suggestions.push('Más información sobre los ingredientes');
    
    return suggestions.slice(0, 3);
  }
  
  private static generateRegionalAdaptations(concept: CampaignConcept, persona: ColombianSyntheticPersona): string[] {
    const adaptations = [];
    
    const regionAdaptations = {
      'costa_atlantica': ['Fragancias tropicales', 'Resistencia al calor'],
      'region_andina': ['Productos para clima frío', 'Enfoque urbano sofisticado'],
      'antioquia': ['Valores familiares tradicionales', 'Confianza de generaciones'],
      'valle_del_cauca': ['Ingredientes naturales', 'Estilo de vida activo'],
      'llanos_orientales': ['Productos duraderos', 'Para trabajo pesado']
    };
    
    const region = persona.location.region as keyof typeof regionAdaptations;
    return regionAdaptations[region] || regionAdaptations.region_andina;
  }
  
  private static generateCompetitiveComparisons(concept: CampaignConcept, persona: ColombianSyntheticPersona): string[] {
    const brand = concept.technical_specs?.unilever_brand;
    
    const comparisons = {
      'Dove': ['Mejor que otros jabones porque hidrata más', 'Dove vs Protex: Dove es más suave'],
      'Fruco': ['Fruco tiene mejor sabor que las otras salsas', 'Fruco vs La Constancia: Fruco es más tradicional'],
      'OMO': ['OMO lava mejor que Fab', 'OMO vs Ariel: OMO cuida más la ropa']
    };
    
    return comparisons[brand as keyof typeof comparisons] || ['Buena opción vs competencia'];
  }
  
  // Métodos de generación de conversación auténtica
  private static generateInitialReaction(concept: CampaignConcept, persona: ColombianSyntheticPersona): string {
    const baseProfile = COLOMBIAN_CONSUMER_PROFILES[persona.archetype];
    const excitement = baseProfile.communication.excitement_moments[0] || '¡Qué interesante!';
    
    return `${excitement} ${concept.name} suena bien. ${concept.technical_specs?.unilever_brand} siempre ha sido buena marca.`;
  }
  
  private static generateDetailedOpinion(concept: CampaignConcept, persona: ColombianSyntheticPersona): string {
    const baseProfile = COLOMBIAN_CONSUMER_PROFILES[persona.archetype];
    const formalExpression = baseProfile.communication.formal_expressions[0] || 'En mi experiencia';
    
    return `${formalExpression}, me parece que ${concept.description.slice(0, 100)}... Los beneficios que menciona están interesantes, especialmente ${concept.benefits?.[0] || 'los que ofrece'}.`;
  }
  
  private static generateFinalThoughts(concept: CampaignConcept, persona: ColombianSyntheticPersona): string {
    const decisionStyle = this.calculatePurchaseIntent(concept, persona) > 60 ? 
      'Lo probaría sin dudar' : 
      'Necesito pensarlo un poquito más';
    
    return `${decisionStyle}. ${concept.technical_specs?.unilever_brand} es una marca que conozco y confío en ella.`;
  }
  
  // Métodos auxiliares
  private static randomVariation(range: number): number {
    return Math.floor(Math.random() * (range * 2 + 1)) - range;
  }
  
  private static aggregateScores(reactions: ColombianPersonaReaction[]) {
    const scores = reactions.map(r => r.reaction_details);
    
    return {
      interest: Math.round(scores.reduce((sum, s) => sum + s.initial_interest, 0) / scores.length),
      comprehension: Math.round(scores.reduce((sum, s) => sum + s.brand_fit, 0) / scores.length),
      relevance: Math.round(scores.reduce((sum, s) => sum + s.regional_relevance, 0) / scores.length),
      credibility: Math.round(scores.reduce((sum, s) => sum + s.brand_fit, 0) / scores.length),
      appeal: Math.round(scores.reduce((sum, s) => sum + s.initial_interest, 0) / scores.length),
      uniqueness: Math.round(scores.reduce((sum, s) => sum + s.brand_fit, 0) / scores.length),
      purchase_intent: Math.round(scores.reduce((sum, s) => sum + s.purchase_intent, 0) / scores.length)
    };
  }
  
  private static aggregateQualitativeFeedback(reactions: ColombianPersonaReaction[]) {
    const allPositive = reactions.flatMap(r => r.qualitative_feedback.positive_aspects);
    const allConcerns = reactions.flatMap(r => r.qualitative_feedback.concerns);
    const allSuggestions = reactions.flatMap(r => r.qualitative_feedback.suggestions);
    
    return {
      positive_themes: [...new Set(allPositive)].slice(0, 5),
      main_concerns: [...new Set(allConcerns)].slice(0, 3),
      improvement_suggestions: [...new Set(allSuggestions)].slice(0, 4),
      key_quotes: reactions.map(r => r.conversation_snippets.initial_reaction).slice(0, 3)
    };
  }
  
  private static generateConversationExamples(personas: ColombianSyntheticPersona[], concept: CampaignConcept): string[] {
    return personas.slice(0, 2).map(persona => {
      const reaction = this.simulatePersonaReaction(concept, persona);
      return `${persona.name}: "${reaction.conversation_snippets.initial_reaction}"`;
    });
  }
  
  private static generateArchetypeRecommendations(
    archetype: ColombianArchetype, 
    concept: CampaignConcept, 
    scores: any
  ): string[] {
    const recommendations = [];
    
    if (scores.purchase_intent < 50) {
      recommendations.push('Reforzar propuesta de valor para este segmento');
    }
    
    if (scores.relevance < 60) {
      recommendations.push('Adaptar mensaje para mayor relevancia regional');
    }
    
    const baseProfile = COLOMBIAN_CONSUMER_PROFILES[archetype];
    if (baseProfile.food_consumption.price_sensitivity === 'muy_alta' && concept.type === 'product_concept') {
      recommendations.push('Considerar estrategia de precio accessible');
    }
    
    recommendations.push(`Aprovechar fortalezas del arquetipo: ${baseProfile.lifestyle}`);
    
    return recommendations.slice(0, 4);
  }
  
  private static estimateSegmentSize(archetype: ColombianArchetype): string {
    const sizes = {
      COSTENA_EMPRENDEDORA: '15-20% mercado Costa Atlántica',
      BOGOTANA_PROFESIONAL: '25-30% mercado Bogotá',
      PAISA_TRADICIONAL: '20-25% mercado Antioquia',
      CALENA_MODERNA: '18-22% mercado Valle del Cauca',
      LLANERA_EMPRENDEDORA: '10-15% mercado Llanos Orientales'
    };
    
    return sizes[archetype] || '15-20% del mercado objetivo';
  }
  
  private static identifyCrossSellingOpportunities(concept: CampaignConcept, persona: ColombianSyntheticPersona): string[] {
    const opportunities = [];
    const category = concept.technical_specs?.unilever_category;
    
    if (category === 'personal_care') {
      if (persona.characteristics.food_consumption.fruco_usage_frequency !== 'nunca') {
        opportunities.push('Cross-selling con Fruco (cocina y cuidado personal)');
      }
      if (persona.characteristics.home_care.omo_usage_frequency !== 'nunca') {
        opportunities.push('Bundle familia completa con OMO');
      }
    }
    
    if (category === 'foods') {
      opportunities.push('Oportunidad con otras marcas de cuidado personal Unilever');
    }
    
    return opportunities.slice(0, 2);
  }
  
  private static generateInsights(reactions: SegmentReaction[], concept: CampaignConcept) {
    const avgScore = reactions.reduce((sum, r) => sum + r.scores.purchase_intent, 0) / reactions.length;
    
    const insights = {
      overall_performance: avgScore > 70 ? 'Excelente' : avgScore > 50 ? 'Bueno' : 'Necesita mejoras',
      strongest_segments: reactions
        .filter(r => r.scores.purchase_intent > 60)
        .map(r => r.archetype)
        .slice(0, 3),
      key_opportunities: [
        'Aprovechar confianza en marca Unilever',
        'Adaptar por región para mayor relevancia',
        'Reforzar beneficios específicos por arquetipo'
      ],
      implementation_priority: avgScore > 70 ? 'Alta' : avgScore > 50 ? 'Media' : 'Baja',
      regional_considerations: reactions.map(r => 
        `${r.archetype}: ${r.recommendations?.[0] || 'Optimizar propuesta'}`
      ).slice(0, 3)
    };
    
    return insights;
  }
}

// Export función principal
export const evaluateColombianConcept = ColombianCampaignEvaluator.evaluateConcept.bind(ColombianCampaignEvaluator);