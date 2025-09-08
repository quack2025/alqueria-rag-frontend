// components/Suggestions/StrategicQuestionSuggestions.tsx - Sugerencias de preguntas estratégicas

import React, { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Zap,
  Star,
  ArrowRight,
  Filter
} from 'lucide-react';
import { 
  UNILEVER_STRATEGIC_QUESTIONS, 
  getQuestionsByCategory,
  getCategories,
  getRecommendedStarterQuestions,
  type StrategicQuestion 
} from '../../data/unileverStrategicQuestions';
import type { StrategicConfig } from '../Config/StrategicConfigPanel';

interface StrategicQuestionSuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (question: StrategicQuestion) => void;
}

const DIFFICULTY_COLORS = {
  basic: 'text-green-600 bg-green-100',
  intermediate: 'text-yellow-600 bg-yellow-100', 
  advanced: 'text-red-600 bg-red-100'
};

const DIFFICULTY_LABELS = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{className?: string}>> = {
  'Estrategia Dove': Target,
  'Análisis Competitivo': TrendingUp,
  'Estrategia de Portfolio': Lightbulb,
  'Innovación': Zap,
  'Evolución del Consumidor': Star,
  'Tendencias de Mercado': TrendingUp,
  'Quick Wins': ArrowRight
};

const StrategicQuestionSuggestions: React.FC<StrategicQuestionSuggestionsProps> = ({
  isOpen,
  onClose,
  onSelectQuestion
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(true);

  if (!isOpen) return null;

  const categories = getCategories();
  const recommendedQuestions = getRecommendedStarterQuestions();
  
  const displayQuestions = showOnlyRecommended 
    ? recommendedQuestions
    : selectedCategory 
      ? getQuestionsByCategory(selectedCategory)
      : UNILEVER_STRATEGIC_QUESTIONS;

  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleQuestionClick = (question: StrategicQuestion) => {
    onSelectQuestion(question);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Preguntas Estratégicas
              </h2>
              <p className="text-sm text-gray-600">
                Selecciona una pregunta para comenzar tu análisis estratégico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            {/* Toggle Recomendadas */}
            <button
              onClick={() => {
                setShowOnlyRecommended(!showOnlyRecommended);
                setSelectedCategory('');
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                showOnlyRecommended
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Star className="h-3 w-3 inline mr-1" />
              Recomendadas
            </button>

            {/* Selector de Categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setShowOnlyRecommended(false);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <span className="text-sm text-gray-500">
              {displayQuestions.length} preguntas
            </span>
          </div>

          {/* Lista de Preguntas */}
          <div className="space-y-4">
            {displayQuestions.map((question) => {
              const isExpanded = expandedQuestions.has(question.id);
              const CategoryIcon = CATEGORY_ICONS[question.category] || Lightbulb;

              return (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  {/* Header de pregunta */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <CategoryIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {question.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            DIFFICULTY_COLORS[question.difficulty]
                          }`}>
                            {DIFFICULTY_LABELS[question.difficulty]}
                          </span>
                        </div>
                        
                        <h3 className="text-base font-medium text-gray-900 mb-2">
                          {question.question}
                        </h3>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleQuestionClick(question)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Usar Esta Pregunta
                          </button>
                          
                          <button
                            onClick={() => toggleExpanded(question.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Menos detalles
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Ver detalles
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalles expandidos */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        {/* Expected Insights */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            💡 Insights Esperados:
                          </h4>
                          <ul className="space-y-1">
                            {question.expectedInsights.map((insight, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-purple-500 mt-0.5">•</span>
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Configuración Recomendada */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            ⚙️ Configuración Recomendada:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {question.recommendedConfig.analysisType && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {question.recommendedConfig.analysisType}
                              </span>
                            )}
                            {question.recommendedConfig.insightDepth && (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                {question.recommendedConfig.insightDepth}
                              </span>
                            )}
                            {question.recommendedConfig.enableCrossDocumentAnalysis && (
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                Análisis Cruzado
                              </span>
                            )}
                            {question.recommendedConfig.enableTrendAnalysis && (
                              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                                Tendencias
                              </span>
                            )}
                            {question.recommendedConfig.includeRecommendations && (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                Recomendaciones
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {displayQuestions.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay preguntas disponibles
              </h3>
              <p className="text-gray-600">
                Intenta cambiar los filtros para ver más preguntas.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center rounded-b-xl">
          <div className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Las preguntas recomendadas están optimizadas para obtener insights accionables rápidamente
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategicQuestionSuggestions;