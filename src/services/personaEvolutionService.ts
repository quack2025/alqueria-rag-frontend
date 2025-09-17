/**
 * Persona Evolution Service - Dynamic persona learning and adaptation
 * 
 * Features:
 * - Personas learn from evaluation experiences
 * - Brand relationship updates based on concept exposure
 * - Dynamic variable adjustment over time
 * - Memory system for past evaluations
 * - Synthetic organic parity through experience accumulation
 */

import type { SyntheticPersona, Concept, EvaluationResult } from '../components/InnovationLab/InnovationLabContainer';

// ===== EVOLUTION TYPES =====

export interface PersonaExperience {
  conceptId: string;
  conceptName: string;
  brandExposed: string;
  categoryExposed: string;
  evaluationResult: 'alta' | 'media' | 'baja';
  keyLearnings: string[];
  timestamp: Date;
}

export interface EvolutionUpdate {
  variableUpdates: { [key: string]: any };
  brandRelationshipUpdates: { [brand: string]: any };
  newExperiences: PersonaExperience[];
  confidenceScore: number;
}

export interface PersonaMemory {
  totalEvaluations: number;
  brandExposures: { [brand: string]: number };
  categoryPreferences: { [category: string]: 'positive' | 'neutral' | 'negative' };
  recentExperiences: PersonaExperience[];
  personalityDrift: { [trait: string]: number };
}

// ===== PERSONA EVOLUTION ENGINE =====

export class PersonaEvolutionEngine {
  private memoryStorage: { [personaId: string]: PersonaMemory } = {};

  /**
   * Evolve persona based on evaluation experience
   */
  evolvePersona(
    persona: SyntheticPersona,
    concept: Concept,
    evaluation: EvaluationResult
  ): { updatedPersona: SyntheticPersona; evolutionSummary: string } {
    // Get or create memory for this persona
    const memory = this.getPersonaMemory(persona.id);
    
    // Create experience record
    const experience: PersonaExperience = {
      conceptId: concept.id,
      conceptName: concept.name,
      brandExposed: concept.brand,
      categoryExposed: concept.category,
      evaluationResult: evaluation.overallAcceptance,
      keyLearnings: evaluation.keyDrivers,
      timestamp: new Date()
    };
    
    // Calculate evolution updates
    const evolutionUpdate = this.calculateEvolutionUpdate(persona, concept, evaluation, memory, experience);
    
    // Apply updates to persona
    const updatedPersona = this.applyEvolutionUpdate(persona, evolutionUpdate);
    
    // Update memory
    this.updatePersonaMemory(persona.id, memory, experience);
    
    // Generate evolution summary
    const evolutionSummary = this.generateEvolutionSummary(persona, evolutionUpdate, experience);
    
    return { updatedPersona, evolutionSummary };
  }

  /**
   * Get or initialize persona memory
   */
  private getPersonaMemory(personaId: string): PersonaMemory {
    if (!this.memoryStorage[personaId]) {
      this.memoryStorage[personaId] = {
        totalEvaluations: 0,
        brandExposures: {},
        categoryPreferences: {},
        recentExperiences: [],
        personalityDrift: {}
      };
    }
    return this.memoryStorage[personaId];
  }

  /**
   * Calculate what should change based on the evaluation
   */
  private calculateEvolutionUpdate(
    persona: SyntheticPersona,
    concept: Concept,
    evaluation: EvaluationResult,
    memory: PersonaMemory,
    experience: PersonaExperience
  ): EvolutionUpdate {
    const variableUpdates: { [key: string]: any } = {};
    const brandRelationshipUpdates: { [brand: string]: any } = {};
    
    // Update brand relationship based on evaluation
    const currentBrandRel = persona.brandRelationships[concept.brand] || {};
    const newBrandPerception = this.calculateNewBrandPerception(
      currentBrandRel.percepcion || 'Neutral',
      evaluation.overallAcceptance,
      memory.brandExposures[concept.brand] || 0
    );
    
    brandRelationshipUpdates[concept.brand] = {
      ...currentBrandRel,
      percepcion: newBrandPerception,
      uso: this.calculateUsageFrequency(evaluation.overallAcceptance),
      ultima_experiencia: evaluation.overallAcceptance,
      fecha_actualizacion: new Date().toISOString()
    };
    
    // Update category preferences
    const categoryPref = this.calculateCategoryPreference(evaluation.overallAcceptance);
    
    // Update persona variables based on experience
    if (evaluation.overallAcceptance === 'alta') {
      // Positive experience - increase openness to innovation
      const innovationVar = persona.variables.find(v => v.key === 'innovacion');
      if (innovationVar && typeof innovationVar.value === 'number') {
        variableUpdates['innovacion'] = Math.min(10, innovationVar.value + 0.5);
      }
      
      // Might decrease price sensitivity if high quality experience
      const priceSensVar = persona.variables.find(v => v.key === 'sensibilidad_precio');
      if (priceSensVar && typeof priceSensVar.value === 'number' && concept.price && concept.price > 20000) {
        variableUpdates['sensibilidad_precio'] = Math.max(1, priceSensVar.value - 0.3);
      }
    } else if (evaluation.overallAcceptance === 'baja') {
      // Negative experience - increase caution
      const brandLoyaltyVar = persona.variables.find(v => v.key === 'lealtad_marca');
      if (brandLoyaltyVar && typeof brandLoyaltyVar.value === 'number') {
        variableUpdates['lealtad_marca'] = Math.min(10, brandLoyaltyVar.value + 0.3);
      }
    }
    
    return {
      variableUpdates,
      brandRelationshipUpdates,
      newExperiences: [experience],
      confidenceScore: this.calculateConfidenceScore(memory.totalEvaluations)
    };
  }

  /**
   * Calculate new brand perception based on evaluation
   */
  private calculateNewBrandPerception(
    currentPerception: string,
    evaluationResult: 'alta' | 'media' | 'baja',
    previousExposures: number
  ): string {
    const perceptionMap = {
      'muy_negativo': 1,
      'negativo': 2,
      'neutral': 3,
      'positivo': 4,
      'muy_positivo': 5,
      'Excelente': 5,
      'Bueno': 4,
      'Regular': 3,
      'Malo': 2,
      'Muy malo': 1
    };
    
    const currentScore = perceptionMap[currentPerception as keyof typeof perceptionMap] || 3;
    
    // Calculate impact based on evaluation
    let impact = 0;
    switch (evaluationResult) {
      case 'alta': impact = 0.5; break;
      case 'media': impact = 0.1; break;
      case 'baja': impact = -0.3; break;
    }
    
    // Reduce impact if many previous exposures (diminishing returns)
    const adjustedImpact = impact / (1 + previousExposures * 0.1);
    
    const newScore = Math.max(1, Math.min(5, currentScore + adjustedImpact));
    
    const reverseMap = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
    return reverseMap[Math.round(newScore)];
  }

  /**
   * Calculate usage frequency based on evaluation
   */
  private calculateUsageFrequency(evaluationResult: 'alta' | 'media' | 'baja'): string {
    switch (evaluationResult) {
      case 'alta': return 'Regular';
      case 'media': return 'Ocasional';
      case 'baja': return 'Rara vez';
    }
  }

  /**
   * Calculate category preference
   */
  private calculateCategoryPreference(evaluationResult: 'alta' | 'media' | 'baja'): 'positive' | 'neutral' | 'negative' {
    switch (evaluationResult) {
      case 'alta': return 'positive';
      case 'media': return 'neutral';
      case 'baja': return 'negative';
    }
  }

  /**
   * Calculate confidence score for evolution accuracy
   */
  private calculateConfidenceScore(totalEvaluations: number): number {
    // Confidence increases with experience but plateaus
    return Math.min(0.95, 0.5 + (totalEvaluations * 0.05));
  }

  /**
   * Apply evolution updates to persona
   */
  private applyEvolutionUpdate(persona: SyntheticPersona, update: EvolutionUpdate): SyntheticPersona {
    // Deep clone persona
    const updatedPersona: SyntheticPersona = JSON.parse(JSON.stringify(persona));
    
    // Update variables
    Object.entries(update.variableUpdates).forEach(([key, value]) => {
      const variable = updatedPersona.variables.find(v => v.key === key);
      if (variable) {
        variable.value = value;
      }
    });
    
    // Update brand relationships
    Object.entries(update.brandRelationshipUpdates).forEach(([brand, relationship]) => {
      updatedPersona.brandRelationships[brand] = relationship;
    });
    
    // Update timestamps
    updatedPersona.updatedAt = new Date();
    
    return updatedPersona;
  }

  /**
   * Update persona memory with new experience
   */
  private updatePersonaMemory(personaId: string, memory: PersonaMemory, experience: PersonaExperience): void {
    memory.totalEvaluations++;
    
    // Update brand exposures
    if (!memory.brandExposures[experience.brandExposed]) {
      memory.brandExposures[experience.brandExposed] = 0;
    }
    memory.brandExposures[experience.brandExposed]++;
    
    // Update category preferences
    memory.categoryPreferences[experience.categoryExposed] = 
      this.calculateCategoryPreference(experience.evaluationResult);
    
    // Add to recent experiences (keep last 10)
    memory.recentExperiences.unshift(experience);
    if (memory.recentExperiences.length > 10) {
      memory.recentExperiences = memory.recentExperiences.slice(0, 10);
    }
    
    // Save to storage (in real app, this would be persisted)
    this.memoryStorage[personaId] = memory;
  }

  /**
   * Generate human-readable evolution summary
   */
  private generateEvolutionSummary(
    persona: SyntheticPersona,
    update: EvolutionUpdate,
    experience: PersonaExperience
  ): string {
    const summaryParts: string[] = [];
    
    // Brand relationship changes
    Object.entries(update.brandRelationshipUpdates).forEach(([brand, relationship]) => {
      const oldRel = persona.brandRelationships[brand];
      if (oldRel && oldRel.percepcion !== relationship.percepcion) {
        summaryParts.push(`Percepción de ${brand}: ${oldRel.percepcion} → ${relationship.percepcion}`);
      } else if (!oldRel) {
        summaryParts.push(`Nueva relación con ${brand}: ${relationship.percepcion}`);
      }
    });
    
    // Variable changes
    Object.entries(update.variableUpdates).forEach(([key, newValue]) => {
      const oldVar = persona.variables.find(v => v.key === key);
      if (oldVar) {
        summaryParts.push(`${key}: ${oldVar.value} → ${newValue}`);
      }
    });
    
    // Experience summary
    const experienceSummary = `Evaluó "${experience.conceptName}" con resultado: ${experience.evaluationResult}`;
    
    if (summaryParts.length === 0) {
      return `${experienceSummary}. Sin cambios significativos.`;
    }
    
    return `${experienceSummary}. Cambios: ${summaryParts.join(', ')}.`;
  }

  /**
   * Get persona learning history
   */
  getPersonaLearningHistory(personaId: string): PersonaMemory | null {
    return this.memoryStorage[personaId] || null;
  }

  /**
   * Reset persona memory (for testing)
   */
  resetPersonaMemory(personaId: string): void {
    delete this.memoryStorage[personaId];
  }

  /**
   * Export all persona memories (for backup/restore)
   */
  exportMemories(): { [personaId: string]: PersonaMemory } {
    return JSON.parse(JSON.stringify(this.memoryStorage));
  }

  /**
   * Import persona memories (from backup)
   */
  importMemories(memories: { [personaId: string]: PersonaMemory }): void {
    this.memoryStorage = memories;
  }
}

// ===== SINGLETON INSTANCE =====
export const personaEvolution = new PersonaEvolutionEngine();

// ===== UTILITY FUNCTIONS =====

/**
 * Apply persona evolution after evaluation
 */
export function evolvePersonaFromEvaluation(
  persona: SyntheticPersona,
  concept: Concept,
  evaluation: EvaluationResult
): { updatedPersona: SyntheticPersona; evolutionSummary: string } {
  return personaEvolution.evolvePersona(persona, concept, evaluation);
}

/**
 * Get persona's learning progress
 */
export function getPersonaLearningProgress(personaId: string): {
  totalExperiences: number;
  brandFamiliarity: { [brand: string]: number };
  confidenceLevel: number;
} | null {
  const memory = personaEvolution.getPersonaLearningHistory(personaId);
  if (!memory) return null;

  return {
    totalExperiences: memory.totalEvaluations,
    brandFamiliarity: memory.brandExposures,
    confidenceLevel: Math.min(0.95, 0.5 + (memory.totalEvaluations * 0.05))
  };
}