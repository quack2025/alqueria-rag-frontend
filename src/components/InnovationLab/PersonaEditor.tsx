// components/InnovationLab/PersonaEditor.tsx - Editor de personas para industria láctea de Alquería
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, User, Users, ChevronDown, ChevronRight } from 'lucide-react';
import type { DairyPersona } from '../../types/dairy.types';

interface PersonaEditorProps {
  personas: DairyPersona[];
  onSavePersonas: (personas: DairyPersona[]) => void;
  editingPersona: DairyPersona | null;
  onEditPersona: (persona: DairyPersona | null) => void;
}

// 80+ Variables específicas para la industria láctea colombiana
const dairyPersonaVariables = {
  // 1. Demografía Básica (7 variables)
  demografiaBasica: {
    title: "Demografía Básica",
    icon: "👤",
    variables: {
      edad: { type: "number", label: "Edad", min: 18, max: 75, default: 35 },
      genero: { type: "select", label: "Género", options: ["Femenino", "Masculino", "Otro"], default: "Femenino" },
      estadoCivil: { type: "select", label: "Estado Civil", options: ["Soltero/a", "Casado/a", "Unión Libre", "Separado/a", "Viudo/a"], default: "Casado/a" },
      numeroHijos: { type: "number", label: "Número de Hijos", min: 0, max: 10, default: 2 },
      nivelEducacion: { type: "select", label: "Nivel de Educación", options: ["Primaria", "Bachillerato", "Técnico", "Universitario", "Postgrado"], default: "Universitario" },
      ocupacion: { type: "text", label: "Ocupación", default: "Profesional independiente" },
      ingresoMensual: { type: "number", label: "Ingreso Mensual (COP)", min: 500000, max: 20000000, default: 2500000 }
    }
  },

  // 2. Ubicación y Geografía (6 variables)
  ubicacionGeografia: {
    title: "Ubicación y Geografía",
    icon: "📍",
    variables: {
      ciudad: { type: "text", label: "Ciudad", default: "Bogotá" },
      departamento: { type: "select", label: "Departamento", options: ["Cundinamarca", "Antioquia", "Valle del Cauca", "Santander", "Atlántico", "Bolívar", "Otros"], default: "Cundinamarca" },
      region: { type: "select", label: "Región Colombiana", options: ["Costa Caribe", "Andina", "Pacífica", "Orinoquía", "Amazonía"], default: "Andina" },
      estrato: { type: "number", label: "Estrato Socioeconómico", min: 1, max: 6, default: 3 },
      tipoVivienda: { type: "select", label: "Tipo de Vivienda", options: ["Casa propia", "Apartamento propio", "Casa arrendada", "Apartamento arrendado", "Casa familiar"], default: "Apartamento propio" },
      clima: { type: "select", label: "Clima Local", options: ["Cálido", "Templado", "Frío", "Húmedo", "Seco"], default: "Templado" }
    }
  },

  // 3. Psicografía y Personalidad (8 variables)
  psicografiaPersonalidad: {
    title: "Psicografía y Personalidad",
    icon: "🧠",
    variables: {
      extroversion: { type: "range", label: "Extroversión", min: 1, max: 10, default: 6 },
      aperturaCambio: { type: "range", label: "Apertura al Cambio", min: 1, max: 10, default: 7 },
      responsabilidad: { type: "range", label: "Responsabilidad", min: 1, max: 10, default: 8 },
      amabilidad: { type: "range", label: "Amabilidad", min: 1, max: 10, default: 8 },
      estabilidadEmocional: { type: "range", label: "Estabilidad Emocional", min: 1, max: 10, default: 7 },
      tradicionalismo: { type: "range", label: "Tradicionalismo", min: 1, max: 10, default: 6 },
      adopcionInnovacion: { type: "range", label: "Adopción de Innovación", min: 1, max: 10, default: 6 },
      orientacionMaterialista: { type: "range", label: "Orientación Materialista", min: 1, max: 10, default: 5 }
    }
  },

  // 4. Comportamiento de Compra de Lácteos (9 variables)
  comportamientoCompraLacteos: {
    title: "Comportamiento de Compra de Lácteos",
    icon: "🛒",
    variables: {
      sensibilidadPrecio: { type: "range", label: "Sensibilidad al Precio", min: 1, max: 10, default: 6 },
      lealtadMarca: { type: "range", label: "Lealtad a la Marca", min: 1, max: 10, default: 7 },
      frecuenciaCompra: { type: "select", label: "Frecuencia de Compra", options: ["Diaria", "Inter-diaria", "Semanal", "Quincenal", "Mensual"], default: "Semanal" },
      canalPrincipal: { type: "select", label: "Canal Principal de Compra", options: ["Supermercado", "Tienda de barrio", "Hipermercado", "Online", "Mayorista"], default: "Supermercado" },
      influenciaPromociones: { type: "range", label: "Influencia de Promociones", min: 1, max: 10, default: 7 },
      compraImpulsiva: { type: "range", label: "Tendencia Compra Impulsiva", min: 1, max: 10, default: 5 },
      presupuestoMensualLacteos: { type: "number", label: "Presupuesto Mensual Lácteos (COP)", min: 50000, max: 500000, default: 150000 },
      importanciaOrigen: { type: "range", label: "Importancia del Origen", min: 1, max: 10, default: 8 },
      preferenciaOrganicos: { type: "range", label: "Preferencia por Orgánicos", min: 1, max: 10, default: 6 }
    }
  },

  // 5. Hábitos Digitales (5 variables)
  habitosDigitales: {
    title: "Hábitos Digitales",
    icon: "📱",
    variables: {
      redesSocialesUso: { type: "multiselect", label: "Redes Sociales que Usa", options: ["Facebook", "Instagram", "TikTok", "Twitter", "YouTube", "WhatsApp"], default: ["Facebook", "Instagram", "WhatsApp"] },
      tiempoRedes: { type: "number", label: "Horas Diarias en Redes", min: 0, max: 12, default: 3 },
      impactoInfluencers: { type: "range", label: "Impacto de Influencers", min: 1, max: 10, default: 5 },
      busquedaInfoOnline: { type: "range", label: "Búsqueda de Información Online", min: 1, max: 10, default: 7 },
      frecuenciaCompraOnline: { type: "select", label: "Frecuencia Compra Online", options: ["Nunca", "Rara vez", "Mensual", "Quincenal", "Semanal", "Siempre"], default: "Mensual" }
    }
  },

  // 6. Consumo de Lácteos y Nutrición (8 variables) - ESPECÍFICO PARA ALQUERÍA
  consumoLacteosNutricion: {
    title: "Consumo de Lácteos y Nutrición",
    icon: "🥛",
    variables: {
      frecuenciaConsumoLeche: { type: "select", label: "Frecuencia Consumo Leche", options: ["Diario", "Inter-diario", "Semanal", "Quincenal", "Mensual", "Nunca"], default: "Diario" },
      tipoLechePreferida: { type: "select", label: "Tipo de Leche Preferida", options: ["Entera", "Deslactosada", "Light/Descremada", "Semidescremada", "Vegetal", "Sin preferencia"], default: "Deslactosada" },
      momentosConsumo: { type: "multiselect", label: "Momentos de Consumo", options: ["Desayuno", "Media mañana", "Almuerzo", "Onces", "Cena", "Noche"], default: ["Desayuno", "Onces"] },
      preocupacionesNutricionales: { type: "multiselect", label: "Preocupaciones Nutricionales", options: ["Lactosa", "Azúcar", "Grasa", "Calcio", "Proteínas", "Conservantes", "Ninguna"], default: ["Lactosa", "Conservantes"] },
      conocimientoNutricional: { type: "range", label: "Conocimiento Nutricional", min: 1, max: 10, default: 7 },
      lecturaEtiquetas: { type: "range", label: "Frecuencia Lectura Etiquetas", min: 1, max: 10, default: 8 },
      importanciaSuplemento: { type: "range", label: "Importancia Suplementos Nutricionales", min: 1, max: 10, default: 6 },
      preferenciaProductosNaturales: { type: "range", label: "Preferencia Productos Naturales", min: 1, max: 10, default: 8 }
    }
  },

  // 7. Consumo Específico por Categoría Láctea (7 variables) - ESPECÍFICO PARA ALQUERÍA
  consumoEspecificoCategoria: {
    title: "Consumo Específico por Categoría",
    icon: "🧀",
    variables: {
      yogurtFrecuencia: { type: "select", label: "Frecuencia Yogurt", options: ["Diario", "Inter-diario", "Semanal", "Quincenal", "Mensual", "Nunca"], default: "Inter-diario" },
      quesoFrecuencia: { type: "select", label: "Frecuencia Queso", options: ["Diario", "Inter-diario", "Semanal", "Quincenal", "Mensual", "Nunca"], default: "Semanal" },
      kumisFrecuencia: { type: "select", label: "Frecuencia Kumis", options: ["Diario", "Inter-diario", "Semanal", "Quincenal", "Mensual", "Nunca"], default: "Quincenal" },
      mantequillaFrecuencia: { type: "select", label: "Frecuencia Mantequilla", options: ["Diario", "Inter-diario", "Semanal", "Quincenal", "Mensual", "Nunca"], default: "Semanal" },
      arequipeFrecuencia: { type: "select", label: "Frecuencia Arequipe", options: ["Diario", "Inter-diario", "Semanal", "Quincenal", "Mensual", "Nunca"], default: "Mensual" },
      cremaFrecuencia: { type: "select", label: "Frecuencia Crema", options: ["Diario", "Inter-diario", "Semanal", "Quincenal", "Mensual", "Nunca"], default: "Semanal" },
      categoriaFavorita: { type: "select", label: "Categoría Láctea Favorita", options: ["Leche", "Yogurt", "Queso", "Kumis", "Mantequilla", "Arequipe", "Crema"], default: "Yogurt" }
    }
  },

  // 8. Relación con Marcas Lácteas (6 variables) - ESPECÍFICO PARA ALQUERÍA
  relacionMarcasLacteas: {
    title: "Relación con Marcas Lácteas",
    icon: "🏷️",
    variables: {
      marcasConfianza: { type: "multiselect", label: "Marcas de Confianza", options: ["Alquería", "Alpina", "Colanta", "Parmalat", "Algarra", "Proleche", "La Campiña", "Otras"], default: ["Alquería", "Alpina"] },
      disposicionCambio: { type: "range", label: "Disposición al Cambio de Marca", min: 1, max: 10, default: 5 },
      factorCambioPrincipal: { type: "select", label: "Factor Principal de Cambio", options: ["Precio", "Calidad", "Sabor", "Disponibilidad", "Promociones", "Recomendación"], default: "Calidad" },
      influenciaFamilia: { type: "range", label: "Influencia de la Familia", min: 1, max: 10, default: 8 },
      influenciaAmigos: { type: "range", label: "Influencia de Amigos", min: 1, max: 10, default: 6 },
      recordacionPublicidad: { type: "range", label: "Recordación de Publicidad", min: 1, max: 10, default: 6 }
    }
  },

  // 9. Comunicación y Lenguaje (4 variables)
  comunicacionLenguaje: {
    title: "Comunicación y Lenguaje",
    icon: "💬",
    variables: {
      nivelFormalidad: { type: "select", label: "Nivel de Formalidad", options: ["Muy informal", "Informal", "Neutral", "Formal", "Muy formal"], default: "Informal" },
      expresionesRegionales: { type: "multiselect", label: "Expresiones Regionales", options: ["¡Qué chimba!", "Ave María", "¡Qué bacano!", "¡Ay, no!", "¡Eso sí!", "Parcero", "Mi amor"], default: ["¡Qué bacano!", "Ave María"] },
      temasInteres: { type: "multiselect", label: "Temas de Interés", options: ["Familia", "Salud", "Nutrición", "Cocina", "Ejercicio", "Trabajo", "Entretenimiento", "Tecnología"], default: ["Familia", "Salud", "Nutrición"] },
      estiloComunicacion: { type: "select", label: "Estilo de Comunicación", options: ["Directo", "Indirecto", "Emocional", "Racional", "Mixto"], default: "Emocional" }
    }
  }
};

export const PersonaEditor: React.FC<PersonaEditorProps> = ({
  personas,
  onSavePersonas,
  editingPersona,
  onEditPersona
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Partial<DairyPersona>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['demografiaBasica']));
  const [activeTab, setActiveTab] = useState<'basic' | 'variables'>('basic');

  const handleCreatePersona = () => {
    setIsCreating(true);
    setCurrentPersona({
      id: '',
      name: '',
      archetype: '',
      variables: {},
      baseProfile: {
        age: 35,
        gender: 'Femenino',
        location: 'Bogotá',
        income: 2500000,
        lifestyle: 'Activo'
      },
      dairyConsumption: {
        frequency: 'Diario',
        preferences: ['Leche', 'Yogurt'],
        concerns: ['Lactosa'],
        purchaseBehavior: 'Planificado'
      },
      createdAt: new Date()
    });

    // Inicializar variables con valores por defecto
    const initialVariables: Record<string, any> = {};
    Object.values(dairyPersonaVariables).forEach(category => {
      Object.entries(category.variables).forEach(([key, config]) => {
        initialVariables[key] = config.default;
      });
    });

    setCurrentPersona(prev => ({ ...prev, variables: initialVariables }));
  };

  const handleSavePersona = () => {
    if (!currentPersona.name || !currentPersona.archetype) {
      alert('Por favor completa el nombre y arquetipo de la persona.');
      return;
    }

    const personaToSave: DairyPersona = {
      ...currentPersona as DairyPersona,
      id: currentPersona.id || `persona_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: currentPersona.createdAt || new Date()
    };

    let updatedPersonas: DairyPersona[];
    if (editingPersona) {
      updatedPersonas = personas.map(p => p.id === editingPersona.id ? personaToSave : p);
    } else {
      updatedPersonas = [...personas, personaToSave];
    }

    onSavePersonas(updatedPersonas);
    setIsCreating(false);
    setCurrentPersona({});
    onEditPersona(null);
  };

  const handleDeletePersona = (personaId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta persona?')) {
      const updatedPersonas = personas.filter(p => p.id !== personaId);
      onSavePersonas(updatedPersonas);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setCurrentPersona({});
    onEditPersona(null);
  };

  const updateVariable = (key: string, value: any) => {
    setCurrentPersona(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [key]: value
      }
    }));
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const renderVariableInput = (key: string, config: any) => {
    const value = currentPersona.variables?.[key] || config.default;

    switch (config.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateVariable(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            min={config.min}
            max={config.max}
            value={value}
            onChange={(e) => updateVariable(key, parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        );

      case 'range':
        return (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium w-8">{config.min}</span>
            <input
              type="range"
              min={config.min}
              max={config.max}
              value={value}
              onChange={(e) => updateVariable(key, parseInt(e.target.value))}
              className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${((value - config.min) / (config.max - config.min)) * 100}%, #e5e7eb ${((value - config.min) / (config.max - config.min)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <span className="text-sm font-medium w-8">{config.max}</span>
            <span className="text-sm font-bold text-green-600 w-8">{value}</span>
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateVariable(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {config.options.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {config.options.map((option: string) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateVariable(key, [...selectedValues, option]);
                    } else {
                      updateVariable(key, selectedValues.filter((v: string) => v !== option));
                    }
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Efecto para cargar persona en edición
  React.useEffect(() => {
    if (editingPersona) {
      setCurrentPersona(editingPersona);
      setIsCreating(true);
    }
  }, [editingPersona]);

  if (isCreating || editingPersona) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editingPersona ? 'Editar Persona Láctea' : 'Crear Nueva Persona Láctea'}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {Object.keys(currentPersona.variables || {}).length} de 80+ variables configuradas
              </span>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Información Básica
              </button>
              <button
                onClick={() => setActiveTab('variables')}
                className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'variables'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Variables Lácteas ({Object.keys(currentPersona.variables || {}).length})
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'basic' && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Persona
                    </label>
                    <input
                      type="text"
                      value={currentPersona.name || ''}
                      onChange={(e) => setCurrentPersona(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: María José González"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arquetipo
                    </label>
                    <select
                      value={currentPersona.archetype || ''}
                      onChange={(e) => setCurrentPersona(prev => ({ ...prev, archetype: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Seleccionar arquetipo</option>
                      <option value="Madre Nutritiva">Madre Nutritiva - Busca lo mejor para la familia</option>
                      <option value="Joven Saludable">Joven Saludable - Consciente de nutrición y fitness</option>
                      <option value="Profesional Ocupada">Profesional Ocupada - Busca practicidad y calidad</option>
                      <option value="Adulto Mayor Cuidadoso">Adulto Mayor Cuidadoso - Prioriza salud y digestión</option>
                      <option value="Deportista Activo">Deportista Activo - Enfocado en proteínas y recuperación</option>
                      <option value="Tradicional Conservador">Tradicional Conservador - Prefiere sabores conocidos</option>
                      <option value="Innovador Exploratorio">Innovador Exploratorio - Abierto a nuevos productos</option>
                    </select>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">🥛 Perfil de Consumo Lácteo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de Consumo
                      </label>
                      <select
                        value={currentPersona.dairyConsumption?.frequency || 'Diario'}
                        onChange={(e) => setCurrentPersona(prev => ({
                          ...prev,
                          dairyConsumption: {
                            ...prev.dairyConsumption!,
                            frequency: e.target.value
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Múltiples veces al día">Múltiples veces al día</option>
                        <option value="Diario">Diario</option>
                        <option value="Inter-diario">Inter-diario</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Ocasional">Ocasional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comportamiento de Compra
                      </label>
                      <select
                        value={currentPersona.dairyConsumption?.purchaseBehavior || 'Planificado'}
                        onChange={(e) => setCurrentPersona(prev => ({
                          ...prev,
                          dairyConsumption: {
                            ...prev.dairyConsumption!,
                            purchaseBehavior: e.target.value
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="Planificado">Planificado - Lista de compras</option>
                        <option value="Impulsivo">Impulsivo - Decide en el momento</option>
                        <option value="Promocional">Promocional - Busca ofertas</option>
                        <option value="Rutinario">Rutinario - Siempre los mismos productos</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variables' && (
              <div className="p-6 space-y-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Configura las 80+ variables específicas para la industria láctea.
                    Estas variables permiten evaluaciones precisas de conceptos lácteos con consumidores sintéticos realistas.
                  </p>
                </div>

                {Object.entries(dairyPersonaVariables).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => toggleCategory(categoryKey)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium text-gray-900">{category.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {Object.keys(category.variables).length} variables
                        </span>
                        {expandedCategories.has(categoryKey) ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {expandedCategories.has(categoryKey) && (
                      <div className="border-t border-gray-200 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(category.variables).map(([varKey, varConfig]) => (
                            <div key={varKey}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {varConfig.label}
                              </label>
                              {renderVariableInput(varKey, varConfig)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
              onClick={handleSavePersona}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{editingPersona ? 'Guardar Cambios' : 'Crear Persona'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">👥 Gestión de Personas Lácteas</h2>
        <button
          onClick={handleCreatePersona}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Persona</span>
        </button>
      </div>

      {personas.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay personas creadas</h3>
          <p className="text-gray-500 mb-6">
            Crea personas sintéticas con 80+ características específicas de la industria láctea para evaluar conceptos de Alquería
          </p>
          <button
            onClick={handleCreatePersona}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Crear Primera Persona</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <div key={persona.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 hover:from-green-100 hover:to-green-200 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditPersona(persona)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePersona(persona.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{persona.name}</h3>
              <p className="text-sm text-green-600 mb-3 font-medium">{persona.archetype}</p>

              <div className="space-y-2 text-xs text-gray-600">
                <p className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>{persona.baseProfile.location}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>👤</span>
                  <span>{persona.baseProfile.age} años, {persona.baseProfile.gender}</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>💰</span>
                  <span>{persona.baseProfile.income.toLocaleString()} COP</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>🥛</span>
                  <span>{persona.dairyConsumption.frequency} consumo lácteo</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>{Object.keys(persona.variables).length} características configuradas</span>
                </p>
                {persona.dairyConsumption.preferences.length > 0 && (
                  <p className="flex items-center space-x-2">
                    <span>❤️</span>
                    <span>{persona.dairyConsumption.preferences.slice(0, 2).join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonaEditor;