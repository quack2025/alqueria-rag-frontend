// components/GeneralModule/FileUploadZone.tsx - Zona de upload de archivos

import React, { useRef } from 'react';
import { Paperclip, X, FileText, Image } from 'lucide-react';
import type { FileUploadItem } from '../../hooks/useFileUpload';

interface FileUploadZoneProps {
  attachedFiles: FileUploadItem[];
  onFileUpload: (files: FileList | null) => void;
  onRemoveFile: (id: string) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  attachedFiles,
  onFileUpload,
  onRemoveFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'image') return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  if (attachedFiles.length === 0) {
    return (
      <div className="mb-3">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => onFileUpload(e.target.files)}
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt,.csv"
          className="hidden"
        />
        
        <button
          type="button"
          onClick={handleFileClick}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Paperclip className="h-4 w-4" />
          Adjuntar archivos o pegar imágenes (Ctrl+V)
        </button>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => onFileUpload(e.target.files)}
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.csv"
        className="hidden"
      />

      <div className="flex flex-wrap gap-2 mb-2">
        {attachedFiles.map((fileItem) => (
          <div
            key={fileItem.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              fileItem.error
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-gray-50 border border-gray-200 text-gray-700'
            }`}
          >
            {fileItem.preview ? (
              <img
                src={fileItem.preview}
                alt={fileItem.file.name}
                className="h-6 w-6 rounded object-cover"
              />
            ) : (
              getFileIcon(fileItem.type)
            )}
            
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{fileItem.file.name}</p>
              <p className="text-xs opacity-75">
                {formatFileSize(fileItem.file.size)}
              </p>
              {fileItem.error && (
                <p className="text-xs text-red-600">{fileItem.error}</p>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => onRemoveFile(fileItem.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleFileClick}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
      >
        <Paperclip className="h-4 w-4" />
        Agregar más archivos
      </button>
    </div>
  );
};

export default FileUploadZone;