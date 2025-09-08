// savitalFocusGroup.ts - Usuarias Sintéticas para Evaluación Savital
// Basado en datos reales de investigación Unilever Colombia

export interface SavitalFocusUser {
  // === INFORMACIÓN BÁSICA ===
  id: string;
  name: string;
  age: number;
  city: 'Bogotá' | 'Barranquilla';
  nse: 'C+' | 'C';
  occupation: string;
  family_composition: string;
  monthly_income: number; // COP
  
  // === PERFIL CAPILAR DETALLADO ===
  hair_profile: {
    hair_type: string;
    main_concerns: string[];
    washing_frequency: string;
    styling_routine: string;
    hair_damage_level: 'bajo' | 'medio' | 'alto';
    chemical_treatments: string[];
  };
  
  // === RELACIÓN CON SAVITAL (datos reales estudio) ===
  savital_relationship: {
    is_user: boolean;
    awareness: number; // % del 26% top-of-mind
    trial_status: 'never-tried' | 'tried-once' | 'regular-user' | 'loyal-user';
    usage_frequency: string;
    satisfaction_score: number; // 1-10
    repurchase_intention: number; // % del 99% recompra
    key_benefits_perceived: string[];
    brand_associations: string[];
    emotional_connection: number; // 1-10
  };
  
  // === COMPORTAMIENTO CON COMPETENCIA ===
  competitive_behavior: {
    current_brand: string;
    brand_history: string[];
    switching_drivers: string[];
    loyalty_factors: string[];
    consideration_set: string[];
    brand_perceptions: {
      [brand: string]: {
        awareness: number;
        trial: number;
        preference: number;
        strengths: string[];
        weaknesses: string[];
      };
    };
  };
  
  // === CUSTOMER JOURNEY REAL ===
  purchase_journey: {
    decision_maker: 'self' | 'influenced' | 'family'; // 85% decisión individual
    purchase_frequency: string;
    channel_preference: string[];
    price_sensitivity: number; // 1-10
    promotion_response: string;
    trial_barriers: string[];
    satisfaction_drivers: string[];
  };
  
  // === INSIGHTS PSICOGRÁFICOS (del estudio) ===
  psychographics: {
    life_priorities: string[];
    beauty_philosophy: string;
    innovation_attitude: 'early-adopter' | 'mainstream' | 'laggard';
    risk_tolerance: 'high' | 'medium' | 'low';
    brand_relationship_style: string;
    influence_sources: string[];
    aspirations: string[];
    frustrations: string[];
  };

  // === INSIGHTS ETNOGRÁFICOS PROFUNDOS ===
  ethnographic_profile: {
    // Rituales auténticos de cuidado capilar
    hair_rituals: {
      washing_ritual: string; // Descripción detallada del proceso real
      styling_process: string; // Cómo realmente se arregla el cabello
      time_investment: string; // Tiempo real dedicado vs aspiracional
      seasonal_adaptations: string; // Cómo cambia por clima/época
      special_occasions: string; // Rutina para eventos importantes
    };
    
    // Momentos emocionales de verdad
    emotional_triggers: {
      satisfaction_moments: string[]; // Cuándo se siente realmente bien con su cabello
      frustration_points: string[]; // Momentos específicos de frustración
      confidence_boosters: string[]; // Qué la hace sentir segura de su cabello
      anxiety_sources: string[]; // Qué la preocupa sobre su cabello/apariencia
      pride_points: string[]; // De qué se siente orgullosa respecto a su cabello
    };
    
    // Relación auténtica con el dinero
    money_psychology: {
      spending_philosophy: string; // Filosofía real sobre gasto en belleza
      price_anchors: { [product: string]: number }; // Precios que considera normales/caros
      guilt_triggers: string[]; // Qué la hace sentir culpable al comprar
      investment_justifications: string[]; // Cómo justifica gastos en belleza
      budget_constraints: string; // Limitaciones reales de presupuesto
      value_equation: string; // Qué considera "que vale la pena"
    };
    
    // Aspiraciones vs realidades matizadas
    aspiration_reality_gap: {
      dream_routine: string; // Rutina de cabello que sueña tener
      reality_constraints: string[]; // Por qué no puede tener esa rutina
      compromise_solutions: string[]; // Cómo adapta sus aspiraciones
      small_indulgences: string[]; // Pequeños lujos que se permite
      future_goals: string; // Qué espera cuando tenga más tiempo/dinero
    };
    
    // Identidad y cabello (relación profunda)
    identity_relationship: {
      hair_personality_connection: string; // Cómo ve su cabello como extensión de sí
      professional_image_needs: string; // Qué necesita proyectar en el trabajo
      social_context_awareness: string; // Cómo se ve vs otros en su entorno
      cultural_heritage_influence: string; // Influencia de tradiciones familiares/regionales
      life_stage_expression: string; // Cómo su edad/etapa influye en decisiones
      authenticity_vs_conformity: string; // Lucha entre ser auténtica vs encajar
    };
    
    // Barreras psicológicas específicas
    change_barriers: {
      risk_aversion_sources: string[]; // Por qué le da miedo cambiar
      comfort_zone_definition: string; // Qué considera "seguro"
      past_disappointments: string[]; // Experiencias que la hacen cautelosa
      peer_pressure_dynamics: string; // Cómo la influencia social afecta decisiones
      decision_making_process: string; // Cómo realmente toma decisiones de compra
    };
    
    // Lenguaje auténtico contextual
    authentic_language: {
      hair_vocabulary: string[]; // Cómo realmente habla sobre el cabello
      complaint_expressions: string[]; // Cómo expresa frustraciones
      satisfaction_expressions: string[]; // Cómo expresa contentamiento
      recommendation_language: string[]; // Cómo recomienda productos a otras
      cultural_expressions: string[]; // Modismos regionales específicos
      generation_markers: string[]; // Expresiones que revelan su edad/generación
    };
  };
  
  // === QUOTES REALES (inspiradas en el estudio) ===
  typical_quotes: string[];
  
  // === CONTEXTO REGIONAL ===
  regional_context: {
    climate_impact: string;
    cultural_beauty_norms: string[];
    local_expressions: string[];
    social_influences: string[];
  };
}

export const SAVITAL_FOCUS_GROUP: SavitalFocusUser[] = [
  // ==================== GRUPO BOGOTÁ ====================
  {
    id: 'bog_sav_01',
    name: 'Andrea Jiménez Morales',
    age: 32,
    city: 'Bogotá',
    nse: 'C+',
    occupation: 'Coordinadora de Marketing Digital',
    family_composition: 'Casada, 1 hijo de 4 años',
    monthly_income: 3200000,
    
    hair_profile: {
      hair_type: 'Mixto (graso en raíz, seco en puntas)',
      main_concerns: ['caspa ocasional', 'caída post-parto', 'falta de tiempo'],
      washing_frequency: 'Cada 2 días (lunes, miércoles, viernes)',
      styling_routine: 'Secado natural + aceite en puntas. Plancha 1 vez/semana',
      hair_damage_level: 'medio',
      chemical_treatments: ['tinte cada 3 meses', 'alisado hace 1 año']
    },
    
    savital_relationship: {
      is_user: true,
      awareness: 95, // Alta, dentro del 26% top-of-mind
      trial_status: 'loyal-user',
      usage_frequency: '3 veces por semana hace 8 meses',
      satisfaction_score: 8,
      repurchase_intention: 95, // Alta lealtad del 99%
      key_benefits_perceived: ['aroma duradero', 'precio justo', 'disponibilidad'],
      brand_associations: ['confiable', 'familiar', 'colombiano', 'efectivo'],
      emotional_connection: 7
    },
    
    competitive_behavior: {
      current_brand: 'Savital Keratina',
      brand_history: ['Pantene (adolescencia)', 'L\'Oréal Elvive (20s)', 'Head & Shoulders (caspa)', 'Savital (actual)'],
      switching_drivers: ['precio', 'recomendación cuñada', 'problema específico'],
      loyalty_factors: ['resultados consistentes', 'precio estable', 'aroma característico'],
      consideration_set: ['Savital', 'Pantene', 'Sedal'],
      brand_perceptions: {
        'Savital': { awareness: 95, trial: 90, preference: 85, strengths: ['aroma', 'precio', 'eficacia'], weaknesses: ['packaging básico'] },
        'Pantene': { awareness: 85, trial: 70, preference: 40, strengths: ['marca reconocida'], weaknesses: ['precio alto', 'no diferenciado'] },
        'Head & Shoulders': { awareness: 90, trial: 60, preference: 30, strengths: ['anticaspa'], weaknesses: ['muy medicinal', 'solo para problema'] }
      }
    },
    
    purchase_journey: {
      decision_maker: 'self',
      purchase_frequency: 'Cada 6-8 semanas',
      channel_preference: ['supermercado grande', 'farmacia', 'online ocasional'],
      price_sensitivity: 6, // Moderada
      promotion_response: 'Compra 2x1 si necesita stock',
      trial_barriers: ['desconfianza cambio', 'tiempo de evaluar'],
      satisfaction_drivers: ['aroma al día siguiente', 'sensación limpieza', 'manejabilidad']
    },
    
    psychographics: {
      life_priorities: ['familia', 'carrera', 'eficiencia', 'bienestar'],
      beauty_philosophy: 'Natural con toques de arreglo. Busco que me simplifique la vida',
      innovation_attitude: 'mainstream',
      risk_tolerance: 'medium',
      brand_relationship_style: 'Leal pero pragmática. Si funciona, lo sigo',
      influence_sources: ['familia', 'amigas cercanas', 'reviews online'],
      aspirations: ['cabello más fuerte', 'rutina más simple', 'verse bien sin esfuerzo'],
      frustrations: ['poco tiempo personal', 'cabello sin vida', 'productos que prometen mucho']
    },
    
    ethnographic_profile: {
      hair_rituals: {
        washing_ritual: 'Lunes, miércoles y viernes a las 6AM antes de que se levante el niño. Agua tibia, masaje suave 2 minutos en cuero cabelludo pensando en el día, enjuague completo. Es su momento de tranquilidad.',
        styling_process: 'Toalla de microfibra para secar, desenreda húmedo, aceite de coco en medios a puntas, secado natural mientras desayuna. Plancha solo viernes o eventos.',
        time_investment: 'Real: 15 minutos diarios. Aspiracional: 45 minutos con mascarillas y tratamientos especiales',
        seasonal_adaptations: 'Invierno bogotano: más aceite, menos lavado. Época de lluvia: shampoo seco entre lavados. Vacaciones: rutina relajada.',
        special_occasions: 'Plancha + serum + spray fijador. Se levanta 30 minutos más temprano. "Es mi pequeño ritual de autocuidado para sentirme poderosa"'
      },
      
      emotional_triggers: {
        satisfaction_moments: ['Cuando el aroma persiste hasta la tarde', 'Cuando clientes notan su cabello bien arreglado', 'Cuando su hijo dice "mamá hueles rico"', 'Lunes por la mañana con cabello fresco'],
        frustration_points: ['Domingo noche con cabello graso sabiendo que debe lavarlo', 'Reuniones importantes con cabello sin vida', 'Cuando llueve y se arruina el peinado', 'No tener 5 minutos extra para aceite'],
        confidence_boosters: ['Aroma característico de Savital que la identifica', 'Cabello limpio y suelto los lunes', 'Cuando su peluquera dice "tu cabello huele siempre rico"', 'Sensación de frescura al tocarse el cabello'],
        anxiety_sources: ['Canas prematuras que aparecen', 'Caída post-parto que continúa', 'Presión de verse impecable en el trabajo', 'Compararse con mamás más jóvenes del colegio'],
        pride_points: ['Haber encontrado "su" shampoo que funciona', 'Rutina eficiente que le permite tiempo familiar', 'Aroma que se volvió su "firma personal"', 'Cabello que aguanta su vida acelerada']
      },
      
      money_psychology: {
        spending_philosophy: 'Invierto en lo que sé que funciona. Prefiero un producto que rindin bueno que tres baratos que no sirvan',
        price_anchors: { 'shampoo_familiar': 18000, 'shampoo_premium': 28000, 'tratamiento_especial': 45000, 'plancha_buena': 180000 },
        guilt_triggers: ['Gastar en productos que no usa', 'Comprar por impulso sin necesitar', 'Pagar más cuando el básico funciona igual'],
        investment_justifications: ['Es para mi trabajo', 'Me ahorra tiempo en las mañanas', 'Si funciona, vale la pena', 'Mi imagen profesional lo requiere'],
        budget_constraints: 'Máximo $50,000 mensuales en cuidado personal. Prioriza: hijo, hogar, ella',
        value_equation: 'Resultado consistente + duración + no complicar la rutina = vale la pena'
      },
      
      aspiration_reality_gap: {
        dream_routine: 'Mascarilla semanal, aceites especializados, brushing cada 3 días, tratamientos de salón mensuales, cabello siempre perfecto',
        reality_constraints: ['Tiempo limitado con hijo pequeño', 'Presupuesto familiar ajustado', 'Cansancio después del trabajo', 'Horarios impredecibles'],
        compromise_solutions: ['Aceite casero en lugar de tratamientos caros', 'Plancha casera vs brushing profesional', 'Savital confiable vs experimentar marcas caras'],
        small_indulgences: ['Aceite de coco orgánico los domingos', 'Shampoo seco premium cuando está en oferta', 'Corte y color cada 4 meses en su peluquería de confianza'],
        future_goals: 'Cuando el niño crezca: retomar mascarillas semanales, probar líneas premium, tiempo para cuidarse sin culpa'
      },
      
      identity_relationship: {
        hair_personality_connection: 'Mi cabello refleja mi personalidad: práctico pero cuidado, sencillo pero con carácter. El aroma de Savital se volvió mi firma',
        professional_image_needs: 'Cabello limpio, arreglado, que proyecte organización y confiabilidad. Ni muy elaborado ni descuidado',
        social_context_awareness: 'En el trabajo debe verse profesional, en el colegio del niño competente, en familia relajada pero cuidada',
        cultural_heritage_influence: 'Su mamá le enseñó que "el cabello limpio es lo más importante". Tradición costeña del padre: "que siempre huela rico"',
        life_stage_expression: 'Maternidad consciente: prioriza practicidad pero mantiene feminidad. No quiere verse como "señora descuidada"',
        authenticity_vs_conformity: 'Auténtica en su sencillez, pero se adapta a contextos. "Soy natural pero arreglada, esa soy yo"'
      },
      
      change_barriers: {
        risk_aversion_sources: ['Miedo a que nuevo producto no funcione', 'Experiencia con L\'Oréal que resecó su cabello', 'Presión de tiempo para evaluar'],
        comfort_zone_definition: 'Productos conocidos, rutina establecida, resultados predecibles, marcas con trayectoria',
        past_disappointments: ['Shampoo "milagroso" que no cumplió promesas', 'Producto caro que no dio mejores resultados', 'Cambio que complicó su rutina'],
        peer_pressure_dynamics: 'Influenciada por cuñada (quien le recomendó Savital), resistente a presión de colegas por productos caros',
        decision_making_process: 'Investigación básica online + consulta con personas de confianza + prueba pequeña + evaluación de 3 semanas'
      },
      
      authentic_language: {
        hair_vocabulary: ['cabello graso', 'sin vida', 'con cuerpo', 'que huele rico', 'manejable', 'que aguante el día'],
        complaint_expressions: ['Se me ve grasoso', 'No me rinde', 'Se me enreda mucho', 'No aguanta nada'],
        satisfaction_expressions: ['Me encanta como queda', 'Huele divino', 'Me funciona súper', 'Aguanta todo el día'],
        recommendation_language: ['Te recomiendo que pruebes...', 'A mí me funcionó', 'Es bueno y no es caro', 'Vale la pena'],
        cultural_expressions: ['Qué bacano', 'Me parece súper', 'Está chevere', 'Me queda divino'],
        generation_markers: ['Está cool', 'Me parece genial', 'Súper práctico', 'Vale la pena']
      }
    },

    typical_quotes: [
      'Necesito algo que funcione y no me complique la mañana',
      'El aroma de Savital me gusta, se siente fresco pero no artificial',
      'He probado muchas marcas pero siempre vuelvo a lo que conozco',
      'Con un niño pequeño no tengo tiempo para rutinas complicadas',
      'Si me da resultado y no es carísimo, perfecto'
    ],
    
    regional_context: {
      climate_impact: 'Bogotá: clima seco afecta cuero cabelludo, necesita hidratación',
      cultural_beauty_norms: ['cabello limpio y arreglado', 'naturalidad preferible', 'practicidad valorada'],
      local_expressions: ['Qué bacano', 'Me parece súper', 'Está chevere'],
      social_influences: ['mamás del colegio', 'compañeras trabajo', 'familia paterna (costeña)']
    }
  },
  
  {
    id: 'bog_comp_01',
    name: 'María Fernanda Rojas Castro',
    age: 38,
    city: 'Bogotá',
    nse: 'C',
    occupation: 'Contadora independiente - trabajos por horas',
    family_composition: 'Separada, 2 hijos (12 y 8 años)',
    monthly_income: 2400000,
    
    hair_profile: {
      hair_type: 'Ondulado, teñido rubio cenizo',
      main_concerns: ['canas (40%)', 'sequedad por tinte', 'falta de brillo'],
      washing_frequency: 'Diario (por trabajo con clientes)',
      styling_routine: 'Secado con diffusor + crema peinar + spray protector',
      hair_damage_level: 'alto',
      chemical_treatments: ['tinte cada 6 semanas', 'keratina hace 8 meses', 'mechas desde hace 3 años']
    },
    
    savital_relationship: {
      is_user: false,
      awareness: 85, // Conoce pero no es top-of-mind personal
      trial_status: 'tried-once',
      usage_frequency: 'Probó hace 2 años por 1 mes',
      satisfaction_score: 6,
      repurchase_intention: 30, // Prefiere otras opciones
      key_benefits_perceived: ['precio', 'disponibilidad'],
      brand_associations: ['básico', 'común', 'para cabello normal'],
      emotional_connection: 4
    },
    
    competitive_behavior: {
      current_brand: 'L\'Oréal Elvive Reparación Total 5',
      brand_history: ['Sedal (juventud)', 'Pantene Pro-V (embarazos)', 'Savital (prueba)', 'L\'Oréal (actual)'],
      switching_drivers: ['cabello dañado necesita más', 'aspiración marca premium', 'recomendación peluquera'],
      loyalty_factors: ['resultados visibles', 'sensación premium', 'status percibido'],
      consideration_set: ['L\'Oréal Elvive', 'Pantene', 'TRESemmé'],
      brand_perceptions: {
        'Savital': { awareness: 85, trial: 40, preference: 25, strengths: ['precio'], weaknesses: ['muy básico', 'no para cabello dañado'] },
        'L\'Oréal': { awareness: 90, trial: 80, preference: 75, strengths: ['calidad', 'tecnología', 'resultados'], weaknesses: ['precio alto'] },
        'Pantene': { awareness: 95, trial: 85, preference: 60, strengths: ['conocida', 'disponible'], weaknesses: ['pesado para cabello graso'] }
      }
    },
    
    purchase_journey: {
      decision_maker: 'self',
      purchase_frequency: 'Cada 4-5 semanas',
      channel_preference: ['supermercado', 'droguería barrio', 'promociones online'],
      price_sensitivity: 8, // Alta, pero dispuesta a pagar por calidad
      promotion_response: 'Muy sensible a ofertas, compra stock en descuento',
      trial_barriers: ['miedo a dañar más el cabello', 'costo de prueba', 'tiempo ver resultados'],
      satisfaction_drivers: ['brillo inmediato', 'suavidad al tacto', 'reducción frizz']
    },
    
    psychographics: {
      life_priorities: ['estabilidad económica', 'hijos', 'verse bien profesionalmente', 'independencia'],
      beauty_philosophy: 'El cabello es mi carta de presentación. Vale la pena invertir un poco más',
      innovation_attitude: 'mainstream',
      risk_tolerance: 'low',
      brand_relationship_style: 'Busco calidad-precio. Si algo funciona bien, me quedo',
      influence_sources: ['peluquera', 'amigas profesionales', 'internet/YouTube'],
      aspirations: ['cabello como de comercial', 'verse más joven', 'productos que realmente funcionen'],
      frustrations: ['presupuesto limitado', 'cabello muy dañado', 'promesas que no cumplen']
    },
    
    typical_quotes: [
      'Necesito algo que realmente repare, no solo que huela rico',
      'Savital es bueno pero mi cabello necesita más cuidado',
      'Prefiero gastar un poquito más y que me dure',
      'Mi peluquera me dice que use productos de calidad',
      'Con todo lo que me hago al cabello, necesito algo más fuerte'
    ],
    
    regional_context: {
      climate_impact: 'Bogotá: aire seco empeora daño del tinte, necesita hidratación extra',
      cultural_beauty_norms: ['verse profesional', 'cabello arreglado es importante', 'inversión en belleza valorada'],
      local_expressions: ['Me queda divino', 'Vale la pena', 'Se ve súper'],
      social_influences: ['peluquería del barrio', 'clientas (referencias profesionales)', 'redes sociales']
    }
  },
  
  {
    id: 'bog_sav_02',
    name: 'Carolina Herrera Pinzón',
    age: 29,
    city: 'Bogotá',
    nse: 'C+',
    occupation: 'Enfermera jefe UCI - Clínica privada',
    family_composition: 'Soltera, vive con roomie',
    monthly_income: 3800000,
    
    hair_profile: {
      hair_type: 'Rizado 3A, densidad media',
      main_concerns: ['definición rizos', 'sequedad', 'encrespamiento'],
      washing_frequency: 'Cada 3 días (co-washing intermedio)',
      styling_routine: 'Método curly girl: gel + difusor + plopping nocturno',
      hair_damage_level: 'medio',
      chemical_treatments: ['alisados previos (dejó hace 2 años)', 'sin químicos actuales']
    },
    
    savital_relationship: {
      is_user: true,
      awareness: 90,
      trial_status: 'regular-user',
      usage_frequency: '2 veces por semana hace 10 meses',
      satisfaction_score: 7,
      repurchase_intention: 85,
      key_benefits_perceived: ['limpia sin resecar', 'precio accesible', 'no tiene sulfatos agresivos'],
      brand_associations: ['confiable', 'suave', 'básico pero efectivo'],
      emotional_connection: 6
    },
    
    competitive_behavior: {
      current_brand: 'Savital Hidratación + productos curly especializados',
      brand_history: ['Pantene (teen)', 'productos alisadores (20s)', 'transición natural', 'Savital + curly brands'],
      switching_drivers: ['transición cabello natural', 'precio vs beneficio', 'disponibilidad'],
      loyalty_factors: ['no daña el rizo', 'precio justo', 'fácil de conseguir'],
      consideration_set: ['Savital', 'Shea Moisture', 'Cantu', 'productos naturales'],
      brand_perceptions: {
        'Savital': { awareness: 90, trial: 85, preference: 70, strengths: ['suave', 'precio', 'disponible'], weaknesses: ['no específico para rizos'] },
        'Shea Moisture': { awareness: 70, trial: 60, preference: 80, strengths: ['específico rizos', 'natural'], weaknesses: ['costoso', 'difícil encontrar'] },
        'Pantene': { awareness: 95, trial: 90, preference: 30, strengths: ['conocido'], weaknesses: ['daña el rizo', 'sulfatos'] }
      }
    },
    
    purchase_journey: {
      decision_maker: 'self',
      purchase_frequency: 'Cada 6 semanas',
      channel_preference: ['supermercado', 'tiendas naturales online', 'importados'],
      price_sensitivity: 5, // Moderada-baja, prioriza función
      promotion_response: 'Aprovecha ofertas para probar nuevos productos',
      trial_barriers: ['miedo a dañar progreso rizo', 'tiempo de adaptación'],
      satisfaction_drivers: ['definición sin crunch', 'hidratación sin peso', 'durabilidad del peinado']
    },
    
    psychographics: {
      life_priorities: ['carrera profesional', 'autoaceptación', 'wellness', 'eficiencia'],
      beauty_philosophy: 'Naturalidad ante todo. Mi cabello rizado es parte de mi identidad',
      innovation_attitude: 'early-adopter',
      risk_tolerance: 'high',
      brand_relationship_style: 'Experimental pero con base sólida. Pruebo pero tengo mis favoritos',
      influence_sources: ['comunidad curly online', 'Instagram', 'compañeras de trabajo'],
      aspirations: ['rizos definidos naturalmente', 'routine simple pero efectiva', 'inspirar otras a aceptar su cabello'],
      frustrations: ['falta productos específicos en Colombia', 'tiempo que toma la rutina', 'días de cabello malo']
    },
    
    typical_quotes: [
      'Desde que acepté mis rizos, Savital ha sido mi base confiable',
      'No necesito el producto más caro, necesito que funcione para mi tipo de cabello',
      'He aprendido que menos es más, pero tiene que ser lo correcto',
      'Me gusta poder encontrar fácilmente lo que uso, sin complicarme',
      'Mi cabello rizado es hermoso, solo necesita productos que lo entiendan'
    ],
    
    regional_context: {
      climate_impact: 'Bogotá: clima seco puede crear más frizz, necesita hidratación constante',
      cultural_beauty_norms: ['aceptación creciente cabello natural', 'profesionalismo compatible con rizos'],
      local_expressions: ['Está divino', 'Me funciona súper', 'Qué ricura'],
      social_influences: ['comunidades curly online', 'movimiento pelo natural', 'compañeras del hospital']
    }
  },
  
  {
    id: 'bog_comp_02',
    name: 'Luz Dary Morales Jiménez',
    age: 42,
    city: 'Bogotá',
    nse: 'C',
    occupation: 'Docente bachillerato - Colegio distrital',
    family_composition: 'Divorciada, 1 hijo universitario (19 años)',
    monthly_income: 2800000,
    
    hair_profile: {
      hair_type: 'Liso, fino, con tendencia grasa en raíz',
      main_concerns: ['canas (60%)', 'falta volumen', 'caspa esporádica'],
      washing_frequency: 'Cada 2 días',
      styling_routine: 'Secado natural + mousse volumen + spray textural ocasional',
      hair_damage_level: 'bajo',
      chemical_treatments: ['tinte casero cada 6 semanas', 'no otros procesos']
    },
    
    savital_relationship: {
      is_user: false,
      awareness: 80,
      trial_status: 'never-tried',
      usage_frequency: 'N/A',
      satisfaction_score: 0,
      repurchase_intention: 20,
      key_benefits_perceived: ['marca conocida', 'precio razonable'],
      brand_associations: ['común', 'para gente joven', 'básico'],
      emotional_connection: 2
    },
    
    competitive_behavior: {
      current_brand: 'Head & Shoulders Classic + alternando con Sedal',
      brand_history: ['Johnson\'s (juventud)', 'Pantene (matrimonio)', 'Head & Shoulders (problema caspa)', 'Sedal (alternativa)'],
      switching_drivers: ['caspa recurrente', 'recomendación médica', 'precio'],
      loyalty_factors: ['efectividad comprobada', 'confianza médica', 'disponibilidad'],
      consideration_set: ['Head & Shoulders', 'Sedal', 'Pantene'],
      brand_perceptions: {
        'Head & Shoulders': { awareness: 95, trial: 90, preference: 75, strengths: ['anticaspa efectivo', 'recomendado'], weaknesses: ['reseca un poco'] },
        'Sedal': { awareness: 90, trial: 70, preference: 50, strengths: ['suave', 'precio'], weaknesses: ['no soluciona caspa'] },
        'Savital': { awareness: 80, trial: 0, preference: 20, strengths: ['conocido'], weaknesses: ['no sé si funciona para mi edad'] }
      }
    },
    
    purchase_journey: {
      decision_maker: 'self',
      purchase_frequency: 'Cada 6-8 semanas',
      channel_preference: ['supermercado barrio', 'droguería', 'tienda cerca colegio'],
      price_sensitivity: 9, // Muy alta
      promotion_response: 'Solo compra en oferta o promoción',
      trial_barriers: ['costo', 'miedo que no funcione para su problema', 'satisfecha con actual'],
      satisfaction_drivers: ['control caspa', 'sensación limpieza duradera', 'no irritación']
    },
    
    psychographics: {
      life_priorities: ['estabilidad económica', 'educación hijo', 'salud', 'tranquilidad'],
      beauty_philosophy: 'Práctico y funcional. No necesito lujos, necesito que funcione',
      innovation_attitude: 'laggard',
      risk_tolerance: 'low',
      brand_relationship_style: 'Muy conservadora. Si algo funciona, no lo cambio',
      influence_sources: ['médico', 'farmaceuta', 'hermanas', 'experiencia personal'],
      aspirations: ['cabello sano', 'verse digna', 'productos que no fallen'],
      frustrations: ['precios que suben', 'productos que prometen y no cumplen', 'cambios de fórmula']
    },
    
    typical_quotes: [
      'A mi edad ya sé lo que me funciona y me quedo con eso',
      'No voy a gastar plata en algo que no sé si me va a servir',
      'Head & Shoulders me controla la caspa, ¿para qué cambiar?',
      'Los productos de ahora prometen mucho pero cuestan muy caro',
      'Prefiero algo que sea efectivo aunque no sea lo más novedoso'
    ],
    
    regional_context: {
      climate_impact: 'Bogotá: cambios de clima pueden activar caspa, necesita producto constante',
      cultural_beauty_norms: ['verse respetable', 'cuidado básico pero efectivo', 'no ostentar'],
      local_expressions: ['Eso me sirve', 'Para qué complicarse', 'Está bien así'],
      social_influences: ['compañeras docentes', 'familia tradicional', 'recomendaciones médicas']
    }
  },
  
  // ==================== GRUPO BARRANQUILLA ====================
  {
    id: 'baq_sav_01',
    name: 'Paola Mendoza Martínez',
    age: 27,
    city: 'Barranquilla',
    nse: 'C+',
    occupation: 'Vendedora boutique y redes sociales',
    family_composition: 'Soltera, vive con padres y hermana',
    monthly_income: 2900000,
    
    hair_profile: {
      hair_type: 'Liso, graso por clima húmedo',
      main_concerns: ['grasa excesiva', 'falta volumen', 'sudoración'],
      washing_frequency: 'Diario (obligatorio por clima)',
      styling_routine: 'Shampoo seco entre lavadas + plancha + productos anti-frizz',
      hair_damage_level: 'medio',
      chemical_treatments: ['balayage cada 4 meses', 'tratamientos botox capilar']
    },
    
    savital_relationship: {
      is_user: true,
      awareness: 95,
      trial_status: 'loyal-user',
      usage_frequency: 'Diario hace 1.5 años',
      satisfaction_score: 8,
      repurchase_intention: 90,
      key_benefits_perceived: ['controla grasa', 'aroma tropical duradero', 'precio justo', 'disponible en la costa'],
      brand_associations: ['costeño', 'fresco', 'tropical', 'efectivo para el clima'],
      emotional_connection: 8
    },
    
    competitive_behavior: {
      current_brand: 'Savital Brillo + shampoo seco complementario',
      brand_history: ['Pantene (teen)', 'productos importados (experimentación)', 'Savital (estabilidad)'],
      switching_drivers: ['adaptación al clima costeño', 'recomendación familia', 'resultados evidentes'],
      loyalty_factors: ['perfecto para clima húmedo', 'aroma que encanta', 'precio estable'],
      consideration_set: ['Savital', 'Head & Shoulders', 'productos importados especiales'],
      brand_perceptions: {
        'Savital': { awareness: 95, trial: 90, preference: 85, strengths: ['aroma', 'control grasa', 'costeño'], weaknesses: ['packaging podría ser más moderno'] },
        'Head & Shoulders': { awareness: 85, trial: 60, preference: 40, strengths: ['control grasa'], weaknesses: ['muy fuerte', 'aroma medicinal'] },
        'Pantene': { awareness: 90, trial: 80, preference: 35, strengths: ['marca conocida'], weaknesses: ['pesado para clima húmedo'] }
      }
    },
    
    purchase_journey: {
      decision_maker: 'self',
      purchase_frequency: 'Cada 3-4 semanas',
      channel_preference: ['supermercado', 'perfumerías centro', 'compras online'],
      price_sensitivity: 6,
      promotion_response: 'Aprovecha promociones para stock, comparte con seguidores',
      trial_barriers: ['satisfecha con Savital', 'miedo que otros no funcionen en clima húmedo'],
      satisfaction_drivers: ['cabello sin grasa hasta la tarde', 'aroma que perdura', 'facilidad de peinado']
    },
    
    psychographics: {
      life_priorities: ['imagen personal', 'redes sociales', 'trabajo', 'diversión', 'familia'],
      beauty_philosophy: 'Mi imagen es mi negocio. Necesito verme perfecta siempre, especialmente con este clima',
      innovation_attitude: 'early-adopter',
      risk_tolerance: 'high',
      brand_relationship_style: 'Leal pero siempre explorando. Si algo mejor aparece, lo pruebo',
      influence_sources: ['influencers', 'clientas boutique', 'amigas', 'redes sociales'],
      aspirations: ['cabello perfecto siempre', 'ser influencer reconocida', 'productos que funcionen en cualquier clima'],
      frustrations: ['clima húmedo arruina peinado', 'productos que no duran', 'sudoración excesiva']
    },
    
    typical_quotes: [
      'Con este calor de Barranquilla, Savital es lo único que me funciona',
      'Me encanta que huela rico todo el día, mis clientas siempre me preguntan qué uso',
      'He probado de todo pero siempre vuelvo a Savital, es perfecto para la costa',
      'Necesito algo que aguante el sudor y la humedad sin verse grasoso',
      'Mi cabello tiene que verse espectacular para las fotos y los lives'
    ],
    
    regional_context: {
      climate_impact: 'Barranquilla: humedad 80%+ requiere control grasa superior y duración',
      cultural_beauty_norms: ['imagen impecable valorada', 'cabello arreglado obligatorio', 'influencia caribeña'],
      local_expressions: ['Qué belleza', 'Está buenísimo', 'Mi amor', 'Mamacita'],
      social_influences: ['cultura costeña', 'redes sociales', 'competencia boutiques', 'clientas']
    }
  },
  
  {
    id: 'baq_comp_01',
    name: 'Yesica Martínez Polo',
    age: 35,
    city: 'Barranquilla',
    nse: 'C',
    occupation: 'Propietaria restaurante familiar',
    family_composition: 'Casada, 3 hijos (14, 11, 7 años)',
    monthly_income: 3500000, // variable por negocio
    
    hair_profile: {
      hair_type: 'Ondulado, maltratado por calor y trabajo',
      main_concerns: ['sequedad extrema', 'rotura', 'tiempo limitado para cuidado'],
      washing_frequency: 'Cada 2-3 días cuando puede',
      styling_routine: 'Recogido siempre por trabajo, aceite ocasional',
      hair_damage_level: 'alto',
      chemical_treatments: ['alisados esporádicos', 'tintes caseros cada 4 meses']
    },
    
    savital_relationship: {
      is_user: false,
      awareness: 75,
      trial_status: 'never-tried',
      usage_frequency: 'N/A',
      satisfaction_score: 0,
      repurchase_intention: 25,
      key_benefits_perceived: ['precio', 'disponibilidad'],
      brand_associations: ['común', 'para cabello normal', 'jóvenes'],
      emotional_connection: 3
    },
    
    competitive_behavior: {
      current_brand: 'Pantene Pro-V Reparación (tradición familiar)',
      brand_history: ['Pantene (siempre)', 'Head & Shoulders (prueba)', 'vuelta a Pantene'],
      switching_drivers: ['tradición familiar', 'confianza en marca conocida', 'disponibilidad'],
      loyalty_factors: ['lo que usa la mamá', 'confianza generacional', 'resultados conocidos'],
      consideration_set: ['Pantene', 'L\'Oréal (aspiracional)', 'Head & Shoulders'],
      brand_perceptions: {
        'Pantene': { awareness: 95, trial: 90, preference: 80, strengths: ['confianza', 'tradición', 'funciona'], weaknesses: ['precio subiendo'] },
        'Savital': { awareness: 75, trial: 0, preference: 25, strengths: ['precio'], weaknesses: ['no conozco resultados', 'parece muy básico'] },
        'L\'Oréal': { awareness: 80, trial: 30, preference: 60, strengths: ['calidad percibida'], weaknesses: ['muy caro para uso diario'] }
      }
    },
    
    purchase_journey: {
      decision_maker: 'self',
      purchase_frequency: 'Cada 6-8 semanas',
      channel_preference: ['mayorista', 'supermercado grande', 'compras al por mayor'],
      price_sensitivity: 8,
      promotion_response: 'Compra en cantidad cuando hay ofertas familiares',
      trial_barriers: ['no hay tiempo para experimentar', 'satisfecha con conocido', 'miedo al cambio'],
      satisfaction_drivers: ['limpieza profunda', 'que dure el efecto', 'precio familiar razonable']
    },
    
    psychographics: {
      life_priorities: ['familia', 'negocio', 'estabilidad económica', 'tradición'],
      beauty_philosophy: 'Práctico y funcional. No tengo tiempo para complicarme, necesito que funcione',
      innovation_attitude: 'laggard',
      risk_tolerance: 'low',
      brand_relationship_style: 'Ultra conservadora. Mi familia ha usado esto siempre',
      influence_sources: ['madre', 'hermanas', 'tradición familiar', 'clientas del restaurante'],
      aspirations: ['cabello sano sin esfuerzo', 'productos que no fallen', 'tiempo para cuidarse'],
      frustrations: ['no hay tiempo personal', 'cabello dañado por trabajo', 'productos caros que duran poco']
    },
    
    typical_quotes: [
      'Mi mamá siempre usó Pantene y a nosotras nos funcionó toda la vida',
      'No tengo tiempo de probar cosas nuevas, necesito algo seguro',
      'Con el restaurante y los niños, lo último que pienso es en mi cabello',
      'Si no está roto, no lo arregles. Pantene me funciona desde siempre',
      'Cuando tenga más tiempo me voy a consentir, pero ahora necesito lo práctico'
    ],
    
    regional_context: {
      climate_impact: 'Barranquilla: humedad + calor cocina daña más el cabello, necesita reparación intensa',
      cultural_beauty_norms: ['familia primero', 'practicidad valorada', 'tradición respetada'],
      local_expressions: ['Así es que es', 'De toda la vida', 'Mi vida', 'Qué vaina'],
      social_influences: ['tradición familiar matriarcal', 'clientas restaurante', 'comunidad del barrio']
    }
  },
  
  {
    id: 'baq_sav_02',
    name: 'Daniela Vargas Hernández',
    age: 31,
    city: 'Barranquilla',
    nse: 'C+',
    occupation: 'Estilista independiente - Salón propio',
    family_composition: 'Madre soltera, 1 hija (6 años)',
    monthly_income: 3400000,
    
    hair_profile: {
      hair_type: 'Procesado múltiple: balayage + botox + keratina',
      main_concerns: ['mantener color', 'reparar daño químico', 'verse profesional'],
      washing_frequency: '3 veces por semana',
      styling_routine: 'Tratamientos semanales + styling profesional diario',
      hair_damage_level: 'alto',
      chemical_treatments: ['color cada 6 semanas', 'botox mensual', 'keratina cada 4 meses']
    },
    
    savital_relationship: {
      is_user: true,
      awareness: 100, // Conocimiento profesional
      trial_status: 'regular-user',
      usage_frequency: '3 veces/semana hace 8 meses (rotación con productos profesionales)',
      satisfaction_score: 7,
      repurchase_intention: 75,
      key_benefits_perceived: ['precio accesible', 'buen balance limpieza/suavidad', 'disponible para clientes'],
      brand_associations: ['democrático', 'confiable', 'buen básico', 'recomendable para clientes'],
      emotional_connection: 6
    },
    
    competitive_behavior: {
      current_brand: 'Savital + productos profesionales (L\'Oréal Professionnel, Redken)',
      brand_history: ['productos profesionales únicamente', 'incorporó Savital por costo-beneficio'],
      switching_drivers: ['optimización costos', 'necesidad producto diario accesible', 'recomendación a clientas'],
      loyalty_factors: ['conocimiento técnico confirmado', 'versatilidad de uso', 'precio justo'],
      consideration_set: ['Savital', 'L\'Oréal Professionnel', 'Redken', 'Matrix', 'productos premium'],
      brand_perceptions: {
        'Savital': { awareness: 100, trial: 90, preference: 70, strengths: ['precio', 'disponibilidad', 'gentil'], weaknesses: ['no es profesional'] },
        'L\'Oréal Prof': { awareness: 100, trial: 95, preference: 90, strengths: ['calidad', 'resultados', 'status'], weaknesses: ['costo', 'disponibilidad'] },
        'Pantene': { awareness: 100, trial: 85, preference: 40, strengths: ['conocido'], weaknesses: ['formula pesada', 'acumula residuo'] }
      }
    },
    
    purchase_journey: {
      decision_maker: 'self',
      purchase_frequency: 'Cada 4 semanas',
      channel_preference: ['distribuidoras profesionales', 'supermercado', 'compras online mayoristas'],
      price_sensitivity: 4, // Baja, pero consciente de costos
      promotion_response: 'Aprovecha ofertas para recomendar a clientas',
      trial_barriers: ['ya tiene rutina establecida', 'tiempo de evaluar en clientas'],
      satisfaction_drivers: ['no acumula residuo', 'compatible con tratamientos', 'resultado predecible']
    },
    
    psychographics: {
      life_priorities: ['independencia económica', 'hija', 'crecimiento profesional', 'imagen personal'],
      beauty_philosophy: 'El cabello es arte y ciencia. Hay que conocer productos y saber cuándo usarlos',
      innovation_attitude: 'early-adopter',
      risk_tolerance: 'high',
      brand_relationship_style: 'Profesional y pragmática. Evalúo técnicamente y uso estratégicamente',
      influence_sources: ['educación continua', 'distribuidoras', 'colegas estilistas', 'clientas feedback'],
      aspirations: ['salon reconocido', 'expertise técnica', 'productos línea propia'],
      frustrations: ['productos que no cumplen promesas', 'clientas que no siguen consejos', 'competencia desleal']
    },
    
    typical_quotes: [
      'Savital me sorprendió, para el precio tiene muy buen balance',
      'A mis clientas les recomiendo según su presupuesto, y Savital es excelente opción',
      'He probado de todo, y puedo decir que Savital cumple lo que promete',
      'No todo tiene que ser carísimo para funcionar bien',
      'Como profesional, valoro productos honestos que den resultados consistentes'
    ],
    
    regional_context: {
      climate_impact: 'Barranquilla: humedad requiere productos que no acumulen peso pero hidraten',
      cultural_beauty_norms: ['expertise valorada', 'imagen profesional crucial', 'recomendación por resultados'],
      local_expressions: ['Está buenísimo', 'Mi amor', 'Eso sí funciona', 'Dale que vamos'],
      social_influences: ['gremio de estilistas', 'clientas del salón', 'tendencias internacionales', 'educación profesional']
    }
  },
  
  {
    id: 'baq_comp_02',
    name: 'Ingrid Polo Martínez',
    age: 40,
    city: 'Barranquilla',
    nse: 'C',
    occupation: 'Auxiliar administrativo hospital público',
    family_composition: 'Casada, 2 hijos (16 y 12 años), vive con suegra',
    monthly_income: 2200000,
    
    hair_profile: {
      hair_type: 'Fino, liso, con canas emergentes (25%)',
      main_concerns: ['falta volumen', 'canas que aparecen', 'sudoración por trabajo'],
      washing_frequency: 'Cada 2 días',
      styling_routine: 'Muy básico: secado natural + mousse ocasional',
      hair_damage_level: 'bajo',
      chemical_treatments: ['tinte cada 3 meses (económico)', 'no otros tratamientos']
    },
    
    savital_relationship: {
      is_user: false,
      awareness: 70,
      trial_status: 'never-tried',
      usage_frequency: 'N/A',
      satisfaction_score: 0,
      repurchase_intention: 15,
      key_benefits_perceived: ['conocido en la región'],
      brand_associations: ['común', 'no sé si es para mi edad'],
      emotional_connection: 2
    },
    
    competitive_behavior: {
      current_brand: 'Sedal (compra donde esté más barato)',
      brand_history: ['Johnson\'s (juventud)', 'Pantene (matrimonio)', 'Sedal (economía actual)'],
      switching_drivers: ['precio principalmente', 'promociones', 'disponibilidad en tienda del barrio'],
      loyalty_factors: ['precio bajo', 'que funcione básicamente', 'no causar problemas'],
      consideration_set: ['Sedal', 'Pantene (si está en oferta)', 'marcas de droguería'],
      brand_perceptions: {
        'Sedal': { awareness: 85, trial: 70, preference: 60, strengths: ['precio', 'suave'], weaknesses: ['no da volumen'] },
        'Pantene': { awareness: 90, trial: 80, preference: 50, strengths: ['conocido', 'calidad'], weaknesses: ['precio alto'] },
        'Savital': { awareness: 70, trial: 0, preference: 15, strengths: ['precio medio'], weaknesses: ['no sé si funciona', 'no lo veo mucho'] }
      }
    },
    
    purchase_journey: {
      decision_maker: 'influenced', // por precio y disponibilidad
      purchase_frequency: 'Cada 8-10 semanas',
      channel_preference: ['tienda del barrio', 'droguería', 'supermercado si hay promoción'],
      price_sensitivity: 10, // Máxima
      promotion_response: 'Solo compra si hay oferta o descuento significativo',
      trial_barriers: ['precio', 'satisfecha con lo básico', 'miedo al gasto innecesario'],
      satisfaction_drivers: ['que limpie bien', 'no irrite', 'precio justo']
    },
    
    psychographics: {
      life_priorities: ['familia', 'estabilidad económica', 'salud', 'educación hijos', 'tranquilidad'],
      beauty_philosophy: 'Básico y funcional. No necesito lujos, solo que esté limpio y presentable',
      innovation_attitude: 'laggard',
      risk_tolerance: 'low',
      brand_relationship_style: 'Ultra conservadora por necesidad. Precio primero, todo lo demás después',
      influence_sources: ['vecinas', 'familia extendida', 'promociones tienda', 'necesidad económica'],
      aspirations: ['estabilidad', 'verse decente', 'no gastar de más'],
      frustrations: ['precios que suben', 'salario que no alcanza', 'productos que prometen y no cumplen']
    },
    
    typical_quotes: [
      'Mientras me deje el cabello limpio y no sea caro, me sirve',
      'No puedo darme lujos, tengo que priorizar a mis hijos',
      'Sedal me funciona y está a buen precio, ¿para qué cambiar?',
      'Si no está en oferta, no lo compro',
      'A mi edad lo que importa es estar presentable, no más'
    ],
    
    regional_context: {
      climate_impact: 'Barranquilla: humedad hace que necesite lavar más seguido, busca economía',
      cultural_beauty_norms: ['presentabilidad básica', 'familia primero', 'no ostentar'],
      local_expressions: ['Así es que es', 'Hay que cuidar los reales', 'Pa\' la casa', 'Qué vaina tan cara'],
      social_influences: ['vecinas del barrio', 'compañeras hospital', 'economía familiar', 'promociones locales']
    }
  }
];

export const SAVITAL_FOCUS_GROUP_SUMMARY = {
  total_participants: 8,
  distribution: {
    cities: { 'Bogotá': 4, 'Barranquilla': 4 },
    nse: { 'C+': 4, 'C': 4 },
    age_ranges: { '25-30': 3, '31-35': 2, '36-40': 2, '41-45': 1 },
    savital_usage: { users: 4, non_users: 4 },
    competitive_brands: ['L\'Oréal Elvive', 'Pantene', 'Head & Shoulders', 'Sedal']
  },
  key_insights: {
    savital_users: 'Alta lealtad (85%+ recompra), valoran aroma, precio y disponibilidad',
    non_users: 'Prefieren marcas conocidas/tradicionales, barreras de precio o falta de conocimiento',
    regional_differences: 'Barranquilla: más sensible a clima húmedo, Bogotá: más variedad de rutinas',
    nse_differences: 'C+: más experimentación, C: más conservador y precio-sensible'
  }
};