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

  // Cita representativa
  representativeQuote: string;
}

export class ConsultorVirtualService {
  private progressCallback?: (message: string) => void;

  constructor(progressCallback?: (message: string) => void) {
    this.progressCallback = progressCallback;
  }

  /**
   * Evaluación principal del consultor virtual
   */
  async evaluateConcept(concept: DairyConcept): Promise<ConsultorEvaluation> {
    const startTime = Date.now();

    try {
      // Progress update
      this.updateProgress('🧠 Consultor Virtual analizando concepto...');

      // Seleccionar 5 personas más representativas
      const selectedPersonas = this.selectRepresentativePersonas();

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
  private selectRepresentativePersonas() {
    // Seleccionar mix representativo: NSE A/B/C, edades variadas, ciudades principales
    return alqueriaPersonas.slice(0, 5).map(p => ({
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

Acabas de realizar entrevistas profundas con 5 consumidores representativos sobre el concepto lácteo "${concept.name}".

CONCEPTO A EVALUAR:
Nombre: ${concept.name}
Descripción: ${concept.description}
Categoría: ${concept.category}
Beneficios: ${concept.benefits?.join(', ') || 'N/A'}
Marca: ${concept.brand || 'Alquería'}

PERFILES ENTREVISTADOS:
${personas.map((p, i) => `
${i + 1}. ${p.name}
   - Perfil: ${p.profile}
   - Consumo lácteo: ${p.dairyHabits}
   - Preferencias: ${p.preferences}
   - Estilo de vida: ${p.lifestyle}
   - Valores: ${p.concerns}
`).join('')}

Como consultor experto, basándote en lo que REALMENTE pensarían estos consumidores colombianos, genera un análisis detallado en formato JSON:

{
  "overallRecommendation": "GO|REFINE|NO-GO",
  "overallScore": 1-10,
  "confidence": 1-10,
  "keyFindings": {
    "topBarriers": ["barrera específica 1", "barrera específica 2", "barrera específica 3"],
    "topOpportunities": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
    "keyRecommendations": ["recomendación accionable 1", "recomendación accionable 2"],
    "riskFactors": ["riesgo general 1", "riesgo general 2"]
  },
  "segmentInsights": [
    {
      "personaName": "${personas[0].name}",
      "personaProfile": "${personas[0].profile}",
      "overallReaction": "Positiva|Neutral|Negativa",
      "keyBarriers": ["barrera específica para este perfil"],
      "keyOpportunities": ["oportunidad específica"],
      "priceReaction": "percepción general sobre posicionamiento de precio",
      "competitorComparison": "comparación general vs categoría existente",
      "purchaseIntent": 1-10,
      "representativeQuote": "Lo que diría este consumidor sobre el concepto"
    }
  ]
}

INSTRUCCIONES CRÍTICAS:
- Basarte en comportamiento REAL de consumidores colombianos típicos
- NO menciones precios específicos, porcentajes exactos o cantidades de dinero
- NO incluyas fechas específicas, trimestres o años
- NO inventes lanzamientos específicos de competencia
- Enfócate en PERCEPCIONES y ACTITUDES generales hacia el concepto
- Incluir comparaciones generales vs competencia conocida (Alpina, Colanta, Parmalat)
- Ser específico en insights de comportamiento y motivaciones (no generalidades)
- Quotes deben sonar auténticos al perfil colombiano
- Considerar patrones de consumo lácteo típicos en Colombia
- Factores de riesgo deben ser categorías generales, no eventos específicos

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
        representativeQuote: insight.representativeQuote || 'Sin comentario específico'
      })) || [],

      executiveSummary: {
        topBarriers: analysis.keyFindings?.topBarriers || ['No identificadas'],
        topOpportunities: analysis.keyFindings?.topOpportunities || ['No identificadas'],
        keyRecommendations: analysis.keyFindings?.keyRecommendations || ['Requiere más análisis'],
        riskFactors: analysis.keyFindings?.riskFactors || ['Sin riesgos identificados']
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