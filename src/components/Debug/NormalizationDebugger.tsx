// components/Debug/NormalizationDebugger.tsx - Componente para debuggear normalización de texto

import React, { useState } from 'react';
import { Search, Code, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { TextNormalizer, debugNormalization } from '../../utils/textNormalization';
import { ChunkReprocessor, mockChunkData, NormalizationReporter } from '../../utils/chunkReprocessor';
import type { ReprocessingResult } from '../../utils/chunkReprocessor';

const NormalizationDebugger: React.FC = () => {
  const [testQuery, setTestQuery] = useState('¿Qué sabemos de la consumidora de Pond´s?');
  const [debugResult, setDebugResult] = useState<any>(null);
  const [reprocessingResult, setReprocessingResult] = useState<ReprocessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDebugNormalization = () => {
    const result = debugNormalization(testQuery);
    setDebugResult(result);
  };

  const handleSimulateReprocessing = async () => {
    setIsProcessing(true);
    try {
      const mockChunks = mockChunkData();
      const result = await ChunkReprocessor.simulateReprocessing(mockChunks);
      setReprocessingResult(result);
    } catch (error) {
      console.error('Error in reprocessing simulation:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Code className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Normalization Debugger</h3>
      </div>

      {/* Query Testing Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Test Query Normalization</h4>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter test query..."
          />
          <button
            onClick={handleDebugNormalization}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Debug</span>
          </button>
        </div>

        {debugResult && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              {debugResult.hasChanges ? (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="font-medium">
                {debugResult.hasChanges ? 'Normalization Applied' : 'No Changes Needed'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700">Original:</label>
                <p className="bg-white p-2 rounded border">{debugResult.original}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Normalized:</label>
                <p className="bg-white p-2 rounded border">{debugResult.normalized}</p>
              </div>
            </div>

            {debugResult.pondsDetected && (
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-blue-800 text-sm">
                  🎯 <strong>Pond's references detected!</strong> Search variations generated:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  {debugResult.variations.slice(0, 3).map((variation: string, index: number) => (
                    <li key={index} className="font-mono bg-blue-100 px-2 py-1 rounded">
                      {variation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chunk Reprocessing Simulation */}
      <div className="border-t pt-6 space-y-4">
        <h4 className="font-medium text-gray-900">Chunk Reprocessing Simulation</h4>
        
        <button
          onClick={handleSimulateReprocessing}
          disabled={isProcessing}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? 'Processing...' : 'Simulate Reprocessing'}</span>
        </button>

        {reprocessingResult && (
          <div className="bg-green-50 rounded-lg p-4 space-y-4">
            <h5 className="font-medium text-green-800">Reprocessing Results</h5>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reprocessingResult.totalChunks}
                </div>
                <div className="text-gray-600">Total Chunks</div>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reprocessingResult.processedChunks}
                </div>
                <div className="text-gray-600">Processed</div>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {reprocessingResult.changedChunks}
                </div>
                <div className="text-gray-600">Changed</div>
              </div>
              <div className="bg-white p-3 rounded border text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {reprocessingResult.summary.pondsChunksNormalized}
                </div>
                <div className="text-gray-600">Pond's Fixed</div>
              </div>
            </div>

            {reprocessingResult.summary.normalizationExamples.length > 0 && (
              <div className="space-y-2">
                <h6 className="font-medium text-gray-800">Normalization Examples:</h6>
                {reprocessingResult.summary.normalizationExamples.map((example, index) => (
                  <div key={index} className="bg-white p-3 rounded border text-sm">
                    <div className="text-gray-600 mb-1">Original:</div>
                    <div className="font-mono text-red-600 mb-2">{example.original}</div>
                    <div className="text-gray-600 mb-1">Normalized:</div>
                    <div className="font-mono text-green-600">{example.normalized}</div>
                  </div>
                ))}
              </div>
            )}

            {reprocessingResult.errors.length > 0 && (
              <div className="bg-red-50 p-3 rounded">
                <h6 className="font-medium text-red-800 mb-2">Errors:</h6>
                <ul className="text-sm text-red-700 space-y-1">
                  {reprocessingResult.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Test Examples */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-3">Quick Test Examples</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            '¿Qué sabemos de la consumidora de Pond´s?',
            'Cuáles son los insights sobre ponds?',
            "POND'S tracking post lanzamiento 2021",
            'Información sobre limpiador facial Pond\'s'
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setTestQuery(example)}
              className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NormalizationDebugger;