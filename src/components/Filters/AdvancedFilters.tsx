// components/Filters/AdvancedFilters.tsx - Filtros avanzados para búsqueda RAG Enterprise Unilever

import React, { useState } from 'react';
import { Filter, Calendar, MapPin, BookOpen, TrendingUp, X, Package, Building2, Users, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterState {
  regions: string[];
  years: number[];
  brands: string[];
  categories: string[];
  methodologies: string[];
  studyTypes: string[];
  audienceSegments: string[];
  minConfidence: number;
  ragPercentage: number;
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  className?: string;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  className 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    regions: [],
    years: [],
    brands: [],
    categories: [],
    methodologies: [],
    studyTypes: [],
    audienceSegments: [],
    minConfidence: 0,
    ragPercentage: 60
  });

  // Opciones disponibles basadas en metadata de Unilever LATAM/Colombia
  const availableRegions = [
    'Nacional Colombia',
    'Bogotá',
    'Medellín',
    'Cali',
    'Barranquilla',
    'Bucaramanga',
    'Cartagena',
    'Región Caribe',
    'Región Pacífica', 
    'Región Andina',
    'LATAM Regional',
    'México',
    'Brasil',
    'Argentina',
    'Perú',
    'Chile',
    'Ecuador'
  ];

  const availableYears = [2024, 2023, 2022, 2021, 2020, 2019];
  
  // Portfolio completo de marcas Unilever
  const availableBrands = [
    'Dove',
    'Fruco', 
    'OMO',
    'Cif',
    'Suave',
    'Pond\'s',
    'Hellmann\'s',
    'Knorr',
    'Rexona',
    'TRESemmé',
    'Axe',
    'Lipton',
    'Magnum',
    'Ben & Jerry\'s',
    'Holanda',
    'Maizena',
    'Natura',
    'Savital',
    'Aromatel 3D',
    'Fab'
  ];

  // Categorías estratégicas Unilever
  const availableCategories = [
    'Personal Care',
    'Home Care', 
    'Foods & Refreshment',
    'Beauty & Wellbeing',
    'Skin Care',
    'Hair Care',
    'Deodorants',
    'Oral Care',
    'Laundry',
    'Cleaning',
    'Condiments & Dressings',
    'Soups & Bouillons',
    'Ice Cream',
    'Tea & Beverages',
    'Nutrition & Health'
  ];

  // Segmentos de audiencia específicos para FMCG
  const availableAudienceSegments = [
    'Madres Millennials',
    'Profesionales Urbanos',
    'Jóvenes Gen Z',
    'Familias Tradicionales',
    'Hogares Premium',
    'Consumidores Conscientes',
    'Seniors 50+',
    'NSE A/B+',
    'NSE C+/C',
    'NSE D+/D',
    'Costeños',
    'Paisas',
    'Bogotanos',
    'Rurales'
  ];
  
  const availableMethodologies = [
    'Cuantitativo',
    'Cualitativo',
    'Mixto',
    'Focus Groups',
    'Entrevistas a Profundidad',
    'Encuestas Online',
    'Etnografía',
    'Mystery Shopping',
    'Observación POS',
    'Social Listening',
    'Mobile Research',
    'Digital Analytics',
    'Neuro Research',
    'Eye Tracking'
  ];

  const availableStudyTypes = [
    'Brand Health',
    'Consumer Journey',
    'Market Share Analysis',
    'Usage & Attitudes',
    'Concept Test',
    'Product Test',
    'Ad Test',
    'Brand Equity',
    'Segmentación',
    'Tracking Publicitario',
    'Price Sensitivity',
    'Purchase Intent',
    'Category Dynamics',
    'Competitive Analysis',
    'Shopper Insights',
    'Innovation Pipeline',
    'Sustainability Research',
    'Cultural Insights',
    'Moment Analysis',
    'Cross-Brand Synergies'
  ];

  const toggleArrayFilter = (category: keyof FilterState, value: any) => {
    setFilters(prev => {
      const currentValues = prev[category] as any[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [category]: newValues
      };
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      regions: [],
      years: [],
      brands: [],
      categories: [],
      methodologies: [],
      studyTypes: [],
      audienceSegments: [],
      minConfidence: 0,
      ragPercentage: 60
    });
  };

  const hasActiveFilters = () => {
    return filters.regions.length > 0 || 
           filters.years.length > 0 || 
           filters.brands.length > 0 ||
           filters.categories.length > 0 ||
           filters.methodologies.length > 0 ||
           filters.studyTypes.length > 0 ||
           filters.audienceSegments.length > 0 ||
           filters.minConfidence > 0 ||
           filters.ragPercentage !== 60;
  };

  const getActiveFiltersCount = () => {
    return filters.regions.length + 
           filters.years.length + 
           filters.brands.length +
           filters.categories.length +
           filters.methodologies.length +
           filters.studyTypes.length +
           filters.audienceSegments.length +
           (filters.minConfidence > 0 ? 1 : 0) +
           (filters.ragPercentage !== 60 ? 1 : 0);
  };

  const getRagBalanceLabel = (percentage: number) => {
    if (percentage >= 80) return 'Datos Documentados';
    if (percentage >= 60) return 'Híbrido Documental';
    if (percentage >= 40) return 'Híbrido Balanceado';
    if (percentage >= 20) return 'Híbrido Creativo';
    return 'Análisis Inferencial';
  };

  const getRagBalanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-blue-700 bg-blue-100';
    if (percentage >= 60) return 'text-green-700 bg-green-100';
    if (percentage >= 40) return 'text-purple-700 bg-purple-100';
    if (percentage >= 20) return 'text-orange-700 bg-orange-100';
    return 'text-pink-700 bg-pink-100';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={cn(
        "bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <Filter className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Filtros Avanzados de Búsqueda RAG
              </h2>
              <p className="text-sm text-gray-600">
                Refina los resultados según marca, región, categoría, audiencia y balance RAG/LLM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters() && (
              <div className="text-right">
                <div className="text-sm font-medium text-blue-700">
                  {getActiveFiltersCount()} filtros activos
                </div>
                <div className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  getRagBalanceColor(filters.ragPercentage)
                )}>
                  {getRagBalanceLabel(filters.ragPercentage)}
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Balance RAG/LLM */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Balance RAG/LLM</h3>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                getRagBalanceColor(filters.ragPercentage)
              )}>
                {getRagBalanceLabel(filters.ragPercentage)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-20">Creatividad</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.ragPercentage}
                onChange={(e) => setFilters(prev => ({ ...prev, ragPercentage: parseInt(e.target.value) }))}
                className="flex-1 h-2 bg-gradient-to-r from-pink-200 via-purple-200 via-green-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-500 w-20">Documentos</span>
              <div className="text-sm font-medium text-gray-700 w-12">
                {filters.ragPercentage}%
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              <strong>{filters.ragPercentage}% datos documentados</strong> + {100 - filters.ragPercentage}% análisis inferencial
            </div>
          </div>

          {/* Marcas */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Marcas Unilever</h3>
              {filters.brands.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {filters.brands.length} seleccionadas
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => toggleArrayFilter('brands', brand)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border transition-colors text-center",
                    filters.brands.includes(brand)
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                  )}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Categorías</h3>
              {filters.categories.length > 0 && (
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  {filters.categories.length} seleccionadas
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleArrayFilter('categories', category)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-lg border transition-colors",
                    filters.categories.includes(category)
                      ? "bg-purple-600 text-white border-purple-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Segmentos de Audiencia */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Segmentos de Audiencia</h3>
              {filters.audienceSegments.length > 0 && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  {filters.audienceSegments.length} seleccionados
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableAudienceSegments.map(segment => (
                <button
                  key={segment}
                  onClick={() => toggleArrayFilter('audienceSegments', segment)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-lg border transition-colors",
                    filters.audienceSegments.includes(segment)
                      ? "bg-green-600 text-white border-green-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50"
                  )}
                >
                  {segment}
                </button>
              ))}
            </div>
          </div>

          {/* Regiones */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Regiones</h3>
              {filters.regions.length > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                  {filters.regions.length} seleccionadas
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableRegions.map(region => (
                <button
                  key={region}
                  onClick={() => toggleArrayFilter('regions', region)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border transition-colors text-center",
                    filters.regions.includes(region)
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
                  )}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Años */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Período</h3>
              {filters.years.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {filters.years.length} años
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => toggleArrayFilter('years', year)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border transition-colors",
                    filters.years.includes(year)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Metodologías */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Metodología</h3>
              {filters.methodologies.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {filters.methodologies.length} seleccionadas
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableMethodologies.map(methodology => (
                <button
                  key={methodology}
                  onClick={() => toggleArrayFilter('methodologies', methodology)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-lg border transition-colors",
                    filters.methodologies.includes(methodology)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  )}
                >
                  {methodology}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Estudio */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Tipo de Estudio</h3>
              {filters.studyTypes.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {filters.studyTypes.length} seleccionados
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableStudyTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayFilter('studyTypes', type)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-lg border transition-colors",
                    filters.studyTypes.includes(type)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Años */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-medium text-gray-900">Período</h3>
              {filters.years.length > 0 && (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                  {filters.years.length} años
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => toggleArrayFilter('years', year)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border transition-colors",
                    filters.years.includes(year)
                      ? "bg-orange-600 text-white border-orange-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-orange-300 hover:bg-orange-50"
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Metodologías */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-medium text-gray-900">Metodología</h3>
              {filters.methodologies.length > 0 && (
                <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">
                  {filters.methodologies.length} seleccionadas
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableMethodologies.map(methodology => (
                <button
                  key={methodology}
                  onClick={() => toggleArrayFilter('methodologies', methodology)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-lg border transition-colors",
                    filters.methodologies.includes(methodology)
                      ? "bg-teal-600 text-white border-teal-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-teal-300 hover:bg-teal-50"
                  )}
                >
                  {methodology}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Estudio */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-pink-600" />
              <h3 className="text-lg font-medium text-gray-900">Tipo de Estudio</h3>
              {filters.studyTypes.length > 0 && (
                <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                  {filters.studyTypes.length} seleccionados
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableStudyTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleArrayFilter('studyTypes', type)}
                  className={cn(
                    "px-3 py-2 text-sm text-left rounded-lg border transition-colors",
                    filters.studyTypes.includes(type)
                      ? "bg-pink-600 text-white border-pink-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Confianza Mínima */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Confianza Mínima</h3>
              {filters.minConfidence > 0 && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {filters.minConfidence}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">0%</span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minConfidence}
                onChange={(e) => setFilters(prev => ({ ...prev, minConfidence: parseInt(e.target.value) }))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-500">100%</span>
              <div className="text-sm font-medium text-gray-700 w-12">
                {filters.minConfidence}%
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Filtra resultados por nivel de confianza en los insights generados
            </div>
          </div>

          {/* Resumen de Filtros Activos */}
          {hasActiveFilters() && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">
                  Filtros Activos ({getActiveFiltersCount()})
                </h4>
                <button
                  onClick={resetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {/* Balance RAG/LLM */}
                {filters.ragPercentage !== 60 && (
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded text-xs border",
                    getRagBalanceColor(filters.ragPercentage)
                  )}>
                    <Zap className="h-3 w-3" />
                    {getRagBalanceLabel(filters.ragPercentage)} ({filters.ragPercentage}%)
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, ragPercentage: 60 }))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                
                {/* Marcas */}
                {filters.brands.map(brand => (
                  <span key={brand} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border">
                    <Package className="h-3 w-3 text-blue-600" />
                    {brand}
                    <button
                      onClick={() => toggleArrayFilter('brands', brand)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {/* Categorías */}
                {filters.categories.map(category => (
                  <span key={category} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border">
                    <Building2 className="h-3 w-3 text-purple-600" />
                    {category}
                    <button
                      onClick={() => toggleArrayFilter('categories', category)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {/* Segmentos de Audiencia */}
                {filters.audienceSegments.map(segment => (
                  <span key={segment} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border">
                    <Users className="h-3 w-3 text-green-600" />
                    {segment}
                    <button
                      onClick={() => toggleArrayFilter('audienceSegments', segment)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {/* Regiones */}
                {filters.regions.map(region => (
                  <span key={region} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border">
                    <MapPin className="h-3 w-3 text-indigo-600" />
                    {region}
                    <button
                      onClick={() => toggleArrayFilter('regions', region)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {/* Años */}
                {filters.years.map(year => (
                  <span key={year} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border">
                    <Calendar className="h-3 w-3 text-orange-600" />
                    {year}
                    <button
                      onClick={() => toggleArrayFilter('years', year)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {/* Metodologías */}
                {filters.methodologies.map(methodology => (
                  <span key={methodology} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border">
                    <BookOpen className="h-3 w-3 text-orange-600" />
                    {methodology}
                    <button
                      onClick={() => toggleArrayFilter('methodologies', methodology)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {/* Tipos de Estudio */}
                {filters.studyTypes.map(type => (
                  <span key={type} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border">
                    <TrendingUp className="h-3 w-3 text-pink-600" />
                    {type}
                    <button
                      onClick={() => toggleArrayFilter('studyTypes', type)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                
                {/* Confianza Mínima */}
                {filters.minConfidence > 0 && (
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border">
                    <TrendingUp className="h-3 w-3 text-gray-600" />
                    Confianza ≥{filters.minConfidence}%
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, minConfidence: 0 }))}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              
              {/* Configuración Recomendada para casos específicos */}
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="text-xs text-blue-700 font-medium mb-2">💡 Configuraciones Recomendadas:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, brands: ['Dove'], categories: ['Personal Care'], ragPercentage: 70 }))}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Dove + Personal Care
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, brands: ['Fruco'], categories: ['Foods & Refreshment'], ragPercentage: 80 }))}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Fruco + Alimentos
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, audienceSegments: ['Madres Millennials'], ragPercentage: 65 }))}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                  >
                    Madres Millennials
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="text-sm text-gray-600">
            {hasActiveFilters() 
              ? `${getActiveFiltersCount()} filtros aplicados`
              : 'Sin filtros aplicados'
            }
            {hasActiveFilters() && (
              <div className="text-xs text-gray-500 mt-1">
                Balance: {getRagBalanceLabel(filters.ragPercentage)}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={resetFilters}
              disabled={!hasActiveFilters()}
              className={cn(
                "px-4 py-2 border rounded-lg transition-colors",
                hasActiveFilters()
                  ? "text-gray-700 border-gray-300 hover:bg-gray-50"
                  : "text-gray-400 border-gray-200 cursor-not-allowed"
              )}
            >
              Limpiar
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Filter className="h-4 w-4" />
              Aplicar Filtros
              {hasActiveFilters() && (
                <span className="bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;