import React from 'react';
import { BarChart3, TrendingUp, Target, Users, AlertTriangle, Lightbulb } from 'lucide-react';
import type { ProductConcept, ConceptEvaluation } from '../../services/savitalFocusService';
import { SavitalBusinessInsightsEngine, type ConceptInsights } from '../../services/savitalInsightsEngine';
import { getAllSavitalUsers } from '../../data/colombiaPersonaSystem';

interface SavitalResearchDashboardProps {
  concepts: ProductConcept[];
  evaluations: Map<string, ConceptEvaluation[]>;
  onBackToDashboard: () => void;
}

const SavitalResearchDashboard: React.FC<SavitalResearchDashboardProps> = ({
  concepts,
  evaluations,
  onBackToDashboard
}) => {
  const users = getAllSavitalUsers();
  const insightsEngine = new SavitalBusinessInsightsEngine(users, concepts);

  // Generar insights para todos los conceptos
  const conceptInsights = concepts.map(concept => {
    const conceptEvaluations = evaluations.get(concept.id) || [];
    if (conceptEvaluations.length === 0) return null;
    
    try {
      return insightsEngine.generateConceptInsights(concept.id, conceptEvaluations);
    } catch (error) {
      console.error(`Error generando insights para concepto ${concept.id}:`, error);
      return null;
    }
  }).filter((insight): insight is ConceptInsights => insight !== null);

  // Ordenar conceptos por performance general
  const rankedConcepts = conceptInsights.sort((a, b) => 
    b.overallPerformance.score - a.overallPerformance.score
  );

  const renderKPIInsight = (kpiInsight: ConceptInsights['kpiInsights'][keyof ConceptInsights['kpiInsights']]) => {
    const trendColor = kpiInsight.trend === 'positive' ? 'text-green-600' : 
                      kpiInsight.trend === 'negative' ? 'text-red-600' : 'text-yellow-600';
    const trendIcon = kpiInsight.trend === 'positive' ? <TrendingUp className="h-4 w-4" /> : 
                      kpiInsight.trend === 'negative' ? <AlertTriangle className="h-4 w-4" /> : 
                      <Target className="h-4 w-4" />;

    return (
      <div key={kpiInsight.kpi} className="bg-white rounded-lg shadow-md border mb-4">
        <div className="p-6 pb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {trendIcon}
            <span className="capitalize">{kpiInsight.kpi}</span>
            <span className={`text-2xl font-bold ${trendColor}`}>
              {kpiInsight.averageScore}/10
            </span>
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Drivers Clave</h4>
              <ul className="text-sm space-y-1">
                {kpiInsight.keyDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {driver}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 mb-2">Barreras</h4>
              <ul className="text-sm space-y-1">
                {kpiInsight.barriers.map((barrier, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    {barrier}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Recomendaciones Estratégicas
            </h4>
            <ul className="text-sm space-y-1">
              {kpiInsight.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▶</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBackToDashboard}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
          >
            ← Volver al Dashboard
          </button>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Savital Research Executive Summary
            </h1>
            <p className="text-gray-600">
              Análisis ejecutivo de insights por KPIs - Enfoque en oportunidades de negocio
            </p>
          </div>
        </div>

        {/* Resumen Ejecutivo */}
        <div className="bg-white rounded-lg shadow-md border mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="h-6 w-6" />
              Ranking de Conceptos por Performance General
            </h2>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-3">
              {rankedConcepts.map((insight, index) => (
                <div key={insight.conceptId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{insight.conceptName}</h3>
                      <p className="text-sm text-gray-600">
                        Fortalezas: {insight.overallPerformance.strengths.join(', ') || 'En análisis'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {insight.overallPerformance.score}/10
                    </div>
                    <div className="text-sm text-gray-500">Score General</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análisis Detallado por Concepto */}
        {rankedConcepts.map((insight) => (
          <div key={insight.conceptId} className="bg-white rounded-lg shadow-md border mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <Users className="h-7 w-7" />
                {insight.conceptName}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Score General: <strong>{insight.overallPerformance.score}/10</strong></span>
                <span>Oportunidad de Mercado: <strong className="capitalize">
                  {insight.marketOpportunity.size}
                </strong></span>
                <span>Preparación: <strong className="capitalize">
                  {insight.marketOpportunity.readiness === 'ready' ? 'Listo' : 
                   insight.marketOpportunity.readiness === 'needs-development' ? 'Necesita Desarrollo' : 'No Listo'}
                </strong></span>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-6">
                {/* KPI Insights */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Análisis por KPI</h3>
                  <div className="space-y-4">
                    {renderKPIInsight(insight.kpiInsights.appeal)}
                    {renderKPIInsight(insight.kpiInsights.relevance)}
                    {renderKPIInsight(insight.kpiInsights.believability)}
                    {renderKPIInsight(insight.kpiInsights.uniqueness)}
                    {renderKPIInsight(insight.kpiInsights.purchaseIntention)}
                  </div>
                </div>

                {/* Recomendaciones Estratégicas */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Recomendaciones Estratégicas Generales
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <ul className="space-y-2">
                      {insight.strategicRecommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-blue-800">
                          <span className="text-blue-500 mt-1 font-bold">•</span>
                          <span className="font-medium">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavitalResearchDashboard;