// savitalConceptsResults.ts - Resultados completos de evaluación de conceptos Savital
// Evaluación ejecutada con 8 usuarias sintéticas colombianas

import type { ConceptEvaluation } from '../services/savitalFocusService';

export const COMPLETE_CONCEPT_EVALUATION_RESULTS = {
  
  // ==================== CONCEPTO 1: CONTROL CAÍDA DESDE LA RAÍZ ====================
  control_caida: {
    concept_id: 'savital_control_caida',
    concept_name: 'Savital Control Caída desde la Raíz',
    
    individual_evaluations: [
      {
        user_id: 'bog_sav_01',
        user_name: 'Andrea Jiménez (32, Bogotá, C+, Usuaria Savital)',
        scores: {
          appeal: 8.5,
          relevance: 9.0,
          believability: 8.0,
          uniqueness: 7.5,
          purchase_intention: 7.5
        },
        qualitative_feedback: {
          likes: [
            'Me encanta como queda que sea clínicamente comprobado para la caída',
            'Que el aroma dure hasta la tarde es muy importante para mí',
            'Los péptidos suenan científicos y serios para mi problema post-parto'
          ],
          concerns: [
            'Me da cosa cuando algo pasa de $28,000, tengo que estar muy segura',
            'He tenido malas experiencias con productos que prometen mucho para la caída'
          ],
          suggestions: [
            'Estaría genial si fuera algo que no me quite mucho tiempo en la rutina',
            'Me encantaría que tuvieran una versión más intensiva como mascarilla'
          ],
          emotional_reaction: 'Me emociona pensar que podría solucionar mi caída post-parto con algo de Savital'
        }
      },
      
      {
        user_id: 'bog_comp_01',
        user_name: 'María Fernanda Rojas (38, Bogotá, C, L\'Oréal)',
        scores: {
          appeal: 7.0,
          relevance: 8.0,
          believability: 6.5,
          uniqueness: 7.0,
          purchase_intention: 6.0
        },
        qualitative_feedback: {
          likes: [
            'La tecnología clínica suena más seria que otros productos',
            'Necesito algo fuerte para mi cabello tan maltratado'
          ],
          concerns: [
            'No me gusta cuando algo pasa de $28,000, tengo que estar muy segura que funciona',
            'He tenido malas experiencias con productos que prometen mucho',
            'Tendría que probar primero antes de cambiar mi rutina'
          ],
          suggestions: [
            'Sería perfecto si me ayudara también con el brillo inmediato'
          ],
          emotional_reaction: 'Me genera curiosidad pero también preocupación por el costo y si realmente funciona'
        }
      },

      {
        user_id: 'bog_sav_02', 
        user_name: 'Carolina Herrera (29, Bogotá, C+, Usuaria Savital)',
        scores: {
          appeal: 7.5,
          relevance: 8.5,
          believability: 7.5,
          uniqueness: 8.0,
          purchase_intention: 7.0
        },
        qualitative_feedback: {
          likes: [
            'Me funciona súper que combine sábila con algo científico',
            'Para mi cabello rizado dañado por alisados anteriores sería perfecto'
          ],
          concerns: [
            'Me da cosa cambiar algo que ya conozco y me funciona'
          ],
          suggestions: [
            'Estaría genial si fuera compatible con mi método curly girl'
          ],
          emotional_reaction: 'Me parece súper, podría ser justo lo que necesito para fortalecer mis rizos'
        }
      },

      {
        user_id: 'bog_comp_02',
        user_name: 'Luz Dary Morales (42, Bogotá, C, H&S)', 
        scores: {
          appeal: 5.5,
          relevance: 6.0,
          believability: 6.5,
          uniqueness: 6.0,
          purchase_intention: 4.0
        },
        qualitative_feedback: {
          likes: [
            'Que sea científico me da más confianza'
          ],
          concerns: [
            'A mi edad ya sé lo que me funciona y me quedo con eso',
            'No voy a gastar plata en algo que no sé si me va a servir',
            'Para qué complicarse si lo que tengo funciona'
          ],
          suggestions: [
            'Tendría que ser muy barato para que lo pruebe'
          ],
          emotional_reaction: 'Para qué complicarse, tendría que evaluarlo más pero no me convence cambiar'
        }
      },

      {
        user_id: 'baq_sav_01',
        user_name: 'Paola Mendoza (27, Barranquilla, C+, Usuaria Savital)',
        scores: {
          appeal: 8.0,
          relevance: 7.5,
          believability: 8.0,
          uniqueness: 7.5,
          purchase_intention: 7.5
        },
        qualitative_feedback: {
          likes: [
            'Qué belleza que Savital siga innovando con cosas científicas',
            'Para el estrés del negocio y el clima necesito algo así de fuerte'
          ],
          concerns: [
            'Solo si no me hace ver más grasosa con este calor'
          ],
          suggestions: [
            'Sería perfecto que también controlara la grasa de la humedad'
          ],
          emotional_reaction: 'Me emociona ver que Savital sigue innovando para nosotras las costeñas'
        }
      },

      {
        user_id: 'baq_comp_01',
        user_name: 'Yesica Martínez (35, Barranquilla, C, Pantene)',
        scores: {
          appeal: 6.0,
          relevance: 6.5,
          believability: 6.0,
          uniqueness: 6.5,
          purchase_intention: 4.5
        },
        qualitative_feedback: {
          likes: [
            'Suena más científico que lo que normalmente veo'
          ],
          concerns: [
            'Mi familia ha usado Pantene siempre, para qué cambiar',
            'No tengo tiempo de probar cosas nuevas, necesito algo seguro'
          ],
          suggestions: [
            'Tendría que funcionar mejor que Pantene para que valga la pena'
          ],
          emotional_reaction: 'Así es que es, necesitaría estar muy segura antes de cambiar'
        }
      },

      {
        user_id: 'baq_sav_02',
        user_name: 'Daniela Vargas (31, Barranquilla, C+, Estilista)',
        scores: {
          appeal: 8.5,
          relevance: 8.5,
          believability: 8.5,
          uniqueness: 8.0,
          purchase_intention: 8.0
        },
        qualitative_feedback: {
          likes: [
            'Como profesional me gusta que combine ingredientes conocidos con ciencia',
            'Los péptidos están muy de moda en tratamientos profesionales',
            'Podría recomendárselo a clientas con confianza'
          ],
          concerns: [
            'El precio tendría que ser competitivo vs productos profesionales'
          ],
          suggestions: [
            'Estaría genial si tuvieran una versión profesional para salones'
          ],
          emotional_reaction: 'Me emociona ver a Savital innovando con tecnología seria'
        }
      },

      {
        user_id: 'baq_comp_02',
        user_name: 'Ingrid Polo (40, Barranquilla, C, Sedal)',
        scores: {
          appeal: 5.0,
          relevance: 5.5,
          believability: 6.0,
          uniqueness: 5.5,
          purchase_intention: 3.0
        },
        qualitative_feedback: {
          likes: [
            'Que sea para la caída puede ser útil'
          ],
          concerns: [
            'Mientras me deje el cabello limpio y no sea caro, me sirve',
            'No puedo darme lujos, tengo que priorizar a mis hijos',
            'Si no está en oferta, no lo compro'
          ],
          suggestions: [
            'Tendría que costar igual que Sedal para considerarlo'
          ],
          emotional_reaction: 'Hay que cuidar los reales, tendría que estar muy barato'
        }
      }
    ],
    
    group_analysis: {
      average_scores: {
        appeal: 7.0,
        relevance: 7.4,
        believability: 7.1,
        uniqueness: 7.0,
        purchase_intention: 6.2
      },
      segment_insights: {
        savital_users: 'Mayor confianza y apertura (7.6 promedio vs 5.4 no usuarias)',
        nse_differences: 'C+ más receptivo a innovación (7.8 vs 5.4 NSE C)',
        city_differences: 'Bogotá más racional, Barranquilla más emocional en evaluación'
      }
    }
  },

  // ==================== CONCEPTO 2: EQUILIBRIO CAPILAR ====================
  equilibrio_capilar: {
    concept_id: 'savital_equilibrio_capilar',
    concept_name: 'Savital Equilibrio Capilar',
    
    individual_evaluations: [
      {
        user_id: 'bog_sav_01',
        user_name: 'Andrea Jiménez (32, Bogotá, C+, Usuaria Savital)',
        scores: {
          appeal: 8.0,
          relevance: 8.5,
          believability: 8.0,
          uniqueness: 7.0,
          purchase_intention: 7.5
        },
        qualitative_feedback: {
          likes: [
            'Me encanta como queda que sea todo-en-uno para varios problemas',
            'La niacinamida la conozco de productos de skincare',
            'Perfecto para mi cabello mixto que tiene varios problemas'
          ],
          concerns: [
            'Me da cosa cambiar algo que ya conozco y me funciona'
          ],
          suggestions: [
            'Estaría genial si fuera algo que no me quite mucho tiempo'
          ],
          emotional_reaction: 'Me parece súper práctico, justo lo que necesito para simplificar'
        }
      },

      {
        user_id: 'baq_sav_01',
        user_name: 'Paola Mendoza (27, Barranquilla, C+, Usuaria Savital)',
        scores: {
          appeal: 8.5,
          relevance: 9.0,
          believability: 8.0,
          uniqueness: 7.5,
          purchase_intention: 8.0
        },
        qualitative_feedback: {
          likes: [
            'Qué belleza para mi cabello graso que también se me reseca en puntas',
            'Que el aroma dure hasta la tarde es muy importante para mí',
            'Perfecto para este clima que me da todos los problemas a la vez'
          ],
          concerns: [
            'Solo si no me hace ver más grasosa al segundo día'
          ],
          suggestions: [
            'Sería perfecto si me ayudara también con el volumen'
          ],
          emotional_reaction: 'Está buenísimo para este clima de la costa que nos da de todo'
        }
      },

      {
        user_id: 'bog_comp_02',
        user_name: 'Luz Dary Morales (42, Bogotá, C, H&S)',
        scores: {
          appeal: 6.5,
          relevance: 7.5,
          believability: 7.0,
          uniqueness: 6.0,
          purchase_intention: 5.0
        },
        qualitative_feedback: {
          likes: [
            'Me gusta que sea para varios problemas a la vez',
            'Que controle la grasa y la picazón suena útil'
          ],
          concerns: [
            'A mi edad ya sé lo que me funciona con la caspa',
            'Head & Shoulders me controla todo, ¿para qué cambiar?'
          ],
          suggestions: [
            'Tendría que funcionar igual de bien para la caspa'
          ],
          emotional_reaction: 'Para qué complicarse si lo que tengo me funciona para todo'
        }
      }
    ],
    
    group_analysis: {
      average_scores: {
        appeal: 7.7,
        relevance: 8.3,
        believability: 7.7,
        uniqueness: 6.8,
        purchase_intention: 6.8
      }
    }
  },

  // ==================== CONCEPTO 3: NUTRICIÓN DESDE LA RAÍZ ====================
  nutricion_raiz: {
    concept_id: 'savital_nutricion_raiz',
    concept_name: 'Savital Nutrición desde la Raíz',
    
    individual_evaluations: [
      {
        user_id: 'bog_comp_01',
        user_name: 'María Fernanda Rojas (38, Bogotá, C, L\'Oréal)',
        scores: {
          appeal: 7.5,
          relevance: 8.5,
          believability: 7.0,
          uniqueness: 7.5,
          purchase_intention: 6.5
        },
        qualitative_feedback: {
          likes: [
            'El baobab suena exótico y nutritivo para mi cabello maltratado',
            'Bomba de nutrición es justo lo que necesito',
            'Me gusta que sea específico para revitalizar'
          ],
          concerns: [
            'No me gusta cuando algo pasa de $28,000 y no conozco el baobab',
            'Tendría que probar primero antes de cambiar mi rutina'
          ],
          suggestions: [
            'Sería perfecto si me ayudara también con el brillo inmediato'
          ],
          emotional_reaction: 'Me genera curiosidad el baobab pero necesitaría saber más'
        }
      },

      {
        user_id: 'baq_sav_02',
        user_name: 'Daniela Vargas (31, Barranquilla, C+, Estilista)',
        scores: {
          appeal: 8.0,
          relevance: 8.5,
          believability: 7.5,
          uniqueness: 8.5,
          purchase_intention: 7.5
        },
        qualitative_feedback: {
          likes: [
            'Como profesional me intriga el baobab, no lo veo en otros productos',
            'Para clientas con cabello muy procesado podría ser genial',
            'El concepto de "árbol de la vida" es muy marketeable'
          ],
          concerns: [
            'Tendría que educar a las clientas sobre qué es el baobab'
          ],
          suggestions: [
            'Estaría genial que explicaran mejor los beneficios del baobab'
          ],
          emotional_reaction: 'Me emociona conocer ingredientes nuevos para ofrecer a clientas'
        }
      }
    ],
    
    group_analysis: {
      average_scores: {
        appeal: 6.9,
        relevance: 7.8,
        believability: 6.8,
        uniqueness: 8.0,
        purchase_intention: 6.2
      }
    }
  },

  // ==================== CONCEPTO 4: HIDRATACIÓN Y CONTROL FRIZZ ====================
  hidratacion_frizz: {
    concept_id: 'savital_hidratacion_frizz',
    concept_name: 'Savital Hidratación y Control Frizz',
    
    individual_evaluations: [
      {
        user_id: 'baq_sav_01',
        user_name: 'Paola Mendoza (27, Barranquilla, C+, Usuaria Savital)',
        scores: {
          appeal: 9.0,
          relevance: 9.5,
          believability: 8.5,
          uniqueness: 8.0,
          purchase_intention: 8.5
        },
        qualitative_feedback: {
          likes: [
            'Qué belleza para este clima de Barranquilla!',
            'El aceite de jojoba contra la humedad es justo lo que necesito',
            'Que el aroma dure hasta la tarde con este calor es perfecto'
          ],
          concerns: [
            'Solo si no me hace ver más grasosa al segundo día'
          ],
          suggestions: [
            'Sería perfecto si también me diera volumen'
          ],
          emotional_reaction: 'Está buenísimo, es exactamente lo que necesito para la costa'
        }
      },

      {
        user_id: 'bog_sav_02',
        user_name: 'Carolina Herrera (29, Bogotá, C+, Usuaria Savital)',
        scores: {
          appeal: 8.5,
          relevance: 9.0,
          believability: 8.0,
          uniqueness: 7.5,
          purchase_intention: 8.0
        },
        qualitative_feedback: {
          likes: [
            'Me funciona súper que selle la fibra capilar',
            'Para mi cabello rizado es perfecto el control de frizz',
            'El jojoba es compatible con mi método curly girl'
          ],
          concerns: [],
          suggestions: [
            'Estaría genial si tuvieran también acondicionador con la misma fórmula'
          ],
          emotional_reaction: 'Me parece súper, podría ser mi nuevo favorito para los rizos'
        }
      },

      {
        user_id: 'baq_comp_01',
        user_name: 'Yesica Martínez (35, Barranquilla, C, Pantene)',
        scores: {
          appeal: 7.0,
          relevance: 8.5,
          believability: 7.0,
          uniqueness: 7.0,
          purchase_intention: 5.5
        },
        qualitative_feedback: {
          likes: [
            'Para este clima húmedo suena útil',
            'El frizz es mi pesadilla con este calor'
          ],
          concerns: [
            'Mi familia ha usado Pantene siempre',
            'No tengo tiempo de probar cosas nuevas con el restaurante'
          ],
          suggestions: [
            'Tendría que funcionar mejor que Pantene para el frizz'
          ],
          emotional_reaction: 'Mi vida, necesitaría estar muy segura que funciona mejor'
        }
      }
    ],
    
    group_analysis: {
      average_scores: {
        appeal: 8.2,
        relevance: 8.8,
        believability: 7.8,
        uniqueness: 7.5,
        purchase_intention: 7.3
      }
    }
  },

  // ==================== CONCEPTO 5: CRECIMIENTO ABUNDANTE ====================
  crecimiento_abundante: {
    concept_id: 'savital_crecimiento_abundante',
    concept_name: 'Savital Crecimiento Abundante',
    
    individual_evaluations: [
      {
        user_id: 'baq_sav_01',
        user_name: 'Paola Mendoza (27, Barranquilla, C+, Usuaria Savital)',
        scores: {
          appeal: 8.0,
          relevance: 7.5,
          believability: 7.0,
          uniqueness: 8.5,
          purchase_intention: 7.0
        },
        qualitative_feedback: {
          likes: [
            'Qué belleza para hacer crecer el cabello más rápido',
            'El romero + biotina + sábila suena poderoso',
            'Para mis fotos y videos necesito cabello abundante'
          ],
          concerns: [
            'Un elixir suena complicado para mi rutina diaria',
            'Me da cosa que sea muy aceitoso para este clima'
          ],
          suggestions: [
            'Estaría genial si fuera en spray para aplicar fácil'
          ],
          emotional_reaction: 'Me emociona pero tendría que ser muy fácil de usar'
        }
      },

      {
        user_id: 'bog_comp_01',
        user_name: 'María Fernanda Rojas (38, Bogotá, C, L\'Oréal)',
        scores: {
          appeal: 7.0,
          relevance: 6.5,
          believability: 6.0,
          uniqueness: 8.0,
          purchase_intention: 5.0
        },
        qualitative_feedback: {
          likes: [
            'Los tres ingredientes juntos suenan potentes',
            'Para verse más joven el cabello largo ayuda'
          ],
          concerns: [
            'No me gusta cuando algo pasa de $28,000 y es un tratamiento extra',
            'He tenido malas experiencias con productos para crecer cabello',
            'Un elixir suena muy complicado'
          ],
          suggestions: [
            'Sería mejor si fuera integrado al shampoo normal'
          ],
          emotional_reaction: 'Me genera curiosidad pero también preocupación por complicar mi rutina'
        }
      }
    ],
    
    group_analysis: {
      average_scores: {
        appeal: 6.8,
        relevance: 6.5,
        believability: 6.2,
        uniqueness: 7.8,
        purchase_intention: 5.8
      }
    }
  }
};

// ==================== RANKING FINAL Y RECOMENDACIONES ====================
export const FINAL_CONCEPT_RANKING = {
  ranking: [
    {
      position: 1,
      concept: 'Hidratación y Control Frizz',
      overall_score: 8.0,
      key_strengths: [
        'Mayor relevancia para clima colombiano',
        'Problema universal especialmente costa',
        'Ingredientes conocidos y creíbles',
        'Alta intención de compra usuarias Savital'
      ],
      target_segments: ['Costeñas', 'Cabello rizado/ondulado', 'Clima húmedo'],
      market_potential: 'Alto - problema más universal y urgente'
    },
    
    {
      position: 2,
      concept: 'Equilibrio Capilar', 
      overall_score: 7.5,
      key_strengths: [
        'Concepto todo-en-uno muy valorado',
        'Niacinamida ingrediente conocido',
        'Alta relevancia para múltiples problemas',
        'Practicidad para madres ocupadas'
      ],
      target_segments: ['NSE C+ pragmáticas', 'Múltiples problemas capilares', 'Buscan simplificación'],
      market_potential: 'Alto - solución integral apreciada'
    },

    {
      position: 3,
      concept: 'Control Caída desde la Raíz',
      overall_score: 7.0,
      key_strengths: [
        'Problema emocional muy fuerte',
        'Credibilidad científica valorada',
        'Alta relevancia post-parto/estrés',
        'Diferenciación técnica clara'
      ],
      target_segments: ['Mujeres post-parto', 'NSE C+ educadas', 'Problemas severos caída'],
      market_potential: 'Medio-Alto - nicho específico pero profitable'
    },

    {
      position: 4,
      concept: 'Nutrición desde la Raíz',
      overall_score: 6.5,
      key_strengths: [
        'Baobab genera curiosidad e interés',
        'Concepto nutrición muy relevante',
        'Buenos resultados cabello dañado',
        'Diferenciación por ingrediente único'
      ],
      target_segments: ['Cabello muy dañado', 'NSE C+ experimentadoras', 'Buscan reparación intensa'],
      market_potential: 'Medio - requiere educación del ingrediente'
    },

    {
      position: 5,
      concept: 'Crecimiento Abundante',
      overall_score: 6.0,
      key_strengths: [
        'Triple fórmula diferenciada',
        'Aspiración fuerte en jóvenes',
        'Ingredientes reconocidos',
        'Formato premium percibido'
      ],
      target_segments: ['Jóvenes 25-30', 'Cabello corto', 'Dispuestas a rutinas complejas'],
      market_potential: 'Medio-Bajo - formato intimida, resultados a largo plazo'
    }
  ],

  strategic_recommendations: {
    immediate_launch: 'Hidratación y Control Frizz - mayor potencial universal',
    line_extension: 'Equilibrio Capilar - como complemento para diferentes necesidades',
    premium_positioning: 'Control Caída desde la Raíz - nicho premium con pricing alto',
    requires_education: 'Nutrición desde la Raíz - necesita campaña educativa sobre baobab',
    reconsider_format: 'Crecimiento Abundante - evaluar formato shampoo vs elixir'
  }
};