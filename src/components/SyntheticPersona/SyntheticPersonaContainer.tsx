// SyntheticPersonaContainer.tsx - Contenedor principal del módulo sintético modularizado

import React from 'react';
import { ArrowLeft, Users, Star, BarChart3, MessageCircle, Settings } from 'lucide-react';
import { usePersonaFilters } from './hooks/usePersonaFilters';
import { usePersonaData } from './hooks/usePersonaData';
import { usePersonaNavigation } from './hooks/usePersonaNavigation';
import PersonaFiltersContainer from './PersonaFilters/PersonaFiltersContainer';
import PersonaGridContainer from './PersonaGrid/PersonaGridContainer';
import PersonaChatView from './PersonaViews/PersonaChatView';
import PersonaEditView from './PersonaViews/PersonaEditView';
import PersonaDashboardView from './PersonaViews/PersonaDashboardView';

const SyntheticPersonaContainer: React.FC = () => {
  const { filters, actions: filterActions, filterConfig } = usePersonaFilters();
  const personaData = usePersonaData(filters);
  const { currentView, selectedPersona, actions: navActions } = usePersonaNavigation();

  // Header del módulo
  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentView !== 'home' && (
            <button
              onClick={navActions.backToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentView === 'home' ? 'Personas Sintéticas' : getViewTitle()}
              </h1>
              <p className="text-gray-600">{getViewDescription()}</p>
            </div>
          </div>
        </div>

        {currentView === 'home' && (
          <div className="flex items-center gap-2">
            <button
              onClick={navActions.showDashboard}
              className="flex items-center gap-2 px-4 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="h-4 w-4" />
              Configurar
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Estadísticas rápidas
  const renderQuickStats = () => (
    currentView === 'home' && (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{personaData.stats.totalSavital}</div>
            <div className="text-sm text-gray-600">Usuarias Savital</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{personaData.stats.savitalUsers}</div>
            <div className="text-sm text-gray-600">Usuarios Actuales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{personaData.stats.competitors}</div>
            <div className="text-sm text-gray-600">Competencia</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{personaData.stats.totalUnilever}</div>
            <div className="text-sm text-gray-600">Arquetipos Unilever</div>
          </div>
        </div>
      </div>
    )
  );

  const getViewTitle = () => {
    switch (currentView) {
      case 'chat':
        return selectedPersona ? `Conversación con ${selectedPersona.data.name}` : 'Chat';
      case 'evaluate':
        return 'Evaluación de Conceptos';
      case 'edit':
        return 'Editor de Persona';
      case 'dashboard':
        return 'Dashboard de Insights';
      default:
        return 'Personas Sintéticas';
    }
  };

  const getViewDescription = () => {
    switch (currentView) {
      case 'home':
        return 'Interactúa con usuarias sintéticas basadas en investigación real';
      case 'chat':
        return 'Conversa naturalmente y obtén insights auténticos';
      case 'evaluate':
        return 'Evalúa conceptos y estrategias con personas sintéticas';
      case 'edit':
        return 'Personaliza y ajusta perfiles de personas';
      case 'dashboard':
        return 'Analiza patrones y tendencias de comportamiento';
      default:
        return '';
    }
  };

  // Renderizado condicional por vista
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <PersonaFiltersContainer
              filters={filters}
              actions={filterActions}
              config={filterConfig}
              stats={personaData.stats}
            />
            <PersonaGridContainer
              personas={personaData.personas}
              filters={filters}
              onPersonaSelect={navActions.selectPersona}
              onEvaluatePersona={navActions.evaluatePersona}
              onEditPersona={navActions.editPersona}
            />
          </>
        );

      case 'chat':
        return selectedPersona && (
          <PersonaChatView
            persona={selectedPersona}
            onBack={navActions.backToHome}
          />
        );

      case 'evaluate':
        return selectedPersona && (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <MessageCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-yellow-800">
                Función de evaluación de conceptos en desarrollo.
                <br />
                Persona seleccionada: <strong>{selectedPersona.data.name}</strong>
              </p>
            </div>
          </div>
        );

      case 'edit':
        return selectedPersona && (
          <PersonaEditView
            persona={selectedPersona}
            onSave={navActions.backToHome}
            onCancel={navActions.backToHome}
          />
        );

      case 'dashboard':
        return (
          <PersonaDashboardView
            stats={personaData.stats}
            personas={personaData.savitalPersonas}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      {renderQuickStats()}
      <main className="flex-1">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default SyntheticPersonaContainer;