// data/colombiaKnowledgeBase.ts - Base de conocimiento cultural colombiana para Unilever

export interface EconomicContext {
  nse_level: string;
  monthly_income_range: [number, number]; // En pesos colombianos COP
  fmcg_budget_percentage: number;
  typical_fmcg_spend: [number, number]; // En pesos COP
  shopping_preference: 'supermercados' | 'hipermercados' | 'tiendas_barrio' | 'mixed';
  price_sensitivity: 'very_high' | 'high' | 'medium' | 'low';
}

export interface LanguagePatterns {
  formal_expressions: string[];
  informal_expressions: string[];
  price_related: string[];
  quality_related: string[];
  product_related: string[];
  decision_expressions: string[];
  skepticism_expressions: string[];
  excitement_expressions: string[];
}

export interface RegionalContext {
  city: string;
  department: string;
  region: 'andina' | 'caribe' | 'pacifica' | 'amazonica' | 'orinoquia';
  economic_profile: string;
  cultural_characteristics: string[];
  competitive_landscape: string[];
}

// Base de conocimiento económico colombiano para Unilever
export const ECONOMIC_SEGMENTS: Record<string, EconomicContext> = {
  'NSE_AB': {
    nse_level: 'AB',
    monthly_income_range: [8000000, 15000000], // $8M-15M+ COP
    fmcg_budget_percentage: 8,
    typical_fmcg_spend: [640000, 1200000],
    shopping_preference: 'supermercados',
    price_sensitivity: 'low'
  },
  'NSE_C_PLUS': {
    nse_level: 'C+',
    monthly_income_range: [4000000, 8000000], // $4M-8M COP
    fmcg_budget_percentage: 12,
    typical_fmcg_spend: [480000, 960000],
    shopping_preference: 'supermercados',
    price_sensitivity: 'medium'
  },
  'NSE_C': {
    nse_level: 'C',
    monthly_income_range: [2000000, 4000000], // $2M-4M COP
    fmcg_budget_percentage: 15,
    typical_fmcg_spend: [300000, 600000],
    shopping_preference: 'tiendas_barrio',
    price_sensitivity: 'high'
  },
  'NSE_D': {
    nse_level: 'D',
    monthly_income_range: [1000000, 2000000], // $1M-2M COP
    fmcg_budget_percentage: 20,
    typical_fmcg_spend: [200000, 400000],
    shopping_preference: 'tiendas_barrio',
    price_sensitivity: 'very_high'
  }
};

// Patrones de lenguaje colombiano por región
export const LANGUAGE_PATTERNS: Record<string, LanguagePatterns> = {
  'COSTENO': {
    formal_expressions: ['Con todo respeto', 'Si me permite', 'Muy amablemente'],
    informal_expressions: ['¿sí o no?', 'mi amor', 'corazón', 'ay, qué rico', 'ombe'],
    price_related: ['¿cuánto vale?', 'está carísimo', 'no está tan caro', 'vale la pena'],
    quality_related: ['está buenísimo', 'qué maravilla', 'eso sí está bueno', 'de primera'],
    product_related: ['el productito', 'la cremita', 'eso que usan', 'lo que me gusta'],
    decision_expressions: ['yo creo que sí', 'me parece bacano', 'está bueno', '¿tú qué crees?'],
    skepticism_expressions: ['ay no sé', 'no me convence', 'me da desconfianza'],
    excitement_expressions: ['¡Ay, sí!', '¡Qué chimba!', '¡Me encanta!', '¡Está brutal!']
  },
  'PAISA': {
    formal_expressions: ['Muy cordialmente', 'Con mucho gusto', 'Si es tan amable'],
    informal_expressions: ['pues sí', 've', '¿sí o qué?', 'parcero', 'hermano'],
    price_related: ['¿cuánto es?', 'está muy caro', 'está regalado', 'no es tan caro'],
    quality_related: ['está bacano', 'es muy bueno', 'de buena calidad', 'vale la pena'],
    product_related: ['eso', 'el producto', 'lo que uso', 'mi favorito'],
    decision_expressions: ['yo pienso que', 'me parece que', 'está bueno', 'vamos a ver'],
    skepticism_expressions: ['no sé', 'me da cosita', 'no me convence mucho'],
    excitement_expressions: ['¡Ave María!', '¡Qué bacano!', '¡Me gusta!', '¡Está buenísimo!']
  },
  'BOGOTANO': {
    formal_expressions: ['Con mucho respeto', 'Si me permite', 'Muy cordialmente'],
    informal_expressions: ['che', 'parcero', '¿sí ve?', 'pues claro', 'obvio'],
    price_related: ['¿cuánto cuesta?', 'está muy costoso', 'no está mal de precio', 'vale cada peso'],
    quality_related: ['está muy bueno', 'es de calidad', 'funciona bien', 'me gusta'],
    product_related: ['el producto', 'eso que uso', 'mi marca', 'lo que compro'],
    decision_expressions: ['yo creo', 'me parece', 'está bien', 'puede ser'],
    skepticism_expressions: ['no estoy seguro', 'me da dudas', 'no sé qué pensar'],
    excitement_expressions: ['¡Qué bueno!', '¡Me parece genial!', '¡Está súper!', '¡Perfecto!']
  },
  'VALLUNO': {
    formal_expressions: ['Con todo respeto', 'Si me hace el favor', 'Muy amable'],
    informal_expressions: ['¿sí o no?', 'manito', 'amor', 'corazón', '¿cierto?'],
    price_related: ['¿a cómo está?', 'está muy caro', 'está baratico', 'vale la pena'],
    quality_related: ['está chimba', 'está brutal', 'es buenísimo', 'me encanta'],
    product_related: ['esa cosa', 'el productito', 'lo que uso', 'mi preferido'],
    decision_expressions: ['yo digo que', 'me parece bacano', 'está bueno', '¿vos qué decís?'],
    skepticism_expressions: ['no sé qué', 'me da miedito', 'no estoy segura'],
    excitement_expressions: ['¡Qué chimba!', '¡Está increíble!', '¡Me fascina!', '¡Súper!']
  }
};

// Contexto regional colombiano
export const REGIONAL_CONTEXTS: Record<string, RegionalContext> = {
  'BOGOTA': {
    city: 'Bogotá',
    department: 'Cundinamarca',
    region: 'andina',
    economic_profile: 'Centro económico principal, mayor poder adquisitivo, mercado más competitivo',
    cultural_characteristics: [
      'Consumidores informados y exigentes',
      'Valoran marcas premium y calidad',
      'Influenciados por tendencias internacionales',
      'Alto uso de canales digitales'
    ],
    competitive_landscape: [
      'P&G (Olay, Head&Shoulders, Pantene)',
      'L\'Oréal (Garnier, Elvive)',
      'Johnson&Johnson (Neutrogena)',
      'Marcas locales premium'
    ]
  },
  'MEDELLIN': {
    city: 'Medellín',
    department: 'Antioquia',
    region: 'andina',
    economic_profile: 'Centro industrial y comercial, tradición empresarial, innovación',
    cultural_characteristics: [
      'Leales a marcas tradicionales',
      'Valoran la relación precio-calidad',
      'Influencia familiar en decisiones',
      'Emprendedores y prácticos'
    ],
    competitive_landscape: [
      'P&G productos tradicionales',
      'Marcas locales establecidas',
      'Competencia en precio',
      'Canal tradicional fuerte'
    ]
  },
  'BARRANQUILLA': {
    city: 'Barranquilla',
    department: 'Atlántico',
    region: 'caribe',
    economic_profile: 'Puerto principal, comercio internacional, clima cálido',
    cultural_characteristics: [
      'Consumidores alegres y sociales',
      'Influenciados por el clima tropical',
      'Valoran productos para el calor',
      'Tradición en productos de belleza'
    ],
    competitive_landscape: [
      'Marcas internacionales adaptadas',
      'Productos específicos para clima',
      'Canal tradicional predominante',
      'Competencia en protección solar'
    ]
  },
  'CALI': {
    city: 'Cali',
    department: 'Valle del Cauca',
    region: 'pacifica',
    economic_profile: 'Centro agroindustrial, salsa y cultura, puerto alternativo',
    cultural_characteristics: [
      'Conscientes de la imagen personal',
      'Influencia de cultura afro',
      'Productos para cabello rizado/crespo',
      'Mercado juvenil activo'
    ],
    competitive_landscape: [
      'Marcas especializadas en texturas',
      'Productos étnicos',
      'Competencia en cuidado capilar',
      'Innovación en productos'
    ]
  }
};

// Insights específicos por marcas Unilever en Colombia
export const BRAND_INSIGHTS = {
  'DOVE': {
    brand_perception: 'Marca premium de confianza, líder en cuidado personal',
    key_attributes: ['suavidad', 'hidratación', 'confianza', 'belleza real'],
    target_segments: ['Madre moderna', 'Profesional beauty', 'Mujeres 25-45'],
    competitive_advantage: 'Campaña de autoestima, ingredientes premium',
    challenges: ['Precio premium', 'Competencia P&G'],
    regional_variations: {
      'costa_caribe': 'Productos para clima húmedo y calor',
      'andes': 'Focus en hidratación para clima seco',
      'valle': 'Productos para cabello rizado'
    }
  },
  'FRUCO': {
    brand_perception: 'Marca nacional tradicional, sabor colombiano',
    key_attributes: ['tradición', 'sabor casero', 'colombianidad', 'familia'],
    target_segments: ['Amas de casa', 'Familias tradicionales', 'NSE C/C+'],
    competitive_advantage: 'Herencia colombiana, sabor tradicional',
    challenges: ['Marcas gourmet', 'Productos artesanales'],
    regional_variations: {
      'todas': 'Producto transversal a todas las regiones'
    }
  },
  'OMO': {
    brand_perception: 'Detergente efectivo y confiable',
    key_attributes: ['limpieza profunda', 'efectividad', 'rendimiento', 'confianza'],
    target_segments: ['Amas de casa expertas', 'Familias numerosas', 'NSE C/D'],
    competitive_advantage: 'Efectividad comprobada, precio competitivo',
    challenges: ['Marcas económicas', 'Productos concentrados'],
    regional_variations: {
      'costa_caribe': 'Productos para manchas de sudor',
      'zonas_rurales': 'Rendimiento en agua dura'
    }
  }
};

export default {
  ECONOMIC_SEGMENTS,
  LANGUAGE_PATTERNS,
  REGIONAL_CONTEXTS,
  BRAND_INSIGHTS
};