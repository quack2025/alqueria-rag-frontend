// types/multimodal.ts - Interfaz para requests multimodales al backend Alquería

export interface MultimodalQuery {
  text?: string;                    // ✅ REQUERIDO - texto principal de la consulta
  images?: string[];                // Opcional - array de URLs o base64 de imágenes
  audio?: string[];                 // Opcional - array de URLs o base64 de audio
  metadata_filter?: {               // Opcional - filtros de metadata
    client?: string;
    market?: string;
    sector?: string;
    category?: string;
    region?: string;
    [key: string]: any;
  };
  output_types?: string[];          // Opcional, default: ["text"]
  rag_percentage?: number;          // Opcional, para modo híbrido (0-100)
  customization?: {                 // Opcional - configuraciones adicionales
    creativity_level?: number;
    detail_level?: number;
    language?: string;
    target_audience?: string;
    analysis_type?: string;
    max_chunks?: number;
    [key: string]: any;
  };
}

export interface MultimodalResponse {
  answer: string;
  sources?: Array<{
    title: string;
    content: string;
    similarity?: number;
    metadata?: any;
  }>;
  metadata?: {
    chunks_retrieved?: number;
    mode?: string;
    processing_time?: number;
    rag_percentage?: number;
    [key: string]: any;
  };
  visualizations?: any[];
  error?: string;
}