// services/strategicRAGService.ts - Servicio RAG estratégico para análisis profundos

export interface StrategicRAGRequest {
  query: string;
  analysisType: 'descriptive' | 'strategic' | 'competitive' | 'innovation';
  insightDepth: 'surface' | 'deep' | 'expert';
  enableCrossDocumentAnalysis: boolean;
  enableTrendAnalysis: boolean;
  includeRecommendations: boolean;
  maxChunks?: number;
}

export interface StrategicRAGResponse {
  answer: string;
  analysis_type: string;
  insight_depth: string;
  key_findings: string[];
  strategic_recommendations: string[];
  competitive_insights?: string[];
  trend_analysis?: string[];
  citations: Array<{
    content: string;
    source: string;
    confidence: number;
  }>;
  metadata: {
    chunks_retrieved: number;
    processing_time: number;
    confidence_score: number;
    strategic_framework: string;
  };
}

class StrategicRAGService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app';
  }

  /**
   * Genera análisis estratégico sin dependencia de personas sintéticas
   */
  async generateStrategicAnalysis(request: StrategicRAGRequest): Promise<StrategicRAGResponse> {
    try {
      console.log('🔍 Strategic Analysis Request:', request);

      // Determinar endpoint según tipo de análisis
      const endpoint = this.getEndpointForAnalysis(request.analysisType);
      
      // Construir request optimizado para análisis estratégico
      const optimizedRequest = this.buildOptimizedRequest(request);

      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optimizedRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Procesar respuesta para formato estratégico
      return this.processStrategicResponse(data, request);
      
    } catch (error: any) {
      console.error('❌ Strategic Analysis Error:', error);
      throw new Error(`Error en análisis estratégico: ${error.message}`);
    }
  }

  /**
   * Determina el endpoint óptimo según el tipo de análisis
   */
  private getEndpointForAnalysis(analysisType: string): string {
    switch (analysisType) {
      case 'descriptive':
        return '/api/rag-pure';
      case 'strategic':
        return '/api/rag-hybrid';
      case 'competitive':
        return '/api/rag-creative';
      case 'innovation':
        return '/api/rag-creative';
      default:
        return '/api/rag-hybrid';
    }
  }

  /**
   * Construye request optimizado con prompts estratégicos
   */
  private buildOptimizedRequest(request: StrategicRAGRequest) {
    const strategicPrompt = this.buildStrategicPrompt(request);
    
    // Usar el mismo formato que GeneralModule
    const optimizedRequest = {
      text: strategicPrompt,
      metadata_filter: null,
      output_types: ["text", "table", "chart"],
      response_customization: {
        extension_level: request.insightDepth === 'surface' ? 'resumido' : 
                        request.insightDepth === 'deep' ? 'detallado' : 'detallado',
        response_style: 'ejecutivo',
        detail_level: request.maxChunks || 8,
        language: 'español',
        target_audience: 'gerentes',
        include_citations: true,
        temporal_context: 'completo',
        analysis_type: request.analysisType === 'strategic' ? 'predictivo' : 'descriptivo',
        output_format: 'narrativo'
      }
    };

    return optimizedRequest;
  }

  /**
   * Construye prompt estratégico optimizado
   */
  private buildStrategicPrompt(request: StrategicRAGRequest): string {
    const frameworks = {
      descriptive: 'ANÁLISIS DESCRIPTIVO',
      strategic: 'ANÁLISIS MULTICAPA ESTRATÉGICO', 
      competitive: 'INTELIGENCIA COMPETITIVA',
      innovation: 'ANÁLISIS DE INNOVACIÓN'
    };

    const depthInstructions = {
      surface: 'Proporciona un resumen ejecutivo conciso',
      deep: 'Realiza un análisis profundo con múltiples perspectivas',
      expert: 'Desarrolla análisis nivel experto con recomendaciones específicas'
    };

    let prompt = `${frameworks[request.analysisType]}

INSTRUCCIONES ESTRATÉGICAS:
- ${depthInstructions[request.insightDepth]}
- Basa TODO el análisis en documentos Unilever disponibles
- Usa datos específicos, números y evidencia concreta
- Identifica patrones y tendencias clave`;

    if (request.enableCrossDocumentAnalysis) {
      prompt += `
- ANÁLISIS CRUZADO: Conecta información de diferentes documentos para insights más profundos`;
    }

    if (request.enableTrendAnalysis) {
      prompt += `
- ANÁLISIS TENDENCIAL: Identifica tendencias evolutivas y proyecciones`;
    }

    if (request.includeRecommendations) {
      prompt += `
- RECOMENDACIONES: Proporciona acciones específicas y estrategias concretas`;
    }

    // Framework específico por tipo
    switch (request.analysisType) {
      case 'strategic':
        prompt += `

FRAMEWORK ESTRATÉGICO:
1. **Situación Actual**: ¿Qué revelan los datos?
2. **Análisis Profundo**: Patrones, causas, correlaciones
3. **Oportunidades**: Gaps y áreas de crecimiento
4. **Recomendaciones**: Acciones prioritarias específicas

ESTRUCTURA ESPERADA:
- Insights clave basados en evidencia
- Análisis competitivo si es relevante  
- Recomendaciones accionables
- Métricas y datos cuantitativos`;
        break;
        
      case 'competitive':
        prompt += `

FRAMEWORK COMPETITIVO:
1. **Posición Unilever**: Fortalezas y debilidades
2. **Landscape Competitivo**: Principales players y estrategias
3. **Diferenciación**: Ventajas competitivas únicas
4. **Amenazas y Oportunidades**: Análisis del entorno

ENFOQUE EN:
- Comparativas directas con competencia
- Share of voice y participación de mercado
- Estrategias ganadoras vs perdedoras
- Oportunidades de diferenciación`;
        break;
        
      case 'innovation':
        prompt += `

FRAMEWORK DE INNOVACIÓN:
1. **Gaps del Mercado**: Necesidades no satisfechas
2. **Tendencias Emergentes**: Nuevos comportamientos y preferencias  
3. **Oportunidades de Producto**: Ideas concretas de innovación
4. **Go-to-Market**: Estrategias de lanzamiento

GENERAR:
- Ideas específicas de nuevos productos/servicios
- Análisis de viabilidad basado en datos
- Estrategias de posicionamiento únicas
- Timeline y recursos recomendados`;
        break;
    }

    prompt += `

PREGUNTA DEL USUARIO: ${request.query}

Responde de manera estructurada, profesional y siempre basándote en la evidencia disponible en los documentos Unilever.`;

    return prompt;
  }

  /**
   * Procesa respuesta del backend a formato estratégico
   */
  private processStrategicResponse(data: any, request: StrategicRAGRequest): StrategicRAGResponse {
    const response: StrategicRAGResponse = {
      answer: data.answer || data.content || '',
      analysis_type: request.analysisType,
      insight_depth: request.insightDepth,
      key_findings: this.extractKeyFindings(data.answer || data.content || ''),
      strategic_recommendations: this.extractRecommendations(data.answer || data.content || ''),
      citations: data.citations || [],
      metadata: {
        chunks_retrieved: data.metadata?.chunks_retrieved || 0,
        processing_time: data.metadata?.processing_time_seconds || 0,
        confidence_score: data.metadata?.confidence || 0,
        strategic_framework: this.getFrameworkName(request.analysisType)
      }
    };

    // Agregar análisis específicos según tipo
    if (request.analysisType === 'competitive') {
      response.competitive_insights = this.extractCompetitiveInsights(data.answer || data.content || '');
    }

    if (request.enableTrendAnalysis) {
      response.trend_analysis = this.extractTrendAnalysis(data.answer || data.content || '');
    }

    return response;
  }

  // Métodos auxiliares para extracción de insights
  private extractKeyFindings(content: string): string[] {
    const keyPhrases = [
      'insight clave', 'hallazgo principal', 'dato importante', 
      'tendencia identificada', 'patrón observado', 'resultado significativo'
    ];
    
    // Lógica simple para extraer findings - se puede mejorar con NLP
    const findings = [];
    const sentences = content.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      if (sentence.length > 50 && sentence.length < 200) {
        for (const phrase of keyPhrases) {
          if (sentence.toLowerCase().includes(phrase)) {
            findings.push(sentence.trim());
            break;
          }
        }
      }
    }
    
    return findings.slice(0, 5); // Máximo 5 key findings
  }

  private extractRecommendations(content: string): string[] {
    const recommendations = [];
    const sentences = content.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if ((lowerSentence.includes('recomend') || 
           lowerSentence.includes('sugier') || 
           lowerSentence.includes('debería') ||
           lowerSentence.includes('conviene')) && 
          sentence.length > 30) {
        recommendations.push(sentence.trim());
      }
    }
    
    return recommendations.slice(0, 3);
  }

  private extractCompetitiveInsights(content: string): string[] {
    const competitive = [];
    const sentences = content.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if ((lowerSentence.includes('competen') || 
           lowerSentence.includes('vs ') || 
           lowerSentence.includes('rival') ||
           lowerSentence.includes('mercado')) && 
          sentence.length > 40) {
        competitive.push(sentence.trim());
      }
    }
    
    return competitive.slice(0, 3);
  }

  private extractTrendAnalysis(content: string): string[] {
    const trends = [];
    const sentences = content.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if ((lowerSentence.includes('tendencia') || 
           lowerSentence.includes('evoluc') || 
           lowerSentence.includes('futuro') ||
           lowerSentence.includes('crec')) && 
          sentence.length > 30) {
        trends.push(sentence.trim());
      }
    }
    
    return trends.slice(0, 3);
  }

  private getFrameworkName(analysisType: string): string {
    const frameworks = {
      descriptive: 'Análisis Descriptivo',
      strategic: 'ANÁLISIS MULTICAPA',
      competitive: 'Inteligencia Competitiva',
      innovation: 'Framework de Innovación'
    };
    return frameworks[analysisType as keyof typeof frameworks] || 'Análisis Estratégico';
  }
}

// Export singleton
export const strategicRAGService = new StrategicRAGService();