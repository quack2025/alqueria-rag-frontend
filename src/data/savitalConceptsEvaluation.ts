// savitalConceptsEvaluation.ts - Conceptos de Savital para evaluación
// Basado en brief real proporcionado

import type { ProductConcept } from '../services/savitalFocusService';

export const SAVITAL_CONCEPTS: ProductConcept[] = [
  {
    id: 'savital_control_caida',
    name: 'Savital Control Caída desde la Raíz',
    category: 'shampoo',
    target_segment: ['mujeres 25-45', 'problemas caída', 'buscan soluciones científicas'],
    key_benefits: [
      'tecnología clínicamente comprobada',
      'nutrición profunda sábila',
      'poder restaurador péptidos',
      'anclaje pelo cuero cabelludo',
      'reducción caída raíz a puntas'
    ],
    price_range: 'medio-alto', // Asumiendo por tecnología clínica
    format: 'shampoo + acondicionador',
    claims: [
      'Tecnología clínicamente comprobada',
      'Combina sábila + péptidos',
      'Anclaje desde la raíz',
      'Reducción visible de caída'
    ],
    sensory_description: 'Textura cremosa que penetra profundamente, aroma herbal-fresco de sábila con notas suaves, sensación de fortalecimiento inmediato en cuero cabelludo'
  },

  {
    id: 'savital_equilibrio_capilar',
    name: 'Savital Equilibrio Capilar',
    category: 'shampoo',
    target_segment: ['desequilibrios capilares', 'grasa-picazón-resequedad', 'buscan solución completa'],
    key_benefits: [
      'sábila + niacinamida',
      'restaura equilibrio natural',
      'hidratación profunda cuero cabelludo',
      'combate exceso grasa',
      'reduce picazón resequedad',
      'cabello sano raíz-puntas'
    ],
    price_range: 'medio',
    format: 'shampoo uso diario',
    claims: [
      'Única fórmula sábila + niacinamida',
      'Equilibrio completo capilar',
      'Combate múltiples problemas',
      'Hidratación profunda cuero cabelludo'
    ],
    sensory_description: 'Textura ligera que se distribuye uniformemente, aroma equilibrado sábila-vitaminas, sensación de limpieza profunda sin resecar'
  },

  {
    id: 'savital_nutricion_raiz',
    name: 'Savital Nutrición desde la Raíz',
    category: 'shampoo',
    target_segment: ['cabello débil-maltratado', 'buscan fortalecimiento', 'nutrición intensiva'],
    key_benefits: [
      'bomba nutrición capilar',
      'sábila + extracto baobab',
      'alto contenido nutrientes',
      'revitalización fibra capilar',
      'pelo fuerte saludable hermoso'
    ],
    price_range: 'medio',
    format: 'shampoo nutritivo',
    claims: [
      'Bomba de nutrición',
      'Baobab "árbol de la vida"',
      'Nutrición máxima',
      'Revitalización completa'
    ],
    sensory_description: 'Textura rica y nutritiva, aroma natural terroso-dulce del baobab con sábila, sensación de cabello alimentado desde adentro'
  },

  {
    id: 'savital_hidratacion_frizz',
    name: 'Savital Hidratación y Control Frizz',
    category: 'shampoo',
    target_segment: ['cabello encrespado', 'clima húmedo', 'buscan suavidad-control'],
    key_benefits: [
      'poder hidratante sábila',
      'aceite jojoba sella fibra',
      'capa protectora humedad',
      'cabello suave brillante',
      'control efectivo frizz'
    ],
    price_range: 'medio',
    format: 'shampoo anti-frizz',
    claims: [
      'Sábila + aceite de jojoba',
      'Protección contra humedad',
      'Hidratación y sellado simultáneo',
      'Control frizz duradero'
    ],
    sensory_description: 'Textura sedosa que desliza suavemente, aroma fresco-tropical sábila-jojoba, sensación de cabello protegido y manejable'
  },

  {
    id: 'savital_crecimiento_abundante',
    name: 'Savital Crecimiento Abundante',
    category: 'serum',
    target_segment: ['desean cabello largo', 'crecimiento lento', 'buscan abundancia'],
    key_benefits: [
      'romero + biotina + sábila',
      'elixir poderoso concentrado',
      'penetración raíz-puntas',
      'cabello largo abundante',
      'estimulación crecimiento'
    ],
    price_range: 'medio-alto', // Por ser tratamiento concentrado
    format: 'elixir concentrado',
    claims: [
      'Triple fórmula crecimiento',
      'Los 3 mejores ingredientes',
      'Elixir poderoso concentrado',
      'Crecimiento abundante visible'
    ],
    sensory_description: 'Textura ligera de absorción rápida, aroma herbal estimulante romero-sábila, sensación de activación y hormigueo suave en cuero cabelludo'
  }
];

// Configuración para testing sistemático
export const EVALUATION_CONFIG = {
  test_sequence: [
    'savital_control_caida',
    'savital_equilibrio_capilar', 
    'savital_nutricion_raiz',
    'savital_hidratacion_frizz',
    'savital_crecimiento_abundante'
  ],
  
  focus_areas: {
    credibility: ['ingredientes mencionados', 'claims científicos', 'promesas realistas'],
    relevance: ['problems específicos', 'target apropiado', 'contexto cultural'],
    differentiation: ['vs competencia', 'unique selling proposition', 'innovation perception'],
    price_value: ['precio percibido', 'value proposition', 'willingness to pay']
  },

  success_metrics: {
    high_potential: { appeal: 7.5, relevance: 7.0, believability: 7.0, purchase_intention: 6.5 },
    medium_potential: { appeal: 6.0, relevance: 6.0, believability: 6.0, purchase_intention: 5.0 },
    needs_work: { appeal: 5.0, relevance: 5.0, believability: 5.0, purchase_intention: 4.0 }
  }
};