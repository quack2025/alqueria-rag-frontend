/**
 * Consultor Virtual Results Display Component
 *
 * @description Enhanced results interface for comprehensive concept evaluation
 *              Displays deep analysis across 6 major sections with executive summary
 *
 * @features
 * - Color-coded recommendations (GO/REFINE/NO-GO)
 * - Comprehensive competitive analysis
 * - Consumer adoption journey mapping
 * - Deep psychological insights per persona
 * - Market projection and growth assessment
 * - Export functionality for business presentations
 *
 * @version 2.0 - Enhanced with 5 new analysis sections
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

      {/* ================================================================== */}
      {/* COMPETITIVE ANALYSIS SECTION - New in v2.0                       */}
      {/* ================================================================== */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">🏆 Análisis Competitivo</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-purple-600 mb-2">Principal Competidor</h4>
              <p className="text-gray-700">{evaluation.competitiveAnalysis.mainCompetitor}</p>
            </div>

            <div>
              <h4 className="font-semibold text-green-600 mb-2">✨ Ventajas Competitivas</h4>
              <ul className="space-y-1">
                {evaluation.competitiveAnalysis.competitiveAdvantages.map((advantage, i) => (
                  <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-green-200">
                    {advantage}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-red-600 mb-2">⚠️ Debilidades vs Competencia</h4>
              <ul className="space-y-1">
                {evaluation.competitiveAnalysis.competitiveWeaknesses.map((weakness, i) => (
                  <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-red-200">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-600 mb-2">🎯 Estrategia de Diferenciación</h4>
              <p className="text-sm text-gray-700">{evaluation.competitiveAnalysis.differentiationStrategy}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 p-4 rounded">
          <h4 className="font-semibold text-gray-800 mb-2">📊 Posicionamiento Recomendado</h4>
          <p className="text-gray-700">{evaluation.competitiveAnalysis.marketPositioning}</p>
        </div>
      </div>

      {/* ================================================================== */}
      {/* ADOPTION JOURNEY SECTION - New in v2.0                           */}
      {/* ================================================================== */
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">🚀 Journey de Adopción</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">📢 Estrategia de Awareness</h4>
            <p className="text-sm text-gray-700 mb-4">{evaluation.adoptionJourney.awarenessStrategy}</p>

            <h4 className="font-semibold text-green-600 mb-2">🎯 Motivadores de Primera Compra</h4>
            <ul className="space-y-1">
              {evaluation.adoptionJourney.trialDrivers.map((driver, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-green-200">
                  {driver}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-purple-600 mb-2">🔁 Factores de Recompra</h4>
            <ul className="space-y-1 mb-4">
              {evaluation.adoptionJourney.repeatPurchaseFactors.map((factor, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-purple-200">
                  {factor}
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-red-600 mb-2">🚫 Bloqueadores Potenciales</h4>
            <ul className="space-y-1">
              {evaluation.adoptionJourney.potentialBlockers.map((blocker, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-red-200">
                  {blocker}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* CONSUMPTION OCCASIONS SECTION - New in v2.0                      */}
      {/* ================================================================== */
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">⏰ Ocasiones de Consumo</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-green-600 mb-2">🎯 Primarias</h4>
            <ul className="space-y-1">
              {evaluation.consumptionOccasions.primary.map((occasion, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-green-200">
                  {occasion}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-blue-600 mb-2">🔹 Secundarias</h4>
            <ul className="space-y-1">
              {evaluation.consumptionOccasions.secondary.map((occasion, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-blue-200">
                  {occasion}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-purple-600 mb-2">🔍 Oportunidades No Exploradas</h4>
            <ul className="space-y-1">
              {evaluation.consumptionOccasions.unexploredOpportunities.map((opp, i) => (
                <li key={i} className="text-sm text-gray-700 pl-2 border-l-2 border-purple-200">
                  {opp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* MARKET PROJECTION SECTION - New in v2.0                          */}
      {/* ================================================================== */
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📈 Proyección de Mercado</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-blue-600 mb-2">Mercado Objetivo</h4>
              <p className="text-sm text-gray-700">{evaluation.marketProjection.targetMarketSize}</p>
            </div>

            <div>
              <h4 className="font-semibold text-green-600 mb-2">Penetración Estimada</h4>
              <p className="text-sm text-gray-700">{evaluation.marketProjection.estimatedPenetration}</p>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-purple-600 mb-2">Potencial de Crecimiento</h4>
              <p className="text-sm text-gray-700">{evaluation.marketProjection.growthPotential}</p>
            </div>

            <div>
              <h4 className="font-semibold text-orange-600 mb-2">Time to Market</h4>
              <p className="text-sm text-gray-700">{evaluation.marketProjection.timeToMarket}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* SEGMENT ANALYSIS SECTION - Enhanced in v2.0                      */}
      {/* ================================================================== */
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">👥 Análisis por Segmento ({evaluation.segmentAnalysis.length} personas)</h3>

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

              {/* Quotes representativas */}
              <div className="space-y-2 mb-4">
                <blockquote className="italic text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                  "{segment.representativeQuote}"
                </blockquote>
                {segment.consumptionMomentQuote && (
                  <blockquote className="italic text-blue-700 bg-blue-50 p-3 rounded border-l-4 border-blue-300 text-sm">
                    <span className="font-medium">Momento de consumo:</span> "{segment.consumptionMomentQuote}"
                  </blockquote>
                )}
              </div>

              {/* Análisis Profundo */}
              <div className="bg-gray-50 p-4 rounded mb-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-600">💭 Motivadores Emocionales:</span>
                    <ul className="mt-1 space-y-1">
                      {segment.emotionalDrivers?.map((driver, k) => (
                        <li key={k} className="text-gray-700">• {driver}</li>
                      )) || <li className="text-gray-500 italic">No identificados</li>}
                    </ul>
                  </div>

                  <div>
                    <span className="font-medium text-orange-600">⚡ Puntos de Fricción:</span>
                    <ul className="mt-1 space-y-1">
                      {segment.frictionPoints?.map((friction, k) => (
                        <li key={k} className="text-gray-700">• {friction}</li>
                      )) || <li className="text-gray-500 italic">No identificados</li>}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm mt-3">
                  <div>
                    <span className="font-medium text-green-600">👨‍👩‍👧‍👦 Influenciadores de Decisión:</span>
                    <ul className="mt-1 space-y-1">
                      {segment.decisionInfluencers?.map((influencer, k) => (
                        <li key={k} className="text-gray-700">• {influencer}</li>
                      )) || <li className="text-gray-500 italic">No identificados</li>}
                    </ul>
                  </div>

                  <div>
                    <span className="font-medium text-indigo-600">🕐 Contexto de Consumo:</span>
                    <p className="mt-1 text-gray-700">{segment.consumptionContext || 'No especificado'}</p>
                  </div>
                </div>
              </div>

              {/* Insights Básicos */}
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