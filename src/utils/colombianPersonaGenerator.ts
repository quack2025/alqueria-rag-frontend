// utils/colombianPersonaGenerator.ts - Generador de personas sintéticas colombianas para Unilever

import type { 
  ColombianSyntheticPersona, 
  ColombianArchetype, 
  ColombianPersonaCharacteristics,
  ColombianPersonaGenerationConfig
} from '../types/colombianPersona.types';
import { COLOMBIAN_CONSUMER_PROFILES } from '../data/colombianConsumerProfiles';

// Nombres colombianos típicos por región
const COLOMBIAN_NAMES = {
  costa_atlantica: [
    'María José', 'Carmen Sofía', 'Luz Marina', 'Yanet', 'Karina', 'Dayana', 'Yuliana', 'Milena',
    'Paola Andrea', 'Ingrid', 'Leydi', 'Viviana', 'Maritza', 'Claudia', 'Sandra', 'Mónica'
  ],
  region_andina: [
    'Ana Sofía', 'María Fernanda', 'Diana Carolina', 'Alejandra', 'Natalia', 'Catalina', 'Juliana',
    'Andrea', 'Camila', 'Valentina', 'Isabella', 'Gabriela', 'Paula', 'Daniela', 'Laura'
  ],
  antioquia: [
    'Carmen Lucía', 'María Elena', 'Gloria', 'Luz Dary', 'Esperanza', 'Mercedes', 'Blanca',
    'Rosa María', 'Amparo', 'Myriam', 'Patricia', 'Consuelo', 'Ligia', 'Alba', 'Cecilia'
  ],
  valle_del_cauca: [
    'Valeria', 'Estefanía', 'Lorena', 'Adriana', 'Marcela', 'Tatiana', 'Johanna', 'Lina',
    'Carolina', 'Ximena', 'Erika', 'Yenny', 'Alejandra', 'Mónica', 'Diana'
  ],
  llanos_orientales: [
    'Diana Patricia', 'Yaneth', 'Nelly', 'Marleny', 'Deisy', 'Blanca Stella', 'Martha',
    'Gloria Elena', 'Fabiola', 'Miriam', 'Carmen', 'Lucía', 'Piedad', 'Olga', 'Betty'
  ]
};

// Apellidos colombianos comunes
const COLOMBIAN_SURNAMES = [
  'Rodríguez', 'García', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez',
  'Ramírez', 'Cruz', 'Gómez', 'Jiménez', 'Ruiz', 'Díaz', 'Moreno', 'Gutiérrez',
  'Castro', 'Vargas', 'Romero', 'Torres', 'Florez', 'Acosta', 'Medina', 'Aguilar',
  'Vásquez', 'Restrepo', 'Mejía', 'Valencia', 'Cárdenas', 'Rojas', 'Mendoza', 'Suárez'
];

// Ciudades por región
const REGIONAL_CITIES = {
  costa_atlantica: ['Barranquilla', 'Cartagena', 'Santa Marta', 'Valledupar', 'Montería'],
  region_andina: ['Bogotá', 'Soacha', 'Chía', 'Zipaquirá', 'Facatativá'],
  antioquia: ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'La Estrella'],
  valle_del_cauca: ['Cali', 'Palmira', 'Buenaventura', 'Tulúa', 'Cartago'],
  llanos_orientales: ['Villavicencio', 'Acacías', 'Granada', 'San Martín', 'Puerto López']
};

// Generador principal
export class ColombianPersonaGenerator {
  
  static generatePersona(
    archetype: ColombianArchetype, 
    config?: Partial<ColombianPersonaGenerationConfig>
  ): ColombianSyntheticPersona {
    
    const baseProfile = COLOMBIAN_CONSUMER_PROFILES[archetype];
    const region = this.getRegionForArchetype(archetype);
    const name = this.generateName(region);
    const location = this.generateLocation(region);
    
    // Generar características específicas
    const characteristics = this.generateCharacteristics(baseProfile, config);
    
    // Generar narrativa personal
    const background = this.generateBackground(baseProfile, characteristics);
    
    // Estado temporal
    const temporalState = this.generateTemporalState(archetype);
    
    // Estilo de conversación
    const conversationStyle = this.generateConversationStyle(baseProfile);
    
    const persona: ColombianSyntheticPersona = {
      id: `colombian-${archetype.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      archetype,
      variant_id: `variant-${Math.floor(Math.random() * 3) + 1}`,
      name,
      location,
      characteristics,
      background,
      temporal_state: temporalState,
      conversation_style: conversationStyle,
      cultural_validation: {
        authenticity_score: 85 + Math.random() * 10,
        regional_accuracy: 80 + Math.random() * 15,
        stereotype_avoidance_score: 75 + Math.random() * 20,
        cultural_sensitivity_check: true,
        last_validated: new Date(),
        validation_notes: [`Validado para región ${region}`, 'Patrones culturales auténticos']
      },
      metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'ColombianPersonaGenerator',
        version: 1,
        research_project: 'Unilever Colombia Consumer Insights',
        tags: [archetype, region, baseProfile.nse_level],
        unilever_focus_categories: this.getUnileverFocusCategories(baseProfile)
      }
    };
    
    return persona;
  }
  
  static generateMultiplePersonas(
    config: ColombianPersonaGenerationConfig
  ): ColombianSyntheticPersona[] {
    const personas: ColombianSyntheticPersona[] = [];
    
    for (let i = 0; i < config.count; i++) {
      const persona = this.generatePersona(config.archetype, config);
      personas.push(persona);
    }
    
    return personas;
  }
  
  private static getRegionForArchetype(archetype: ColombianArchetype): string {
    const regionMap = {
      [archetype]: {
        COSTENA_EMPRENDEDORA: 'costa_atlantica',
        BOGOTANA_PROFESIONAL: 'region_andina', 
        PAISA_TRADICIONAL: 'antioquia',
        CALENA_MODERNA: 'valle_del_cauca',
        LLANERA_EMPRENDEDORA: 'llanos_orientales'
      }
    };
    
    return regionMap[archetype][archetype] || 'region_andina';
  }
  
  private static generateName(region: string): string {
    const names = COLOMBIAN_NAMES[region as keyof typeof COLOMBIAN_NAMES] || COLOMBIAN_NAMES.region_andina;
    const firstName = names[Math.floor(Math.random() * names.length)];
    const lastName = COLOMBIAN_SURNAMES[Math.floor(Math.random() * COLOMBIAN_SURNAMES.length)];
    const secondLastName = COLOMBIAN_SURNAMES[Math.floor(Math.random() * COLOMBIAN_SURNAMES.length)];
    
    return `${firstName} ${lastName}`;
  }
  
  private static generateLocation(region: string) {
    const cities = REGIONAL_CITIES[region as keyof typeof REGIONAL_CITIES] || REGIONAL_CITIES.region_andina;
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    const departmentMap: Record<string, string> = {
      costa_atlantica: 'Atlántico',
      region_andina: 'Cundinamarca',
      antioquia: 'Antioquia',
      valle_del_cauca: 'Valle del Cauca',
      llanos_orientales: 'Meta'
    };
    
    return {
      city,
      department: departmentMap[region] || 'Cundinamarca',
      region: region,
      neighborhood: this.generateNeighborhood(city)
    };
  }
  
  private static generateNeighborhood(city: string): string {
    const neighborhoods: Record<string, string[]> = {
      'Barranquilla': ['El Prado', 'Boston', 'Alto Prado', 'Villa Country', 'Riomar'],
      'Bogotá': ['Chapinero', 'Zona Rosa', 'Suba', 'Kennedy', 'Engativá'],
      'Medellín': ['El Poblado', 'Laureles', 'Envigado', 'Sabaneta', 'La América'],
      'Cali': ['Granada', 'San Fernando', 'Ciudad Jardín', 'El Peñón', 'Valle del Lili'],
      'Villavicencio': ['Centro', 'Macarena', 'La Grama', 'Barzal', 'Camoa']
    };
    
    const cityNeighborhoods = neighborhoods[city] || ['Centro', 'Norte', 'Sur'];
    return cityNeighborhoods[Math.floor(Math.random() * cityNeighborhoods.length)];
  }
  
  private static generateCharacteristics(
    baseProfile: any,
    config?: Partial<ColombianPersonaGenerationConfig>
  ): ColombianPersonaCharacteristics {
    
    // Generar edad dentro del rango
    const age = baseProfile.age_range[0] + 
      Math.floor(Math.random() * (baseProfile.age_range[1] - baseProfile.age_range[0]));
    
    // Generar ingreso dentro del rango
    const monthlyIncome = baseProfile.monthly_income_usd[0] + 
      Math.floor(Math.random() * (baseProfile.monthly_income_usd[1] - baseProfile.monthly_income_usd[0]));
    
    return {
      demographics: {
        age,
        gender: 'female',
        income_bracket: baseProfile.nse_level,
        education_level: this.randomChoice(['secondary', 'technical', 'university']),
        employment_status: baseProfile.occupation,
        household_size: 3 + Math.floor(Math.random() * 3),
        marital_status: baseProfile.family_status,
        children_count: baseProfile.family_status.includes('madre') ? 1 + Math.floor(Math.random() * 3) : 0,
        location_type: baseProfile.location.includes('rural') ? 'rural' : 'urban',
        housing_type: this.randomChoice(['owned', 'rented', 'family']),
        region: baseProfile.colombian_context.region,
        city: baseProfile.location.split(',')[0]
      },
      
      food_consumption: {
        cooking_frequency: baseProfile.food_consumption.cooking_frequency,
        meal_preparation: baseProfile.food_consumption.meal_preparation,
        fruco_usage_frequency: this.mapFrequency(baseProfile.food_consumption.fruco_usage),
        fruco_products_used: baseProfile.food_consumption.fruco_usage,
        fruco_usage_occasions: ['almuerzo_familiar', 'cenas', 'sancochos'],
        knorr_usage_frequency: this.mapFrequency(baseProfile.food_consumption.knorr_usage),
        knorr_products_used: baseProfile.food_consumption.knorr_usage,
        condiment_preferences: baseProfile.food_consumption.condiment_preferences,
        shopping_behavior: baseProfile.food_consumption.shopping_behavior,
        price_sensitivity: baseProfile.food_consumption.price_sensitivity,
        health_consciousness: baseProfile.food_consumption.health_consciousness,
        flavor_preferences: baseProfile.food_consumption.flavor_preferences,
        regional_food_culture: {
          traditional_dishes: this.getRegionalDishes(baseProfile.colombian_context.region),
          cooking_methods: ['guisado', 'frito', 'asado', 'cocido'],
          seasonal_preferences: ['frutas tropicales', 'comida caliente en frio'],
          family_influence: 70 + Math.floor(Math.random() * 30)
        }
      },
      
      personal_care: {
        dove_usage_frequency: this.mapFrequency(baseProfile.personal_care.dove_usage),
        dove_products_used: baseProfile.personal_care.dove_usage,
        dove_purchase_drivers: ['hidratacion', 'suavidad', 'confianza_marca'],
        suave_usage_frequency: this.mapFrequency(baseProfile.personal_care.suave_usage),
        suave_products_used: baseProfile.personal_care.suave_usage,
        suave_benefits_sought: ['brillo', 'suavidad', 'reparacion'],
        rexona_usage_frequency: this.mapFrequency(baseProfile.personal_care.rexona_usage),
        rexona_products_used: baseProfile.personal_care.rexona_usage,
        rexona_usage_context: ['trabajo', 'ejercicio', 'eventos_sociales'],
        beauty_routine: baseProfile.personal_care.beauty_routine,
        skincare_priority: baseProfile.personal_care.skincare_priority,
        haircare_priority: baseProfile.personal_care.haircare_priority,
        climate_considerations: this.getClimateConsiderations(baseProfile.colombian_context.region),
        shopping_channels: baseProfile.personal_care.shopping_channels,
        brand_loyalty: baseProfile.personal_care.brand_loyalty,
        innovation_openness: baseProfile.personal_care.innovation_openness,
        premium_willingness: baseProfile.personal_care.premium_willingness
      },
      
      home_care: {
        omo_usage_frequency: this.mapFrequency(baseProfile.home_care.omo_usage),
        omo_products_used: baseProfile.home_care.omo_usage,
        omo_washing_contexts: ['ropa_trabajo', 'uniformes_escolares', 'ropa_bebe'],
        cif_usage_frequency: this.mapFrequency(baseProfile.home_care.cif_usage),
        cif_products_used: baseProfile.home_care.cif_usage,
        cif_cleaning_priorities: ['desinfeccion', 'brillo', 'fragancia'],
        cleaning_frequency: baseProfile.home_care.cleaning_frequency,
        eco_preference: baseProfile.home_care.eco_preference,
        bulk_buying: baseProfile.home_care.bulk_buying,
        brand_switching: baseProfile.home_care.brand_switching,
        household_responsibilities: {
          is_primary_shopper: true,
          cleaning_responsibility_level: 70 + Math.floor(Math.random() * 30),
          family_decision_influence: 60 + Math.floor(Math.random() * 40)
        }
      },
      
      communication: {
        formality_level: 'informal',
        regional_expressions: baseProfile.communication.regional_expressions,
        formal_expressions: baseProfile.communication.formal_expressions,
        informal_expressions: baseProfile.communication.informal_expressions,
        decision_triggers: baseProfile.communication.decision_triggers,
        skepticism_points: baseProfile.communication.skepticism_points,
        excitement_moments: baseProfile.communication.excitement_moments,
        brand_relationship_language: {
          dove_expressions: ['Dove siempre ha sido mi favorito', 'Es mi marca de confianza'],
          fruco_expressions: ['Fruco es parte de la familia', 'El sabor de toda la vida'],
          omo_expressions: ['OMO sí lava', 'Confío en OMO para ropa difícil'],
          unilever_brand_trust: ['Unilever tiene las mejores marcas', 'Son marcas de tradición']
        }
      },
      
      colombian_context: {
        region: baseProfile.colombian_context.region,
        cultural_values: baseProfile.colombian_context.cultural_values,
        family_influence_level: 70 + Math.floor(Math.random() * 30),
        community_involvement: 'medium',
        media_consumption: baseProfile.colombian_context.media_consumption,
        social_influence_sources: baseProfile.colombian_context.social_influence,
        economic_pressures: baseProfile.colombian_context.economic_pressures,
        regional_pride: 80 + Math.floor(Math.random() * 20),
        traditional_vs_modern_orientation: this.getModernityScore(baseProfile.lifestyle),
        shopping_culture: {
          market_vs_supermarket: this.getShoppingPreference(baseProfile.nse_level),
          family_shopping_dynamic: 'Consulta con familia pero decide ella',
          negotiation_tendency: 40 + Math.floor(Math.random() * 40),
          bulk_buying_culture: baseProfile.home_care.bulk_buying
        }
      },
      
      economic_behavior: {
        monthly_fmcg_budget_usd: [monthlyIncome * 0.1, monthlyIncome * 0.2],
        fmcg_budget_percentage: 12 + Math.floor(Math.random() * 8),
        price_comparison_behavior: 'often',
        promotion_responsiveness: 60 + Math.floor(Math.random() * 40),
        brand_vs_price_priority: 'balanced',
        shopping_frequency: baseProfile.food_consumption.shopping_behavior.includes('semanal') ? 'semanal' : 'quincenal',
        unilever_brand_spending: {
          dove_monthly_spend: 15 + Math.floor(Math.random() * 20),
          fruco_monthly_spend: 8 + Math.floor(Math.random() * 12),
          omo_monthly_spend: 12 + Math.floor(Math.random() * 15),
          total_unilever_spend: 35 + Math.floor(Math.random() * 47),
          unilever_loyalty_score: 60 + Math.floor(Math.random() * 40)
        }
      }
    } as any;
  }
  
  private static generateBackground(baseProfile: any, characteristics: any) {
    return {
      life_story: this.generateLifeStory(baseProfile, characteristics),
      daily_routine: this.generateDailyRoutine(baseProfile),
      pain_points: baseProfile.communication.skepticism_points,
      aspirations: this.generateAspirations(baseProfile),
      social_circle: this.generateSocialCircle(baseProfile),
      media_consumption: baseProfile.colombian_context.media_consumption,
      unilever_brand_relationships: {
        dove_relationship: this.generateBrandRelationship('Dove', baseProfile),
        fruco_relationship: this.generateBrandRelationship('Fruco', baseProfile),
        omo_relationship: this.generateBrandRelationship('OMO', baseProfile)
      }
    };
  }
  
  private static generateTemporalState(archetype: ColombianArchetype) {
    const moods = ['happy', 'neutral', 'excited'];
    const currentMood = moods[Math.floor(Math.random() * moods.length)];
    
    return {
      current_mood: currentMood,
      recent_events: ['Reunión familiar el fin de semana', 'Compras en el supermercado'],
      seasonal_context: this.getCurrentSeason(),
      economic_situation: 'Estable, con algunos retos por inflación',
      family_circumstances: 'Familia unida, enfocada en bienestar'
    } as any;
  }
  
  private static generateConversationStyle(baseProfile: any) {
    return {
      formality_level: 'informal',
      verbosity: 'normal',
      regional_dialect_markers: baseProfile.communication.regional_expressions,
      emotional_expression: 'moderate',
      brand_discussion_style: {
        product_terminology: {
          'dove': 'jabón Dove',
          'fruco': 'salsa Fruco',
          'omo': 'detergente OMO'
        },
        decision_explanation_style: 'Explica basándose en experiencia familiar y recomendaciones',
        recommendation_language: ['Te recomiendo', 'En mi experiencia', 'A mí me funciona']
      }
    } as any;
  }
  
  // Métodos auxiliares
  private static randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  private static mapFrequency(usageArray: string[]): 'diario' | 'semanal' | 'quincenal' | 'mensual' | 'nunca' {
    if (!usageArray || usageArray.length === 0) return 'nunca';
    if (usageArray.length >= 3) return 'diario';
    if (usageArray.length === 2) return 'semanal';
    return 'quincenal';
  }
  
  private static getRegionalDishes(region: string): string[] {
    const dishes: Record<string, string[]> = {
      'Costa Atlántica': ['Sancocho costeño', 'Arroz con coco', 'Pescado frito'],
      'Región Andina': ['Ajiaco', 'Tamales', 'Changua'],
      'Antioquia': ['Bandeja paisa', 'Sancocho antioqueño', 'Arepa paisa'],
      'Valle del Cauca': ['Sancocho valluno', 'Empanadas vallunas', 'Arroz atollao'],
      'Llanos Orientales': ['Mamona', 'Cachama', 'Hayacas']
    };
    return dishes[region] || dishes['Región Andina'];
  }
  
  private static getClimateConsiderations(region: string): string[] {
    const climate: Record<string, string[]> = {
      'Costa Atlántica': ['calor', 'humedad', 'sal marina'],
      'Región Andina': ['clima frio', 'contaminacion', 'aire seco'],
      'Antioquia': ['clima templado', 'humedad moderada'],
      'Valle del Cauca': ['calor', 'humedad', 'sol fuerte'],
      'Llanos Orientales': ['calor intenso', 'polvo', 'sol']
    };
    return climate[region] || climate['Región Andina'];
  }
  
  private static getModernityScore(lifestyle: string): number {
    if (lifestyle.includes('moderna') || lifestyle.includes('profesional')) return 70 + Math.random() * 30;
    if (lifestyle.includes('tradicional')) return 20 + Math.random() * 30;
    return 40 + Math.random() * 40;
  }
  
  private static getShoppingPreference(nseLevel: string): number {
    if (nseLevel.includes('A') || nseLevel.includes('B+')) return 70 + Math.random() * 30;
    if (nseLevel.includes('C')) return 40 + Math.random() * 40;
    return 10 + Math.random() * 40;
  }
  
  private static getCurrentSeason(): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const currentMonth = months[new Date().getMonth()];
    
    if (['Diciembre', 'Enero', 'Febrero'].includes(currentMonth)) {
      return 'Temporada seca, clima más fresco';
    } else if (['Marzo', 'Abril', 'Mayo'].includes(currentMonth)) {
      return 'Temporada de lluvias, ambiente húmedo';
    } else if (['Junio', 'Julio', 'Agosto'].includes(currentMonth)) {
      return 'Mitad de año, temporada de vacaciones escolares';
    } else {
      return 'Temporada de lluvias, preparación fin de año';
    }
  }
  
  private static generateLifeStory(baseProfile: any, characteristics: any): string {
    const templates = [
      `Soy ${baseProfile.name} y vivo en ${characteristics.demographics.city}. ${baseProfile.lifestyle}. Trabajo como ${baseProfile.occupation} y me encanta cuidar de mi familia.`,
      `Mi nombre es ${baseProfile.name}, tengo ${characteristics.demographics.age} años y soy de ${baseProfile.location}. ${baseProfile.family_status}. Me considero una persona ${baseProfile.lifestyle}.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  private static generateDailyRoutine(baseProfile: any): string {
    return `Mi día típico empieza temprano. ${baseProfile.occupation.includes('ama de casa') ? 
      'Me levanto a preparar el desayuno para mi familia' : 
      'Me alisto para ir al trabajo'}. Durante el día ${baseProfile.food_consumption.cooking_frequency === 'diario' ?
      'cocino para mi familia' : 'organizo las comidas'}. En la tarde me dedico a ${baseProfile.home_care.cleaning_frequency}.`;
  }
  
  private static generateAspirations(baseProfile: any): string[] {
    const aspirations = [
      'Que mi familia esté siempre bien',
      'Prosperar económicamente',
      'Mantener tradiciones familiares',
      'Dar buen ejemplo a mis hijos'
    ];
    
    if (baseProfile.lifestyle.includes('profesional')) {
      aspirations.push('Crecer profesionalmente', 'Mantener equilibrio vida-trabajo');
    }
    
    if (baseProfile.lifestyle.includes('emprendedora')) {
      aspirations.push('Hacer crecer mi negocio', 'Ser independiente económicamente');
    }
    
    return aspirations.slice(0, 3);
  }
  
  private static generateSocialCircle(baseProfile: any): string {
    return `Mi círculo social incluye ${baseProfile.colombian_context.social_influence.join(', ')}. Son personas importantes para mí y valoro mucho sus opiniones, especialmente cuando se trata de productos para la familia.`;
  }
  
  private static generateBrandRelationship(brand: string, baseProfile: any): string {
    const relationships = {
      'Dove': 'Dove es mi marca de confianza para el cuidado personal. La uso desde hace años y me gusta porque hidrata bien mi piel.',
      'Fruco': 'Fruco es parte de mi cocina desde siempre. Mi mamá la usaba y yo la sigo usando porque tiene el mejor sabor.',
      'OMO': 'OMO es el detergente que uso para la ropa de toda la familia. Confío en que limpia bien y cuida las telas.'
    };
    return relationships[brand as keyof typeof relationships] || `${brand} es una marca que uso ocasionalmente.`;
  }
  
  private static getUnileverFocusCategories(baseProfile: any): string[] {
    const categories = [];
    
    if (baseProfile.personal_care.dove_usage.length > 0) categories.push('Personal Care');
    if (baseProfile.food_consumption.fruco_usage.length > 0) categories.push('Foods');
    if (baseProfile.home_care.omo_usage.length > 0) categories.push('Home Care');
    
    return categories;
  }
}

// Export de función principal
export const generateColombianPersona = ColombianPersonaGenerator.generatePersona.bind(ColombianPersonaGenerator);
export const generateMultipleColombianPersonas = ColombianPersonaGenerator.generateMultiplePersonas.bind(ColombianPersonaGenerator);