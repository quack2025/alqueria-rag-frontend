// savitalSyntheticPersonas.ts - Integración de Usuarias Savital para Módulo Sintético
import { SAVITAL_FOCUS_GROUP, SavitalFocusUser } from './savitalFocusGroup';
import { UnileverPersona } from '../types/unileverPersona.types';

// Convertir usuarias Savital al formato UnileverPersona
export const SAVITAL_SYNTHETIC_PERSONAS: UnileverPersona[] = SAVITAL_FOCUS_GROUP.map((user: SavitalFocusUser) => ({
  id: user.id,
  name: user.name,
  age: user.age,
  city: user.city,
  occupation: user.occupation,
  gender: 'femenino' as const,
  nse: user.nse,
  archetype: `Savital ${user.savital_relationship.is_user ? 'Usuario' : 'Competidor'}`,
  
  description: `${user.name} es una ${user.occupation} de ${user.age} años en ${user.city}. ` +
               `${user.savital_relationship.is_user ? 'Usuario leal de Savital' : `Usuario de ${user.savital_relationship.current_preferred_brand}`}. ` +
               `Su principal preocupación capilar es ${user.hair_profile.main_concerns[0]}. ` +
               user.identity_relationship.self_description,

  demographics: {
    income_range: user.income_range,
    education_level: 'universitario', // Inferido del perfil
    household_size: user.life_context.family_composition.includes('hijos') ? 4 : 2,
    life_stage: user.life_context.current_life_stage,
    social_class: user.nse
  },

  psychographics: {
    values: user.values_beliefs.core_values,
    lifestyle: user.lifestyle_activities.hobbies,
    personality_traits: [
      user.personality_traits.innovation_adoption,
      user.personality_traits.risk_tolerance
    ],
    attitudes: user.values_beliefs.brand_expectations,
    interests: user.lifestyle_activities.social_activities
  },

  behavior: {
    shopping_habits: {
      frequency: user.purchase_behavior.shopping_frequency,
      channels: user.purchase_behavior.preferred_channels,
      decision_factors: user.purchase_behavior.decision_factors,
      brand_loyalty: user.brand_perception.loyalty_level,
      price_sensitivity: user.money_psychology.price_sensitivity
    },
    media_consumption: {
      preferred_channels: user.media_consumption.social_media,
      content_types: user.media_consumption.content_preferences,
      influencers_followed: user.media_consumption.influencer_types,
      engagement_level: 'high',
      peak_times: ['mañana', 'noche']
    },
    product_usage: {
      frequency: 'diaria',
      occasions: ['mañana', 'noche'],
      preferences: user.hair_profile.product_preferences,
      pain_points: user.hair_profile.main_concerns,
      satisfaction_drivers: user.ethnographic_profile.emotional_triggers.satisfaction_moments
    }
  },

  unilever_brands: {
    savital: {
      awareness: user.savital_relationship.is_user ? 10 : 8,
      usage: user.savital_relationship.is_user ? 'regular' : 'nunca',
      perception: user.savital_relationship.is_user 
        ? user.savital_relationship.loyalty_reasons 
        : user.savital_relationship.barriers_to_switch,
      purchase_intent: user.savital_relationship.is_user ? 8 : 4,
      recommendation_likelihood: user.savital_relationship.is_user ? 8 : 3
    },
    dove: {
      awareness: 9,
      usage: 'ocasional',
      perception: ['premium', 'suave', 'confiable'],
      purchase_intent: 6,
      recommendation_likelihood: 7
    }
  },

  needs_and_motivations: {
    functional: user.hair_profile.main_concerns.map(c => `Resolver ${c}`),
    emotional: [user.ethnographic_profile.emotional_triggers.satisfaction_moments[0]],
    social: [user.identity_relationship.ideal_self],
    aspirational: [user.identity_relationship.future_projection]
  },

  barriers_and_objections: {
    price: user.money_psychology.purchase_barriers,
    availability: user.purchase_behavior.shopping_constraints,
    trust: user.savital_relationship.is_user ? [] : user.savital_relationship.barriers_to_switch,
    habits: user.savital_relationship.is_user 
      ? [] 
      : [`Acostumbrada a ${user.savital_relationship.current_preferred_brand}`]
  },

  communication_preferences: {
    tone: user.communication_style.preferred_tone,
    channels: user.media_consumption.information_sources,
    message_types: user.values_beliefs.motivating_messages,
    visual_style: ['natural', 'auténtico', 'colombiano'],
    language_style: user.communication_style.expressions
  },

  customer_journey: {
    awareness_stage: user.savital_relationship.is_user ? 'usuario' : 'conoce',
    consideration_factors: user.purchase_behavior.decision_factors,
    purchase_triggers: user.money_psychology.purchase_triggers,
    usage_experience: user.savital_relationship.is_user 
      ? user.savital_relationship.loyalty_reasons.join(', ')
      : 'No usuario',
    loyalty_drivers: user.savital_relationship.is_user 
      ? user.savital_relationship.loyalty_reasons
      : []
  },

  segmentation: {
    primary: `${user.city}_${user.nse}_${user.age}`,
    secondary: user.savital_relationship.is_user ? 'savital_loyal' : 'competitor_user',
    micro: `${user.hair_profile.hair_type}_${user.hair_profile.main_concerns[0]}`,
    behavioral: user.personality_traits.shopping_style,
    generational: user.age < 30 ? 'millennial' : 'gen_x'
  },

  insights: {
    key_insight: user.ethnographic_profile.key_insight,
    opportunity_areas: [
      `Aprovechar ${user.ethnographic_profile.emotional_triggers.satisfaction_moments[0]}`,
      `Resolver ${user.hair_profile.main_concerns[0]}`
    ],
    innovation_potential: user.personality_traits.innovation_adoption === 'innovador' 
      ? ['alta disposición a probar nuevos conceptos']
      : ['necesita prueba social antes de cambiar'],
    market_implications: [
      `Representa segmento ${user.nse} en ${user.city}`,
      user.savital_relationship.is_user 
        ? 'Base leal para expandir línea'
        : 'Oportunidad de conversión desde competencia'
    ]
  }
}));

// Agregar metadata específica
export const SAVITAL_PERSONAS_METADATA = {
  research_date: '2024-2025',
  sample_size: 8,
  cities: ['Bogotá', 'Barranquilla'],
  nse_levels: ['C+', 'C'],
  age_range: '27-42',
  brand_split: {
    savital_users: 4,
    competitor_users: 4
  },
  key_competitors: ['L\'Oréal', 'Pantene', 'Head & Shoulders', 'Sedal'],
  research_methodology: 'Etnografía digital + Entrevistas profundas',
  validation_method: 'Triangulación con datos de mercado Unilever'
};