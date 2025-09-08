// types/colombianPersona.types.ts - Tipos para arquetipos colombianos de Unilever

// Los 5 Arquetipos de Consumidoras Colombianas para Unilever
export const ColombianArchetype = {
  COSTENA_EMPRENDEDORA: 'COSTENA_EMPRENDEDORA',
  BOGOTANA_PROFESIONAL: 'BOGOTANA_PROFESIONAL', 
  PAISA_TRADICIONAL: 'PAISA_TRADICIONAL',
  CALENA_MODERNA: 'CALENA_MODERNA',
  LLANERA_EMPRENDEDORA: 'LLANERA_EMPRENDEDORA'
} as const;

export type ColombianArchetype = typeof ColombianArchetype[keyof typeof ColombianArchetype];

// Características específicas para consumidoras colombianas
export interface ColombianPersonaCharacteristics {
  // Demografia colombiana
  demographics: {
    age: number;
    gender: 'female'; // Enfoque en mujeres
    income_bracket: 'A/B+' | 'B' | 'B/C+' | 'C+' | 'C' | 'C/D' | 'D/E';
    education_level: 'primary' | 'secondary' | 'technical' | 'university' | 'postgraduate';
    employment_status: 'employed' | 'self-employed' | 'homemaker' | 'student' | 'entrepreneur';
    household_size: number;
    marital_status: 'single' | 'married' | 'divorced' | 'widowed' | 'cohabiting';
    children_count: number;
    location_type: 'urban' | 'suburban' | 'rural';
    housing_type: 'owned' | 'rented' | 'family' | 'other';
    region: 'costa_atlantica' | 'region_andina' | 'antioquia' | 'valle_del_cauca' | 'llanos_orientales' | 'other';
    city: string;
  };

  // Consumo de alimentos específico
  food_consumption: {
    cooking_frequency: 'diario' | 'frecuente' | 'ocasional';
    meal_preparation: 'desde_cero' | 'semi_preparado' | 'convenience';
    
    // Uso específico de marcas Unilever - Alimentos
    fruco_usage_frequency: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'nunca';
    fruco_products_used: string[]; // ej: ['salsa_tomate', 'mayonesa', 'aderezos']
    fruco_usage_occasions: string[]; // ej: ['almuerzo_familiar', 'cenas', 'sancochos']
    
    knorr_usage_frequency: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'nunca';
    knorr_products_used: string[]; // ej: ['caldos', 'sazones', 'sopas']
    
    condiment_preferences: string[]; // sabores regionales
    shopping_behavior: string;
    price_sensitivity: 'muy_alta' | 'alta' | 'media' | 'baja';
    health_consciousness: 'muy_alta' | 'alta' | 'media' | 'baja';
    flavor_preferences: string[]; // preferencias regionales
    
    regional_food_culture: {
      traditional_dishes: string[];
      cooking_methods: string[];
      seasonal_preferences: string[];
      family_influence: number; // 0-100
    };
  };

  // Cuidado personal específico
  personal_care: {
    // Dove usage
    dove_usage_frequency: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'nunca';
    dove_products_used: string[]; // ej: ['body_wash', 'soap_bar', 'deodorant', 'lotion']
    dove_purchase_drivers: string[]; // ej: ['hidratacion', 'suavidad', 'confianza_marca']
    
    // Suave usage  
    suave_usage_frequency: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'nunca';
    suave_products_used: string[]; // ej: ['shampoo', 'conditioner', 'tratamientos']
    suave_benefits_sought: string[]; // ej: ['brillo', 'suavidad', 'reparacion']
    
    // Rexona usage
    rexona_usage_frequency: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'nunca';
    rexona_products_used: string[]; // ej: ['desodorante_barra', 'aerosol', 'clinical']
    rexona_usage_context: string[]; // ej: ['trabajo', 'ejercicio', 'eventos_sociales']
    
    beauty_routine: 'completa' | 'basica' | 'minima';
    skincare_priority: string[];
    haircare_priority: string[];
    climate_considerations: string[]; // ej: ['humedad', 'calor', 'contaminacion']
    shopping_channels: string[];
    brand_loyalty: 'muy_alta' | 'alta' | 'media' | 'baja';
    innovation_openness: 'muy_alta' | 'alta' | 'media' | 'baja';
    premium_willingness: 'muy_alta' | 'alta' | 'media' | 'baja';
  };

  // Limpieza del hogar
  home_care: {
    // OMO usage
    omo_usage_frequency: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'nunca';
    omo_products_used: string[]; // ej: ['detergente_polvo', 'liquido', 'capsulas']
    omo_washing_contexts: string[]; // ej: ['ropa_trabajo', 'uniformes_escolares', 'ropa_bebe']
    
    // Cif usage
    cif_usage_frequency: 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'nunca';
    cif_products_used: string[]; // ej: ['limpiador_cocina', 'baño', 'pisos']
    cif_cleaning_priorities: string[]; // ej: ['desinfeccion', 'brillo', 'fragancia']
    
    cleaning_frequency: string;
    eco_preference: 'muy_alta' | 'alta' | 'media' | 'baja';
    bulk_buying: boolean;
    brand_switching: 'nunca' | 'ocasional' | 'frecuente';
    
    household_responsibilities: {
      is_primary_shopper: boolean;
      cleaning_responsibility_level: number; // 0-100
      family_decision_influence: number; // 0-100
    };
  };

  // Patrones de comunicación colombianos
  communication: {
    formality_level: 'muy_formal' | 'formal' | 'neutral' | 'informal' | 'muy_informal';
    regional_expressions: string[]; // expresiones típicas de la región
    formal_expressions: string[];
    informal_expressions: string[];
    decision_triggers: string[];
    skepticism_points: string[];
    excitement_moments: string[];
    
    brand_relationship_language: {
      dove_expressions: string[];
      fruco_expressions: string[];
      omo_expressions: string[];
      unilever_brand_trust: string[];
    };
  };

  // Contexto sociocultural colombiano
  colombian_context: {
    region: string;
    cultural_values: string[];
    family_influence_level: number; // 0-100
    community_involvement: 'none' | 'low' | 'medium' | 'high' | 'leader';
    
    media_consumption: string[];
    social_influence_sources: string[];
    economic_pressures: string[];
    
    regional_pride: number; // 0-100
    traditional_vs_modern_orientation: number; // 0=traditional, 100=modern
    
    shopping_culture: {
      market_vs_supermarket: number; // 0=mercado, 100=supermercado
      family_shopping_dynamic: string;
      negotiation_tendency: number; // 0-100
      bulk_buying_culture: boolean;
    };
  };

  // Comportamiento económico
  economic_behavior: {
    monthly_fmcg_budget_usd: [number, number]; // rango
    fmcg_budget_percentage: number; // % del ingreso
    price_comparison_behavior: 'never' | 'sometimes' | 'often' | 'always';
    promotion_responsiveness: number; // 0-100
    brand_vs_price_priority: 'brand_first' | 'balanced' | 'price_first';
    shopping_frequency: 'semanal' | 'quincenal' | 'mensual';
    
    unilever_brand_spending: {
      dove_monthly_spend: number;
      fruco_monthly_spend: number;
      omo_monthly_spend: number;
      total_unilever_spend: number;
      unilever_loyalty_score: number; // 0-100
    };
  };
}

// Perfil completo de Persona Colombiana
export interface ColombianSyntheticPersona {
  id: string;
  archetype: ColombianArchetype;
  variant_id: string;
  
  // Información básica
  name: string;
  photo_url?: string;
  location: {
    city: string;
    department: string;
    region: string;
    neighborhood?: string;
  };
  
  // Características específicas colombianas
  characteristics: ColombianPersonaCharacteristics;
  
  // Narrativa personal
  background: {
    life_story: string;
    daily_routine: string;
    pain_points: string[];
    aspirations: string[];
    social_circle: string;
    media_consumption: string[];
    
    unilever_brand_relationships: {
      dove_relationship: string;
      fruco_relationship: string;
      omo_relationship: string;
      suave_relationship?: string;
      rexona_relationship?: string;
      cif_relationship?: string;
    };
  };
  
  // Estado temporal
  temporal_state: {
    current_mood: 'happy' | 'neutral' | 'frustrated' | 'anxious' | 'excited';
    recent_events: string[];
    seasonal_context: string;
    economic_situation: string;
    family_circumstances: string;
  };
  
  // Estilo de conversación
  conversation_style: {
    formality_level: 'very_formal' | 'formal' | 'neutral' | 'informal' | 'very_informal';
    verbosity: 'concise' | 'normal' | 'verbose';
    regional_dialect_markers: string[]; // Colombianismos específicos
    emotional_expression: 'reserved' | 'moderate' | 'expressive';
    
    brand_discussion_style: {
      product_terminology: Record<string, string>; // cómo se refiere a cada producto
      decision_explanation_style: string;
      recommendation_language: string[];
    };
  };
  
  // Validación cultural
  cultural_validation: {
    authenticity_score: number;
    regional_accuracy: number;
    stereotype_avoidance_score: number;
    cultural_sensitivity_check: boolean;
    last_validated: Date;
    validation_notes: string[];
  };
  
  // Metadata
  metadata: {
    created_at: Date;
    updated_at: Date;
    created_by: string;
    version: number;
    research_project?: string;
    tags: string[];
    unilever_focus_categories: string[]; // categorías principales de interés
  };
}

// Configuración para generación de personas colombianas
export interface ColombianPersonaGenerationConfig {
  archetype: ColombianArchetype;
  count: number;
  
  regional_distribution: {
    costa_atlantica: number;
    region_andina: number;
    antioquia: number;
    valle_del_cauca: number;
    llanos_orientales: number;
    other: number;
  };
  
  diversity_requirements: {
    age_distribution: Record<string, number>;
    nse_distribution: Record<string, number>;
    occupation_distribution: Record<string, number>;
  };
  
  unilever_category_focus: {
    foods: boolean;
    personal_care: boolean;
    home_care: boolean;
  };
  
  cultural_authenticity_level: 'high' | 'medium' | 'basic';
  include_regional_variations: boolean;
  
  temporal_context: {
    current_economic_climate: string;
    seasonal_context: string;
    cultural_events: string[];
  };
}

// Plantillas base para arquetipos colombianos
export const COLOMBIAN_ARCHETYPE_TEMPLATES: Record<ColombianArchetype, Partial<ColombianPersonaCharacteristics>> = {
  [ColombianArchetype.COSTENA_EMPRENDEDORA]: {
    demographics: {
      age: 32,
      gender: 'female',
      income_bracket: 'B/C+',
      employment_status: 'entrepreneur',
      region: 'costa_atlantica',
      location_type: 'urban',
    } as any,
    food_consumption: {
      cooking_frequency: 'diario',
      meal_preparation: 'semi_preparado',
      fruco_usage_frequency: 'semanal',
      price_sensitivity: 'alta',
    } as any,
    personal_care: {
      dove_usage_frequency: 'diario',
      beauty_routine: 'basica',
      climate_considerations: ['calor', 'humedad'],
    } as any,
  },
  
  [ColombianArchetype.BOGOTANA_PROFESIONAL]: {
    demographics: {
      age: 32,
      gender: 'female', 
      income_bracket: 'A/B+',
      employment_status: 'employed',
      region: 'region_andina',
      location_type: 'urban',
    } as any,
    food_consumption: {
      cooking_frequency: 'frecuente',
      meal_preparation: 'convenience',
      health_consciousness: 'muy_alta',
      price_sensitivity: 'baja',
    } as any,
    personal_care: {
      beauty_routine: 'completa',
      premium_willingness: 'muy_alta',
      innovation_openness: 'muy_alta',
    } as any,
  },
  
  [ColombianArchetype.PAISA_TRADICIONAL]: {
    demographics: {
      age: 42,
      gender: 'female',
      income_bracket: 'B/C+', 
      employment_status: 'homemaker',
      region: 'antioquia',
      marital_status: 'married',
    } as any,
    food_consumption: {
      cooking_frequency: 'diario',
      meal_preparation: 'desde_cero',
      price_sensitivity: 'alta',
    } as any,
    personal_care: {
      brand_loyalty: 'muy_alta',
      beauty_routine: 'basica',
    } as any,
  },
  
  [ColombianArchetype.CALENA_MODERNA]: {
    demographics: {
      age: 27,
      gender: 'female',
      income_bracket: 'B/C+',
      region: 'valle_del_cauca',
      marital_status: 'single',
    } as any,
    food_consumption: {
      health_consciousness: 'muy_alta',
      meal_preparation: 'semi_preparado',
    } as any,
    personal_care: {
      beauty_routine: 'completa',
      innovation_openness: 'muy_alta',
    } as any,
  },
  
  [ColombianArchetype.LLANERA_EMPRENDEDORA]: {
    demographics: {
      age: 37,
      gender: 'female',
      income_bracket: 'C+',
      employment_status: 'self-employed',
      region: 'llanos_orientales',
      location_type: 'rural',
    } as any,
    food_consumption: {
      cooking_frequency: 'diario',
      meal_preparation: 'desde_cero',
      price_sensitivity: 'muy_alta',
    } as any,
    personal_care: {
      beauty_routine: 'minima',
      brand_loyalty: 'muy_alta',
    } as any,
  },
};