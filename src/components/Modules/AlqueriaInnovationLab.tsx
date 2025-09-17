// components/Modules/AlqueriaInnovationLab.tsx - Innovation Lab principal de Alquería
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, Users, History, Clipboard, Play, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importar componentes del Innovation Lab
import PersonaEditor from '../InnovationLab/PersonaEditor';
import ConceptEditor from '../InnovationLab/ConceptEditor';
// import { EvaluationEngine } from '../InnovationLab/EvaluationEngine';
// import { ReportGenerator } from '../InnovationLab/ReportGenerator';

// Importar tipos desde archivo separado para evitar dependencia circular
import type {
  DairyConcept,
  DairyPersona,
  EvaluationResult,
  ConsolidatedStudyResult,
  EvaluationProgress
} from '../../types/dairy.types';
// Importar servicio de evaluación SYNTHETICUSERS con Railway backend
import { generateConversationalEvaluation, type ConversationalEvaluation } from '../../services/claudeEvaluationService';
// Importar sistema de personas sintéticas de Alquería
import { alqueriaPersonas } from '../../data/alqueriaPersonaSystem';
// Importar nuevo servicio de evaluación consolidada
import { ConsolidatedEvaluationService } from '../../services/consolidatedEvaluationService';
// Importar componentes para el nuevo sistema
import EvaluationProgress from '../InnovationLab/EvaluationProgress';
import ConsolidatedResults from '../InnovationLab/ConsolidatedResults';

const AlqueriaInnovationLab: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'evaluate' | 'concepts' | 'personas' | 'history'>('evaluate');

  // Estado para conceptos
  const [concepts, setConcepts] = useState<DairyConcept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<DairyConcept | null>(null);
  const [editingConcept, setEditingConcept] = useState<DairyConcept | null>(null);

  // Estado para personas
  const [personas, setPersonas] = useState<DairyPersona[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<DairyPersona[]>([]);
  const [editingPersona, setEditingPersona] = useState<DairyPersona | null>(null);

  // Estado para evaluaciones (legacy)
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);

  // Estado para nuevo sistema consolidado
  const [consolidatedStudies, setConsolidatedStudies] = useState<ConsolidatedStudyResult[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState<EvaluationProgress | null>(null);
  const [currentStudy, setCurrentStudy] = useState<ConsolidatedStudyResult | null>(null);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = () => {
    try {
      const storedConcepts = localStorage.getItem('alqueria-innovation-concepts');
      const storedPersonas = localStorage.getItem('alqueria-innovation-personas');
      const storedEvaluations = localStorage.getItem('alqueria-innovation-evaluations');
      const storedConsolidatedStudies = localStorage.getItem('alqueria-consolidated-studies');

      // Si no hay conceptos, precargar concepto de ejemplo
      if (!storedConcepts) {
        const sampleConcept: DairyConcept = {
          id: `concept-${Date.now()}-demo`,
          name: 'Alquería Vital+ Digestive',
          category: 'yogurt',
          brand: 'Alquería Funcional',
          description: 'Yogurt griego con probióticos específicos para salud digestiva, enriquecido con fibra prebiótica y sin azúcar añadido. Dirigido a adultos conscientes de su bienestar digestivo.',
          benefits: [
            'Mejora la flora intestinal con 5 cepas probióticas',
            'Rico en proteína (15g por porción)',
            'Fibra prebiótica que alimenta bacterias buenas',
            'Sin azúcar añadido, endulzado con stevia natural',
            'Textura cremosa tipo griego',
            'Fortificado con vitaminas del complejo B'
          ],
          targetAudience: 'Adultos 25-50 años preocupados por salud digestiva y bienestar general',
          ingredients: [
            'Leche descremada',
            'Cultivos probióticos (Lactobacillus, Bifidobacterium)',
            'Fibra de achicoria (inulina)',
            'Stevia natural',
            'Vitaminas B6, B12',
            'Espesantes naturales'
          ],
          nutritionalClaims: ['Rico en proteína', 'Con probióticos', 'Sin azúcar añadido', 'Fuente de fibra'],
          distributionType: 'frio',
          shelfLife: 21,
          packaging: 'Envase individual 150g, tapa peelable, diseño premium',
          pricing: 'Premium (20% sobre yogurt griego regular)',
          competitiveAdvantage: 'Única combinación de 5 probióticos específicos + fibra prebiótica en el mercado colombiano',
          regulatoryConsiderations: 'Registro INVIMA como alimento funcional',
          marketingClaims: [
            'Cuida tu digestión desde adentro',
            'La ciencia del bienestar digestivo',
            '5 probióticos que tu cuerpo necesita'
          ],
          createdAt: new Date()
        };

        setConcepts([sampleConcept]);
        localStorage.setItem('alqueria-innovation-concepts', JSON.stringify([sampleConcept]));
        console.log('🥛 Concepto de ejemplo precargado: Alquería Vital+ Digestive');
      } else {
        setConcepts(JSON.parse(storedConcepts));
      }

      // Si no hay personas, cargar el sistema completo de 7 personas sintéticas de Alquería
      if (!storedPersonas) {
        setPersonas(alqueriaPersonas);
        localStorage.setItem('alqueria-innovation-personas', JSON.stringify(alqueriaPersonas));
        console.log('👥 Sistema completo de 7 personas sintéticas de Alquería cargado');
      } else {
        const parsedPersonas = JSON.parse(storedPersonas);
        // Si hay personas guardadas pero son menos de 7, actualizar con el sistema completo
        if (parsedPersonas.length < 7) {
          setPersonas(alqueriaPersonas);
          localStorage.setItem('alqueria-innovation-personas', JSON.stringify(alqueriaPersonas));
          console.log('👥 Sistema actualizado a 7 personas sintéticas completas de Alquería');
        } else {
          setPersonas(parsedPersonas);
        }
      }

      if (storedEvaluations) {
        setEvaluations(JSON.parse(storedEvaluations));
      }

      // Cargar estudios consolidados
      if (storedConsolidatedStudies) {
        setConsolidatedStudies(JSON.parse(storedConsolidatedStudies));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  // Guardar conceptos
  const saveConcepts = (newConcepts: DairyConcept[]) => {
    setConcepts(newConcepts);
    localStorage.setItem('alqueria-innovation-concepts', JSON.stringify(newConcepts));
  };

  // Guardar personas
  const savePersonas = (newPersonas: DairyPersona[]) => {
    setPersonas(newPersonas);
    localStorage.setItem('alqueria-innovation-personas', JSON.stringify(newPersonas));
  };

  // Guardar evaluaciones (legacy)
  const saveEvaluations = (newEvaluations: EvaluationResult[]) => {
    setEvaluations(newEvaluations);
    localStorage.setItem('alqueria-innovation-evaluations', JSON.stringify(newEvaluations));
  };

  // Guardar estudios consolidados
  const saveConsolidatedStudies = (newStudies: ConsolidatedStudyResult[]) => {
    setConsolidatedStudies(newStudies);
    localStorage.setItem('alqueria-consolidated-studies', JSON.stringify(newStudies));
  };

  // Nueva función para ejecutar evaluación consolidada de 2 fases
  const runConsolidatedEvaluation = async () => {
    if (!selectedConcept || selectedPersonas.length === 0) {
      alert('Por favor selecciona un concepto y al menos una persona para evaluar.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationProgress(null);

    try {
      // Crear servicio de evaluación con callback de progreso
      const evaluationService = new ConsolidatedEvaluationService((progress) => {
        setEvaluationProgress(progress);
      });

      console.log(`🚀 Iniciando evaluación consolidada: ${selectedConcept.name} con ${selectedPersonas.length} personas`);

      // Ejecutar evaluación de 2 fases
      const study = await evaluationService.runConsolidatedEvaluation(
        selectedConcept,
        selectedPersonas
      );

      // Guardar el estudio
      const updatedStudies = [...consolidatedStudies, study];
      saveConsolidatedStudies(updatedStudies);

      // Mostrar resultados
      setCurrentStudy(study);
      setActiveTab('history');

      console.log(`✅ Estudio consolidado completado: ${study.interviews.length} entrevistas + reporte ejecutivo`);

    } catch (error) {
      console.error('❌ Error durante evaluación consolidada:', error);
      alert('Error al ejecutar la evaluación consolidada. Por favor verifica la conexión con Railway backend.');
    } finally {
      setIsEvaluating(false);
      setEvaluationProgress(null);
    }
  };

  // Función para cancelar evaluación
  const cancelEvaluation = () => {
    setIsEvaluating(false);
    setEvaluationProgress(null);
    console.log('🚫 Evaluación cancelada por el usuario');
  };

  // Funciones auxiliares para convertir ConversationalEvaluation a scores numéricos
  const calculateOverallAcceptance = (evaluation: ConversationalEvaluation): number => {
    const positiveCount = evaluation.conversation.filter(c =>
      c.response.toLowerCase().includes('me gusta') ||
      c.response.toLowerCase().includes('excelente') ||
      c.response.toLowerCase().includes('perfecto')
    ).length;

    const totalQuestions = evaluation.conversation.length;
    return Math.round((positiveCount / totalQuestions) * 100) || 70;
  };

  const calculateAspectScores = (evaluation: ConversationalEvaluation) => {
    const responses = evaluation.conversation.map(c => c.response.toLowerCase()).join(' ');

    return {
      taste: responses.includes('sabor') || responses.includes('deliciosa') ? 85 : 70,
      nutrition: responses.includes('nutritiv') || responses.includes('salud') ? 80 : 70,
      convenience: responses.includes('práctic') || responses.includes('fácil') ? 75 : 65,
      price: responses.includes('precio') || responses.includes('cost') ? 65 : 70,
      packaging: responses.includes('empaque') || responses.includes('envase') ? 70 : 65,
      brand: responses.includes('confianza') || responses.includes('marca') ? 85 : 75
    };
  };

  const extractMainQuote = (evaluation: ConversationalEvaluation): string => {
    const thematicQuotes = evaluation.executiveSummary.thematicAnalysis.flatMap(t => t.relevantQuotes);
    return thematicQuotes[0] || `"${evaluation.conversation[0]?.response.substring(0, 100)}..."`;
  };

  const extractConcerns = (evaluation: ConversationalEvaluation): string[] => {
    return evaluation.conversation
      .filter(c => c.response.toLowerCase().includes('preocupa') || c.response.toLowerCase().includes('dud'))
      .map(c => c.response.substring(0, 80) + '...')
      .slice(0, 3);
  };

  const calculatePurchaseIntent = (evaluation: ConversationalEvaluation): number => {
    const intent = evaluation.executiveSummary.surprisingInsight.insight.toLowerCase();
    if (intent.includes('definitivamente') || intent.includes('segur')) return 85;
    if (intent.includes('no') || intent.includes('difícil')) return 35;
    return 65;
  };

  const calculateRecommendationScore = (evaluation: ConversationalEvaluation): number => {
    return evaluation.metadata.coherenceScore * 100 || 75;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">🥛 Innovation Lab</h1>
                  <p className="text-sm text-gray-600">Evaluación de conceptos lácteos con consumidores sintéticos</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Alquería</p>
              <p className="text-lg font-semibold text-green-600">734 documentos lácteos</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            {[
              { key: 'evaluate' as const, label: 'Evaluar', icon: Play },
              { key: 'concepts' as const, label: 'Conceptos', icon: Clipboard },
              { key: 'personas' as const, label: 'Personas', icon: Users },
              { key: 'history' as const, label: 'Historial', icon: History }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === key
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mostrar progreso de evaluación */}
      {evaluationProgress && (
        <EvaluationProgress
          progress={evaluationProgress}
          onCancel={cancelEvaluation}
        />
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'evaluate' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🎯 Evaluación de Conceptos Lácteos</h2>

              {/* Selección de concepto */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">1. Selecciona un concepto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {concepts.map((concept) => (
                    <div
                      key={concept.id}
                      onClick={() => setSelectedConcept(concept)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedConcept?.id === concept.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900">{concept.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{concept.category}</p>
                      <p className="text-xs text-gray-500 mt-2">{concept.description}</p>
                    </div>
                  ))}
                </div>
                {concepts.length === 0 && (
                  <p className="text-gray-500">No hay conceptos creados. Ve a la pestaña Conceptos para crear uno.</p>
                )}
              </div>

              {/* Selección de personas */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">2. Selecciona personas (máx. 5)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personas.map((persona) => {
                    const isSelected = selectedPersonas.some(p => p.id === persona.id);
                    return (
                      <div
                        key={persona.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedPersonas(selectedPersonas.filter(p => p.id !== persona.id));
                          } else if (selectedPersonas.length < 5) {
                            setSelectedPersonas([...selectedPersonas, persona]);
                          }
                        }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-green-600 bg-green-50'
                            : selectedPersonas.length >= 5
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <h4 className="font-semibold text-gray-900">{persona.name}</h4>
                        <p className="text-sm text-gray-600">{persona.archetype}</p>
                        <p className="text-xs text-gray-500">
                          {persona.baseProfile.age} años, {persona.baseProfile.location}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {personas.length === 0 && (
                  <p className="text-gray-500">No hay personas creadas. Ve a la pestaña Personas para crear una.</p>
                )}
              </div>

              {/* Botón de evaluación consolidada */}
              <div className="flex justify-center">
                <button
                  onClick={runConsolidatedEvaluation}
                  disabled={!selectedConcept || selectedPersonas.length === 0 || isEvaluating}
                  className={`px-8 py-3 rounded-lg font-medium flex items-center space-x-2 ${
                    !selectedConcept || selectedPersonas.length === 0 || isEvaluating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <Play className="h-5 w-5" />
                  <span>{isEvaluating ? 'Evaluando...' : 'Ejecutar Evaluación SyntheticUsers'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'concepts' && (
          <ConceptEditor
            concepts={concepts}
            onSaveConcepts={saveConcepts}
            editingConcept={editingConcept}
            onEditConcept={setEditingConcept}
          />
        )}

        {activeTab === 'personas' && (
          <PersonaEditor
            personas={personas}
            onSavePersonas={savePersonas}
            editingPersona={editingPersona}
            onEditPersona={setEditingPersona}
          />
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">📊 Historial de Estudios</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>

            {/* Mostrar estudio actual si está seleccionado */}
            {currentStudy && (
              <div className="mb-8">
                <ConsolidatedResults
                  study={currentStudy}
                  onClose={() => setCurrentStudy(null)}
                />
              </div>
            )}

            {/* Lista de estudios consolidados */}
            {consolidatedStudies.length === 0 && !currentStudy ? (
              <p className="text-gray-500 text-center py-8">
                No hay estudios aún. Ejecuta una evaluación SyntheticUsers desde la pestaña Evaluar.
              </p>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudios Consolidados ({consolidatedStudies.length})</h3>
                {consolidatedStudies.map((study) => (
                  <div key={study.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {study.conceptName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {study.metadata.totalInterviews} entrevistas |
                          {Math.round(study.metadata.evaluationTime / 60)} min de duración
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(study.metadata.completedAt).toLocaleDateString()} -
                          Personas: {study.metadata.personas.join(', ')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentStudy(study)}
                          className="p-2 text-gray-400 hover:text-green-600"
                          title="Ver resultados"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Evaluaciones legacy si existen */}
                {evaluations.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluaciones Individuales ({evaluations.length})</h3>
                    {evaluations.map((evaluation) => (
                      <div key={evaluation.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {evaluation.conceptName} × {evaluation.personaName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Aceptación: {evaluation.overallAcceptance}% |
                              Intención de compra: {evaluation.purchaseIntent}%
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-green-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 italic mt-2">
                          "{evaluation.qualitativeInsights.quote}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlqueriaInnovationLab;