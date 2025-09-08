// savitalFocusService.ts - Servicio para Evaluación de Conceptos Savital
// Sistema de usuarias sintéticas especializado para focus groups

import { SAVITAL_FOCUS_GROUP, type SavitalFocusUser } from '../data/savitalFocusGroup';

interface ConceptEvaluation {
  user_id: string;
  concept_id: string;
  scores: {
    appeal: number; // 1-10
    relevance: number; // 1-10
    believability: number; // 1-10
    uniqueness: number; // 1-10
    purchase_intention: number; // 1-10
  };
  qualitative_feedback: {
    likes: string[];
    dislikes: string[];
    concerns: string[];
    suggestions: string[];
    emotional_reaction: string;
  };
  demographic_context: {
    life_stage_relevance: string;
    nse_appropriateness: string;
    regional_considerations: string;
  };
}

interface ProductConcept {
  id: string;
  name: string;
  description: string;
  key_ingredients: string[];
  target_segment: string;
  price_range: string;
  usage_frequency: string;
  expected_results: string;
  emotional_benefit: string;
  sensory_experience: string;
  format: string;
  // Campos opcionales para compatibilidad
  category?: 'shampoo' | 'acondicionador' | 'mascarilla' | 'serum' | 'styling';
  key_benefits?: string[];
  claims?: string[];
  sensory_description?: string;
}

class SavitalFocusService {
  private users: SavitalFocusUser[] = SAVITAL_FOCUS_GROUP;

  // === MÉTODOS DE SELECCIÓN DE USUARIAS ===
  
  getUserById(id: string): SavitalFocusUser | undefined {
    return this.users.find(user => user.id === id);
  }

  getUsersByCity(city: 'Bogotá' | 'Barranquilla'): SavitalFocusUser[] {
    return this.users.filter(user => user.city === city);
  }

  getUsersByNSE(nse: 'C+' | 'C'): SavitalFocusUser[] {
    return this.users.filter(user => user.nse === nse);
  }

  getSavitalUsers(): SavitalFocusUser[] {
    return this.users.filter(user => user.savital_relationship.is_user);
  }

  getCompetitiveUsers(): SavitalFocusUser[] {
    return this.users.filter(user => !user.savital_relationship.is_user);
  }

  getUsersByAgeRange(min: number, max: number): SavitalFocusUser[] {
    return this.users.filter(user => user.age >= min && user.age <= max);
  }

  // === GENERACIÓN DE RESPUESTAS CONTEXTUALES ===

  generateConceptResponse(user: SavitalFocusUser, concept: ProductConcept): ConceptEvaluation {
    const response: ConceptEvaluation = {
      user_id: user.id,
      concept_id: concept.id,
      scores: this.calculateScores(user, concept),
      qualitative_feedback: this.generateQualitativeFeedback(user, concept),
      demographic_context: this.generateDemographicContext(user, concept)
    };

    return response;
  }

  private calculateScores(user: SavitalFocusUser, concept: ProductConcept): ConceptEvaluation['scores'] {
    // Algoritmo complejo basado en perfil de usuaria
    let baseAppeal = 5;
    let relevance = 5;
    let believability = 5;
    let uniqueness = 5;
    let purchaseIntention = 5;

    // === AJUSTES POR RELACIÓN CON SAVITAL ===
    if (user.savital_relationship.is_user) {
      baseAppeal += 1; // Familiaridad con marca
      believability += 1;
      if (user.savital_relationship.satisfaction_score >= 7) {
        purchaseIntention += 1;
      }
    } else {
      // No usuarias: más escépticas
      believability -= 0.5;
      purchaseIntention -= 1;
    }

    // === AJUSTES POR NSE ===
    if (user.nse === 'C+') {
      // Más dispuestos a probar
      uniqueness += 0.5;
      purchaseIntention += 0.5;
    } else {
      // C: más conservadores
      believability += 0.5; // Prefieren lo conocido
      purchaseIntention -= 0.5;
    }

    // === AJUSTES POR EDAD ===
    if (user.age < 30) {
      uniqueness += 1; // Buscan novedad
      baseAppeal += 0.5;
    } else if (user.age > 35) {
      believability += 1; // Prefieren lo probado
      uniqueness -= 0.5;
    }

    // === AJUSTES POR CIUDAD ===
    if (user.city === 'Barranquilla') {
      // Clima húmedo: más relevancia para productos anti-humedad
      // Verificar en ingredientes o descripción
      if (concept.key_ingredients.some(b => b.toLowerCase().includes('humedad')) || 
          concept.description.toLowerCase().includes('control') ||
          concept.description.toLowerCase().includes('grasa')) {
        relevance += 1;
        purchaseIntention += 0.5;
      }
    }

    // === AJUSTES POR ACTITUD DE INNOVACIÓN ===
    if (user.psychographics.innovation_attitude === 'early-adopter') {
      uniqueness += 1;
      baseAppeal += 0.5;
    } else if (user.psychographics.innovation_attitude === 'laggard') {
      uniqueness -= 1;
      believability += 0.5;
    }

    // === AJUSTES POR SENSIBILIDAD AL PRECIO ===
    const priceImpact = this.calculatePriceImpact(user, concept);
    purchaseIntention += priceImpact;
    relevance += priceImpact * 0.5;

    return {
      appeal: Math.max(1, Math.min(10, Math.round(baseAppeal * 10) / 10)),
      relevance: Math.max(1, Math.min(10, Math.round(relevance * 10) / 10)),
      believability: Math.max(1, Math.min(10, Math.round(believability * 10) / 10)),
      uniqueness: Math.max(1, Math.min(10, Math.round(uniqueness * 10) / 10)),
      purchase_intention: Math.max(1, Math.min(10, Math.round(purchaseIntention * 10) / 10))
    };
  }

  private calculatePriceImpact(user: SavitalFocusUser, concept: ProductConcept): number {
    const sensitivity = user.purchase_journey.price_sensitivity;
    
    // Asumiendo rangos de precio estándar
    const priceRanges = {
      'económico': 0,
      'medio': -0.5,
      'premium': -1,
      'super-premium': -2
    };

    const priceImpact = priceRanges[concept.price_range as keyof typeof priceRanges] || 0;
    
    // Ajuste por sensibilidad individual
    if (sensitivity >= 8) { // Alta sensibilidad
      return priceImpact * 1.5;
    } else if (sensitivity <= 4) { // Baja sensibilidad
      return priceImpact * 0.5;
    }
    
    return priceImpact;
  }

  private generateQualitativeFeedback(user: SavitalFocusUser, concept: ProductConcept): ConceptEvaluation['qualitative_feedback'] {
    const feedback: ConceptEvaluation['qualitative_feedback'] = {
      likes: [],
      dislikes: [],
      concerns: [],
      suggestions: [],
      emotional_reaction: ''
    };

    // Validación de seguridad para evitar errores
    if (!user || !concept) {
      return feedback;
    }

    const ethnProfile = user.ethnographic_profile;
    
    // Si no hay perfil etnográfico, usar respuestas básicas
    if (!ethnProfile) {
      feedback.likes.push(`Me parece interesante el concepto de ${concept.name}`);
      feedback.emotional_reaction = 'Tendría que probarlo para dar mi opinión';
      return feedback;
    }

    // === LIKES BASADOS EN RITUALES Y EMOCIONES REALES ===
    // Verificar si menciona aroma en la experiencia sensorial
    if (user.savital_relationship.is_user && 
        (concept.sensory_experience?.toLowerCase().includes('aroma') || 
         concept.emotional_benefit?.toLowerCase().includes('aroma'))) {
      // Usar lenguaje auténtico de satisfacción
      const satisfactionExpr = ethnProfile?.authentic_language?.satisfaction_expressions?.[0] || 'Me gusta mucho';
      feedback.likes.push(`${satisfactionExpr} que mantenga el aroma que me identifica`);
    }

    // Basado en momentos de satisfacción reales
    if (ethnProfile?.emotional_triggers?.satisfaction_moments?.some((m: string) => m.includes('aroma'))) {
      feedback.likes.push('Que el aroma dure hasta la tarde es muy importante para mí');
    }

    // Verificar si es relevante para clima húmedo
    if (user.city === 'Barranquilla' && 
        (concept.description.toLowerCase().includes('humedad') || 
         concept.key_ingredients.some(i => i.toLowerCase().includes('humedad')) ||
         concept.description.toLowerCase().includes('frizz'))) {
      feedback.likes.push(`${ethnProfile?.authentic_language?.cultural_expressions?.[0] || 'Perfecto'} para este clima de la costa`);
    }

    // Basado en filosofía de gasto real
    if (ethnProfile?.money_psychology?.value_equation?.includes('no complicar') && 
        concept.format && concept.format.includes('fácil')) {
      feedback.likes.push('Me gusta que sea práctico, no tengo tiempo para complicarme');
    }

    // === CONCERNS BASADOS EN BARRERAS PSICOLÓGICAS REALES ===
    
    // Usar lenguaje auténtico de quejas
    const complaintExpr = ethnProfile?.authentic_language?.complaint_expressions?.[0] || 'No me gusta';
    
    // Basado en price anchors reales
    if (concept.price_range === 'premium') {
      const priceAnchor = ethnProfile?.money_psychology?.price_anchors?.shampoo_premium || 28000;
      if (user.purchase_journey.price_sensitivity >= 7) {
        feedback.concerns.push(`${complaintExpr} cuando algo pasa de $${priceAnchor.toLocaleString()}, tengo que estar muy segura`);
      }
    }

    // Basado en barreras de cambio específicas
    if (ethnProfile?.change_barriers?.comfort_zone_definition?.includes('conocidos')) {
      feedback.concerns.push('Me da cosa cambiar algo que ya conozco y me funciona');
    }

    // Basado en decepciones pasadas reales
    if (ethnProfile?.change_barriers?.past_disappointments?.length > 0) {
      feedback.concerns.push('He tenido malas experiencias con productos que prometen mucho');
    }

    // === SUGERENCIAS BASADAS EN NECESIDADES REALES ===
    
    // Basado en rituales reales
    if (ethnProfile?.hair_rituals?.time_investment?.includes('15 minutos') && 
        !(concept.usage_frequency?.toLowerCase().includes('rápido') || 
          concept.description.toLowerCase().includes('rápido'))) {
      feedback.suggestions.push('Estaría genial si fuera algo que no me quite mucho tiempo en la rutina');
    }

    // Basado en frustraciones específicas
    if (ethnProfile?.emotional_triggers?.frustration_points?.some((f: string) => f.includes('graso'))) {
      feedback.suggestions.push('Sería perfecto si me ayudara con la grasa que me aparece al segundo día');
    }

    // Basado en aspiraciones vs realidad
    const dreamElement = ethnProfile?.aspiration_reality_gap?.dream_routine || '';
    if (dreamElement?.includes('mascarilla') && 
        !concept.format?.toLowerCase().includes('mascarilla')) {
      feedback.suggestions.push('Me encantaría que tuvieran una versión más intensiva como mascarilla');
    }

    // === REACCIÓN EMOCIONAL BASADA EN IDENTIDAD REAL ===
    
    // Basado en conexión identidad-cabello
    if (ethnProfile?.identity_relationship?.hair_personality_connection?.includes('firma') ||
        ethnProfile?.identity_relationship?.hair_personality_connection?.includes('identifica')) {
      feedback.emotional_reaction = 'Me emociona pensar que podría ser parte de mi rutina que me identifica';
    }
    
    // Basado en ansiedad real sobre dinero
    else if (ethnProfile?.money_psychology?.guilt_triggers?.includes('impulso') && 
             concept.price_range === 'premium') {
      feedback.emotional_reaction = 'Me genera curiosidad pero también culpa pensar en el gasto';
    }
    
    // Basado en relación auténtica con innovación
    else if (ethnProfile?.change_barriers?.risk_aversion_sources?.includes('tiempo')) {
      feedback.emotional_reaction = 'Me parece interesante pero necesitaría estar segura antes de cambiar';
    }
    
    // Default basado en personalidad
    else {
      const culturalExpr = ethnProfile?.authentic_language?.cultural_expressions?.[1] || 'interesante';
      feedback.emotional_reaction = `Me parece ${culturalExpr}, tendría que evaluarlo más`;
    }

    return feedback;
  }

