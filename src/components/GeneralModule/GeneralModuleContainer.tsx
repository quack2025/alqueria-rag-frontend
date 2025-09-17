// components/GeneralModule/GeneralModuleContainer.tsx - Container principal refactorizado

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, Filter, Search, Download, Trash2, Target, Lightbulb, Settings, Sliders } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import { chatStorage } from '../../lib/chatStorage';
import { generateMockVisualization } from '../../utils/mockVisualizationData';
import type { ChatMessage } from '../../types';
import type { StrategicQuestion } from '../../data/unileverStrategicQuestions';

// Hooks personalizados
import { useConfigurationManager } from '../../hooks/useConfigurationManager';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useGeneralRAG } from '../../hooks/useGeneralRAG';

// Componentes modularizados
import ChatInterface from './ChatInterface';
import ConfigurationDrawer from './ConfigurationDrawer';
import ChatHistorySearch from '../Search/ChatHistorySearch';

const GeneralModuleContainer: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();
  
  // Estado local del chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  
  // Hooks personalizados
  const configManager = useConfigurationManager();
  const fileUpload = useFileUpload();
  
  const user = getUser();

  // Hook RAG con dependencias
  const ragHook = useGeneralRAG({
    addMessage,
    updateLastMessage,
    isStrategicMode: configManager.isStrategicMode,
    strategicConfig: configManager.strategicConfig,
    responseSettings: configManager.responseSettings,
    activeFilters: configManager.activeFilters,
    attachedFiles: fileUpload.getValidFiles()
  });

  // Efectos
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    loadMessages();
  }, [navigate, isAuthenticated]);

  // Funciones de manejo de mensajes
  const loadMessages = () => {
    const savedMessages = chatStorage.getMessages('general');
    setMessages(savedMessages);
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    };
    
    const updatedMessages = chatStorage.addMessage('general', newMessage);
    setMessages(updatedMessages);
    return newMessage;
  };

  const updateLastMessage = (updates: Partial<ChatMessage>) => {
    const updatedMessages = chatStorage.updateLastMessage('general', updates);
    setMessages(updatedMessages);
  };

  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro que deseas limpiar el chat?')) {
      chatStorage.clearMessages('general');
      setMessages([]);
    }
  };

  const exportConversation = () => {
    const data = {
      module: 'general',
      exported_at: new Date().toISOString(),
      user: user?.username,
      messages_count: messages.length,
      filters: configManager.activeFilters,
      messages: messages
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unilever-rag-general-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || ragHook.isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Limpiar archivos después de enviar
    fileUpload.clearFiles();
    
    await ragHook.sendMessage(userMessage);
  };

  const handleStrategicQuestionSelect = (question: StrategicQuestion) => {
    // Configurar análisis según la pregunta
    if (question.recommendedConfig) {
      configManager.updateStrategicConfig(question.recommendedConfig);
    }
    
    // Establecer la pregunta en el input
    setInput(question.question);
    
    // Activar modo estratégico si no está activo
    if (!configManager.isStrategicMode) {
      configManager.toggleStrategicMode();
    }
    
    // Cerrar configuraciones
    configManager.closeAllModals();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  RAG General
                </h1>
                <p className="text-sm text-gray-500">
                  Análisis basado en datos • {user?.username || 'Usuario'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filters */}
            <button
              onClick={() => configManager.updateUIState({ showFilters: !configManager.uiState.showFilters })}
              className={cn(
                "p-2 border rounded-lg transition-colors relative",
                configManager.activeFilters 
                  ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
              )}
              title="Filtros avanzados"
            >
              <Filter className="h-4 w-4" />
              {configManager.getActiveFiltersCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">
                    {configManager.getActiveFiltersCount()}
                  </span>
                </span>
              )}
            </button>

            {/* Search */}
            <button
              onClick={() => configManager.updateUIState({ showSearch: !configManager.uiState.showSearch })}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Buscar en historial"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Strategic Mode Toggle */}
            <button
              onClick={configManager.toggleStrategicMode}
              className={cn(
                "p-2 border rounded-lg transition-colors flex items-center gap-1.5",
                configManager.isStrategicMode
                  ? "text-purple-600 border-purple-300 bg-purple-50 hover:bg-purple-100"
                  : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
              )}
              title="Modo análisis estratégico"
            >
              <Target className="h-4 w-4" />
              <span className="text-xs font-medium">
                {configManager.isStrategicMode ? 'Estratégico' : 'Básico'}
              </span>
            </button>

            {/* Strategic Questions Button */}
            {configManager.isStrategicMode && (
              <button
                onClick={() => configManager.updateUIState({ 
                  showStrategicQuestions: !configManager.uiState.showStrategicQuestions 
                })}
                className="p-2 text-purple-600 hover:text-purple-800 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                title="Preguntas estratégicas sugeridas"
              >
                <Lightbulb className="h-4 w-4" />
              </button>
            )}

            {/* Strategic Config Button */}
            {configManager.isStrategicMode && (
              <button
                onClick={() => configManager.updateUIState({ 
                  showStrategicConfig: !configManager.uiState.showStrategicConfig 
                })}
                className="p-2 text-purple-600 hover:text-purple-800 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                title="Configuración estratégica"
              >
                <Settings className="h-4 w-4" />
              </button>
            )}

            {/* Export */}
            {messages.length > 0 && (
              <button
                onClick={exportConversation}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Exportar conversación"
              >
                <Download className="h-4 w-4" />
              </button>
            )}

            {/* Clear */}
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Limpiar chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {/* Advanced Settings */}
            <button
              onClick={() => configManager.updateUIState({ 
                showAdvancedSettings: !configManager.uiState.showAdvancedSettings 
              })}
              className={cn(
                "p-2 border rounded-lg transition-colors relative",
                configManager.hasActiveConfigurations()
                  ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100"
                  : "text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
              )}
              title="Configuración avanzada de respuestas"
            >
              <Sliders className="h-4 w-4" />
              {configManager.hasActiveConfigurations() && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></span>
              )}
            </button>

            {/* General Config */}
            <button
              onClick={() => configManager.updateUIState({ 
                showConfig: !configManager.uiState.showConfig 
              })}
              className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Configuración del módulo"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {configManager.activeFilters && configManager.getActiveFiltersCount() > 0 && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700">
                Filtros activos: {configManager.getActiveFiltersCount()}
              </span>
            </div>
            <button
              onClick={() => configManager.setActiveFilters(null)}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Error Display */}
        {ragHook.error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
            {ragHook.error}
            <button
              onClick={ragHook.clearError}
              className="text-red-600 hover:text-red-800 text-xs font-medium ml-4"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Strategic Mode Indicator */}
        {configManager.isStrategicMode && (
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-purple-700 font-medium">
                  🎯 Modo Análisis Estratégico Activo
                </span>
              </div>
              <button
                onClick={configManager.toggleStrategicMode}
                className="text-purple-600 hover:text-purple-800 text-xs font-medium"
              >
                Desactivar
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                {configManager.strategicConfig.analysisType}
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                {configManager.strategicConfig.insightDepth}
              </span>
              {configManager.strategicConfig.enableCrossDocumentAnalysis && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                  Análisis cruzado
                </span>
              )}
              {configManager.strategicConfig.includeRecommendations && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                  Recomendaciones
                </span>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            messages={messages}
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={ragHook.isLoading}
            userName={user?.username}
            attachedFiles={fileUpload.attachedFiles}
            onFileUpload={fileUpload.handleFileSelect}
            onRemoveFile={fileUpload.removeFile}
            pasteHint={fileUpload.pasteHint}
            dragActive={fileUpload.dragActive}
            onDrag={fileUpload.handleDrag}
            onDrop={fileUpload.handleDrop}
          />
        </div>

        {/* Configuration Drawer */}
        <ConfigurationDrawer
          uiState={configManager.uiState}
          onUIStateChange={configManager.updateUIState}
          responseSettings={configManager.responseSettings}
          onResponseSettingsChange={configManager.updateResponseSettings}
          strategicConfig={configManager.strategicConfig}
          onStrategicConfigChange={configManager.updateStrategicConfig}
          activeFilters={configManager.activeFilters}
          onActiveFiltersChange={configManager.setActiveFilters}
          isStrategicMode={configManager.isStrategicMode}
          onStrategicModeToggle={configManager.toggleStrategicMode}
          onStrategicQuestionSelect={handleStrategicQuestionSelect}
          onResetAll={configManager.resetConfigurations}
        />
      </div>

      {/* Search Modal */}
      {configManager.uiState.showSearch && (
        <ChatHistorySearch
          isOpen={configManager.uiState.showSearch}
          onClose={() => configManager.updateUIState({ showSearch: false })}
          messages={messages}
        />
      )}
    </div>
  );
};

export default GeneralModuleContainer;