// components/Modules/IntelligentRAGModule.tsx - Simplified RAG Module

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Brain, Send, Download, Trash2, 
  Clock, BarChart3
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import type { ChatMessage, RAGResponse } from '../../types';
import { chatStorage } from '../../lib/chatStorage';
import MarkdownRenderer from '../Chat/MarkdownRenderer';
import CitationsList from '../Chat/CitationsList';
import VisualizationRenderer from '../Charts/VisualizationRenderer';
import QuestionSuggestions from '../Suggestions/QuestionSuggestions';
import { processRAGResponse } from '../../utils/responseCleanup';

const IntelligentRAGModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();
  
  // Estado principal
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  
  // Hardcoded optimal configuration
  const config = {
    maxChunks: 15,
    analysisMode: 'strategic' as const,
    enableVisualization: true,
    similarityThreshold: 0.018
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
    const savedMessages = chatStorage.getMessages('general');
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
    
    const updatedMessages = chatStorage.addMessage('general', newMessage);
    setMessages(updatedMessages);
    return newMessage;
  };

  const handleQuestionSelect = (question: string) => {
    setInput(question);
    // Auto-focus the input and optionally auto-submit
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const getSearchStrategy = (query: string) => {
    return {
      maxChunks: config.maxChunks,
      searchTerms: query,
      endpoint: '/api/rag-hybrid',
      customization: {
        detail_level: 10,
        language: 'español',
        target_audience: 'gerentes',
        similarity_threshold: config.similarityThreshold,
        analysis_type: config.analysisMode
      }
    };
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
      const strategy = getSearchStrategy(query);
      
      const requestBody = {
        text: strategy.searchTerms,
        metadata_filter: null,
        output_types: config.enableVisualization ? ["text", "table", "chart"] : ["text"],
        response_customization: {
          extension_level: 'detallado',
          response_style: 'ejecutivo',
          detail_level: strategy.maxChunks,
          language: 'español',
          target_audience: 'gerentes',
          include_citations: true,
          temporal_context: 'completo',
          analysis_type: 'predictivo',
          output_format: 'narrativo',
          ...strategy.customization
        },
        search_configuration: {
          similarity_threshold: config.similarityThreshold,
          max_chunks: strategy.maxChunks
        }
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}${strategy.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RAGResponse = await response.json();
      
      const cleanedAnswer = processRAGResponse(data.answer || 'No se pudo generar una respuesta.');
      
      addMessage({
        role: 'assistant',
        content: cleanedAnswer,
        citations: data.citations || [],
        metadata: data.metadata,
        visualizations: data.visualizations
      });

    } catch (error: any) {
      console.error('RAG Error:', error);
      setError(`Error en la consulta: ${error.message}`);
      
      addMessage({
        role: 'assistant',
        content: `❌ **Error en la consulta**\n\n${error.message}\n\nIntenta reformular tu pregunta o contacta al administrador si el problema persiste.`,
        citations: [],
        metadata: { error: true }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar toda la conversación?')) {
      chatStorage.clearMessages('general');
      setMessages([]);
      setError(null);
    }
  };

  const handleExportChat = () => {
    const exportData = chatStorage.exportMessages('general');
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unilever-intelligent-rag-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Intelligent RAG</h1>
                  <p className="text-sm text-gray-600">
                    Búsqueda inteligente en profundidad • {user?.username}
                  </p>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-2 ml-6">
                <div className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  <Brain className="h-3 w-3" />
                  Strategic Mode
                </div>
                
                <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  <BarChart3 className="h-3 w-3" />
                  {config.maxChunks} chunks
                </div>

                <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  <Clock className="h-3 w-3" />
                  {config.similarityThreshold} threshold
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              
              
              <button
                onClick={handleExportChat}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Exportar conversación"
              >
                <Download className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleClearChat}
                className="p-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                title="Limpiar chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>


        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-4xl">
              <div className="h-20 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Intelligent RAG System
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Sistema unificado de búsqueda inteligente que adapta automáticamente su estrategia para obtener los mejores insights de Unilever
              </p>


              {/* Intelligent Suggestions */}
              <div className="max-w-4xl mx-auto">
                <QuestionSuggestions
                  onQuestionSelect={handleQuestionSelect}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="max-w-5xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4' 
                      : 'bg-white/80 backdrop-blur border border-indigo-200 text-gray-900 p-6'
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
                          <div className="mt-4 pt-4 border-t border-indigo-100">
                            <div className="flex items-center gap-4 text-xs text-indigo-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {message.metadata.processing_time_seconds?.toFixed(1)}s
                              </div>
                              <div className="flex items-center gap-1">
                                <BarChart3 className="h-3 w-3" />
                                {message.metadata.chunks_retrieved} chunks
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading state */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 backdrop-blur border border-indigo-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-indigo-600">
                        Analizando con RAG inteligente...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm p-4 shrink-0">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta cualquier cosa sobre las marcas de Unilever..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
                (!input.trim() || isLoading)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isLoading ? 'Analizando...' : 'Enviar'}
            </button>
          </form>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligentRAGModule;