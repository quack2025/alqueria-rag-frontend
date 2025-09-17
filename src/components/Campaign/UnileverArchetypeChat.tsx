// components/Campaign/UnileverArchetypeChat.tsx - Chat con personas sintéticas Unilever usando LLM

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, X, User, Loader2, RefreshCw,
  ShoppingBag, Heart, TrendingUp, AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { UnileverSyntheticPersona } from '../../types/unileverPersona.types';
import { unileverLLMService } from '../../services/unileverLLMService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  persona?: UnileverSyntheticPersona;
}

interface UnileverArchetypeChatProps {
  isOpen: boolean;
  onClose: () => void;
  persona: UnileverSyntheticPersona;
  productContext?: {
    brand?: string;
    product?: string;
    campaign?: string;
  };
}

const UnileverArchetypeChat: React.FC<UnileverArchetypeChatProps> = ({
  isOpen,
  onClose,
  persona,
  productContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && persona) {
      checkBackendHealth();
      initializeChat();
      loadSuggestedQuestions();
      inputRef.current?.focus();
    }
  }, [isOpen, persona]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkBackendHealth = async () => {
    const isHealthy = await unileverLLMService.checkBackendHealth();
    setBackendAvailable(isHealthy);
    if (!isHealthy) {
      console.warn('Backend no disponible');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestedQuestions = async () => {
    const suggestions = await unileverLLMService.generateSuggestedQuestions(persona);
    setSuggestedQuestions(suggestions.slice(0, 4));
  };

  const initializeChat = () => {
    // Mensaje inicial del sistema presentando a la persona
    const systemMessage: ChatMessage = {
      id: `msg-system-${Date.now()}`,
      role: 'system',
      content: `Estás hablando con ${persona.name}, ${persona.demographics.occupation} de ${persona.demographics.age} años que vive en ${persona.location.city}, ${persona.location.region}.`,
      timestamp: new Date()
    };

    // Mensaje inicial de la persona
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: generateInitialGreeting(),
      timestamp: new Date(),
      persona
    };

    setMessages([systemMessage, initialMessage]);
  };

  const generateInitialGreeting = () => {
    const greetings = [
      `Hola, soy ${persona.name}. ${persona.background_story}`,
      `Buenas, mi nombre es ${persona.name}, vivo en ${persona.location.city}. ${persona.background_story}`,
      `Qué tal, soy ${persona.name}. ${persona.background_story}`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Llamar al servicio LLM con el contexto completo
      const response = await unileverLLMService.generatePersonaResponse({
        userMessage: inputMessage,
        persona,
        productContext,
        conversationHistory: messages.filter(m => m.role !== 'system')
      });

      if (response.success && response.response) {
        const assistantMessage: ChatMessage = {
          id: `msg-assistant-${Date.now()}`,
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
          persona
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Mensaje de error
        const errorMessage: ChatMessage = {
          id: `msg-error-${Date.now()}`,
          role: 'assistant',
          content: `Disculpa, no pude procesar tu mensaje. Como ${persona.name}, te diría que a veces la tecnología falla, ¿no? Intenta preguntarme de otra forma.`,
          timestamp: new Date(),
          persona
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage: ChatMessage = {
        id: `msg-error-${Date.now()}`,
        role: 'assistant',
        content: `Uy, parece que hay un problema con la conexión. Como ${persona.name}, prefiero las conversaciones en persona, pero bueno... ¿intentamos de nuevo?`,
        timestamp: new Date(),
        persona
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const resetChat = () => {
    initializeChat();
    loadSuggestedQuestions();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col">
        {/* Header con información de la persona */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{persona.name}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {persona.demographics.occupation} • {persona.demographics.age} años
                </p>
                <p className="text-blue-100 text-sm">
                  {persona.location.city}, {persona.location.region} • NSE {persona.demographics.nse_level}
                </p>
                {productContext && (
                  <div className="flex items-center gap-2 mt-2">
                    <ShoppingBag className="h-4 w-4 text-blue-200" />
                    <span className="text-sm text-blue-100">
                      Hablando sobre: {productContext.brand} {productContext.product}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Status del backend */}
        {!backendAvailable && (
          <div className="bg-orange-50 border-b border-orange-200 px-4 py-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700">
              Conexión limitada - Las respuestas pueden ser más simples
            </span>
          </div>
        )}

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start",
                message.role === 'system' && "justify-center"
              )}
            >
              {message.role === 'system' ? (
                <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-lg max-w-md text-center">
                  {message.content}
                </div>
              ) : (
                <div
                  className={cn(
                    "max-w-lg px-4 py-3 rounded-lg",
                    message.role === 'user'
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{message.persona?.name}</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className={cn(
                    "text-xs mt-2",
                    message.role === 'user' ? "text-blue-100" : "text-gray-400"
                  )}>
                    {new Date(message.timestamp).toLocaleTimeString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-lg flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-gray-600">{persona.name} está escribiendo...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Preguntas sugeridas */}
        {suggestedQuestions.length > 0 && messages.length <= 2 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Preguntas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input de mensaje */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={resetChat}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reiniciar conversación"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Pregúntale a ${persona.name} sobre productos Unilever...`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={cn(
                "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                inputMessage.trim() && !isLoading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
              Enviar
            </button>
          </div>
          
          {/* Información contextual */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Usa: {persona.consumer_behavior.dove_usage.join(', ') || 'No especificado'}</span>
              <span>Compra: {persona.consumer_behavior.shopping_frequency}</span>
              <span>Precio: Sensibilidad {persona.consumer_behavior.price_sensitivity}</span>
            </div>
            {backendAvailable && (
              <span className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                LLM Conectado
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnileverArchetypeChat;