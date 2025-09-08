// components/Campaign/UnileverConceptForm.tsx - Formulario específico para conceptos de Unilever

import React, { useState } from 'react';
import { 
  Plus, Minus, Save, Lightbulb, DollarSign, 
  Megaphone, Settings, Package, Heart, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { CampaignConcept } from '../../types/campaign.types';

interface UnileverConceptFormProps {
  onSave: (concept: CampaignConcept) => void;
  onCancel: () => void;
  initialConcept?: Partial<CampaignConcept>;
}

// Templates específicos de Unilever
const UNILEVER_CONCEPT_TEMPLATES = {
  product_concept: {
    name: 'Dove Body Wash Tropical',
    description: 'Nueva línea de jabón líquido corporal con fragancias tropicales adaptadas al clima colombiano',
    benefits: [
      'Hidratación profunda para clima tropical',
      'Fragancias frescas de frutas colombianas',
      'Fórmula resistente a la humedad'
    ],
    differentiation: 'Primera línea de Dove específicamente formulada para el clima tropical colombiano',
    target_audience: 'Mujeres colombianas de 25-40 años, NSE B/C+, que buscan frescura y hidratación',
    call_to_action: 'Descubre la frescura tropical de Dove',
    category: 'Personal Care',
    brand: 'Dove',
    price_range: '$15,000 - $25,000 COP'
  },
  campaign: {
    name: 'Fruco Tradición Familiar',
    description: 'Campaña que celebra las tradiciones culinarias familiares colombianas con Fruco',
    benefits: [
      'Conecta con la nostalgia familiar',
      'Refuerza el liderazgo en sabor',
      'Celebra la cocina tradicional colombiana'
    ],
    differentiation: 'Única marca que entiende y celebra la cocina tradicional de cada región',
    target_audience: 'Madres y amas de casa colombianas que cocinan para la familia',
    call_to_action: 'Fruco, el sabor de la tradición familiar',
    category: 'Foods',
    brand: 'Fruco',
    price_range: 'N/A - Campaign'
  }
};

const UNILEVER_CATEGORIES = [
  { id: 'personal_care', name: 'Personal Care', brands: ['Dove', 'Suave', 'Rexona', 'Clear'], icon: Heart },
  { id: 'home_care', name: 'Home Care', brands: ['OMO', 'Cif'], icon: Package },
  { id: 'foods', name: 'Foods', brands: ['Fruco', 'Knorr'], icon: Sparkles }
];

const REGIONAL_CONTEXTS = [
  { id: 'nacional', name: 'Nacional (Todas las regiones)', description: 'Aplicable en toda Colombia' },
  { id: 'costa_atlantica', name: 'Costa Atlántica', description: 'Barranquilla, Cartagena, Santa Marta' },
  { id: 'region_andina', name: 'Región Andina', description: 'Bogotá, Cundinamarca' },
  { id: 'antioquia', name: 'Antioquia', description: 'Medellín, Valle de Aburrá' },
  { id: 'valle_del_cauca', name: 'Valle del Cauca', description: 'Cali, Valle' },
  { id: 'llanos_orientales', name: 'Llanos Orientales', description: 'Villavicencio, Meta' }
];

const UnileverConceptForm: React.FC<UnileverConceptFormProps> = ({ 
  onSave, 
  onCancel, 
  initialConcept 
}) => {
  const [concept, setConcept] = useState<Partial<CampaignConcept>>({
    type: 'product_concept',
    name: '',
    description: '',
    benefits: ['', '', ''],
    differentiation: '',
    target_audience: '',
    channel: 'digital',
    tone: 'informal',
    call_to_action: '',
    visual_elements: [],
    technical_specs: {
      unilever_category: '',
      unilever_brand: '',
      regional_focus: 'nacional',
      price_range: '',
      launch_timeline: ''
    },
    ...initialConcept
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!concept.name?.trim()) {
      newErrors.name = 'El nombre del concepto es requerido';
    }

    if (!concept.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!concept.benefits?.some(b => b.trim())) {
      newErrors.benefits = 'Al menos un beneficio clave es requerido';
    }

    if (!concept.differentiation?.trim()) {
      newErrors.differentiation = 'La diferenciación vs competencia es requerida';
    }

    if (!concept.target_audience?.trim()) {
      newErrors.target_audience = 'El público objetivo es requerido';
    }

    if (!concept.call_to_action?.trim()) {
      newErrors.call_to_action = 'El mensaje principal es requerido';
    }

    if (!concept.technical_specs?.unilever_category) {
      newErrors.category = 'La categoría de Unilever es requerida';
    }

    if (!concept.technical_specs?.unilever_brand) {
      newErrors.brand = 'La marca de Unilever es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const finalConcept: CampaignConcept = {
      id: `unilever-concept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: concept.type || 'product_concept',
      name: concept.name!,
      description: concept.description!,
      benefits: concept.benefits?.filter(b => b.trim()) || [],
      differentiation: concept.differentiation!,
      target_audience: concept.target_audience!,
      channel: concept.channel || 'digital',
      tone: concept.tone || 'informal',
      call_to_action: concept.call_to_action!,
      visual_elements: concept.visual_elements || [],
      technical_specs: {
        ...concept.technical_specs,
        company: 'Unilever',
        market: 'Colombia'
      },
      created_at: new Date(),
      updated_at: new Date()
    };

    onSave(finalConcept);
  };

  const loadTemplate = (type: 'product_concept' | 'campaign') => {
    const template = UNILEVER_CONCEPT_TEMPLATES[type];
    setConcept(prev => ({
      ...prev,
      type,
      ...template,
      technical_specs: {
        ...prev.technical_specs,
        unilever_category: type === 'product_concept' ? 'personal_care' : 'foods',
        unilever_brand: template.brand,
        price_range: template.price_range
      }
    }));
    setSelectedCategory(type === 'product_concept' ? 'personal_care' : 'foods');
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...(concept.benefits || ['', '', ''])];
    newBenefits[index] = value;
    setConcept(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setConcept(prev => ({ 
      ...prev, 
      benefits: [...(prev.benefits || []), ''] 
    }));
  };

  const removeBenefit = (index: number) => {
    setConcept(prev => ({ 
      ...prev, 
      benefits: prev.benefits?.filter((_, i) => i !== index) || []
    }));
  };

  const getSelectedCategoryBrands = () => {
    const category = UNILEVER_CATEGORIES.find(c => c.id === selectedCategory);
    return category?.brands || [];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Nuevo Concepto de Unilever
        </h2>
        <p className="text-gray-600">
          Crea un concepto de producto o campaña para evaluar con consumidoras colombianas
        </p>
      </div>

      {/* Templates */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Templates de Ejemplo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => loadTemplate('product_concept')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Concepto de Producto</span>
            </div>
            <p className="text-sm text-gray-600">
              Nuevo producto Dove Body Wash Tropical
            </p>
          </button>

          <button
            onClick={() => loadTemplate('campaign')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Campaña de Comunicación</span>
            </div>
            <p className="text-sm text-gray-600">
              Campaña Fruco Tradición Familiar
            </p>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Tipo y Información Básica */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
          
          {/* Tipo de concepto */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de concepto
            </label>
            <select
              value={concept.type}
              onChange={(e) => setConcept(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="product_concept">Concepto de Producto</option>
              <option value="campaign">Campaña de Comunicación</option>
            </select>
          </div>

          {/* Nombre */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del concepto *
            </label>
            <input
              type="text"
              value={concept.name}
              onChange={(e) => setConcept(prev => ({ ...prev, name: e.target.value }))}
              placeholder="ej. Dove Body Wash Tropical"
              className={cn(
                "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.name ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción detallada *
            </label>
            <textarea
              value={concept.description}
              onChange={(e) => setConcept(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Describe el concepto, características principales, propósito..."
              className={cn(
                "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.description ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>

        {/* Categoría y Marca Unilever */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contexto Unilever</h3>
          
          {/* Categoría */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría de Unilever *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {UNILEVER_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setConcept(prev => ({
                      ...prev,
                      technical_specs: {
                        ...prev.technical_specs,
                        unilever_category: category.id,
                        unilever_brand: '' // Reset brand when category changes
                      }
                    }));
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg transition-colors text-left",
                    selectedCategory === category.id
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                  )}
                >
                  <category.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs opacity-75">
                      {category.brands.slice(0, 2).join(', ')}
                      {category.brands.length > 2 && '...'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Marca */}
          {selectedCategory && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca de Unilever *
              </label>
              <select
                value={concept.technical_specs?.unilever_brand || ''}
                onChange={(e) => setConcept(prev => ({
                  ...prev,
                  technical_specs: {
                    ...prev.technical_specs,
                    unilever_brand: e.target.value
                  }
                }))}
                className={cn(
                  "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.brand ? "border-red-300" : "border-gray-300"
                )}
              >
                <option value="">Selecciona una marca</option>
                {getSelectedCategoryBrands().map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
            </div>
          )}

          {/* Contexto Regional */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enfoque Regional
            </label>
            <select
              value={concept.technical_specs?.regional_focus || 'nacional'}
              onChange={(e) => setConcept(prev => ({
                ...prev,
                technical_specs: {
                  ...prev.technical_specs,
                  regional_focus: e.target.value
                }
              }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {REGIONAL_CONTEXTS.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name} - {region.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Beneficios y Diferenciación */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Propuesta de Valor</h3>
          
          {/* Beneficios */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficios clave *
            </label>
            <div className="space-y-3">
              {concept.benefits?.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder={`Beneficio ${index + 1}`}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {concept.benefits && concept.benefits.length > 1 && (
                    <button
                      onClick={() => removeBenefit(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )) || []}
              
              <button
                onClick={addBenefit}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Agregar beneficio
              </button>
            </div>
            {errors.benefits && <p className="mt-1 text-sm text-red-600">{errors.benefits}</p>}
          </div>

          {/* Diferenciación */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diferenciación vs competencia *
            </label>
            <textarea
              value={concept.differentiation}
              onChange={(e) => setConcept(prev => ({ ...prev, differentiation: e.target.value }))}
              rows={3}
              placeholder="¿Qué hace único a este concepto vs la competencia?"
              className={cn(
                "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.differentiation ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.differentiation && <p className="mt-1 text-sm text-red-600">{errors.differentiation}</p>}
          </div>
        </div>

        {/* Target y Comunicación */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Target y Comunicación</h3>
          
          {/* Target Audience */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Público objetivo *
            </label>
            <textarea
              value={concept.target_audience}
              onChange={(e) => setConcept(prev => ({ ...prev, target_audience: e.target.value }))}
              rows={3}
              placeholder="ej. Mujeres colombianas de 25-40 años, NSE B/C+, madres trabajadoras que buscan productos prácticos y confiables..."
              className={cn(
                "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.target_audience ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.target_audience && <p className="mt-1 text-sm text-red-600">{errors.target_audience}</p>}
          </div>

          {/* Call to Action */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje principal / Call to Action *
            </label>
            <input
              type="text"
              value={concept.call_to_action}
              onChange={(e) => setConcept(prev => ({ ...prev, call_to_action: e.target.value }))}
              placeholder="ej. Descubre la frescura tropical de Dove"
              className={cn(
                "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.call_to_action ? "border-red-300" : "border-gray-300"
              )}
            />
            {errors.call_to_action && <p className="mt-1 text-sm text-red-600">{errors.call_to_action}</p>}
          </div>

          {/* Tono */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tono de comunicación
            </label>
            <select
              value={concept.tone}
              onChange={(e) => setConcept(prev => ({ ...prev, tone: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="formal">Formal y profesional</option>
              <option value="informal">Cercano y amigable</option>
              <option value="emotional">Emocional y aspiracional</option>
              <option value="playful">Divertido y juguetón</option>
            </select>
          </div>
        </div>

        {/* Información Adicional */}
        {concept.type === 'product_concept' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Producto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de precio
                </label>
                <input
                  type="text"
                  value={concept.technical_specs?.price_range || ''}
                  onChange={(e) => setConcept(prev => ({
                    ...prev,
                    technical_specs: {
                      ...prev.technical_specs,
                      price_range: e.target.value
                    }
                  }))}
                  placeholder="ej. $15,000 - $25,000 COP"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline de lanzamiento
                </label>
                <select
                  value={concept.technical_specs?.launch_timeline || ''}
                  onChange={(e) => setConcept(prev => ({
                    ...prev,
                    technical_specs: {
                      ...prev.technical_specs,
                      launch_timeline: e.target.value
                    }
                  }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar timeline</option>
                  <option value="q1_2024">Q1 2024</option>
                  <option value="q2_2024">Q2 2024</option>
                  <option value="q3_2024">Q3 2024</option>
                  <option value="q4_2024">Q4 2024</option>
                  <option value="q1_2025">Q1 2025</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
          >
            <Save className="h-4 w-4" />
            Guardar y continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnileverConceptForm;