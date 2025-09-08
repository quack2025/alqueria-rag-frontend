// utils/textNormalization.ts - Normalización de texto para mejorar consistencia en embeddings

/**
 * Normaliza nombres de marcas para resolver inconsistencias tipográficas
 * que causan problemas en embeddings y similarity scores
 */
export class TextNormalizer {
  
  /**
   * Normaliza todas las variaciones de nombres de marcas Unilever
   */
  static normalizeBrandNames(text: string): string {
    let normalizedText = text;

    // ✅ POND'S - Resolver inconsistencias tipográficas críticas
    // Problema: "POND'S", "Pond´s", "ponds" generan embeddings diferentes
    normalizedText = normalizedText.replace(/pond[´'`]?s?/gi, 'PONDS');
    
    // Mantener formato con apostrofe para legibilidad en contextos específicos
    normalizedText = normalizedText.replace(/\bPONDS\b/g, "POND'S");
    
    // ✅ Otras marcas Unilever - Normalización preventiva
    normalizedText = normalizedText.replace(/\bfruco\b/gi, 'Fruco');
    normalizedText = normalizedText.replace(/\bdove\b/gi, 'Dove');
    normalizedText = normalizedText.replace(/\bomo\b/gi, 'OMO');
    normalizedText = normalizedText.replace(/\bcif\b/gi, 'Cif');
    normalizedText = normalizedText.replace(/\bsuave\b/gi, 'Suave');
    normalizedText = normalizedText.replace(/\bnatura\b/gi, 'Natura');
    normalizedText = normalizedText.replace(/\bmaizena\b/gi, 'Maizena');
    normalizedText = normalizedText.replace(/\bhellmans?\b/gi, "Hellmann's");
    normalizedText = normalizedText.replace(/\bknorr?\b/gi, 'Knorr');
    normalizedText = normalizedText.replace(/\blipton\b/gi, 'Lipton');
    normalizedText = normalizedText.replace(/\brexona\b/gi, 'Rexona');
    normalizedText = normalizedText.replace(/\baxe\b/gi, 'Axe');
    normalizedText = normalizedText.replace(/\bsavital\b/gi, 'Savital');

    return normalizedText;
  }

  /**
   * Normaliza términos específicos de estudios para mejorar matching
   */
  static normalizeStudyTerms(text: string): string {
    let normalizedText = text;
    
    // Normalizar términos de tracking
    normalizedText = normalizedText.replace(/tracking\s*post\s*lanzamiento/gi, 'TrackingPostLanzamiento');
    normalizedText = normalizedText.replace(/post\s*launch/gi, 'PostLaunch');
    normalizedText = normalizedText.replace(/concept\s*test/gi, 'ConceptTest');
    
    return normalizedText;
  }

  /**
   * Normalización completa para queries entrantes
   */
  static normalizeQuery(query: string): string {
    let normalizedQuery = query;
    
    // Aplicar normalización de marcas
    normalizedQuery = this.normalizeBrandNames(normalizedQuery);
    
    // Aplicar normalización de términos de estudios
    normalizedQuery = this.normalizeStudyTerms(normalizedQuery);
    
    return normalizedQuery;
  }

  /**
   * Normalización para contenido de chunks (para re-indexación)
   */
  static normalizeContent(content: string): string {
    let normalizedContent = content;
    
    // Aplicar todas las normalizaciones
    normalizedContent = this.normalizeBrandNames(normalizedContent);
    normalizedContent = this.normalizeStudyTerms(normalizedContent);
    
    return normalizedContent;
  }

  /**
   * Detecta si un texto contiene referencias a Pond's que necesitan normalización
   */
  static containsPondsReferences(text: string): boolean {
    const pondsRegex = /pond[´'`]?s?/gi;
    return pondsRegex.test(text);
  }

  /**
   * Genera variaciones de búsqueda para mejorar matching
   */
  static generateSearchVariations(query: string): string[] {
    const variations: string[] = [query];
    
    if (this.containsPondsReferences(query)) {
      // Agregar variaciones específicas para Pond's
      const baseQuery = query.replace(/pond[´'`]?s?/gi, 'PONDS');
      variations.push(
        baseQuery.replace(/PONDS/g, "POND'S"),
        baseQuery.replace(/PONDS/g, "Pond´s"),
        baseQuery.replace(/PONDS/g, "ponds"),
        `${baseQuery} UNILEVER TrackingPostLanzamiento`,
        `${baseQuery} limpiador facial agua micelar`
      );
    }
    
    return [...new Set(variations)]; // Remover duplicados
  }
}

/**
 * Hook para debugging de normalización
 */
export function debugNormalization(originalText: string): {
  original: string;
  normalized: string;
  hasChanges: boolean;
  pondsDetected: boolean;
  variations: string[];
} {
  const normalized = TextNormalizer.normalizeQuery(originalText);
  const pondsDetected = TextNormalizer.containsPondsReferences(originalText);
  const variations = TextNormalizer.generateSearchVariations(originalText);
  
  return {
    original: originalText,
    normalized,
    hasChanges: originalText !== normalized,
    pondsDetected,
    variations
  };
}