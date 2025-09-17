// components/InnovationLab/EvaluationProgress.tsx - Componente de progreso de evaluación
import React from 'react';
import { Clock, Users, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import type { EvaluationProgress } from '../../types/dairy.types';

interface EvaluationProgressProps {
  progress: EvaluationProgress;
  onCancel?: () => void;
}

const EvaluationProgressComponent: React.FC<EvaluationProgressProps> = ({
  progress,
  onCancel
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'interviews':
        return <Users className="h-6 w-6" />;
      case 'consolidation':
        return <FileText className="h-6 w-6" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'interviews':
        return 'Realizando Entrevistas Individuales';
      case 'consolidation':
        return 'Generando Reporte Ejecutivo';
      case 'completed':
        return 'Evaluación Completada';
      default:
        return 'Procesando...';
    }
  };

  const progressPercentage = (progress.currentStep / progress.totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            {getPhaseIcon(progress.currentPhase)}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Evaluación SyntheticUsers en Progreso
          </h2>
          <p className="text-gray-600">
            Generando insights profundos con consumidores sintéticos de Alquería
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {getPhaseLabel(progress.currentPhase)}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Paso {progress.currentStep} de {progress.totalSteps}</span>
            <span>
              {progress.estimatedTimeRemaining
                ? `~${formatTime(progress.estimatedTimeRemaining)} restante`
                : ''
              }
            </span>
          </div>
        </div>

        {/* Current Action */}
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="text-green-800 font-medium">
                {progress.currentAction}
              </p>
              {progress.currentPersona && (
                <p className="text-green-600 text-sm mt-1">
                  Entrevistando: {progress.currentPersona}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Phase Steps */}
        <div className="space-y-4 mb-8">
          {/* Fase 1: Entrevistas */}
          <div className={`flex items-center space-x-3 ${
            progress.currentPhase === 'interviews'
              ? 'text-green-600'
              : progress.currentPhase === 'consolidation' || progress.currentPhase === 'completed'
                ? 'text-green-500'
                : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              progress.currentPhase === 'interviews'
                ? 'bg-green-100 border-2 border-green-500'
                : progress.currentPhase === 'consolidation' || progress.currentPhase === 'completed'
                  ? 'bg-green-500'
                  : 'bg-gray-100'
            }`}>
              {progress.currentPhase === 'consolidation' || progress.currentPhase === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-white" />
              ) : (
                <Users className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Entrevistas Individuales</h4>
              <p className="text-sm opacity-75">
                Conversaciones profundas con cada persona sintética
              </p>
            </div>
            {progress.currentPhase === 'interviews' && (
              <ArrowRight className="h-5 w-5 animate-pulse" />
            )}
          </div>

          {/* Fase 2: Consolidación */}
          <div className={`flex items-center space-x-3 ${
            progress.currentPhase === 'consolidation'
              ? 'text-green-600'
              : progress.currentPhase === 'completed'
                ? 'text-green-500'
                : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              progress.currentPhase === 'consolidation'
                ? 'bg-green-100 border-2 border-green-500'
                : progress.currentPhase === 'completed'
                  ? 'bg-green-500'
                  : 'bg-gray-100'
            }`}>
              {progress.currentPhase === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-white" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Reporte Ejecutivo</h4>
              <p className="text-sm opacity-75">
                Análisis consolidado con insights clave y recomendaciones
              </p>
            </div>
            {progress.currentPhase === 'consolidation' && (
              <ArrowRight className="h-5 w-5 animate-pulse" />
            )}
          </div>
        </div>

        {/* Time Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(progress.timeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Tiempo transcurrido</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {progress.estimatedTimeRemaining
                  ? formatTime(progress.estimatedTimeRemaining)
                  : '--:--'
                }
              </div>
              <div className="text-sm text-gray-600">Tiempo estimado restante</div>
            </div>
          </div>
        </div>

        {/* Animation */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Cancel Button */}
        {onCancel && progress.currentPhase !== 'completed' && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              Cancelar Evaluación
            </button>
          </div>
        )}

        {/* Info Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>
            🤖 Powered by Genius Bot by Insight Genius |
            🥛 Optimizado para la industria láctea colombiana
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvaluationProgressComponent;