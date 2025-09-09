// components/Suggestions/QuestionSuggestions.tsx - Preguntas sugeridas para Unilever

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Target, Users, TrendingUp, BarChart, FlaskConical } from 'lucide-react';
import { SUGGESTED_QUESTIONS, type QuestionCategory } from '../../data/unileverQuestions';

interface QuestionSuggestionsProps {
  onQuestionSelect: (question: string) => void;
  className?: string;
}

const QuestionSuggestions: React.FC<QuestionSuggestionsProps> = ({
  onQuestionSelect,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string>('');

  const categoryIcons = {
    'Marcas y Productos': Target,
    'Segmentación y Audiencias': Users,
    'Comportamiento del Consumidor': BarChart,
    'Tendencias y Mercado': TrendingUp,
    'Competencia y Posicionamiento': Zap,
    'Innovación y Productos': FlaskConical
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? '' : categoryName);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              Preguntas Sugeridas para Unilever
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Explora insights específicos sobre marcas, consumidores y mercado
            </p>
          </div>
          <div className="text-gray-400">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-4">
            {SUGGESTED_QUESTIONS.map((category: QuestionCategory) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons];
              const isExpanded = expandedCategory === category.name;
              
              return (
                <div key={category.name} className="border border-gray-100 rounded-lg">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="w-4 h-4 text-gray-600" />}
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.questions.length} preguntas
                        </span>
                      </div>
                      <div className="text-gray-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Questions */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      <div className="p-3 space-y-2">
                        {category.questions.map((question, questionIndex) => (
                          <button
                            key={questionIndex}
                            onClick={() => onQuestionSelect(question)}
                            className="w-full text-left p-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors group"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-blue-400 group-hover:text-blue-600 mt-1 transition-colors">
                                •
                              </span>
                              <span>{question}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Acciones Rápidas:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onQuestionSelect('¿Cuáles son las percepciones principales sobre Dove?')}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                Dove Insights
              </button>
              <button
                onClick={() => onQuestionSelect('¿Cómo se compara Unilever versus P&G?')}
                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
              >
                vs P&G
              </button>
              <button
                onClick={() => onQuestionSelect('¿Cuáles son las tendencias emergentes en cuidado personal?')}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
              >
                Tendencias
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionSuggestions;