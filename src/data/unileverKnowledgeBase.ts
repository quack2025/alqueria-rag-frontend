// data/unileverKnowledgeBase.ts - Base de conocimiento para consumidores de productos Unilever

export interface EconomicContext {
  nse_level: string;
  monthly_income_range: [number, number]; // En USD
  fmcg_budget_percentage: number;
  typical_fmcg_spend: [number, number]; // En USD
  shopping_frequency: 'semanal' | 'quincenal' | 'mensual';
  price_sensitivity: 'very_high' | 'high' | 'medium' | 'low';
}

export interface LanguagePatterns {
  formal_expressions: string[];
  informal_expressions: string[];
  price_related: string[];
  quality_related: string[];
  brand_related: string[];
  decision_expressions: string[];
  skepticism_expressions: string[];
  excitement_expressions: string[];
}

export interface RegionalContext {
  region: string;
  countries: string[];
  urban_level: 'metropolitana' | 'urbana' | 'intermedia' | 'rural';
  economic_profile: string;
  cultural_characteristics: string[];
  competitive_landscape: string[];
}

// Segmentos económicos basados en análisis RAG de Unilever
export const ECONOMIC_SEGMENTS: Record<string, EconomicContext> = {
  'PREMIUM': {
    nse_level: 'A/B+',
    monthly_income_range: [2500, 5000],
    fmcg_budget_percentage: 8,
    typical_fmcg_spend: [200, 400],
    shopping_frequency: 'semanal',
    price_sensitivity: 'low'
  },
  'ASPIRACIONAL': {
    nse_level: 'B',
    monthly_income_range: [1500, 2500],
    fmcg_budget_percentage: 10,
    typical_fmcg_spend: [150, 250],
    shopping_frequency: 'quincenal',
    price_sensitivity: 'medium'
  },
  'MAINSTREAM': {
    nse_level: 'C+',
    monthly_income_range: [800, 1500],
    fmcg_budget_percentage: 12,
    typical_fmcg_spend: [96, 180],
    shopping_frequency: 'quincenal',
    price_sensitivity: 'medium'
  },
  'MASS_MARKET': {
    nse_level: 'C',
    monthly_income_range: [400, 800],
    fmcg_budget_percentage: 15,
    typical_fmcg_spend: [60, 120],
    shopping_frequency: 'mensual',
    price_sensitivity: 'high'
  },
  'VALUE_CONSCIOUS': {
    nse_level: 'D/E',
    monthly_income_range: [200, 400],
    fmcg_budget_percentage: 18,
    typical_fmcg_spend: [36, 72],
    shopping_frequency: 'mensual',
    price_sensitivity: 'very_high'
  }
};

// Perfiles sintéticos basados en análisis RAG de consumidores Unilever
export const LANGUAGE_PATTERNS: Record<string, LanguagePatterns> = {
  MADRE_MODERNA: {
    formal_expressions: [
      'Para mi familia', 'Como madre', 'Lo mejor para mis hijos', 'En mi hogar',
      'Para el cuidado familiar'
    ],
    informal_expressions: [
      'Súper bueno', 'Me encanta', 'Perfecto', 'Ideal', 'Lo máximo'
    ],
    price_related: [
      'Vale la pena por la calidad', 'Es una inversión en mi familia',
      'Prefiero pagar un poco más', 'La calidad justifica el precio',
      'Para mis hijos, lo mejor'
    ],
    quality_related: [
      'Que sea seguro para los niños', 'Ingredientes naturales',
      'Sin químicos dañinos', 'Dermatológicamente probado',
      'Confianza de marca'
    ],
    brand_related: [
      'Dove siempre ha sido mi favorito', 'Unilever es confiable',
      'Marcas que conozco desde niña', 'Tradición familiar'
    ],
    decision_expressions: [
      'Lo voy a probar con los niños', 'Si funciona, me quedo con él',
      'Necesito ver resultados', 'Voy a consultarlo con otras mamás'
    ],
    skepticism_expressions: [
      '¿Será seguro para bebés?', '¿No causará alergias?',
      'He tenido malas experiencias', '¿Realmente funciona?'
    ],
    excitement_expressions: [
      '¡Esto es justo lo que necesitaba!', '¡Mis hijos van a estar súper!',
      '¡Qué maravilla!', '¡Por fin algo que funciona!'
    ]
  },

  PROFESIONAL_BEAUTY: {
    formal_expressions: [
      'Para mi rutina de cuidado', 'En mi profesión necesito', 'Como profesional',
      'Para mantener mi imagen', 'En mi trabajo es importante'
    ],
    informal_expressions: [
      'Está increíble', 'Me fascina', 'Es lo mejor', 'Súper efectivo', 'Genial'
    ],
    price_related: [
      'Invierto en mi cuidado personal', 'La calidad premium vale la pena',
      'Para resultados profesionales', 'Es parte de mi inversión personal'
    ],
    quality_related: [
      'Resultados visibles', 'Calidad profesional', 'Ingredientes activos',
      'Tecnología avanzada', 'Efectividad comprobada'
    ],
    brand_related: [
      'Dove es mi marca de confianza', 'Suave me da los mejores resultados',
      'Unilever tiene la mejor tecnología', 'Marcas internacionales'
    ],
    decision_expressions: [
      'Lo voy a incorporar a mi rutina', 'Necesito probarlo por al menos un mes',
      'Si veo resultados, sigo usándolo', 'Me gusta experimentar con nuevos productos'
    ],
    skepticism_expressions: [
      '¿Realmente funciona mejor que lo que uso?', 'Los productos milagro me dan desconfianza',
      'Necesito ver estudios clínicos', '¿No dañará mi piel a largo plazo?'
    ],
    excitement_expressions: [
      '¡Esto va a revolucionar mi rutina!', '¡Necesito probarlo ya!',
      '¡Se ve increíble!', '¡Esto es lo que estaba buscando!'
    ]
  },

  AMA_DE_CASA_EXPERTA: {
    formal_expressions: [
      'Para mantener mi casa', 'En la limpieza del hogar', 'Como ama de casa',
      'Para el cuidado de la ropa', 'En mis labores domésticas'
    ],
    informal_expressions: [
      'Está buenísimo', 'Funciona súper', 'Es lo mejor', 'Perfecto para la casa'
    ],
    price_related: [
      'Que rinda mucho', 'Buen precio por la cantidad', 'Económico y efectivo',
      'Que valga la pena', 'Relación precio-calidad'
    ],
    quality_related: [
      'Que limpie de verdad', 'Sin dañar las telas', 'Que quite todas las manchas',
      'Fácil de usar', 'Resultados garantizados'
    ],
    brand_related: [
      'OMO siempre ha sido mi favorito', 'Cif es lo que más uso',
      'Marcas de toda la vida', 'En mi familia siempre usamos Unilever'
    ],
    decision_expressions: [
      'Lo voy a probar en la próxima lavada', 'Si funciona bien, lo sigo comprando',
      'Necesito comparar con lo que uso', 'Voy a ver qué tal resulta'
    ],
    skepticism_expressions: [
      '¿Será mejor que lo que uso?', 'Muchas marcas prometen y no cumplen',
      '¿No dañará mi lavadora?', '¿Realmente vale la pena cambiar?'
    ],
    excitement_expressions: [
      '¡Esto me va a facilitar la vida!', '¡Por fin algo que funciona!',
      '¡Qué bueno!', '¡Esto es justo lo que necesitaba!'
    ]
  },

  MILLENNIALS_CONSCIENTE: {
    formal_expressions: [
      'Como consumidor consciente', 'Para mi estilo de vida', 'En mi rutina diaria',
      'Para el medio ambiente', 'Como millennial responsable'
    ],
    informal_expressions: [
      '¡Está súper cool!', 'Me encanta', 'Es lo máximo', 'Súper sustentable', 'Genial'
    ],
    price_related: [
      'Pago más por productos sustentables', 'Vale la pena por el impacto',
      'Invierto en marcas responsables', 'El precio refleja la calidad'
    ],
    quality_related: [
      'Ingredientes naturales', 'Cruelty-free', 'Sustentable',
      'Sin microplásticos', 'Packaging reciclable'
    ],
    brand_related: [
      'Unilever está cambiando para bien', 'Me gusta su compromiso ambiental',
      'Dove y su campaña de autoestima', 'Marcas con propósito'
    ],
    decision_expressions: [
      'Voy a investigar más sobre el producto', 'Me gusta apoyar estas iniciativas',
      'Lo voy a recomendar en mis redes', 'Definitivamente lo voy a probar'
    ],
    skepticism_expressions: [
      '¿Realmente es tan sustentable como dicen?', 'Las grandes marcas a veces solo hacen marketing',
      '¿Es greenwashing o es real?', 'Necesito verificar las certificaciones'
    ],
    excitement_expressions: [
      '¡Esto está increíble!', '¡Por fin una marca que entiende!',
      '¡Necesito contarles a mis amigos!', '¡Esto es el futuro!'
    ]
  },

  SENIOR_TRADICIONAL: {
    formal_expressions: [
      'En mis años de experiencia', 'Como persona de edad', 'Desde siempre',
      'En mi tiempo', 'Como abuela'
    ],
    informal_expressions: [
      'Está muy bueno', 'Me gusta', 'Está bien', 'Es confiable', 'Funciona'
    ],
    price_related: [
      'A precio justo', 'Que no sea muy caro', 'Con mi pensión',
      'Económico pero bueno', 'Que rinda'
    ],
    quality_related: [
      'Como los de antes', 'De buena calidad', 'Que funcione bien',
      'Sin complicaciones', 'Confiable'
    ],
    brand_related: [
      'Marcas de toda la vida', 'Las que usaba mi madre',
      'Unilever es confianza', 'Dove es suavidad'
    ],
    decision_expressions: [
      'Lo voy a probar a ver qué tal', 'Si está bueno, lo sigo comprando',
      'Voy a preguntarle a mi hija', 'A ver si me conviene'
    ],
    skepticism_expressions: [
      '¿Será como los de antes?', 'Muchas cosas nuevas no me gustan',
      '¿No será muy complicado de usar?', 'Los productos de ahora a veces fallan'
    ],
    excitement_expressions: [
      'Qué bueno que aún hacen productos así', 'Me recuerda a los de antes',
      'Está muy bien', 'Es lo que necesitaba'
    ]
  },

  JOVEN_TRENDY: {
    formal_expressions: [
      'Para mi estilo de vida', 'En mi rutina de belleza', 'Para mis looks',
      'En mis redes sociales', 'Para estar trending'
    ],
    informal_expressions: [
      '¡Está súper viral!', '¡Me obsesioné!', '¡Es lo máximo!', 
      '¡Súper aesthetic!', '¡Iconic!'
    ],
    price_related: [
      'Vale la pena por lo trendy', 'Si está de moda, lo compro',
      'Para algo cool sí invierto', 'El precio es justo para la experiencia'
    ],
    quality_related: [
      'Que se vea bien en fotos', 'Packaging instagrameable',
      'Resultados que se noten', 'Textura increíble'
    ],
    brand_related: [
      'Dove está súper trendy ahora', 'Unilever está en todo TikTok',
      'Mis influencers favoritos lo usan', 'Es súper viral'
    ],
    decision_expressions: [
      '¡Lo necesito para mi colección!', 'Definitivamente lo voy a conseguir',
      'Lo voy a probar y hacer review', 'Tengo que tenerlo'
    ],
    skepticism_expressions: [
      '¿Será solo hype?', 'Espero que no decepcione como otros',
      '¿Realmente funciona o es puro marketing?', 'A ver si no es solo packaging'
    ],
    excitement_expressions: [
      '¡NECESITO esto en mi vida!', '¡Está súper aesthetic!',
      '¡Mis seguidores van a amar esto!', '¡Es perfectamente viral!'
    ]
  },

  HOMBRE_MODERNO: {
    formal_expressions: [
      'Para mi rutina masculina', 'Como hombre moderno', 'Para mi cuidado personal',
      'En mi día a día', 'Para el trabajo'
    ],
    informal_expressions: [
      'Está súper', 'Funciona bien', 'Es práctico', 'Está bueno', 'Me gusta'
    ],
    price_related: [
      'Precio razonable', 'Vale la inversión', 'Para algo bueno sí pago',
      'Relación precio-beneficio', 'Justo por la calidad'
    ],
    quality_related: [
      'Efectividad masculina', 'Fórmula para hombres', 'Resultados rápidos',
      'Sin complicaciones', 'Fácil de usar'
    ],
    brand_related: [
      'Dove Men+Care es confiable', 'Unilever entiende a los hombres',
      'Marcas probadas', 'Calidad internacional'
    ],
    decision_expressions: [
      'Lo voy a probar', 'Si funciona, lo adopto', 'Me convence la propuesta',
      'Voy a incorporarlo a mi rutina'
    ],
    skepticism_expressions: [
      '¿Realmente es para hombres?', 'No me gustan los productos complicados',
      '¿Funcionará con mi tipo de piel?', 'Espero que no sea solo marketing'
    ],
    excitement_expressions: [
      '¡Esto está genial!', 'Por fin algo específico para hombres',
      '¡Justo lo que necesitaba!', 'Está súper práctico'
    ]
  }
};

// Contextos regionales para mercados Unilever
export const REGIONAL_CONTEXTS: Record<string, RegionalContext> = {
  LATAM_METRO: {
    region: 'Latinoamérica Metropolitana',
    countries: ['México', 'Colombia', 'Argentina', 'Chile', 'Perú'],
    urban_level: 'metropolitana',
    economic_profile: 'Centros económicos principales, NSE diversificado, mayor poder adquisitivo',
    cultural_characteristics: [
      'Cosmopolita', 'Adopción temprana', 'Consumidores sofisticados',
      'Influencia global', 'Conciencia de marca'
    ],
    competitive_landscape: [
      'Alta competencia premium', 'Marcas globales vs locales',
      'Consumidores informados', 'Canales modernos dominantes'
    ]
  },
  LATAM_URBAN: {
    region: 'Latinoamérica Urbana',
    countries: ['México', 'Colombia', 'Argentina', 'Chile', 'Perú'],
    urban_level: 'urbana',
    economic_profile: 'Ciudades secundarias, clase media, crecimiento económico',
    cultural_characteristics: [
      'Aspiracional', 'Balance tradición-modernidad', 'Familia central',
      'Marcas como status', 'Calidad-precio importante'
    ],
    competitive_landscape: [
      'Mix premium-mainstream', 'Canales tradicionales fuertes',
      'Promociones importantes', 'Lealtad de marca media'
    ]
  },
  CENTROAMERICA: {
    region: 'Centroamérica',
    countries: ['Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panamá'],
    urban_level: 'intermedia',
    economic_profile: 'Economías emergentes, remesas importantes, mercado fragmentado',
    cultural_characteristics: [
      'Tradiciones fuertes', 'Familia extendida', 'Comunidad importante',
      'Marcas de confianza', 'Precio muy relevante'
    ],
    competitive_landscape: [
      'Competencia intensa en precio', 'Canales tradicionales dominan',
      'Marcas locales fuertes', 'Cobertura geográfica crucial'
    ]
  },
  CARIBE: {
    region: 'Caribe',
    countries: ['República Dominicana', 'Jamaica', 'Trinidad y Tobago', 'Puerto Rico'],
    urban_level: 'urbana',
    economic_profile: 'Economías turísticas, mercados pequeños, influencia externa',
    cultural_characteristics: [
      'Diversidad cultural', 'Influencia internacional', 'Clima tropical',
      'Cuidado personal importante', 'Expresión individual'
    ],
    competitive_landscape: [
      'Mercados nicho', 'Importaciones importantes',
      'Marcas estadounidenses fuertes', 'Distribución desafiante'
    ]
  }
};

// Landscape competitivo de Unilever
export const COMPETITIVE_LANDSCAPE = {
  UNILEVER: {
    strengths: [
      'Portfolio diversificado (Dove, OMO, Cif, Suave)',
      'Liderazgo en cuidado personal',
      'Innovación constante',
      'Sustentabilidad como diferenciador',
      'Campaña de autoestima de Dove',
      'Distribución global'
    ],
    challenges: [
      'Competencia intensa de P&G',
      'Marcas locales en segmentos value',
      'Presión de precios en mercados emergentes'
    ]
  },
  PROCTER_GAMBLE: {
    strengths: [
      'Head & Shoulders líder en anticaspa',
      'Pantene fuerte en cuidado capilar',
      'Olay premium en cuidado facial',
      'Innovación tecnológica'
    ],
    challenges: [
      'Portfolio menos diversificado que Unilever',
      'Menor presencia en mercados emergentes'
    ]
  },
  MARCAS_LOCALES: {
    strengths: [
      'Precios competitivos',
      'Conocimiento local',
      'Distribución capilar',
      'Agilidad en respuesta al mercado'
    ],
    challenges: [
      'Menor inversión en I+D',
      'Recursos de marketing limitados',
      'Alcance geográfico restringido'
    ]
  }
};

// Comportamientos de consumo específicos de productos Unilever
export const CONSUMPTION_BEHAVIOR = {
  PERSONAL_CARE: {
    frequency: 'diaria',
    decision_factors: ['eficacia', 'precio', 'marca', 'ingredientes', 'packaging'],
    purchase_drivers: ['necesidad', 'promociones', 'lanzamientos', 'recomendaciones'],
    loyalty_level: 'media-alta',
    trial_propensity: 'media'
  },
  HOME_CARE: {
    frequency: 'semanal',
    decision_factors: ['efectividad', 'precio', 'rendimiento', 'facilidad de uso'],
    purchase_drivers: ['stock-out', 'ofertas', 'cambio de temporada'],
    loyalty_level: 'alta',
    trial_propensity: 'baja'
  },
  BEAUTY: {
    frequency: 'mensual',
    decision_factors: ['resultados', 'marca', 'tendencias', 'ingredientes', 'reviews'],
    purchase_drivers: ['lanzamientos', 'temporadas', 'ocasiones especiales', 'influencers'],
    loyalty_level: 'baja',
    trial_propensity: 'alta'
  }
};

export default {
  ECONOMIC_SEGMENTS,
  LANGUAGE_PATTERNS,
  REGIONAL_CONTEXTS,
  COMPETITIVE_LANDSCAPE,
  CONSUMPTION_BEHAVIOR
};