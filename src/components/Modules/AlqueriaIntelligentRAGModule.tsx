// AlqueriaIntelligentRAGModule.tsx - Módulo RAG Inteligente especializado para Alquería

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bot, Send, Download, Trash2,
  Clock, BarChart3, Milk
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import type { ChatMessage, RAGResponse } from '../../types';
import { chatStorage } from '../../lib/chatStorage';
import MarkdownRenderer from '../Chat/MarkdownRenderer';
import CitationsList from '../Chat/CitationsList';
import VisualizationRenderer from '../Charts/VisualizationRenderer';
// import QuestionSuggestions from '../Suggestions/QuestionSuggestions';
import { processRAGResponse } from '../../utils/responseCleanup';

const AlqueriaIntelligentRAGModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();

  // Estado principal
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  // Configuración optimizada para análisis multi-documento del sector lácteo
  const config = {
    maxChunks: 18, // Incrementado para capturar más diversidad documental
    analysisMode: 'comprehensive_multi_source' as const,
    enableVisualization: true,
    similarityThreshold: 0.018, // Ligeramente más bajo para mayor cobertura
    crossDocumentAnalysis: true // Activar análisis transversal
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    loadMessages();
  }, [navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const loadMessages = () => {
    const savedMessages = chatStorage.getMessages('alqueria-intelligent');
    setMessages(savedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };

    const updatedMessages = chatStorage.addMessage('alqueria-intelligent', newMessage);
    setMessages(updatedMessages);
    return newMessage;
  };

  const handleQuestionSelect = (question: string) => {
    setInput(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const getSearchStrategy = (query: string) => {
    return {
      maxChunks: config.maxChunks,
      searchTerms: query,
      endpoint: '/api/rag-pure',
      customization: {
        detail_level: 12, // Mayor profundidad de análisis
        language: 'español',
        target_audience: 'ejecutivos_lacteos',
        similarity_threshold: config.similarityThreshold,
        analysis_type: config.analysisMode,
        market_focus: 'colombia_dairy',
        client_context: 'alqueria',
        competitive_landscape: ['Alpina', 'Colanta', 'Parmalat', 'Nestlé Dairy'],
        include_competitive_analysis: true,
        cross_document_synthesis: true, // Síntesis entre documentos
        diverse_source_priority: true, // Priorizar diversidad de fuentes
        temporal_analysis: true, // Análisis temporal cuando aplique
        regional_breakdown: true, // Desglose regional
        multi_perspective_analysis: true, // Múltiples perspectivas
        document_diversity_boost: 0.3 // Boost para diversidad documental
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput('');
    setCurrentQuery(userQuery);
    setIsLoading(true);
    setError(null);

    addMessage({
      role: 'user',
      content: userQuery,
      type: 'text'
    });

    try {
      const strategy = getSearchStrategy(userQuery);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://alqueria-rag-backend-production.up.railway.app';

      const requestBody = {
        text: strategy.searchTerms,  // ✅ CORREGIDO: cambiar de 'query' a 'text'
        output_types: ["text"],
        metadata_filter: {
          client: 'alqueria',
          market: 'colombia_dairy',
          sector: 'lacteos'
        },
        customization: {
          ...strategy.customization,
          max_chunks: strategy.maxChunks
        }
      };

      console.log('🥛 Alquería RAG Request:', requestBody);

      const response = await fetch(`${apiUrl}${strategy.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: RAGResponse = await response.json();
      console.log('🥛 Alquería RAG Response:', data);

      const processedResponse = {
        answer: processRAGResponse(data.answer), // ✅ CORREGIDO: pasar solo data.answer
        sources: data.sources || [],
        metadata: data.metadata,
        visualizations: data.visualizations
      };

      addMessage({
        role: 'assistant',
        content: processedResponse.answer,
        type: 'rag',
        metadata: {
          sources: processedResponse.sources,
          chunks_retrieved: processedResponse.metadata?.chunks_retrieved || 0,
          similarity_threshold: config.similarityThreshold,
          mode: 'pure',
          query: userQuery,
          response_id: generateId(),
          timestamp: new Date().toISOString(),
          has_visualizations: processedResponse.visualizations && processedResponse.visualizations.length > 0
        },
        visualizations: processedResponse.visualizations
      });

    } catch (error) {
      console.error('🥛 Alquería RAG Error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error al procesar consulta: ${errorMessage}`);

      addMessage({
        role: 'assistant',
        content: `Lo siento, hubo un error al procesar tu consulta sobre Alquería: ${errorMessage}. Por favor intenta nuevamente.`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
      setCurrentQuery('');
    }
  };

  const clearChat = () => {
    chatStorage.clearMessages('alqueria-intelligent');
    setMessages([]);
    setError(null);
  };

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages,
      module: 'Alquería RAG Inteligente',
      user: user?.username,
      total_messages: messages.length
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alqueria-rag-intelligent-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Preguntas estratégicas multi-documento para análisis profundo del sector lácteo
  const lacteoQuestions = [
    "Analiza la evolución del consumo lácteo en Colombia de los últimos 3 años, comparando tendencias entre categorías (yogurt, leche, quesos) y regiones geográficas",
    "Compara la percepción de marca entre Alquería, Alpina y Colanta considerando factores nutricionales, precio, sabor y disponibilidad según diferentes grupos demográficos",
    "¿Cuáles son las principales oportunidades de innovación en productos lácteos funcionales basándote en insights de consumidores, tendencias globales y gaps competitivos identificados?",
    "Evalúa el impacto de factores macroeconómicos (inflación, poder adquisitivo, cambios regulatorios) en el sector lácteo colombiano y las estrategias de adaptación recomendadas"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-alqueria-50 via-white to-alqueria-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>

              <div className="h-8 w-8 bg-gradient-to-r from-alqueria-600 to-alqueria-500 rounded-lg flex items-center justify-center">
                <Milk className="h-5 w-5 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">RAG Inteligente Alquería</h1>
                <p className="text-sm text-gray-600">734 documentos lácteos • Análisis multi-fuente • 18 chunks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                RAG Puro
              </div>

              <button
                onClick={exportChat}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Exportar chat"
              >
                <Download className="h-4 w-4" />
              </button>

              <button
                onClick={clearChat}
                className="p-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                title="Limpiar chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Panel de preguntas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Bot className="h-4 w-4 text-alqueria-600" />
                Análisis Multi-Documento
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Preguntas estratégicas que combinan múltiples fuentes y estudios para análisis profundo
              </p>
              <div className="space-y-2">
                {lacteoQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionSelect(question)}
                    className="w-full text-left text-sm p-3 rounded-lg border border-gray-200 hover:border-alqueria-300 hover:bg-alqueria-50 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-alqueria-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 group-hover:text-alqueria-700">
                        {question}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-200px)]">
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-gradient-to-r from-alqueria-600 to-alqueria-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Milk className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Bienvenido al RAG Inteligente Alquería
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-4">
                      Realiza consultas directas sobre los 734 documentos del sector lácteo.
                      Obtén respuestas precisas con citas específicas.
                    </p>
                    <div className="bg-alqueria-50 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-alqueria-700 font-medium">
                        💡 Tip: Pregunta sobre mercado lácteo, competencia, tendencias o insights específicos de Alquería
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={cn(
                    'flex gap-4',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}>
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 bg-gradient-to-r from-alqueria-600 to-alqueria-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}

                    <div className={cn(
                      'max-w-3xl rounded-2xl px-6 py-4',
                      message.role === 'user'
                        ? 'bg-alqueria-600 text-white'
                        : 'bg-gray-50 text-gray-900'
                    )}>
                      {message.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="space-y-4">
                          <MarkdownRenderer content={message.content} />

                          {message.visualizations && message.visualizations.length > 0 && (
                            <div className="border-t pt-4">
                              <VisualizationRenderer visualizations={message.visualizations} />
                            </div>
                          )}

                          {message.metadata?.sources && message.metadata.sources.length > 0 && (
                            <div className="border-t pt-4">
                              <CitationsList sources={message.metadata.sources} />
                            </div>
                          )}

                          {message.metadata && (
                            <div className="text-xs text-gray-500 border-t pt-2">
                              <div className="flex items-center gap-4">
                                <span>📊 {message.metadata.chunks_retrieved} chunks</span>
                                <span>🎯 Modo: {message.metadata.mode}</span>
                                <span>⚡ Threshold: {message.metadata.similarity_threshold}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="h-8 w-8 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">
                          {user?.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="h-8 w-8 bg-gradient-to-r from-alqueria-600 to-alqueria-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-50 rounded-2xl px-6 py-4 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-alqueria-600 border-t-transparent"></div>
                        <span className="text-sm text-gray-600">
                          Analizando documentos lácteos de Alquería...
                        </span>
                      </div>
                      {currentQuery && (
                        <p className="text-xs text-gray-500 mt-2">
                          Consulta: "{currentQuery}"
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t bg-gray-50 p-4">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-4">
                  <div className="flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Pregunta sobre el mercado lácteo, competencia, tendencias..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-alqueria-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-3 bg-alqueria-600 text-white rounded-xl hover:bg-alqueria-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlqueriaIntelligentRAGModule;