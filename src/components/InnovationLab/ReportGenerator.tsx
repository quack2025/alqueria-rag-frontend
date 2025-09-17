// components/InnovationLab/ReportGenerator.tsx - Generador de reportes para evaluaciones lácteas
import React from 'react';
import { EvaluationResult } from '../Modules/AlqueriaInnovationLab';

interface ReportGeneratorProps {
  evaluations: EvaluationResult[];
  onGenerateReport: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  evaluations,
  onGenerateReport
}) => {
  // Este componente será implementado cuando se desarrollen los servicios de reportes
  // Por ahora sirve como placeholder para la arquitectura

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Generador de Reportes</h3>
      <p className="text-gray-600">
        Sistema de reportes ejecutivos en desarrollo para evaluaciones de conceptos lácteos.
      </p>
    </div>
  );
};