// types/dairy.types.ts - Tipos para la industria láctea de Alquería

export interface DairyConcept {
  id: string;
  name: string;
  category: 'leche' | 'yogurt' | 'queso' | 'kumis' | 'arequipe' | 'mantequilla' | 'crema' | 'derivados';
  brand: 'alqueria' | 'alqueria_premium' | 'alqueria_funcional' | 'alqueria_organica';
  description: string;
  benefits: string[];
  ingredients: string[];
  targetAudience: string;
  price?: number;
  differentiation: string;
  packaging?: string;
  nutritionalClaims?: string[];
  shelfLife?: number;
  distribution?: 'frio' | 'ambiente' | 'congelado';
  createdAt: Date;
}

export interface DairyPersona {
  id: string;
  name: string;
  archetype: string;
  variables: Record<string, any>;
  baseProfile: {
    age: number;
    gender: string;
    location: string;
    income: number;
    lifestyle: string;
  };
  dairyConsumption: {
    frequency: string;
    preferences: string[];
    concerns: string[];
    purchaseBehavior: string;
  };
  createdAt: Date;
}

export interface EvaluationResult {
  id: string;
  conceptId: string;
  personaId: string;
  conceptName: string;
  personaName: string;
  overallAcceptance: number;
  aspects: {
    taste: number;
    nutrition: number;
    convenience: number;
    price: number;
    packaging: number;
    brand: number;
  };
  qualitativeInsights: {
    quote: string;
    keyDrivers: string[];
    concerns: string[];
    suggestions: string[];
  };
  purchaseIntent: number;
  recommendationLikelihood: number;
  createdAt: Date;
}