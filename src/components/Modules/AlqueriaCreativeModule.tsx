// AlqueriaCreativeModule.tsx - Módulo RAG Creativo especializado para Alquería

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Palette, TrendingUp, Download, Settings,
  Trash2, BarChart3, Lightbulb, Clock, Zap, Milk, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import type { ChatMessage, RAGResponse } from '../../types';
import { chatStorage } from '../../lib/chatStorage';
import MarkdownRenderer from '../Chat/MarkdownRenderer';
import CitationsList from '../Chat/CitationsList';
import VisualizationRenderer from '../Charts/VisualizationRenderer';
import { processRAGResponse } from '../../utils/responseCleanup';

const AlqueriaCreativeModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();

  // Estado
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creativityLevel, setCreativityLevel] = useState(75);
  const [currentQuery, setCurrentQuery] = useState('');

  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    loadMessages();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  const loadMessages = () => {
    const savedMessages = chatStorage.getMessages('alqueria-creative');
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

    const updatedMessages = chatStorage.addMessage('alqueria-creative', newMessage);
    setMessages(updatedMessages);
    return newMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const query = input.trim();

    addMessage({
      role: 'user',
      content: query,
    });

    setCurrentQuery(query);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Prompt creativo específico para el sector lácteo
      const creativePrompt = `MODO CREATIVO ALQUERÍA ACTIVADO - Nivel ${creativityLevel}%

INSTRUCCIONES ESPECIALES PARA CREATIVIDAD LÁCTEA:
Como consultor creativo especializado en lácteos para Alquería Colombia, necesito que generes ideas innovadoras, conceptos de campaña y propuestas estratégicas basándote EXCLUSIVAMENTE en los datos reales de investigación láctea disponibles.

NIVEL DE CREATIVIDAD: ${creativityLevel}% (donde 100% = máxima innovación disruptiva en lácteos)

CONTEXTO ESPECIALIZADO:
- Sector: Industria láctea colombiana
- Competencia: Alpina (líder), Colanta (cooperativa), Parmalat (internacional)
- Categorías: Leches, yogurts, quesos, derivados lácteos
- Tendencias: Productos funcionales, sin lactosa, probióticos, nutrición familiar

ESTRUCTURA CREATIVA REQUERIDA:
1. **💡 INSIGHT ESTRATÉGICO**: Extrae insights únicos de los documentos lácteos CITANDO las fuentes específicas
2. **🎯 OPORTUNIDAD DE INNOVACIÓN**: Identifica gaps en el mercado lácteo basándote en evidencia documental
3. **🚀 CONCEPTO CREATIVO**: Propuesta disruptiva basada en datos reales (mencionar qué documento específico inspiró cada idea)
4. **📊 VISUALIZACIONES**: Genera gráficos, tablas, dashboards cuando aplique
5. **🎨 ACTIVACIÓN**: Tácticas específicas para el sector lácteo con respaldo documental
6. **🔮 VISIÓN FUTURA**: Proyecciones del mercado lácteo a 6-12 meses con base en tendencias documentadas
7. **🔍 FUENTES RAG**: IMPORTANTE - Incluye citas específicas y menciona explícitamente qué documentos/estudios inspiraron cada recomendación creativa

QUERY DEL USUARIO: "${query}"

INSTRUCCIÓN CRÍTICA: Cada idea creativa debe estar vinculada a insights específicos de los documentos. Usa frases como "Basándome en el documento X..." o "Según el estudio Y de Alquería..." para conectar la creatividad con los datos reales.

Genera una respuesta súper creativa combinando los datos reales de Alquería con innovación estratégica para el sector lácteo colombiano.`;

      const apiUrl = import.meta.env.VITE_API_URL || 'https://alqueria-rag-backend-production.up.railway.app';

      const response = await fetch(`${apiUrl}/api/rag-creative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: creativePrompt,  // ✅ CORREGIDO: cambiar de 'query' a 'text'
          rag_percentage: Math.max(40, 100 - creativityLevel), // Balance RAG/Creatividad (mínimo 40% RAG)
          output_types: ["text"],
          metadata_filter: {
            client: 'alqueria',
            market: 'colombia_dairy',
            sector: 'lacteos'
          },
          customization: {
            creativity_level: creativityLevel,
            detail_level: 12, // Mayor profundidad para incluir más contexto
            language: 'español',
            target_audience: 'ejecutivos_lacteos',
            analysis_type: 'strategic_creative_with_sources',
            client_context: 'alqueria',
            market_focus: 'colombia_dairy',
            competitive_landscape: ['Alpina', 'Colanta', 'Parmalat', 'Nestlé Dairy'],
            include_visualizations: true,
            generate_concepts: true,
            innovation_focus: true,
            max_chunks: 15, // Incrementado para más insights inspiradores
            include_source_attribution: true, // Nuevo: incluir atribución de fuentes
            show_rag_inspiration: true, // Nuevo: mostrar qué RAG inspiró cada idea
            require_citations: true // Nuevo: requerir citas en ideas creativas
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: RAGResponse = await response.json();
      console.log('🥛 Alquería Creative Response:', data);

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
          similarity_threshold: 0.020,
          mode: 'creative',
          creativity_level: creativityLevel,
          query: query,
          response_id: generateId(),
          timestamp: new Date().toISOString(),
          has_visualizations: processedResponse.visualizations && processedResponse.visualizations.length > 0
        },
        visualizations: processedResponse.visualizations
      });

    } catch (error) {
      console.error('🥛 Alquería Creative Error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error al procesar consulta creativa: ${errorMessage}`);

      addMessage({
        role: 'assistant',
        content: `Lo siento, hubo un error al generar insights creativos para Alquería: ${errorMessage}. Por favor intenta nuevamente.`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
      setCurrentQuery('');
    }
  };

  const clearChat = () => {
    chatStorage.clearMessages('alqueria-creative');
    setMessages([]);
    setError(null);
  };

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages,
      module: 'Alquería Módulo Creativo',
      creativity_level: creativityLevel,
      user: user?.username,
      total_messages: messages.length
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alqueria-creative-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const creativeQuestions = [
    "¿Qué conceptos innovadores puedes sugerir para leches funcionales Alquería?",
    "¿Cómo podríamos posicionar Alquería como líder en lácteos probióticos?",
    "¿Qué oportunidades creativas existen en yogurts premium para niños?",
    "¿Cómo crear una campaña disruptiva contra Alpina?",
    "¿Qué innovaciones en packaging lácteo recomendarías?",
    "¿Cómo aprovechar las tendencias wellness en productos Alquería?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-alqueria-50">
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

              <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">Módulo Creativo Alquería</h1>
                <p className="text-sm text-gray-600">Insights estratégicos • Creatividad {creativityLevel}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Creativo
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
          {/* Panel lateral */}
          <div className="lg:col-span-1 space-y-6">
            {/* Control de creatividad */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-cyan-600" />
                Nivel Creativo
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Creatividad</span>
                  <span className="text-sm font-bold text-cyan-600">{creativityLevel}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-cyan"
                />
                <div className="text-xs text-gray-500 text-center">
                  {creativityLevel < 30 ? '🧠 Conservador' :
                    creativityLevel < 70 ? '⚡ Balanceado' : '🚀 Disruptivo'}
                </div>
              </div>
            </div>

            {/* Preguntas creativas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-cyan-600" />
                Ideas Creativas
              </h3>
              <div className="space-y-2">
                {creativeQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="w-full text-left text-sm p-3 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-3 w-3 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 group-hover:text-cyan-700">
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
                    <div className="h-16 w-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Módulo Creativo Alquería
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-4">
                      Genera insights estratégicos, conceptos innovadores y visualizaciones
                      basadas en datos reales del sector lácteo.
                    </p>
                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-sm text-cyan-700 font-medium">
                        💡 Tip: Ajusta el nivel de creatividad y pregunta sobre innovación,
                        conceptos de campaña o oportunidades estratégicas
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
                      <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    )}

                    <div className={cn(
                      'max-w-3xl rounded-2xl px-6 py-4',
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white'
                        : 'bg-gradient-to-br from-gray-50 to-cyan-50 text-gray-900'
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
                              <div className="mb-3 flex items-center gap-2">
                                <div className="h-1 w-1 bg-cyan-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">
                                  Insights RAG que inspiraron estas ideas creativas
                                </span>
                              </div>
                              <CitationsList sources={message.metadata.sources} />
                            </div>
                          )}

                          {message.metadata && (
                            <div className="text-xs text-gray-500 border-t pt-2">
                              <div className="flex items-center gap-4 flex-wrap">
                                <span>📊 {message.metadata.chunks_retrieved} fuentes inspiradoras</span>
                                <span>🎨 Creatividad: {message.metadata.creativity_level}%</span>
                                <span>🔗 RAG: {Math.max(40, 100 - creativityLevel)}%</span>
                                <span>⚡ Modo: Creativo + Insights</span>
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
                    <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-cyan-50 rounded-2xl px-6 py-4 max-w-3xl">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-600 border-t-transparent"></div>
                        <span className="text-sm text-gray-600">
                          Combinando 15 fuentes RAG con creatividad {creativityLevel}%...
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
              <div className="border-t bg-gradient-to-r from-cyan-50 to-teal-50 p-4">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
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
                      placeholder="Genera conceptos creativos, campañas innovadoras, insights estratégicos..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Crear
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

export default AlqueriaCreativeModule;