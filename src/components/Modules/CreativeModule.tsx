// components/Modules/CreativeModule.tsx - Módulo RAG Creativo

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Sparkles, Palette, TrendingUp, Download, Settings, 
  Trash2, BarChart3, Lightbulb, Clock, Zap, Image as ImageIcon, AlertCircle, Shield
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import type { ChatMessage, RAGResponse } from '../../types';
import { chatStorage } from '../../lib/chatStorage';
import MarkdownRenderer from '../Chat/MarkdownRenderer';
import TransparentRenderer from '../Chat/TransparentRenderer';
import CitationsList from '../Chat/CitationsList';
import VisualizationRenderer from '../Charts/VisualizationRenderer';
import { generateMockVisualization } from '../../utils/mockVisualizationData';
import { processRAGResponse } from '../../utils/responseCleanup';

const CreativeModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  
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
  }, []); // Dependencias vacías para evitar loop

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const loadMessages = () => {
    const savedMessages = chatStorage.getMessages('creative');
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
    
    const updatedMessages = chatStorage.addMessage('creative', newMessage);
    setMessages(updatedMessages);
    return newMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const query = input.trim();
    
    const userMessage = addMessage({
      role: 'user',
      content: query,
    });

    setCurrentQuery(query);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Construir prompt creativo específico que leveragee datos RAG reales
      const creativePrompt = `MODO CREATIVO ACTIVADO - Nivel ${creativityLevel}%

INSTRUCCIONES ESPECIALES PARA CREATIVIDAD:
Como consultor creativo de Unilever Colombia, necesito que generes ideas innovadoras, conceptos de campaña y propuestas estratégicas basándote EXCLUSIVAMENTE en los datos reales de investigación disponibles en el contexto.

NIVEL DE CREATIVIDAD: ${creativityLevel}% (donde 100% = máxima innovación y disrupción)

SOLICITUD ORIGINAL: ${query}

ESTRUCTURA DE RESPUESTA REQUERIDA:
1. **💡 INSIGHT CLAVE** (basado en datos reales)
2. **🎯 CONCEPTO CREATIVO** (innovador pero sustentado)
3. **📊 FUNDAMENTACIÓN** (citas específicas de datos)
4. **🚀 PROPUESTA DE EJECUCIÓN** (tactical y específica)
5. **📈 IMPACTO ESPERADO** (métricas y KPIs)

IMPORTANTE: Todas las ideas deben estar fundamentadas en insights reales del consumidor colombiano de Unilever, no en conocimiento general.`;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rag-hybrid`, {
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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RAGResponse = await response.json();
      
      const cleanedAnswer = processRAGResponse(data.answer || 'No se pudo generar una respuesta creativa.');
      
      addMessage({
        role: 'assistant',
        content: cleanedAnswer,
        citations: data.citations || [],
        metadata: data.metadata,
        visualizations: data.visualizations
      });

    } catch (error: any) {
      console.error('Creative RAG Error:', error);
      setError(`Error en la consulta creativa: ${error.message}`);
      
      addMessage({
        role: 'assistant',
        content: `❌ **Error en el Módulo Creativo**\n\n${error.message}\n\nIntenta reformular tu solicitud creativa o contacta al administrador si el problema persiste.`,
        citations: [],
        metadata: { error: true }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm(t('chat.confirmClearCreative'))) {
      chatStorage.clearMessages('creative');
      setMessages([]);
    }
  };


  const exportConversation = () => {
    const data = {
      module: 'creative',
      exported_at: new Date().toISOString(),
      user: user?.username,
      messages_count: messages.length,
      creativity_level: creativityLevel,
      messages: messages
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unilever-rag-creative-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t('modules.creative.title')}
                </h1>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    {t('chat.creativitySubtitle')} • {user?.username || t('common.user')}
                  </p>
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    <Shield className="h-3 w-3" />
                    Datos Reales RAG
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    <Sparkles className="h-3 w-3" />
                    Creatividad: {creativityLevel}%
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Creativity Level */}
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <Palette className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-700 font-medium">
                {t('chat.creativity')}: {creativityLevel}%
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(parseInt(e.target.value))}
                className="w-16 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Export */}
            {messages.length > 0 && (
              <button
                onClick={exportConversation}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={t('common.exportConversation')}
              >
                <Download className="h-4 w-4" />
              </button>
            )}

            {/* Clear */}
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={t('common.clearChat')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {/* Config */}
            <button
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title={t('common.configuration')}
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('chat.welcomeTitle')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('chat.creativeWelcomeDescription')}
            </p>
            
            {/* Creative Prompts basados en insights reales */}
            <div className="grid gap-3 md:grid-cols-2 max-w-4xl mx-auto">
              {[
                {
                  icon: Lightbulb,
                  title: "🏆 Campaña Revolucionaria Dove",
                  prompt: "Basándote en las percepciones actuales de Dove sobre hidratación y beneficios para la piel, diseña una campaña disruptiva que conecte con mujeres colombianas millennials y posicione Dove como el líder absoluto en self-care auténtico. La campaña debe leveragear el aroma como diferenciador clave.",
                  category: "Campaña"
                },
                {
                  icon: Zap,
                  title: "🔥 Innovación Disruptiva Fruco",
                  prompt: "Considerando el liderazgo de Fruco en salsa de tomate y su ventaja competitiva en sabor, propón 3 innovaciones revolucionarias de producto que mantengan la preferencia de sabor tradicional pero conquisten completamente nuevos momentos de consumo y nuevas audiencias.",
                  category: "Producto"
                },
                {
                  icon: TrendingUp,
                  title: "💎 Estrategia Premium Pond's",
                  prompt: "Basándote en los datos de tracking post-lanzamiento de Pond's y los insights sobre calidad percibida, desarrolla una estrategia completa para posicionar Pond's como la marca premium #1 en cuidado facial, superando a la competencia en diferenciación y propuesta de valor.",
                  category: "Premium"
                },
                {
                  icon: BarChart3,
                  title: "🎯 Cross-Brand Synergy",
                  prompt: "Analiza las fortalezas de marca entre Dove, Fruco y Pond's en diferentes segmentos demográficos y diseña una estrategia de cross-selling innovadora que genere sinergias únicas entre estas marcas del portfolio Unilever. Incluye activaciones específicas por NSE.",
                  category: "Portfolio"
                }
              ].map((prompt, index) => (
                <div key={index} className="bg-white/90 backdrop-blur border border-purple-200 rounded-xl hover:border-purple-300 hover:bg-white/95 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md">
                  <button
                    onClick={() => setInput(prompt.prompt)}
                    className="w-full p-5 text-left"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <prompt.icon className="h-5 w-5 text-purple-600" />
                      <span className="text-xs text-purple-500 font-medium bg-purple-100 px-2 py-1 rounded-full">
                        {prompt.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">{prompt.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{prompt.prompt}</p>
                  </button>
                  
                  <div className="px-5 pb-3">
                    <div className="flex items-center gap-1 text-xs text-purple-600">
                      <Shield className="h-3 w-3" />
                      <span>Basado en datos RAG reales</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Modo Creativo Activado - Basado en RAG Real</span>
              </div>
              <p className="text-xs text-purple-700">
                Genera conceptos, campañas e ideas innovadoras fundamentadas en insights reales del consumidor colombiano y datos específicos de Unilever. Superior a ChatGPT genérico por usar conocimiento propietario real y GPT-4 optimizado.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4' 
                    : 'bg-white/80 backdrop-blur border border-purple-200 text-gray-900 p-4'
                }`}>
                  {message.role === 'assistant' ? (
                    <div>
                      <MarkdownRenderer content={message.content} />
                      
                      {message.visualizations && (
                        <div className="mt-4">
                          <VisualizationRenderer 
                            visualizations={message.visualizations} 
                            query={currentQuery}
                          />
                        </div>
                      )}

                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-4">
                          <CitationsList citations={message.citations} />
                        </div>
                      )}

                      {/* Metadata info */}
                      {message.metadata && (
                        <div className="mt-4 pt-4 border-t border-purple-100">
                          <div className="flex items-center gap-4 text-xs text-purple-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {message.metadata.processing_time_seconds?.toFixed(1)}s
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {message.metadata.chunks_retrieved} chunks
                            </div>
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              Creatividad: {creativityLevel}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  
                  <div className={`text-xs mt-3 flex items-center justify-between ${
                    message.role === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.role === 'assistant' && message.metadata && (
                      <div className="flex items-center gap-3">
                        {message.metadata.processing_time_seconds && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {message.metadata.processing_time_seconds}s
                          </span>
                        )}
                        {message.metadata.chunks_retrieved && (
                          <span>📄 {message.metadata.chunks_retrieved}</span>
                        )}
                        {message.visualizations && (
                          <span className="text-purple-600">🎨 Visual</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur rounded-2xl border border-purple-200 p-4 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-sm text-purple-700">
                      {t('chat.creatingInsights')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />

      {/* Input */}
      <div className="bg-white/90 backdrop-blur border-t border-purple-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe tu concepto creativo (ej: campaña innovadora para Dove, estrategia premium para Pond's...)..."
              className="flex-1 px-4 py-3 pr-12 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 placeholder-gray-500"
              disabled={isLoading}
              maxLength={5000}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
                (!input.trim() || isLoading)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isLoading ? 'Creando...' : 'Crear'}
            </button>
          </div>
          
          {/* Creative Stats */}
          <div className="flex justify-between items-center mt-3 text-xs text-purple-600">
            <span className="flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Creatividad: {creativityLevel}% • RAG Real
            </span>
            <span>
              {input.length}/5000 chars
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreativeModule;