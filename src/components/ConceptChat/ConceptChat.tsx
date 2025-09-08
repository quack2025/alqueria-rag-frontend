// components/ConceptChat/ConceptChat.tsx - Chat contextual para profundizar en conceptos evaluados

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, ArrowLeft, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UnileverArchetype, BASIC_UNILEVER_PERSONAS } from '../../types/unileverPersona.types';
import ColombianPersonaService from '../../services/colombianPersonaService';

interface ConceptChatProps {
  archetype: UnileverArchetype;
  personaName: string;
  evaluatedConcept: {
    title: string;
    description: string;
    type: 'product' | 'campaign';
    category: string;
  };
  evaluationResult: {
    overallScore: number;
    appeal: number;
    credibility: number;
    benefit_evaluation: number;
    concerns: string[];
    positives: string[];
    quotes: string[];
  };
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'persona';
  timestamp: Date;
}

export const ConceptChat: React.FC<ConceptChatProps> = ({ 
  archetype, 
  personaName, 
  evaluatedConcept, 
  evaluationResult, 
  onBack 
}) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mensaje de bienvenida contextual
    const welcomeMessage: Message = {
      id: 'welcome',
      text: t('conceptChat.welcomeMessage', { 
        name: personaName, 
        concept: evaluatedConcept.title, 
        score: evaluationResult.overallScore 
      }),
      sender: 'persona',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [t, personaName, evaluatedConcept.title, evaluationResult.overallScore]);

  const generateContextualPrompt = (query: string): string => {
    return `
CHAT CONTEXTUAL - PROFUNDIZACIÓN DE CONCEPTO EVALUADO

Contexto: Ya evaluaste el siguiente concepto y ahora el usuario quiere profundizar.

CONCEPTO EVALUADO:
Título: ${evaluatedConcept.title}
Descripción: ${evaluatedConcept.description}
Tipo: ${evaluatedConcept.type === 'product' ? 'Producto' : 'Campaña'}
Categoría: ${evaluatedConcept.category}

TU EVALUACIÓN PREVIA:
- Score General: ${evaluationResult.overallScore}/10
- Atractivo: ${evaluationResult.appeal}/10
- Credibilidad: ${evaluationResult.credibility}/10
- Evaluación de Beneficios: ${evaluationResult.benefit_evaluation}/10

TUS PREOCUPACIONES:
${evaluationResult.concerns.map(c => `- ${c}`).join('\n')}

TUS ASPECTOS POSITIVOS:
${evaluationResult.positives.map(p => `- ${p}`).join('\n')}

TUS COMENTARIOS PREVIOS:
${evaluationResult.quotes.map(q => `- "${q}"`).join('\n')}

PREGUNTA DEL USUARIO: ${query}

INSTRUCCIONES:
Como ${personaName}, una ${archetype.replace(/_/g, ' ').toLowerCase()} colombiana, responde la pregunta del usuario profundizando en tu evaluación previa del concepto. 

- Mantén coherencia con tu evaluación inicial
- Usa tus expresiones colombianas típicas
- Si te preguntan sobre algo específico, explica tu razonamiento
- Si te piden sugerencias, sé específica
- Si mencionas precios, usa pesos colombianos
- Recuerda tu contexto socioeconómico y cultural

Responde de manera conversacional y auténtica.
`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const colombianPersonaService = ColombianPersonaService.getInstance();
      const prompt = generateContextualPrompt(messageToSend);

      const response = await colombianPersonaService.sendMessage({
        query: prompt,
        archetype: archetype,
        context: {
          conversation_history: messages.slice(-5).map(msg => ({
            user: msg.sender === 'user' ? msg.text : '',
            assistant: msg.sender === 'persona' ? msg.text : '',
            timestamp: msg.timestamp.toISOString()
          })).filter(msg => msg.user || msg.assistant)
        }
      });

      const personaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'persona',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, personaMessage]);
    } catch (error) {
      console.error('Error getting persona response:', error);
      
      // Fallback contextual
      const fallbackResponse = generateFallbackResponse(messageToSend);
      const personaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'persona',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, personaMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateFallbackResponse = (query: string): string => {
    // Respuestas contextuales básicas basadas en la evaluación
    const lowScore = evaluationResult.overallScore < 6;
    const highConcerns = evaluationResult.concerns.length > 2;

    if (query.toLowerCase().includes('precio')) {
      if (lowScore) {
        return "Por el precio que debe tener, creo que hay opciones mejores en el mercado. Necesitaría ver más beneficios tangibles para justificar el costo.";
      }
      return "Si el precio es competitivo, podría considerarlo. Lo importante es que cumpla lo que promete.";
    }

    if (query.toLowerCase().includes('mejora') || query.toLowerCase().includes('sugerencia')) {
      return `Basándome en mis preocupaciones: ${evaluationResult.concerns.join(', ')}, creo que deberían enfocarse en resolver estos puntos primero.`;
    }

    if (query.toLowerCase().includes('positivo') || query.toLowerCase().includes('gusta')) {
      return `Lo que más me gustó fue: ${evaluationResult.positives.join(', ')}. Esos aspectos son los que realmente me llamaron la atención.`;
    }

    return "Puedes preguntarme más específicamente sobre mi evaluación del concepto. Por ejemplo, sobre el precio, los beneficios, o qué mejorarías.";
  };

  // Sugerencias de preguntas contextuales
  const getContextualQuestions = (): string[] => {
    const questions = [
      t('conceptChat.contextualQuestions.whyScore', { score: evaluationResult.overallScore }),
      t('conceptChat.contextualQuestions.mainConcerns'),
      t('conceptChat.contextualQuestions.improvements'),
      t('conceptChat.contextualQuestions.pricePoint')
    ];

    // Agregar preguntas específicas basadas en la evaluación
    if (evaluationResult.credibility < 6) {
      questions.push("¿Por qué no te parece creíble?");
    }
    if (evaluationResult.benefit_evaluation < 6) {
      questions.push("¿Qué beneficios no te convencen?");
    }
    if (evaluationResult.concerns.length > 0) {
      questions.push(`Háblame más sobre: ${evaluationResult.concerns[0]}`);
    }

    return questions.slice(0, 4); // Mostrar máximo 4
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <User className="h-8 w-8" />
            <div>
              <h3 className="text-lg font-semibold">{personaName}</h3>
              <p className="text-sm opacity-90">
                Chat sobre: "{evaluatedConcept.title}" ({evaluationResult.overallScore}/10)
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <MessageSquare className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Evaluation Summary */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-600">Concepto:</span>
            <span className="ml-2 font-medium">{evaluatedConcept.title}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-600">Atractivo: <strong>{evaluationResult.appeal}/10</strong></span>
            <span className="text-gray-600">Credibilidad: <strong>{evaluationResult.credibility}/10</strong></span>
            <span className="text-gray-600">Beneficios: <strong>{evaluationResult.benefit_evaluation}/10</strong></span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 animate-pulse" />
                <span className="text-sm">{t('conceptChat.thinking')}</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Contextual Questions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <p className="text-sm font-medium text-gray-700 mb-2">{t('conceptChat.askAboutEvaluation')}</p>
        <div className="flex flex-wrap gap-2">
          {getContextualQuestions().map((question, index) => (
            <button
              key={index}
              onClick={() => setInputText(question)}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('conceptChat.inputPlaceholder')}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConceptChat;