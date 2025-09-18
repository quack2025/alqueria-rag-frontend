/**
 * Consultor Virtual Service - Evaluación rápida de conceptos lácteos
 * Reemplaza el sistema complejo de entrevistas múltiples con análisis directo
 */

import type { DairyConcept } from '../types/dairy.types';
import { alqueriaPersonas } from '../data/alqueriaPersonaSystem';

// Tipos específicos para Consultor Virtual
export interface ConsultorEvaluation {
  conceptId: string;
  conceptName: string;
  evaluationMode: 'consultant';
  timestamp: string;
  recommendation: 'GO' | 'REFINE' | 'NO-GO';
  overallScore: number; // 1-10

  // Análisis por segmento
  segmentAnalysis: SegmentInsight[];

  // Resumen ejecutivo
  executiveSummary: {
    topBarriers: string[];
    topOpportunities: string[];
    keyRecommendations: string[];
    riskFactors: string[];
  };

  // Análisis Competitivo Detallado
  competitiveAnalysis: {
    mainCompetitor: string;
    competitiveAdvantages: string[];
    competitiveWeaknesses: string[];
    differentiationStrategy: string;
    marketPositioning: string;
  };

  // Journey de Adopción
  adoptionJourney: {
    awarenessStrategy: string;
    trialDrivers: string[];
    repeatPurchaseFactors: string[];
    potentialBlockers: string[];
  };

  // Ocasiones de Consumo
  consumptionOccasions: {
    primary: string[];
    secondary: string[];
    unexploredOpportunities: string[];
  };

  // Proyección de Mercado
  marketProjection: {
    targetMarketSize: string;
    estimatedPenetration: string;
    growthPotential: string;
    timeToMarket: string;
  };

  // Métricas
  processingTime: number;
  confidence: number; // 1-10
}

export interface SegmentInsight {
  personaName: string;
  personaProfile: string; // "28 años, profesional, Medellín, NSE B"
  overallReaction: 'Positiva' | 'Neutral' | 'Negativa';

  // Insights específicos
  keyBarriers: string[];
  keyOpportunities: string[];
  priceReaction: string;
  competitorComparison: string;
  purchaseIntent: number; // 1-10

  // Insights Profundos
  emotionalDrivers: string[];
  frictionPoints: string[];
  decisionInfluencers: string[];
  consumptionContext: string;

  // Cita representativa
  representativeQuote: string;

  // Quote adicional sobre momento de consumo
  consumptionMomentQuote?: string;
}

export class ConsultorVirtualService {
  private progressCallback?: (message: string) => void;

  constructor(progressCallback?: (message: string) => void) {
    this.progressCallback = progressCallback;
  }

  /**
   * Evaluación principal del consultor virtual
   */
  async evaluateConcept(
    concept: DairyConcept,
    selectedPersonaIds?: string[]
  ): Promise<ConsultorEvaluation> {
    const startTime = Date.now();

    try {
      // Progress update
      this.updateProgress('🧠 Consultor Virtual analizando concepto...');

      // Seleccionar personas (manual o automático)
      const selectedPersonas = this.selectRepresentativePersonas(selectedPersonaIds);

      // Generar análisis con Claude en una sola llamada
      this.updateProgress('⚡ Generando insights por segmento...');
      const analysis = await this.generateAnalysisWithClaude(concept, selectedPersonas);

      // Procesar y estructurar resultado
      this.updateProgress('📊 Consolidando recomendaciones...');
      const evaluation = this.processAnalysisToEvaluation(concept, analysis, startTime);

      this.updateProgress('✅ Evaluación completada');
      return evaluation;

    } catch (error) {
      console.error('❌ Error en Consultor Virtual:', error);

      // Generar evaluación básica de emergencia
      return this.generateEmergencyEvaluation(concept, startTime);
    }
  }

  /**
   * Seleccionar personas más representativas del mercado lácteo colombiano
   */
  private selectRepresentativePersonas(selectedIds?: string[]) {
    // Si hay selección manual, usar esas personas
    let personasToUse = alqueriaPersonas;

    if (selectedIds && selectedIds.length > 0) {
      personasToUse = alqueriaPersonas.filter(p =>
        selectedIds.includes(p.id)
      );
    } else {
      // Selección automática: mix representativo (5 personas)
      personasToUse = alqueriaPersonas.slice(0, 5);
    }

    return personasToUse.map(p => ({
      name: p.name,
      profile: `${p.baseProfile.age} años, ${p.baseProfile.occupation || p.baseProfile.profession || 'Profesional'}, ${p.baseProfile.location}`,
      dairyHabits: p.dairyConsumption.frequency,
      preferences: p.dairyConsumption.preferences ? p.dairyConsumption.preferences.slice(0, 3).join(', ') : 'Lácteos tradicionales',
      lifestyle: p.baseProfile.lifestyle || p.lifestyle || 'Estilo de vida activo',
      concerns: p.dairyConsumption.concerns ? p.dairyConsumption.concerns.slice(0, 2).join(', ') : 'Calidad y precio'
    }));
  }

  /**
   * Prompt optimizado para análisis directo
   */
  private async generateAnalysisWithClaude(concept: DairyConcept, personas: any[]): Promise<any> {
    const analysisPrompt = `
Eres un consultor senior especializado en consumer insights lácteos en Colombia con 15+ años de experiencia.

Acabas de realizar entrevistas profundas IN-DEPTH de 90 minutos con ${personas.length} consumidores sobre el concepto lácteo "${concept.name}".

CONCEPTO A EVALUAR:
Nombre: ${concept.name}
Descripción: ${concept.description}
Categoría: ${concept.category}
Beneficios: ${concept.benefits?.join(', ') || 'N/A'}
Marca: ${concept.brand || 'Alquería'}
Precio: ${concept.pricing || 'No definido'}

PERFILES ENTREVISTADOS:
${personas.map((p, i) => `
${i + 1}. ${p.name}
   - Perfil: ${p.profile}
   - Consumo lácteo: ${p.dairyHabits}
   - Preferencias: ${p.preferences}
   - Estilo de vida: ${p.lifestyle}
   - Valores: ${p.concerns}
`).join('')}

Como consultor experto, basándote en lo que REALMENTE pensarían estos consumidores colombianos tras una ENTREVISTA PROFUNDA, genera un análisis detallado en formato JSON:

{
  "overallRecommendation": "GO|REFINE|NO-GO",
  "overallScore": 1-10,
  "confidence": 1-10,
  "keyFindings": {
    "topBarriers": ["3-4 barreras críticas muy específicas del concepto"],
    "topOpportunities": ["3-4 oportunidades concretas y accionables"],
    "keyRecommendations": ["3-4 recomendaciones detalladas y específicas"],
    "riskFactors": ["2-3 riesgos estratégicos principales"]
  },
  "competitiveAnalysis": {
    "mainCompetitor": "Principal competidor directo",
    "competitiveAdvantages": ["2-3 ventajas claras vs competencia"],
    "competitiveWeaknesses": ["2-3 debilidades vs competencia"],
    "differentiationStrategy": "Estrategia clara de diferenciación",
    "marketPositioning": "Posicionamiento recomendado en el mercado"
  },
  "adoptionJourney": {
    "awarenessStrategy": "Cómo generar conocimiento del producto",
    "trialDrivers": ["3 motivadores principales para primera compra"],
    "repeatPurchaseFactors": ["3 factores para recompra"],
    "potentialBlockers": ["2-3 bloqueadores en el journey"]
  },
  "consumptionOccasions": {
    "primary": ["2-3 ocasiones principales de consumo"],
    "secondary": ["2-3 ocasiones secundarias"],
    "unexploredOpportunities": ["2 oportunidades no exploradas"]
  },
  "marketProjection": {
    "targetMarketSize": "Tamaño del mercado objetivo (descriptivo)",
    "estimatedPenetration": "Penetración esperada (bajo/medio/alto)",
    "growthPotential": "Potencial de crecimiento (descriptivo)",
    "timeToMarket": "Tiempo sugerido para lanzamiento"
  },
  "segmentInsights": [
    {
      "personaName": "${personas[0]?.name || 'Persona 1'}",
      "personaProfile": "${personas[0]?.profile || 'Perfil'}",
      "overallReaction": "Positiva|Neutral|Negativa",
      "keyBarriers": ["2-3 barreras específicas profundas"],
      "keyOpportunities": ["2-3 oportunidades específicas"],
      "priceReaction": "Percepción detallada sobre precio",
      "competitorComparison": "Comparación específica vs sus marcas preferidas",
      "purchaseIntent": 1-10,
      "emotionalDrivers": ["2-3 motivadores emocionales profundos"],
      "frictionPoints": ["2-3 puntos de fricción específicos"],
      "decisionInfluencers": ["2-3 influenciadores clave en su decisión"],
      "consumptionContext": "Contexto detallado de consumo",
      "representativeQuote": "Quote auténtico y detallado sobre el concepto",
      "consumptionMomentQuote": "Quote sobre cuándo/cómo lo consumiría"
    }
  ]
}

INSTRUCCIONES CRÍTICAS:
- Basarte en comportamiento REAL de consumidores colombianos
- NO menciones precios específicos, porcentajes exactos o cantidades de dinero
- NO incluyas fechas específicas, trimestres o años
- NO inventes lanzamientos específicos de competencia
- PROFUNDIDAD: Cada insight debe ser específico y detallado, como si vinieras de una entrevista de 90 minutos
- Incluir comparaciones detalladas vs Alpina, Colanta, Parmalat, Nestlé
- Los quotes deben ser largos (2-3 oraciones) y revelar insights profundos
- Considerar aspectos culturales, sociales y emocionales del consumo lácteo
- Analizar fricciones psicológicas y barreras culturales
- Identificar tensiones entre lo aspiracional y lo práctico
- Explorar dinámicas familiares en decisiones de compra
- Considerar influencia del canal tradicional vs moderno

RESPONDE SOLO EL JSON, SIN TEXTO ADICIONAL.
`;

    try {
      const response = await fetch('/api/claude-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 6000, // Suficiente para análisis completo
          temperature: 0.3, // Balance entre creatividad y consistencia
          systemPrompt: 'Eres un consultor senior especializado en consumer insights lácteos en Colombia. Respondes SOLO con JSON válido.',
          messages: [{ role: 'user', content: analysisPrompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();

      // Extraer contenido
      let content = '';
      if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
        content = data.content[0].text;
      } else if (data.message) {
        content = data.message;
      } else if (data.response) {
        content = data.response;
      } else {
        throw new Error('Formato de respuesta inválido');
      }

      // Limpiar y parsear
      content = this.cleanResponse(content);
      return JSON.parse(content);

    } catch (error) {
      console.error('❌ Error calling Claude API:', error);
      throw error;
    }
  }

  /**
   * Limpiar respuesta de Claude
   */
  private cleanResponse(content: string): string {
    let cleaned = content.trim();

    // Remover markdown
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Extraer JSON
    if (cleaned.includes('{')) {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}') + 1;
      cleaned = cleaned.substring(start, end);
    }

    return cleaned;
  }

  /**
   * Procesar análisis de Claude a formato de evaluación
   */
  private processAnalysisToEvaluation(
    concept: DairyConcept,
    analysis: any,
    startTime: number
  ): ConsultorEvaluation {
    const processingTime = Date.now() - startTime;

    return {
      conceptId: concept.id || 'unknown',
      conceptName: concept.name,
      evaluationMode: 'consultant',
      timestamp: new Date().toISOString(),
      recommendation: analysis.overallRecommendation || 'REFINE',
      overallScore: analysis.overallScore || 5,

      segmentAnalysis: analysis.segmentInsights?.map((insight: any) => ({
        personaName: insight.personaName,
        personaProfile: insight.personaProfile,
        overallReaction: insight.overallReaction,
        keyBarriers: insight.keyBarriers || [],
        keyOpportunities: insight.keyOpportunities || [],
        priceReaction: insight.priceReaction || 'Neutral',
        competitorComparison: insight.competitorComparison || 'N/A',
        purchaseIntent: insight.purchaseIntent || 5,
        emotionalDrivers: insight.emotionalDrivers || [],
        frictionPoints: insight.frictionPoints || [],
        decisionInfluencers: insight.decisionInfluencers || [],
        consumptionContext: insight.consumptionContext || 'No especificado',
        representativeQuote: insight.representativeQuote || 'Sin comentario específico',
        consumptionMomentQuote: insight.consumptionMomentQuote
      })) || [],

      executiveSummary: {
        topBarriers: analysis.keyFindings?.topBarriers || ['No identificadas'],
        topOpportunities: analysis.keyFindings?.topOpportunities || ['No identificadas'],
        keyRecommendations: analysis.keyFindings?.keyRecommendations || ['Requiere más análisis'],
        riskFactors: analysis.keyFindings?.riskFactors || ['Sin riesgos identificados']
      },

      competitiveAnalysis: analysis.competitiveAnalysis || {
        mainCompetitor: 'No identificado',
        competitiveAdvantages: [],
        competitiveWeaknesses: [],
        differentiationStrategy: 'Por definir',
        marketPositioning: 'Por definir'
      },

      adoptionJourney: analysis.adoptionJourney || {
        awarenessStrategy: 'Por desarrollar',
        trialDrivers: [],
        repeatPurchaseFactors: [],
        potentialBlockers: []
      },

      consumptionOccasions: analysis.consumptionOccasions || {
        primary: [],
        secondary: [],
        unexploredOpportunities: []
      },

      marketProjection: analysis.marketProjection || {
        targetMarketSize: 'Por evaluar',
        estimatedPenetration: 'Por determinar',
        growthPotential: 'Por analizar',
        timeToMarket: 'Por definir'
      },

      processingTime,
      confidence: analysis.confidence || 7
    };
  }

  /**
   * Evaluación de emergencia cuando falla Claude
   */
  private generateEmergencyEvaluation(concept: DairyConcept, startTime: number): ConsultorEvaluation {
    const processingTime = Date.now() - startTime;

    return {
      conceptId: concept.id || 'unknown',
      conceptName: concept.name,
      evaluationMode: 'consultant',
      timestamp: new Date().toISOString(),
      recommendation: 'REFINE',
      overallScore: 5,

      segmentAnalysis: [],

      executiveSummary: {
        topBarriers: ['Sistema temporalmente no disponible'],
        topOpportunities: ['Requiere evaluación manual'],
        keyRecommendations: ['Contactar soporte técnico'],
        riskFactors: ['Evaluación incompleta']
      },

      processingTime,
      confidence: 1
    };
  }

  /**
   * Callback de progreso
   */
  private updateProgress(message: string) {
    if (this.progressCallback) {
      this.progressCallback(message);
    }
    console.log(message);
  }
}