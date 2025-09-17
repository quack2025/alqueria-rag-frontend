// test_creative_module.js - Test específico del módulo creativo refactorizado
import fetch from 'node-fetch';

const API_URL = 'https://web-production-ef8db.up.railway.app';

// Prompts creativos específicos para probar
const creativeQueries = [
  {
    name: "Campaña Revolucionaria Dove",
    query: "Basándote en las percepciones actuales de Dove sobre hidratación y beneficios para la piel, diseña una campaña disruptiva que conecte con mujeres colombianas millennials y posicione Dove como el líder absoluto en self-care auténtico. La campaña debe leveragear el aroma como diferenciador clave.",
    expectedKeywords: ["hidratación", "aroma", "millennials", "self-care", "campaña"]
  },
  {
    name: "Innovación Disruptiva Fruco",
    query: "Considerando el liderazgo de Fruco en salsa de tomate y su ventaja competitiva en sabor, propón 3 innovaciones revolucionarias de producto que mantengan la preferencia de sabor tradicional pero conquisten completamente nuevos momentos de consumo y nuevas audiencias.",
    expectedKeywords: ["fruco", "liderazgo", "sabor", "innovación", "momentos"]
  },
  {
    name: "Estrategia Premium Pond's",
    query: "Basándote en los datos de tracking post-lanzamiento de Pond's y los insights sobre calidad percibida, desarrolla una estrategia completa para posicionar Pond's como la marca premium #1 en cuidado facial, superando a la competencia en diferenciación y propuesta de valor.",
    expectedKeywords: ["pond's", "premium", "tracking", "diferenciación", "competencia"]
  },
  {
    name: "Cross-Brand Synergy",
    query: "Analiza las fortalezas de marca entre Dove, Fruco y Pond's en diferentes segmentos demográficos y diseña una estrategia de cross-selling innovadora que genere sinergias únicas entre estas marcas del portfolio Unilever. Incluye activaciones específicas por NSE.",
    expectedKeywords: ["dove", "fruco", "pond's", "cross-selling", "portfolio", "nse"]
  }
];

async function testCreativeQuery(testCase, creativityLevel = 75) {
  console.log(`\n🎨 TESTING: ${testCase.name}`);
  console.log('─'.repeat(80));
  console.log(`PROMPT: ${testCase.query.substring(0, 100)}...`);
  console.log(`CREATIVIDAD: ${creativityLevel}%`);
  console.log('─'.repeat(80));
  
  try {
    // Construir el prompt exacto como lo hace el módulo
    const creativePrompt = `MODO CREATIVO ACTIVADO - Nivel ${creativityLevel}%

INSTRUCCIONES ESPECIALES PARA CREATIVIDAD:
Como consultor creativo de Unilever Colombia, necesito que generes ideas innovadoras, conceptos de campaña y propuestas estratégicas basándote EXCLUSIVAMENTE en los datos reales de investigación disponibles en el contexto.

NIVEL DE CREATIVIDAD: ${creativityLevel}% (donde 100% = máxima innovación y disrupción)

SOLICITUD ORIGINAL: ${testCase.query}

ESTRUCTURA DE RESPUESTA REQUERIDA:
1. **💡 INSIGHT CLAVE** (basado en datos reales)
2. **🎯 CONCEPTO CREATIVO** (innovador pero sustentado)
3. **📊 FUNDAMENTACIÓN** (citas específicas de datos)
4. **🚀 PROPUESTA DE EJECUCIÓN** (tactical y específica)
5. **📈 IMPACTO ESPERADO** (métricas y KPIs)

IMPORTANTE: Todas las ideas deben estar fundamentadas en insights reales del consumidor colombiano de Unilever, no en conocimiento general.`;

    const response = await fetch(`${API_URL}/api/rag-hybrid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: creativePrompt,
        metadata_filter: null,
        output_types: ["text", "chart", "table"],
        response_customization: {
          extension_level: 'detallado',
          response_style: 'creativo_ejecutivo',
          detail_level: 15,
          language: 'español',
          target_audience: 'marketing_creatives',
          include_citations: true,
          temporal_context: 'completo',
          analysis_type: 'creativo_innovador',
          output_format: 'estructurado',
          creativity_boost: creativityLevel / 100,
          similarity_threshold: 0.018
        },
        search_configuration: {
          similarity_threshold: 0.018,
          max_chunks: 15
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Analizar respuesta creativa
    const hasContent = data.answer && data.answer.length > 1000; // Más exigente para creativos
    const hasCitations = data.citations && data.citations.length > 0;
    const hasChunks = data.metadata?.chunks_retrieved > 0;
    const hasStructure = data.answer && [
      'INSIGHT CLAVE', 'CONCEPTO CREATIVO', 'FUNDAMENTACIÓN', 'PROPUESTA', 'IMPACTO'
    ].some(section => data.answer.includes(section));
    const hasKeywords = testCase.expectedKeywords.some(keyword => 
      data.answer?.toLowerCase().includes(keyword.toLowerCase())
    );
    
    console.log(`✅ CONTENIDO: ${hasContent ? 'Sí' : 'No'} (${data.answer?.length || 0} chars)`);
    console.log(`✅ CITAS RAG: ${hasCitations ? 'Sí' : 'No'} (${data.citations?.length || 0} citas)`);
    console.log(`✅ CHUNKS: ${hasChunks ? 'Sí' : 'No'} (${data.metadata?.chunks_retrieved || 0} chunks)`);
    console.log(`🎯 ESTRUCTURA: ${hasStructure ? 'Sí' : 'No'} (formato creativo estructurado)`);
    console.log(`🏷️ KEYWORDS: ${hasKeywords ? 'Sí' : 'No'} (términos específicos presentes)`);
    console.log(`⏱️ TIEMPO: ${data.metadata?.processing_time_seconds?.toFixed(2) || 'N/A'}s`);
    
    // Evaluación de calidad creativa
    const creativeScore = [hasContent, hasCitations, hasChunks, hasStructure, hasKeywords].filter(Boolean).length;
    const creativeEmoji = creativeScore >= 4 ? '🟢' : creativeScore >= 3 ? '🟡' : '🔴';
    
    console.log(`${creativeEmoji} CALIDAD CREATIVA: ${creativeScore}/5`);
    
    // Mostrar sample de respuesta
    if (data.answer) {
      console.log(`\n📝 SAMPLE CREATIVO:`);
      console.log('─'.repeat(50));
      console.log(data.answer.substring(0, 400) + '...');
    }
    
    // Mostrar citas clave
    if (data.citations && data.citations.length > 0) {
      console.log(`\n📊 FUNDAMENTACIÓN RAG:`);
      console.log('─'.repeat(50));
      data.citations.slice(0, 2).forEach((citation, i) => {
        console.log(`${i+1}. [${citation.document_name}]`);
        console.log(`   "${citation.text?.substring(0, 120) || 'N/A'}..."`);
      });
    }
    
    return {
      name: testCase.name,
      score: creativeScore,
      hasRAGData: hasCitations,
      hasStructure,
      responseLength: data.answer?.length || 0,
      processingTime: data.metadata?.processing_time_seconds
    };
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return {
      name: testCase.name,
      score: 0,
      error: error.message
    };
  }
}

async function runCreativeTests() {
  console.log('🎨 TESTING MÓDULO CREATIVO REFACTORIZADO - UNILEVER RAG');
  console.log('════════════════════════════════════════════════════════════════════════════════');
  
  const results = [];
  
  for (let i = 0; i < creativeQueries.length; i++) {
    const result = await testCreativeQuery(creativeQueries[i]);
    results.push(result);
    
    // Pausa entre requests
    if (i < creativeQueries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Resumen final
  console.log('\n🎯 RESUMEN DE TESTING CREATIVO');
  console.log('════════════════════════════════════════════════════════════════════════════════');
  
  const qualityStats = results.reduce((acc, result) => {
    acc[result.score] = (acc[result.score] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`🟢 Excelentes (4-5/5): ${(qualityStats[5] || 0) + (qualityStats[4] || 0)}`);
  console.log(`🟡 Buenas (3/5): ${qualityStats[3] || 0}`);
  console.log(`🟠 Regulares (2/5): ${qualityStats[2] || 0}`);
  console.log(`🔴 Pobres (0-1/5): ${(qualityStats[1] || 0) + (qualityStats[0] || 0)}`);
  
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  console.log(`\n📊 SCORE PROMEDIO: ${avgScore.toFixed(1)}/5.0`);
  
  const ragDataCount = results.filter(r => r.hasRAGData).length;
  console.log(`📚 RESPUESTAS CON DATOS RAG: ${ragDataCount}/${results.length} (${((ragDataCount/results.length)*100).toFixed(1)}%)`);
  
  console.log('\n✅ TESTING CREATIVO COMPLETADO');
  console.log(`🎨 VEREDICTO: ${avgScore >= 4 ? 'MÓDULO CREATIVO FUNCIONANDO EXCELENTE' : avgScore >= 3 ? 'MÓDULO CREATIVO FUNCIONANDO BIEN' : 'MÓDULO CREATIVO NECESITA MEJORAS'}`);
}

// Ejecutar tests
runCreativeTests().catch(console.error);