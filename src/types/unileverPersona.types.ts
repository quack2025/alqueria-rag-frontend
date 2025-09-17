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

export interface HairProfile {
  hair_type: 'graso' | 'seco' | 'mixto' | 'normal';
  hair_texture: 'liso' | 'ondulado' | 'rizado' | 'crespo';
  main_concerns: string[];
  washing_frequency: 'diario' | '3-4 veces/semana' | '2-3 veces/semana' | 'semanal';
  styling_habits: string[];
  damage_level: 'bajo' | 'medio' | 'alto';
  chemical_treatments: string[];
  preferred_brands: string[];
  product_usage_patterns: string[];
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
  hair_profile: HairProfile;
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
    hair_profile: {
      hair_type: 'mixto',
      hair_texture: 'ondulado',
      main_concerns: ['Falta de volumen', 'Humedad/frizz por clima caribeño', 'Raíz grasa'],
      washing_frequency: '3-4 veces/semana',
      styling_habits: ['Plancha ocasional', 'Secador diario', 'Trenzas para trabajar'],
      damage_level: 'medio',
      chemical_treatments: ['Tinte profesional cada 3 meses', 'Tratamientos caseros'],
      preferred_brands: ['Savital', 'Sedal', 'Pantene'],
      product_usage_patterns: ['Shampoo control grasa', 'Acondicionador hidratante', 'Spray anti-frizz']
    }
  },
  [UnileverArchetype.BOGOTANA_PROFESIONAL]: {
    name: 'Andrea Carolina Rodríguez',
    demographics: { age: 28, gender: 'female', nse_level: 'B+' } as UnileverPersonaDemographics,
    location: { city: 'Bogotá', department: 'Cundinamarca', region: 'Región Central', country: 'Colombia' },
    hair_profile: {
      hair_type: 'normal',
      hair_texture: 'liso',
      main_concerns: ['Mantener profesionalismo', 'Protección ambiental urbana', 'Practicidad'],
      washing_frequency: 'diario',
      styling_habits: ['Secado profesional', 'Plancha semanalmente', 'Peinados elegantes'],
      damage_level: 'bajo',
      chemical_treatments: ['Cortes profesionales', 'Tratamientos de salón cada 2 meses'],
      preferred_brands: ['Dove', 'L\'Oréal Professional', 'TRESemmé'],
      product_usage_patterns: ['Shampoo nutritivo', 'Acondicionador sin enjuague', 'Spray termo-protector']
    }
  },
  [UnileverArchetype.PAISA_TRADICIONAL]: {
    name: 'Luz Elena Restrepo',
    demographics: { age: 45, gender: 'female', nse_level: 'C' } as UnileverPersonaDemographics,
    location: { city: 'Medellín', department: 'Antioquia', region: 'Región Andina', country: 'Colombia' },
    hair_profile: {
      hair_type: 'normal',
      hair_texture: 'ondulado',
      main_concerns: ['Canas emergentes', 'Mantener tradición', 'Cuidado básico'],
      washing_frequency: '2-3 veces/semana',
      styling_habits: ['Secado natural', 'Recogidos tradicionales', 'Mínimo heat styling'],
      damage_level: 'bajo',
      chemical_treatments: ['Tinte casero para canas', 'Mascarillas naturales'],
      preferred_brands: ['Sedal', 'Herbal Essences', 'Marcas tradicionales'],
      product_usage_patterns: ['Shampoo suave', 'Acondicionador nutritivo', 'Aceites naturales']
    }
  },
  [UnileverArchetype.CALENA_MODERNA]: {
    name: 'Valeria Alejandra Castro',
    demographics: { age: 26, gender: 'female', nse_level: 'B' } as UnileverPersonaDemographics,
    location: { city: 'Cali', department: 'Valle del Cauca', region: 'Región Pacífica', country: 'Colombia' },
    hair_profile: {
      hair_type: 'mixto',
      hair_texture: 'rizado',
      main_concerns: ['Definición de rizos', 'Control del frizz', 'Trends y moda'],
      washing_frequency: '2-3 veces/semana',
      styling_habits: ['Método curly girl', 'Difusor', 'Productos leave-in'],
      damage_level: 'medio',
      chemical_treatments: ['Balayage', 'Tratamientos hidratantes', 'Cortes especializados'],
      preferred_brands: ['DevaCurl', 'Moroccanoil', 'Shea Moisture'],
      product_usage_patterns: ['Co-wash', 'Crema definidora', 'Aceite para puntas']
    }
  },
  [UnileverArchetype.AMA_CASA_TRADICIONAL]: {
    name: 'Rosa María González',
    demographics: { age: 52, gender: 'female', nse_level: 'C+' } as UnileverPersonaDemographics,
    location: { city: 'Bucaramanga', department: 'Santander', region: 'Región Andina', country: 'Colombia' },
    hair_profile: {
      hair_type: 'seco',
      hair_texture: 'liso',
      main_concerns: ['Canas abundantes', 'Sequedad', 'Pérdida de densidad'],
      washing_frequency: '2-3 veces/semana',
      styling_habits: ['Secado natural', 'Peinados sencillos', 'Recogido tradicional'],
      damage_level: 'medio',
      chemical_treatments: ['Tinte para canas regular', 'Permanente ocasional'],
      preferred_brands: ['Sedal', 'Savital', 'Head & Shoulders'],
      product_usage_patterns: ['Shampoo hidratante', 'Mascarilla semanal', 'Aceite capilar']
    }
  },
  [UnileverArchetype.MADRE_MODERNA]: {
    name: 'Carolina Fernández',
    demographics: { age: 34, gender: 'female', nse_level: 'B+' } as UnileverPersonaDemographics,
    location: { city: 'Bogotá', department: 'Cundinamarca', region: 'Región Central', country: 'Colombia' },
    hair_profile: {
      hair_type: 'mixto',
      hair_texture: 'ondulado',
      main_concerns: ['Practicidad por maternidad', 'Caída post-parto', 'Tiempo limitado'],
      washing_frequency: '3-4 veces/semana',
      styling_habits: ['Peinados rápidos', 'Coleta alta', 'Secado al aire'],
      damage_level: 'medio',
      chemical_treatments: ['Cortes prácticos', 'Retoques raíz ocasionales'],
      preferred_brands: ['Dove', 'Johnson\'s Baby (para familia)', 'Pantene'],
      product_usage_patterns: ['Shampoo 2-en-1', 'Acondicionador instantáneo', 'Productos multifunción']
    }
  },
  [UnileverArchetype.HOMBRE_MODERNO]: {
    name: 'Andrés Felipe Morales',
    demographics: { age: 30, gender: 'male', nse_level: 'B' } as UnileverPersonaDemographics,
    location: { city: 'Medellín', department: 'Antioquia', region: 'Región Andina', country: 'Colombia' },
    hair_profile: {
      hair_type: 'mixto',
      hair_texture: 'liso',
      main_concerns: ['Caspa ocasional', 'Grasa en raíz', 'Mantenimiento fácil'],
      washing_frequency: 'diario',
      styling_habits: ['Gel modelador', 'Corte fade regular', 'Estilo minimalista'],
      damage_level: 'bajo',
      chemical_treatments: ['Cortes profesionales mensuales'],
      preferred_brands: ['Head & Shoulders', 'Dove Men+Care', 'Clear'],
      product_usage_patterns: ['Shampoo anticaspa', '2-en-1 práctico', 'Styling gel']
    }
  }
};