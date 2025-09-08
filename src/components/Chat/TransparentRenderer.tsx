// components/Chat/TransparentRenderer.tsx - Renderizador que indica qué es real vs generado

import React from 'react';
import { Shield, Lightbulb, Database, AlertTriangle } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { cn } from '../../lib/utils';

interface TransparentRendererProps {
  content: string;
  citations: any[];
  metadata?: any;
  className?: string;
}

const TransparentRenderer: React.FC<TransparentRendererProps> = ({ 
  content, 
  citations = [], 
  metadata,
  className 
}) => {
  // Análisis del contenido para detectar secciones
  const analyzeContent = (text: string) => {
    const hasCitations = citations.length > 0;
    const citationScore = citations.length;
    const similarityScore = citations.length > 0 ? Math.max(...citations.map(c => c.similarity || 0)) : 0;
    
    // Detectar si hay contenido que probablemente es generado
    const generativeIndicators = [
      'se proyecta que',
      'se espera que',
      'probablemente',
      'sugiere',
      'recomendamos',
      'estrategia sugerida',
      'podría ser',
      'es probable que'
    ];
    
    const hasGenerativeContent = generativeIndicators.some(indicator => 
      text.toLowerCase().includes(indicator.toLowerCase())
    );
    
    return {
      hasCitations,
      citationScore,
      similarityScore,
      hasGenerativeContent,
      dataReliability: citationScore > 3 ? 'high' : citationScore > 0 ? 'medium' : 'low'
    };
  };

  const analysis = analyzeContent(content);

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'text-green-700 bg-green-50 border-green-200';
      case 'medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getReliabilityIcon = (reliability: string) => {
    switch (reliability) {
      case 'high': return Database;
      case 'medium': return Shield;
      case 'low': return Lightbulb;
      default: return AlertTriangle;
    }
  };

  const getReliabilityLabel = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'Basado en Estudios Reales';
      case 'medium': return 'Parcialmente Basado en Datos';
      case 'low': return 'Insights Creativos Generados';
      default: return 'Información No Verificada';
    }
  };

  const getReliabilityDescription = (reliability: string) => {
    switch (reliability) {
      case 'high': 
        return `Esta respuesta está basada en ${analysis.citationScore} documentos de estudios de mercado reales de Unilever con alta similitud (${(analysis.similarityScore * 100).toFixed(1)}%).`;
      case 'medium': 
        return `Esta respuesta combina datos de ${analysis.citationScore} estudios reales con análisis interpretativo adicional.`;
      case 'low': 
        return 'Esta respuesta es principalmente creativa/generada. Puede contener insights útiles pero debe validarse con datos reales.';
      default: 
        return 'No se pudo determinar la confiabilidad de esta información.';
    }
  };

  const ReliabilityIcon = getReliabilityIcon(analysis.dataReliability);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Indicador de Transparencia */}
      <div className={cn(
        'flex items-start gap-3 p-4 rounded-xl border-2',
        getReliabilityColor(analysis.dataReliability)
      )}>
        <div className="flex-shrink-0 mt-0.5">
          <ReliabilityIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm">
              {getReliabilityLabel(analysis.dataReliability)}
            </h4>
            <div className="flex items-center gap-2 text-xs">
              {analysis.citationScore > 0 && (
                <span className="px-2 py-1 rounded-full bg-current bg-opacity-10">
                  {analysis.citationScore} estudios
                </span>
              )}
              {analysis.similarityScore > 0 && (
                <span className="px-2 py-1 rounded-full bg-current bg-opacity-10">
                  {(analysis.similarityScore * 100).toFixed(1)}% similitud
                </span>
              )}
            </div>
          </div>
          <p className="text-xs leading-relaxed opacity-90">
            {getReliabilityDescription(analysis.dataReliability)}
          </p>
          
          {analysis.hasGenerativeContent && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <Lightbulb className="h-3 w-3" />
              <span className="opacity-75">
                Contiene insights creativos/predictivos que deben validarse
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-lg p-1">
        <MarkdownRenderer content={content} />
      </div>

      {/* Sección de advertencia si es contenido principalmente generado */}
      {analysis.dataReliability === 'low' && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Advertencia:</strong> Esta respuesta es principalmente creativa. 
            Te recomendamos usar el <strong>Intelligent RAG</strong> para obtener información basada en estudios reales.
          </span>
        </div>
      )}
    </div>
  );
};

export default TransparentRenderer;