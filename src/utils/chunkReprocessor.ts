// utils/chunkReprocessor.ts - Utilidades para re-procesar chunks existentes con normalización

import { TextNormalizer } from './textNormalization';

export interface ChunkData {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  source?: string;
  similarity?: number;
}

export interface ReprocessingResult {
  totalChunks: number;
  processedChunks: number;
  changedChunks: number;
  errors: string[];
  summary: {
    pondsChunksFound: number;
    pondsChunksNormalized: number;
    normalizationExamples: Array<{
      original: string;
      normalized: string;
    }>;
  };
}

/**
 * Clase para re-procesar chunks existentes aplicando normalización de texto
 */
export class ChunkReprocessor {
  
  /**
   * Simula el re-procesamiento de chunks (para demostración)
   * En implementación real, esto conectaría con el backend
   */
  static async simulateReprocessing(chunks: ChunkData[]): Promise<ReprocessingResult> {
    const result: ReprocessingResult = {
      totalChunks: chunks.length,
      processedChunks: 0,
      changedChunks: 0,
      errors: [],
      summary: {
        pondsChunksFound: 0,
        pondsChunksNormalized: 0,
        normalizationExamples: []
      }
    };

    for (const chunk of chunks) {
      try {
        const originalContent = chunk.content;
        const normalizedContent = TextNormalizer.normalizeContent(originalContent);
        
        result.processedChunks++;
        
        if (originalContent !== normalizedContent) {
          result.changedChunks++;
          
          // Detectar chunks de Pond's
          if (TextNormalizer.containsPondsReferences(originalContent)) {
            result.summary.pondsChunksFound++;
            result.summary.pondsChunksNormalized++;
            
            // Guardar ejemplos de normalización
            if (result.summary.normalizationExamples.length < 5) {
              result.summary.normalizationExamples.push({
                original: originalContent.substring(0, 100) + '...',
                normalized: normalizedContent.substring(0, 100) + '...'
              });
            }
          }
        } else if (TextNormalizer.containsPondsReferences(originalContent)) {
          result.summary.pondsChunksFound++;
        }
        
      } catch (error) {
        result.errors.push(`Error processing chunk ${chunk.id}: ${error}`);
      }
    }

    return result;
  }

  /**
   * Genera un reporte de chunks que necesitan normalización
   */
  static analyzeChunksForNormalization(chunks: ChunkData[]): {
    needsNormalization: ChunkData[];
    pondsChunks: ChunkData[];
    inconsistencies: Array<{
      chunkId: string;
      issues: string[];
      suggestions: string[];
    }>;
  } {
    const needsNormalization: ChunkData[] = [];
    const pondsChunks: ChunkData[] = [];
    const inconsistencies: Array<{
      chunkId: string;
      issues: string[];
      suggestions: string[];
    }> = [];

    for (const chunk of chunks) {
      const originalContent = chunk.content;
      const normalizedContent = TextNormalizer.normalizeContent(originalContent);
      
      if (originalContent !== normalizedContent) {
        needsNormalization.push(chunk);
      }
      
      if (TextNormalizer.containsPondsReferences(originalContent)) {
        pondsChunks.push(chunk);
        
        const issues: string[] = [];
        const suggestions: string[] = [];
        
        // Detectar inconsistencias específicas
        if (originalContent.includes('Pond´s')) {
          issues.push('Usa acento grave (´) en lugar de apostrofe (\')');
          suggestions.push('Normalizar a POND\'S');
        }
        
        if (originalContent.toLowerCase().includes('ponds ')) {
          issues.push('Falta apostrofe en nombre de marca');
          suggestions.push('Agregar apostrofe: POND\'S');
        }
        
        if (/pond[´'`]?s/gi.test(originalContent) && issues.length > 0) {
          inconsistencies.push({
            chunkId: chunk.id,
            issues,
            suggestions
          });
        }
      }
    }

    return {
      needsNormalization,
      pondsChunks,
      inconsistencies
    };
  }

  /**
   * Prepara payload para actualización de chunks en el backend
   */
  static prepareChunkUpdatePayload(chunks: ChunkData[]): Array<{
    id: string;
    originalContent: string;
    normalizedContent: string;
    hasChanges: boolean;
    isPondsRelated: boolean;
  }> {
    return chunks.map(chunk => {
      const originalContent = chunk.content;
      const normalizedContent = TextNormalizer.normalizeContent(originalContent);
      
      return {
        id: chunk.id,
        originalContent,
        normalizedContent,
        hasChanges: originalContent !== normalizedContent,
        isPondsRelated: TextNormalizer.containsPondsReferences(originalContent)
      };
    });
  }
}

/**
 * Utilidad para generar reportes de normalización
 */
export class NormalizationReporter {
  
  static generateReport(result: ReprocessingResult): string {
    const report = `
# 📊 REPORTE DE NORMALIZACIÓN DE CHUNKS

## Resumen General
- **Total de chunks procesados**: ${result.processedChunks}/${result.totalChunks}
- **Chunks modificados**: ${result.changedChunks}
- **Errores encontrados**: ${result.errors.length}

## Resultados Específicos de Pond's
- **Chunks de Pond's encontrados**: ${result.summary.pondsChunksFound}
- **Chunks de Pond's normalizados**: ${result.summary.pondsChunksNormalized}

## Ejemplos de Normalización
${result.summary.normalizationExamples.map((example, index) => `
### Ejemplo ${index + 1}
**Original**: ${example.original}
**Normalizado**: ${example.normalized}
`).join('\n')}

## Errores
${result.errors.length > 0 ? result.errors.join('\n- ') : 'No se encontraron errores'}

---
*Reporte generado el ${new Date().toLocaleString()}*
    `;
    
    return report.trim();
  }
}

// Función de utilidad para testing
export function mockChunkData(): ChunkData[] {
  return [
    {
      id: 'chunk_1',
      content: 'El estudio de Pond´s mostró que las consumidoras valoran la hidratación.',
      source: 'UNILEVER_PONDS_Feb2021.pdf'
    },
    {
      id: 'chunk_2', 
      content: 'POND\'S es la marca líder en cuidado facial premium.',
      source: 'UNILEVER_PONDS_Jul2021.pdf'
    },
    {
      id: 'chunk_3',
      content: 'Los insights sobre ponds revelan oportunidades de crecimiento.',
      source: 'UNILEVER_PONDS_Sep2021.pdf'
    },
    {
      id: 'chunk_4',
      content: 'Fruco mantiene su posición como líder en salsas.',
      source: 'UNILEVER_FRUCO_2022.pdf'
    }
  ];
}