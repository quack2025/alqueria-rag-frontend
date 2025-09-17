// AlqueriaInnovationLab.tsx - Innovation Lab especializado para Alquería

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Lightbulb, MessageSquare, Download, Settings,
  Trash2, Play, FileText, Sparkles, Milk, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn, generateId } from '../../lib/utils';
import { chatStorage } from '../../lib/chatStorage';

interface PersonaProfile {
  id: string;
  name: string;
  archetype: string;
  age: number;
  location: string;
  occupation: string;
  dairyConsumption: string;
  brandPreference: string;
  personalityTrait: string;
}

const AlqueriaInnovationLab: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();

  const [conceptName, setConceptName] = useState('');
  const [conceptDescription, setConceptDescription] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<PersonaProfile | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate]);

  // Personas sintéticas especializadas en lácteos colombianos
  const dairyPersonas: PersonaProfile[] = [
    {
      id: 'mama-nutritiva',
      name: 'María Elena Rodríguez',
      archetype: 'Mamá Nutritiva Costeña',
      age: 34,
      location: 'Barranquilla, Atlántico',
      occupation: 'Nutricionista',
      dairyConsumption: 'Alta - Busca productos ricos en calcio y proteínas para sus hijos',
      brandPreference: 'Alquería por tradición familiar, considera Alpina como premium',
      personalityTrait: 'Conscienciosa sobre nutrición infantil, busca el mejor valor nutricional'
    },
    {
      id: 'joven-fitness',
      name: 'Andrés Camilo Mejía',
      archetype: 'Joven Fitness Paisa',
      age: 26,
      location: 'Medellín, Antioquia',
      occupation: 'Ingeniero de sistemas',
      dairyConsumption: 'Media-Alta - Yogurt griego y leche deslactosada post-workout',
      brandPreference: 'Experimenta marcas, busca alto contenido proteico',
      personalityTrait: 'Orientado a resultados, compara valores nutricionales activamente'
    },
    {
      id: 'abuela-tradicional',
      name: 'Esperanza Morales',
      archetype: 'Abuela Tradicional Santandereana',
      age: 58,
      location: 'Bucaramanga, Santander',
      occupation: 'Ama de casa',
      dairyConsumption: 'Alta - Quesos frescos, leche entera para cocinar',
      brandPreference: 'Leal a Alquería, desconfía de cambios drásticos',
      personalityTrait: 'Valora tradición y sabor familiar, influye en decisiones familiares'
    },
    {
      id: 'profesional-urbana',
      name: 'Carolina Vargas',
      archetype: 'Profesional Urbana Bogotana',
      age: 29,
      location: 'Bogotá, Cundinamarca',
      occupation: 'Gerente de marketing',
      dairyConsumption: 'Media - Yogurt probiótico, leche en café matutino',
      brandPreference: 'Prefiere opciones premium y funcionales',
      personalityTrait: 'Ocupada, busca conveniencia y beneficios wellness'
    }
  ];

  const handleEvaluateWithPersona = async (persona: PersonaProfile) => {
    if (!conceptName.trim() || !conceptDescription.trim()) {
      alert('Por favor completa el nombre y descripción del concepto');
      return;
    }

    setSelectedPersona(persona);
    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const prompt = `
Como ${persona.name}, ${persona.archetype} de ${persona.age} años en ${persona.location},
evalúa este concepto lácteo de Alquería desde tu perspectiva personal y cultural colombiana:

CONCEPTO: ${conceptName}
DESCRIPCIÓN: ${conceptDescription}

PERFIL PERSONAL:
- Ocupación: ${persona.occupation}
- Consumo lácteo: ${persona.dairyConsumption}
- Preferencia marcas: ${persona.brandPreference}
- Personalidad: ${persona.personalityTrait}

Responde como ${persona.name} en primera persona, usando expresiones regionales auténticas colombianas,
y evalúa estos aspectos:

1. **Primera Impresión**: ¿Qué piensas inmediatamente al conocer este concepto?
2. **Relevancia Personal**: ¿Cómo encajaría en tu rutina diaria y familiar?
3. **Valor Nutricional**: ¿Te parece nutritivo y beneficioso para ti/tu familia?
4. **Comparación**: ¿Cómo lo comparas con productos actuales de Alpina/Colanta?
5. **Precio Esperado**: ¿Cuánto estarías dispuesta a pagar?
6. **Recomendación**: ¿Se lo recomendarías a familiares/amigos? ¿Por qué?

Habla naturalmente como lo harías con un investigador de mercados, usando tus expresiones típicas.
`;

      const apiUrl = import.meta.env.VITE_API_URL || 'https://alqueria-rag-backend-production.up.railway.app';

      const response = await fetch(`${apiUrl}/api/rag-creative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt,
          max_chunks: 8,
          customization: {
            language: 'español',
            target_audience: 'consumidores_lacteos',
            analysis_type: 'qualitative_evaluation',
            client_context: 'alqueria',
            market_focus: 'colombia_dairy',
            regional_context: persona.location,
            persona_context: persona.archetype
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEvaluationResult(data.answer);
      setShowResult(true);

      // Guardar evaluación en el storage
      const evaluationData = {
        conceptName,
        conceptDescription,
        persona: persona.name,
        archetype: persona.archetype,
        result: data.answer,
        timestamp: new Date().toISOString()
      };

      const existingEvaluations = JSON.parse(localStorage.getItem('alqueria-evaluations') || '[]');
      existingEvaluations.push(evaluationData);
      localStorage.setItem('alqueria-evaluations', JSON.stringify(existingEvaluations));

    } catch (error) {
      console.error('🥛 Innovation Lab Error:', error);
      setEvaluationResult(`Error al evaluar concepto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setShowResult(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const exportResults = () => {
    const evaluations = JSON.parse(localStorage.getItem('alqueria-evaluations') || '[]');
    const dataToExport = {
      timestamp: new Date().toISOString(),
      evaluations: evaluations,
      total_evaluations: evaluations.length
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alqueria-innovation-lab-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    localStorage.removeItem('alqueria-evaluations');
    setConceptName('');
    setConceptDescription('');
    setSelectedPersona(null);
    setEvaluationResult(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-alqueria-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>

              <div className="h-8 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">Innovation Lab Alquería</h1>
                <p className="text-sm text-gray-600">Evaluación con personas sintéticas lácteas</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Premium
              </div>

              <button
                onClick={exportResults}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Exportar evaluaciones"
              >
                <Download className="h-4 w-4" />
              </button>

              <button
                onClick={clearData}
                className="p-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                title="Limpiar datos"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel de concepto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-violet-600" />
                Concepto Lácteo
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del concepto
                  </label>
                  <input
                    type="text"
                    value={conceptName}
                    onChange={(e) => setConceptName(e.target.value)}
                    placeholder="ej: Yogurt Griego Probiótico Alquería"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={conceptDescription}
                    onChange={(e) => setConceptDescription(e.target.value)}
                    placeholder="Describe el concepto: ingredientes, beneficios, target, diferenciación..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>

                <div className="bg-violet-50 rounded-lg p-4">
                  <p className="text-sm text-violet-700 font-medium">
                    💡 Tip: Sé específico sobre beneficios nutricionales, sabor, formato de empaque
                    y precio estimado para obtener mejor feedback
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de personas */}
          <div className="lg:col-span-2">
            {!showResult ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-violet-600" />
                  Personas Sintéticas Lácteas
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {dairyPersonas.map((persona) => (
                    <div
                      key={persona.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-violet-300 hover:bg-violet-50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-violet-900">
                            {persona.name}
                          </h4>
                          <p className="text-sm text-violet-600 font-medium">{persona.archetype}</p>
                          <p className="text-xs text-gray-500">{persona.age} años • {persona.location}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600">
                        <p><span className="font-medium">Ocupación:</span> {persona.occupation}</p>
                        <p><span className="font-medium">Consumo:</span> {persona.dairyConsumption}</p>
                        <p><span className="font-medium">Marcas:</span> {persona.brandPreference}</p>
                        <p><span className="font-medium">Personalidad:</span> {persona.personalityTrait}</p>
                      </div>

                      <button
                        onClick={() => handleEvaluateWithPersona(persona)}
                        disabled={isEvaluating || !conceptName.trim() || !conceptDescription.trim()}
                        className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {isEvaluating && selectedPersona?.id === persona.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Evaluando...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="h-4 w-4" />
                            Evaluar Concepto
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {(!conceptName.trim() || !conceptDescription.trim()) && (
                  <div className="mt-4 text-center text-gray-500 text-sm">
                    Complete el concepto lácteo para activar las evaluaciones
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-600" />
                    Evaluación de {selectedPersona?.name}
                  </h3>
                  <button
                    onClick={() => setShowResult(false)}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    ← Volver a personas
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">{conceptName}</h4>
                  <p className="text-sm text-gray-600">{conceptDescription}</p>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedPersona?.name}</p>
                        <p className="text-sm text-violet-600">{selectedPersona?.archetype}</p>
                      </div>
                    </div>

                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {evaluationResult}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlqueriaInnovationLab;