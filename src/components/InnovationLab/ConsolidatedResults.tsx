// components/InnovationLab/ConsolidatedResults.tsx - Visor de resultados consolidados
import React, { useState } from 'react';
import {
  FileText,
  Users,
  Clock,
  Eye,
  Download,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import type { ConsolidatedStudyResult, StudySection, DetailedInterview } from '../../types/dairy.types';

interface ConsolidatedResultsProps {
  study: ConsolidatedStudyResult;
  onClose: () => void;
}

const ConsolidatedResults: React.FC<ConsolidatedResultsProps> = ({
  study,
  onClose
}) => {
  const [activeView, setActiveView] = useState<'executive' | 'interviews'>('executive');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [selectedInterview, setSelectedInterview] = useState<DetailedInterview | null>(null);

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const renderExecutiveSummary = () => (
    <div className="space-y-6">
      {/* Study Overview */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-900 mb-2">
              {study.conceptName} - Estudio de Mercado
            </h3>
            <p className="text-green-700 mb-4">{study.researchGoal}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {study.metadata.totalInterviews}
                </div>
                <div className="text-sm text-green-600">Entrevistas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {formatTime(study.metadata.evaluationTime)}
                </div>
                <div className="text-sm text-green-600">Duración</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {study.executiveSummary.length}
                </div>
                <div className="text-sm text-green-600">Insights</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">
                  {study.executiveSummary.reduce((acc, section) =>
                    acc + section.relevantQuotes.length, 0
                  )}
                </div>
                <div className="text-sm text-green-600">Citas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary Sections */}
      <div className="space-y-4">
        {study.executiveSummary.map((section, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  {index === 0 ? <BarChart3 className="h-4 w-4 text-green-600" /> :
                   index === study.executiveSummary.length - 1 ? <Lightbulb className="h-4 w-4 text-green-600" /> :
                   <TrendingUp className="h-4 w-4 text-green-600" />}
                </div>
                <h3 className="font-semibold text-gray-900 text-left">{section.title}</h3>
              </div>
              {expandedSections.has(index) ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedSections.has(index) && (
              <div className="px-6 pb-6 border-t border-gray-100">
                {/* Strategic Recommendation Badge */}
                {section.title === "Recomendación Estratégica" && section.recommendation && (
                  <div className="mb-6">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${
                      section.recommendation === 'GO'
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : section.recommendation === 'REFINE'
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                        : 'bg-red-100 text-red-800 border-2 border-red-300'
                    }`}>
                      {section.recommendation === 'GO' && '✅ PROCEDER A CAMPO'}
                      {section.recommendation === 'REFINE' && '⚠️ REFINAR CONCEPTO'}
                      {section.recommendation === 'NO-GO' && '❌ NO PROCEDER'}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>

                {/* Key Insights */}
                {section.keyInsights.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                      Insights Clave
                    </h4>
                    <div className="space-y-4">
                      {section.keyInsights.map((insight, insightIndex) => (
                        <div key={insightIndex} className="bg-blue-50 rounded-lg p-4">
                          <h5 className="font-medium text-blue-900 mb-2">{insight.title}</h5>
                          <p className="text-blue-800 text-sm mb-2">
                            <strong>Resumen:</strong> {insight.summary}
                          </p>
                          <p className="text-blue-700 text-sm mb-2">
                            <strong>Impacto:</strong> {insight.impact}
                          </p>
                          <p className="text-blue-600 text-sm">
                            <strong>Variaciones:</strong> {insight.variations}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Quotes */}
                {section.relevantQuotes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                      Citas Relevantes
                    </h4>
                    <div className="space-y-3">
                      {section.relevantQuotes.map((quote, quoteIndex) => (
                        <div key={quoteIndex} className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                          <p className="text-gray-800 italic mb-2">"{quote.text}"</p>
                          <p className="text-sm text-gray-600">— {quote.speaker}</p>
                          {quote.context && (
                            <p className="text-xs text-gray-500 mt-1">{quote.context}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Takeaways */}
                {section.keyTakeaways.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-green-600" />
                      Puntos Clave
                    </h4>
                    <ul className="space-y-2">
                      {section.keyTakeaways.map((takeaway, takeawayIndex) => (
                        <li key={takeawayIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterviewsList = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {study.interviews.map((interview, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedInterview(interview)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{interview.personaName}</h3>
                <p className="text-sm text-gray-600">
                  {interview.personaAge} años, {interview.userInformation.personalInformation.location}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Profesión:</strong> {interview.userInformation.personalInformation.profession}
              </p>
              <p>
                <strong>Consumo lácteo:</strong> {interview.userInformation.dairyConsumption.frequency}
              </p>
              <p>
                <strong>Tono emocional:</strong>
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  interview.emotionalTone.includes('positivo') ? 'bg-green-100 text-green-800' :
                  interview.emotionalTone.includes('negativo') ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {interview.emotionalTone}
                </span>
              </p>
              <p>
                <strong>Insights clave:</strong> {interview.keyInsights.length}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {interview.conversation.length} preguntas
              </span>
              <Eye className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInterviewDetail = () => {
    if (!selectedInterview) return null;

    return (
      <div className="space-y-6">
        {/* Interview Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                Entrevista con {selectedInterview.personaName}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Edad:</strong> {selectedInterview.personaAge} años
                </div>
                <div>
                  <strong>Ubicación:</strong> {selectedInterview.userInformation.personalInformation.location}
                </div>
                <div>
                  <strong>Profesión:</strong> {selectedInterview.userInformation.personalInformation.profession}
                </div>
                <div>
                  <strong>Consumo lácteo:</strong> {selectedInterview.userInformation.dairyConsumption.frequency}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedInterview(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a lista
            </button>
          </div>
        </div>

        {/* Conversation */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
            Conversación Completa
          </h4>

          <div className="space-y-4">
            {selectedInterview.conversation.map((exchange, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">P</span>
                    </div>
                    <span className="font-medium text-gray-900">Pregunta {index + 1}</span>
                    {exchange.emotionalTone && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        exchange.emotionalTone === 'Positivo' ? 'bg-green-100 text-green-800' :
                        exchange.emotionalTone === 'Negativo' ? 'bg-red-100 text-red-800' :
                        exchange.emotionalTone === 'Curioso' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {exchange.emotionalTone}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 pl-8">{exchange.question}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">R</span>
                    </div>
                    <span className="font-medium text-gray-900">Respuesta</span>
                    {exchange.keyThemes && exchange.keyThemes.length > 0 && (
                      <div className="flex space-x-1">
                        {exchange.keyThemes.map((theme, themeIndex) => (
                          <span key={themeIndex} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            {theme}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 pl-8">{exchange.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        {selectedInterview.keyInsights.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Insights Clave de esta Entrevista
            </h4>
            <ul className="space-y-2">
              {selectedInterview.keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Surprising Insights */}
        {selectedInterview.surprisingInsights.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
              Insights Sorprendentes
            </h4>
            <div className="space-y-2">
              {selectedInterview.surprisingInsights.map((insight, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-green-600" />
            Resultados del Estudio - {study.conceptName}
          </h2>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveView('executive')}
              className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                activeView === 'executive'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Executive Summary
            </button>
            <button
              onClick={() => setActiveView('interviews')}
              className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                activeView === 'interviews'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Entrevistas Detalladas ({study.interviews.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {activeView === 'executive' && renderExecutiveSummary()}
          {activeView === 'interviews' && !selectedInterview && renderInterviewsList()}
          {activeView === 'interviews' && selectedInterview && renderInterviewDetail()}
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedResults;