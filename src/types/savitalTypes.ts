// savitalTypes.ts - Tipos para el sistema de evaluación Savital

export interface ProductConcept {
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
}

export interface ConceptEvaluation {
  user_id: string;
  user_name: string;
  scores: {
    appeal: number;
    relevance: number;
    believability: number;
    uniqueness: number;
    purchase_intention: number;
  };
  qualitative_feedback: {
    likes: string[];
    concerns: string[];
    suggestions: string[];
    emotional_reaction: string;
  };
}

export interface CompleteEvaluation {
  concept_id: string;
  concept_name: string;
  individual_evaluations: ConceptEvaluation[];
  group_analysis: {
    average_scores: {
      appeal: number;
      relevance: number;
      believability: number;
      uniqueness: number;
      purchase_intention: number;
    };
    consensus_themes: string[];
    polarizing_aspects: string[];
  };
  recommendations: string[];
}