// components/PersonaEditor/PersonaEditor.tsx - Editor de características de personas sintéticas

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Edit3, User, MapPin, DollarSign, Heart, Briefcase, Home } from 'lucide-react';
import { UnileverArchetype, BASIC_UNILEVER_PERSONAS } from '../../types/unileverPersona.types';
import type { ColombianPersona } from '../../data/colombiaPersonaSystem';

interface PersonaEditorProps {
  onBack: () => void;
}

interface EditablePersonaData {
  name: string;
  age: number;
  city: string;
  department: string;
  occupation: string;
  monthly_income: number;
  nse_level: string;
  personality_traits: string[];
  brand_preferences: {
    dove_usage: string;
    fruco_usage: string;
    omo_usage: string;
    favorite_brands: string[];
  };
  communication_style: {
    formality_level: string;
    regional_expressions: string[];
    typical_phrases: string[];
  };
  lifestyle: {
    shopping_frequency: string;
    decision_factors: string[];
    concerns: string[];
  };
  family_situation: {
    marital_status: string;
    has_children: boolean;
    household_size: number;
  };
}

export const PersonaEditor: React.FC<PersonaEditorProps> = ({ onBack }) => {
  const [selectedArchetype, setSelectedArchetype] = useState<UnileverArchetype | null>(null);
  const [editedData, setEditedData] = useState<EditablePersonaData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initializePersonaData = (archetype: UnileverArchetype): EditablePersonaData => {
    const persona = BASIC_UNILEVER_PERSONAS[archetype];
    
    // Datos por defecto basados en el arquetipo
    const defaultData: Record<UnileverArchetype, Partial<EditablePersonaData>> = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: {
        name: 'María José Martínez',
        age: 32,
        city: 'Barranquilla',
        department: 'Atlántico',
        occupation: 'Dueña de tienda de belleza',
        monthly_income: 2800000,
        nse_level: 'B/C+',
        personality_traits: ['Emprendedora', 'Sociable', 'Optimista', 'Práctica'],
        regional_expressions: ['¡Ay, qué belleza!', 'Mi amor', 'Eso está buenísimo', '¡Qué bacano!'],
        typical_phrases: ['Para mi negocio necesito...', 'Mis clientas siempre preguntan...', 'En la costa sabemos de...']
      },
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: {
        name: 'Catalina Herrera',
        age: 29,
        city: 'Bogotá',
        department: 'Cundinamarca', 
        occupation: 'Ingeniera de Sistemas',
        monthly_income: 4500000,
        nse_level: 'A/B+',
        personality_traits: ['Organizada', 'Ambiciosa', 'Eficiente', 'Analítica'],
        regional_expressions: ['Súper bacano', 'Me parece excelente', 'Qué chévere', 'Está genial'],
        typical_phrases: ['Para mi rutina profesional...', 'Necesito algo eficiente...', 'La calidad es fundamental...']
      },
      [UnileverArchetype.PAISA_TRADICIONAL]: {
        name: 'Luz Elena Restrepo',
        age: 45,
        city: 'Medellín', 
        department: 'Antioquia',
        occupation: 'Ama de casa',
        monthly_income: 3200000,
        nse_level: 'B/C+',
        personality_traits: ['Tradicional', 'Familiar', 'Leal', 'Cuidadosa'],
        regional_expressions: ['¡Ave María!', 'Mi niña', 'Eso sí está bueno', '¡Ay no!'],
        typical_phrases: ['Para mi familia...', 'De toda la vida uso...', 'Mi mamá me enseñó...']
      },
      [UnileverArchetype.MADRE_MODERNA]: {
        name: 'Andrea Jiménez',
        age: 35,
        city: 'Bogotá',
        department: 'Cundinamarca',
        occupation: 'Gerente de Mercadeo',
        monthly_income: 5200000,
        nse_level: 'B+',
        personality_traits: ['Cuidadosa', 'Responsable', 'Innovadora', 'Protectora'],
        regional_expressions: ['Súper importante', 'Me encanta', 'Para mi familia', 'Qué maravilloso'],
        typical_phrases: ['Para mis hijos...', 'La seguridad es primero...', 'Busco productos confiables...']
      }
    };

    const archetypeDefaults = defaultData[archetype] || {};

    return {
      name: archetypeDefaults.name || persona.name,
      age: archetypeDefaults.age || persona.demographics?.age || 30,
      city: archetypeDefaults.city || persona.location?.city || 'Bogotá',
      department: archetypeDefaults.department || 'Cundinamarca',
      occupation: archetypeDefaults.occupation || 'Profesional',
      monthly_income: archetypeDefaults.monthly_income || 3000000,
      nse_level: archetypeDefaults.nse_level || 'B/C+',
      personality_traits: archetypeDefaults.personality_traits || ['Amable', 'Práctica'],
      brand_preferences: {
        dove_usage: 'Usuario frecuente',
        fruco_usage: 'Usuario ocasional',
        omo_usage: 'Usuario frecuente',
        favorite_brands: ['Dove', 'Fruco', 'OMO']
      },
      communication_style: {
        formality_level: 'Informal',
        regional_expressions: archetypeDefaults.regional_expressions || ['Qué bueno', 'Me parece excelente'],
        typical_phrases: archetypeDefaults.typical_phrases || ['Me gusta mucho...', 'Prefiero productos...']
      },
      lifestyle: {
        shopping_frequency: 'Semanal',
        decision_factors: ['Calidad', 'Precio', 'Confianza en la marca'],
        concerns: ['Precio alto', 'Calidad inconsistente']
      },
      family_situation: {
        marital_status: 'Casada',
        has_children: true,
        household_size: 4
      }
    };
  };

  const handleArchetypeSelect = (archetype: UnileverArchetype) => {
    setSelectedArchetype(archetype);
    const data = initializePersonaData(archetype);
    setEditedData(data);
    setHasChanges(false);
  };

  const handleDataChange = (field: string, value: any) => {
    if (!editedData) return;
    
    const keys = field.split('.');
    const newData = { ...editedData };
    
    if (keys.length === 1) {
      (newData as any)[keys[0]] = value;
    } else if (keys.length === 2) {
      (newData as any)[keys[0]] = {
        ...(newData as any)[keys[0]],
        [keys[1]]: value
      };
    }
    
    setEditedData(newData);
    setHasChanges(true);
  };

  const handleArrayChange = (field: string, values: string[]) => {
    handleDataChange(field, values);
  };

  const handleSave = async () => {
    if (!selectedArchetype || !editedData) return;
    
    setIsSaving(true);
    
    // Simular guardado (en producción, esto iría a un backend)
    try {
      // Guardar en localStorage para persistencia local
      const savedPersonas = JSON.parse(localStorage.getItem('edited_personas') || '{}');
      savedPersonas[selectedArchetype] = editedData;
      localStorage.setItem('edited_personas', JSON.stringify(savedPersonas));
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Características guardadas correctamente');
      setHasChanges(false);
    } catch (error) {
      alert('Error al guardar. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cargar datos editados si existen
  useEffect(() => {
    if (selectedArchetype) {
      const savedPersonas = JSON.parse(localStorage.getItem('edited_personas') || '{}');
      if (savedPersonas[selectedArchetype]) {
        setEditedData(savedPersonas[selectedArchetype]);
        setHasChanges(false);
      }
    }
  }, [selectedArchetype]);

  const ArrayInput: React.FC<{ 
    label: string; 
    values: string[]; 
    onChange: (values: string[]) => void;
    placeholder?: string;
  }> = ({ label, values, onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const addItem = () => {
      if (inputValue.trim() && !values.includes(inputValue.trim())) {
        onChange([...values, inputValue.trim()]);
        setInputValue('');
      }
    };

    const removeItem = (index: number) => {
      onChange(values.filter((_, i) => i !== index));
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={addItem}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Agregar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {values.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {item}
                <button
                  onClick={() => removeItem(index)}
                  className="text-gray-400 hover:text-gray-600 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editor de Personas Sintéticas</h1>
            <p className="text-gray-600">Personaliza las características de cada arquetipo colombiano</p>
          </div>
        </div>
        
        {hasChanges && editedData && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar Cambios
          </button>
        )}
      </div>

      {!selectedArchetype ? (
        /* Archetype Selection */
        <div>
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Selecciona un Arquetipo para Editar
            </h2>
            <p className="text-gray-600">
              Personaliza las características específicas de cada persona sintética
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(BASIC_UNILEVER_PERSONAS).map(([archetype, persona]) => (
              <div
                key={archetype}
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer p-6"
                onClick={() => handleArchetypeSelect(archetype as UnileverArchetype)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Edit3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
                    <p className="text-sm text-gray-600">{archetype.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500 mt-1">{persona.location?.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Editor Interface */
        editedData && (
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Información Básica
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => handleDataChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                  <input
                    type="number"
                    value={editedData.age}
                    onChange={(e) => handleDataChange('age', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={editedData.city}
                    onChange={(e) => handleDataChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <input
                    type="text"
                    value={editedData.department}
                    onChange={(e) => handleDataChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Socioeconomic */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Perfil Socioeconómico
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
                  <input
                    type="text"
                    value={editedData.occupation}
                    onChange={(e) => handleDataChange('occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ingreso Mensual (COP)</label>
                  <input
                    type="number"
                    value={editedData.monthly_income}
                    onChange={(e) => handleDataChange('monthly_income', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NSE</label>
                  <select
                    value={editedData.nse_level}
                    onChange={(e) => handleDataChange('nse_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B/C+">B/C+</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Personality & Communication */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Personalidad
                </h2>
                <ArrayInput
                  label="Rasgos de Personalidad"
                  values={editedData.personality_traits}
                  onChange={(values) => handleArrayChange('personality_traits', values)}
                  placeholder="Ej: Amable, Práctica, Sociable"
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Comunicación</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Formalidad</label>
                    <select
                      value={editedData.communication_style.formality_level}
                      onChange={(e) => handleDataChange('communication_style.formality_level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Muy formal">Muy formal</option>
                      <option value="Formal">Formal</option>
                      <option value="Informal">Informal</option>
                      <option value="Muy informal">Muy informal</option>
                    </select>
                  </div>
                  <ArrayInput
                    label="Expresiones Regionales"
                    values={editedData.communication_style.regional_expressions}
                    onChange={(values) => handleArrayChange('communication_style.regional_expressions', values)}
                    placeholder="Ej: ¡Qué bacano!, ¡Ave María!"
                  />
                </div>
              </div>
            </div>

            {/* Brand Preferences */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Preferencias de Marca</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uso de Dove</label>
                  <select
                    value={editedData.brand_preferences.dove_usage}
                    onChange={(e) => handleDataChange('brand_preferences.dove_usage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Usuario frecuente">Usuario frecuente</option>
                    <option value="Usuario ocasional">Usuario ocasional</option>
                    <option value="No usuario">No usuario</option>
                    <option value="Ex usuario">Ex usuario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uso de Fruco</label>
                  <select
                    value={editedData.brand_preferences.fruco_usage}
                    onChange={(e) => handleDataChange('brand_preferences.fruco_usage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Usuario frecuente">Usuario frecuente</option>
                    <option value="Usuario ocasional">Usuario ocasional</option>
                    <option value="No usuario">No usuario</option>
                    <option value="Ex usuario">Ex usuario</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uso de OMO</label>
                  <select
                    value={editedData.brand_preferences.omo_usage}
                    onChange={(e) => handleDataChange('brand_preferences.omo_usage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Usuario frecuente">Usuario frecuente</option>
                    <option value="Usuario ocasional">Usuario ocasional</option>
                    <option value="No usuario">No usuario</option>
                    <option value="Ex usuario">Ex usuario</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-purple-600" />
                Estilo de Vida
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de Compras</label>
                  <select
                    value={editedData.lifestyle.shopping_frequency}
                    onChange={(e) => handleDataChange('lifestyle.shopping_frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Diaria">Diaria</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Quincenal">Quincenal</option>
                    <option value="Mensual">Mensual</option>
                  </select>
                </div>
                <ArrayInput
                  label="Factores de Decisión"
                  values={editedData.lifestyle.decision_factors}
                  onChange={(values) => handleArrayChange('lifestyle.decision_factors', values)}
                  placeholder="Ej: Calidad, Precio, Confianza"
                />
                <ArrayInput
                  label="Preocupaciones"
                  values={editedData.lifestyle.concerns}
                  onChange={(values) => handleArrayChange('lifestyle.concerns', values)}
                  placeholder="Ej: Precio alto, Calidad inconsistente"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedArchetype(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Volver a Arquetipos
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};