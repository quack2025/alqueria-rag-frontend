// components/GeneralModule/ChatInterface.tsx - Interface de chat limpia y enfocada

import React, { useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import type { ChatMessage } from '../../types';
import MarkdownRenderer from '../Chat/MarkdownRenderer';
import CitationsList from '../Chat/CitationsList';
import VisualizationRenderer from '../Charts/VisualizationRenderer';
import FileUploadZone from './FileUploadZone';
import type { FileUploadItem } from '../../hooks/useFileUpload';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  userName?: string;
  
  // File upload props
  attachedFiles: FileUploadItem[];
  onFileUpload: (files: FileList | null) => void;
  onRemoveFile: (id: string) => void;
  pasteHint: boolean;
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  setInput,
  onSubmit,
  isLoading,
  userName,
  attachedFiles,
  onFileUpload,
  onRemoveFile,
  pasteHint,
  dragActive,
  onDrag,
  onDrop
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4"
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        {/* Drag & Drop Overlay */}
        {dragActive && (
          <div className="fixed inset-0 bg-blue-600/20 border-2 border-dashed border-blue-400 rounded-lg z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">Suelta tus archivos aquí</p>
              <p className="text-sm text-gray-600">Imágenes, PDFs y documentos soportados</p>
            </div>
          </div>
        )}

        {/* Paste Hint */}
        {pasteHint && (
          <div className="fixed top-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-40">
            ✨ Imagen pegada desde portapapeles
          </div>
        )}

        {messages.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              RAG General - Insights de Unilever
            </h3>
            <p className="text-gray-600 mb-6">
              Haz preguntas específicas sobre el portfolio de marcas, comportamiento del consumidor, tendencias de mercado y análisis competitivo.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">📊 Análisis de Marcas</h4>
                <p className="text-sm text-gray-600">
                  "¿Cuáles son las percepciones principales sobre Dove en el mercado colombiano?"
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">👥 Comportamiento del Consumidor</h4>
                <p className="text-sm text-gray-600">
                  "¿Cuáles son los drivers de compra principales en la categoría de alimentos?"
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">⚔️ Análisis Competitivo</h4>
                <p className="text-sm text-gray-600">
                  "¿Cómo se posiciona Fruco versus la competencia en salsa de tomate?"
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">📈 Tendencias de Mercado</h4>
                <p className="text-sm text-gray-600">
                  "¿Qué tendencias emergentes se identifican en cuidado personal?"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">RAG General</span>
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-xl ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}>
                    <MarkdownRenderer content={message.content} />
                    
                    {/* Visualizations */}
                    {message.visualizations && (
                      <div className="mt-4">
                        <VisualizationRenderer data={message.visualizations} />
                      </div>
                    )}
                  </div>
                  
                  {/* Citations */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3">
                      <CitationsList citations={message.citations} />
                    </div>
                  )}
                  
                  {/* Metadata */}
                  {message.metadata && message.role === 'assistant' && (
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      {message.metadata.chunks_retrieved && (
                        <span>📄 {message.metadata.chunks_retrieved} documentos</span>
                      )}
                      {message.metadata.processing_time_seconds && (
                        <span>⏱️ {message.metadata.processing_time_seconds.toFixed(1)}s</span>
                      )}
                      {message.metadata.strategic_framework && (
                        <span>🎯 {message.metadata.strategic_framework}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* File Upload Zone */}
          <FileUploadZone 
            attachedFiles={attachedFiles}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
          />

          {/* Input Form */}
          <form onSubmit={onSubmit} className="flex gap-3">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Haz una pregunta sobre insights de Unilever..."
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Analizando...' : 'Enviar'}
            </button>
          </form>

          {/* User info */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Conectado como {userName || 'Usuario'} • Datos actualizados de Unilever
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;