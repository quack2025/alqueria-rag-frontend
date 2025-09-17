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
    occupation?: string;
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

// Nuevos tipos para el sistema consolidado tipo Study 1.json
export interface ConsolidatedStudyResult {
  id: string;
  conceptId: string;
  conceptName: string;
  syntheticUser: string;
  researchGoal: string;

  // Executive Summary consolidado
  executiveSummary: StudySection[];

  // Entrevistas individuales detalladas
  interviews: DetailedInterview[];

  // Metadata del estudio
  metadata: {
    totalInterviews: number;
    completedAt: Date;
    evaluationTime: number; // en segundos
    personas: string[];
  };
}

export interface StudySection {
  title: string;
  content: string;
  recommendation?: 'GO' | 'REFINE' | 'NO-GO'; // Para la recomendación estratégica
  keyInsights: StudyInsight[];
  relevantQuotes: StudyQuote[];
  keyTakeaways: string[];
}

export interface StudyInsight {
  title: string;
  summary: string;
  impact: string;
  variations: string;
}

export interface StudyQuote {
  text: string;
  speaker: string;
  context?: string;
}

export interface DetailedInterview {
  personaName: string;
  personaAge: number;
  userInformation: {
    personalInformation: {
      fullName: string;
      age: string;
      location: string;
      profession: string;
    };
    personalityTraits: Record<string, string>;
    dairyConsumption: {
      frequency: string;
      preferences: string[];
      concerns: string[];
      purchaseBehavior: string;
    };
  };
  conversation: ConversationExchange[];
  keyInsights: string[];
  emotionalTone: string;
  surprisingInsights: string[];
}

export interface ConversationExchange {
  question: string;
  response: string;
  emotionalTone?: string;
  keyThemes?: string[];
  dynamicFollowUps?: DynamicFollowUp[];
}

// FASE 1: Entrevistas Adaptativas Dinámicas
export interface DynamicFollowUp {
  trigger: string; // Lo que disparó la pregunta: "mencionó precio", "mostró entusiasmo", etc.
  question: string;
  reasoning: string; // Por qué se generó esta pregunta
  priority: 'high' | 'medium' | 'low';
}

export interface ResponseAnalysis {
  needsDeepDive: boolean;
  triggers: string[]; // ["precio_barrera", "entusiasmo_probioticos", "influencia_familiar"]
  emotion: string; // "ansiedad", "entusiasmo", "curiosidad", "escepticismo"
  opportunities: string[]; // Areas para explorar más
  barriers: string[]; // Barreras detectadas
  surprisingElements: string[]; // Elementos inesperados en la respuesta
}

export interface AdaptiveInterviewConfig {
  maxDynamicQuestions: number; // Máximo preguntas de seguimiento por respuesta
  emotionThreshold: number; // Umbral para detectar emociones fuertes (0-10)
  adaptiveMode: 'conservative' | 'moderate' | 'aggressive';
}

// Tipo para el progreso de evaluación en tiempo real
export interface EvaluationProgress {
  currentPhase: 'interviews' | 'consolidation' | 'completed';
  currentStep: number;
  totalSteps: number;
  currentPersona?: string;
  currentAction: string;
  timeElapsed: number;
  estimatedTimeRemaining?: number;
}