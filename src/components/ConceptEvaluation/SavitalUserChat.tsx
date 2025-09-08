// SavitalUserChat.tsx - Chat con Usuarias Sintéticas de Savital
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, ChevronDown, Coffee, MapPin, Briefcase, ShoppingBag, Star } from 'lucide-react';
import { SAVITAL_FOCUS_GROUP, type SavitalFocusUser } from '../../data/savitalFocusGroup';
import { savitalFocusService } from '../../services/savitalFocusService';
import type { ProductConcept } from '../../services/savitalFocusService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

interface SavitalUserChatProps {
  selectedUser: SavitalFocusUser;
  onClose: () => void;
  concept?: ProductConcept;
}

const SavitalUserChat: React.FC<SavitalUserChatProps> = ({ selectedUser, onClose, concept }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Mensaje inicial de presentación
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: generateInitialGreeting(),
      timestamp: new Date(),
      userId: selectedUser.id,
      userName: selectedUser.name
    };
    setMessages([initialMessage]);
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateInitialGreeting = () => {
    const greetings = {
      'bog_sav_01': `¡Hola! Soy ${selectedUser.name}. Vivo en Bogotá y uso Savital hace años. Desde que tuve a mi bebé, el cabello se me cae horrible. ¿En qué te puedo ayudar?`,
      'bog_comp_01': `Hola, soy ${selectedUser.name}. Trabajo como contadora aquí en Bogotá. Uso L'Oréal pero siempre estoy buscando algo mejor para mi cabello maltratado. ¿Qué querés saber?`,
      'bog_sav_02': `¡Hola! Soy ${selectedUser.name}, enfermera en Bogotá. Estoy en transición al cabello natural con Savital. ¿Querés hablar de productos capilares?`,
      'bog_comp_02': `Buenas, soy ${selectedUser.name}, profesora de primaria. Head & Shoulders me funciona para la caspa, pero no sé... ¿Vos qué opinás de otros productos?`,
      'baq_sav_01': `¡Ey qué más! Soy ${selectedUser.name} de Barranquilla. Soy influencer de moda y este clima húmedo es terrible para el cabello. Savital me ayuda bastante. ¿Qué necesitas saber mi amor?`,
      'baq_comp_01': `¡Ajá! Soy ${selectedUser.name}, tengo un restaurante aquí en Barranquilla. Mi mamá siempre usó Pantene y yo también. ¿De qué quieres hablar?`,
      'baq_sav_02': `¡Hola mi amor! Soy ${selectedUser.name}, estilista profesional en Barranquilla. Conozco todos los productos, uso Savital y recomiendo según cada cabello. ¿Qué te interesa?`,
      'baq_comp_02': `Hola, soy ${selectedUser.name}, trabajo en administración hospitalaria. Con lo caro que está todo, uso Sedal que es económico. ¿Qué necesitas?`
    };
    
    return greetings[selectedUser.id as keyof typeof greetings] || `Hola, soy ${selectedUser.name}. ¿En qué puedo ayudarte?`;
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Respuestas basadas en el perfil etnográfico profundo
    if (lowerMessage.includes('savital')) {
      if (selectedUser.savital_relationship.is_user) {
        return selectedUser.savital_relationship.loyalty_reasons.join('. ') + 
               `. ${selectedUser.savital_relationship.emotional_connection}`;
      } else {
        return `No uso Savital actualmente. ${selectedUser.savital_relationship.barriers_to_switch.join('. ')}`;
      }
    }

    if (lowerMessage.includes('precio') || lowerMessage.includes('costo')) {
      return `${selectedUser.money_psychology.price_justification}. Para mí, gastar más de ${selectedUser.money_psychology.max_acceptable_price} ya es mucho.`;
    }

    if (lowerMessage.includes('problema') || lowerMessage.includes('cabello')) {
      return `Mi principal problema es ${selectedUser.hair_profile.main_concerns.join(' y ')}. ${selectedUser.ethnographic_profile.emotional_triggers.frustration_points[0]}`;
    }

    if (lowerMessage.includes('rutina')) {
      return selectedUser.ethnographic_profile.hair_rituals.washing_ritual + ' ' + 
             selectedUser.ethnographic_profile.hair_rituals.styling_process;
    }

    if (lowerMessage.includes('clima') || lowerMessage.includes('humedad')) {
      if (selectedUser.city === 'Barranquilla') {
        return `¡Ay este clima de Barranquilla es terrible! La humedad me daña todo el peinado. ${selectedUser.ethnographic_profile.hair_rituals.climate_adaptations}`;
      } else {
        return `En Bogotá el clima es más seco, pero igual tengo que cuidar mi cabello. ${selectedUser.hair_profile.texture_management}`;
      }
    }

    if (lowerMessage.includes('marca') || lowerMessage.includes('competencia')) {
      const brand = selectedUser.savital_relationship.is_user ? 
        selectedUser.savital_relationship.previous_brands[0] : 
        selectedUser.savital_relationship.current_preferred_brand;
      return `Antes usaba ${brand}. ${selectedUser.ethnographic_profile.brand_relationships.loyalty_drivers[0]}`;
    }

    if (concept && (lowerMessage.includes('concepto') || lowerMessage.includes('producto'))) {
      const evaluation = savitalFocusService.generateConceptResponse(selectedUser, concept);
      return `Sobre "${concept.name}": ${evaluation.qualitative_feedback.emotional_reaction}. ${evaluation.qualitative_feedback.likes[0] || ''} Aunque ${evaluation.qualitative_feedback.concerns[0] || 'me parece interesante'}.`;
    }

    if (lowerMessage.includes('comprar') || lowerMessage.includes('dónde')) {
      return `${selectedUser.purchase_behavior.shopping_frequency} en ${selectedUser.purchase_behavior.preferred_channels.join(' o ')}. ${selectedUser.purchase_behavior.decision_factors[0]} es lo más importante para mí.`;
    }

    if (lowerMessage.includes('familia') || lowerMessage.includes('hijos')) {
      if (selectedUser.life_context.family_influence.includes('hijos')) {
        return `Tengo hijos y eso cambió todo. ${selectedUser.life_context.key_life_moments[0]}`;
      } else {
        return `${selectedUser.life_context.family_composition}. ${selectedUser.life_context.daily_routine}`;
      }
    }

    // Respuesta genérica con personalidad
    const genericResponses = [
      `Eso es interesante. En mi experiencia, ${selectedUser.ethnographic_profile.emotional_triggers.satisfaction_moments[0]}.`,
      `Como ${selectedUser.occupation} en ${selectedUser.city}, ${selectedUser.personality_traits.shopping_style}.`,
      `${selectedUser.identity_relationship.self_description}. Por eso ${selectedUser.identity_relationship.ideal_self}.`,
      `Mira, ${selectedUser.communication_style.expressions[0]}. ${selectedUser.values_beliefs.brand_expectations[0]}.`
    ];

    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular tiempo de respuesta
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        userId: selectedUser.id,
        userName: selectedUser.name
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const suggestedQuestions = [
    '¿Qué opinas de Savital?',
    '¿Cuál es tu principal problema capilar?',
    '¿Cuánto pagas normalmente por shampoo?',
    '¿Qué opinas del nuevo concepto?',
    '¿Dónde compras tus productos?',
    '¿Cómo es tu rutina de cuidado?'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {selectedUser.city}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {selectedUser.age} años
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {selectedUser.occupation}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    NSE {selectedUser.nse}
                  </span>
                  {selectedUser.savital_relationship.is_user && (
                    <span className="text-xs bg-green-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" /> Usuario Savital
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-purple-50 p-3 border-b">
          <p className="text-xs text-gray-600">
            <strong>Problema principal:</strong> {selectedUser.hair_profile.main_concerns.join(', ')} | 
            <strong> Marca actual:</strong> {selectedUser.savital_relationship.is_user ? 'Savital' : selectedUser.savital_relationship.current_preferred_brand} | 
            <strong> Presupuesto:</strong> {selectedUser.money_psychology.max_acceptable_price}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <p className="text-xs font-medium mb-1 opacity-70">{message.userName}</p>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString('es-CO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInput(question)}
                className="text-xs bg-white border border-purple-200 text-purple-600 px-3 py-1 rounded-full hover:bg-purple-50 whitespace-nowrap transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavitalUserChat;