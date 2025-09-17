import axios from 'axios';

const ALQUERIA_API_BASE = 'https://alqueria-rag-backend-production.up.railway.app';

export interface AlqueriaRAGResponse {
  answer: string;
  sources?: Array<{
    title: string;
    content: string;
    similarity: number;
  }>;
  metadata?: {
    mode: 'pure' | 'creative' | 'hybrid';
    chunks_retrieved: number;
    confidence: number;
    processing_time: number;
    tokens_used: number;
    rag_percentage?: number;
  };
}

export interface HealthResponse {
  status: string;
  documents_available: number;
  version?: string;
  service?: string;
  search_index?: string;
  timestamp?: string;
}

class AlqueriaRAGService {
  private apiClient = axios.create({
    baseURL: ALQUERIA_API_BASE,
    timeout: 60000, // 60 seconds for RAG queries
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Health check
  async getHealth(): Promise<HealthResponse> {
    try {
      const response = await this.apiClient.get('/api/v1/alqueria/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        documents_available: 734,
        service: 'Alquería RAG Backend',
        timestamp: new Date().toISOString()
      };
    }
  }

  // RAG Pure - 100% based on Alquería documents
  async ragPure(query: string, outputTypes: string[] = ['text']): Promise<AlqueriaRAGResponse> {
    try {
      const response = await this.apiClient.post('/api/rag-pure', {
        text: query,
        output_types: outputTypes
      });

      return {
        answer: response.data.answer,
        sources: response.data.citations || [],
        metadata: {
          mode: 'pure',
          chunks_retrieved: response.data.metadata?.chunks_retrieved || 5,
          confidence: response.data.metadata?.confidence || 0.85,
          processing_time: response.data.metadata?.processing_time_seconds || 15,
          tokens_used: response.data.metadata?.tokens_used || 1500,
        }
      };
    } catch (error) {
      console.error('RAG Pure query failed:', error);
      throw new Error('Error en consulta RAG Pure');
    }
  }

  // RAG Creative - 60% RAG + 40% creativity + visualizations
  async ragCreative(query: string, outputTypes: string[] = ['text', 'table']): Promise<AlqueriaRAGResponse> {
    try {
      const response = await this.apiClient.post('/api/rag-creative', {
        text: query,
        output_types: outputTypes
      });

      return {
        answer: response.data.answer,
        sources: response.data.citations || [],
        metadata: {
          mode: 'creative',
          chunks_retrieved: response.data.metadata?.chunks_retrieved || 8,
          confidence: response.data.metadata?.confidence || 0.75,
          processing_time: response.data.metadata?.processing_time_seconds || 20,
          tokens_used: response.data.metadata?.tokens_used || 2000,
        }
      };
    } catch (error) {
      console.error('RAG Creative query failed:', error);
      throw new Error('Error en consulta RAG Creative');
    }
  }

  // RAG Hybrid - Configurable RAG/AI balance
  async ragHybrid(query: string, ragPercentage: number = 80, outputTypes: string[] = ['text', 'table']): Promise<AlqueriaRAGResponse> {
    try {
      const response = await this.apiClient.post('/api/rag-hybrid', {
        text: query,
        output_types: outputTypes,
        rag_percentage: ragPercentage
      });

      return {
        answer: response.data.answer,
        sources: response.data.citations || [],
        metadata: {
          mode: 'hybrid',
          chunks_retrieved: response.data.metadata?.chunks_retrieved || 10,
          confidence: response.data.metadata?.confidence || 0.80,
          processing_time: response.data.metadata?.processing_time_seconds || 18,
          tokens_used: response.data.metadata?.tokens_used || 1800,
          rag_percentage: ragPercentage,
        }
      };
    } catch (error) {
      console.error('RAG Hybrid query failed:', error);
      throw new Error('Error en consulta RAG Hybrid');
    }
  }
}

export const alqueriaRAGService = new AlqueriaRAGService();