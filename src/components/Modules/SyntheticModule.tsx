// components/Modules/SyntheticModule.tsx - Módulo avanzado de Personas Sintéticas

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users, MessageCircle, User, Settings, BarChart3, TestTube, Edit3, Sparkles } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';
import { BASIC_UNILEVER_PERSONAS } from '../../types/unileverPersona.types';
import { PersonaServiceConfig } from '../Settings/PersonaServiceConfig';
import ConceptEvaluator from '../ConceptEvaluation/ConceptEvaluator';
import { PersonaEditor } from '../PersonaEditor/PersonaEditor';

const SyntheticModule: React.FC = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const { t } = useTranslation();
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'evaluate' | 'edit'>('home');
  
  const user = getUser();

  // Función removida - ya no hay chat directo

  const handleEvaluateClick = () => {
    setCurrentView('evaluate');
  };

  const handleEditClick = () => {
    setCurrentView('edit');
  };

  const handleBackToMain = () => {
    setCurrentView('home');
    setSelectedPersona(null);
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToHome}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={t('common.backToHome')}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              
              <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('modules.synthetic.title')}</h1>
                <p className="text-sm text-gray-600">{t('personas.systemDescription')} • {user?.username}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={t('personas.configureServices')}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'home' ? (
          <div>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t('personas.advancedSystemTitle')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                {t('personas.advancedSystemDescription')}
              </p>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={handleEvaluateClick}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-3"
                >
                  <TestTube className="h-5 w-5" />
                  {t('personas.evaluateConcepts')}
                </button>
                <button
                  onClick={handleEditClick}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-3"
                >
                  <Edit3 className="h-5 w-5" />
                  {t('personas.editPersonas')}
                </button>
              </div>
            </div>

            {/* Personas Grid - Solo para referencia */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(BASIC_UNILEVER_PERSONAS).map(([archetype, persona]) => (
                <div
                  key={archetype}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8" />
                      <div>
                        <h3 className="text-lg font-semibold">{persona.name}</h3>
                        <p className="text-sm opacity-90">{archetype.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{t('personas.age')}:</span>
                        <span>{persona.demographics?.age} {t('personas.years')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{t('personas.nse')}:</span>
                        <span>{persona.demographics?.nse_level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{t('personas.city')}:</span>
                        <span>{persona.location?.city}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 text-center">
                        💬 <strong>{t('personas.chatAvailableAfterEvaluation')}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  {t('personas.completeValidationSystem')}
                </h3>
                <p className="text-gray-700 max-w-4xl mx-auto">
                  {t('personas.systemFeatures')}
                </p>
              </div>
            </div>
          </div>
        ) : currentView === 'evaluate' ? (
          <ConceptEvaluator onBack={handleBackToMain} />
        ) : currentView === 'edit' ? (
          <PersonaEditor onBack={handleBackToMain} />
        ) : null}
      </main>

      {/* Configuration Modal */}
      {showConfig && (
        <PersonaServiceConfig onClose={() => setShowConfig(false)} />
      )}
    </div>
  );
};

export default SyntheticModule;