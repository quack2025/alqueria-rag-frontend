// SavitalConceptDashboard.tsx - Dashboard completo para evaluación de conceptos Savital

import React, { useState } from 'react';
import { 
  BarChart3, Users, TrendingUp, Star, Target, 
  CheckCircle, AlertCircle, Lightbulb, ArrowRight,
  Award, ThumbsUp, MessageSquare, DollarSign
} from 'lucide-react';
import { COMPLETE_CONCEPT_EVALUATION_RESULTS, FINAL_CONCEPT_RANKING } from '../../data/savitalConceptsResults';

interface ConceptCardProps {
  concept: any;
  rank: number;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ concept, rank }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500'; 
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-800';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-blue-600 bg-blue-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header con ranking */}
      <div className={`${getRankColor(rank)} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{concept.concept}</h3>
              <p className="text-white/90">Posición #{rank}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{concept.overall_score}/10</div>
            <p className="text-sm text-white/90">Score General</p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="font-semibold text-lg">{concept.market_potential}</div>
            <div className="text-sm text-gray-600">Potencial de Mercado</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-lg">{concept.target_segments.length}</div>
            <div className="text-sm text-gray-600">Segmentos Target</div>
          </div>
        </div>

        {/* Fortalezas clave */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Fortalezas Clave
          </h4>
          <div className="space-y-1">
            {concept.key_strengths.slice(0, 3).map((strength: string, idx: number) => (
              <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {strength}
              </div>
            ))}
          </div>
        </div>

        {/* Target segments */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            Segmentos Objetivo
          </h4>
          <div className="flex flex-wrap gap-2">
            {concept.target_segments.map((segment: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {segment}
              </span>
            ))}
          </div>
        </div>

        {/* Botón expandir */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 py-2 px-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
        >
          {expanded ? 'Ver Menos' : 'Ver Evaluaciones Detalladas'}
          <ArrowRight className={`h-4 w-4 transform transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {/* Contenido expandido */}
        {expanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <DetailedEvaluation concept={concept} />
          </div>
        )}
      </div>
    </div>
  );
};

const DetailedEvaluation: React.FC<{ concept: any }> = ({ concept }) => {
  // Obtener evaluaciones del concepto desde los resultados completos
  const getConceptData = (conceptName: string) => {
    const conceptKey = Object.keys(COMPLETE_CONCEPT_EVALUATION_RESULTS).find(key => 
      COMPLETE_CONCEPT_EVALUATION_RESULTS[key as keyof typeof COMPLETE_CONCEPT_EVALUATION_RESULTS].concept_name.includes(conceptName.split(' ')[2])
    );
    return conceptKey ? COMPLETE_CONCEPT_EVALUATION_RESULTS[conceptKey as keyof typeof COMPLETE_CONCEPT_EVALUATION_RESULTS] : null;
  };

  const conceptData = getConceptData(concept.concept);
  if (!conceptData) return <div>No hay datos disponibles</div>;

  return (
    <div className="space-y-6">
      {/* Scores promedio */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-indigo-600" />
          Scores Promedio
        </h5>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(conceptData.group_analysis.average_scores).map(([metric, score]) => (
            <div key={metric} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm capitalize">{metric.replace('_', ' ')}</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                score >= 7 ? 'bg-green-100 text-green-800' : 
                score >= 6 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {score}/10
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluaciones individuales top */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-purple-600" />
          Reacciones Más Positivas
        </h5>
        <div className="space-y-3">
          {conceptData.individual_evaluations
            .sort((a: any, b: any) => b.scores.appeal - a.scores.appeal)
            .slice(0, 2)
            .map((evaluation: any, idx: number) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-medium text-sm">{evaluation.user_name}</h6>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Appeal: {evaluation.scores.appeal}/10
                  </span>
                </div>
                <blockquote className="text-sm text-gray-700 italic">
                  "{evaluation.qualitative_feedback.emotional_reaction}"
                </blockquote>
                {evaluation.qualitative_feedback.likes.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600">Le gusta:</p>
                    <p className="text-xs text-gray-600">• {evaluation.qualitative_feedback.likes[0]}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Principales concerns */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          Principales Preocupaciones
        </h5>
        <div className="space-y-2">
          {conceptData.individual_evaluations
            .flatMap((evaluation: any) => evaluation.qualitative_feedback.concerns)
            .filter((concern: string, idx: number, arr: string[]) => arr.indexOf(concern) === idx) // Únicos
            .slice(0, 3)
            .map((concern: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                {concern}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const SavitalConceptDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('ranking');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Evaluación de Conceptos Savital
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Análisis completo con 8 usuarias sintéticas colombianas basado en datos etnográficos reales
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            <button 
              onClick={() => setSelectedTab('ranking')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === 'ranking' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ranking de Conceptos
            </button>
            <button 
              onClick={() => setSelectedTab('insights')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTab === 'insights' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Insights Estratégicos
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {selectedTab === 'ranking' && (
          <div className="space-y-6">
            {FINAL_CONCEPT_RANKING.ranking.map((concept, index) => (
              <ConceptCard 
                key={concept.concept} 
                concept={concept} 
                rank={concept.position}
              />
            ))}
          </div>
        )}

        {selectedTab === 'insights' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-yellow-500" />
              Recomendaciones Estratégicas
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Recomendaciones inmediatas */}
              <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Lanzamiento Inmediato
                </h3>
                <p className="text-green-800 mb-2 font-medium">
                  {FINAL_CONCEPT_RANKING.strategic_recommendations.immediate_launch}
                </p>
                <p className="text-sm text-green-700">
                  Mayor potencial universal, especialmente para clima húmedo colombiano
                </p>
              </div>

              {/* Extensión de línea */}
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Extensión de Línea
                </h3>
                <p className="text-blue-800 mb-2 font-medium">
                  {FINAL_CONCEPT_RANKING.strategic_recommendations.line_extension}
                </p>
                <p className="text-sm text-blue-700">
                  Complemento perfecto para diferentes necesidades capilares
                </p>
              </div>

              {/* Posicionamiento premium */}
              <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Premium Positioning
                </h3>
                <p className="text-purple-800 mb-2 font-medium">
                  {FINAL_CONCEPT_RANKING.strategic_recommendations.premium_positioning}
                </p>
                <p className="text-sm text-purple-700">
                  Nicho específico pero con pricing premium justificado
                </p>
              </div>

              {/* Requiere educación */}
              <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Requiere Educación
                </h3>
                <p className="text-orange-800 mb-2 font-medium">
                  {FINAL_CONCEPT_RANKING.strategic_recommendations.requires_education}
                </p>
                <p className="text-sm text-orange-700">
                  Campaña educativa sobre beneficios del baobab necesaria
                </p>
              </div>
            </div>

            {/* Insights adicionales */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Insights Clave por Segmento</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Usuarias Savital</h4>
                  <p className="text-sm text-gray-700">Mayor confianza y apertura. Valoran continuidad de aroma y extensiones de marca.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">NSE C+</h4>
                  <p className="text-sm text-gray-700">Más dispuestos a pagar por innovación. Valoran ingredientes premium y diferenciación.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Costa vs Interior</h4>
                  <p className="text-sm text-gray-700">Barranquilla prioriza funcionalidad climática. Bogotá busca versatilidad y eficiencia.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer con metodología */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3">Metodología de Evaluación</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Perfiles Utilizados</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 8 usuarias sintéticas colombianas (4 Bogotá, 4 Barranquilla)</li>
              <li>• 4 usuarias actuales de Savital, 4 de marcas competencia</li>
              <li>• NSE C y C+, edades 25-45 años</li>
              <li>• Basados en datos etnográficos reales de estudios Unilever</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Métricas Evaluadas</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Appeal: Atractivo general del concepto</li>
              <li>• Relevance: Relevancia para necesidades específicas</li>
              <li>• Believability: Credibilidad de claims y beneficios</li>
              <li>• Uniqueness: Diferenciación vs competencia</li>
              <li>• Purchase Intention: Intención de compra real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavitalConceptDashboard;