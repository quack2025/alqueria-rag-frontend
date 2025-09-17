// hooks/usePersonaNavigation.ts - Custom hook para navegación entre vistas

import { useState } from 'react';

export type ViewMode = 'home' | 'chat' | 'evaluate' | 'edit' | 'dashboard';

export interface SelectedPersona {
  id: string;
  source: 'savital' | 'unilever';
  data: any;
}

export const usePersonaNavigation = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPersona, setSelectedPersona] = useState<SelectedPersona | null>(null);

  const handlePersonaSelect = (persona: any, source: 'savital' | 'unilever') => {
    setSelectedPersona({
      id: persona.id,
      source,
      data: persona
    });
    setCurrentView('chat');
  };

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedPersona(null);
  };

  const handleEvaluatePersona = (persona: any, source: 'savital' | 'unilever') => {
    setSelectedPersona({
      id: persona.id,
      source,
      data: persona
    });
    setCurrentView('evaluate');
  };

  const handleEditPersona = (persona: any, source: 'savital' | 'unilever') => {
    setSelectedPersona({
      id: persona.id,
      source,
      data: persona
    });
    setCurrentView('edit');
  };

  const handleDashboardView = () => {
    setCurrentView('dashboard');
    setSelectedPersona(null);
  };

  return {
    currentView,
    selectedPersona,
    actions: {
      selectPersona: handlePersonaSelect,
      changeView: handleViewChange,
      backToHome: handleBackToHome,
      evaluatePersona: handleEvaluatePersona,
      editPersona: handleEditPersona,
      showDashboard: handleDashboardView
    }
  };
};