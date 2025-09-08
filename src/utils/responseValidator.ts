// utils/responseValidator.ts - Validación de Relevancia de Respuestas RAG

export interface ResponseRelevanceCheck {
  isRelevant: boolean;
  requestedBrand: string | null;
  mentionedBrands: string[];
  relevanceScore: number;
  shouldShowHonestResponse: boolean;
  reasons: string[];
}

export class ResponseValidator {
  
  private static UNILEVER_BRANDS = [
    'Dove', 'Fruco', 'OMO', 'Cif', 'Suave', 'Natura', "Pond's", 
    'Savital', 'Axe', 'Rexona', "Hellmann's", 'Knorr', 'Lipton', 
    'Maizena', 'Fab', 'Aromatel', 'Aromatel 3D'
  ];
  
  /**
   * Detecta qué marca específica se está preguntando
   */
  static detectRequestedBrand(query: string): string | null {
    const queryLower = query.toLowerCase();
    
    for (const brand of this.UNILEVER_BRANDS) {
      const brandLower = brand.toLowerCase();
      // Variaciones comunes
      const variations = [
        brandLower,
        brandLower.replace(/[''´]/g, ''), // Sin apostrofes
        brandLower.replace(/\s/g, ''), // Sin espacios
      ];
      
      if (variations.some(variation => queryLower.includes(variation))) {
        return brand;
      }
    }
    
    return null;
  }
  
  /**
   * Detecta qué marcas se mencionan en la respuesta
   */
  static detectMentionedBrands(response: string): string[] {
    const responseLower = response.toLowerCase();
    const mentioned: string[] = [];
    
    for (const brand of this.UNILEVER_BRANDS) {
      const brandLower = brand.toLowerCase();
      const variations = [
        brandLower,
        brandLower.replace(/[''´]/g, ''),
        brandLower.replace(/\s/g, ''),
      ];
      
      if (variations.some(variation => responseLower.includes(variation))) {
        mentioned.push(brand);
      }
    }
    
    return mentioned;
  }
  
  /**
   * Valida si una respuesta es relevante para la consulta
   */
  static validateRelevance(query: string, response: string): ResponseRelevanceCheck {
    const requestedBrand = this.detectRequestedBrand(query);
    const mentionedBrands = this.detectMentionedBrands(response);
    const reasons: string[] = [];
    
    // Si no se pidió marca específica, cualquier respuesta es válida
    if (!requestedBrand) {
      return {
        isRelevant: true,
        requestedBrand: null,
        mentionedBrands,
        relevanceScore: 1.0,
        shouldShowHonestResponse: false,
        reasons: ['Query general - cualquier información es relevante']
      };
    }
    
    // Check si la marca solicitada está en la respuesta
    const requestedBrandMentioned = mentionedBrands.includes(requestedBrand);
    
    // Calculate relevance score
    let relevanceScore = 0;
    
    if (requestedBrandMentioned) {
      relevanceScore += 0.7; // 70% del score por mencionar la marca
      reasons.push(`✅ Marca solicitada (${requestedBrand}) mencionada en respuesta`);
    } else {
      reasons.push(`❌ Marca solicitada (${requestedBrand}) NO mencionada en respuesta`);
    }
    
    // Penalizar si solo habla de otras marcas
    const onlyOtherBrands = mentionedBrands.length > 0 && !requestedBrandMentioned;
    if (onlyOtherBrands) {
      relevanceScore -= 0.5;
      reasons.push(`❌ Solo menciona otras marcas: ${mentionedBrands.join(', ')}`);
    }
    
    // Bonus si hay contexto relevante sin mencionar otras marcas irrelevantes
    if (requestedBrandMentioned && mentionedBrands.length === 1) {
      relevanceScore += 0.3;
      reasons.push('✅ Respuesta enfocada en la marca solicitada');
    }
    
    // Check for "no information" patterns
    const noInfoPatterns = [
      'no se encuentra información',
      'no hay información disponible',
      'no es posible responder',
      'no se puede identificar',
      'información no disponible'
    ];
    
    const hasNoInfoPattern = noInfoPatterns.some(pattern => 
      response.toLowerCase().includes(pattern)
    );
    
    if (hasNoInfoPattern && !requestedBrandMentioned) {
      // Respuesta honesta sobre falta de información
      relevanceScore = 0.9; // Alta relevancia por ser honesta
      reasons.push('✅ Respuesta honesta sobre falta de información');
    }
    
    // Determine final relevance
    const isRelevant = relevanceScore >= 0.6;
    const shouldShowHonestResponse = !isRelevant && requestedBrand;
    
    return {
      isRelevant,
      requestedBrand,
      mentionedBrands,
      relevanceScore: Math.max(0, Math.min(1, relevanceScore)),
      shouldShowHonestResponse,
      reasons
    };
  }
  
  /**
   * Genera una respuesta honesta cuando no hay información
   */
  static generateHonestResponse(requestedBrand: string, mentionedBrands: string[]): string {
    const hasOtherBrandsInfo = mentionedBrands.length > 0;
    
    let honestResponse = `## Información sobre ${requestedBrand}\n\n`;
    honestResponse += `❌ **No se encontró información específica sobre ${requestedBrand}** en los documentos disponibles.\n\n`;
    
    if (hasOtherBrandsInfo) {
      honestResponse += `📋 **Datos disponibles para otras marcas**: ${mentionedBrands.join(', ')}\n\n`;
      honestResponse += `💡 **Sugerencia**: Podrías preguntar sobre alguna de estas marcas para obtener insights detallados.\n\n`;
    } else {
      honestResponse += `🔍 **Recomendación**: Intenta con una consulta más específica o pregunta sobre otras marcas del portfolio Unilever.\n\n`;
    }
    
    honestResponse += `### Marcas con información disponible:\n`;
    honestResponse += `- **Cuidado Personal**: Dove, Axe, Rexona, Pond's\n`;
    honestResponse += `- **Alimentos**: Fruco, Hellmann's, Knorr, Lipton\n`;
    honestResponse += `- **Cuidado del Hogar**: OMO, Cif, Fab\n\n`;
    
    honestResponse += `_Sistema RAG Unilever - Respuesta honesta sobre disponibilidad de datos_`;
    
    return honestResponse;
  }
  
  /**
   * Mejora una respuesta existente agregando disclaimer si es necesario
   */
  static improveResponse(originalResponse: string, validation: ResponseRelevanceCheck): string {
    if (validation.isRelevant) {
      return originalResponse;
    }
    
    if (validation.shouldShowHonestResponse && validation.requestedBrand) {
      return this.generateHonestResponse(validation.requestedBrand, validation.mentionedBrands);
    }
    
    // Agregar disclaimer a respuesta existente
    let improvedResponse = originalResponse;
    
    if (validation.requestedBrand && !validation.mentionedBrands.includes(validation.requestedBrand)) {
      const disclaimer = `\n\n⚠️ **Nota**: La consulta era específicamente sobre **${validation.requestedBrand}**, pero no se encontró información específica para esta marca en los documentos disponibles. La información mostrada corresponde a otras marcas del portfolio.`;
      improvedResponse += disclaimer;
    }
    
    return improvedResponse;
  }
}

export default ResponseValidator;