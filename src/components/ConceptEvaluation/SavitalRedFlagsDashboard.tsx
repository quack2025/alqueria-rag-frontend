// SavitalRedFlagsDashboard.tsx - Módulo de Diagnóstico y Red Flags
import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Edit2, 
  Save, 
  X, 
  RefreshCw, 
  Package, 
  DollarSign,
  BookOpen,
  Zap,
  Target,
  Settings,
  Eye,
  UserCheck
} from 'lucide-react';
import { savitalFocusService } from '../../services/savitalFocusService';
import { SAVITAL_FOCUS_GROUP } from '../../data/savitalFocusGroup';
import type { ProductConcept } from '../../services/savitalFocusService';

import SavitalUserEditor from './SavitalUserEditor';
interface RedFlag {
  type: 'educational' | 'price' | 'ingredient' | 'format' | 'claim' | 'segment';
  severity: 'low' | 'medium' | 'high';
  issue: string;
  description: string;
  affected_users: string[];
  suggestion: string;
  priority: number;
}

interface ConceptDiagnosis {
  concept_id: string;
  overall_risk: 'low' | 'medium' | 'high';
  red_flags: RedFlag[];
  opportunities: string[];
  readiness_score: number; // 0-100
  improvements_needed: string[];
}

const SavitalRedFlagsDashboard: React.FC = () => {
  const [concepts, setConcepts] = useState<ProductConcept[]>([
    {
      id: 'savital_control_caida',
      name: 'Control Caída desde la Raíz',
      description: 'Fórmula avanzada con complejo de biotina, cafeína y ginseng que fortalece el folículo piloso desde la raíz, reduciendo la caída hasta un 80% en 8 semanas de uso continuo.',
      key_ingredients: ['Biotina fortificada', 'Cafeína estimulante', 'Ginseng revitalizante'],
      target_segment: 'Mujeres 25-45 años con caída moderada a severa',
      price_range: '28,000-35,000 COP',
      usage_frequency: 'Diario',
      expected_results: 'Reducción visible de caída en 2 semanas',
      emotional_benefit: 'Recupera tu confianza con cabello fuerte',
      sensory_experience: 'Aroma herbal energizante, textura ligera',
      format: 'Shampoo + Acondicionador'
    },
    {
      id: 'savital_equilibrio_capilar',
      name: 'Equilibrio Capilar',
      description: 'Sistema inteligente con niacinamida y zinc que regula la producción de grasa sin resecar, ideal para cuero cabelludo mixto. Equilibra pH y microbioma capilar.',
      key_ingredients: ['Niacinamida reguladora', 'Zinc purificante', 'Prebióticos'],
      target_segment: 'Todo tipo de cabello con desequilibrios',
      price_range: '22,000-28,000 COP',
      usage_frequency: '3 veces por semana',
      expected_results: 'Equilibrio visible en 1 semana',
      emotional_benefit: 'Simplicidad y equilibrio en tu rutina',
      sensory_experience: 'Frescura mentolada suave',
      format: 'Shampoo + Mascarilla semanal'
    },
    {
      id: 'savital_nutricion_raiz',
      name: 'Nutrición desde la Raíz',
      description: 'Tratamiento intensivo con aceite de baobab africano y keratina vegetal que penetra profundamente nutriendo desde el interior. Repara daño extremo y previene quiebre.',
      key_ingredients: ['Aceite de Baobab', 'Keratina vegetal', 'Vitamina E'],
      target_segment: 'Cabello muy dañado, procesado químicamente',
      price_range: '25,000-32,000 COP',
      usage_frequency: '2-3 veces por semana',
      expected_results: 'Nutrición profunda en 3 aplicaciones',
      emotional_benefit: 'Reparación profesional en casa',
      sensory_experience: 'Cremoso, aroma a vainilla africana',
      format: 'Shampoo + Tratamiento intensivo'
    },
    {
      id: 'savital_frizz_control',
      name: 'Hidratación y Control Frizz',
      description: 'Tecnología anti-humedad con aceite de jojoba y proteína de quinoa que sella la cutícula, controlando el frizz hasta por 72 horas incluso en clima húmedo.',
      key_ingredients: ['Aceite de Jojoba', 'Proteína de Quinoa', 'Silicona vegetal'],
      target_segment: 'Cabello rizado/ondulado en clima húmedo',
      price_range: '20,000-26,000 COP',
      usage_frequency: 'Cada lavado',
      expected_results: 'Control inmediato del frizz',
      emotional_benefit: 'Libertad sin preocuparte del clima',
      sensory_experience: 'Suave, aroma tropical fresco',
      format: 'Shampoo + Crema para peinar'
    },
    {
      id: 'savital_crecimiento_abundante',
      name: 'Crecimiento Abundante',
      description: 'Elixir de crecimiento con triple acción: romero estimulante, biotina y extracto de sábila. Acelera el crecimiento hasta 2cm por mes y aumenta densidad capilar.',
      key_ingredients: ['Romero estimulante', 'Biotina', 'Sábila regeneradora'],
      target_segment: 'Mujeres que buscan cabello más largo y abundante',
      price_range: '30,000-38,000 COP',
      usage_frequency: 'Diario en cuero cabelludo',
      expected_results: 'Nuevo crecimiento visible en 4 semanas',
      emotional_benefit: 'El cabello largo que siempre soñaste',
      sensory_experience: 'Elixir ligero, aroma herbal fresco',
      format: 'Elixir concentrado + Shampoo'
    }
  ]);

  const [diagnoses, setDiagnoses] = useState<{[key: string]: ConceptDiagnosis}>({});
  const [loading, setLoading] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [showUserEditor, setShowUserEditor] = useState(false);

  useEffect(() => {
    runDiagnosticAnalysis();
  }, []);

  const runDiagnosticAnalysis = () => {
    setLoading(true);
    
    const newDiagnoses: {[key: string]: ConceptDiagnosis} = {};
    
    concepts.forEach(concept => {
      const diagnosis = generateConceptDiagnosis(concept);
      newDiagnoses[concept.id] = diagnosis;
    });
    
    setDiagnoses(newDiagnoses);
    setLoading(false);
  };

  const generateConceptDiagnosis = (concept: ProductConcept): ConceptDiagnosis => {
    const redFlags: RedFlag[] = [];
    const opportunities: string[] = [];
    const improvements: string[] = [];
    
    // Análisis de ingredientes complejos
    if (concept.key_ingredients.some(ing => ing.toLowerCase().includes('baobab'))) {
      redFlags.push({
        type: 'educational',
        severity: 'high',
        issue: 'Ingrediente desconocido',
        description: 'Aceite de Baobab requiere campaña educativa sobre beneficios',
        affected_users: ['4', '5', '7'], // NSE C principalmente
        suggestion: 'Desarrollar contenido educativo sobre beneficios del Baobab africano',
        priority: 1
      });
      improvements.push('Crear campaña educativa sobre Baobab');
    }
    
    if (concept.key_ingredients.some(ing => ing.toLowerCase().includes('niacinamida'))) {
      redFlags.push({
        type: 'ingredient',
        severity: 'medium',
        issue: 'Ingrediente "químico"',
        description: 'Niacinamida puede generar rechazo por sonar muy científica',
        affected_users: ['1', '3', '6'], // Usuarias que prefieren natural
        suggestion: 'Renombrar como "Vitamina B3 reguladora" o "Complejo B natural"',
        priority: 2
      });
      improvements.push('Simplificar nombre de Niacinamida');
    }

    // Análisis de precio
    const avgPrice = parseFloat(concept.price_range.split('-')[1].replace(',', '').replace(' COP', ''));
    if (avgPrice > 32000) {
      redFlags.push({
        type: 'price',
        severity: 'high',
        issue: 'Precio elevado para NSE C',
        description: 'Precio percibido como premium para NSE C',
        affected_users: ['4', '5', '7', '8'], // NSE C
        suggestion: 'Crear versión accesible o justificar valor con evidencia clínica',
        priority: 1
      });
      improvements.push('Optimizar precio para NSE C o crear formato mini');
    }

    // Análisis de claims
    if (concept.expected_results.includes('80%') || concept.expected_results.includes('2cm')) {
      redFlags.push({
        type: 'claim',
        severity: 'medium',
        issue: 'Claims agresivos sin respaldo',
        description: 'Promesas numéricas específicas pueden generar desconfianza',
        affected_users: ['2', '6'], // Usuarias más escépticas
        suggestion: 'Suavizar claims o proporcionar estudios clínicos como respaldo',
        priority: 2
      });
      improvements.push('Moderar claims o agregar respaldo científico');
    }

    // Análisis de formato/rutina
    if (concept.format.includes('+') && concept.usage_frequency === 'Diario') {
      redFlags.push({
        type: 'format',
        severity: 'medium',
        issue: 'Rutina compleja',
        description: 'Múltiples productos de uso diario pueden resultar abrumadores',
        affected_users: ['1', '4', '8'], // Mujeres ocupadas
        suggestion: 'Simplificar a un solo producto o ofrecer kit gradual',
        priority: 3
      });
      improvements.push('Simplificar rutina de uso');
    }

    // Generar oportunidades basadas en fortalezas
    if (concept.emotional_benefit.toLowerCase().includes('confianza')) {
      opportunities.push('Fuerte conexión emocional con autoestima');
    }
    if (concept.target_segment.includes('25-45')) {
      opportunities.push('Target amplio con alto poder adquisitivo');
    }

    // Calcular readiness score
    const totalRedFlags = redFlags.length;
    const highSeverityFlags = redFlags.filter(f => f.severity === 'high').length;
    const readinessScore = Math.max(0, 100 - (highSeverityFlags * 25) - (totalRedFlags * 10));
    
    const overallRisk: 'low' | 'medium' | 'high' = 
      highSeverityFlags >= 2 ? 'high' :
      totalRedFlags >= 3 ? 'medium' : 'low';

    return {
      concept_id: concept.id,
      overall_risk: overallRisk,
      red_flags: redFlags.sort((a, b) => a.priority - b.priority),
      opportunities,
      readiness_score: readinessScore,
      improvements_needed: improvements
    };
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getRedFlagIcon = (type: string) => {
    switch(type) {
      case 'educational': return <BookOpen className="w-4 h-4" />;
      case 'price': return <DollarSign className="w-4 h-4" />;
      case 'ingredient': return <Zap className="w-4 h-4" />;
      case 'format': return <Package className="w-4 h-4" />;
      case 'claim': return <Target className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analizando red flags de conceptos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Diagnóstico de Conceptos</h1>
                <p className="text-gray-600">Identificación de red flags y oportunidades de mejora</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUserEditor(!showUserEditor)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Editar Usuarios</span>
              </button>
              <button
                onClick={runDiagnosticAnalysis}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reanalizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conceptos Analizados</p>
                <p className="text-2xl font-bold text-gray-900">{concepts.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Red Flags Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(diagnoses).reduce((acc, d) => acc + d.red_flags.length, 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio Readiness</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(Object.values(diagnoses).reduce((acc, d) => acc + d.readiness_score, 0) / Object.values(diagnoses).length) || 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarias Activas</p>
                <p className="text-2xl font-bold text-gray-900">{SAVITAL_FOCUS_GROUP.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {concepts.map(concept => {
            const diagnosis = diagnoses[concept.id];
            if (!diagnosis) return null;

            return (
              <div key={concept.id} className="bg-white rounded-xl shadow-sm border">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {concept.name}
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(diagnosis.overall_risk)}`}>
                        Riesgo: {diagnosis.overall_risk === 'high' ? 'Alto' : diagnosis.overall_risk === 'medium' ? 'Medio' : 'Bajo'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {diagnosis.readiness_score}%
                      </div>
                      <div className="text-sm text-gray-600">Readiness</div>
                    </div>
                  </div>

                  {/* Red Flags */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Red Flags ({diagnosis.red_flags.length})
                    </h4>
                    <div className="space-y-2">
                      {diagnosis.red_flags.slice(0, 3).map((flag, idx) => (
                        <div key={idx} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                          <div className={`p-1 rounded ${flag.severity === 'high' ? 'bg-red-100 text-red-600' : flag.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {getRedFlagIcon(flag.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{flag.issue}</p>
                            <p className="text-xs text-gray-600">{flag.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Mejoras Sugeridas
                    </h4>
                    <div className="space-y-1">
                      {diagnosis.improvements_needed.slice(0, 2).map((improvement, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedConcept(selectedConcept === concept.id ? null : concept.id)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Detalle Completo</span>
                  </button>
                </div>

                {/* Detailed View */}
                {selectedConcept === concept.id && (
                  <div className="border-t bg-gray-50 p-6">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Todos los Red Flags</h5>
                        <div className="space-y-3">
                          {diagnosis.red_flags.map((flag, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {getRedFlagIcon(flag.type)}
                                  <span className="font-medium text-gray-900">{flag.issue}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${flag.severity === 'high' ? 'bg-red-100 text-red-700' : flag.severity === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {flag.severity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{flag.description}</p>
                              <p className="text-sm text-blue-700 font-medium">💡 {flag.suggestion}</p>
                              <div className="mt-2">
                                <span className="text-xs text-gray-500">
                                  Afecta a {flag.affected_users.length} usuarias
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {diagnosis.opportunities.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Oportunidades</h5>
                          <div className="space-y-2">
                            {diagnosis.opportunities.map((opp, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                                <TrendingUp className="w-4 h-4" />
                                <span>{opp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Editor Modal */}
        {showUserEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Editar Usuarios Sintéticos</h3>
                <button
                  onClick={() => setShowUserEditor(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Próximamente: Editor completo de usuarios sintéticos con todas sus variables
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAVITAL_FOCUS_GROUP.map(user => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📍 {user.city} - {user.age} años</p>
                        <p>💼 {user.occupation}</p>
                        <p>🎯 NSE {user.nse}</p>
                        <p>💄 {user.savital_relationship.is_user ? 'Usuaria Savital' : 'No usuaria'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavitalRedFlagsDashboard;