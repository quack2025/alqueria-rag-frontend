// components/InnovationLab/EvaluationEngine.tsx - Motor de evaluación para conceptos lácteos
import React from 'react';
import { DairyConcept, DairyPersona, EvaluationResult } from '../Modules/AlqueriaInnovationLab';

interface EvaluationEngineProps {
  concept: DairyConcept;
  personas: DairyPersona[];
  onEvaluationComplete: (results: EvaluationResult[]) => void;
}

export const EvaluationEngine: React.FC<EvaluationEngineProps> = ({
  concept,
  personas,
  onEvaluationComplete
}) => {
  // Este componente será implementado cuando se desarrollen los servicios de evaluación
  // Por ahora sirve como placeholder para la arquitectura

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Motor de Evaluación</h3>
      <p className="text-gray-600">
        Sistema de evaluación en desarrollo para conceptos lácteos con personas sintéticas.
      </p>
    </div>
  );
};