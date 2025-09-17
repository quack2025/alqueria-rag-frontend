// components/Landing/ModuleSelector.tsx - Pantalla de selección de módulos (Simple)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, Sparkles, Users, LogOut, Settings, Lightbulb, Beaker } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';
import LanguageSelector from '../Language/LanguageSelector';

interface ModuleSelectorProps {
  className?: string;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ className }) => {
  const navigate = useNavigate();
  const { logout, getUser } = useAuth();
  const { t } = useTranslation();
  const user = getUser();

  const modules = [
    {
      id: 'intelligent',
      title: t('modules.intelligent.title'),
      subtitle: t('modules.intelligent.subtitle'),
      description: t('modules.intelligent.description'),
      icon: Bot,
      color: 'indigo',
      features: t('modules.intelligent.features', { returnObjects: true }) as string[],
      route: '/intelligent',
      gradient: 'from-indigo-600 to-purple-600',
      badge: t('modules.intelligent.badge'),
      button: t('modules.intelligent.button')
    },
    {
      id: 'creative',
      title: t('modules.creative.title'),
      subtitle: t('modules.creative.subtitle'),
      description: t('modules.creative.description'),
      icon: Sparkles,
      color: 'purple',
      features: t('modules.creative.features', { returnObjects: true }) as string[],
      route: '/creative',
      gradient: 'from-purple-500 to-pink-500',
      badge: t('modules.creative.badge'),
      button: t('modules.creative.button')
    },
    {
      id: 'innovation-lab',
      title: 'Personas Sintéticas RAG',
      subtitle: 'Sistema avanzado estilo SyntheticUsers',
      description: 'Evalúa conceptos con personas sintéticas basadas en conocimiento RAG y genera informes ejecutivos completos',
      icon: Users,
      color: 'violet',
      features: [
        'Personas sintéticas con 80+ variables del RAG',
        'Evaluación cualitativa profunda de conceptos',
        'Informes ejecutivos tipo SyntheticUsers.com',
        'Entrevistas conversacionales detalladas',
        'Insights basados en datos reales Unilever',
        'Exportación JSON y visualización de resultados'
      ],
      route: '/innovation-lab',
      gradient: 'from-violet-500 to-purple-600',
      badge: 'AVANZADO',
      button: 'Evaluar con Personas RAG'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50', className)}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('auth.title')}</h1>
                <p className="text-sm text-gray-600">{t('auth.subtitle')} • {user?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <LanguageSelector variant="compact" showLabel={false} />
              
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
{t('common.logout') || 'Logout'}
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
            {t('modules.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('modules.subtitle')}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              className="group relative bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(module.route)}
            >
              {/* Badge */}
              {module.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    module.badge === 'BÁSICO'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  )}>
                    {module.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className={cn('h-32 bg-gradient-to-r', module.gradient, 'p-6 text-white relative overflow-hidden')}>
                <div className="absolute top-4 left-6">
                  <module.icon className="h-10 w-10" />
                </div>
                <div className="absolute bottom-6 left-6 right-16">
                  <h3 className="text-xl font-semibold mb-1">{module.title}</h3>
                  <p className="text-sm opacity-90">{module.subtitle}</p>
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {module.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {module.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                      <div className={cn('w-1.5 h-1.5 rounded-full bg-gradient-to-r', module.gradient)}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={cn(
                    'w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r text-white shadow-md hover:shadow-lg group-hover:scale-105',
                    module.gradient
                  )}
                >
{module.button}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p className="mb-2">
            💡 <strong>Tip:</strong> Sistema simplificado sin editor complejo de personas
          </p>
          <p>
            Desarrollado con ❤️ para análisis de marcas FMCG • Sistema RAG básico
          </p>
        </div>
      </main>
    </div>
  );
};

export default ModuleSelector;