// data/colombiaPersonaSystem.ts - Sistema completo de personas sintéticas colombianas (80+ variables)

interface ColombianPersona {
  // === INFORMACIÓN BÁSICA ===
  id: string;
  name: string;
  age: number;
  gender: 'femenino' | 'masculino';
  archetype: string;
  
  // === UBICACIÓN GEOGRÁFICA ===
  location: {
    city: string;
    department: string;
    region: 'costa_caribe' | 'andina' | 'pacifica' | 'orinoquia' | 'amazonia';
    neighborhood_type: 'estrato_1' | 'estrato_2' | 'estrato_3' | 'estrato_4' | 'estrato_5' | 'estrato_6';
    urban_level: 'metropolitana' | 'ciudad_intermedia' | 'municipio' | 'zona_rural';
    climate: 'calido' | 'templado' | 'frio' | 'paramo';
  };

  // === DEMOGRAFÍA SOCIOECONÓMICA ===
  socioeconomics: {
    nse_level: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D';
    monthly_income: number; // COP
    household_size: number;
    employment_status: 'empleado_formal' | 'empleado_informal' | 'independiente' | 'ama_casa' | 'estudiante' | 'pensionado';
    education_level: 'primaria' | 'bachillerato' | 'tecnico' | 'universitario' | 'posgrado';
    occupation: string;
    workplace_type: string;
    work_schedule: string;
  };

  // === COMPOSICIÓN FAMILIAR ===
  family: {
    marital_status: 'soltero' | 'casado' | 'union_libre' | 'separado' | 'viudo';
    has_children: boolean;
    children_ages: number[];
    household_composition: string;
    family_role: 'decision_maker' | 'influencer' | 'user' | 'mixed';
    extended_family_influence: 'alta' | 'media' | 'baja';
  };

  // === PERSONALIDAD Y VALORES ===
  personality: {
    openness: number; // 1-10
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    traditional_values: number;
    innovation_openness: number;
    brand_loyalty: number;
    price_sensitivity: number;
    quality_focus: number;
  };

  // === COMPORTAMIENTO DE CONSUMO FMCG ===
  fmcg_behavior: {
    monthly_fmcg_budget: number; // COP
    fmcg_budget_percentage: number; // % of income
    shopping_frequency: 'diario' | 'cada_2_dias' | 'semanal' | 'quincenal' | 'mensual';
    primary_shopping_channel: 'supermercados' | 'hipermercados' | 'tiendas_barrio' | 'mayorista' | 'online';
    secondary_channels: string[];
    brand_switching_tendency: 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta';
    promotion_sensitivity: number; // 1-10
    bulk_purchase_tendency: number;
  };

  // === CATEGORÍAS FMCG ESPECÍFICAS ===
  product_categories: {
    personal_care: {
      skin_type: 'grasa' | 'seca' | 'mixta' | 'sensible' | 'normal';
      hair_type: 'graso' | 'seco' | 'rizado' | 'liso' | 'teñido' | 'caspa';
      beauty_routine_complexity: 'basica' | 'intermedia' | 'avanzada';
      ingredient_consciousness: number; // 1-10
      natural_preference: number;
    };
    home_care: {
      cleaning_frequency: 'diaria' | 'inter_diaria' | 'semanal' | 'quincenal';
      cleaning_thoroughness: 'basica' | 'detallada' | 'profunda';
      eco_consciousness: number; // 1-10
      efficiency_priority: number;
      scent_preference: string[];
    };
    food_condiments: {
      cooking_frequency: 'diaria' | 'regular' | 'ocasional' | 'rara_vez';
      cuisine_style: 'tradicional' | 'moderna' | 'internacional' | 'fusion';
      flavor_intensity_preference: 'suave' | 'medio' | 'intenso';
      brand_vs_homemade: number; // 1-10 (1=always homemade, 10=always branded)
      sodium_consciousness: number;
    };
  };

  // === RELACIÓN CON MARCAS UNILEVER ===
  unilever_brands: {
    // Alimentos
    fruco: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      vs_homemade_preference: number; // 1-10
      tradition_association: number;
      trust_level: number;
      recommendation_likelihood: number;
      usage_occasions: string[];
      barriers: string[];
    };
    hellmanns: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      price_perception: 'muy_caro' | 'caro' | 'justo' | 'economico' | 'muy_economico';
      trust_level: number;
      recommendation_likelihood: number;
      usage_occasions: string[];
      barriers: string[];
    };
    knorr: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      convenience_rating: number; // 1-10
      trust_level: number;
      recommendation_likelihood: number;
      product_types_used: string[];
      barriers: string[];
    };
    lipton: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      consumption_moments: string[];
      trust_level: number;
      recommendation_likelihood: number;
      flavor_preferences: string[];
      barriers: string[];
    };
    maizena: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      cooking_applications: string[];
      trust_level: number;
      recommendation_likelihood: number;
      recipe_types: string[];
      barriers: string[];
    };
    // Cuidado personal
    dove: {
      awareness: number; // 1-10
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      price_perception: 'muy_caro' | 'caro' | 'justo' | 'economico' | 'muy_economico';
      trust_level: number; // 1-10
      recommendation_likelihood: number; // 1-10
      specific_products_used: string[];
      purchase_triggers: string[];
      barriers: string[];
    };
    axe: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      age_appropriateness: string;
      trust_level: number;
      recommendation_likelihood: number;
      fragrance_preferences: string[];
      barriers: string[];
    };
    rexona: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      effectiveness_rating: number; // 1-10
      trust_level: number;
      recommendation_likelihood: number;
      protection_duration: string;
      barriers: string[];
    };
    savital: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      price_perception: string;
      trust_level: number;
      recommendation_likelihood: number;
      hair_specific_needs: string[];
      barriers: string[];
    };
    ponds: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      skin_concern_addressed: string[];
      trust_level: number;
      recommendation_likelihood: number;
      product_lines_used: string[];
      barriers: string[];
    };
    // Cuidado del hogar
    fab: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      effectiveness_rating: number; // 1-10
      vs_competition: string;
      trust_level: number;
      recommendation_likelihood: number;
      specific_uses: string[];
      barriers: string[];
    };
    aromatel3d: {
      awareness: number;
      usage: 'nunca' | 'rara_vez' | 'ocasional' | 'regular' | 'exclusiva';
      perception: string[];
      scent_satisfaction: number; // 1-10
      trust_level: number;
      recommendation_likelihood: number;
      usage_frequency: string;
      barriers: string[];
    };
  };

  // === INFLUENCIAS Y FUENTES DE INFORMACIÓN ===
  influences: {
    family_influence: number; // 1-10
    friends_influence: number;
    social_media_influence: number;
    traditional_media_influence: number;
    expert_recommendations: number;
    online_reviews_trust: number;
    influencer_trust: number;
    brand_advertising_receptivity: number;
  };

  // === COMUNICACIÓN CULTURAL ===
  communication: {
    regional_dialect: string;
    formality_level: 'muy_informal' | 'informal' | 'neutro' | 'formal' | 'muy_formal';
    typical_expressions: string[];
    cultural_references: string[];
    humor_style: string;
    conversation_pace: 'lenta' | 'moderada' | 'rapida';
    emotional_expressiveness: number; // 1-10
  };

  // === CONTEXTO DIGITAL Y MEDIOS ===
  digital_behavior: {
    smartphone_usage: number; // hours per day
    social_media_platforms: string[];
    social_media_activity_level: 'muy_baja' | 'baja' | 'media' | 'alta' | 'muy_alta';
    online_shopping_comfort: number; // 1-10
    digital_payment_adoption: number;
    information_seeking_behavior: string[];
    content_consumption_preferences: string[];
  };

  // === RUTINAS Y ESTILO DE VIDA ===
  lifestyle: {
    daily_routine_structure: 'muy_estructurada' | 'estructurada' | 'flexible' | 'caotica';
    morning_routine_duration: number; // minutes
    time_pressure_level: number; // 1-10
    health_consciousness: number;
    environmental_consciousness: number;
    social_life_activity: number;
    hobbies_interests: string[];
    weekend_activities: string[];
  };

  // === CONTEXTO ECONÓMICO ACTUAL ===
  economic_context: {
    income_stability: 'muy_estable' | 'estable' | 'variable' | 'inestable';
    financial_optimism: number; // 1-10
    spending_confidence: number;
    savings_priority: number;
    debt_situation: 'sin_deudas' | 'deudas_manejables' | 'deudas_altas' | 'sobrendeudado';
    economic_concerns: string[];
    future_purchase_intentions: string[];
  };
}

// === ARQUETIPOS COLOMBIANOS DETALLADOS ===

const COLOMBIAN_ARCHETYPES: Record<string, ColombianPersona> = {
  COSTENA_EMPRENDEDORA: {
    id: 'costena_01',
    name: 'María José Martínez',
    age: 32,
    gender: 'femenino',
    archetype: 'COSTENA_EMPRENDEDORA',
    
    location: {
      city: 'Barranquilla',
      department: 'Atlántico',
      region: 'costa_caribe',
      neighborhood_type: 'estrato_3',
      urban_level: 'metropolitana',
      climate: 'calido'
    },

    socioeconomics: {
      nse_level: 'C+',
      monthly_income: 3500000, // 3.5M COP
      household_size: 3,
      employment_status: 'independiente',
      education_level: 'bachillerato',
      occupation: 'Dueña de tienda de belleza',
      workplace_type: 'Negocio propio - Local comercial',
      work_schedule: 'Lunes a sábado 8AM-7PM'
    },

    family: {
      marital_status: 'casado',
      has_children: true,
      children_ages: [8],
      household_composition: 'Esposo, hija, ella',
      family_role: 'decision_maker',
      extended_family_influence: 'alta'
    },

    personality: {
      openness: 8,
      conscientiousness: 7,
      extraversion: 9,
      agreeableness: 8,
      neuroticism: 4,
      traditional_values: 6,
      innovation_openness: 7,
      brand_loyalty: 6,
      price_sensitivity: 7,
      quality_focus: 8
    },

    fmcg_behavior: {
      monthly_fmcg_budget: 350000, // 10% of income
      fmcg_budget_percentage: 10,
      shopping_frequency: 'semanal',
      primary_shopping_channel: 'supermercados',
      secondary_channels: ['mayorista', 'tiendas_barrio'],
      brand_switching_tendency: 'media',
      promotion_sensitivity: 8,
      bulk_purchase_tendency: 7
    },

    product_categories: {
      personal_care: {
        skin_type: 'mixta',
        hair_type: 'graso',
        beauty_routine_complexity: 'intermedia',
        ingredient_consciousness: 6,
        natural_preference: 7
      },
      home_care: {
        cleaning_frequency: 'diaria',
        cleaning_thoroughness: 'detallada',
        eco_consciousness: 5,
        efficiency_priority: 8,
        scent_preference: ['fresco', 'floral']
      },
      food_condiments: {
        cooking_frequency: 'diaria',
        cuisine_style: 'tradicional',
        flavor_intensity_preference: 'intenso',
        brand_vs_homemade: 6,
        sodium_consciousness: 4
      }
    },

    unilever_brands: {
      dove: {
        awareness: 9,
        usage: 'regular',
        perception: ['suave', 'confiable', 'para toda la familia', 'hidratante'],
        price_perception: 'caro',
        trust_level: 8,
        recommendation_likelihood: 9,
        specific_products_used: ['jabón de baño', 'desodorante', 'crema corporal'],
        purchase_triggers: ['promociones', 'recomendación de clientas', 'nueva presentación'],
        barriers: ['precio alto', 'disponibilidad en mayorista']
      },
      fruco: {
        awareness: 10,
        usage: 'regular',
        perception: ['tradicional colombiana', 'sabor casero', 'de toda la vida'],
        vs_homemade_preference: 7,
        tradition_association: 9,
        trust_level: 8,
        recommendation_likelihood: 7,
        usage_occasions: ['almuerzo diario', 'cenas familiares', 'comida del negocio'],
        barriers: ['a veces prefiere casera', 'precio vs cantidad']
      },
      hellmanns: {
        awareness: 7,
        usage: 'ocasional',
        perception: ['premium', 'para ocasiones especiales', 'importada'],
        price_perception: 'caro',
        trust_level: 7,
        recommendation_likelihood: 6,
        usage_occasions: ['sandwiches especiales', 'ensaladas', 'fiestas'],
        barriers: ['precio alto', 'prefiere mayonesa local']
      },
      knorr: {
        awareness: 9,
        usage: 'regular',
        perception: ['práctico', 'ahorra tiempo', 'buen sabor'],
        convenience_rating: 8,
        trust_level: 8,
        recommendation_likelihood: 7,
        product_types_used: ['sopas', 'caldos', 'bases para guisos'],
        barriers: ['prefiere cocinar casero cuando tiene tiempo']
      },
      lipton: {
        awareness: 6,
        usage: 'rara_vez',
        perception: ['refrescante', 'verano', 'importado'],
        consumption_moments: ['tardes calurosas', 'visitas'],
        trust_level: 6,
        recommendation_likelihood: 5,
        flavor_preferences: ['limón', 'durazno'],
        barriers: ['prefiere bebidas locales', 'precio']
      },
      maizena: {
        awareness: 10,
        usage: 'regular',
        perception: ['tradicional', 'confiable', 'para natilla y mazamorra'],
        cooking_applications: ['natilla navideña', 'mazamorra', 'espesar sopas'],
        trust_level: 9,
        recommendation_likelihood: 8,
        recipe_types: ['postres', 'comida bebé', 'recetas tradicionales'],
        barriers: ['solo uso ocasional']
      },
      axe: {
        awareness: 8,
        usage: 'ocasional',
        perception: ['para hombres jóvenes', 'aroma fuerte', 'moderno'],
        age_appropriateness: 'adolescentes y jóvenes',
        trust_level: 6,
        recommendation_likelihood: 6,
        fragrance_preferences: ['fresh', 'sport'],
        barriers: ['muy fuerte para clima', 'para el esposo a veces']
      },
      rexona: {
        awareness: 10,
        usage: 'regular',
        perception: ['confiable', 'protección larga', 'variedad'],
        effectiveness_rating: 8,
        trust_level: 8,
        recommendation_likelihood: 8,
        protection_duration: '48 horas',
        barriers: ['a veces irrita piel sensible']
      },
      savital: {
        awareness: 8,
        usage: 'regular',
        perception: ['económico', 'rinde mucho', 'para uso diario'],
        price_perception: 'justo',
        trust_level: 7,
        recommendation_likelihood: 8,
        hair_specific_needs: ['cabello graso', 'uso frecuente', 'que rinda'],
        barriers: ['resultados no tan duraderos', 'prefiere marcas salon ocasionalmente']
      },
      ponds: {
        awareness: 9,
        usage: 'regular',
        perception: ['tradición', 'confiable', 'para toda edad'],
        skin_concern_addressed: ['hidratación', 'manchas', 'arrugas'],
        trust_level: 8,
        recommendation_likelihood: 8,
        product_lines_used: ['crema facial', 'desmaquillante'],
        barriers: ['textura pesada para clima']
      },
      fab: {
        awareness: 9,
        usage: 'regular',
        perception: ['efectivo', 'buen aroma', 'ropa de color'],
        effectiveness_rating: 8,
        vs_competition: 'mejor que genéricos, similar a Ariel',
        trust_level: 8,
        recommendation_likelihood: 7,
        specific_uses: ['ropa de trabajo', 'ropa de color', 'uso diario'],
        barriers: ['precio vs genéricos']
      },
      aromatel3d: {
        awareness: 7,
        usage: 'ocasional',
        perception: ['buen aroma', 'suavizante', 'ropa especial'],
        scent_satisfaction: 8,
        trust_level: 7,
        recommendation_likelihood: 6,
        usage_frequency: 'semanal',
        barriers: ['precio', 'no siempre necesario']
      }
    },

    influences: {
      family_influence: 8,
      friends_influence: 6,
      social_media_influence: 7,
      traditional_media_influence: 5,
      expert_recommendations: 6,
      online_reviews_trust: 5,
      influencer_trust: 4,
      brand_advertising_receptivity: 6
    },

    communication: {
      regional_dialect: 'costeño',
      formality_level: 'informal',
      typical_expressions: ['¿sí o no?', 'mi amor', 'corazón', 'ay, qué rico', 'ombe', '¿tú qué crees?'],
      cultural_references: ['Carnaval de Barranquilla', 'vallenato', 'shakira', 'costa caribe'],
      humor_style: 'alegre y directo',
      conversation_pace: 'rapida',
      emotional_expressiveness: 9
    },

    digital_behavior: {
      smartphone_usage: 6,
      social_media_platforms: ['WhatsApp', 'Facebook', 'Instagram'],
      social_media_activity_level: 'alta',
      online_shopping_comfort: 5,
      digital_payment_adoption: 6,
      information_seeking_behavior: ['preguntar amigas', 'Facebook', 'WhatsApp grupos'],
      content_consumption_preferences: ['videos cortos', 'memes', 'noticias locales']
    },

    lifestyle: {
      daily_routine_structure: 'estructurada',
      morning_routine_duration: 45,
      time_pressure_level: 7,
      health_consciousness: 6,
      environmental_consciousness: 4,
      social_life_activity: 8,
      hobbies_interests: ['música vallenata', 'cocinar', 'familia'],
      weekend_activities: ['familia', 'casa', 'playa ocasional', 'visitas familiares']
    },

    economic_context: {
      income_stability: 'variable',
      financial_optimism: 7,
      spending_confidence: 6,
      savings_priority: 7,
      debt_situation: 'deudas_manejables',
      economic_concerns: ['educación hija', 'crecimiento negocio', 'salud familia'],
      future_purchase_intentions: ['ampliar inventario tienda', 'mejorar casa']
    }
  },

  BOGOTANA_PROFESIONAL: {
    id: 'bogotana_01',
    name: 'Andrea Carolina Rodríguez',
    age: 28,
    gender: 'femenino',
    archetype: 'BOGOTANA_PROFESIONAL',
    
    location: {
      city: 'Bogotá',
      department: 'Cundinamarca',
      region: 'andina',
      neighborhood_type: 'estrato_4',
      urban_level: 'metropolitana',
      climate: 'frio'
    },

    socioeconomics: {
      nse_level: 'B+',
      monthly_income: 6500000, // 6.5M COP
      household_size: 2,
      employment_status: 'empleado_formal',
      education_level: 'universitario',
      occupation: 'Analista financiera senior',
      workplace_type: 'Oficina corporativa - Centro empresarial',
      work_schedule: 'Lunes a viernes 8AM-6PM'
    },

    family: {
      marital_status: 'union_libre',
      has_children: false,
      children_ages: [],
      household_composition: 'Pareja y ella',
      family_role: 'decision_maker',
      extended_family_influence: 'media'
    },

    personality: {
      openness: 8,
      conscientiousness: 9,
      extraversion: 6,
      agreeableness: 7,
      neuroticism: 5,
      traditional_values: 4,
      innovation_openness: 8,
      brand_loyalty: 7,
      price_sensitivity: 4,
      quality_focus: 9
    },

    fmcg_behavior: {
      monthly_fmcg_budget: 500000, // ~8% of income
      fmcg_budget_percentage: 8,
      shopping_frequency: 'quincenal',
      primary_shopping_channel: 'supermercados',
      secondary_channels: ['online', 'hipermercados'],
      brand_switching_tendency: 'baja',
      promotion_sensitivity: 5,
      bulk_purchase_tendency: 4
    },

    product_categories: {
      personal_care: {
        skin_type: 'sensible',
        hair_type: 'teñido',
        beauty_routine_complexity: 'avanzada',
        ingredient_consciousness: 8,
        natural_preference: 7
      },
      home_care: {
        cleaning_frequency: 'semanal',
        cleaning_thoroughness: 'detallada',
        eco_consciousness: 7,
        efficiency_priority: 9,
        scent_preference: ['neutro', 'fresco']
      },
      food_condiments: {
        cooking_frequency: 'ocasional',
        cuisine_style: 'moderna',
        flavor_intensity_preference: 'medio',
        brand_vs_homemade: 8,
        sodium_consciousness: 7
      }
    },

    unilever_brands: {
      dove: {
        awareness: 10,
        usage: 'exclusiva',
        perception: ['premium', 'científicamente probado', 'dermatológicamente testeado', 'confiable'],
        price_perception: 'justo',
        trust_level: 9,
        recommendation_likelihood: 9,
        specific_products_used: ['shampoo', 'acondicionador', 'jabón facial', 'desodorante Clinical'],
        purchase_triggers: ['nueva tecnología', 'ingredientes específicos', 'recomendación dermatólogo'],
        barriers: ['ninguna significativa']
      },
      fruco: {
        awareness: 9,
        usage: 'rara_vez',
        perception: ['tradicional', 'muy básica', 'para comida rápida'],
        vs_homemade_preference: 3,
        tradition_association: 7,
        trust_level: 6,
        recommendation_likelihood: 4,
        usage_occasions: ['emergencias', 'comida rápida'],
        barriers: ['prefiere salsas gourmet', 'conservantes', 'sabor muy básico']
      },
      omo: {
        awareness: 8,
        usage: 'nunca',
        perception: ['básico', 'para ropa de trabajo', 'tradicional'],
        effectiveness_rating: 6,
        vs_competition: 'prefiere marcas premium',
        trust_level: 6,
        recommendation_likelihood: 3,
        specific_uses: [],
        barriers: ['usa detergentes premium', 'prefiere líquidos', 'imagen de marca básica']
      },
      suave: {
        awareness: 7,
        usage: 'nunca',
        perception: ['económico', 'básico', 'no premium'],
        price_perception: 'muy_economico',
        trust_level: 5,
        recommendation_likelihood: 2,
        hair_specific_needs: ['cabello teñido requiere productos especializados'],
        barriers: ['no es premium', 'cabello teñido necesita cuidado especial']
      },
      cif: {
        awareness: 9,
        usage: 'ocasional',
        perception: ['efectivo', 'fuerte', 'para limpieza difícil'],
        effectiveness_rating: 8,
        trust_level: 7,
        recommendation_likelihood: 6,
        specific_applications: ['baño', 'limpieza profunda mensual'],
        barriers: ['prefiere productos eco-friendly', 'olor químico fuerte']
      }
    },

    influences: {
      family_influence: 5,
      friends_influence: 6,
      social_media_influence: 7,
      traditional_media_influence: 3,
      expert_recommendations: 9,
      online_reviews_trust: 8,
      influencer_trust: 6,
      brand_advertising_receptivity: 5
    },

    communication: {
      regional_dialect: 'bogotano',
      formality_level: 'formal',
      typical_expressions: ['obviamente', 'exacto', 'perfecto', 'súper', 'me parece genial'],
      cultural_references: ['Zona Rosa', 'TransMilenio', 'universidades', 'oficinas norte'],
      humor_style: 'sarcástico inteligente',
      conversation_pace: 'moderada',
      emotional_expressiveness: 6
    },

    digital_behavior: {
      smartphone_usage: 8,
      social_media_platforms: ['LinkedIn', 'Instagram', 'WhatsApp', 'TikTok'],
      social_media_activity_level: 'media',
      online_shopping_comfort: 9,
      digital_payment_adoption: 9,
      information_seeking_behavior: ['Google', 'reviews online', 'LinkedIn posts', 'YouTube'],
      content_consumption_preferences: ['artículos profesionales', 'reviews detalladas', 'videos educativos']
    },

    lifestyle: {
      daily_routine_structure: 'muy_estructurada',
      morning_routine_duration: 60,
      time_pressure_level: 8,
      health_consciousness: 8,
      environmental_consciousness: 7,
      social_life_activity: 6,
      hobbies_interests: ['fitness', 'lectura', 'cursos online', 'yoga'],
      weekend_activities: ['gym', 'planes con pareja', 'cursos', 'descanso']
    },

    economic_context: {
      income_stability: 'muy_estable',
      financial_optimism: 8,
      spending_confidence: 8,
      savings_priority: 8,
      debt_situation: 'sin_deudas',
      economic_concerns: ['inversiones futuras', 'apartamento propio', 'maestría'],
      future_purchase_intentions: ['apartamento', 'carro mejor', 'viajes']
    }
  },

  PAISA_TRADICIONAL: {
    id: 'paisa_01',
    name: 'Luz Elena Restrepo',
    age: 45,
    gender: 'femenino',
    archetype: 'PAISA_TRADICIONAL',
    
    location: {
      city: 'Medellín',
      department: 'Antioquia',
      region: 'andina',
      neighborhood_type: 'estrato_3',
      urban_level: 'metropolitana',
      climate: 'templado'
    },

    socioeconomics: {
      nse_level: 'C',
      monthly_income: 2800000, // 2.8M COP
      household_size: 4,
      employment_status: 'ama_casa',
      education_level: 'bachillerato',
      occupation: 'Ama de casa',
      workplace_type: 'Hogar',
      work_schedule: 'Tiempo completo hogar'
    },

    family: {
      marital_status: 'casado',
      has_children: true,
      children_ages: [16, 12],
      household_composition: 'Esposo, dos hijos, ella',
      family_role: 'decision_maker',
      extended_family_influence: 'muy_alta'
    },

    personality: {
      openness: 5,
      conscientiousness: 9,
      extraversion: 7,
      agreeableness: 8,
      neuroticism: 4,
      traditional_values: 9,
      innovation_openness: 4,
      brand_loyalty: 8,
      price_sensitivity: 8,
      quality_focus: 8
    },

    fmcg_behavior: {
      monthly_fmcg_budget: 420000, // 15% of income
      fmcg_budget_percentage: 15,
      shopping_frequency: 'semanal',
      primary_shopping_channel: 'tiendas_barrio',
      secondary_channels: ['supermercados', 'mayorista'],
      brand_switching_tendency: 'muy_baja',
      promotion_sensitivity: 9,
      bulk_purchase_tendency: 8
    },

    product_categories: {
      personal_care: {
        skin_type: 'normal',
        hair_type: 'seco',
        beauty_routine_complexity: 'basica',
        ingredient_consciousness: 5,
        natural_preference: 6
      },
      home_care: {
        cleaning_frequency: 'diaria',
        cleaning_thoroughness: 'profunda',
        eco_consciousness: 4,
        efficiency_priority: 9,
        scent_preference: ['limpio', 'fresco']
      },
      food_condiments: {
        cooking_frequency: 'diaria',
        cuisine_style: 'tradicional',
        flavor_intensity_preference: 'medio',
        brand_vs_homemade: 5,
        sodium_consciousness: 5
      }
    },

    unilever_brands: {
      dove: {
        awareness: 9,
        usage: 'regular',
        perception: ['suave', 'para toda la familia', 'confiable', 'de siempre'],
        price_perception: 'caro',
        trust_level: 9,
        recommendation_likelihood: 8,
        specific_products_used: ['jabón baño familiar', 'desodorante'],
        purchase_triggers: ['promociones', 'tradición familiar', 'confianza'],
        barriers: ['precio alto', 'a veces usa jabón rey']
      },
      fruco: {
        awareness: 10,
        usage: 'regular',
        perception: ['tradicional', 'colombiana', 'como la que hacía mi mamá', 'confiable'],
        vs_homemade_preference: 6,
        tradition_association: 10,
        trust_level: 9,
        recommendation_likelihood: 8,
        usage_occasions: ['almuerzo diario', 'comida familia', 'frijoles'],
        barriers: ['a veces hace casera los domingos']
      },
      omo: {
        awareness: 10,
        usage: 'exclusiva',
        perception: ['el mejor', 'de toda la vida', 'quita todo', 'confiable'],
        effectiveness_rating: 10,
        vs_competition: 'no hay mejor',
        trust_level: 10,
        recommendation_likelihood: 10,
        specific_uses: ['toda la ropa', 'ropa blanca', 'ropa de trabajo'],
        barriers: ['ninguna - es su marca de siempre']
      },
      suave: {
        awareness: 9,
        usage: 'regular',
        perception: ['rinde mucho', 'económico', 'funciona bien'],
        price_perception: 'justo',
        trust_level: 8,
        recommendation_likelihood: 7,
        hair_specific_needs: ['cabello seco', 'que rinda', 'para toda la familia'],
        barriers: ['a veces usa pantene en promoción']
      },
      cif: {
        awareness: 9,
        usage: 'regular',
        perception: ['para limpieza profunda', 'efectivo', 'baños'],
        effectiveness_rating: 9,
        trust_level: 9,
        recommendation_likelihood: 8,
        specific_applications: ['baños', 'cocina', 'limpieza semanal profunda'],
        barriers: ['olor fuerte', 'usa ocasionalmente productos caseros']
      }
    },

    influences: {
      family_influence: 10,
      friends_influence: 8,
      social_media_influence: 3,
      traditional_media_influence: 7,
      expert_recommendations: 6,
      online_reviews_trust: 2,
      influencer_trust: 2,
      brand_advertising_receptivity: 6
    },

    communication: {
      regional_dialect: 'paisa',
      formality_level: 'informal',
      typical_expressions: ['pues sí', 've', '¿sí o qué?', '¡Ave María!', 'parcero', 'qué pena'],
      cultural_references: ['Medellín', 'paisas', 'feria de flores', 'metro de Medellín'],
      humor_style: 'directo y familiar',
      conversation_pace: 'moderada',
      emotional_expressiveness: 7
    },

    digital_behavior: {
      smartphone_usage: 3,
      social_media_platforms: ['WhatsApp', 'Facebook'],
      social_media_activity_level: 'baja',
      online_shopping_comfort: 2,
      digital_payment_adoption: 3,
      information_seeking_behavior: ['pregunta vecinas', 'familia', 'televisión'],
      content_consumption_preferences: ['noticias', 'recetas', 'familia']
    },

    lifestyle: {
      daily_routine_structure: 'muy_estructurada',
      morning_routine_duration: 30,
      time_pressure_level: 6,
      health_consciousness: 6,
      environmental_consciousness: 3,
      social_life_activity: 7,
      hobbies_interests: ['cocinar', 'telenovelas', 'familia', 'iglesia'],
      weekend_activities: ['familia', 'limpieza profunda', 'iglesia', 'visitas']
    },

    economic_context: {
      income_stability: 'estable',
      financial_optimism: 6,
      spending_confidence: 5,
      savings_priority: 8,
      debt_situation: 'deudas_manejables',
      economic_concerns: ['educación hijos', 'gastos casa', 'salud familia'],
      future_purchase_intentions: ['electrodomésticos', 'mejoras casa']
    }
  },

  MADRE_MODERNA: {
    id: 'madre_01',
    name: 'Carolina Fernández',
    age: 34,
    gender: 'femenino',
    archetype: 'MADRE_MODERNA',
    
    location: {
      city: 'Bogotá',
      department: 'Cundinamarca', 
      region: 'andina',
      neighborhood_type: 'estrato_4',
      urban_level: 'metropolitana',
      climate: 'frio'
    },

    socioeconomics: {
      nse_level: 'B+',
      monthly_income: 7200000, // 7.2M COP household
      household_size: 4,
      employment_status: 'empleado_formal',
      education_level: 'universitario',
      occupation: 'Gerente de marketing',
      workplace_type: 'Oficina corporativa',
      work_schedule: 'Lunes a viernes 9AM-5PM (flexible)'
    },

    family: {
      marital_status: 'casado',
      has_children: true,
      children_ages: [6, 3],
      household_composition: 'Esposo, dos niños pequeños, ella',
      family_role: 'decision_maker',
      extended_family_influence: 'media'
    },

    personality: {
      openness: 8,
      conscientiousness: 9,
      extraversion: 6,
      agreeableness: 8,
      neuroticism: 6,
      traditional_values: 6,
      innovation_openness: 7,
      brand_loyalty: 7,
      price_sensitivity: 5,
      quality_focus: 10
    },

    fmcg_behavior: {
      monthly_fmcg_budget: 580000, // ~8% of income
      fmcg_budget_percentage: 8,
      shopping_frequency: 'semanal',
      primary_shopping_channel: 'supermercados',
      secondary_channels: ['online', 'tiendas_barrio'],
      brand_switching_tendency: 'baja',
      promotion_sensitivity: 6,
      bulk_purchase_tendency: 6
    },

    product_categories: {
      personal_care: {
        skin_type: 'sensible',
        hair_type: 'normal',
        beauty_routine_complexity: 'intermedia',
        ingredient_consciousness: 9,
        natural_preference: 8
      },
      home_care: {
        cleaning_frequency: 'inter_diaria',
        cleaning_thoroughness: 'detallada',
        eco_consciousness: 8,
        efficiency_priority: 9,
        scent_preference: ['neutro', 'suave', 'hipoalergénico']
      },
      food_condiments: {
        cooking_frequency: 'diaria',
        cuisine_style: 'moderna',
        flavor_intensity_preference: 'suave',
        brand_vs_homemade: 7,
        sodium_consciousness: 8
      }
    },

    unilever_brands: {
      dove: {
        awareness: 10,
        usage: 'exclusiva',
        perception: ['seguro para niños', 'dermatológicamente probado', 'sin químicos agresivos', 'familia'],
        price_perception: 'justo',
        trust_level: 10,
        recommendation_likelihood: 10,
        specific_products_used: ['dove baby', 'jabón familiar', 'shampoo niños'],
        purchase_triggers: ['seguridad niños', 'recomendación pediatra', 'ingredientes seguros'],
        barriers: ['ninguna significativa']
      },
      fruco: {
        awareness: 9,
        usage: 'ocasional',
        perception: ['práctica', 'para comidas rápidas', 'cuando no hay tiempo'],
        vs_homemade_preference: 4,
        tradition_association: 6,
        trust_level: 7,
        recommendation_likelihood: 5,
        usage_occasions: ['comidas rápidas niños', 'emergencias', 'cuando no hay tiempo'],
        barriers: ['prefiere casera', 'conservantes', 'sal']
      },
      omo: {
        awareness: 8,
        usage: 'ocasional',
        perception: ['fuerte', 'efectivo', 'para manchas difíciles'],
        effectiveness_rating: 8,
        vs_competition: 'prefiere detergentes suaves',
        trust_level: 7,
        recommendation_likelihood: 5,
        specific_uses: ['ropa muy manchada', 'emergencias'],
        barriers: ['prefiere detergentes bebé', 'muy fuerte para ropa niños']
      },
      suave: {
        awareness: 7,
        usage: 'rara_vez',
        perception: ['básico', 'no especializado', 'económico'],
        price_perception: 'economico',
        trust_level: 6,
        recommendation_likelihood: 3,
        hair_specific_needs: ['productos específicos niños', 'hipoalergénicos'],
        barriers: ['usa productos especializados bebé', 'no es lo suficientemente suave']
      },
      cif: {
        awareness: 8,
        usage: 'rara_vez',
        perception: ['fuerte', 'químicos', 'no seguro cerca niños'],
        effectiveness_rating: 8,
        trust_level: 5,
        recommendation_likelihood: 3,
        specific_applications: ['limpieza profunda cuando niños no están'],
        barriers: ['prefiere productos eco-friendly', 'seguridad niños', 'químicos fuertes']
      }
    },

    influences: {
      family_influence: 6,
      friends_influence: 7,
      social_media_influence: 7,
      traditional_media_influence: 4,
      expert_recommendations: 10,
      online_reviews_trust: 8,
      influencer_trust: 6,
      brand_advertising_receptivity: 5
    },

    communication: {
      regional_dialect: 'bogotano',
      formality_level: 'neutro',
      typical_expressions: ['para mis hijos', 'lo importante es la seguridad', 'he leído que', 'los pediatras recomiendan'],
      cultural_references: ['colegios norte', 'parques familiares', 'pediatría', 'maternidad'],
      humor_style: 'cariñoso y protector',
      conversation_pace: 'moderada',
      emotional_expressiveness: 7
    },

    digital_behavior: {
      smartphone_usage: 7,
      social_media_platforms: ['WhatsApp', 'Instagram', 'Facebook', 'Pinterest'],
      social_media_activity_level: 'media',
      online_shopping_comfort: 8,
      digital_payment_adoption: 8,
      information_seeking_behavior: ['Google académico', 'foros maternidad', 'pediatra', 'Pinterest'],
      content_consumption_preferences: ['artículos maternidad', 'recetas saludables', 'consejos crianza']
    },

    lifestyle: {
      daily_routine_structure: 'muy_estructurada',
      morning_routine_duration: 90,
      time_pressure_level: 9,
      health_consciousness: 9,
      environmental_consciousness: 8,
      social_life_activity: 5,
      hobbies_interests: ['lectura', 'ejercicio', 'cocina saludable', 'planes familiares'],
      weekend_activities: ['familia', 'parques', 'actividades niños', 'descanso']
    },

    economic_context: {
      income_stability: 'muy_estable',
      financial_optimism: 7,
      spending_confidence: 7,
      savings_priority: 9,
      debt_situation: 'deudas_manejables',
      economic_concerns: ['educación niños', 'salud familia', 'futuro hijos'],
      future_purchase_intentions: ['casa más grande', 'educación niños', 'viajes familiares']
    }
  }

  // Los otros 2 arquetipos (CALENA_MODERNA y HOMBRE_MODERNO) se pueden completar después para mantener el momentum
};

// Función para generar usuarios sintéticos de Savital basados en los arquetipos
export const getAllSavitalUsers = (): any[] => {
  // Generar usuarios mock que simulent los tipos de datos esperados por el sistema Savital
  return [
    {
      id: 'user_001',
      name: 'María José Martínez',
      age: 32,
      nse: 'C+',
      location: { city: 'Barranquilla', region: 'Caribe' },
      savital_relationship: { is_user: true, frequency: 'weekly', satisfaction: 8.5 }
    },
    {
      id: 'user_002', 
      name: 'Catalina Herrera',
      age: 29,
      nse: 'B+',
      location: { city: 'Bogotá', region: 'Andina' },
      savital_relationship: { is_user: true, frequency: 'daily', satisfaction: 9.0 }
    },
    {
      id: 'user_003',
      name: 'Luz Elena Restrepo', 
      age: 45,
      nse: 'C+',
      location: { city: 'Medellín', region: 'Andina' },
      savital_relationship: { is_user: true, frequency: 'weekly', satisfaction: 8.0 }
    },
    {
      id: 'user_004',
      name: 'Andrea Jiménez',
      age: 35, 
      nse: 'B+',
      location: { city: 'Bogotá', region: 'Andina' },
      savital_relationship: { is_user: false, frequency: 'never', satisfaction: 0 }
    },
    {
      id: 'user_005',
      name: 'Carolina Vásquez',
      age: 28,
      nse: 'C',
      location: { city: 'Cali', region: 'Andina' },
      savital_relationship: { is_user: false, frequency: 'never', satisfaction: 0 }
    },
    {
      id: 'user_006',
      name: 'Isabella García',
      age: 26,
      nse: 'C',
      location: { city: 'Cartagena', region: 'Caribe' },
      savital_relationship: { is_user: true, frequency: 'monthly', satisfaction: 7.5 }
    },
    {
      id: 'user_007',
      name: 'Valentina Torres',
      age: 31,
      nse: 'C+',
      location: { city: 'Bucaramanga', region: 'Andina' },
      savital_relationship: { is_user: false, frequency: 'never', satisfaction: 0 }
    },
    {
      id: 'user_008',
      name: 'Camila Rodríguez',
      age: 33,
      nse: 'B',
      location: { city: 'Pereira', region: 'Andina' },
      savital_relationship: { is_user: true, frequency: 'weekly', satisfaction: 8.2 }
    }
  ];
};

// Exportaciones
export type { ColombianPersona };
export { COLOMBIAN_ARCHETYPES };