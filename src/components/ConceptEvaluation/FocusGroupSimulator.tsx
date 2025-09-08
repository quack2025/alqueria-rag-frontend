// components/ConceptEvaluation/FocusGroupSimulator.tsx - Simulador de Focus Groups para Conceptos Unilever

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Users, Play, Pause, Download, MessageCircle, User, Mic, ArrowLeft, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UnileverArchetype, BASIC_UNILEVER_PERSONAS } from '../../types/unileverPersona.types';
import ColombianPersonaService from '../../services/colombianPersonaService';
import { cn } from '../../lib/utils';

interface FocusGroupParticipant {
  id: string;
  name: string;
  archetype: UnileverArchetype;
  age: number;
  location: string;
  segment: string;
  personality: string;
  is_speaking: boolean;
  opinion_style: 'leader' | 'follower' | 'contrarian' | 'neutral';
  evaluation_score?: number;
}

interface FocusGroupMessage {
  participant_id: string;
  participant_name: string;
  participant_archetype: UnileverArchetype;
  message: string;
  timestamp: Date;
  reaction_to?: string;
  topic: string;
}

interface ConceptData {
  title: string;
  description: string;
  type: 'product' | 'campaign';
  category: string;
  targetAudience: string;
}

interface EvaluationResult {
  archetype: UnileverArchetype;
  personaName: string;
  overallScore: number;
  // otras propiedades de evaluación...
}

interface FocusGroupSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  concept: ConceptData;
  evaluationResults: EvaluationResult[];
}

export const FocusGroupSimulator: React.FC<FocusGroupSimulatorProps> = ({ 
  isOpen, 
  onClose, 
  concept, 
  evaluationResults 
}) => {
  const { t } = useTranslation();
  const [participants, setParticipants] = useState<FocusGroupParticipant[]>([]);
  const [messages, setMessages] = useState<FocusGroupMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [moderatorQuestion, setModeratorQuestion] = useState('');
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [manualQuestion, setManualQuestion] = useState('');
  const [isWaitingForResponses, setIsWaitingForResponses] = useState(false);
  const [activeParticipant, setActiveParticipant] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false);
  const colombianPersonaService = ColombianPersonaService.getInstance();

  // Temas predefinidos específicos para el concepto evaluado
  const predefinedTopics = useMemo(() => {
    return [
      `Reacción inicial al concepto: "${concept.title}"`,
      `¿Qué les parece el nombre "${concept.title}"?`,
      `Opinión sobre los beneficios propuestos`,
      `Percepción del precio y propuesta de valor`,
      `¿Cómo se compara con productos que usan actualmente?`,
      `¿A quién recomendarían este producto y por qué?`,
      `Sugerencias para mejorar el concepto`,
      `Decisión final: ¿Lo comprarían o no?`
    ];
  }, [concept.title]);

  // Inicializar participantes basados en los resultados de evaluación
  useEffect(() => {
    if (isOpen && evaluationResults.length > 0) {
      const focusGroupParticipants: FocusGroupParticipant[] = evaluationResults.map((result, index) => {
        const persona = BASIC_UNILEVER_PERSONAS[result.archetype];
        return {
          id: `participant_${index}`,
          name: result.personaName,
          archetype: result.archetype,
          age: persona.age,
          location: persona.location,
          segment: result.archetype.replace(/_/g, ' '),
          personality: getPersonalityDescription(result.archetype),
          is_speaking: false,
          opinion_style: getOpinionStyle(result.archetype, result.overallScore),
          evaluation_score: result.overallScore
        };
      });
      
      setParticipants(focusGroupParticipants);
      console.log('👥 Focus Group inicializado con', focusGroupParticipants.length, 'participantes');
    }
  }, [isOpen, evaluationResults]);

  const getPersonalityDescription = (archetype: UnileverArchetype): string => {
    const descriptions = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "Extrovertida y sociable",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Analítica y directa", 
      [UnileverArchetype.PAISA_TRADICIONAL]: "Tradicional y familiar",
      [UnileverArchetype.MADRE_MODERNA]: "Práctica y cuidadosa",
      [UnileverArchetype.CALENA_MODERNA]: "Moderna y espontánea",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "Conservadora y detallista",
      [UnileverArchetype.HOMBRE_MODERNO]: "Práctico y eficiente"
    };
    return descriptions[archetype] || "Personalidad equilibrada";
  };

  const getOpinionStyle = (archetype: UnileverArchetype, score: number): 'leader' | 'follower' | 'contrarian' | 'neutral' => {
    // Costena Emprendedora tiende a ser líder
    if (archetype === UnileverArchetype.COSTENA_EMPRENDEDORA) return 'leader';
    // Bogotana Profesional puede ser contrarian si el score es bajo
    if (archetype === UnileverArchetype.BOGOTANA_PROFESIONAL && score < 7) return 'contrarian';
    // Madre Moderna tiende a ser equilibrada
    if (archetype === UnileverArchetype.MADRE_MODERNA) return 'neutral';
    // Paisa Tradicional puede ser follower
    if (archetype === UnileverArchetype.PAISA_TRADICIONAL) return 'follower';
    
    // Basado en score
    if (score >= 8) return 'leader';
    if (score <= 5) return 'contrarian';
    return 'neutral';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const startFocusGroup = () => {
    if (participants.length === 0) {
      alert('No hay participantes para el focus group');
      return;
    }

    setIsRunning(true);
    isRunningRef.current = true;
    setCurrentRound(0);
    setMessages([]);
    
    // Mensaje de moderador
    const moderatorIntro: FocusGroupMessage = {
      participant_id: 'moderator',
      participant_name: 'Moderador',
      participant_archetype: UnileverArchetype.BOGOTANA_PROFESIONAL,
      message: `¡Bienvenidas! Hoy vamos a discutir sobre el concepto "${concept.title}". Todas ya tuvieron oportunidad de evaluarlo individualmente, ahora queremos escuchar sus opiniones y que comenten entre ustedes. ¿Empezamos?`,
      timestamp: new Date(),
      topic: 'Introducción'
    };
    
    setMessages([moderatorIntro]);
    
    // Empezar la primera ronda después de un momento
    setTimeout(() => {
      startNextRound();
    }, 2000);
  };

  const startNextRound = async () => {
    if (!isRunningRef.current || currentRound >= totalRounds) {
      endFocusGroup();
      return;
    }

    const topic = predefinedTopics[currentRound];
    setCurrentTopic(topic);
    setModeratorQuestion(topic);
    
    // Mensaje del moderador introduciendo el topic
    const moderatorMessage: FocusGroupMessage = {
      participant_id: 'moderator',
      participant_name: 'Moderador',
      participant_archetype: UnileverArchetype.BOGOTANA_PROFESIONAL,
      message: topic,
      timestamp: new Date(),
      topic: topic
    };
    
    setMessages(prev => [...prev, moderatorMessage]);
    
    // Esperar un poco y luego hacer que los participantes respondan
    setTimeout(() => {
      generateParticipantResponses(topic);
    }, 1500);
  };

  const generateParticipantResponses = async (topic: string) => {
    setIsWaitingForResponses(true);
    
    // Determinar orden de participación basado en personalidad
    const orderedParticipants = [...participants].sort((a, b) => {
      const orderScore = {
        'leader': 1,
        'neutral': 2,
        'contrarian': 3,
        'follower': 4
      };
      return orderScore[a.opinion_style] - orderScore[b.opinion_style];
    });

    // Generar respuestas secuencialmente con interacciones
    for (let i = 0; i < orderedParticipants.length; i++) {
      if (!isRunningRef.current) break;
      
      const participant = orderedParticipants[i];
      setActiveParticipant(participant.id);
      
      try {
        // Construir contexto de la conversación previa
        const conversationContext = messages.slice(-6); // Últimos 6 mensajes
        
        const response = await generateParticipantResponse(participant, topic, conversationContext, i);
        
        const newMessage: FocusGroupMessage = {
          participant_id: participant.id,
          participant_name: participant.name,
          participant_archetype: participant.archetype,
          message: response,
          timestamp: new Date(),
          topic: topic
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Pausa entre participantes
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        
      } catch (error) {
        console.error(`Error generando respuesta para ${participant.name}:`, error);
        
        // Respuesta de backup contextual
        const backupResponse = generateBackupResponse(participant, topic);
        const newMessage: FocusGroupMessage = {
          participant_id: participant.id,
          participant_name: participant.name,
          participant_archetype: participant.archetype,
          message: backupResponse,
          timestamp: new Date(),
          topic: topic
        };
        
        setMessages(prev => [...prev, newMessage]);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    setActiveParticipant(null);
    setIsWaitingForResponses(false);
    
    // Avanzar a la siguiente ronda
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
      startNextRound();
    }, 3000);
  };

  const generateParticipantResponse = async (
    participant: FocusGroupParticipant, 
    topic: string, 
    conversationContext: FocusGroupMessage[],
    participantIndex: number
  ): Promise<string> => {
    
    const contextualPrompt = `
CONTEXTO DE FOCUS GROUP - CONCEPTO UNILEVER:
Estás participando en un focus group sobre el concepto "${concept.title}".
${concept.description}

INSTRUCCIONES:
- Eres ${participant.name} (${participant.archetype.replace(/_/g, ' ')})
- Tu evaluación previa del concepto fue: ${participant.evaluation_score}/10
- Tu estilo de opinión: ${participant.opinion_style}
- Edad: ${participant.age} años, Ubicación: ${participant.location}

CONVERSACIÓN PREVIA:
${conversationContext.map(msg => `${msg.participant_name}: ${msg.message}`).join('\n')}

TEMA ACTUAL: "${topic}"

COMO ${participant.name}:
- Responde de forma natural y conversacional (máximo 2-3 oraciones)
- ${participantIndex === 0 ? 'Eres la primera en responder este tema' : 'Puedes reaccionar a lo que dijeron antes'}
- Usa expresiones colombianas típicas de tu región
- Mantén coherencia con tu evaluación previa (${participant.evaluation_score}/10)
- Tu estilo: ${getResponseStyleInstruction(participant.opinion_style)}

Responde solo con tu comentario, sin aclaraciones adicionales:`;

    const response = await colombianPersonaService.sendMessage({
      query: contextualPrompt,
      archetype: participant.archetype,
      language: 'es',
      context: { conversation_history: [] }
    });

    return response.response;
  };

  const getResponseStyleInstruction = (style: string): string => {
    const instructions = {
      'leader': 'Sé asertiva y toma la iniciativa en la conversación',
      'follower': 'Apoya o construye sobre lo que otros han dicho',
      'contrarian': 'Presenta una perspectiva diferente o desafía suavemente las opiniones',
      'neutral': 'Mantén una posición equilibrada y considera múltiples puntos de vista'
    };
    return instructions[style as keyof typeof instructions] || instructions.neutral;
  };

  const generateBackupResponse = (participant: FocusGroupParticipant, topic: string): string => {
    // Respuestas contextuales básicas por arquetipo para casos de error
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: [
        "¡Ay, me parece interesante! Aunque necesito saber más detalles.",
        "Pues mira, suena bien pero depende del precio final.",
        "¡Qué belleza! Me gusta que sea de Fruco, esa marca la conozco."
      ],
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: [
        "Me parece un concepto sólido, pero requiere más validación de mercado.",
        "Está bien estructurado, aunque falta claridad en algunos aspectos.",
        "Es interesante la propuesta, pero me preocupa la implementación."
      ],
      [UnileverArchetype.PAISA_TRADICIONAL]: [
        "¡Ave María! Suena bueno, pero yo prefiero lo que ya conozco.",
        "Pues no sé, mija. Habría que probarlo primero.",
        "Me gusta que sea natural, eso es importante para la familia."
      ],
      [UnileverArchetype.MADRE_MODERNA]: [
        "Para mi familia sería perfecto, especialmente lo natural.",
        "Me llama la atención, pero necesito comparar con otras opciones.",
        "Suena práctico para las comidas de los niños."
      ]
    };
    
    const options = responses[participant.archetype] || responses[UnileverArchetype.MADRE_MODERNA];
    return options[Math.floor(Math.random() * options.length)];
  };

  const endFocusGroup = () => {
    setIsRunning(false);
    isRunningRef.current = false;
    setActiveParticipant(null);
    setIsWaitingForResponses(false);
    
    // Mensaje de cierre del moderador
    const closingMessage: FocusGroupMessage = {
      participant_id: 'moderator',
      participant_name: 'Moderador',
      participant_archetype: UnileverArchetype.BOGOTANA_PROFESIONAL,
      message: "¡Excelente! Muchas gracias por sus valiosas opiniones. Esta sesión nos ha dado insights muy importantes sobre el concepto. ¡Que tengan una excelente tarde!",
      timestamp: new Date(),
      topic: 'Cierre'
    };
    
    setMessages(prev => [...prev, closingMessage]);
  };

  const pauseFocusGroup = () => {
    setIsRunning(false);
    isRunningRef.current = false;
  };

  const askManualQuestion = async () => {
    if (!manualQuestion.trim()) return;
    
    const moderatorMessage: FocusGroupMessage = {
      participant_id: 'moderator',
      participant_name: 'Moderador',
      participant_archetype: UnileverArchetype.BOGOTANA_PROFESIONAL,
      message: manualQuestion,
      timestamp: new Date(),
      topic: 'Pregunta manual'
    };
    
    setMessages(prev => [...prev, moderatorMessage]);
    setManualQuestion('');
    
    // Generar respuestas a la pregunta manual
    setTimeout(() => {
      generateParticipantResponses(manualQuestion);
    }, 1500);
  };

  const exportSession = () => {
    const exportData = {
      concept: concept,
      participants: participants,
      messages: messages,
      session_date: new Date().toISOString(),
      total_rounds: currentRound,
      session_duration: messages.length > 0 ? 
        new Date().getTime() - messages[0].timestamp.getTime() : 0
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus_group_${concept.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Focus Group: "{concept.title}"
              </h2>
              <p className="text-sm text-gray-600">
                {participants.length} participantes • Ronda {currentRound + 1} de {totalRounds}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={exportSession}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={messages.length === 0}
            >
              <Download className="h-4 w-4" />
            </button>
            
            {!isRunning ? (
              <button
                onClick={startFocusGroup}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                disabled={participants.length === 0}
              >
                <Play className="h-4 w-4" />
                Iniciar Sesión
              </button>
            ) : (
              <button
                onClick={pauseFocusGroup}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Pausar
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Participants Panel */}
          <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Participantes</h3>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all",
                    activeParticipant === participant.id 
                      ? "bg-blue-100 border-blue-300 shadow-sm" 
                      : "bg-white border-gray-200"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      activeParticipant === participant.id ? "bg-green-500" : "bg-gray-300"
                    )} />
                    <span className="font-medium text-sm">{participant.name}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>{participant.age} años • {participant.location}</div>
                    <div>Evaluación: {participant.evaluation_score}/10</div>
                    <div className="capitalize">{participant.personality}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Current Topic */}
            {currentTopic && (
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 mb-1">Tema Actual</h4>
                <p className="text-xs text-yellow-800">{currentTopic}</p>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.participant_id === 'moderator' ? "justify-center" : ""
                    )}
                  >
                    {message.participant_id === 'moderator' ? (
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-2xl text-center">
                        <span className="text-sm font-medium">Moderador: </span>
                        {message.message}
                      </div>
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {message.participant_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {message.participant_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-900">
                            {message.message}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {isWaitingForResponses && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">
                        Esperando respuestas...
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Manual Question Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualQuestion}
                  onChange={(e) => setManualQuestion(e.target.value)}
                  placeholder="Haz una pregunta manual al grupo..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && askManualQuestion()}
                  disabled={isRunning}
                />
                <button
                  onClick={askManualQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={!manualQuestion.trim() || isRunning}
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusGroupSimulator;