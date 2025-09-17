// PersonaViews/PersonaEditView.tsx - Vista de edición de personas sintéticas

import React, { useState } from 'react';
import { Save, X, User, AlertCircle } from 'lucide-react';
import type { SelectedPersona } from '../hooks/usePersonaNavigation';

interface PersonaEditViewProps {
  persona: SelectedPersona;
  onSave: (updatedPersona: any) => void;
  onCancel: () => void;
}

const PersonaEditView: React.FC<PersonaEditViewProps> = ({
  persona,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: persona.data.name || '',
    age: persona.data.age || '',
    city: persona.data.city || '',
    occupation: persona.data.occupation || '',
    nse: persona.data.nse || '',
    // Campos adicionales según la fuente
    ...(persona.source === 'savital' && {
      mainConcern: persona.data.behavior?.product_usage?.pain_points?.[0] || '',
      savitalUsage: persona.data.unilever_brands?.savital?.usage || 'nunca'
    })
  });

  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // Aquí iría la lógica de guardado real
    console.log('Guardando cambios:', formData);
    onSave({ ...persona.data, ...formData });
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('¿Estás seguro de cancelar? Se perderán los cambios no guardados.')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Editar Persona: {persona.data.name}
              </h1>
              <p className="text-gray-600">
                {persona.source === 'savital' ? 'Usuaria Savital' : 'Arquetipo Unilever'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDirty
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="h-4 w-4" />
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Alerta de función en desarrollo */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Función en Desarrollo</h3>
                <p className="text-sm text-amber-700 mt-1">
                  El editor de personas sintéticas está actualmente en desarrollo. 
                  Los cambios realizados aquí no se guardarán permanentemente.
                </p>
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Información Básica
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Seleccionar ciudad</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Barranquilla">Barranquilla</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Cali">Cali</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NSE
                </label>
                <select
                  value={formData.nse}
                  onChange={(e) => handleInputChange('nse', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Seleccionar NSE</option>
                  <option value="A">A</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ocupación
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Campos específicos para usuarias Savital */}
          {persona.source === 'savital' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información Específica Savital
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relación con Savital
                  </label>
                  <select
                    value={formData.savitalUsage}
                    onChange={(e) => handleInputChange('savitalUsage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="nunca">Nunca usó</option>
                    <option value="probó">Probó una vez</option>
                    <option value="ocasional">Uso ocasional</option>
                    <option value="regular">Usuario regular</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Principal Preocupación Capilar
                  </label>
                  <input
                    type="text"
                    value={formData.mainConcern}
                    onChange={(e) => handleInputChange('mainConcern', e.target.value)}
                    placeholder="ej: Cabello graso, caspa, caída..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview de cambios */}
          {isDirty && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Vista Previa de Cambios</h3>
              <div className="text-sm text-blue-700">
                <p><strong>{formData.name}</strong> • {formData.age} años • {formData.city}</p>
                <p>{formData.occupation} • NSE {formData.nse}</p>
                {persona.source === 'savital' && formData.mainConcern && (
                  <p>Preocupación: {formData.mainConcern}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaEditView;