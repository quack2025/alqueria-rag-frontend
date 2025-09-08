// types/unileverPersona.types.ts - Tipos básicos para personas sintéticas de Unilever

export const UnileverArchetype = {
  COSTENA_EMPRENDEDORA: 'COSTENA_EMPRENDEDORA',
  BOGOTANA_PROFESIONAL: 'BOGOTANA_PROFESIONAL', 
  PAISA_TRADICIONAL: 'PAISA_TRADICIONAL',
  CALENA_MODERNA: 'CALENA_MODERNA',
  AMA_CASA_TRADICIONAL: 'AMA_CASA_TRADICIONAL',
  MADRE_MODERNA: 'MADRE_MODERNA',
  HOMBRE_MODERNO: 'HOMBRE_MODERNO'
} as const;

export type UnileverArchetype = typeof UnileverArchetype[keyof typeof UnileverArchetype];

export interface UnileverPersonaLocation {
  city: string;
  department: string;
  region: string;
  neighborhood?: string;
  country: string;
}

export interface UnileverPersonaDemographics {
  age: number;
  gender: 'female' | 'male' | 'other';
  nse_level: string;
  income_bracket_cop: [number, number];
  education_level: string;
  occupation: string;
  household_size: number;
  marital_status: string;
  children_count: number;
  housing_type: string;
}

export interface UnileverPersonaPsychographics {
  lifestyle: string;
  values: string[];
  interests: string[];
  media_consumption: string[];
  social_media: string[];
  hobbies: string[];
  aspirations: string[];
  frustrations: string[];
  brand_relationships: {
    trusted_brands: string[];
    avoided_brands: string[];
  };
}

export interface UnileverConversationStyle {
  tone: string;
  vocabulary_level: string;
  common_phrases: string[];
  expressions: string[];
  topics_of_interest: string[];
  communication_style: string;
  question_patterns: string[];
}

export interface Interaction {
  timestamp: Date;
  query: string;
  response: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topics_discussed: string[];
  insights_gathered: string[];
}

export interface UnileverSyntheticPersona {
  id: string;
  name: string;
  archetype: UnileverArchetype;
  demographics: UnileverPersonaDemographics;
  location: UnileverPersonaLocation;
  psychographics: UnileverPersonaPsychographics;
  conversation_style: UnileverConversationStyle;
  predefined_questions: string[];
  interaction_history: Interaction[];
  role_instructions: string;
  system_prompt: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  last_interaction?: Date;
}

// Plantillas básicas sin imports complejos
export const BASIC_UNILEVER_PERSONAS: Record<UnileverArchetype, Partial<UnileverSyntheticPersona>> = {
  [UnileverArchetype.COSTENA_EMPRENDEDORA]: {
    name: 'María José Martínez',
    demographics: { age: 32, gender: 'female', nse_level: 'C+' } as UnileverPersonaDemographics,
    location: { city: 'Barranquilla', department: 'Atlántico', region: 'Costa Atlántica', country: 'Colombia' },
  },
  [UnileverArchetype.BOGOTANA_PROFESIONAL]: {
    name: 'Andrea Carolina Rodríguez',
    demographics: { age: 28, gender: 'female', nse_level: 'B+' } as UnileverPersonaDemographics,
    location: { city: 'Bogotá', department: 'Cundinamarca', region: 'Región Central', country: 'Colombia' },
  },
  [UnileverArchetype.PAISA_TRADICIONAL]: {
    name: 'Luz Elena Restrepo',
    demographics: { age: 45, gender: 'female', nse_level: 'C' } as UnileverPersonaDemographics,
    location: { city: 'Medellín', department: 'Antioquia', region: 'Región Andina', country: 'Colombia' },
  },
  [UnileverArchetype.CALENA_MODERNA]: {
    name: 'Valeria Alejandra Castro',
    demographics: { age: 26, gender: 'female', nse_level: 'B' } as UnileverPersonaDemographics,
    location: { city: 'Cali', department: 'Valle del Cauca', region: 'Región Pacífica', country: 'Colombia' },
  },
  [UnileverArchetype.AMA_CASA_TRADICIONAL]: {
    name: 'Rosa María González',
    demographics: { age: 52, gender: 'female', nse_level: 'C+' } as UnileverPersonaDemographics,
    location: { city: 'Bucaramanga', department: 'Santander', region: 'Región Andina', country: 'Colombia' },
  },
  [UnileverArchetype.MADRE_MODERNA]: {
    name: 'Carolina Fernández',
    demographics: { age: 34, gender: 'female', nse_level: 'B+' } as UnileverPersonaDemographics,
    location: { city: 'Bogotá', department: 'Cundinamarca', region: 'Región Central', country: 'Colombia' },
  },
  [UnileverArchetype.HOMBRE_MODERNO]: {
    name: 'Andrés Felipe Morales',
    demographics: { age: 30, gender: 'male', nse_level: 'B' } as UnileverPersonaDemographics,
    location: { city: 'Medellín', department: 'Antioquia', region: 'Región Andina', country: 'Colombia' },
  }
};