// data/colombianConsumerProfiles.ts - Arquetipos de consumidoras colombianas para productos Unilever

export interface ConsumerProfile {
  id: string;
  name: string;
  age_range: [number, number];
  location: string;
  nse_level: string;
  monthly_income_usd: [number, number];
  occupation: string;
  lifestyle: string;
  family_status: string;
  
  // Variables específicas de alimentos
  food_consumption: {
    cooking_frequency: 'diario' | 'frecuente' | 'ocasional';
    meal_preparation: 'desde_cero' | 'semi_preparado' | 'convenience';
    fruco_usage: string[];
    knorr_usage: string[];
    condiment_preferences: string[];
    shopping_behavior: string;
    price_sensitivity: 'muy_alta' | 'alta' | 'media' | 'baja';
    health_consciousness: 'muy_alta' | 'alta' | 'media' | 'baja';
    flavor_preferences: string[];
  };
  
  // Variables específicas de cuidado personal
  personal_care: {
    dove_usage: string[];
    suave_usage: string[];
    rexona_usage: string[];
    beauty_routine: 'completa' | 'basica' | 'minima';
    skincare_priority: string[];
    haircare_priority: string[];
    shopping_channels: string[];
    brand_loyalty: 'muy_alta' | 'alta' | 'media' | 'baja';
    innovation_openness: 'muy_alta' | 'alta' | 'media' | 'baja';
    premium_willingness: 'muy_alta' | 'alta' | 'media' | 'baja';
  };
  
  // Variables de limpieza del hogar
  home_care: {
    omo_usage: string[];
    cif_usage: string[];
    cleaning_frequency: string;
    eco_preference: 'muy_alta' | 'alta' | 'media' | 'baja';
    bulk_buying: boolean;
    brand_switching: 'nunca' | 'ocasional' | 'frecuente';
  };
  
  // Patrones de lenguaje y comportamiento
  communication: {
    formal_expressions: string[];
    informal_expressions: string[];
    decision_triggers: string[];
    skepticism_points: string[];
    excitement_moments: string[];
    regional_expressions: string[];
  };
  
  // Context específico colombiano
  colombian_context: {
    region: string;
    cultural_values: string[];
    media_consumption: string[];
    social_influence: string[];
    economic_pressures: string[];
  };
}

export const COLOMBIAN_CONSUMER_PROFILES: Record<string, ConsumerProfile> = {
  
  // 1. La Costeña Emprendedora
  COSTENA_EMPRENDEDORA: {
    id: 'costena_emprendedora',
    name: 'María José - La Costeña Emprendedora',
    age_range: [28, 35],
    location: 'Barranquilla, Cartagena, Santa Marta',
    nse_level: 'B/C+',
    monthly_income_usd: [800, 1400],
    occupation: 'Emprendedora, vendedora, comerciante',
    lifestyle: 'Activa, sociable, trabajadora',
    family_status: 'Madre de 1-2 hijos, pareja estable',
    
    food_consumption: {
      cooking_frequency: 'diario',
      meal_preparation: 'semi_preparado',
      fruco_usage: ['Salsa de tomate para sancocho', 'Aderezos para ensaladas', 'Base para guisos'],
      knorr_usage: ['Caldos para sopas', 'Sazón para carnes', 'Sopas instantáneas'],
      condiment_preferences: ['Sabores tropicales', 'Picante moderado', 'Cítricos', 'Ajo y cebolla'],
      shopping_behavior: 'Compra quincenal en mercado y supermercado',
      price_sensitivity: 'alta',
      health_consciousness: 'media',
      flavor_preferences: ['Caribeño', 'Tropical', 'Fresco', 'Sabroso sin ser muy condimentado']
    },
    
    personal_care: {
      dove_usage: ['Body wash para el calor', 'Desodorante resistente', 'Jabón hidratante'],
      suave_usage: ['Shampoo para cabello graso', 'Acondicionador nutritivo', 'Mascarillas capilares'],
      rexona_usage: ['Desodorante 24h para trabajo', 'Antitranspirante para eventos'],
      beauty_routine: 'basica',
      skincare_priority: ['Protección solar', 'Hidratación', 'Control de grasa por calor'],
      haircare_priority: ['Control de grasa', 'Hidratación por sal marina', 'Brillo natural'],
      shopping_channels: ['Supermercados', 'Farmacias', 'Distribuidores locales'],
      brand_loyalty: 'alta',
      innovation_openness: 'media',
      premium_willingness: 'media'
    },
    
    home_care: {
      omo_usage: ['Detergente para ropa de trabajo', 'Quitamanchas para niños', 'Lavado de uniformes'],
      cif_usage: ['Limpieza de cocina', 'Baños', 'Pisos de cerámica'],
      cleaning_frequency: 'Limpieza diaria ligera, profunda fin de semana',
      eco_preference: 'media',
      bulk_buying: true,
      brand_switching: 'ocasional'
    },
    
    communication: {
      formal_expressions: [
        'Mi negocio depende de que esté siempre presentable',
        'Para mi familia busco lo mejor',
        'Como emprendedora necesito productos confiables',
        'En la costa el calor es bravo, necesito algo efectivo'
      ],
      informal_expressions: [
        '¡Eso está buenísimo!', '¡Qué rico!', '¡Divino!', '¡Me fascina!', '¡Está brutal!'
      ],
      decision_triggers: [
        'Que sea efectivo con el calor', 'Que rinda mucho', 'Recomendación de amigas',
        'Buenos resultados visibles', 'Precio justo por calidad'
      ],
      skepticism_points: [
        '¿Funcionará con este calor?', '¿No se dañará rápido?',
        '¿Será muy caro para lo que ofrece?', '¿Realmente es mejor que lo que uso?'
      ],
      excitement_moments: [
        '¡Por fin algo que funciona con este sol!', '¡Esto me va a facilitar la vida!',
        '¡Mis clientas van a notar la diferencia!', '¡Qué maravilla de producto!'
      ],
      regional_expressions: [
        '¡Qué chevere!', '¡Está paila!', '¡Eso está de lujo!', '¡Qué nota!', '¡Brutal!'
      ]
    },
    
    colombian_context: {
      region: 'Costa Atlántica',
      cultural_values: ['Familia', 'Trabajo duro', 'Alegría', 'Comunidad', 'Hospitalidad'],
      media_consumption: ['Radio local', 'Facebook', 'WhatsApp', 'TV regional', 'TikTok'],
      social_influence: ['Amigas del barrio', 'Familia extendida', 'Clientas', 'Redes vecinales'],
      economic_pressures: ['Clima afecta ventas', 'Competencia local', 'Costos de transporte', 'Temporadas bajas']
    }
  },

  // 2. La Bogotana Profesional
  BOGOTANA_PROFESIONAL: {
    id: 'bogotana_profesional',
    name: 'Ana Sofía - La Bogotana Profesional',
    age_range: [26, 38],
    location: 'Bogotá, Zona Norte y Centro',
    nse_level: 'A/B+',
    monthly_income_usd: [1500, 3000],
    occupation: 'Profesional corporativa, consultora, gerente',
    lifestyle: 'Urbana, ocupada, health-conscious',
    family_status: 'Soltera o pareja sin hijos, enfocada en carrera',
    
    food_consumption: {
      cooking_frequency: 'frecuente',
      meal_preparation: 'convenience',
      fruco_usage: ['Salsas gourmet para pastas', 'Aderezos para ensaladas premium', 'Condimentos rápidos'],
      knorr_usage: ['Caldos orgánicos', 'Sopas fitness', 'Condimentos para meal prep'],
      condiment_preferences: ['Sabores internacionales', 'Orgánico', 'Bajo en sodio', 'Gourmet'],
      shopping_behavior: 'Compra semanal en supermercados premium y online',
      price_sensitivity: 'baja',
      health_consciousness: 'muy_alta',
      flavor_preferences: ['Internacional', 'Mediterráneo', 'Asiático', 'Saludable', 'Sofisticado']
    },
    
    personal_care: {
      dove_usage: ['Línea premium', 'Productos anti-edad', 'Body lotions especializadas'],
      suave_usage: ['Shampoo profesional', 'Tratamientos capilares', 'Productos sin sulfatos'],
      rexona_usage: ['Desodorantes discretos', 'Fórmulas 48h', 'Fragancias elegantes'],
      beauty_routine: 'completa',
      skincare_priority: ['Anti-edad', 'Hidratación profunda', 'Protección urbana', 'Luminosidad'],
      haircare_priority: ['Reparación por contaminación', 'Brillo profesional', 'Control de caspa'],
      shopping_channels: ['Supermercados premium', 'E-commerce', 'Farmacias especializadas'],
      brand_loyalty: 'media',
      innovation_openness: 'muy_alta',
      premium_willingness: 'muy_alta'
    },
    
    home_care: {
      omo_usage: ['Detergentes especializados', 'Cuidado de ropa formal', 'Productos eco-friendly'],
      cif_usage: ['Limpiadores antibacteriales', 'Productos especializados por superficie'],
      cleaning_frequency: 'Limpieza profunda quincenal, servicio doméstico',
      eco_preference: 'muy_alta',
      bulk_buying: false,
      brand_switching: 'frecuente'
    },
    
    communication: {
      formal_expressions: [
        'Como profesional busco productos de calidad',
        'Mi rutina debe ser eficiente pero efectiva',
        'Invierto en mi cuidado personal como parte de mi carrera',
        'Necesito productos que se adapten a mi estilo de vida urbano'
      ],
      informal_expressions: [
        'Está increíble', 'Me encanta', 'Super efectivo', 'Genial', 'Perfecto para mi rutina'
      ],
      decision_triggers: [
        'Ingredientes premium', 'Respaldo científico', 'Reseñas online positivas',
        'Recomendación de influencers', 'Resultados rápidos'
      ],
      skepticism_points: [
        '¿Los ingredientes son realmente premium?', '¿Funcionará con mi piel sensible?',
        '¿Vale la pena el precio diferencial?', '¿Es cruelty-free?'
      ],
      excitement_moments: [
        '¡Esto va a revolucionar mi rutina!', '¡Exactamente lo que estaba buscando!',
        '¡Los resultados son increíbles!', '¡Por fin un producto que entiende mi estilo de vida!'
      ],
      regional_expressions: [
        'Está muy berraco', 'Qué chimba', 'Está genial', 'Super bacano', 'Está de película'
      ]
    },
    
    colombian_context: {
      region: 'Región Andina - Capital',
      cultural_values: ['Profesionalismo', 'Educación', 'Estatus', 'Sostenibilidad', 'Innovación'],
      media_consumption: ['LinkedIn', 'Instagram', 'Podcasts', 'Netflix', 'Medios digitales'],
      social_influence: ['Colegas profesionales', 'Influencers', 'Reseñas online', 'Redes profesionales'],
      economic_pressures: ['Alto costo de vida', 'Competencia laboral', 'Inversión en imagen', 'Ahorro para futuro']
    }
  },

  // 3. La Paisa Tradicional
  PAISA_TRADICIONAL: {
    id: 'paisa_tradicional',
    name: 'Carmen Lucía - La Paisa Tradicional',
    age_range: [35, 50],
    location: 'Medellín, Envigado, Itagüí, municipios cercanos',
    nse_level: 'B/C+',
    monthly_income_usd: [800, 1600],
    occupation: 'Ama de casa, trabajo medio tiempo, comerciante',
    lifestyle: 'Familiar, tradicional, trabajadora',
    family_status: 'Casada, 2-3 hijos, núcleo familiar fuerte',
    
    food_consumption: {
      cooking_frequency: 'diario',
      meal_preparation: 'desde_cero',
      fruco_usage: ['Salsa de tomate para frijoles', 'Base para sudados', 'Condimento para carnes'],
      knorr_usage: ['Caldos para sancocho paisa', 'Sazón para frijoles', 'Condimentos tradicionales'],
      condiment_preferences: ['Sabores tradicionales paisas', 'Hogareño', 'Sustancioso', 'Familiar'],
      shopping_behavior: 'Compra semanal en mercado tradicional y supermercado',
      price_sensitivity: 'alta',
      health_consciousness: 'media',
      flavor_preferences: ['Tradicional paisa', 'Hogareño', 'Familiar', 'Abundante', 'Sustancioso']
    },
    
    personal_care: {
      dove_usage: ['Jabón de baño familiar', 'Cremas hidratantes', 'Productos para toda la familia'],
      suave_usage: ['Shampoo familiar', 'Productos para niños', 'Acondicionador económico'],
      rexona_usage: ['Desodorante familiar', 'Productos duraderos', 'Formato familiar'],
      beauty_routine: 'basica',
      skincare_priority: ['Hidratación básica', 'Cuidado familiar', 'Productos multiuso'],
      haircare_priority: ['Cabello saludable', 'Productos para toda la familia', 'Brillo natural'],
      shopping_channels: ['Supermercados tradicionales', 'Distribuidores del barrio', 'Mercados'],
      brand_loyalty: 'muy_alta',
      innovation_openness: 'baja',
      premium_willingness: 'media'
    },
    
    home_care: {
      omo_usage: ['Detergente familiar', 'Lavado de ropa diario', 'Cuidado de uniformes escolares'],
      cif_usage: ['Limpieza profunda de cocina', 'Limpieza tradicional', 'Productos confiables'],
      cleaning_frequency: 'Limpieza diaria, casa siempre ordenada',
      eco_preference: 'baja',
      bulk_buying: true,
      brand_switching: 'nunca'
    },
    
    communication: {
      formal_expressions: [
        'Para mi familia siempre busco lo mejor',
        'Como ama de casa conozco lo que funciona',
        'En mi hogar usamos productos de confianza',
        'Para mis hijos no escatimo en calidad'
      ],
      informal_expressions: [
        '¡Está muy bueno!', '¡Qué rico!', '¡Divino!', '¡Excelente!', '¡Muy sabroso!'
      ],
      decision_triggers: [
        'Tradición familiar', 'Recomendación de la mamá/hermanas',
        'Buenos resultados comprobados', 'Precio familiar', 'Confianza de siempre'
      ],
      skepticism_points: [
        '¿Será mejor que lo que uso siempre?', '¿No será muy caro para el presupuesto?',
        '¿Funcionará igual de bien?', '¿Mis hijos lo van a aceptar?'
      ],
      excitement_moments: [
        '¡Esto me va a facilitar las labores!', '¡Qué bueno para la familia!',
        '¡Mis hijos van a quedar contentos!', '¡Por fin algo que funciona bien!'
      ],
      regional_expressions: [
        '¡Qué más pues!', '¡Está muy verraco!', '¡Súper bacano!', '¡Qué nota!', '¡De una!'
      ]
    },
    
    colombian_context: {
      region: 'Antioquia - Valle de Aburrá',
      cultural_values: ['Familia', 'Trabajo duro', 'Tradición', 'Hospitalidad', 'Valores católicos'],
      media_consumption: ['TV regional', 'Radio', 'Facebook', 'WhatsApp familiar', 'TV nacional'],
      social_influence: ['Familia extendida', 'Vecinas', 'Amigas del colegio de los hijos', 'Comunidad religiosa'],
      economic_pressures: ['Educación de los hijos', 'Gastos familiares', 'Ahorro para la casa', 'Salud familiar']
    }
  },

  // 4. La Caleña Moderna
  CALENA_MODERNA: {
    id: 'calena_moderna',
    name: 'Valeria - La Caleña Moderna',
    age_range: [22, 32],
    location: 'Cali, municipios del Valle',
    nse_level: 'B/C+',
    monthly_income_usd: [600, 1200],
    occupation: 'Profesional joven, estudiante de posgrado, influencer',
    lifestyle: 'Social, fitness-oriented, trendy',
    family_status: 'Soltera, en pareja, enfocada en desarrollo personal',
    
    food_consumption: {
      cooking_frequency: 'frecuente',
      meal_preparation: 'semi_preparado',
      fruco_usage: ['Salsas para comida fitness', 'Aderezos para ensaladas', 'Condimentos saludables'],
      knorr_usage: ['Caldos bajos en sodio', 'Sopas fit', 'Condimentos para meal prep'],
      condiment_preferences: ['Saludable', 'Sabores frescos', 'Bajo en calorías', 'Natural'],
      shopping_behavior: 'Compra consciente, supermercados y tiendas especializadas',
      price_sensitivity: 'media',
      health_consciousness: 'muy_alta',
      flavor_preferences: ['Fresco', 'Tropical', 'Saludable', 'Veggie-friendly', 'Ligero']
    },
    
    personal_care: {
      dove_usage: ['Productos para piel sensible', 'Body lotions', 'Líneas especializadas'],
      suave_usage: ['Shampoo sin sulfatos', 'Productos naturales', 'Cuidado del color'],
      rexona_usage: ['Desodorantes naturales', 'Sin manchas blancas', 'Fragancias frescas'],
      beauty_routine: 'completa',
      skincare_priority: ['Protección solar', 'Hidratación', 'Ingredientes naturales', 'Anti-acné'],
      haircare_priority: ['Cabello saludable', 'Brillo natural', 'Productos sin químicos'],
      shopping_channels: ['Supermercados', 'Tiendas naturales', 'E-commerce', 'Farmacias'],
      brand_loyalty: 'media',
      innovation_openness: 'muy_alta',
      premium_willingness: 'alta'
    },
    
    home_care: {
      omo_usage: ['Detergentes eco-friendly', 'Cuidado de ropa deportiva', 'Productos concentrados'],
      cif_usage: ['Limpiadores naturales', 'Antibacteriales suaves', 'Productos sostenibles'],
      cleaning_frequency: 'Limpieza regular, productos eco-friendly',
      eco_preference: 'muy_alta',
      bulk_buying: false,
      brand_switching: 'frecuente'
    },
    
    communication: {
      formal_expressions: [
        'Como persona consciente busco productos responsables',
        'Mi estilo de vida requiere productos que me acompañen',
        'Para mi cuidado personal prefiero ingredientes naturales',
        'En mi generación valoramos la sostenibilidad'
      ],
      informal_expressions: [
        '¡Está súper!', '¡Me encanta!', '¡Genial!', '¡Perfecto!', '¡Increíble!'
      ],
      decision_triggers: [
        'Ingredientes naturales', 'Sostenibilidad', 'Recomendación de influencers',
        'Tendencias wellness', 'Resultados comprobados'
      ],
      skepticism_points: [
        '¿Es realmente natural?', '¿Es cruelty-free?',
        '¿El packaging es sostenible?', '¿No tiene químicos dañinos?'
      ],
      excitement_moments: [
        '¡Esto es exactamente lo que buscaba!', '¡Por fin un producto consciente!',
        '¡Mis amigas van a amar esto!', '¡Definitivamente lo voy a recomendar!'
      ],
      regional_expressions: [
        '¡Qué chimba!', '¡Está brutal!', '¡Súper bacano!', '¡De lujo!', '¡Está de película!'
      ]
    },
    
    colombian_context: {
      region: 'Valle del Cauca',
      cultural_values: ['Bienestar', 'Belleza', 'Diversión', 'Sostenibilidad', 'Modernidad'],
      media_consumption: ['Instagram', 'TikTok', 'YouTube', 'Spotify', 'Apps wellness'],
      social_influence: ['Influencers', 'Amigas universitarias', 'Redes sociales', 'Comunidad fitness'],
      economic_pressures: ['Gastos en educación', 'Inversión en imagen', 'Vida social', 'Desarrollo profesional']
    }
  },

  // 5. La Ama de Casa Tradicional
  AMA_CASA_TRADICIONAL: {
    id: 'ama_casa_tradicional',
    name: 'Gloria Patricia - La Ama de Casa Tradicional',
    age_range: [35, 50],
    location: 'Soacha, Cundinamarca, Sabana de Bogotá',
    nse_level: 'C+/C',
    monthly_income_usd: [550, 950],
    occupation: 'Ama de casa, administradora del hogar',
    lifestyle: 'Tradicional, centrada en la familia, ahorrativa',
    family_status: 'Casada, madre de 3 hijos, núcleo familiar estable',
    
    food_consumption: {
      cooking_frequency: 'diario',
      meal_preparation: 'desde_cero',
      fruco_usage: ['Salsa de tomate para el almuerzo', 'Base para guisos familiares', 'Aderezos para comida casera'],
      knorr_usage: ['Caldos para sancocho', 'Sazón para pollo y carne', 'Sopas rápidas para los niños'],
      condiment_preferences: ['Sabores tradicionales', 'Familiar', 'Que rinda mucho', 'Económico'],
      shopping_behavior: 'Compra semanal en supermercado de barrio y tienda',
      price_sensitivity: 'muy_alta',
      health_consciousness: 'media',
      flavor_preferences: ['Tradicional colombiano', 'Casero', 'Familiar', 'Sustancioso', 'Nutritivo']
    },
    
    personal_care: {
      dove_usage: ['Jabón de baño familiar', 'Productos para la piel de los niños', 'Cremas hidratantes básicas'],
      suave_usage: ['Shampoo para toda la familia', 'Acondicionador económico', 'Productos para cabello graso'],
      rexona_usage: ['Desodorante duradero', 'Para el esposo', 'Formato familiar'],
      beauty_routine: 'basica',
      skincare_priority: ['Hidratación básica', 'Protección para los niños', 'Productos que rindan'],
      haircare_priority: ['Limpieza efectiva', 'Desenredado fácil', 'Para toda la familia'],
      shopping_channels: ['Supermercados de barrio', 'Farmacias locales', 'Tiendas de descuento'],
      brand_loyalty: 'muy_alta',
      innovation_openness: 'media',
      premium_willingness: 'baja'
    },
    
    home_care: {
      omo_usage: ['Detergente para ropa familiar', 'Para manchas de los niños', 'Lavado diario eficiente'],
      cif_usage: ['Limpieza profunda de cocina', 'Baños', 'Desinfección del hogar'],
      cleaning_frequency: 'Limpieza diaria, profunda los fines de semana',
      eco_preference: 'media',
      bulk_buying: true,
      brand_switching: 'ocasional'
    },
    
    communication: {
      formal_expressions: [
        'Como ama de casa uno sabe lo que funciona',
        'Para mi familia siempre busco lo mejor',
        'En mi hogar necesito productos de confianza',
        'Con el presupuesto de casa hay que ser cuidadosa'
      ],
      informal_expressions: [
        '¡Está muy bueno!', '¡Qué maravilla!', '¡Perfecto!', '¡Eso está divino!', '¡Me fascina!'
      ],
      decision_triggers: [
        'Que rinda mucho', 'Precio justo', 'Recomendación de amigas',
        'Buenos resultados para la familia', 'Que esté en promoción'
      ],
      skepticism_points: [
        '¿Será muy caro para lo que rinde?', '¿Funcionará igual que lo que uso?',
        '¿No será mucha plata?', '¿Realmente vale la pena cambiar?'
      ],
      excitement_moments: [
        '¡Esto me va a facilitar las labores!', '¡Por fin algo que funciona bien!',
        '¡Para mis hijos está perfecto!', '¡Qué bueno para la casa!'
      ],
      regional_expressions: [
        '¡Qué chevere!', '¡Está muy bueno!', '¡Qué maravilla!', '¡Súper bacano!', '¡Genial!'
      ]
    },
    
    colombian_context: {
      region: 'Sabana de Bogotá',
      cultural_values: ['Familia', 'Ahorro', 'Tradición', 'Trabajo en casa', 'Cuidado de los hijos'],
      media_consumption: ['TV nacional', 'Radio AM', 'WhatsApp familiar', 'Facebook básico', 'Noticias locales'],
      social_influence: ['Amigas del barrio', 'Familia extendida', 'Vecinas', 'Mamás del colegio', 'Iglesia'],
      economic_pressures: ['Educación de los hijos', 'Gastos de la casa', 'Servicios públicos', 'Salud familiar']
    }
  }
};

// Categorías de productos por región para análisis
export const REGIONAL_PRODUCT_PREFERENCES = {
  COSTA_ATLANTICA: {
    top_brands: ['Fruco', 'Dove', 'Rexona', 'OMO'],
    climate_considerations: ['Resistencia al calor', 'Control de humedad', 'Protección solar'],
    flavor_preferences: ['Tropical', 'Fresco', 'Cítrico']
  },
  REGION_ANDINA: {
    top_brands: ['Dove', 'Suave', 'Knorr', 'Cif'],
    climate_considerations: ['Hidratación por clima seco', 'Protección urbana'],
    flavor_preferences: ['Internacional', 'Gourmet', 'Saludable']
  },
  ANTIOQUIA: {
    top_brands: ['OMO', 'Fruco', 'Dove', 'Knorr'],
    climate_considerations: ['Productos familiares', 'Durabilidad'],
    flavor_preferences: ['Tradicional', 'Familiar', 'Abundante']
  },
  VALLE_DEL_CAUCA: {
    top_brands: ['Dove', 'Suave', 'Rexona'],
    climate_considerations: ['Productos naturales', 'Sostenibilidad'],
    flavor_preferences: ['Fresco', 'Natural', 'Ligero']
  },
  SABANA_BOGOTA: {
    top_brands: ['OMO', 'Cif', 'Dove', 'Fruco'],
    climate_considerations: ['Productos familiares', 'Que rindan mucho', 'Económicos'],
    flavor_preferences: ['Tradicional', 'Casero', 'Familiar']
  }
};