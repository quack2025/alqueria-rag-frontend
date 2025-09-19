/**
 * Consultor Virtual Lab - Enhanced Concept Evaluation Interface
 *
 * @description Advanced UI for dairy concept evaluation with persona selection
 *              and comprehensive analysis capabilities
 *
 * @features
 * - Manual/Automatic persona selection
 * - Real-time evaluation progress
 * - Comprehensive results display
 * - Concept and persona management
 *
 * @version 2.0 - Enhanced with deep analysis capabilities
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, Zap, Brain, Clock, Clipboard, Users, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importar servicios
import { ConsultorVirtualService, type ConsultorEvaluation } from '../../services/consultorVirtualService';
import { ConsultorVirtualResults } from './ConsultorVirtualResults';

// Importar editores
import ConceptEditor from './ConceptEditor';
import PersonaEditor from './PersonaEditor';

// Tipos
import type { DairyConcept, DairyPersona } from '../../types/dairy.types';

// Importar sistema de personas de Alquería
import { alqueriaPersonas } from '../../data/alqueriaPersonaSystem';

const ConsultorVirtualLab: React.FC = () => {
  const navigate = useNavigate();

  // Estados de navegación
  const [activeTab, setActiveTab] = useState<'evaluate' | 'concepts' | 'personas'>('evaluate');

  // Estados de evaluación
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState('');
  const [evaluation, setEvaluation] = useState<ConsultorEvaluation | null>(null);

  // Estados de gestión de datos
  const [concepts, setConcepts] = useState<DairyConcept[]>([]);
  const [personas, setPersonas] = useState<DairyPersona[]>([]);
  const [editingConcept, setEditingConcept] = useState<DairyConcept | null>(null);
  const [editingPersona, setEditingPersona] = useState<DairyPersona | null>(null);

  // Formulario de concepto
  const [conceptForm, setConceptForm] = useState<Partial<DairyConcept>>({
    name: 'Alquería Vital+ Digestive',
    description: 'Yogurt funcional con probióticos avanzados para mejorar la digestión y fortalecer el sistema inmune',
    category: 'Yogurt Funcional',
    benefits: ['Mejora digestión', 'Fortalece inmunidad', 'Probióticos de alta potencia', 'Sabores naturales'],
    brand: 'Alquería',
    pricing: 'Premium (+20% vs yogurt regular)'
  });

  // Selección de personas para evaluación
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [isAutoSelection, setIsAutoSelection] = useState(true);

  // Conceptos predefinidos para pruebas rápidas
  const predefinedConcepts: DairyConcept[] = [
    {
      id: 'vital-digestive',
      name: 'Alquería Vital+ Digestive',
      description: 'Yogurt funcional con probióticos avanzados para mejorar la digestión y fortalecer el sistema inmune',
      category: 'Yogurt Funcional',
      benefits: ['Mejora digestión', 'Fortalece inmunidad', 'Probióticos de alta potencia', 'Sabores naturales'],
      brand: 'Alquería',
      pricing: 'Premium (+20% vs yogurt regular)'
    },
    {
      id: 'leche-organica',
      name: 'Alquería Orgánica Premium',
      description: 'Leche entera orgánica certificada de vacas libres de hormonas, con sabor auténtico de campo',
      category: 'Leche Orgánica',
      benefits: ['100% orgánica', 'Sin hormonas', 'Sabor auténtico', 'Certificación internacional'],
      brand: 'Alquería',
      pricing: 'Super Premium (+35% vs leche regular)'
    },
    {
      id: 'queso-gourmet',
      name: 'Alquería Gourmet Madurado',
      description: 'Línea de quesos artesanales madurados con técnicas europeas adaptadas al paladar colombiano',
      category: 'Quesos Premium',
      benefits: ['Técnica artesanal', 'Maduración controlada', 'Sabor sofisticado', 'Origen local'],
      brand: 'Alquería',
      pricing: 'Gourmet ($18,000 - $25,000 COP/kg)'
    }
  ];

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = () => {
    try {
      const storedConcepts = localStorage.getItem('alqueria-innovation-concepts');
      const storedPersonas = localStorage.getItem('alqueria-innovation-personas');

      // Cargar conceptos guardados o usar predefinidos
      if (storedConcepts) {
        setConcepts(JSON.parse(storedConcepts));
      } else {
        setConcepts(predefinedConcepts);
        localStorage.setItem('alqueria-innovation-concepts', JSON.stringify(predefinedConcepts));
      }

      // Cargar personas guardadas o usar sistema de Alquería
      if (storedPersonas) {
        setPersonas(JSON.parse(storedPersonas));
      } else {
        setPersonas(alqueriaPersonas);
        localStorage.setItem('alqueria-innovation-personas', JSON.stringify(alqueriaPersonas));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  // Funciones de gestión de datos
  const saveConcepts = (newConcepts: DairyConcept[]) => {
    setConcepts(newConcepts);
    localStorage.setItem('alqueria-innovation-concepts', JSON.stringify(newConcepts));
  };

  const savePersonas = (newPersonas: DairyPersona[]) => {
    setPersonas(newPersonas);
    localStorage.setItem('alqueria-innovation-personas', JSON.stringify(newPersonas));
  };

  /**
   * Usar concepto predefinido
   */
  const usePredefinedConcept = (concept: DairyConcept) => {
    setConceptForm(concept);
    setEvaluation(null);
  };

  /**
   * Ejecutar evaluación con Consultor Virtual
   */
  const handleEvaluate = async () => {
    if (!conceptForm.name || !conceptForm.description) {
      alert('Por favor completa al menos el nombre y descripción del concepto');
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);
    setCurrentProgress('Iniciando Consultor Virtual...');

    try {
      // Crear servicio con callback de progreso
      const service = new ConsultorVirtualService((progress) => {
        setCurrentProgress(progress);
      });

      // Ejecutar evaluación
      const concept: DairyConcept = {
        id: conceptForm.id || `concept-${Date.now()}`,
        name: conceptForm.name!,
        description: conceptForm.description!,
        category: conceptForm.category || 'Lácteo',
        benefits: conceptForm.benefits || [],
        brand: conceptForm.brand || 'Alquería',
        pricing: conceptForm.pricing || 'Precio estándar'
      };

      // Obtener personas seleccionadas para evaluar
      const personasToEvaluate = isAutoSelection ? undefined : selectedPersonas;

      const result = await service.evaluateConcept(concept, personasToEvaluate);
      setEvaluation(result);

    } catch (error) {
      console.error('❌ Error en evaluación:', error);
      setCurrentProgress('❌ Error en la evaluación. Por favor intenta nuevamente.');
    } finally {
      setIsEvaluating(false);
    }
  };

  /**
   * Exportar resultados como JSON
   */
  const exportResults = () => {
    if (!evaluation) return;

    const dataStr = JSON.stringify(evaluation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `consultor-virtual-${evaluation.conceptName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  /**
   * Nueva evaluación
   */
  const newEvaluation = () => {
    setEvaluation(null);
    setCurrentProgress('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Brain className="w-8 h-8 text-green-600 mr-3" />
                Innovation Lab
              </h1>
              <p className="text-gray-600">Evaluación rápida de conceptos lácteos basados en RAG</p>
            </div>
          </div>

          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Análisis en ~30 segundos
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { key: 'evaluate' as const, label: 'Evaluar', icon: Play },
            { key: 'concepts' as const, label: 'Conceptos', icon: Clipboard },
            { key: 'personas' as const, label: 'Personas', icon: Users }
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

        {/* Contenido según tab activo */}
        {activeTab === 'evaluate' && (
          <>
            {/* Resultados o Formulario */}
            {evaluation ? (
              <ConsultorVirtualResults
                evaluation={evaluation}
                onExportJson={exportResults}
                onNewEvaluation={newEvaluation}
              />
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">

                {/* Conceptos Predefinidos */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Conceptos de Prueba
                  </h2>

                  <div className="grid md:grid-cols-3 gap-4">
                    {predefinedConcepts.map((concept) => (
                      <button
                        key={concept.id}
                        onClick={() => usePredefinedConcept(concept)}
                        className="text-left p-4 border rounded-lg hover:border-green-300 hover:shadow-sm transition-all"
                      >
                        <h3 className="font-semibold text-gray-800">{concept.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{concept.description}</p>
                        <div className="text-xs text-green-600 mt-2">{concept.category}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formulario de Concepto */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Concepto a Evaluar</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Concepto
                      </label>
                      <input
                        type="text"
                        value={conceptForm.name || ''}
                        onChange={(e) => setConceptForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Alquería Vital+ Digestive"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        value={conceptForm.description || ''}
                        onChange={(e) => setConceptForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Descripción detallada del producto lácteo..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría
                        </label>
                        <input
                          type="text"
                          value={conceptForm.category || ''}
                          onChange={(e) => setConceptForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ej: Yogurt Funcional"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marca
                        </label>
                        <input
                          type="text"
                          value={conceptForm.brand || ''}
                          onChange={(e) => setConceptForm(prev => ({ ...prev, brand: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Alquería"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Beneficios Clave (separados por coma)
                      </label>
                      <input
                        type="text"
                        value={conceptForm.benefits?.join(', ') || ''}
                        onChange={(e) => setConceptForm(prev => ({
                          ...prev,
                          benefits: e.target.value.split(',').map(b => b.trim()).filter(b => b)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Mejora digestión, Fortalece inmunidad, Probióticos de alta potencia"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estrategia de Precio
                      </label>
                      <input
                        type="text"
                        value={conceptForm.pricing || ''}
                        onChange={(e) => setConceptForm(prev => ({ ...prev, pricing: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Premium (+20% vs competencia), Paridad, Valor ($3,500 COP)"
                      />
                    </div>
                  </div>
                </div>

                {/* ============================================================ */}
                {/* PERSONA SELECTION SECTION - Enhanced v2.0 Feature          */}
                {/* ============================================================ */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      Target Audience Selection
                    </h3>

                    <div className="flex items-center space-x-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={isAutoSelection}
                          onChange={() => setIsAutoSelection(true)}
                          className="mr-2 text-green-600"
                        />
                        <span className="text-sm text-gray-700">Automático (5 personas)</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={!isAutoSelection}
                          onChange={() => setIsAutoSelection(false)}
                          className="mr-2 text-green-600"
                        />
                        <span className="text-sm text-gray-700">Manual</span>
                      </label>
                    </div>
                  </div>

                  {!isAutoSelection && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <p className="text-sm text-gray-600 mb-2">
                        Selecciona entre 3 y 8 personas (Actual: {selectedPersonas.length})
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {personas.slice(0, 12).map((persona) => (
                          <label key={persona.id} className="flex items-start space-x-2 p-2 border rounded cursor-pointer hover:bg-white transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedPersonas.includes(persona.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selectedPersonas.length < 8) {
                                    setSelectedPersonas([...selectedPersonas, persona.id]);
                                  }
                                } else {
                                  setSelectedPersonas(selectedPersonas.filter(id => id !== persona.id));
                                }
                              }}
                              className="mt-1 text-green-600"
                              disabled={!selectedPersonas.includes(persona.id) && selectedPersonas.length >= 8}
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-800">{persona.name}</div>
                              <div className="text-xs text-gray-600">
                                {persona.baseProfile.age} años, {persona.baseProfile.location}
                              </div>
                              <div className="text-xs text-gray-500">
                                {persona.dairyConsumption.frequency}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                      {selectedPersonas.length < 3 && (
                        <p className="text-sm text-red-600 mt-2">
                          ⚠️ Selecciona al menos 3 personas para una evaluación representativa
                        </p>
                      )}
                    </div>
                  )}

                  {isAutoSelection && (
                    <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                      <p className="font-medium mb-1">✨ Selección Automática</p>
                      <p>El sistema seleccionará automáticamente 5 personas representativas del mercado lácteo colombiano con diversidad de edades, NSE y regiones.</p>
                    </div>
                  )}
                </div>

                {/* Botón de Evaluación */}
                <div className="text-center">
                  <button
                    onClick={handleEvaluate}
                    disabled={
                      isEvaluating ||
                      !conceptForm.name ||
                      !conceptForm.description ||
                      (!isAutoSelection && selectedPersonas.length < 3)
                    }
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold
                             hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200 flex items-center space-x-2 mx-auto"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analizando...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        <span>Evaluar con Consultor Virtual</span>
                      </>
                    )}
                  </button>

                  {/* Progress durante evaluación */}
                  {isEvaluating && currentProgress && (
                    <div className="mt-4 text-sm text-gray-600 flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {currentProgress}
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
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

      </div>
    </div>
  );
};

export default ConsultorVirtualLab;