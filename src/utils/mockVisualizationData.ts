// utils/mockVisualizationData.ts
// Función para generar datos de visualización de ejemplo cuando el backend no los proporciona

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

export const generateMockVisualization = (content: string) => {
  const lowercaseContent = content.toLowerCase();
  
  // Detectar si el contenido menciona comparaciones, tablas o gráficos
  const hasTable = lowercaseContent.includes('tabla') || 
                   lowercaseContent.includes('comparativa') || 
                   lowercaseContent.includes('performance');
  
  const hasChart = lowercaseContent.includes('gráfico') || 
                   lowercaseContent.includes('chart') || 
                   lowercaseContent.includes('visualización') ||
                   lowercaseContent.includes('crecimiento') ||
                   lowercaseContent.includes('tendencia');

  const result: { tables?: TableData[], charts?: ChartData[], images?: string[] } = {};

  // Generar tabla de ejemplo para contenido de Unilever
  if (hasTable) {
    if (lowercaseContent.includes('unilever') || lowercaseContent.includes('dove') || lowercaseContent.includes('fruco')) {
      result.tables = [{
        headers: ['Marca', 'Categoría', 'Performance (%)', 'Crecimiento (%)', 'Share de Mercado (%)'],
        rows: [
          ['Dove', 'Personal Care', '85', '12', '25'],
          ['Fruco', 'Foods', '78', '8', '45'],
          ['OMO', 'Home Care', '82', '15', '38'],
          ['Cif', 'Home Care', '75', '5', '22'],
          ['Suave', 'Personal Care', '70', '18', '15']
        ]
      }];
    }
  }

  // Generar gráfico de ejemplo
  if (hasChart) {
    if (lowercaseContent.includes('crecimiento') || lowercaseContent.includes('tendencia')) {
      result.charts = [{
        type: 'line' as const,
        title: 'Tendencia de Crecimiento por Trimestre',
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
        datasets: [{
          label: 'Crecimiento %',
          data: [12, 15, 8, 22],
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        }]
      }];
    } else if (lowercaseContent.includes('comparativa') || lowercaseContent.includes('performance')) {
      result.charts = [{
        type: 'bar' as const,
        title: 'Performance Comparativo por Marca',
        labels: ['Dove', 'Fruco', 'OMO', 'Cif', 'Suave'],
        datasets: [{
          label: 'Performance Score',
          data: [85, 78, 82, 75, 70],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 101, 101, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderWidth: 1,
        }]
      }];
    } else if (lowercaseContent.includes('participación') || lowercaseContent.includes('share')) {
      result.charts = [{
        type: 'pie' as const,
        title: 'Participación de Mercado por Marca',
        labels: ['Dove', 'Fruco', 'OMO', 'Otros'],
        datasets: [{
          label: 'Market Share %',
          data: [25, 45, 38, 22],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 101, 101, 0.8)',
            'rgba(156, 163, 175, 0.8)'
          ],
        }]
      }];
    }
  }

  return Object.keys(result).length > 0 ? result : null;
};

export const mockUnileverData = {
  brandPerformance: {
    tables: [{
      headers: ['Marca', 'Categoría', 'Performance (%)', 'Crecimiento (%)', 'Share de Mercado (%)'],
      rows: [
        ['Dove', 'Personal Care', '85', '12', '25'],
        ['Fruco', 'Foods', '78', '8', '45'],
        ['OMO', 'Home Care', '82', '15', '38'],
        ['Cif', 'Home Care', '75', '5', '22'],
        ['Suave', 'Personal Care', '70', '18', '15']
      ]
    }],
    charts: [{
      type: 'bar' as const,
      title: 'Performance Score por Marca Unilever',
      labels: ['Dove', 'Fruco', 'OMO', 'Cif', 'Suave'],
      datasets: [{
        label: 'Performance Score',
        data: [85, 78, 82, 75, 70],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 101, 101, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }]
    }]
  },
  
  marketShare: {
    charts: [{
      type: 'pie' as const,
      title: 'Participación de Mercado Unilever',
      labels: ['Dove', 'Fruco', 'OMO', 'Otros'],
      datasets: [{
        label: 'Market Share %',
        data: [25, 45, 38, 22],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 101, 101, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ]
      }]
    }]
  },
  
  growthTrend: {
    charts: [{
      type: 'line' as const,
      title: 'Tendencia de Crecimiento Trimestral',
      labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      datasets: [{
        label: 'Crecimiento %',
        data: [12, 15, 8, 22],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: true
      }]
    }]
  }
};