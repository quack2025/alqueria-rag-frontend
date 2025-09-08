// utils/responseCleanup.ts - Utilidades para limpiar respuestas del backend

/**
 * Limpia las respuestas del backend eliminando sugerencias automáticas innecesarias
 */
export function cleanRAGResponse(content: string): string {
  if (!content) return content;

  // Patrones para identificar y remover las secciones de sugerencias
  const patternsToRemove = [
    // Patrón principal: "---" seguido de sugerencias
    /---\s*\n\s*### 💡.*?(?=\n\n|$)/gs,
    
    // Patrón específico: "¿Qué más te gustaría explorar?"
    /### 💡 ¿Qué más te gustaría explorar\?.*?(?=\n\n|$)/gs,
    
    // Patrón para secciones de acciones recomendadas
    /\*\*⚡ Acciones Recomendadas\*\*.*?(?=\n\n|$)/gs,
    
    // Patrón para preguntas relacionadas
    /\*\*❓ Preguntas Relacionadas\*\*.*?(?=\n\n|$)/gs,
    
    // Patrón para visualizaciones disponibles
    /\*\*📊 Visualizaciones Disponibles\*\*.*?(?=\n\n|$)/gs,
    
    // Patrón para análisis más profundo
    /\*\*🔍 Análisis Más Profundo\*\*.*?(?=\n\n|$)/gs,
    
    // Patrón genérico para cualquier sección que empiece con emoji + título
    /\*\*[🎯📈🔍⚡❓📊💡🚀].*?\*\*.*?(?=\n\n|$)/gs,
    
    // Texto específico que aparece al final
    /\*Solo menciona qué te interesa y te ayudo a profundizar en esa área\.\*/g,
    
    // Limpiar múltiples líneas vacías consecutivas
    /\n{3,}/g
  ];

  let cleanedContent = content;

  // Aplicar todos los patrones de limpieza
  patternsToRemove.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });

  // Limpiar espacios y líneas vacías al final
  cleanedContent = cleanedContent
    .replace(/\n{3,}/g, '\n\n') // Máximo 2 líneas consecutivas
    .replace(/\s+$/g, '') // Remover espacios al final
    .trim();

  return cleanedContent;
}

/**
 * Limpia específicamente las sugerencias de Tigo que aparecen en respuestas de Unilever
 */
export function removeIncorrectBrandSuggestions(content: string): string {
  if (!content) return content;

  // Patrones específicos para remover referencias incorrectas
  const incorrectPatterns = [
    // Referencias a Tigo en lugar de Unilever
    /¿Cuál es la penetración de Tigo por ciudad\?/g,
    /¿Cuáles son las ventajas competitivas de Tigo vs Claro\?/g,
    /¿Cómo perciben los usuarios la calidad de señal de cada operador\?/g,
    /análisis competitivo con Claro/g,
    
    // Referencias a Honduras cuando debería ser Colombia
    /Honduras|hondureña|hondureño/gi
  ];

  let cleanedContent = content;

  incorrectPatterns.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '');
  });

  return cleanedContent;
}

/**
 * Función principal que aplica todas las limpiezas
 */
export function processRAGResponse(content: string): string {
  let processed = content;
  
  // Aplicar limpiezas en secuencia
  processed = cleanRAGResponse(processed);
  processed = removeIncorrectBrandSuggestions(processed);
  
  return processed;
}