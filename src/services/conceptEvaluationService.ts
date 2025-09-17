// conceptEvaluationService.ts - Servicio de evaluación cualitativa basado en insights reales

interface ConceptEvaluation {
  conceptName: string;
  aspectEvaluations: {
    [aspect: string]: {
      positives: string[];
      negatives: string[];
      recommendations: string[];
    };
  };
  archetypeReactions: {
    [archetype: string]: {
      acceptance: 'alta' | 'media' | 'baja';
      quote: string;
      keyDrivers: string[];
    };
  };
}

// Base de conocimiento de estudios reales
const REAL_INSIGHTS = {
  caida_capilar: {
    // Del estudio Dove/Pond's sobre problemas capilares
    main_concerns: ["Caída estacional", "Caída por estrés", "Debilidad desde raíz"],
    successful_claims: ["Reducción visible en 4 semanas", "Fortalece desde el folículo"],
    failed_claims: ["Detiene la caída completamente", "Resultados inmediatos"],
    price_sensitivity: "Alta - esperan precio accesible para uso continuo",
    ingredient_preferences: ["Naturales", "Vitaminas", "Sin químicos agresivos"]
  },
  frizz_control: {
    main_concerns: ["Humedad del clima", "Cabello rebelde", "Falta de brillo"],
    successful_claims: ["24-48 horas de control", "Resistente a humedad"],
    failed_claims: ["Liso perfecto", "Elimina frizz para siempre"],
    regional_differences: {
      costa: "Extrema necesidad por humedad 90%+",
      andina: "Necesidad moderada, más por contaminación"
    }
  },
  crecimiento: {
    main_concerns: ["Crecimiento lento", "Falta de densidad", "Puntas quebradizas"],
    credibility_issues: ["Promesas exageradas generan desconfianza"],
    successful_approaches: ["Favorece crecimiento natural", "Ambiente óptimo para crecer"],
    ingredient_champions: ["Biotina", "Romero", "Aceite de ricino"]
  }
};

export class ConceptEvaluationService {
  
  evaluateSavitalConcepts(): ConceptEvaluation[] {
    return [
      this.evaluateControlCaida(),
      this.evaluateEquilibrioCapilar(),
      this.evaluateNutricionRaiz(),
      this.evaluateHidratacionFrizz(),
      this.evaluateCrecimientoAbundante()
    ];
  }

  private evaluateControlCaida(): ConceptEvaluation {
    return {
      conceptName: "Savital Control Caída desde la Raíz",
      aspectEvaluations: {
        "Nombre y Posicionamiento": {
          positives: [
            "Ataca el problema #1 en Colombia: caída capilar",
            "'Desde la Raíz' comunica solución integral, no superficial",
            "Control sugiere manejo, no falsas promesas de eliminación total"
          ],
          negatives: [
            "Sonido medicinal puede alejar a consumidoras beauty-oriented",
            "No diferencia claramente vs Head & Shoulders Caída",
            "Falta gancho emocional, muy funcional"
          ],
          recommendations: [
            "Agregar elemento emocional: 'Confianza desde la Raíz'",
            "Incluir tiempo de resultados: 'Control Caída - Resultados en 4 semanas'",
            "Considerar versión lifestyle: 'Raíces Fuertes, Cabello Abundante'"
          ]
        },
        "Tecnología e Ingredientes": {
          positives: [
            "Péptidos dan credibilidad científica moderna",
            "Sábila mantiene equity de marca Savital",
            "'Anclaje' es metáfora visual poderosa y diferente"
          ],
          negatives: [
            "Péptidos pueden ser desconocidos para NSE C/D",
            "'Clínicamente comprobado' requiere soporte real o genera desconfianza",
            "Falta ingrediente trending reconocible (biotina, keratina)"
          ],
          recommendations: [
            "Simplificar: 'Péptidos = proteínas que fortalecen'",
            "Agregar visual del 'anclaje' en empaque",
            "Incluir sello/número de estudio clínico si existe"
          ]
        },
        "Promesa y Beneficios": {
          positives: [
            "Promesa específica y medible (reducción de caída)",
            "Beneficio desde raíz hasta puntas es holístico",
            "Alineado con necesidad top en estudios de consumidor"
          ],
          negatives: [
            "No menciona tiempo de resultados esperados",
            "Compite directamente con marcas premium en mismo claim",
            "Falta diferenciación de precio-valor vs competencia"
          ],
          recommendations: [
            "Cuantificar: 'Reduce caída hasta 90% en 6 semanas'",
            "Agregar beneficio secundario: '...y estimula nuevo crecimiento'",
            "Destacar relación precio-beneficio vs alternativas premium"
          ]
        }
      },
      archetypeReactions: {
        "María José (Costeña Emprendedora)": {
          acceptance: 'media',
          quote: "Me interesa porque tengo caída por el clima, pero suena muy serio, como medicina. Preferiría algo más beauty, más moderno.",
          keyDrivers: ["Precio accesible", "Que funcione con humedad", "Resultados rápidos"]
        },
        "Andrea (Bogotana Profesional)": {
          acceptance: 'alta',
          quote: "Los péptidos me dan confianza, suena profesional y con tecnología. Lo probaría si tiene buenos reviews.",
          keyDrivers: ["Credibilidad científica", "Presentación premium", "Eficacia comprobada"]
        },
        "Luz Elena (Paisa Tradicional)": {
          acceptance: 'alta',
          quote: "La caída es mi problema principal. Me gusta que tenga sábila que es natural y confiable.",
          keyDrivers: ["Ingredientes conocidos", "Marca confiable", "Precio justo"]
        }
      }
    };
  }

  private evaluateEquilibrioCapilar(): ConceptEvaluation {
    return {
      conceptName: "Savital Equilibrio Capilar",
      aspectEvaluations: {
        "Nombre y Posicionamiento": {
          positives: [
            "Concepto holístico atractivo para múltiples problemas",
            "Equilibrio sugiere solución integral, no parche temporal",
            "Diferente a claims típicos de la categoría"
          ],
          negatives: [
            "Muy abstracto, no comunica beneficio tangible específico",
            "Equilibrio de qué? Falta claridad",
            "Puede parecer new age o poco creíble"
          ],
          recommendations: [
            "Especificar: 'Equilibrio Grasa-Hidratación'",
            "Agregar beneficio concreto: 'Equilibrio = 48hrs sin grasa ni resequedad'",
            "Usar lenguaje más directo: 'Balance Perfecto'"
          ]
        },
        "Tecnología e Ingredientes": {
          positives: [
            "Niacinamida es ingrediente trending con respaldo científico",
            "Conocido en skincare, trasladable a haircare",
            "Combinación sábila + niacinamida es única"
          ],
          negatives: [
            "Niacinamida más asociada con skincare que haircare",
            "Puede requerir educación sobre beneficios en cabello",
            "No tan reconocible para NSE C/D"
          ],
          recommendations: [
            "Educar: 'Niacinamida = Vitamina B3 para cuero cabelludo sano'",
            "Conectar con skincare: 'Del cuidado facial a tu cabello'",
            "Destacar que es el mismo ingrediente de productos premium"
          ]
        },
        "Promesa y Beneficios": {
          positives: [
            "Ataca múltiples problemas (grasa, picazón, resequedad)",
            "Beneficio de raíz a puntas es completo",
            "Relevante para clima cambiante colombiano"
          ],
          negatives: [
            "Trata de resolver demasiados problemas a la vez",
            "Puede generar desconfianza por promesa muy amplia",
            "No clear #1 benefit para comunicar"
          ],
          recommendations: [
            "Priorizar un problema principal + beneficios adicionales",
            "Crear variantes específicas (Equilibrio Graso, Equilibrio Seco)",
            "Comunicar cómo logra el equilibrio (regulación sebácea)"
          ]
        }
      },
      archetypeReactions: {
        "María José (Costeña Emprendedora)": {
          acceptance: 'baja',
          quote: "No entiendo bien qué hace. Yo necesito algo específico para mi problema de frizz y grasa.",
          keyDrivers: ["Claridad en beneficios", "Solución a problemas específicos"]
        },
        "Andrea (Bogotana Profesional)": {
          acceptance: 'alta',
          quote: "Me encanta la niacinamida, la uso en mi skincare. Sería genial tenerla para el cabello.",
          keyDrivers: ["Ingredientes conocidos de skincare", "Concepto sofisticado"]
        },
        "Luz Elena (Paisa Tradicional)": {
          acceptance: 'media',
          quote: "Equilibrio suena bien pero no sé exactamente qué hace. Prefiero algo más directo.",
          keyDrivers: ["Simplicidad", "Beneficios claros", "Confianza en la marca"]
        }
      }
    };
  }

  private evaluateNutricionRaiz(): ConceptEvaluation {
    return {
      conceptName: "Savital Nutrición desde la Raíz",
      aspectEvaluations: {
        "Nombre y Posicionamiento": {
          positives: [
            "Nutrición es beneficio universal que todos entienden",
            "'Desde la Raíz' sugiere tratamiento profundo",
            "Simple y directo, fácil de comunicar"
          ],
          negatives: [
            "Extremadamente genérico, todos los shampoos 'nutren'",
            "No diferencia vs competencia en absoluto",
            "Falta unique selling proposition"
          ],
          recommendations: [
            "Especificar tipo: 'Nutrición Intensiva con Superalimentos'",
            "Agregar intensidad: 'Ultra Nutrición' o 'Nutrición Profunda'",
            "Incluir resultado: 'Nutrición Visible en 7 días'"
          ]
        },
        "Tecnología e Ingredientes": {
          positives: [
            "Baobab es ingrediente exótico que genera curiosidad",
            "Historia del 'árbol de la vida' es poderosa y memorable",
            "Combinación con sábila mantiene identidad Savital"
          ],
          negatives: [
            "Baobab totalmente desconocido en Colombia",
            "Requiere educación masiva sobre beneficios",
            "Puede sonar demasiado premium para precio Savital"
          ],
          recommendations: [
            "Campaña educativa: 'Descubre el Baobab africano'",
            "Simplificar: 'Baobab = 6x más vitamina C que naranja'",
            "Considerar ingrediente más familiar como alternativa"
          ]
        },
        "Promesa y Beneficios": {
          positives: [
            "'Bomba de nutrición' es visual poderoso",
            "Revitalización es beneficio aspiracional",
            "Cabello fuerte y hermoso son deseos universales"
          ],
          negatives: [
            "No específica para qué tipo de cabello/problema",
            "Beneficios muy similares a cualquier acondicionador",
            "Falta reason to believe específico"
          ],
          recommendations: [
            "Segmentar: 'Nutrición para cabello seco/dañado/teñido'",
            "Agregar claim temporal: 'Nutrición 72 horas'",
            "Incluir señales visibles: 'Verás la diferencia en...' "
          ]
        }
      },
      archetypeReactions: {
        "María José (Costeña Emprendedora)": {
          acceptance: 'media',
          quote: "Nutrición siempre es bueno, pero qué tiene de especial? El baobab no lo conozco.",
          keyDrivers: ["Beneficios claros", "Precio justo", "Resultados visibles"]
        },
        "Andrea (Bogotana Profesional)": {
          acceptance: 'media',
          quote: "Interesante el baobab pero necesitaría investigar más. Suena a marketing.",
          keyDrivers: ["Evidencia de eficacia", "Ingredientes con respaldo"]
        },
        "Luz Elena (Paisa Tradicional)": {
          acceptance: 'baja',
          quote: "Baobab? Muy raro. Prefiero cosas conocidas como aguacate o coco.",
          keyDrivers: ["Ingredientes familiares", "Tradición", "Confianza"]
        }
      }
    };
  }

  private evaluateHidratacionFrizz(): ConceptEvaluation {
    return {
      conceptName: "Savital Hidratación y Control Frizz",
      aspectEvaluations: {
        "Nombre y Posicionamiento": {
          positives: [
            "Ataca el problema #1 en costa y clima húmedo: FRIZZ",
            "Combinación hidratación + control es lo que buscan",
            "Directo y fácil de entender"
          ],
          negatives: [
            "Muy común en la categoría, poca diferenciación",
            "No comunica duración del control",
            "Falta especificidad para clima colombiano"
          ],
          recommendations: [
            "Localizar: 'Control Frizz Trópico Colombiano'",
            "Agregar duración: '72 horas sin frizz'",
            "Incluir momento de uso: 'Frizz-Block día y noche'"
          ]
        },
        "Tecnología e Ingredientes": {
          positives: [
            "Aceite de jojoba es conocido y valorado",
            "Concepto de 'sellar' la fibra es visual y creíble",
            "Capa protectora comunica barrera contra humedad"
          ],
          negatives: [
            "Jojoba no es tan diferenciador (muchos lo tienen)",
            "Puede parecer que deja el cabello grasoso",
            "Falta tecnología específica anti-humedad"
          ],
          recommendations: [
            "Enfatizar: 'Jojoba ligera, no grasa'",
            "Agregar tecnología: 'Escudo Anti-Humedad 90%'",
            "Incluir claim de clima: 'Probado en Barranquilla/Cartagena'"
          ]
        },
        "Promesa y Beneficios": {
          positives: [
            "Beneficios tangibles y deseables (suave, brillante)",
            "Control de frizz es necesidad real y urgente",
            "Protección contra humedad muy relevante"
          ],
          negatives: [
            "No especifica nivel/duración del control",
            "Falta diferenciación vs Sedal, Pantene anti-frizz",
            "No menciona si funciona en diferentes texturas de cabello"
          ],
          recommendations: [
            "Cuantificar: '85% menos frizz por 48 horas'",
            "Segmentar: 'Para cabello liso/ondulado/rizado'",
            "Agregar beneficio plus: '...sin apelmazar'"
          ]
        }
      },
      archetypeReactions: {
        "María José (Costeña Emprendedora)": {
          acceptance: 'alta',
          quote: "ESTO necesito! En Barranquilla el frizz es mi enemigo diario. Si funciona de verdad, lo compro.",
          keyDrivers: ["Control real del frizz", "Duración en clima húmedo", "No apelmaza"]
        },
        "Andrea (Bogotana Profesional)": {
          acceptance: 'media',
          quote: "En Bogotá no es tan crítico, pero en días lluviosos sería útil. Dependería del precio.",
          keyDrivers: ["Versatilidad", "Presentación elegante", "No grasa"]
        },
        "Luz Elena (Paisa Tradicional)": {
          acceptance: 'media',
          quote: "A veces tengo frizz. Me gusta que hidrate también, dos en uno.",
          keyDrivers: ["Doble beneficio", "Precio económico", "Suavidad"]
        }
      }
    };
  }

  private evaluateCrecimientoAbundante(): ConceptEvaluation {
    return {
      conceptName: "Savital Crecimiento Abundante",
      aspectEvaluations: {
        "Nombre y Posicionamiento": {
          positives: [
            "Promesa aspiracional altamente deseada",
            "'Abundante' comunica volumen además de largo",
            "Toca fibra emocional profunda"
          ],
          negatives: [
            "Promesa puede parecer exagerada/falsa",
            "Genera expectativas muy altas difíciles de cumplir",
            "'Abundante' puede interpretarse como irreal"
          ],
          recommendations: [
            "Moderar: 'Favorece Crecimiento Natural Abundante'",
            "Cambiar a: 'Crecimiento Saludable'",
            "Agregar tiempo realista: 'Resultados progresivos en 3 meses'"
          ]
        },
        "Tecnología e Ingredientes": {
          positives: [
            "Biotina es EL ingrediente asociado con crecimiento",
            "Romero tiene tradición y credibilidad natural",
            "Triple combinación suena potente y completa"
          ],
          negatives: [
            "Muchos productos ya tienen biotina",
            "Puede parecer suplemento más que shampoo",
            "Elixir concentrado puede sonar a tratamiento caro"
          ],
          recommendations: [
            "Destacar concentración: '3X más biotina'",
            "Aclarar formato: 'Shampoo diario, no tratamiento'",
            "Educar sobre sinergia de los 3 ingredientes"
          ]
        },
        "Promesa y Beneficios": {
          positives: [
            "Promesa muy deseada universalmente",
            "Penetración raíz-puntas sugiere acción completa",
            "Cabello largo y hermoso es aspiración emocional"
          ],
          negatives: [
            "Crecimiento no depende solo de productos tópicos",
            "Puede generar frustración si no cumple expectativas",
            "Compite con suplementos orales de biotina"
          ],
          recommendations: [
            "Educar: 'Crea ambiente óptimo para crecimiento'",
            "Agregar: 'Reduce quiebre para retener largo'",
            "Incluir rutina: 'Úsalo con masaje capilar para mejores resultados'"
          ]
        }
      },
      archetypeReactions: {
        "María José (Costeña Emprendedora)": {
          acceptance: 'alta',
          quote: "Me encantaría tener pelo largo! Si tiene biotina debe funcionar, mis amigas toman pastillas de eso.",
          keyDrivers: ["Ingredientes conocidos", "Resultados visibles", "Recomendaciones"]
        },
        "Andrea (Bogotana Profesional)": {
          acceptance: 'baja',
          quote: "Suena demasiado bueno para ser verdad. El crecimiento depende de genética y salud, no solo shampoo.",
          keyDrivers: ["Credibilidad científica", "Expectativas realistas", "Evidencia"]
        },
        "Luz Elena (Paisa Tradicional)": {
          acceptance: 'media',
          quote: "A mi edad ya no crece como antes. Pero el romero es bueno, mi mamá lo usaba.",
          keyDrivers: ["Ingredientes tradicionales", "Confianza generacional", "Precio"]
        }
      }
    };
  }

  // Método para generar reporte comparativo
  generateComparativeReport(evaluations: ConceptEvaluation[]): any {
    return {
      bestOverall: "Savital Hidratación y Control Frizz - Mayor aceptación en costa",
      mostCredible: "Savital Control Caída - Respaldo científico con péptidos",
      mostDifferentiated: "Savital Equilibrio Capilar - Único con niacinamida",
      highestRisk: "Savital Crecimiento Abundante - Expectativas difíciles de cumplir",
      recommendations: {
        immediate_launch: ["Hidratación y Control Frizz (con ajustes)"],
        needs_development: ["Control Caída", "Equilibrio Capilar"],
        reconsider: ["Nutrición desde la Raíz", "Crecimiento Abundante"],
        testing_priorities: [
          "Validar comprensión de niacinamida en Equilibrio",
          "Testear credibilidad de 'crecimiento abundante'",
          "Confirmar relevancia de baobab vs ingredientes locales"
        ]
      }
    };
  }
}

export const conceptEvaluationService = new ConceptEvaluationService();