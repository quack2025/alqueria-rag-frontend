// components/Chat/PersonaChat.tsx - Chat interface for synthetic personas

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, ArrowLeft, Save } from 'lucide-react';
import { UnileverArchetype, BASIC_UNILEVER_PERSONAS } from '../../types/unileverPersona.types';
import ColombianPersonaService from '../../services/colombianPersonaService';
import { conversationStorage } from '../../utils/conversationStorage';
import type { ConversationSession, StoredMessage } from '../../utils/conversationStorage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'persona';
  timestamp: Date;
}

interface PersonaChatProps {
  archetype: UnileverArchetype;
  onBack: () => void;
}

// Preguntas predeterminadas por arquetipo
const PREDEFINED_QUESTIONS: Record<UnileverArchetype, string[]> = {
  [UnileverArchetype.COSTENA_EMPRENDEDORA]: [
    "¿Qué opinas de la marca Dove para el cuidado de la piel?",
    "¿Cómo eliges productos para tu tienda de belleza?",
    "¿Qué marcas recomendarías para una mujer emprendedora como tú?",
    "¿Cuál es tu rutina de cuidado personal diario?",
    "¿Qué piensas del precio versus calidad en productos de belleza?"
  ],
  [UnileverArchetype.BOGOTANA_PROFESIONAL]: [
    "¿Cómo integras productos de cuidado personal en tu rutina profesional?",
    "¿Qué características buscas en un shampoo para cabello profesional?",
    "¿Cuál es tu opinión sobre Suave Professional?",
    "¿Prefieres productos premium o accesibles para tu día a día?",
    "¿Qué marcas consideras más confiables para una profesional?"
  ],
  [UnileverArchetype.PAISA_TRADICIONAL]: [
    "¿Qué opinas de OMO comparado con otros detergentes?",
    "¿Cómo decides qué productos de limpieza usar en casa?",
    "¿Qué marca de condimentos prefieres: Fruco o caseros?",
    "¿Cuáles son tus marcas de toda la vida?",
    "¿Qué te parece más importante: tradición o innovación?"
  ],
  [UnileverArchetype.CALENA_MODERNA]: [
    "¿Qué piensas de las tendencias actuales en cuidado capilar?",
    "¿Usas productos naturales como los de Natura?",
    "¿Cómo balanceas precio y calidad en tus compras?",
    "¿Qué opinas de los productos Dove para mujeres jóvenes?",
    "¿Sigues influencers para decidir qué productos comprar?"
  ],
  [UnileverArchetype.AMA_CASA_TRADICIONAL]: [
    "¿Cómo mantienes la limpieza del hogar con productos efectivos?",
    "¿Qué opinas de Cif para la limpieza profunda?",
    "¿Prefieres productos que rindan mucho o que limpien rápido?",
    "¿Cuál es tu secreto para una casa siempre limpia?",
    "¿Qué marcas han estado contigo por más tiempo?"
  ],
  [UnileverArchetype.MADRE_MODERNA]: [
    "¿Cómo eliges productos seguros para toda la familia?",
    "¿Qué opinas de Dove Baby para el cuidado de los niños?",
    "¿Buscas ingredientes naturales en productos para niños?",
    "¿Cómo organizas la rutina familiar de cuidado personal?",
    "¿Qué marcas consideras más confiables para madres?"
  ],
  [UnileverArchetype.HOMBRE_MODERNO]: [
    "¿Qué opinas de Dove Men+Care para el cuidado masculino?",
    "¿Prefieres productos específicos para hombres o unisex?",
    "¿Cómo es tu rutina de cuidado personal matutino?",
    "¿Qué características buscas en un desodorante?",
    "¿Consideras importante el cuidado de la piel para hombres?"
  ]
};

