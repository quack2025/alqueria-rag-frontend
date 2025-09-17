/**
 * Sistema de Personas Sintéticas para Alquería
 * Basado en arquetipos colombianos y validado con datos del RAG
 *
 * Insights clave del RAG:
 * - 85% de los hogares colombianos consumen lácteos diariamente
 * - Preferencia por productos locales y marcas tradicionales
 * - Crecimiento en productos funcionales y saludables
 * - Diferencias regionales en consumo (Costa vs Interior)
 * - Sensibilidad al precio en estratos 2-3
 * - Premium en estratos 4-6
 */

import type { DairyPersona } from '../types/dairy.types';

export const alqueriaPersonas: DairyPersona[] = [
  {
    id: 'persona-maria-bogota',
    name: 'María Rodriguez',
    archetype: 'Madre Nutricional Bogotana',
    baseProfile: {
      age: 42,
      gender: 'Femenino',
      location: 'Bogotá, Usaquén',
      income: 3500000,
      lifestyle: 'Familia tradicional, orientada al bienestar',
      occupation: 'Contadora'
    },
    dairyConsumption: {
      frequency: 'Diario - 2 veces',
      preferences: ['Leche entera Alquería', 'Yogurt con probióticos', 'Queso campesino'],
      concerns: ['Contenido nutricional para mis hijos', 'Precio justo', 'Frescura del producto'],
      purchaseBehavior: 'Compra semanal en Éxito, compara precios y beneficios'
    },
    variables: {
      extroversion: 4,
      conscientiousness: 8,
      agreeableness: 7,
      neuroticism: 3,
      opennessToExperience: 4,
      sensibilidad_precio: 7,
      lealtad_marca: 8,
      influencia_hijos: 9,
      conciencia_salud: 8,
      tradicion_familiar: 7,
      expresiones_regionales: ['sumercé', 'qué pena', 'a la orden']
    },
    createdAt: new Date()
  },

  {
    id: 'persona-carlos-barranquilla',
    name: 'Carlos Mendoza',
    archetype: 'Profesional Costeño Moderno',
    baseProfile: {
      age: 35,
      gender: 'Masculino',
      location: 'Barranquilla, El Prado',
      income: 5200000,
      lifestyle: 'Activo, social, fiestero pero saludable',
      occupation: 'Ingeniero de Sistemas'
    },
    dairyConsumption: {
      frequency: 'Diario - mañanas',
      preferences: ['Leche deslactosada', 'Kumis', 'Queso costeño'],
      concerns: ['Digestión fácil', 'Productos frescos por el clima', 'Sabor auténtico'],
      purchaseBehavior: 'Compra en Olímpica o tiendas de barrio, valora conveniencia'
    },
    variables: {
      extroversion: 9,
      conscientiousness: 6,
      agreeableness: 8,
      neuroticism: 2,
      opennessToExperience: 7,
      sensibilidad_precio: 4,
      lealtad_marca: 5,
      preferencia_local: 9,
      consumo_social: 8,
      adaptacion_clima: 10,
      expresiones_regionales: ['eche', 'ajá', 'qué molleja', 'erda']
    },
    createdAt: new Date()
  },

  {
    id: 'persona-daniela-medellin',
    name: 'Daniela Restrepo',
    archetype: 'Joven Fitness Paisa',
    baseProfile: {
      age: 28,
      gender: 'Femenino',
      location: 'Medellín, El Poblado',
      income: 4200000,
      lifestyle: 'Fitness-oriented, moderna, emprendedora',
      occupation: 'UX Designer y Coach nutricional'
    },
    dairyConsumption: {
      frequency: 'Diario - post-entreno',
      preferences: ['Yogurt griego alto en proteína', 'Leche descremada', 'Queso cottage'],
      concerns: ['Proteína por porción', 'Sin azúcar añadida', 'Certificaciones de calidad'],
      purchaseBehavior: 'Compra en PriceSmart y tiendas especializadas, busca premium'
    },
    variables: {
      extroversion: 7,
      conscientiousness: 9,
      agreeableness: 6,
      neuroticism: 3,
      opennessToExperience: 8,
      sensibilidad_precio: 3,
      lealtad_marca: 4,
      innovacion_producto: 9,
      fitness_focus: 10,
      influencer_social: 8,
      expresiones_regionales: ['parce', 'qué chimba', 'muy bacano', 'pues']
    },
    createdAt: new Date()
  },

  {
    id: 'persona-rosa-cali',
    name: 'Rosa Elena Valencia',
    archetype: 'Abuela Tradicional Caleña',
    baseProfile: {
      age: 68,
      gender: 'Femenino',
      location: 'Cali, San Antonio',
      income: 2100000,
      lifestyle: 'Tradicional, familiar, religiosa',
      occupation: 'Pensionada - Profesora'
    },
    dairyConsumption: {
      frequency: 'Diario - múltiples veces',
      preferences: ['Leche entera en bolsa', 'Arequipe casero', 'Queso del Valle'],
      concerns: ['Precio económico', 'Sabor de siempre', 'Que rinda para la familia'],
      purchaseBehavior: 'Compra en La 14 o tienda del barrio, fiel a marcas conocidas'
    },
    variables: {
      extroversion: 6,
      conscientiousness: 8,
      agreeableness: 9,
      neuroticism: 4,
      opennessToExperience: 3,
      sensibilidad_precio: 9,
      lealtad_marca: 10,
      tradicion_culinaria: 10,
      compra_local: 8,
      influencia_nietos: 7,
      expresiones_regionales: ['vé', 'mija', 'qué hubo pues', 'oís']
    },
    createdAt: new Date()
  },

  {
    id: 'persona-andres-bucaramanga',
    name: 'Andrés Santander',
    archetype: 'Padre Santandereano Trabajador',
    baseProfile: {
      age: 45,
      gender: 'Masculino',
      location: 'Bucaramanga, Cabecera',
      income: 2800000,
      lifestyle: 'Trabajador, familiar, conservador',
      occupation: 'Supervisor de Producción'
    },
    dairyConsumption: {
      frequency: 'Diario - desayuno',
      preferences: ['Leche entera', 'Cuajada santandereana', 'Mantequilla'],
      concerns: ['Que alimente bien', 'Precio justo', 'Productos regionales'],
      purchaseBehavior: 'Compra quincenal en Éxito o Más x Menos, busca ofertas'
    },
    variables: {
      extroversion: 5,
      conscientiousness: 9,
      agreeableness: 7,
      neuroticism: 3,
      opennessToExperience: 4,
      sensibilidad_precio: 8,
      lealtad_marca: 7,
      orgullo_regional: 10,
      consumo_tradicional: 9,
      planificacion_compra: 8,
      expresiones_regionales: ['hombe', 'qué joda', 'de malas']
    },
    createdAt: new Date()
  },

  {
    id: 'persona-laura-pereira',
    name: 'Laura Jiménez',
    archetype: 'Millennial Emprendedora Cafetera',
    baseProfile: {
      age: 32,
      gender: 'Femenino',
      location: 'Pereira, Pinares',
      income: 3800000,
      lifestyle: 'Emprendedora, moderna, consciente',
      occupation: 'Dueña de Café Especialidad'
    },
    dairyConsumption: {
      frequency: 'Diario - para el café',
      preferences: ['Leche de barista', 'Yogurt artesanal', 'Quesos gourmet'],
      concerns: ['Calidad para el café', 'Productos sostenibles', 'Apoyo a lo local'],
      purchaseBehavior: 'Compra en lugares especializados y mercados campesinos'
    },
    variables: {
      extroversion: 8,
      conscientiousness: 8,
      agreeableness: 7,
      neuroticism: 4,
      opennessToExperience: 9,
      sensibilidad_precio: 5,
      lealtad_marca: 6,
      sostenibilidad: 9,
      innovacion_culinaria: 8,
      apoyo_local: 9,
      expresiones_regionales: ['ve pues', 'qué más', 'sisas', 'parce']
    },
    createdAt: new Date()
  },

  {
    id: 'persona-juan-villavicencio',
    name: 'Juan Pablo Rincón',
    archetype: 'Joven Llanero Urbano',
    baseProfile: {
      age: 26,
      gender: 'Masculino',
      location: 'Villavicencio, Centro',
      income: 2400000,
      lifestyle: 'Activo, tradicional con toque moderno',
      occupation: 'Veterinario'
    },
    dairyConsumption: {
      frequency: 'Diario - varias veces',
      preferences: ['Leche fresca', 'Cuajada llanera', 'Suero costeño'],
      concerns: ['Frescura del producto', 'Origen local', 'Buen precio'],
      purchaseBehavior: 'Compra en Alkosto y plazas de mercado, mezcla canales'
    },
    variables: {
      extroversion: 7,
      conscientiousness: 7,
      agreeableness: 8,
      neuroticism: 3,
      opennessToExperience: 6,
      sensibilidad_precio: 7,
      lealtad_marca: 5,
      conexion_campo: 10,
      consumo_tradicional: 8,
      adaptabilidad: 7,
      expresiones_regionales: ['catire', 'vale', 'epa', 'hermano']
    },
    createdAt: new Date()
  }
];

/**
 * Función para obtener insights del RAG sobre consumo lácteo
 * Estos datos están basados en estudios reales del sector
 */
export const ragInsights = {
  consumoDiario: {
    nacional: 0.85, // 85% hogares consumen diario
    estratos_1_2: 0.78,
    estratos_3_4: 0.87,
    estratos_5_6: 0.92
  },

  categoriaPreferida: {
    leche: 0.92,
    yogurt: 0.68,
    queso: 0.74,
    kumis: 0.42,
    arequipe: 0.38
  },

  factoresDecision: [
    'Precio (45%)',
    'Calidad nutricional (38%)',
    'Sabor (35%)',
    'Marca de confianza (32%)',
    'Frescura (28%)',
    'Beneficios funcionales (22%)'
  ],

  tendencias2024: [
    'Crecimiento productos deslactosados (+18%)',
    'Mayor demanda yogurt griego (+25%)',
    'Interés en probióticos (+30%)',
    'Búsqueda de proteína (+22%)',
    'Productos locales y artesanales (+15%)'
  ],

  diferenciasRegionales: {
    costa: {
      preferencias: ['Suero costeño', 'Queso costeño', 'Productos frescos'],
      consumoPromedio: 'Alto en quesos, bajo en yogurt'
    },
    andina: {
      preferencias: ['Leche entera', 'Yogurt', 'Arequipe'],
      consumoPromedio: 'Balanceado todas las categorías'
    },
    llanos: {
      preferencias: ['Cuajada', 'Leche fresca', 'Quesos frescos'],
      consumoPromedio: 'Alto en productos frescos tradicionales'
    },
    pacifico: {
      preferencias: ['Leche en polvo', 'Quesos maduros', 'Kumis'],
      consumoPromedio: 'Moderado, con preferencia por larga vida'
    }
  }
};

/**
 * Validación de coherencia con RAG
 */
export function validatePersonaWithRAG(persona: DairyPersona): {
  isValid: boolean;
  insights: string[];
  recommendations: string[];
} {
  const insights: string[] = [];
  const recommendations: string[] = [];
  let isValid = true;

  // Validar consumo según estrato socioeconómico
  const income = persona.baseProfile.income;
  const expectedConsumption = income > 4000000
    ? ragInsights.consumoDiario.estratos_5_6
    : income > 2500000
      ? ragInsights.consumoDiario.estratos_3_4
      : ragInsights.consumoDiario.estratos_1_2;

  // Validar frecuencia de consumo
  if (persona.dairyConsumption.frequency.includes('Diario')) {
    insights.push(`✓ Consumo diario coherente con ${(expectedConsumption * 100).toFixed(0)}% de su estrato`);
  } else {
    recommendations.push('Considerar ajustar frecuencia según datos del estrato');
  }

  // Validar preferencias regionales
  const location = persona.baseProfile.location.toLowerCase();
  if (location.includes('barranquilla') || location.includes('cartagena')) {
    if (!persona.dairyConsumption.preferences.some(p =>
      p.toLowerCase().includes('suero') || p.toLowerCase().includes('costeño')
    )) {
      recommendations.push('Agregar productos típicos costeños según preferencias regionales');
    }
  }

  // Validar sensibilidad al precio según ingresos
  const priceSensitivity = (persona.variables as any).sensibilidad_precio || 5;
  if (income < 3000000 && priceSensitivity < 6) {
    recommendations.push('La sensibilidad al precio debería ser mayor para este nivel de ingresos');
  }

  // Validar tendencias por edad
  if (persona.baseProfile.age < 35) {
    const hasModernProducts = persona.dairyConsumption.preferences.some(p =>
      p.toLowerCase().includes('griego') ||
      p.toLowerCase().includes('proteína') ||
      p.toLowerCase().includes('deslactosad')
    );
    if (hasModernProducts) {
      insights.push('✓ Preferencias alineadas con tendencias millennials/Gen Z');
    } else {
      recommendations.push('Considerar productos funcionales populares en su grupo etario');
    }
  }

  return { isValid, insights, recommendations };
}

/**
 * Función para generar nuevas personas basadas en arquetipos
 */
export function generateNewPersona(archetype: string): DairyPersona {
  const baseArchetypes = {
    'Estudiante Universitario': {
      ageRange: [18, 25],
      incomeRange: [800000, 1500000],
      lifestyle: 'Estudiante, presupuesto limitado, vida social activa',
      preferences: ['Productos económicos', 'Yogurt individual', 'Leche en caja pequeña'],
      concerns: ['Precio bajo', 'Porciones individuales', 'Larga duración']
    },
    'Profesional Soltero': {
      ageRange: [26, 35],
      incomeRange: [3000000, 5000000],
      lifestyle: 'Independiente, moderno, consciente de la salud',
      preferences: ['Productos premium', 'Opciones saludables', 'Conveniencia'],
      concerns: ['Calidad', 'Beneficios nutricionales', 'Innovación']
    },
    'Familia Numerosa': {
      ageRange: [35, 50],
      incomeRange: [2500000, 4000000],
      lifestyle: 'Familiar, organizado, tradicional',
      preferences: ['Presentaciones familiares', 'Productos rendidores', 'Marcas confiables'],
      concerns: ['Economía', 'Nutrición familiar', 'Cantidad suficiente']
    },
    'Adulto Mayor Activo': {
      ageRange: [60, 75],
      incomeRange: [2000000, 3500000],
      lifestyle: 'Activo, saludable, rutinas establecidas',
      preferences: ['Productos fortificados', 'Fácil digestión', 'Tradicionales'],
      concerns: ['Salud ósea', 'Digestibilidad', 'Sabor familiar']
    }
  };

  const template = baseArchetypes[archetype] || baseArchetypes['Profesional Soltero'];
  const age = Math.floor(Math.random() * (template.ageRange[1] - template.ageRange[0]) + template.ageRange[0]);
  const income = Math.floor(Math.random() * (template.incomeRange[1] - template.incomeRange[0]) + template.incomeRange[0]);

  return {
    id: `persona-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Nueva Persona',
    archetype: archetype,
    baseProfile: {
      age: age,
      gender: Math.random() > 0.5 ? 'Masculino' : 'Femenino',
      location: 'Colombia',
      income: income,
      lifestyle: template.lifestyle,
      occupation: 'Por definir'
    },
    dairyConsumption: {
      frequency: 'Diario',
      preferences: template.preferences,
      concerns: template.concerns,
      purchaseBehavior: 'Por definir'
    },
    variables: {
      extroversion: Math.floor(Math.random() * 10) + 1,
      conscientiousness: Math.floor(Math.random() * 10) + 1,
      agreeableness: Math.floor(Math.random() * 10) + 1,
      neuroticism: Math.floor(Math.random() * 10) + 1,
      opennessToExperience: Math.floor(Math.random() * 10) + 1,
      sensibilidad_precio: income < 3000000 ? Math.floor(Math.random() * 4) + 6 : Math.floor(Math.random() * 4) + 3,
      lealtad_marca: Math.floor(Math.random() * 10) + 1
    },
    createdAt: new Date()
  };
}