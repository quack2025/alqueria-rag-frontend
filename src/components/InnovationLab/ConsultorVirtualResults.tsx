/**
 * Componente para mostrar resultados del Consultor Virtual
 * Diseño optimizado para decisiones ejecutivas rápidas
 */

import React from 'react';
import type { ConsultorEvaluation } from '../../services/consultorVirtualService';

interface ConsultorVirtualResultsProps {
  evaluation: ConsultorEvaluation;
  onExportJson?: () => void;
  onNewEvaluation?: () => void;
}

export const ConsultorVirtualResults: React.FC<ConsultorVirtualResultsProps> = ({
  evaluation,
  onExportJson,
  onNewEvaluation
}) => {
  // Color coding basado en recomendación
  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'GO':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'NO-GO':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'REFINE':
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const getScoreStyle = (score: number) => {
    if (score >= 7) return 'text-green-600 font-bold';
    if (score >= 5) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Header con recomendación principal */}
      <div className={`rounded-lg p-6 border-2 ${getRecommendationStyle(evaluation.recommendation)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{evaluation.conceptName}</h2>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">{evaluation.recommendation}</span>
              <div className="text-sm opacity-75">
                <div>Score: <span className={getScoreStyle(evaluation.overallScore)}>{evaluation.overallScore}/10</span></div>
                <div>Confianza: {evaluation.confidence}/10</div>
              </div>
            </div>
          </div>
          <div className="text-right text-sm opacity-75">
            <div>⚡ {(evaluation.processingTime / 1000).toFixed(1)}s</div>
            <div>{new Date(evaluation.timestamp).toLocaleString('es-CO')}</div>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 Resumen Ejecutivo</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Barreras */}
          <div>
            <h4 className="font-semibold text-red-600 mb-2">🚫 Top Barreras</h4>
            <ul className="space-y-1">
              {evaluation.executiveSummary.topBarriers.map((barrier, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-red-200">
                  {barrier}
                </li>
              ))}
            </ul>
          </div>

          {/* Oportunidades */}
          <div>
            <h4 className="font-semibold text-green-600 mb-2">💡 Top Oportunidades</h4>
            <ul className="space-y-1">
              {evaluation.executiveSummary.topOpportunities.map((opportunity, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-green-200">
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="mt-4">
          <h4 className="font-semibold text-blue-600 mb-2">🎯 Recomendaciones Clave</h4>
          <ul className="space-y-1">
            {evaluation.executiveSummary.keyRecommendations.map((rec, i) => (
              <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-blue-200">
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Factores de Riesgo */}
        {evaluation.executiveSummary.riskFactors.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-orange-600 mb-2">⚠️ Factores de Riesgo</h4>
            <ul className="space-y-1">
              {evaluation.executiveSummary.riskFactors.map((risk, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-orange-200">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Análisis por Segmento */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">👥 Análisis por Segmento</h3>

        <div className="space-y-4">
          {evaluation.segmentAnalysis.map((segment, i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{segment.personaName}</h4>
                  <p className="text-sm text-gray-600">{segment.personaProfile}</p>
                </div>
                <div className="text-right text-sm">
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    segment.overallReaction === 'Positiva' ? 'bg-green-100 text-green-800' :
                    segment.overallReaction === 'Negativa' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {segment.overallReaction}
                  </div>
                  <div className="mt-1">Intención: {segment.purchaseIntent}/10</div>
                </div>
              </div>

              {/* Quote representativa */}
              <blockquote className="italic text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-gray-300 mb-3">
                "{segment.representativeQuote}"
              </blockquote>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-red-600">Barreras:</span>
                  <ul className="mt-1 space-y-1">
                    {segment.keyBarriers.map((barrier, j) => (
                      <li key={j} className="text-gray-700">• {barrier}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-medium text-green-600">Oportunidades:</span>
                  <ul className="mt-1 space-y-1">
                    {segment.keyOpportunities.map((opp, j) => (
                      <li key={j} className="text-gray-700">• {opp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-2">
                    <span className="font-medium text-blue-600">Precio:</span>
                    <p className="text-gray-700">{segment.priceReaction}</p>
                  </div>
                  <div>
                    <span className="font-medium text-purple-600">vs Competencia:</span>
                    <p className="text-gray-700">{segment.competitorComparison}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex space-x-4 pt-4">
        {onExportJson && (
          <button
            onClick={onExportJson}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📄 Exportar JSON
          </button>
        )}

        {onNewEvaluation && (
          <button
            onClick={onNewEvaluation}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🔄 Nueva Evaluación
          </button>
        )}

        <div className="flex-1 text-right text-sm text-gray-500 flex items-center justify-end">
          ⚡ Consultor Virtual - Análisis en {(evaluation.processingTime / 1000).toFixed(1)} segundos
        </div>
      </div>
    </div>
  );
};