export const PersonaChat: React.FC<PersonaChatProps> = ({ archetype, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<ConversationSession | null>(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const persona = BASIC_UNILEVER_PERSONAS[archetype];
  const questions = PREDEFINED_QUESTIONS[archetype] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Crear nueva sesión de conversación
    if (persona?.name) {
      const session = conversationStorage.createNewSession(archetype, persona.name);
      setCurrentSession(session);
      
      // Mensaje de bienvenida
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `¡Hola! Soy ${persona.name}. ${getWelcomeMessage(archetype)} ¿En qué puedo ayudarte hoy?`,
        sender: 'persona',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [archetype, persona?.name]);

  useEffect(() => {
    // Mostrar botón de guardar después de 3 mensajes
    setShowSaveButton(messages.length > 3);
  }, [messages]);

  const getWelcomeMessage = (archetype: UnileverArchetype): string => {
    const welcomes = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "Soy emprendedora y manejo una tienda de belleza en Barranquilla.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Soy una profesional que trabaja en Bogotá y valoro mucho la calidad.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "Soy de Medellín y me gusta lo tradicional y confiable.",
      [UnileverArchetype.CALENA_MODERNA]: "Soy una joven moderna de Cali que sigue las últimas tendencias.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "Me dedico al hogar y conozco bien los productos de limpieza.",
      [UnileverArchetype.MADRE_MODERNA]: "Soy madre y busco siempre lo mejor para mi familia.",
      [UnileverArchetype.HOMBRE_MODERNO]: "Soy un hombre que cuida su imagen y valora productos de calidad."
    };
    return welcomes[archetype];
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
      // Usar el servicio COMPLETO de personas colombianas (80+ variables)
      const colombianPersonaService = ColombianPersonaService.getInstance();
      const response = await colombianPersonaService.sendMessage({
        query: messageToSend,
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
      // Fallback a respuesta simulada
      const fallbackResponse = generatePersonaResponse(messageToSend, archetype);
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

  const handleQuestionClick = (question: string) => {
    setInputText(question);
  };

  const handleSaveConversation = () => {
    if (!currentSession) return;
    
    const storedMessages: StoredMessage[] = messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender,
      timestamp: msg.timestamp
    }));
    
    const updatedSession = {
      ...currentSession,
      messages: storedMessages,
      updated_at: new Date()
    };
    
    conversationStorage.saveConversation(updatedSession);
    setCurrentSession(updatedSession);
    
    // Mostrar feedback visual
    alert(`Conversación guardada correctamente con ${persona?.name}`);
  };

  const generatePersonaResponse = (question: string, archetype: UnileverArchetype): string => {
    // Esta es una simulación básica. En producción se conectaría al backend
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: [
        "Como emprendedora, siempre busco productos que me den confianza y que mis clientas amen. La calidad es clave para mi negocio.",
        "En mi experiencia vendiendo, las marcas que más funcionan son las que combinan calidad con precio justo.",
        "Para mi tienda, siempre recomiendo productos que yo misma uso. Si no confío en algo, no lo vendo."
      ],
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: [
        "Como profesional, necesito productos que se adapten a mi ritmo de vida acelerado pero que den resultados.",
        "Para mí, la eficiencia es fundamental. Prefiero invertir en productos que realmente funcionen.",
        "En mi trabajo, la imagen es importante, así que uso marcas reconocidas que me den seguridad."
      ],
      [UnileverArchetype.PAISA_TRADICIONAL]: [
        "Yo prefiero las marcas de toda la vida, esas que han demostrado ser confiables con el tiempo.",
        "Para mí, lo importante es que funcione bien y que el precio sea justo. No necesito tantas novedades.",
        "Las marcas que he usado siempre son las mejores. ¿Para qué cambiar algo que funciona?"
      ],
      [UnileverArchetype.CALENA_MODERNA]: [
        "Me gusta probar cosas nuevas y seguir las tendencias, pero siempre que la calidad esté ahí.",
        "Para mí, es importante que los productos se vean bien y tengan buena reputación en redes sociales.",
        "Busco productos que estén a la moda pero que también cuiden mi piel y cabello."
      ],
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: [
        "Para el hogar, lo importante es que limpie bien y que rinda mucho. No me gustan los productos caros que no funcionan.",
        "Conozco bien qué productos limpian de verdad. He probado muchos a lo largo de los años.",
        "Prefiero las marcas que han estado conmigo siempre, esas no fallan."
      ],
      [UnileverArchetype.MADRE_MODERNA]: [
        "Como madre, siempre busco productos seguros para toda la familia, especialmente para los niños.",
        "Para mí, lo más importante es que sean suaves pero efectivos. La seguridad de mi familia es primero.",
        "Me gusta leer las etiquetas y elegir productos que tengan ingredientes que reconozca."
      ],
      [UnileverArchetype.HOMBRE_MODERNO]: [
        "Para mí, los productos tienen que ser prácticos y efectivos. No tengo mucho tiempo para rutinas complicadas.",
        "Busco productos específicos para hombres que entiendan nuestras necesidades particulares.",
        "Me gusta cuidarme pero de manera simple. Los productos que uso tienen que dar resultados."
      ]
    };

    const personaResponses = responses[archetype];
    return personaResponses[Math.floor(Math.random() * personaResponses.length)];
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 text-white">
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
              <h3 className="text-lg font-semibold">{persona?.name}</h3>
              <p className="text-sm opacity-90">{archetype.replace(/_/g, ' ')}</p>
            </div>
          </div>
          
          {/* Save Button */}
          {showSaveButton && (
            <button
              onClick={handleSaveConversation}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Guardar conversación"
            >
              <Save className="h-5 w-5" />
            </button>
          )}
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
                <Sparkles className="h-4 w-4 animate-spin" />
                <span className="text-sm">Escribiendo...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Predefined Questions */}
      {questions.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preguntas sugeridas:</p>
          <div className="flex flex-wrap gap-2">
            {questions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};