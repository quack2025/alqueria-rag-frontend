import type { ProductConcept, ConceptEvaluation, SavitalUser } from './savitalFocusService';

export interface KPIInsight {
  kpi: string;
  averageScore: number;
  trend: 'positive' | 'negative' | 'neutral';
  keyDrivers: string[];
  barriers: string[];
  segmentInsights: {
    nseC_plus: { score: number; drivers: string[]; count: number };
    nseC: { score: number; drivers: string[]; count: number };
    savitalUsers: { score: number; drivers: string[]; count: number };
    nonUsers: { score: number; drivers: string[]; count: number };
  };
  businessImplications: string[];
  recommendations: string[];
}

export interface ConceptInsights {
  conceptId: string;
  conceptName: string;
  overallPerformance: {
    score: number;
    ranking: number;
    strengths: string[];
    weaknesses: string[];
  };
  kpiInsights: {
    appeal: KPIInsight;
    relevance: KPIInsight;
    believability: KPIInsight;
    uniqueness: KPIInsight;
    purchaseIntention: KPIInsight;
  };
  marketOpportunity: {
    size: 'high' | 'medium' | 'low';
    readiness: 'ready' | 'needs-development' | 'not-ready';
    competitiveAdvantage: string[];
    marketBarriers: string[];
  };
  strategicRecommendations: string[];
}

export class SavitalBusinessInsightsEngine {
  private users: SavitalUser[];
  private concepts: ProductConcept[];

  constructor(users: SavitalUser[], concepts: ProductConcept[]) {
    this.users = users;
    this.concepts = concepts;
  }

  public generateConceptInsights(conceptId: string, evaluations: ConceptEvaluation[]): ConceptInsights {
    const concept = this.concepts.find(c => c.id === conceptId);
    if (!concept || !evaluations.length) {
      throw new Error('Concept not found or no evaluations provided');
    }

    return {
      conceptId,
      conceptName: concept.name,
      overallPerformance: this.calculateOverallPerformance(evaluations, conceptId),
      kpiInsights: {
        appeal: this.generateKPIInsight('appeal', evaluations, concept),
        relevance: this.generateKPIInsight('relevance', evaluations, concept),
        believability: this.generateKPIInsight('believability', evaluations, concept),
        uniqueness: this.generateKPIInsight('uniqueness', evaluations, concept),
        purchaseIntention: this.generateKPIInsight('purchase_intention', evaluations, concept)
      },
      marketOpportunity: this.assessMarketOpportunity(evaluations, concept),
      strategicRecommendations: this.generateStrategicRecommendations(evaluations, concept)
    };
  }

  private generateKPIInsight(
    kpi: keyof ConceptEvaluation['scores'], 
    evaluations: ConceptEvaluation[], 
    concept: ProductConcept
  ): KPIInsight {
    const kpiName = kpi === 'purchase_intention' ? 'purchaseIntention' : kpi;
    
    // Calcular score promedio
    const scores = evaluations.map(evaluation => evaluation.scores[kpi]);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Determinar tendencia
    const trend = this.determineTrend(averageScore);

    // Análisis por segmentos
    const segmentInsights = this.analyzeSegmentDifferences(kpi, evaluations);

    // Identificar drivers y barriers
    const { drivers, barriers } = this.identifyDriversAndBarriers(kpi, evaluations, concept);

    // Implicaciones de negocio
    const businessImplications = this.generateBusinessImplications(kpi, averageScore, drivers, barriers);

    // Recomendaciones específicas
    const recommendations = this.generateKPIRecommendations(kpi, averageScore, drivers, barriers, concept);

    return {
      kpi: kpiName,
      averageScore: Math.round(averageScore * 10) / 10,
      trend,
      keyDrivers: drivers,
      barriers,
      segmentInsights,
      businessImplications,
      recommendations
    };
  }

  private analyzeSegmentDifferences(kpi: keyof ConceptEvaluation['scores'], evaluations: ConceptEvaluation[]) {
    const nseC_plus = evaluations.filter(evaluation => {
      const user = this.users.find(u => u.id === evaluation.user_id);
      return user?.nse === 'C+';
    });

    const nseC = evaluations.filter(evaluation => {
      const user = this.users.find(u => u.id === evaluation.user_id);
      return user?.nse === 'C';
    });

    const savitalUsers = evaluations.filter(evaluation => {
      const user = this.users.find(u => u.id === evaluation.user_id);
      return user?.savital_relationship.is_user;
    });

    const nonUsers = evaluations.filter(evaluation => {
      const user = this.users.find(u => u.id === evaluation.user_id);
      return !user?.savital_relationship.is_user;
    });

    return {
      nseC_plus: {
        score: this.calculateAverageScore(nseC_plus, kpi),
        drivers: this.getSegmentKeyDrivers(nseC_plus, 'NSE C+'),
        count: nseC_plus.length
      },
      nseC: {
        score: this.calculateAverageScore(nseC, kpi),
        drivers: this.getSegmentKeyDrivers(nseC, 'NSE C'),
        count: nseC.length
      },
      savitalUsers: {
        score: this.calculateAverageScore(savitalUsers, kpi),
        drivers: this.getSegmentKeyDrivers(savitalUsers, 'Usuarios Savital'),
        count: savitalUsers.length
      },
      nonUsers: {
        score: this.calculateAverageScore(nonUsers, kpi),
        drivers: this.getSegmentKeyDrivers(nonUsers, 'No usuarios'),
        count: nonUsers.length
      }
    };
  }

  private calculateAverageScore(evaluations: ConceptEvaluation[], kpi: keyof ConceptEvaluation['scores']): number {
    if (evaluations.length === 0) return 0;
    const sum = evaluations.reduce((acc, evaluation) => acc + evaluation.scores[kpi], 0);
    return Math.round((sum / evaluations.length) * 10) / 10;
  }

  private getSegmentKeyDrivers(evaluations: ConceptEvaluation[], segmentName: string): string[] {
    // Analizar feedback cualitativo para extraer drivers principales
    const allLikes = evaluations.flatMap(evaluation => evaluation.qualitative_feedback.likes);
    const allConcerns = evaluations.flatMap(evaluation => evaluation.qualitative_feedback.concerns);
    
    // Identificar temas más mencionados
    const topLikes = this.getTopMentions(allLikes).slice(0, 3);
    const topConcerns = this.getTopMentions(allConcerns).slice(0, 2);
    
    return [...topLikes, ...topConcerns.map(concern => `Preocupación: ${concern}`)];
  }

  private getTopMentions(items: string[]): string[] {
    const counts = items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .map(([item]) => item);
  }

  private identifyDriversAndBarriers(
    kpi: keyof ConceptEvaluation['scores'], 
    evaluations: ConceptEvaluation[], 
    concept: ProductConcept
  ): { drivers: string[]; barriers: string[] } {
    
    const highScoreEvals = evaluations.filter(evaluation => evaluation.scores[kpi] >= 7);
    const lowScoreEvals = evaluations.filter(evaluation => evaluation.scores[kpi] <= 4);

    const drivers = this.extractDriversFromFeedback(highScoreEvals, kpi);
    const barriers = this.extractBarriersFromFeedback(lowScoreEvals, kpi, concept);

    return { drivers, barriers };
  }

  private extractDriversFromFeedback(highScoreEvals: ConceptEvaluation[], kpi: string): string[] {
    const allLikes = highScoreEvals.flatMap(evaluation => evaluation.qualitative_feedback.likes);
    
    // Drivers específicos por KPI
    const kpiSpecificDrivers = this.getKPISpecificDrivers(kpi, allLikes);
    
    return [...new Set(kpiSpecificDrivers)].slice(0, 4);
  }

  private getKPISpecificDrivers(kpi: string, likes: string[]): string[] {
    const kpiKeywords = this.getKPIKeywords(kpi);
    
    return likes.filter(like => 
      kpiKeywords.some(keyword => 
        like.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  private extractBarriersFromFeedback(lowScoreEvals: ConceptEvaluation[], kpi: string, concept: ProductConcept): string[] {
    const allConcerns = lowScoreEvals.flatMap(evaluation => evaluation.qualitative_feedback.concerns);
    
    // Barriers específicos por KPI y concepto
    const kpiSpecificBarriers = this.getKPISpecificBarriers(kpi, allConcerns, concept);
    
    return [...new Set(kpiSpecificBarriers)].slice(0, 4);
  }

  private getKPIKeywords(kpi: string): string[] {
    const keywordMap: Record<string, string[]> = {
      appeal: ['atractivo', 'interesante', 'llamativo', 'gustó'],
      relevance: ['necesito', 'útil', 'relevante', 'importante'],
      believability: ['creíble', 'confiable', 'verdadero', 'posible'],
      uniqueness: ['único', 'diferente', 'innovador', 'nuevo'],
      purchase_intention: ['comprar', 'adquirir', 'probar', 'interés']
    };
    
    return keywordMap[kpi] || [];
  }

  private getKPISpecificBarriers(kpi: string, concerns: string[], concept: ProductConcept): string[] {
    const barrierMap: Record<string, string[]> = {
      appeal: ['no me gusta', 'aburrido', 'poco atractivo'],
      relevance: ['no necesito', 'irrelevante', 'no me sirve'],
      believability: ['no creo', 'dudoso', 'falso', 'imposible'],
      uniqueness: ['igual que otros', 'común', 'ya existe'],
      purchase_intention: ['muy caro', 'no compraría', 'precio alto']
    };
    
    const kpiBarriers = barrierMap[kpi] || [];
    
    return concerns.filter(concern => 
      kpiBarriers.some(barrier => 
        concern.toLowerCase().includes(barrier.toLowerCase())
      )
    );
  }

  private determineTrend(score: number): 'positive' | 'negative' | 'neutral' {
    if (score >= 7) return 'positive';
    if (score <= 4) return 'negative';
    return 'neutral';
  }

  private calculateOverallPerformance(evaluations: ConceptEvaluation[], conceptId: string) {
    const avgScores = {
      appeal: this.calculateAverageScore(evaluations, 'appeal'),
      relevance: this.calculateAverageScore(evaluations, 'relevance'),
      believability: this.calculateAverageScore(evaluations, 'believability'),
      uniqueness: this.calculateAverageScore(evaluations, 'uniqueness'),
      purchase_intention: this.calculateAverageScore(evaluations, 'purchase_intention')
    };

    const overallScore = Object.values(avgScores).reduce((sum, score) => sum + score, 0) / 5;

    return {
      score: Math.round(overallScore * 10) / 10,
      ranking: 1, // This would be calculated relative to other concepts
      strengths: this.identifyStrengths(avgScores),
      weaknesses: this.identifyWeaknesses(avgScores)
    };
  }

  private identifyStrengths(scores: Record<string, number>): string[] {
    return Object.entries(scores)
      .filter(([, score]) => score >= 7)
      .map(([kpi]) => this.translateKPI(kpi))
      .slice(0, 3);
  }

  private identifyWeaknesses(scores: Record<string, number>): string[] {
    return Object.entries(scores)
      .filter(([, score]) => score <= 4)
      .map(([kpi]) => this.translateKPI(kpi))
      .slice(0, 3);
  }

  private translateKPI(kpi: string): string {
    const translations: Record<string, string> = {
      appeal: 'Atractivo',
      relevance: 'Relevancia',
      believability: 'Credibilidad',
      uniqueness: 'Diferenciación',
      purchase_intention: 'Intención de Compra'
    };
    return translations[kpi] || kpi;
  }

  private assessMarketOpportunity(evaluations: ConceptEvaluation[], concept: ProductConcept) {
    const purchaseIntention = this.calculateAverageScore(evaluations, 'purchase_intention');
    const uniqueness = this.calculateAverageScore(evaluations, 'uniqueness');
    const relevance = this.calculateAverageScore(evaluations, 'relevance');

    return {
      size: purchaseIntention >= 7 ? 'high' : purchaseIntention >= 5 ? 'medium' : 'low' as const,
      readiness: this.assessReadiness(evaluations),
      competitiveAdvantage: this.identifyCompetitiveAdvantages(uniqueness, evaluations),
      marketBarriers: this.identifyMarketBarriers(evaluations)
    };
  }

  private assessReadiness(evaluations: ConceptEvaluation[]): 'ready' | 'needs-development' | 'not-ready' {
    const believability = this.calculateAverageScore(evaluations, 'believability');
    const relevance = this.calculateAverageScore(evaluations, 'relevance');
    
    const avgReadiness = (believability + relevance) / 2;
    
    if (avgReadiness >= 7) return 'ready';
    if (avgReadiness >= 5) return 'needs-development';
    return 'not-ready';
  }

  private identifyCompetitiveAdvantages(uniqueness: number, evaluations: ConceptEvaluation[]): string[] {
    if (uniqueness >= 6) {
      return evaluations
        .flatMap(evaluation => evaluation.qualitative_feedback.likes)
        .filter(like => like.toLowerCase().includes('único') || like.toLowerCase().includes('diferente'))
        .slice(0, 3);
    }
    return ['Necesita mayor diferenciación'];
  }

  private identifyMarketBarriers(evaluations: ConceptEvaluation[]): string[] {
    return evaluations
      .flatMap(evaluation => evaluation.qualitative_feedback.concerns)
      .slice(0, 4);
  }

  private generateBusinessImplications(
    kpi: keyof ConceptEvaluation['scores'], 
    score: number, 
    drivers: string[], 
    barriers: string[]
  ): string[] {
    const implications = [];

    if (score >= 7) {
      implications.push(`Fortaleza clave: ${this.translateKPI(kpi)} muestra alto potencial`);
      implications.push('Oportunidad para capitalizar en comunicación y marketing');
    } else if (score <= 4) {
      implications.push(`Área de mejora crítica: ${this.translateKPI(kpi)} requiere atención inmediata`);
      implications.push('Riesgo de bajo desempeño si no se aborda');
    }

    if (barriers.length > 0) {
      implications.push(`Principales barreras identificadas requieren estrategia específica`);
    }

    return implications;
  }

  private generateKPIRecommendations(
    kpi: keyof ConceptEvaluation['scores'], 
    score: number, 
    drivers: string[], 
    barriers: string[], 
    concept: ProductConcept
  ): string[] {
    const recommendations = [];

    if (score >= 7) {
      recommendations.push(`Amplificar comunicación sobre los aspectos más valorados`);
      recommendations.push(`Utilizar como ventaja diferencial en estrategia de marketing`);
    } else if (score <= 4) {
      recommendations.push(`Reformular el concepto para abordar las principales preocupaciones`);
      recommendations.push(`Considerar ajustes en formulación o beneficios comunicados`);
    }

    // Recomendaciones específicas por KPI
    const specificRecs = this.getKPISpecificRecommendations(kpi, score, barriers);
    recommendations.push(...specificRecs);

    return recommendations;
  }

  private getKPISpecificRecommendations(
    kpi: keyof ConceptEvaluation['scores'], 
    score: number, 
    barriers: string[]
  ): string[] {
    const recommendations: Record<string, string[]> = {
      appeal: score <= 4 ? [
        'Mejorar presentación visual del concepto',
        'Evaluar cambios en el naming o messaging'
      ] : [
        'Mantener elementos de diseño más atractivos'
      ],
      relevance: score <= 4 ? [
        'Clarificar beneficios funcionales clave',
        'Conectar mejor con necesidades del consumidor'
      ] : [
        'Potenciar comunicación de relevancia personal'
      ],
      believability: score <= 4 ? [
        'Proporcionar mayor evidencia científica',
        'Simplificar claims para mayor credibilidad'
      ] : [
        'Aprovechar credibilidad como ventaja competitiva'
      ],
      uniqueness: score <= 4 ? [
        'Desarrollar mayor diferenciación vs competencia',
        'Identificar elementos únicos no comunicados'
      ] : [
        'Proteger y potenciar elementos diferenciadores'
      ],
      purchase_intention: score <= 4 ? [
        'Revisar estrategia de precio',
        'Mejorar propuesta de valor general'
      ] : [
        'Optimizar conversión con estrategia de lanzamiento'
      ]
    };

    return recommendations[kpi] || [];
  }

  private generateStrategicRecommendations(evaluations: ConceptEvaluation[], concept: ProductConcept): string[] {
    const overallScore = this.calculateOverallScore(evaluations);
    const recommendations = [];

    if (overallScore >= 7) {
      recommendations.push('ACELERAR: Concepto con alto potencial, proceder con desarrollo');
      recommendations.push('Enfocar en optimización de detalles y preparación para mercado');
    } else if (overallScore >= 5) {
      recommendations.push('DESARROLLAR: Concepto prometedor que requiere mejoras específicas');
      recommendations.push('Implementar cambios basados en feedback antes del siguiente gate');
    } else {
      recommendations.push('PIVOTAR: Considerar cambios fundamentales o redirección del concepto');
      recommendations.push('Evaluar si vale la pena continuar con la inversión actual');
    }

    return recommendations;
  }

  private calculateOverallScore(evaluations: ConceptEvaluation[]): number {
    const kpis: (keyof ConceptEvaluation['scores'])[] = ['appeal', 'relevance', 'believability', 'uniqueness', 'purchase_intention'];
    const totalScore = kpis.reduce((sum, kpi) => sum + this.calculateAverageScore(evaluations, kpi), 0);
    return totalScore / kpis.length;
  }
}