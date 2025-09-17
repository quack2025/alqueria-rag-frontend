import React, { useState } from 'react';
import { Send, Loader2, Clock, Database, TrendingUp } from 'lucide-react';
import { alqueriaRAGService } from '../../services/alqueriaRAGService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Define interfaces locally to avoid import issues
interface AlqueriaRAGResponse {
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

interface AlqueriaChatProps {
  mode: 'pure' | 'creative' | 'hybrid';
  ragPercentage: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export const AlqueriaChat: React.FC<AlqueriaChatProps> = ({ mode, ragPercentage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AlqueriaRAGResponse | null>(null);

  const suggestedQueries = [
    '¿Cuáles son las tendencias del mercado lácteo en Colombia?',
    '¿Cómo se posiciona Alquería frente a Alpina y Colanta?',
    '¿Qué oportunidades de innovación existen en yogurts funcionales?',
    'Análisis del consumo de leche deslactosada en Bogotá',
    '¿Cuáles son las fortalezas de Alquería vs competencia?',
    '¿Qué productos lácteos tienen mayor potencial de crecimiento?'
  ];

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentResponse(null);

    try {
      let response: AlqueriaRAGResponse;

      switch (mode) {
        case 'pure':
          response = await alqueriaRAGService.ragPure(input);
          break;
        case 'creative':
          response = await alqueriaRAGService.ragCreative(input, ['text', 'table']);
          break;
        case 'hybrid':
          response = await alqueriaRAGService.ragHybrid(input, ragPercentage, ['text', 'table']);
          break;
        default:
          response = await alqueriaRAGService.ragPure(input);
      }

      setCurrentResponse(response);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        metadata: response.metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Error inesperado'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Suggested Queries */}
      {messages.length === 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preguntas sugeridas sobre el mercado lácteo:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuery(query)}
                className="text-left p-3 bg-alqueria-50 hover:bg-alqueria-100 rounded-lg border border-alqueria-200 transition-colors"
              >
                <span className="text-sm text-alqueria-800">{query}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-alqueria-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}

              {message.metadata && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    {message.metadata.chunks_retrieved} chunks
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {(message.metadata.confidence * 100).toFixed(1)}% confianza
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {message.metadata.processing_time}s
                  </div>
                  {message.metadata.rag_percentage && (
                    <div className="text-alqueria-600 font-medium">
                      {message.metadata.rag_percentage}% RAG
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-alqueria-600" />
                <span className="text-sm text-gray-600">
                  Procesando consulta RAG {mode}...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Pregunta sobre el mercado lácteo (Modo ${mode.toUpperCase()})...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alqueria-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-2 bg-alqueria-600 text-white rounded-lg hover:bg-alqueria-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Enviar
          </button>
        </form>
      </div>

      {/* Current Response Metadata */}
      {currentResponse?.metadata && (
        <div className="bg-alqueria-50 border border-alqueria-200 rounded-lg p-4">
          <h4 className="font-semibold text-alqueria-900 mb-2">Detalles de la consulta:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-alqueria-700 font-medium">Modo:</span>
              <p className="text-alqueria-800">{currentResponse.metadata.mode.toUpperCase()}</p>
            </div>
            <div>
              <span className="text-alqueria-700 font-medium">Documentos:</span>
              <p className="text-alqueria-800">{currentResponse.metadata.chunks_retrieved}</p>
            </div>
            <div>
              <span className="text-alqueria-700 font-medium">Confianza:</span>
              <p className="text-alqueria-800">{(currentResponse.metadata.confidence * 100).toFixed(1)}%</p>
            </div>
            <div>
              <span className="text-alqueria-700 font-medium">Tiempo:</span>
              <p className="text-alqueria-800">{currentResponse.metadata.processing_time}s</p>
            </div>
            {currentResponse.metadata.rag_percentage && (
              <div className="md:col-span-2">
                <span className="text-alqueria-700 font-medium">Balance RAG/AI:</span>
                <p className="text-alqueria-800">
                  {currentResponse.metadata.rag_percentage}% Documentos, {100 - currentResponse.metadata.rag_percentage}% AI
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};