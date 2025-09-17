/**
 * TwoPhaseEvaluator - Componente para evaluación en 2 fases independientes
 * FASE 1: Entrevistas sintéticas
 * FASE 2: Análisis de optimización
 */

import React, { useState, useCallback } from 'react';
import { Play, Users, Brain, CheckCircle, AlertTriangle, ArrowRight, Download, Clock, Target } from 'lucide-react';
import { twoPhaseEvaluationService, type InterviewsResult, type ConceptAnalysisResult } from '../../services/twoPhaseEvaluationService';
import type { DairyConcept, DairyPersona, EvaluationProgress } from '../../types/dairy.types';

interface TwoPhaseEvaluatorProps {
  concept: DairyConcept;
  personas: DairyPersona[];
  onComplete?: (interviews: InterviewsResult, analysis?: ConceptAnalysisResult) => void;
}

type EvaluatorState = 'setup' | 'phase1-running' | 'phase1-complete' | 'phase2-running' | 'phase2-complete' | 'error';

export const TwoPhaseEvaluator: React.FC<TwoPhaseEvaluatorProps> = ({
  concept,
  personas,
  onComplete
}) => {
  const [state, setState] = useState<EvaluatorState>('setup');
  const [progress, setProgress] = useState<EvaluationProgress | null>(null);
  const [interviewsResult, setInterviewsResult] = useState<InterviewsResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ConceptAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProgressUpdate = useCallback((progress: EvaluationProgress) => {
    setProgress(progress);
  }, []);

  const runPhase1 = async () => {
    setState('phase1-running');
    setError(null);

    try {
      const service = new twoPhaseEvaluationService(handleProgressUpdate);
      const result = await service.runInterviewPhase(concept, personas);

      setInterviewsResult(result);
      setState('phase1-complete');

      console.log('✅ FASE 1 completada:', result);
    } catch (err) {
      console.error('❌ Error en FASE 1:', err);
      setError(`Error en entrevistas: ${err.message}`);
      setState('error');
    }
  };

  const runPhase2 = async () => {
    if (!interviewsResult) return;

    setState('phase2-running');
    setError(null);

    try {
      const service = new twoPhaseEvaluationService(handleProgressUpdate);
      const result = await service.runAnalysisPhase(interviewsResult);

      setAnalysisResult(result);
      setState('phase2-complete');

      onComplete?.(interviewsResult, result);
      console.log('✅ FASE 2 completada:', result);
    } catch (err) {
      console.error('❌ Error en FASE 2:', err);
      setError(`Error en análisis: ${err.message}`);
      setState('error');
    }
  };

  const runBothPhases = async () => {
    setState('phase1-running');
    setError(null);

    try {
      const service = new twoPhaseEvaluationService(handleProgressUpdate);
      const { interviews, analysis } = await service.runCompleteEvaluation(concept, personas);

      setInterviewsResult(interviews);
      setAnalysisResult(analysis);
      setState('phase2-complete');

      onComplete?.(interviews, analysis);
      console.log('✅ Evaluación completa:', { interviews, analysis });
    } catch (err) {
      console.error('❌ Error en evaluación completa:', err);
      setError(`Error en evaluación: ${err.message}`);
      setState('error');
    }
  };

  const downloadInterviewsData = () => {
    if (!interviewsResult) return;

    const data = {
      concept: interviewsResult.concept,
      interviews: interviewsResult.interviews,
      metadata: {
        totalInterviews: interviewsResult.totalInterviews,
        completedAt: interviewsResult.completedAt,
        evaluationTime: interviewsResult.evaluationTime
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entrevistas-${concept.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAnalysisReport = () => {
    if (!analysisResult) return;

    const report = generateMarkdownReport(analysisResult, interviewsResult!);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisis-optimizacion-${concept.name.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'PROCEDER': return 'text-green-700 bg-green-100 border-green-200';
      case 'REFINAR': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'DESCARTAR': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CRÍTICO': return 'text-red-700 bg-red-100';
      case 'IMPORTANTE': return 'text-orange-700 bg-orange-100';
      case 'RECOMENDACIÓN': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Evaluador de 2 Fases</h1>
        <p className="text-emerald-100">
          Optimización de concepto: <span className="font-semibold">{concept.name}</span>
        </p>
        <p className="text-sm text-emerald-200 mt-2">
          Pre-screening para optimizar presupuesto de investigación • {personas.length} personas sintéticas
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Progreso de Evaluación</h2>
          <div className="text-sm text-gray-500">
            {progress?.timeElapsed ? `${Math.floor(progress.timeElapsed / 60)}:${String(progress.timeElapsed % 60).padStart(2, '0')}` : ''}
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          {/* Fase 1 */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            state === 'phase1-running' ? 'bg-blue-100 text-blue-700' :
            ['phase1-complete', 'phase2-running', 'phase2-complete'].includes(state) ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            <Users className="w-5 h-5" />
            <span className="font-medium">Fase 1: Entrevistas</span>
            {['phase1-complete', 'phase2-running', 'phase2-complete'].includes(state) && <CheckCircle className="w-4 h-4" />}
          </div>

          <ArrowRight className="w-5 h-5 text-gray-400" />

          {/* Fase 2 */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            state === 'phase2-running' ? 'bg-blue-100 text-blue-700' :
            state === 'phase2-complete' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            <Brain className="w-5 h-5" />
            <span className="font-medium">Fase 2: Análisis</span>
            {state === 'phase2-complete' && <CheckCircle className="w-4 h-4" />}
          </div>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{progress.currentAction}</span>
              <span className="text-gray-500">
                {progress.currentStep}/{progress.totalSteps}
                {progress.currentPersona && ` • ${progress.currentPersona}`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.currentStep / progress.totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {state === 'setup' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Iniciar Evaluación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button
              onClick={runPhase1}
              className="flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Solo Fase 1: Entrevistas</span>
            </button>

            <button
              onClick={runBothPhases}
              className="flex items-center justify-center space-x-2 px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Evaluación Completa</span>
            </button>

            <div className="text-center text-sm text-gray-500 flex items-center justify-center">
              <Clock className="w-4 h-4 mr-1" />
              ~{personas.length * 2} min estimado
            </div>
          </div>
        </div>
      )}

      {/* Phase 1 Complete - Option to run Phase 2 */}
      {state === 'phase1-complete' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">✅ Entrevistas Completadas</h3>
            <button
              onClick={downloadInterviewsData}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Datos</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{interviewsResult?.totalInterviews}</div>
              <div className="text-sm text-emerald-700">Entrevistas</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Math.round((interviewsResult?.evaluationTime || 0) / 60)}</div>
              <div className="text-sm text-blue-700">Minutos</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{interviewsResult?.interviews.reduce((acc, i) => acc + i.conversation.length, 0)}</div>
              <div className="text-sm text-purple-700">Intercambios</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">✓</div>
              <div className="text-sm text-yellow-700">Listo para Análisis</div>
            </div>
          </div>

          <button
            onClick={runPhase2}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Brain className="w-5 h-5" />
            <span>Continuar a Fase 2: Análisis de Optimización</span>
          </button>
        </div>
      )}

      {/* Phase 2 Complete - Results */}
      {state === 'phase2-complete' && analysisResult && (
        <div className="space-y-6">
          {/* Decision Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">🎯 Recomendación Estratégica</h3>
              <button
                onClick={downloadAnalysisReport}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Reporte</span>
              </button>
            </div>

            <div className={`p-4 rounded-lg border ${getRecommendationColor(analysisResult.decision.recommendation)} mb-4`}>
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-6 h-6" />
                <span className="text-xl font-bold">{analysisResult.decision.recommendation}</span>
                <span className="text-sm font-medium">Confianza: {analysisResult.decision.confidence}%</span>
              </div>
              <p className="font-medium mb-3">{analysisResult.decision.reasoning}</p>
              <div className="space-y-1">
                <div className="text-sm font-medium">Próximos pasos:</div>
                {analysisResult.decision.nextSteps.map((step, idx) => (
                  <div key={idx} className="text-sm flex items-start space-x-2">
                    <span className="font-medium">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">✅ Fortalezas</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  {analysisResult.keyFindings.strengthPoints.map((point, idx) => (
                    <li key={idx}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-800 mb-2">⚠️ Debilidades</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {analysisResult.keyFindings.weaknessPoints.map((point, idx) => (
                    <li key={idx}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-2">💡 Hallazgos Sorprendentes</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  {analysisResult.keyFindings.surprisingFindings.map((point, idx) => (
                    <li key={idx}>• {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🔍 Insights de Optimización</h3>
            <div className="space-y-4">
              {analysisResult.insights.map((insight, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{insight.title}</h4>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(insight.category)}`}>
                        {insight.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        insight.impact === 'ALTO' ? 'bg-red-100 text-red-700' :
                        insight.impact === 'MEDIO' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {insight.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{insight.description}</p>

                  {insight.evidence.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Evidencia:</div>
                      {insight.evidence.map((evidence, eIdx) => (
                        <div key={eIdx} className="text-sm text-gray-600 italic">"{evidence}"</div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">Acciones recomendadas:</div>
                    {insight.actionItems.map((action, aIdx) => (
                      <div key={aIdx} className="text-sm text-gray-600 flex items-start space-x-2">
                        <span>•</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimizations & Research Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Optimizaciones Específicas</h3>

              {Object.entries(analysisResult.targetOptimization).map(([key, values]) => (
                values.length > 0 && (
                  <div key={key} className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {values.map((value, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span>•</span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔬 Recomendaciones para Investigación</h3>

              {Object.entries(analysisResult.researchRecommendations).map(([key, values]) => (
                values.length > 0 && (
                  <div key={key} className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">
                      {key === 'mustValidate' ? 'Debe Validarse' :
                       key === 'segments' ? 'Segmentos' :
                       key === 'methodology' ? 'Metodología' : key}
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {values.map((value, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span>•</span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {state === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-900">Error en Evaluación</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setState('setup');
              setError(null);
              setProgress(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading States */}
      {(state === 'phase1-running' || state === 'phase2-running') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="font-bold text-blue-900 mb-2">
            {state === 'phase1-running' ? 'Realizando Entrevistas Sintéticas...' : 'Analizando y Generando Recomendaciones...'}
          </h3>
          <p className="text-blue-700">
            {progress?.currentAction || 'Procesando...'}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to generate markdown report
function generateMarkdownReport(analysis: ConceptAnalysisResult, interviews: InterviewsResult): string {
  return `# Reporte de Optimización de Concepto

## ${interviews.concept.name}

**Fecha de Análisis:** ${analysis.timeline.analysisDate.toLocaleDateString('es-CO')}
**Entrevistas Analizadas:** ${analysis.timeline.basedOnInterviews}
**Tiempo de Procesamiento:** ${Math.round(analysis.timeline.processingTime / 60)} minutos

---

## 🎯 RECOMENDACIÓN ESTRATÉGICA

### ${analysis.decision.recommendation}
**Confianza:** ${analysis.decision.confidence}%

${analysis.decision.reasoning}

### Próximos Pasos:
${analysis.decision.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

## 📊 HALLAZGOS CLAVE

### ✅ Fortalezas
${analysis.keyFindings.strengthPoints.map(point => `- ${point}`).join('\n')}

### ⚠️ Debilidades
${analysis.keyFindings.weaknessPoints.map(point => `- ${point}`).join('\n')}

### 💡 Hallazgos Sorprendentes
${analysis.keyFindings.surprisingFindings.map(point => `- ${point}`).join('\n')}

---

## 🔍 INSIGHTS DE OPTIMIZACIÓN

${analysis.insights.map(insight => `
### ${insight.title} (${insight.category} - Impacto ${insight.impact})

${insight.description}

**Evidencia:**
${insight.evidence.map(e => `- "${e}"`).join('\n')}

**Acciones Recomendadas:**
${insight.actionItems.map(action => `- ${action}`).join('\n')}
`).join('\n')}

---

## 🎯 OPTIMIZACIONES ESPECÍFICAS

${Object.entries(analysis.targetOptimization).map(([key, values]) =>
  values.length > 0 ? `### ${key.charAt(0).toUpperCase() + key.slice(1)}
${values.map(v => `- ${v}`).join('\n')}` : ''
).filter(Boolean).join('\n\n')}

---

## 🔬 RECOMENDACIONES PARA INVESTIGACIÓN

${Object.entries(analysis.researchRecommendations).map(([key, values]) =>
  values.length > 0 ? `### ${key === 'mustValidate' ? 'Debe Validarse' : key === 'segments' ? 'Segmentos' : 'Metodología'}
${values.map(v => `- ${v}`).join('\n')}` : ''
).filter(Boolean).join('\n\n')}

---

*Reporte generado por Sistema de Evaluación de 2 Fases - Alquería Innovation Lab*
`;
}

export default TwoPhaseEvaluator;