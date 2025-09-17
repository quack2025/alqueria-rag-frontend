// =====================================================
// TEST DE CONEXIÓN ALQUERÍA - ENDPOINT CORRECTO
// =====================================================

import axios from 'axios';

const ALQUERIA_BASE_URL = 'https://alqueria-rag-backend-production.up.railway.app';

async function testAlqueriaConnection() {
  console.log('🚀 TESTING CONEXIÓN ALQUERÍA');
  console.log('====================================');
  console.log(`🎯 Backend URL: ${ALQUERIA_BASE_URL}`);

  try {
    // 1. Test Health Endpoint
    console.log('\n📡 Testing Health Endpoint...');
    const healthResponse = await axios.get(`${ALQUERIA_BASE_URL}/api/v1/alqueria/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log(`📊 Documents Available: ${healthResponse.data.documents_available}`);
    console.log(`🔍 Search Service: ${healthResponse.data.search_service}`);

    // 2. Test RAG Pure Endpoint
    console.log('\n🔍 Testing RAG Pure Endpoint...');
    const ragRequest = {
      text: "¿Cuáles son las tendencias del mercado lácteo en Colombia?",
      output_types: ["text"]
    };

    console.log('📝 RAG Request:', JSON.stringify(ragRequest, null, 2));

    const ragResponse = await axios.post(
      `${ALQUERIA_BASE_URL}/api/rag-pure`,
      ragRequest,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      }
    );

    console.log('✅ RAG Response Status:', ragResponse.status);
    console.log('📝 Answer Preview:', ragResponse.data.answer?.substring(0, 200) + '...');
    if (ragResponse.data.metadata) {
      console.log('📊 Chunks Retrieved:', ragResponse.data.metadata.chunks_retrieved);
      console.log('🎯 Confidence:', ragResponse.data.metadata.confidence);
      console.log('⏱️ Processing Time:', ragResponse.data.metadata.processing_time_seconds + 's');
      console.log('🔤 Tokens Used:', ragResponse.data.metadata.tokens_used);
    }

    // 3. Test RAG Creative Endpoint
    console.log('\n🎨 Testing RAG Creative Endpoint...');
    const creativeRequest = {
      text: "Análisis competitivo Alquería vs Alpina",
      output_types: ["text", "table"]
    };

    const creativeResponse = await axios.post(
      `${ALQUERIA_BASE_URL}/api/rag-creative`,
      creativeRequest,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      }
    );

    console.log('✅ Creative Response Status:', creativeResponse.status);
    console.log('📊 Visualizations Available:', Object.keys(creativeResponse.data.visualizations || {}));
    console.log('💡 Suggestions Available:', !!creativeResponse.data.suggestions);

  } catch (error) {
    console.error('❌ Error en conexión:', error.message);
    if (error.response) {
      console.error('📄 Response Status:', error.response.status);
      console.error('📄 Response Data:', error.response.data);
    }
  }

  console.log('\n✅ TEST COMPLETADO');
}

// Ejecutar test
testAlqueriaConnection();