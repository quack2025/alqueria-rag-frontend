// hooks/useFileUpload.tsx - Manejo completo de upload de archivos y paste

import { useState, useCallback, useEffect } from 'react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  text: ['text/plain', 'text/csv']
};

export interface FileUploadItem {
  file: File;
  id: string;
  preview?: string;
  type: 'image' | 'document' | 'text';
  error?: string;
}

export const useFileUpload = () => {
  const [attachedFiles, setAttachedFiles] = useState<FileUploadItem[]>([]);
  const [pasteHint, setPasteHint] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Función para validar archivos
  const validateFile = useCallback((file: File): { isValid: boolean; error?: string; type?: 'image' | 'document' | 'text' } => {
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: 'Archivo demasiado grande. Máximo 10MB permitido.' };
    }

    // Determinar tipo y validar
    let fileType: 'image' | 'document' | 'text' | undefined;
    
    if (SUPPORTED_TYPES.image.includes(file.type)) {
      fileType = 'image';
    } else if (SUPPORTED_TYPES.document.includes(file.type)) {
      fileType = 'document';
    } else if (SUPPORTED_TYPES.text.includes(file.type)) {
      fileType = 'text';
    } else {
      return { isValid: false, error: 'Tipo de archivo no soportado.' };
    }

    return { isValid: true, type: fileType };
  }, []);

  // Función para generar preview de imágenes
  const generatePreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, []);

  // Función para agregar archivos
  const addFiles = useCallback(async (files: File[]) => {
    const newFiles: FileUploadItem[] = [];

    for (const file of files) {
      const validation = validateFile(file);
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      let fileItem: FileUploadItem = {
        file,
        id,
        type: validation.type || 'document',
      };

      if (!validation.isValid) {
        fileItem.error = validation.error;
      } else {
        // Generar preview para imágenes
        if (validation.type === 'image') {
          try {
            fileItem.preview = await generatePreview(file);
          } catch (error) {
            console.warn('Error generating preview:', error);
          }
        }
      }

      newFiles.push(fileItem);
    }

    setAttachedFiles(prev => [...prev, ...newFiles]);
  }, [validateFile, generatePreview]);

  // Función para remover archivo
  const removeFile = useCallback((id: string) => {
    setAttachedFiles(prev => prev.filter(item => item.id !== id));
  }, []);

  // Función para limpiar todos los archivos
  const clearFiles = useCallback(() => {
    setAttachedFiles([]);
  }, []);

  // Manejar drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  // Manejar selección de archivos
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files) {
      addFiles(Array.from(files));
    }
  }, [addFiles]);

  // Effect para manejar paste de imágenes
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      const pastedFiles: File[] = [];
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }

      if (pastedFiles.length > 0) {
        addFiles(pastedFiles);
        setPasteHint(true);
        setTimeout(() => setPasteHint(false), 2000);
      }
    };

    // Mostrar hint cuando usuario presiona Ctrl+V
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'v') {
        setPasteHint(true);
        setTimeout(() => setPasteHint(false), 1000);
      }
    };

    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [addFiles]);

  // Helpers
  const hasFiles = attachedFiles.length > 0;
  const hasValidFiles = attachedFiles.some(item => !item.error);
  const hasErrors = attachedFiles.some(item => item.error);
  const getValidFiles = () => attachedFiles.filter(item => !item.error).map(item => item.file);

  return {
    // Estado
    attachedFiles,
    pasteHint,
    dragActive,
    hasFiles,
    hasValidFiles,
    hasErrors,

    // Funciones
    addFiles,
    removeFile,
    clearFiles,
    handleDrag,
    handleDrop,
    handleFileSelect,
    getValidFiles,

    // Constantes útiles
    maxFileSize: MAX_FILE_SIZE,
    supportedTypes: SUPPORTED_TYPES
  };
};