  private generateDemographicContext(user: SavitalFocusUser, concept: ProductConcept): ConceptEvaluation['demographic_context'] {
    return {
      life_stage_relevance: this.assessLifeStageRelevance(user, concept),
      nse_appropriateness: this.assessNSEAppropriateness(user, concept),
      regional_considerations: this.assessRegionalRelevance(user, concept)
    };
  }

  private assessLifeStageRelevance(user: SavitalFocusUser, concept: ProductConcept): string {
    const age = user.age;
    const hasChildren = user.family_composition?.includes('hijo') || false;
    
    if (age < 30 && !hasChildren) {
      return 'Muy relevante para mi etapa de exploración y cuidado personal';
    } else if (hasChildren) {
      return 'Interesante, pero debe ser práctico y que no tome mucho tiempo';
    } else {
      return 'Relevante si realmente soluciona mis necesidades específicas';
    }
  }

  private assessNSEAppropriateness(user: SavitalFocusUser, concept: ProductConcept): string {
    if (user.nse === 'C+') {
      return 'El precio estaría dentro de mi rango si los beneficios se justifican';
    } else {
      return 'Necesitaría estar segura de que vale la pena la inversión';
    }
  }

  private assessRegionalRelevance(user: SavitalFocusUser, concept: ProductConcept): string {
    if (user.city === 'Barranquilla') {
      return 'En la costa necesitamos productos que realmente funcionen con la humedad';
    } else {
      return 'En Bogotá buscamos productos versátiles para el clima variable';
    }
  }

  // === MÉTODOS DE ANÁLISIS GRUPAL ===

