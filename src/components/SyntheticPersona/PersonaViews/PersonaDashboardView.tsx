// PersonaViews/PersonaDashboardView.tsx - Vista de dashboard con insights y analytics

import React, { useMemo } from 'react';
import { BarChart3, Users, MapPin, Briefcase, Target, TrendingUp } from 'lucide-react';
import type { PersonaStats } from '../hooks/usePersonaData';

interface PersonaDashboardViewProps {
  stats: PersonaStats;
  personas: any[];
}

const PersonaDashboardView: React.FC<PersonaDashboardViewProps> = ({
  stats,
  personas
}) => {
  // Análisis avanzado de datos
  const analytics = useMemo(() => {
    const occupationGroups = personas.reduce((acc, persona) => {
      const occupation = persona.occupation || 'No especificado';
      acc[occupation] = (acc[occupation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ageGroups = personas.reduce((acc, persona) => {
      const age = persona.age;
      let group = 'No especificado';
      if (age >= 18 && age <= 25) group = '18-25';
      else if (age >= 26 && age <= 35) group = '26-35';
      else if (age >= 36 && age <= 45) group = '36-45';
      else if (age >= 46) group = '46+';
      
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const nseGroups = personas.reduce((acc, persona) => {
      const nse = persona.nse || 'No especificado';
      acc[nse] = (acc[nse] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const savitalUsage = personas.reduce((acc, persona) => {
      const isUser = persona.unilever_brands?.savital?.usage === 'regular';
      acc[isUser ? 'usuarios' : 'no_usuarios'] = (acc[isUser ? 'usuarios' : 'no_usuarios'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      occupationGroups,
      ageGroups,
      nseGroups,
      savitalUsage,
      topOccupations: Object.entries(occupationGroups)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    };
  }, [personas]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ChartBar: React.FC<{
    label: string;
    value: number;
    maxValue: number;
    color: string;
  }> = ({ label, value, maxValue, color }) => (
    <div className="flex items-center gap-3">
      <div className="w-24 text-sm text-gray-600 truncate">{label}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
      <div className="w-8 text-sm font-medium text-gray-900">{value}</div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Insights</h1>
            <p className="text-gray-600">Análisis de personas sintéticas Savital</p>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Personas"
          value={stats.totalSavital}
          subtitle="Usuarias Savital activas"
          icon={<Users className="h-6 w-6 text-purple-600" />}
          color="text-purple-600"
        />
        
        <StatCard
          title="Usuarios Actuales"
          value={stats.savitalUsers}
          subtitle={`${Math.round((stats.savitalUsers / stats.totalSavital) * 100)}% del total`}
          icon={<Target className="h-6 w-6 text-green-600" />}
          color="text-green-600"
        />
        
        <StatCard
          title="Edad Promedio"
          value={`${stats.avgAge} años`}
          subtitle="Rango principal"
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          color="text-blue-600"
        />
        
        <StatCard
          title="Ciudades"
          value={stats.citiesRepresented.length}
          subtitle={stats.citiesRepresented.join(', ')}
          icon={<MapPin className="h-6 w-6 text-orange-600" />}
          color="text-orange-600"
        />
      </div>

      {/* Gráficos de análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por edad */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Edad</h3>
          <div className="space-y-3">
            {Object.entries(analytics.ageGroups)
              .sort((a, b) => b[1] - a[1])
              .map(([group, count]) => (
                <ChartBar
                  key={group}
                  label={group}
                  value={count}
                  maxValue={Math.max(...Object.values(analytics.ageGroups))}
                  color="bg-blue-500"
                />
              ))}
          </div>
        </div>

        {/* Distribución por NSE */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por NSE</h3>
          <div className="space-y-3">
            {Object.entries(analytics.nseGroups)
              .sort((a, b) => b[1] - a[1])
              .map(([nse, count]) => (
                <ChartBar
                  key={nse}
                  label={`NSE ${nse}`}
                  value={count}
                  maxValue={Math.max(...Object.values(analytics.nseGroups))}
                  color="bg-purple-500"
                />
              ))}
          </div>
        </div>

        {/* Top ocupaciones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Top Ocupaciones
          </h3>
          <div className="space-y-3">
            {analytics.topOccupations.map(([occupation, count]) => (
              <ChartBar
                key={occupation}
                label={occupation}
                value={count}
                maxValue={analytics.topOccupations[0][1]}
                color="bg-green-500"
              />
            ))}
          </div>
        </div>

        {/* Uso de Savital */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Relación con Savital</h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((analytics.savitalUsage.usuarios || 0) / stats.totalSavital * 100)}%
              </div>
              <div className="text-gray-600">Usuarios actuales de Savital</div>
            </div>
            
            <div className="space-y-3">
              <ChartBar
                label="Usuarios"
                value={analytics.savitalUsage.usuarios || 0}
                maxValue={stats.totalSavital}
                color="bg-green-500"
              />
              <ChartBar
                label="No usuarios"
                value={analytics.savitalUsage.no_usuarios || 0}
                maxValue={stats.totalSavital}
                color="bg-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Insights destacados */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights Clave</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-white rounded-lg">
            <div className="font-medium text-purple-600 mb-1">Ocupación Principal</div>
            <div className="text-gray-700">{analytics.topOccupations[0]?.[0] || 'No especificado'}</div>
          </div>
          
          <div className="p-4 bg-white rounded-lg">
            <div className="font-medium text-purple-600 mb-1">NSE Dominante</div>
            <div className="text-gray-700">
              {Object.entries(analytics.nseGroups)
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'No especificado'}
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg">
            <div className="font-medium text-purple-600 mb-1">Penetración Savital</div>
            <div className="text-gray-700">
              {Math.round((analytics.savitalUsage.usuarios || 0) / stats.totalSavital * 100)}% de adopción
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaDashboardView;