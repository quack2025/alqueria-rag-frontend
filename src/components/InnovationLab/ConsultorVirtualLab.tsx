/**
 * Consultor Virtual Lab - Innovation Lab simplificado con análisis rápido
 * Reemplaza el sistema complejo de entrevistas múltiples
 */

import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, Zap, Brain, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importar servicios
import { ConsultorVirtualService, type ConsultorEvaluation } from '../../services/consultorVirtualService';
import { ConsultorVirtualResults } from './ConsultorVirtualResults';

// Tipos
import type { DairyConcept } from '../../types/dairy.types';

const ConsultorVirtualLab: React.FC = () => {
  const navigate = useNavigate();

  // Estados
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState('');
  const [evaluation, setEvaluation] = useState<ConsultorEvaluation | null>(null);

  // Formulario de concepto
  const [conceptForm, setConceptForm] = useState<Partial<DairyConcept>>({
    name: 'Alquería Vital+ Digestive',
    description: 'Yogurt funcional con probióticos avanzados para mejorar la digestión y fortalecer el sistema inmune',
    category: 'Yogurt Funcional',
    benefits: ['Mejora digestión', 'Fortalece inmunidad', 'Probióticos de alta potencia', 'Sabores naturales'],
    brand: 'Alquería'
  });

  // Conceptos predefinidos para pruebas rápidas
  const predefinedConcepts: DairyConcept[] = [
    {
      id: 'vital-digestive',
      name: 'Alquería Vital+ Digestive',
      description: 'Yogurt funcional con probióticos avanzados para mejorar la digestión y fortalecer el sistema inmune',
      category: 'Yogurt Funcional',
      benefits: ['Mejora digestión', 'Fortalece inmunidad', 'Probióticos de alta potencia', 'Sabores naturales'],
      brand: 'Alquería'
    },
    {
      id: 'leche-organica',
      name: 'Alquería Orgánica Premium',
      description: 'Leche entera orgánica certificada de vacas libres de hormonas, con sabor auténtico de campo',
      category: 'Leche Orgánica',
      benefits: ['100% orgánica', 'Sin hormonas', 'Sabor auténtico', 'Certificación internacional'],
      brand: 'Alquería'
    },
    {
      id: 'queso-gourmet',
      name: 'Alquería Gourmet Madurado',
      description: 'Línea de quesos artesanales madurados con técnicas europeas adaptadas al paladar colombiano',
      category: 'Quesos Premium',
      benefits: ['Técnica artesanal', 'Maduración controlada', 'Sabor sofisticado', 'Origen local'],
      brand: 'Alquería'
    }
  ];

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
        brand: conceptForm.brand || 'Alquería'
      };

      const result = await service.evaluateConcept(concept);
      setEvaluation(result);

    } catch (error) {
      console.error('❌ Error en evaluación:', error);
      setCurrentProgress('❌ Error en la evaluación. Por favor intenta nuevamente.');
    } finally {
      setIsEvaluating(false);
    }
  };

  /**
   * Usar concepto predefinido
   */
  const usePredefinedConcept = (concept: DairyConcept) => {
    setConceptForm(concept);
    setEvaluation(null);
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
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Brain className="w-8 h-8 text-green-600 mr-3" />
                Consultor Virtual
              </h1>
              <p className="text-gray-600">Evaluación rápida de conceptos lácteos con insights profesionales</p>
            </div>
          </div>

          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Análisis en ~30 segundos
            </div>
          </div>
        </div>

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
              </div>
            </div>

            {/* Botón de Evaluación */}
            <div className="text-center">
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !conceptForm.name || !conceptForm.description}
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

      </div>
    </div>
  );
};

export default ConsultorVirtualLab;