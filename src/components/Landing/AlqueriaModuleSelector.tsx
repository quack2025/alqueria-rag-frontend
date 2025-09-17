// AlqueriaModuleSelector.tsx - Landing page con selector de módulos para Alquería
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Users, LogOut, Settings, Milk, ChevronRight, TrendingUp, Lightbulb } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';

interface AlqueriaModuleSelectorProps {
  className?: string;
}

const AlqueriaModuleSelector: React.FC<AlqueriaModuleSelectorProps> = ({ className }) => {
  const navigate = useNavigate();
  const { logout, getUser } = useAuth();
  const user = getUser();

  const modules = [
    {
      id: 'intelligent',
      title: 'RAG Inteligente',
      subtitle: 'Búsqueda avanzada en documentos lácteos',
      description: 'Accede a 734+ documentos del sector lácteo con análisis inteligente y respuestas precisas basadas en datos reales de Alquería',
      icon: Bot,
      color: 'emerald',
      features: [
        '734 documentos lácteos vectorizados',
        'Búsqueda semántica avanzada',
        'Respuestas con citas exactas',
        'Análisis competitivo Alpina, Colanta',
        'Insights de mercado lácteo colombiano',
        'Metadata completa de cada consulta'
      ],
      route: '/intelligent',
      gradient: 'from-emerald-600 to-green-600',
      badge: 'CORE',
      button: 'Acceder a RAG Inteligente'
    },
    {
      id: 'creative',
      title: 'Módulo Creativo',
      subtitle: 'Generación de insights estratégicos',
      description: 'Combina el poder del RAG con creatividad AI para generar análisis profundos, visualizaciones y recomendaciones estratégicas del sector lácteo',
      icon: Sparkles,
      color: 'cyan',
      features: [
        'Análisis estratégico del mercado lácteo',
        'Generación de tablas y visualizaciones',
        'Insights creativos sobre tendencias',
        'Recomendaciones de innovación',
        'Análisis SWOT automatizado',
        'Proyecciones y escenarios futuros'
      ],
      route: '/creative',
      gradient: 'from-cyan-500 to-teal-600',
      badge: 'AVANZADO',
      button: 'Explorar Módulo Creativo'
    },
    {
      id: 'innovation-lab',
      title: 'Innovation Lab',
      subtitle: 'Personas sintéticas del sector lácteo',
      description: 'Evalúa conceptos lácteos con personas sintéticas colombianas y genera informes ejecutivos completos basados en datos reales de Alquería',
      icon: Users,
      color: 'violet',
      features: [
        'Personas sintéticas lácteas colombianas',
        'Evaluación cualitativa de productos lácteos',
        'Informes ejecutivos profesionales',
        'Entrevistas conversacionales detalladas',
        'Insights basados en datos Alquería RAG',
        'Exportación JSON y visualizaciones'
      ],
      route: '/innovation-lab',
      gradient: 'from-violet-500 to-purple-600',
      badge: 'PREMIUM',
      button: 'Iniciar Innovation Lab'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-alqueria-50 via-white to-alqueria-100', className)}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gradient-to-r from-alqueria-600 to-alqueria-500 rounded-xl flex items-center justify-center">
                <Milk className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema RAG Alquería</h1>
                <p className="text-sm text-gray-600">Inteligencia Láctea • Usuario: {user?.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {/* Settings not implemented */}}
                className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Configuración"
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Selecciona tu Módulo de Trabajo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestros módulos especializados para análisis del mercado lácteo colombiano
            con inteligencia artificial avanzada y datos reales de Alquería
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-alqueria-600">734+</div>
              <div className="text-sm text-gray-600">Documentos Lácteos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-alqueria-600">3</div>
              <div className="text-sm text-gray-600">Módulos RAG</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-alqueria-600">95%</div>
              <div className="text-sm text-gray-600">Precisión</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-alqueria-600">24/7</div>
              <div className="text-sm text-gray-600">Disponibilidad</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              className="group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              onClick={() => navigate(module.route)}
            >
              {/* Badge */}
              {module.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={cn(
                    'px-3 py-1 text-xs font-bold rounded-full',
                    module.badge === 'CORE'
                      ? 'bg-emerald-100 text-emerald-700'
                      : module.badge === 'AVANZADO'
                      ? 'bg-cyan-100 text-cyan-700'
                      : 'bg-purple-100 text-purple-700'
                  )}>
                    {module.badge}
                  </span>
                </div>
              )}

              {/* Header with gradient */}
              <div className={cn('h-32 bg-gradient-to-r', module.gradient, 'p-6 text-white relative overflow-hidden')}>
                <div className="absolute top-6 left-6">
                  <module.icon className="h-10 w-10 text-white/90" />
                </div>
                <div className="absolute -bottom-20 -right-20 h-40 w-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-white/10 rounded-full" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm font-medium text-gray-600 mb-3">{module.subtitle}</p>
                <p className="text-sm text-gray-500 mb-4">{module.description}</p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {module.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 text-alqueria-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  className={cn(
                    'w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all',
                    'bg-gradient-to-r', module.gradient,
                    'hover:shadow-lg transform hover:scale-[1.02]'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(module.route);
                  }}
                >
                  {module.button}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-alqueria-50 to-alqueria-100 rounded-xl p-6 text-center">
          <Lightbulb className="h-8 w-8 text-alqueria-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Necesitas ayuda para elegir?
          </h3>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            <strong>RAG Inteligente</strong> para búsquedas precisas en documentos •
            <strong> Módulo Creativo</strong> para análisis estratégicos •
            <strong> Innovation Lab</strong> para evaluación con personas sintéticas
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 Alquería - Sistema RAG Inteligente</p>
            <p>Powered by Genius Bot by Insight Genius • 734 documentos lácteos indexados</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AlqueriaModuleSelector;