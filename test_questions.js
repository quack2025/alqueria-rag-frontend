// test_questions.js - Script para probar preguntas sugeridas
import fetch from 'node-fetch';

const API_URL = 'https://web-production-ef8db.up.railway.app';

// Preguntas de prueba seleccionadas
const testQuestions = [
  // Marcas y Productos
  "¿Cuáles son las percepciones principales sobre Dove?",
  "¿Cómo se posiciona Fruco versus la competencia?", 
  "¿Qué insights tienes sobre Knorr en el mercado?",
  "¿Qué diferenciadores tiene Pond's versus otras marcas?",
  
  // Segmentación y Audiencias  
  "¿Cuáles son los segmentos principales de consumidores?",
  "¿Cómo varía el comportamiento por edad y género?",
  
  // Comportamiento del Consumidor
  "¿Qué factores influyen en la decisión de compra?",
  "¿Cómo es el journey del consumidor de productos de belleza?",
  
  // Tendencias y Mercado
  "¿Cuáles son las tendencias emergentes en cuidado personal?",
  "¿Cómo está evolucionando el mercado post-pandemia?"
];

async function testQuestion(question, index) {
  console.log(`\n🧪 PREGUNTA ${index + 1}: ${question}`);
  console.log('─'.repeat(80));
  
  try {
    const response = await fetch(`${API_URL}/api/rag-pure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: question,
        metadata_filter: null,
        output_types: ["text"],
        response_customization: {
          extension_level: 'detallado',
          response_style: 'ejecutivo',
          detail_level: 15,
          language: 'español',
          target_audience: 'gerentes',
          include_citations: true,
          temporal_context: 'completo',
          analysis_type: 'predictivo',
          output_format: 'narrativo',
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
    
    // Analizar respuesta
    const hasContent = data.answer && data.answer.length > 100;
    const hasCitations = data.citations && data.citations.length > 0;
    const hasChunks = data.metadata?.chunks_retrieved > 0;
    const hasRelevantData = data.metadata?.similarity_scores && data.metadata.similarity_scores.some(score => score > 0.02);
    
    console.log(`✅ CONTENIDO: ${hasContent ? 'Sí' : 'No'} (${data.answer?.length || 0} chars)`);
    console.log(`✅ CITAS: ${hasCitations ? 'Sí' : 'No'} (${data.citations?.length || 0} citas)`);
    console.log(`✅ CHUNKS: ${hasChunks ? 'Sí' : 'No'} (${data.metadata?.chunks_retrieved || 0} chunks)`);
    console.log(`✅ RELEVANCIA: ${hasRelevantData ? 'Sí' : 'No'} (max: ${Math.max(...(data.metadata?.similarity_scores || [0])).toFixed(3)})`);
    console.log(`⏱️ TIEMPO: ${data.metadata?.processing_time_seconds?.toFixed(2) || 'N/A'}s`);
    
    // Evaluar calidad general
    const qualityScore = [hasContent, hasCitations, hasChunks, hasRelevantData].filter(Boolean).length;
    const qualityEmoji = qualityScore >= 3 ? '🟢' : qualityScore >= 2 ? '🟡' : '🔴';
    
    console.log(`${qualityEmoji} CALIDAD: ${qualityScore}/4 - ${getQualityLabel(qualityScore)}`);
    
    // Mostrar un snippet de la respuesta
    if (data.answer) {
      console.log(`\n📝 RESPUESTA PREVIEW:`);
      console.log(data.answer.substring(0, 200) + '...');
    }
    
    return {
      question,
      quality: qualityScore,
      hasContent,
      hasCitations,
      hasChunks,
      hasRelevantData,
      processingTime: data.metadata?.processing_time_seconds,
      responseLength: data.answer?.length || 0
    };
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return {
      question,
      quality: 0,
      error: error.message
    };
  }
}

function getQualityLabel(score) {
  switch(score) {
    case 4: return 'Excelente';
    case 3: return 'Buena';
    case 2: return 'Regular';  
    case 1: return 'Pobre';
    default: return 'Sin datos';
  }
}

async function runTests() {
  console.log('🚀 INICIANDO TESTS DE PREGUNTAS SUGERIDAS DE UNILEVER');
  console.log('═'.repeat(80));
  
  const results = [];
  
  for (let i = 0; i < testQuestions.length; i++) {
    const result = await testQuestion(testQuestions[i], i);
    results.push(result);
    
    // Pausa entre requests para no sobrecargar
    if (i < testQuestions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DE RESULTADOS');
  console.log('═'.repeat(80));
  
  const qualityStats = results.reduce((acc, result) => {
    acc[result.quality] = (acc[result.quality] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`🟢 Excelentes (4/4): ${qualityStats[4] || 0}`);
  console.log(`🟡 Buenas (3/4): ${qualityStats[3] || 0}`); 
  console.log(`🟠 Regulares (2/4): ${qualityStats[2] || 0}`);
  console.log(`🔴 Pobres (0-1/4): ${(qualityStats[1] || 0) + (qualityStats[0] || 0)}`);
  
  const avgQuality = results.reduce((sum, r) => sum + r.quality, 0) / results.length;
  console.log(`\n📈 CALIDAD PROMEDIO: ${avgQuality.toFixed(1)}/4.0`);
  
  // Preguntas problemáticas
  const problematic = results.filter(r => r.quality < 2);
  if (problematic.length > 0) {
    console.log(`\n⚠️ PREGUNTAS PROBLEMÁTICAS:`);
    problematic.forEach(r => {
      console.log(`❌ ${r.question}`);
    });
  }
  
  console.log('\n✅ TESTS COMPLETADOS');
}

// Ejecutar tests
runTests().catch(console.error);