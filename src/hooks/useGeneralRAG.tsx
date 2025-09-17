// hooks/useGeneralRAG.tsx - Hook unificado para lógica RAG normal + strategic

import { useState, useCallback } from 'react';
import { strategicRAGService } from '../services/strategicRAGService';
import { processRAGResponse } from '../utils/responseCleanup';
import type { ChatMessage, RAGResponse } from '../types';
import type { StrategicConfig } from '../components/Config/StrategicConfigPanel';

interface UseGeneralRAGProps {
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  updateLastMessage: (updates: Partial<ChatMessage>) => void;
  isStrategicMode: boolean;
  strategicConfig: StrategicConfig;
  responseSettings: ResponseSettings;
  activeFilters: any;
  attachedFiles: File[];
}

interface ResponseSettings {
  extensionLevel: 'resumido' | 'normal' | 'detallado';
  responseStyle: 'ejecutivo' | 'tecnico' | 'comercial';
  enableVisualizations: boolean;
  detailLevel: number;
  language: 'español' | 'inglés';
  targetAudience: 'c-level' | 'gerentes' | 'analistas' | 'operativo';
  includeCitations: boolean;
  temporalContext: 'reciente' | 'completo';
  analysisType: 'descriptivo' | 'predictivo' | 'comparativo';
  outputFormat: 'narrativo' | 'bullets' | 'reporte';
}

export const useGeneralRAG = ({
  addMessage,
  updateLastMessage,
  isStrategicMode,
  strategicConfig,
  responseSettings,
  activeFilters,
  attachedFiles
}: UseGeneralRAGProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const hasFiles = attachedFiles.length > 0;
    setError(null);

    // Agregar mensaje del usuario
    addMessage({
      role: 'user',
      content: userMessage.trim(),
      mode: 'general',
    });

    // Agregar mensaje del asistente (placeholder)
    addMessage({
      role: 'assistant',
      content: isStrategicMode 
        ? 'Realizando análisis estratégico profundo...'
        : hasFiles 
          ? 'Analizando documentos y archivos adjuntos...' 
          : 'Analizando documentos...',
      mode: 'general',
    });

    setIsLoading(true);

    try {
      let data: any;

      if (isStrategicMode) {
        // Usar servicio estratégico
        console.log('🎯 Strategic Analysis Request:', { userMessage, config: strategicConfig });
        
        const strategicResponse = await strategicRAGService.generateStrategicAnalysis({
          query: userMessage,
          ...strategicConfig
        });

        data = {
          answer: processRAGResponse(strategicResponse.answer),
          citations: strategicResponse.citations,
          metadata: {
            ...strategicResponse.metadata,
            strategic_framework: strategicResponse.metadata.strategic_framework,
            key_findings: strategicResponse.key_findings,
            recommendations: strategicResponse.strategic_recommendations
          }
        };
      } else {
        // Usar servicio normal
        data = await executeNormalRAGRequest(userMessage, hasFiles);
      }

      // Actualizar último mensaje con la respuesta
      const updates: Partial<ChatMessage> = {
        content: processRAGResponse(data.answer || data.content || 'Respuesta recibida'),
        citations: data.citations || [],
        metadata: data.metadata || {},
        visualizations: data.visualizations || generateMockVisualization(data.answer || data.content || ''),
        hasVisualizations: data.has_visualizations || false
      };

      updateLastMessage(updates);

    } catch (error: any) {
      console.error('❌ RAG Error:', error);
      
      const errorMessage = isStrategicMode 
        ? 'Error en análisis estratégico. Verifica la conexión al backend de Railway.' 
        : 'Error de conexión. Verifica la conexión al backend de Railway.';
      
      updateLastMessage({ content: errorMessage });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading, 
    isStrategicMode, 
    strategicConfig, 
    responseSettings, 
    activeFilters, 
    attachedFiles,
    addMessage, 
    updateLastMessage
  ]);

  const executeNormalRAGRequest = async (userMessage: string, hasFiles: boolean) => {
    let requestBody: string | FormData;
    let headers: Record<string, string> = {
      'Authorization': `Bearer ${localStorage.getItem('unilever_auth_token')}`,
    };

    // Build enhanced request
    const enhancedRequest = {
      text: userMessage,
      metadata_filter: activeFilters,
      output_types: responseSettings.enableVisualizations ? ["text", "table", "chart"] : ["text"],
      response_customization: {
        extension_level: responseSettings.extensionLevel,
        response_style: responseSettings.responseStyle,
        detail_level: responseSettings.detailLevel,
        language: responseSettings.language,
        target_audience: responseSettings.targetAudience,
        include_citations: responseSettings.includeCitations,
        temporal_context: responseSettings.temporalContext,
        analysis_type: responseSettings.analysisType,
        output_format: responseSettings.outputFormat
      }
    };

    if (hasFiles) {
      // Use FormData for multimodal requests
      const formData = new FormData();
      formData.append('text', userMessage);
      formData.append('metadata_filter', JSON.stringify(activeFilters));
      formData.append('output_types', JSON.stringify(enhancedRequest.output_types));
      formData.append('response_customization', JSON.stringify(enhancedRequest.response_customization));
      
      attachedFiles.forEach((file) => {
        formData.append(`images`, file);
      });
      
      requestBody = formData;
    } else {
      // Use JSON for text-only requests
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(enhancedRequest);
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app'}/api/rag-pure`, 
      {
        method: 'POST',
        headers,
        body: requestBody,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  };

  return {
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

// Mock function - should be imported from utils
const generateMockVisualization = (content: string) => {
  return null; // Placeholder
};