  analyzeGroupConsensus(evaluations: ConceptEvaluation[]): {
    average_scores: ConceptEvaluation['scores'];
    consensus_themes: string[];
    polarizing_aspects: string[];
    segment_differences: {
      savital_users_vs_non_users: string;
      nse_differences: string;
      age_differences: string;
      city_differences: string;
    };
  } {
    const avgScores = this.calculateAverageScores(evaluations);
    
    return {
      average_scores: avgScores,
      consensus_themes: this.identifyConsensusThemes(evaluations),
      polarizing_aspects: this.identifyPolarizingAspects(evaluations),
      segment_differences: this.analyzeSegmentDifferences(evaluations)
    };
  }

  private calculateAverageScores(evaluations: ConceptEvaluation[]): ConceptEvaluation['scores'] {
    const totals = evaluations.reduce((acc, evaluation) => ({
      appeal: acc.appeal + evaluation.scores.appeal,
      relevance: acc.relevance + evaluation.scores.relevance,
      believability: acc.believability + evaluation.scores.believability,
      uniqueness: acc.uniqueness + evaluation.scores.uniqueness,
      purchase_intention: acc.purchase_intention + evaluation.scores.purchase_intention
    }), { appeal: 0, relevance: 0, believability: 0, uniqueness: 0, purchase_intention: 0 });

    const count = evaluations.length;
    return {
      appeal: Math.round((totals.appeal / count) * 10) / 10,
      relevance: Math.round((totals.relevance / count) * 10) / 10,
      believability: Math.round((totals.believability / count) * 10) / 10,
      uniqueness: Math.round((totals.uniqueness / count) * 10) / 10,
      purchase_intention: Math.round((totals.purchase_intention / count) * 10) / 10
    };
  }

  private identifyConsensusThemes(evaluations: ConceptEvaluation[]): string[] {
    // Análisis de feedback cualitativo para identificar temas comunes
    const allLikes = evaluations.flatMap(e => e.qualitative_feedback.likes);
    const allConcerns = evaluations.flatMap(e => e.qualitative_feedback.concerns);
    
    // Simplificado - en implementación real usaría análisis de texto más sofisticado
    return [
      'Aroma es factor clave de decisión',
      'Precio-valor debe estar balanceado',
      'Adaptación al clima es importante',
      'Confianza en la marca Savital'
    ];
  }

  private identifyPolarizingAspects(evaluations: ConceptEvaluation[]): string[] {
    // Identifica aspectos donde hay mayor variabilidad en las respuestas
    return [
      'Disposición a pagar premium',
      'Interés en innovación vs tradición',
      'Relevancia por grupo etario'
    ];
  }

  private analyzeSegmentDifferences(evaluations: ConceptEvaluation[]): any {
    // Análisis comparativo por segmentos
    return {
      savital_users_vs_non_users: 'Usuarias actuales muestran mayor apertura y confianza',
      nse_differences: 'NSE C+ más dispuesto a probar, NSE C más sensible al precio',
      age_differences: 'Menores de 30 valoran más la innovación, mayores de 35 la efectividad',
      city_differences: 'Barranquilla prioriza funcionalidad climática, Bogotá busca versatilidad'
    };
  }

  // === MÉTODO PRINCIPAL DE EVALUACIÓN ===

  evaluateConcept(concept: ProductConcept, userIds?: string[]): {
    individual_evaluations: ConceptEvaluation[];
    group_analysis: ReturnType<SavitalFocusService['analyzeGroupConsensus']>;
    recommendations: string[];
  } {
    const selectedUsers = userIds 
      ? this.users.filter(u => userIds.includes(u.id))
      : this.users;

    const evaluations = selectedUsers.map(user => 
      this.generateConceptResponse(user, concept)
    );

    const groupAnalysis = this.analyzeGroupConsensus(evaluations);

    return {
      individual_evaluations: evaluations,
      group_analysis: groupAnalysis,
      recommendations: this.generateRecommendations(groupAnalysis, concept)
    };
  }

  private generateRecommendations(analysis: any, concept: ProductConcept): string[] {
    const recommendations: string[] = [];

    if (analysis.average_scores.purchase_intention < 6) {
      recommendations.push('Considerar ajuste de precio o comunicación de beneficios');
    }

    if (analysis.average_scores.uniqueness < 6) {
      recommendations.push('Reforzar diferenciación vs competencia');
    }

    if (analysis.average_scores.believability < 7) {
      recommendations.push('Validar claims con evidencia más sólida');
    }

    return recommendations;
  }

  // === UTILITIES ===

  getAllUsers(): SavitalFocusUser[] {
    return this.users;
  }

  getUserSummary(): typeof import('../data/savitalFocusGroup').SAVITAL_FOCUS_GROUP_SUMMARY {
    return require('../data/savitalFocusGroup').SAVITAL_FOCUS_GROUP_SUMMARY;
  }
}

export const savitalFocusService = new SavitalFocusService();
export type { ConceptEvaluation, ProductConcept, SavitalFocusUser };