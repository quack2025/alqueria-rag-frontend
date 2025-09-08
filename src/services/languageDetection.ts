// Language Detection Service
// Detects the language of user input and provides instructions for multilingual responses

export interface LanguageDetectionResult {
  detectedLanguage: 'en' | 'es' | 'fr' | 'unknown';
  confidence: number;
  responseLanguage: string;
  instructions: string;
}

// Language patterns and keywords for detection
const LANGUAGE_PATTERNS = {
  en: {
    keywords: [
      'the', 'and', 'or', 'but', 'with', 'for', 'this', 'that', 'what', 'how', 'when', 'where', 'why',
      'analysis', 'insights', 'market', 'consumer', 'brand', 'product', 'strategy', 'competition',
      'behavior', 'trends', 'segment', 'positioning', 'opportunity', 'growth', 'performance'
    ],
    phrases: [
      'what are', 'how is', 'can you', 'tell me', 'show me', 'I need', 'I want', 'help me',
      'market research', 'consumer insights', 'brand analysis', 'competitive analysis'
    ],
    patterns: [
      /\b(what|how|when|where|why|who)\b/gi,
      /\b(analysis|insights|market|consumer|brand)\b/gi,
      /\b(the|and|or|but|with|for|this|that)\b/gi
    ]
  },
  es: {
    keywords: [
      'el', 'la', 'los', 'las', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'como', 'cuando', 'donde',
      'análisis', 'insights', 'mercado', 'consumidor', 'marca', 'producto', 'estrategia', 'competencia',
      'comportamiento', 'tendencias', 'segmento', 'posicionamiento', 'oportunidad', 'crecimiento'
    ],
    phrases: [
      'qué son', 'cómo es', 'puedes', 'dime', 'muéstrame', 'necesito', 'quiero', 'ayúdame',
      'investigación de mercado', 'insights de consumidor', 'análisis de marca', 'análisis competitivo'
    ],
    patterns: [
      /\b(qué|cómo|cuándo|dónde|por qué|quién)\b/gi,
      /\b(análisis|insights|mercado|consumidor|marca)\b/gi,
      /\b(el|la|los|las|de|del|en|con|por)\b/gi
    ]
  },
  fr: {
    keywords: [
      'le', 'la', 'les', 'de', 'du', 'des', 'en', 'avec', 'pour', 'que', 'comme', 'quand', 'où',
      'analyse', 'insights', 'marché', 'consommateur', 'marque', 'produit', 'stratégie', 'concurrence',
      'comportement', 'tendances', 'segment', 'positionnement', 'opportunité', 'croissance'
    ],
    phrases: [
      'que sont', 'comment est', 'pouvez-vous', 'dis-moi', 'montrez-moi', 'j\'ai besoin', 'je veux', 'aidez-moi',
      'étude de marché', 'insights consommateur', 'analyse de marque', 'analyse concurrentielle'
    ],
    patterns: [
      /\b(que|comment|quand|où|pourquoi|qui)\b/gi,
      /\b(analyse|insights|marché|consommateur|marque)\b/gi,
      /\b(le|la|les|de|du|des|en|avec)\b/gi
    ]
  }
};

// Response instructions for each language
const RESPONSE_INSTRUCTIONS = {
  en: "Please respond in English. Use clear, professional language suitable for business analysis. Include specific data points and actionable insights.",
  es: "Por favor responde en español. Usa un lenguaje claro y profesional adecuado para análisis de negocio. Incluye datos específicos e insights accionables.",
  fr: "Veuillez répondre en français. Utilisez un langage clair et professionnel adapté à l'analyse commerciale. Incluez des données spécifiques et des insights exploitables.",
  unknown: "Respond in the same language as the user's question. If unclear, default to English."
};

/**
 * Detects the language of the input text
 * @param text - The input text to analyze
 * @param currentLanguage - Current i18n language setting (optional)
 */
export function detectLanguage(text: string, currentLanguage?: string): LanguageDetectionResult {
  if (!text || text.trim().length < 3) {
    return {
      detectedLanguage: 'unknown',
      confidence: 0,
      responseLanguage: 'en',
      instructions: RESPONSE_INSTRUCTIONS.unknown
    };
  }

  const normalizedText = text.toLowerCase().trim();
  const scores = {
    en: 0,
    es: 0,
    fr: 0
  };

  // Score based on keywords
  Object.entries(LANGUAGE_PATTERNS).forEach(([lang, patterns]) => {
    // Keyword matching
    patterns.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = normalizedText.match(regex);
      if (matches) {
        scores[lang as keyof typeof scores] += matches.length * 1;
      }
    });

    // Phrase matching (higher weight)
    patterns.phrases.forEach(phrase => {
      if (normalizedText.includes(phrase.toLowerCase())) {
        scores[lang as keyof typeof scores] += 3;
      }
    });

    // Pattern matching
    patterns.patterns.forEach(pattern => {
      const matches = normalizedText.match(pattern);
      if (matches) {
        scores[lang as keyof typeof scores] += matches.length * 0.5;
      }
    });
  });

  // Additional Spanish-specific checks
  if (/[ñáéíóúü]/.test(normalizedText)) {
    scores.es += 5;
  }

  // Additional French-specific checks  
  if (/[àâäçéèêëïîôöùûüÿ]/.test(normalizedText)) {
    scores.fr += 5;
  }

  // Find highest scoring language
  const maxScore = Math.max(...Object.values(scores));
  const detectedLang = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as 'en' | 'es' | 'fr' || 'unknown';

  // Calculate confidence based on score and text length
  const totalWords = normalizedText.split(/\s+/).length;
  let confidence = Math.min(maxScore / Math.max(totalWords * 0.3, 1), 1);

  // If confidence is too low or we have a current language setting, use that instead
  let finalDetectedLang = confidence < 0.3 ? 'unknown' : detectedLang;
  
  // If we have a current language from i18n and text analysis didn't provide strong confidence, use i18n language
  if (currentLanguage && confidence < 0.7) {
    const mappedLang = currentLanguage === 'en' ? 'en' : currentLanguage === 'es' ? 'es' : currentLanguage === 'fr' ? 'fr' : 'unknown';
    if (mappedLang !== 'unknown') {
      finalDetectedLang = mappedLang;
      // Boost confidence when using i18n language
      confidence = Math.max(confidence, 0.8);
    }
  }
  
  return {
    detectedLanguage: finalDetectedLang,
    confidence: confidence,
    responseLanguage: finalDetectedLang === 'unknown' ? 'en' : finalDetectedLang,
    instructions: RESPONSE_INSTRUCTIONS[finalDetectedLang] || RESPONSE_INSTRUCTIONS.unknown
  };
}

/**
 * Gets the appropriate system instruction for multilingual responses
 * @param userQuery - The user's query text
 * @param currentLanguage - Current i18n language setting (optional)
 */
export function getMultilingualInstruction(userQuery: string, currentLanguage?: string): string {
  const detection = detectLanguage(userQuery, currentLanguage);
  
  const baseInstruction = `
IMPORTANT - LANGUAGE INSTRUCTION:
${detection.instructions}

Language Detection Results:
- Detected: ${detection.detectedLanguage}
- Confidence: ${(detection.confidence * 100).toFixed(1)}%
- Response Language: ${detection.responseLanguage}

`;

  // Add specific formatting instructions based on detected language
  switch (detection.responseLanguage) {
    case 'es':
      return baseInstruction + `
Formato de respuesta en español:
- Usa terminología de marketing en español (ej: "insights del consumidor", "análisis de mercado")
- Incluye acentos correctos y gramática española
- Usa moneda en pesos colombianos (COP) cuando sea relevante
- Menciona contexto colombiano cuando sea apropiado
`;
    case 'fr':
      return baseInstruction + `
Format de réponse en français:
- Utilisez la terminologie marketing française (ex: "insights consommateur", "analyse marché")
- Incluez les accents corrects et la grammaire française
- Utilisez l'euro (EUR) quand pertinent
- Mentionnez le contexte européen quand approprié
`;
    case 'en':
    default:
      return baseInstruction + `
English response format:
- Use professional business English terminology
- Include currency in USD when relevant  
- Mention regional context (Latin America) when appropriate
- Use clear, actionable language for business insights
`;
  }
}

/**
 * Formats a query with language detection metadata for backend
 */
export function formatQueryWithLanguageContext(query: string): { query: string; languageContext: LanguageDetectionResult } {
  const languageContext = detectLanguage(query);
  
  return {
    query: query,
    languageContext
  };
}

export default {
  detectLanguage,
  getMultilingualInstruction,
  formatQueryWithLanguageContext
};