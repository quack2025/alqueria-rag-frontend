// components/Suggestions/UnileverQuestionSuggestions.tsx
// Componente para mostrar preguntas sugeridas específicas de Unilever

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { SUGGESTED_QUESTIONS, QUICK_QUESTIONS_BY_PERSONA, TRENDING_TOPICS } from '../../data/unileverQuestions';

interface UnileverQuestionSuggestionsProps {
  onSelectQuestion: (question: string) => void;
  activePersona?: string;
  className?: string;
}

const UnileverQuestionSuggestions: React.FC<UnileverQuestionSuggestionsProps> = ({
  onSelectQuestion,
  activePersona,
  className = ""
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showTrending, setShowTrending] = useState(false);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case '🏷️': return <MessageSquare className="w-4 h-4" />;
      case '👥': return <MessageSquare className="w-4 h-4" />;
      case '🛒': return <MessageSquare className="w-4 h-4" />;
      case '📈': return <Sparkles className="w-4 h-4" />;
      case '⚔️': return <Zap className="w-4 h-4" />;
      case '🔬': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const personaQuestions = activePersona && QUICK_QUESTIONS_BY_PERSONA[activePersona as keyof typeof QUICK_QUESTIONS_BY_PERSONA];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Preguntas Sugeridas para Unilever
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Explora insights específicos sobre marcas, consumidores y mercado
        </p>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Preguntas por Persona Activa */}
        {activePersona && personaQuestions && (
          <div className="mb-4">
            <h4 className="font-medium text-sm text-purple-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Para {activePersona.replace('_', ' ')}
            </h4>
            <div className="space-y-1">
              {personaQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSelectQuestion(question)}
                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors duration-150"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Topics */}
        <div>
          <button
            onClick={() => setShowTrending(!showTrending)}
            className="flex items-center gap-2 w-full text-left font-medium text-sm text-orange-600 hover:text-orange-700 mb-2"
          >
            {showTrending ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <Sparkles className="w-4 h-4" />
            Tendencias Actuales
          </button>
          
          {showTrending && (
            <div className="space-y-1 ml-6">
              {TRENDING_TOPICS.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSelectQuestion(question)}
                  className="w-full text-left p-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors duration-150"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categorías Principales */}
        {SUGGESTED_QUESTIONS.map((category) => (
          <div key={category.name}>
            <button
              onClick={() => toggleCategory(category.name)}
              className="flex items-center gap-2 w-full text-left font-medium text-sm text-gray-700 hover:text-gray-900 mb-2"
            >
              {expandedCategory === category.name ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {getIconComponent(category.icon)}
              {category.name}
            </button>
            
            {expandedCategory === category.name && (
              <div className="space-y-1 ml-6">
                {category.questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectQuestion(question)}
                    className="w-full text-left p-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <p className="text-xs text-gray-500 text-center">
          Haz clic en cualquier pregunta para comenzar tu consulta
        </p>
      </div>
    </div>
  );
};

export default UnileverQuestionSuggestions;