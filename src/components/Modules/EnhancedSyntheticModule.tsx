// EnhancedSyntheticModule.tsx - Módulo Sintético Mejorado con Usuarias Savital
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, MessageCircle, User, Settings, BarChart3, 
  TestTube, Edit3, Sparkles, Star, MapPin, Briefcase, Package,
  ChevronDown, Filter, Search, UserCheck, UserX, Eye
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';
import { SAVITAL_FOCUS_GROUP } from '../../data/savitalFocusGroup';
import { BASIC_UNILEVER_PERSONAS } from '../../types/unileverPersona.types';
import ConceptEvaluator from '../ConceptEvaluation/ConceptEvaluator';
import { PersonaEditor } from '../PersonaEditor/PersonaEditor';
import SavitalUserChat from '../ConceptEvaluation/SavitalUserChat';
import InteractiveSavitalDashboard from '../ConceptEvaluation/InteractiveSavitalDashboard';

type PersonaSource = 'savital' | 'unilever' | 'all';
type ViewMode = 'home' | 'chat' | 'evaluate' | 'edit' | 'dashboard';

const EnhancedSyntheticModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPersona, setSelectedPersona] = useState<any>(null);
  const [personaSource, setPersonaSource] = useState<PersonaSource>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterNSE, setFilterNSE] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const user = getUser();

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  const handleBackToMain = () => {
    setCurrentView('home');
    setSelectedPersona(null);
  };

  const handlePersonaSelect = (persona: any, source: 'savital' | 'unilever') => {
    setSelectedPersona({ ...persona, source });
    setCurrentView('chat');
  };

  const handleEvaluateClick = () => {
    setCurrentView('evaluate');
  };

  const handleEditClick = () => {
    setCurrentView('edit');
  };

  const handleDashboardClick = () => {
    setCurrentView('dashboard');
  };

  // Filtrar personas
  const getFilteredSavitalPersonas = () => {
    return SAVITAL_FOCUS_GROUP.filter(persona => {
      const matchSearch = searchTerm === '' || 
        persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.occupation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCity = filterCity === 'all' || persona.city === filterCity;
      const matchNSE = filterNSE === 'all' || persona.nse === filterNSE;
      const matchBrand = filterBrand === 'all' || 
        (filterBrand === 'savital' && persona.savital_relationship.is_user) ||
        (filterBrand === 'competitor' && !persona.savital_relationship.is_user);

      return matchSearch && matchCity && matchNSE && matchBrand;
    });
  };

  const filteredSavitalPersonas = getFilteredSavitalPersonas();

  // Stats
  const stats = {
    totalSavital: SAVITAL_FOCUS_GROUP.length,
    savitalUsers: SAVITAL_FOCUS_GROUP.filter(p => p.savital_relationship.is_user).length,
    competitorUsers: SAVITAL_FOCUS_GROUP.filter(p => !p.savital_relationship.is_user).length,
    bogota: SAVITAL_FOCUS_GROUP.filter(p => p.city === 'Bogotá').length,
    barranquilla: SAVITAL_FOCUS_GROUP.filter(p => p.city === 'Barranquilla').length
  };

  if (currentView === 'chat' && selectedPersona) {
    if (selectedPersona.source === 'savital') {
      return <SavitalUserChat selectedUser={selectedPersona} onClose={handleBackToMain} />;
    }
  }

  if (currentView === 'evaluate') {
    return <ConceptEvaluator onBack={handleBackToMain} />;
  }

  if (currentView === 'edit') {
    return <PersonaEditor onBack={handleBackToMain} />;
  }

  if (currentView === 'dashboard') {
    return (
      <div>
        <button
          onClick={handleBackToMain}
          className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <InteractiveSavitalDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToHome}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Módulo de Personas Sintéticas Avanzado
                  </h1>
                  <p className="text-sm text-gray-600">
                    Incluye 8 usuarias Savital + arquetipos Unilever
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Hola, <span className="font-medium">{user?.name || 'Usuario'}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Personas</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-purple-100 rounded-lg p-4">
              <Package className="h-5 w-5 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.totalSavital}</p>
              <p className="text-sm text-gray-600">Usuarias Savital</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <UserCheck className="h-5 w-5 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.savitalUsers}</p>
              <p className="text-sm text-gray-600">Leales Savital</p>
            </div>
            <div className="bg-red-100 rounded-lg p-4">
              <UserX className="h-5 w-5 text-red-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.competitorUsers}</p>
              <p className="text-sm text-gray-600">Competencia</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <MapPin className="h-5 w-5 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.bogota}</p>
              <p className="text-sm text-gray-600">Bogotá</p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4">
              <MapPin className="h-5 w-5 text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.barranquilla}</p>
              <p className="text-sm text-gray-600">Barranquilla</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <button
            onClick={handleDashboardClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-center gap-2"
          >
            <BarChart3 className="h-8 w-8" />
            <span className="font-medium">Dashboard Evaluación</span>
            <span className="text-xs opacity-90">Ver resultados completos</span>
          </button>
          
          <button
            onClick={handleEvaluateClick}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-center gap-2"
          >
            <TestTube className="h-8 w-8" />
            <span className="font-medium">Evaluar Conceptos</span>
            <span className="text-xs opacity-90">Testear nuevos productos</span>
          </button>
          
          <button
            onClick={handleEditClick}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-center gap-2"
          >
            <Edit3 className="h-8 w-8" />
            <span className="font-medium">Editar Perfiles</span>
            <span className="text-xs opacity-90">Ajustar características</span>
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-center gap-2"
          >
            <Filter className="h-8 w-8" />
            <span className="font-medium">Filtros</span>
            <span className="text-xs opacity-90">Buscar personas</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre o profesión..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">Todas</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Barranquilla">Barranquilla</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NSE</label>
                <select
                  value={filterNSE}
                  onChange={(e) => setFilterNSE(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">Todos</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">Todas</option>
                  <option value="savital">Usuario Savital</option>
                  <option value="competitor">Competencia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuente</label>
                <select
                  value={personaSource}
                  onChange={(e) => setPersonaSource(e.target.value as PersonaSource)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="all">Todas</option>
                  <option value="savital">Solo Savital</option>
                  <option value="unilever">Solo Unilever</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Savital Personas Section */}
        {(personaSource === 'all' || personaSource === 'savital') && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Star className="h-6 w-6 text-purple-600" />
              Usuarias Sintéticas Savital ({filteredSavitalPersonas.length})
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSavitalPersonas.map((persona) => (
                <div
                  key={persona.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => handlePersonaSelect(persona, 'savital')}
                >
                  {/* Header */}
                  <div className={`p-4 ${persona.savital_relationship.is_user ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
                    <div className="text-white">
                      <h3 className="font-bold text-lg">{persona.name}</h3>
                      <p className="text-sm opacity-90">{persona.age} años • {persona.city}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{persona.occupation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">NSE {persona.nse}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {persona.savital_relationship.is_user ? 
                            '✅ Usuario Savital' : 
                            `❌ ${persona.savital_relationship.current_preferred_brand}`}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-700">
                        <strong>Problema principal:</strong> {persona.hair_profile.main_concerns[0]}
                      </p>
                    </div>

                    <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Chatear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unilever Personas Section */}
        {(personaSource === 'all' || personaSource === 'unilever') && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="h-6 w-6 text-green-600" />
              Arquetipos Unilever Clásicos
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(BASIC_UNILEVER_PERSONAS).map(([archetype, persona]) => (
                <div
                  key={archetype}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8" />
                      <div>
                        <h3 className="text-lg font-semibold">{persona.name}</h3>
                        <p className="text-sm opacity-90">{archetype.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Edad:</span>
                        <span>{persona.demographics?.age} años</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">NSE:</span>
                        <span>{persona.demographics?.nse_level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Ciudad:</span>
                        <span>{persona.location?.city}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800 text-center">
                        <Eye className="h-4 w-4 inline mr-1" />
                        Ver en evaluador de conceptos
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnhancedSyntheticModule;