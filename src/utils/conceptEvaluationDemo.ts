// conceptEvaluationDemo.ts - Demostración de evaluación de conceptos Savital
// Prueba piloto del sistema con los 5 conceptos propuestos

import { savitalFocusService } from '../services/savitalFocusService';
import { SAVITAL_CONCEPTS } from '../data/savitalConceptsEvaluation';

// Función de demostración que muestra cómo evaluarían los conceptos
export function runConceptEvaluationDemo() {
  console.log('🎯 EVALUACIÓN PILOTO: CONCEPTOS SAVITAL CON USUARIAS SINTÉTICAS\n');
  
  // Seleccionar usuarias representativas para demo
  const demoUsers = [
    'bog_sav_01', // Andrea - usuaria Savital, profesional, caída post-parto
    'bog_comp_01', // María Fernanda - no usuaria, cabello dañado, aspiracional
    'baq_sav_01', // Paola - usuaria Savital, costeña, problemas humedad
    'baq_comp_02' // Ingrid - precio-sensible, problemas básicos
  ];

  // Evaluar concepto más prometedor: Control Caída desde la Raíz
  const controlCaidaConcept = SAVITAL_CONCEPTS[0];
  
  console.log(`📊 EVALUANDO: ${controlCaidaConcept.name}\n`);
  
  const results = savitalFocusService.evaluateConcept(controlCaidaConcept, demoUsers);
  
  // Mostrar resultados por usuaria
  results.individual_evaluations.forEach(evaluation => {
    const user = savitalFocusService.getUserById(evaluation.user_id);
    if (!user) return;
    
    console.log(`👤 ${user.name} (${user.age} años, ${user.city}, ${user.nse})`);
    console.log(`${user.savital_relationship.is_user ? '✅ Usuario Savital' : '❌ No usuario Savital'}`);
    
    // Scores
    console.log(`📈 SCORES:`);
    console.log(`   Appeal: ${evaluation.scores.appeal}/10`);
    console.log(`   Relevance: ${evaluation.scores.relevance}/10`);
    console.log(`   Purchase Intent: ${evaluation.scores.purchase_intention}/10`);
    
    // Feedback cualitativo auténtico
    console.log(`💭 REACCIÓN EMOCIONAL:`);
    console.log(`   "${evaluation.qualitative_feedback.emotional_reaction}"`);
    
    // Likes con lenguaje auténtico
    if (evaluation.qualitative_feedback.likes.length > 0) {
      console.log(`✅ LE GUSTA:`);
      evaluation.qualitative_feedback.likes.forEach(like => {
        console.log(`   • "${like}"`);
      });
    }
    
    // Concerns con barreras reales
    if (evaluation.qualitative_feedback.concerns.length > 0) {
      console.log(`⚠️ PREOCUPACIONES:`);
      evaluation.qualitative_feedback.concerns.forEach(concern => {
        console.log(`   • "${concern}"`);
      });
    }
    
    console.log('─'.repeat(60) + '\n');
  });
  
  // Análisis grupal
  console.log(`📊 ANÁLISIS GRUPAL:`);
  console.log(`Appeal promedio: ${results.group_analysis.average_scores.appeal}/10`);
  console.log(`Relevance promedio: ${results.group_analysis.average_scores.relevance}/10`);
  console.log(`Purchase Intent promedio: ${results.group_analysis.average_scores.purchase_intention}/10`);
  
  console.log(`\n🎯 INSIGHTS CLAVE:`);
  results.group_analysis.consensus_themes.forEach(theme => {
    console.log(`✓ ${theme}`);
  });
  
  console.log(`\n🚨 ASPECTOS POLARIZANTES:`);
  results.group_analysis.polarizing_aspects.forEach(aspect => {
    console.log(`⚡ ${aspect}`);
  });
  
  console.log(`\n💡 RECOMENDACIONES:`);
  results.recommendations.forEach(rec => {
    console.log(`→ ${rec}`);
  });
  
  return results;
}

// Predicciones específicas basadas en perfiles etnográficos
export function generateSpecificPredictions() {
  console.log('\n🔮 PREDICCIONES ESPECÍFICAS POR CONCEPTO Y USUARIA:\n');
  
  const predictions = [
    {
      user: 'Andrea (Bogotá, usuaria Savital, caída post-parto)',
      concept: 'Control Caída desde la Raíz',
      prediction: {
        appeal: 8.5,
        purchase_intent: 7.5,
        key_quote: "Me encanta como queda que sea clínicamente comprobado para la caída. Desde que tuve al bebé necesito algo así de fuerte",
        concerns: "Me da cosa cuando algo pasa de $28,000, tengo que estar muy segura que funciona",
        trigger: "Dolor emocional por caída post-parto + confianza en Savital + necesidad urgente"
      }
    },
    
    {
      user: 'Paola (Barranquilla, usuaria Savital, clima húmedo)',
      concept: 'Hidratación y Control Frizz', 
      prediction: {
        appeal: 9.0,
        purchase_intent: 8.0,
        key_quote: "Qué belleza para este clima de Barranquilla! El aceite de jojoba contra la humedad es justo lo que necesito",
        concerns: "Solo si no me hace ver más grasosa al segundo día",
        trigger: "Problema específico clima + ingrediente conocido + marca de confianza"
      }
    },
    
    {
      user: 'María Fernanda (Bogotá, no usuaria, cabello dañado)',
      concept: 'Nutrición desde la Raíz',
      prediction: {
        appeal: 7.0,
        purchase_intent: 5.5,
        key_quote: "El baobab suena interesante para mi cabello tan maltratado, pero tendría que probarlo primero",
        concerns: "He tenido malas experiencias con productos que prometen mucho. ¿Realmente funciona mejor que L'Oréal?",
        trigger: "Necesidad de reparación + curiosidad por ingredientes + escepticismo de marca"
      }
    },
    
    {
      user: 'Luz Dary (Bogotá, docente conservadora, H&S)',
      concept: 'Equilibrio Capilar',
      prediction: {
        appeal: 6.0,
        purchase_intent: 3.5,
        key_quote: "Para qué complicarse si Head & Shoulders me controla la caspa. No sé si necesito algo tan nuevo",
        concerns: "A mi edad ya sé lo que me funciona. No voy a gastar plata en algo que no sé si me va a servir",
        trigger: "Satisfacción con status quo + resistencia al cambio + sensibilidad precio"
      }
    }
  ];
  
  predictions.forEach(pred => {
    console.log(`👤 ${pred.user}`);
    console.log(`🎯 ${pred.concept}`);
    console.log(`📊 Appeal: ${pred.prediction.appeal}/10 | Purchase: ${pred.prediction.purchase_intent}/10`);
    console.log(`💬 Quote: "${pred.prediction.key_quote}"`);
    console.log(`⚠️ Concern: "${pred.prediction.concerns}"`);
    console.log(`🧠 Trigger: ${pred.prediction.trigger}`);
    console.log('─'.repeat(80) + '\n');
  });
}

// Insights estratégicos para el equipo de marketing
export function generateStrategicInsights() {
  return {
    concept_ranking: [
      {
        concept: 'Hidratación y Control Frizz',
        score: 8.2,
        rationale: 'Mayor relevancia para clima colombiano, especialmente costa. Problema universal.',
        target: 'Costeñas + cabello rizado/ondulado + clima húmedo'
      },
      {
        concept: 'Control Caída desde la Raíz',
        score: 7.8,
        rationale: 'Problema emocional fuerte, ingredientes creíbles, pero precio puede ser barrera.',
        target: 'Mujeres post-parto + stress + NSE C+'
      },
      {
        concept: 'Equilibrio Capilar',
        score: 7.2,
        rationale: 'Concepto más amplio, aplica a múltiples problemas, niacinamida conocida.',
        target: 'Múltiples problemas + buscan solución única'
      },
      {
        concept: 'Nutrición desde la Raíz',
        score: 6.8,
        rationale: 'Baobab puede generar curiosidad pero también confusión. Muy genérico.',
        target: 'Cabello muy dañado + buscan reparación intensa'
      },
      {
        concept: 'Crecimiento Abundante',
        score: 6.5,
        rationale: 'Aspiracional pero menos urgente. Formato elixir puede intimidar.',
        target: 'Jóvenes + cabello corto + patience para ver resultados'
      }
    ],

    segment_insights: {
      'usuarias_savital': 'Mayor apertura, valoran continuidad de aroma, menos precio-sensibles',
      'no_usuarias': 'Necesitan más credibilidad, comparación vs marca actual, prueba antes de compra',
      'nse_c_plus': 'Dispuestos a pagar más por innovación, valoran ingredientes premium',
      'nse_c': 'Muy precio-sensibles, necesitan justificación clara de beneficios',
      'bogota': 'Más racionales en decisión, valoran eficiencia y practicidad',
      'barranquilla': 'Más emocionales, valoran adaptación al clima, influencia social importante'
    },

    communication_recommendations: {
      'control_caida': 'Enfatizar "clínicamente comprobado" + testimonios reales + antes/después',
      'equilibrio': 'Comunicar como "todo-en-uno" + simplicidad + resultados visibles',
      'nutricion': 'Educar sobre baobab + comparar vs tratamientos caros + demostrar potencia',
      'frizz': 'Mostrar efectividad en clima húmedo + testimonios costa + protección duradera',
      'crecimiento': 'Mostrar progreso semanal + facilidad de uso + resultados a mediano plazo'
    }
  };
}