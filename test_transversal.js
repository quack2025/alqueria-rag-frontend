// test_transversal.js - Test específico para preguntas transversales
import fetch from 'node-fetch';

const API_URL = 'https://web-production-ef8db.up.railway.app';

// Pregunta transversal específica para probar
const transversalQuestion = "¿Cómo las evaluaciones de marca influyen en estrategias de desarrollo de productos a través de diferentes categorías?";

async function testTransversalQuestion() {
  console.log('🔍 TESTING PREGUNTA TRANSVERSAL DE UNILEVER RAG');
  console.log('═'.repeat(80));
  console.log(`PREGUNTA: ${transversalQuestion}`);
  console.log('─'.repeat(80));
  
  try {
    const response = await fetch(`${API_URL}/api/rag-pure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: transversalQuestion,
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
    const hasContent = data.answer && data.answer.length > 500; // Más exigente para transversal
    const hasCitations = data.citations && data.citations.length > 0;
    const hasChunks = data.metadata?.chunks_retrieved > 0;
    const citationsSources = data.citations ? [...new Set(data.citations.map(c => c.document_name))] : [];
    const isTransversal = citationsSources.length > 2; // Múltiples documentos = transversal
    
    console.log(`✅ CONTENIDO: ${hasContent ? 'Sí' : 'No'} (${data.answer?.length || 0} chars)`);
    console.log(`✅ CITAS: ${hasCitations ? 'Sí' : 'No'} (${data.citations?.length || 0} citas)`);
    console.log(`✅ CHUNKS: ${hasChunks ? 'Sí' : 'No'} (${data.metadata?.chunks_retrieved || 0} chunks)`);
    console.log(`🔍 TRANSVERSAL: ${isTransversal ? 'Sí' : 'No'} (${citationsSources.length} documentos únicos)`);
    console.log(`⏱️ TIEMPO: ${data.metadata?.processing_time_seconds?.toFixed(2) || 'N/A'}s`);
    
    // Mostrar documentos citados
    if (citationsSources.length > 0) {
      console.log(`\n📚 DOCUMENTOS CONSULTADOS:`);
      citationsSources.forEach((doc, i) => {
        console.log(`   ${i+1}. ${doc}`);
      });
    }
    
    // Evaluar capacidad transversal
    const transversalScore = [hasContent, hasCitations, hasChunks, isTransversal].filter(Boolean).length;
    const transversalEmoji = transversalScore >= 4 ? '🟢' : transversalScore >= 3 ? '🟡' : '🔴';
    
    console.log(`${transversalEmoji} CAPACIDAD TRANSVERSAL: ${transversalScore}/4`);
    
    // Mostrar respuesta completa
    if (data.answer) {
      console.log(`\n📝 RESPUESTA COMPLETA:`);
      console.log('─'.repeat(80));
      console.log(data.answer);
    }
    
    // Mostrar citas detalladas
    if (data.citations && data.citations.length > 0) {
      console.log(`\n📖 CITAS DETALLADAS:`);
      console.log('─'.repeat(80));
      data.citations.forEach((citation, i) => {
        console.log(`${i+1}. [${citation.document_name}] - Página ${citation.page_number || 'N/A'}`);
        console.log(`   "${citation.text.substring(0, 150)}..."`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
  
  console.log('\n✅ TEST TRANSVERSAL COMPLETADO');
}

// Ejecutar test
testTransversalQuestion().catch(console.error);