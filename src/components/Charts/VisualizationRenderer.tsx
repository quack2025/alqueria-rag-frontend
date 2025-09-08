// components/Charts/VisualizationRenderer.tsx
// Componente para renderizar visualizaciones dinámicas (tablas y gráficos)

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp, Database } from 'lucide-react';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
);

interface TableData {
  headers: string[];
  rows: string[][];
}

interface ChartData {
  type: 'bar' | 'pie' | 'line' | 'doughnut';
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

interface VisualizationData {
  tables?: TableData[];
  charts?: ChartData[];
  images?: string[];
}

interface VisualizationRendererProps {
  visualization: VisualizationData;
  className?: string;
}

const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({
  visualization,
  className = ""
}) => {
  const defaultColors = [
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(16, 185, 129, 0.8)',   // green
    'rgba(245, 101, 101, 0.8)',  // red
    'rgba(251, 191, 36, 0.8)',   // yellow
    'rgba(139, 92, 246, 0.8)',   // purple
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(6, 182, 212, 0.8)',    // cyan
    'rgba(34, 197, 94, 0.8)',    // emerald
  ];

  const defaultBorderColors = [
    'rgba(59, 130, 246, 1)',     // blue
    'rgba(16, 185, 129, 1)',     // green
    'rgba(245, 101, 101, 1)',    // red
    'rgba(251, 191, 36, 1)',     // yellow
    'rgba(139, 92, 246, 1)',     // purple
    'rgba(236, 72, 153, 1)',     // pink
    'rgba(6, 182, 212, 1)',      // cyan
    'rgba(34, 197, 94, 1)',      // emerald
  ];

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <BarChart3 className="h-4 w-4" />;
      case 'line': return <TrendingUp className="h-4 w-4" />;
      case 'pie': 
      case 'doughnut': return <PieChart className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const renderChart = (chart: ChartData, index: number) => {
    // Validar que el chart tenga la estructura mínima necesaria
    if (!chart || !chart.type || !chart.datasets || chart.datasets.length === 0) {
      return null;
    }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: chart.title || 'Gráfico',
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
        },
      },
      scales: chart.type === 'pie' || chart.type === 'doughnut' ? {} : {
        y: {
          beginAtZero: true,
        },
      },
    };

    const chartData = {
      labels: chart.labels || [],
      datasets: (chart.datasets || []).map((dataset, datasetIndex) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || 
          (chart.type === 'pie' || chart.type === 'doughnut' 
            ? defaultColors 
            : defaultColors[datasetIndex % defaultColors.length]),
        borderColor: dataset.borderColor || 
          (chart.type === 'pie' || chart.type === 'doughnut'
            ? defaultBorderColors
            : defaultBorderColors[datasetIndex % defaultBorderColors.length]),
        borderWidth: dataset.borderWidth || 1,
      })),
    };

    const ChartComponent = {
      bar: Bar,
      pie: Pie,
      line: Line,
      doughnut: Doughnut,
    }[chart.type] || Bar;

    return (
      <div key={index} className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          {getChartIcon(chart.type)}
          <span className="text-sm font-medium text-blue-800">{chart.title}</span>
        </div>
        <div className="h-64 sm:h-80">
          <ChartComponent data={chartData} options={options} />
        </div>
      </div>
    );
  };

  const renderTable = (table: TableData, index: number) => {
    // Validar que la tabla tenga la estructura mínima necesaria
    if (!table || !table.headers || !table.rows || table.headers.length === 0) {
      return null;
    }

    return (
      <div key={index} className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-4 w-4" />
          <span className="text-sm font-medium text-blue-800">Tabla de Datos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {table.headers.map((header, headerIndex) => (
                  <th
                    key={headerIndex}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(table.rows || []).map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {(row || []).map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cell || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderImage = (imageUrl: string, index: number) => {
    return (
      <div key={index} className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm font-medium text-blue-800">Visualización Generada</span>
        </div>
        <img 
          src={imageUrl} 
          alt={`Visualización ${index + 1}`}
          className="w-full h-auto rounded-lg"
          loading="lazy"
        />
      </div>
    );
  };

  // Si no hay visualizaciones, no renderizar nada
  if (!visualization || 
      (!visualization.tables?.length && !visualization.charts?.length && !visualization.images?.length)) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Renderizar tablas */}
      {visualization.tables?.map((table, index) => renderTable(table, index)).filter(Boolean)}
      
      {/* Renderizar gráficos */}
      {visualization.charts?.map((chart, index) => renderChart(chart, index)).filter(Boolean)}
      
      {/* Renderizar imágenes */}
      {visualization.images?.map((image, index) => renderImage(image, index)).filter(Boolean)}
    </div>
  );
};

export default VisualizationRenderer;