// components/InnovationLab/ConceptEditor.tsx - Editor de conceptos lácteos para Alquería
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Package, Clipboard, Tag } from 'lucide-react';
import type { DairyConcept } from '../../types/dairy.types';

interface ConceptEditorProps {
  concepts: DairyConcept[];
  onSaveConcepts: (concepts: DairyConcept[]) => void;
  editingConcept: DairyConcept | null;
  onEditConcept: (concept: DairyConcept | null) => void;
}

export const ConceptEditor: React.FC<ConceptEditorProps> = ({
  concepts,
  onSaveConcepts,
  editingConcept,
  onEditConcept
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<Partial<DairyConcept>>({});
  const [newBenefit, setNewBenefit] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newNutritionalClaim, setNewNutritionalClaim] = useState('');

  const dairyCategories = [
    { value: 'leche', label: '🥛 Leche', description: 'Leches líquidas: entera, descremada, deslactosada' },
    { value: 'yogurt', label: '🍶 Yogurt', description: 'Yogurts: natural, griego, bebible, funcional' },
    { value: 'queso', label: '🧀 Queso', description: 'Quesos: frescos, madurados, procesados' },
    { value: 'kumis', label: '🥤 Kumis', description: 'Bebidas fermentadas tradicionales' },
    { value: 'arequipe', label: '🍯 Arequipe', description: 'Dulces lácteos y postres' },
    { value: 'mantequilla', label: '🧈 Mantequilla', description: 'Grasas lácteas y untables' },
    { value: 'crema', label: '🍶 Crema', description: 'Cremas de leche y cooking cream' },
    { value: 'derivados', label: '🥛 Derivados', description: 'Otros productos lácteos' }
  ];

  const alqueriaBrands = [
    { value: 'alqueria', label: 'Alquería', description: 'Marca principal' },
    { value: 'alqueria_premium', label: 'Alquería Premium', description: 'Línea premium y gourmet' },
    { value: 'alqueria_funcional', label: 'Alquería Funcional', description: 'Productos con beneficios funcionales' },
    { value: 'alqueria_organica', label: 'Alquería Orgánica', description: 'Línea orgánica y natural' }
  ];

  const distributionTypes = [
    { value: 'frio', label: '❄️ Cadena de frío', description: 'Refrigeración 2-8°C' },
    { value: 'ambiente', label: '🌡️ Temperatura ambiente', description: 'UHT, larga vida' },
    { value: 'congelado', label: '🧊 Congelado', description: 'Productos congelados' }
  ];

  const nutritionalClaims = [
    'Rico en calcio', 'Alto en proteína', 'Sin lactosa', 'Bajo en grasa',
    'Sin azúcar añadida', 'Con probióticos', 'Vitamina D', 'Omega 3',
    'Sin conservantes', '100% natural', 'Orgánico certificado', 'Libre de gluten'
  ];

  const handleCreateConcept = () => {
    setIsCreating(true);
    setCurrentConcept({
      id: '',
      name: '',
      category: 'leche',
      brand: 'alqueria',
      description: '',
      benefits: [],
      ingredients: [],
      targetAudience: '',
      price: 0,
      differentiation: '',
      packaging: '',
      nutritionalClaims: [],
      shelfLife: 7,
      distribution: 'frio',
      createdAt: new Date()
    });
  };

  const handleSaveConcept = () => {
    if (!currentConcept.name || !currentConcept.description) {
      alert('Por favor completa el nombre y descripción del concepto.');
      return;
    }

    const conceptToSave: DairyConcept = {
      ...currentConcept as DairyConcept,
      id: currentConcept.id || `concept_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: currentConcept.createdAt || new Date()
    };

    let updatedConcepts: DairyConcept[];
    if (editingConcept) {
      updatedConcepts = concepts.map(c => c.id === editingConcept.id ? conceptToSave : c);
    } else {
      updatedConcepts = [...concepts, conceptToSave];
    }

    onSaveConcepts(updatedConcepts);
    setIsCreating(false);
    setCurrentConcept({});
    onEditConcept(null);
  };

  const handleDeleteConcept = (conceptId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este concepto?')) {
      const updatedConcepts = concepts.filter(c => c.id !== conceptId);
      onSaveConcepts(updatedConcepts);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setCurrentConcept({});
    onEditConcept(null);
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setCurrentConcept(prev => ({
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setCurrentConcept(prev => ({
      ...prev,
      benefits: prev.benefits?.filter((_, i) => i !== index) || []
    }));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setCurrentConcept(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setCurrentConcept(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || []
    }));
  };

  const addNutritionalClaim = (claim: string) => {
    const currentClaims = currentConcept.nutritionalClaims || [];
    if (!currentClaims.includes(claim)) {
      setCurrentConcept(prev => ({
        ...prev,
        nutritionalClaims: [...currentClaims, claim]
      }));
    }
  };

  const removeNutritionalClaim = (claim: string) => {
    setCurrentConcept(prev => ({
      ...prev,
      nutritionalClaims: prev.nutritionalClaims?.filter(c => c !== claim) || []
    }));
  };

  // Efecto para cargar concepto en edición
  React.useEffect(() => {
    if (editingConcept) {
      setCurrentConcept(editingConcept);
      setIsCreating(true);
    }
  }, [editingConcept]);

  if (isCreating || editingConcept) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editingConcept ? 'Editar Concepto Lácteo' : 'Crear Nuevo Concepto Lácteo'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
            <div className="space-y-6">
              {/* Información básica */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">📝 Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Concepto *
                    </label>
                    <input
                      type="text"
                      value={currentConcept.name || ''}
                      onChange={(e) => setCurrentConcept(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: Leche Alquería Proteína Plus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={currentConcept.category || 'leche'}
                      onChange={(e) => setCurrentConcept(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {dairyCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} - {cat.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca Alquería
                    </label>
                    <select
                      value={currentConcept.brand || 'alqueria'}
                      onChange={(e) => setCurrentConcept(prev => ({ ...prev, brand: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {alqueriaBrands.map((brand) => (
                        <option key={brand.value} value={brand.value}>
                          {brand.label} - {brand.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Estimado (COP)
                    </label>
                    <input
                      type="number"
                      value={currentConcept.price || ''}
                      onChange={(e) => setCurrentConcept(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: 3500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del Concepto *
                  </label>
                  <textarea
                    value={currentConcept.description || ''}
                    onChange={(e) => setCurrentConcept(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Describe el concepto lácteo: qué es, para qué sirve, cómo se diferencia..."
                  />
                </div>
              </div>

              {/* Beneficios */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">✨ Beneficios del Producto</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ej: Fortalece los huesos"
                    onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                  />
                  <button
                    onClick={addBenefit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentConcept.benefits || []).map((benefit, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {benefit}
                      <button
                        onClick={() => removeBenefit(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Ingredientes */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">🧪 Ingredientes Clave</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ej: Proteína de suero"
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                  />
                  <button
                    onClick={addIngredient}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentConcept.ingredients || []).map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(index)}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Claims nutricionales */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">🏷️ Claims Nutricionales</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {nutritionalClaims.map((claim) => (
                    <button
                      key={claim}
                      onClick={() => addNutritionalClaim(claim)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 text-left"
                    >
                      {claim}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentConcept.nutritionalClaims || []).map((claim, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {claim}
                      <button
                        onClick={() => removeNutritionalClaim(claim)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Público Objetivo
                  </label>
                  <textarea
                    value={currentConcept.targetAudience || ''}
                    onChange={(e) => setCurrentConcept(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Ej: Familias con niños, deportistas, adultos mayores..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diferenciación
                  </label>
                  <textarea
                    value={currentConcept.differentiation || ''}
                    onChange={(e) => setCurrentConcept(prev => ({ ...prev, differentiation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="¿Qué hace único a este producto vs. la competencia?"
                  />
                </div>
              </div>

              {/* Especificaciones técnicas */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Distribución
                    </label>
                    <select
                      value={currentConcept.distribution || 'frio'}
                      onChange={(e) => setCurrentConcept(prev => ({ ...prev, distribution: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {distributionTypes.map((dist) => (
                        <option key={dist.value} value={dist.value}>
                          {dist.label} - {dist.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vida Útil (días)
                    </label>
                    <input
                      type="number"
                      value={currentConcept.shelfLife || ''}
                      onChange={(e) => setCurrentConcept(prev => ({ ...prev, shelfLife: parseInt(e.target.value) || 7 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: 15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Empaque
                    </label>
                    <input
                      type="text"
                      value={currentConcept.packaging || ''}
                      onChange={(e) => setCurrentConcept(prev => ({ ...prev, packaging: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: Botella PET 1L"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
            <button
              onClick={handleSaveConcept}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{editingConcept ? 'Guardar Cambios' : 'Crear Concepto'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">📋 Gestión de Conceptos Lácteos</h2>
        <button
          onClick={handleCreateConcept}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Concepto</span>
        </button>
      </div>

      {concepts.length === 0 ? (
        <div className="text-center py-12">
          <Clipboard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay conceptos creados</h3>
          <p className="text-gray-500 mb-6">
            Crea conceptos lácteos innovadores para evaluar con consumidores sintéticos
          </p>
          <button
            onClick={handleCreateConcept}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Crear Primer Concepto</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept) => {
            const categoryInfo = dairyCategories.find(cat => cat.value === concept.category);
            const brandInfo = alqueriaBrands.find(brand => brand.value === concept.brand);

            return (
              <div key={concept.id} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 hover:from-green-100 hover:to-blue-100 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditConcept(concept)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteConcept(concept.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{concept.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{concept.description}</p>

                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex items-center space-x-2">
                    <span>{categoryInfo?.label?.split(' ')[0] || '📦'}</span>
                    <span>{categoryInfo?.label || concept.category}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span>🏷️</span>
                    <span>{brandInfo?.label || concept.brand}</span>
                  </p>
                  {concept.price && (
                    <p className="flex items-center space-x-2">
                      <span>💰</span>
                      <span>{concept.price.toLocaleString()} COP</span>
                    </p>
                  )}
                  <p className="flex items-center space-x-2">
                    <span>✨</span>
                    <span>{concept.benefits.length} beneficios</span>
                  </p>
                  {concept.nutritionalClaims && concept.nutritionalClaims.length > 0 && (
                    <p className="flex items-center space-x-2">
                      <span>🏷️</span>
                      <span>{concept.nutritionalClaims.slice(0, 2).join(', ')}</span>
                      {concept.nutritionalClaims.length > 2 && <span>+{concept.nutritionalClaims.length - 2}</span>}
                    </p>
                  )}
                  <p className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>Creado: {new Date(concept.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConceptEditor;