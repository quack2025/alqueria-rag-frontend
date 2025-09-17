/**
 * InnovationLabContainer.tsx - Universal Innovation Lab System
 * 
 * Features:
 * - Concept creation, editing, and evaluation
 * - Synthetic persona management with 80+ variables
 * - Qualitative evaluation system for "bouncing ideas"
 * - Complete CRUD operations with localStorage persistence
 * - Universal system for any brand/category
 */

import React, { useState } from 'react';
import { 
  Lightbulb, Users, Plus, Edit3, TrendingUp, MessageSquare,
  Settings, Upload, Download, Trash2, ChevronRight, FileText, Sparkles
} from 'lucide-react';
import ConceptEditor from './ConceptEditor';
import PersonaEditor from './PersonaEditor';
import SyntheticUsersReportGenerator from '../Reports/SyntheticUsersReportGenerator';
import ConversationalReportGenerator from '../Reports/ConversationalReportGenerator';
import { generateCompleteEvaluation, type ConversationalEvaluation } from '../../services/claudeEvaluationService';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { DEFAULT_EVALUATION_SETTINGS, type EvaluationSettings } from '../../services/llmEvaluationService';
import { evaluateConceptByType, EvaluationType as EvalType, EVALUATION_TYPES } from '../../services/evaluationTypesService';
import { evolvePersonaFromEvaluation, getPersonaLearningProgress } from '../../services/personaEvolutionService';

// ===== TYPE DEFINITIONS =====

/** Core concept structure for any brand/category */
export interface Concept {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  benefits: string[];
  ingredients?: string[];
  price?: number;
  targetAudience: string;
  differentiation: string;
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/** Variable definition for synthetic personas (80+ variables) */
export interface PersonaVariable {
  category: string;
  key: string;
  value: any;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'range';
  options?: string[];
  min?: number;
  max?: number;
}

/** Complete synthetic persona with full customization */
export interface SyntheticPersona {
  id: string;
  name: string;
  archetype: string;
  avatar?: string;
  variables: PersonaVariable[];
  baseProfile: {
    age: number;
    gender: string;
    location: string;
    socioeconomicLevel: string;
    occupation: string;
  };
  psychographics: Record<string, any>;
  behaviors: Record<string, any>;
  brandRelationships: Record<string, any>;
  customData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/** Qualitative evaluation result structure */
export interface EvaluationResult {
  conceptId: string;
  personaId: string;
  aspects: {
    [aspect: string]: {
      positives: string[];
      negatives: string[];
      recommendations: string[];
      score?: number;
    };
  };
  overallAcceptance: 'alta' | 'media' | 'baja';
  quote: string;
  keyDrivers: string[];
  suggestions: string[];
  // Optional topic analysis data (for SyntheticUsers-style evaluations)
  topicAnalysis?: {
    executiveSummary: string;
    topicInsights: any[];
    surprisingInsight: any;
    detailedAnalysis: any;
  };
}

type TabMode = 'evaluate' | 'concepts' | 'personas' | 'history';
type EvaluationMode = 'llm' | 'rule_based' | 'multi_agent' | 'rag_enhanced' | 'multi_agent_rag';

const InnovationLabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabMode>('evaluate');
  const [concepts, setConcepts] = useLocalStorage<Concept[]>('innovation-lab-concepts', getDefaultConcepts());
  const [personas, setPersonas] = useLocalStorage<SyntheticPersona[]>('innovation-lab-personas', getDefaultPersonas());
  const [evaluations, setEvaluations] = useLocalStorage<EvaluationResult[]>('innovation-lab-evaluations', []);
  
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult[]>([]);
  
  // Advanced evaluation configuration
  const [evaluationMode, setEvaluationMode] = useState<EvaluationMode>('multi_agent_rag');
  const [evaluationType, setEvaluationType] = useState<EvalType>(EvalType.QUALITATIVE_ANALYSIS);
  const [evaluationSettings, setEvaluationSettings] = useState<EvaluationSettings>(DEFAULT_EVALUATION_SETTINGS);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [enablePersonaEvolution, setEnablePersonaEvolution] = useState(true);
  const [evolutionSummaries, setEvolutionSummaries] = useState<string[]>([]);
  
  // Editor state
  const [showConceptEditor, setShowConceptEditor] = useState(false);
  const [showPersonaEditor, setShowPersonaEditor] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);
  const [editingPersona, setEditingPersona] = useState<SyntheticPersona | null>(null);
  
  // Report generator state
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showConversationalReport, setShowConversationalReport] = useState(false);
  
  // Conversational evaluation state
  const [conversationalEvaluations, setConversationalEvaluations] = useState<ConversationalEvaluation[]>([]);
  const [isConversationalMode, setIsConversationalMode] = useState(true);

  // ===== DEFAULT DATA =====

  /** Generate complete 80+ variable set for any persona */
  function generateCompleteVariables(archetype: string, baseProfile: SyntheticPersona['baseProfile']): PersonaVariable[] {
    const VARIABLE_CATEGORIES = {
      'Demografía Básica': [
        { key: 'edad', label: 'Edad', type: 'number', min: 18, max: 75 },
        { key: 'genero', label: 'Género', type: 'select', options: ['Femenino', 'Masculino', 'Otro'] },
        { key: 'estado_civil', label: 'Estado Civil', type: 'select', options: ['Soltero/a', 'Casado/a', 'Unión Libre', 'Separado/a', 'Viudo/a'] },
        { key: 'hijos', label: 'Número de Hijos', type: 'number', min: 0, max: 10 },
        { key: 'educacion', label: 'Nivel Educativo', type: 'select', options: ['Primaria', 'Bachillerato', 'Técnico', 'Universitario', 'Postgrado'] },
        { key: 'ocupacion', label: 'Ocupación', type: 'text' },
        { key: 'ingreso_mensual', label: 'Ingreso Mensual (COP)', type: 'number', min: 500000, max: 20000000 }
      ],
      'Ubicación y Geografía': [
        { key: 'ciudad', label: 'Ciudad', type: 'text' },
        { key: 'departamento', label: 'Departamento', type: 'text' },
        { key: 'region', label: 'Región', type: 'select', options: ['Costa Caribe', 'Andina', 'Pacífica', 'Orinoquía', 'Amazonía'] },
        { key: 'estrato', label: 'Estrato Socioeconómico', type: 'select', options: ['1', '2', '3', '4', '5', '6'] },
        { key: 'tipo_vivienda', label: 'Tipo de Vivienda', type: 'select', options: ['Casa propia', 'Casa arrendada', 'Apartamento propio', 'Apartamento arrendado', 'Otro'] },
        { key: 'clima', label: 'Clima Local', type: 'select', options: ['Cálido', 'Templado', 'Frío', 'Húmedo', 'Seco'] }
      ],
      'Psicografía y Personalidad': [
        { key: 'extroversion', label: 'Extroversión', type: 'range', min: 1, max: 10 },
        { key: 'apertura', label: 'Apertura al Cambio', type: 'range', min: 1, max: 10 },
        { key: 'responsabilidad', label: 'Responsabilidad', type: 'range', min: 1, max: 10 },
        { key: 'amabilidad', label: 'Amabilidad', type: 'range', min: 1, max: 10 },
        { key: 'neuroticismo', label: 'Estabilidad Emocional', type: 'range', min: 1, max: 10 },
        { key: 'tradicionalismo', label: 'Valores Tradicionales', type: 'range', min: 1, max: 10 },
        { key: 'innovacion', label: 'Adopción de Innovaciones', type: 'range', min: 1, max: 10 },
        { key: 'materialismo', label: 'Orientación Materialista', type: 'range', min: 1, max: 10 }
      ],
      'Comportamiento de Compra': [
        { key: 'sensibilidad_precio', label: 'Sensibilidad al Precio', type: 'range', min: 1, max: 10 },
        { key: 'lealtad_marca', label: 'Lealtad a Marcas', type: 'range', min: 1, max: 10 },
        { key: 'frecuencia_compra', label: 'Frecuencia de Compra', type: 'select', options: ['Diaria', 'Semanal', 'Quincenal', 'Mensual', 'Ocasional'] },
        { key: 'canal_principal', label: 'Canal de Compra Principal', type: 'select', options: ['Supermercado', 'Tienda de barrio', 'Online', 'Mayorista', 'Farmacia'] },
        { key: 'influencia_promociones', label: 'Influencia de Promociones', type: 'range', min: 1, max: 10 },
        { key: 'compra_impulsiva', label: 'Tendencia a Compra Impulsiva', type: 'range', min: 1, max: 10 },
        { key: 'presupuesto_belleza', label: 'Presupuesto Mensual Belleza (COP)', type: 'number', min: 10000, max: 500000 }
      ],
      'Hábitos Digitales': [
        { key: 'uso_redes_sociales', label: 'Uso de Redes Sociales', type: 'multiselect', options: ['Facebook', 'Instagram', 'TikTok', 'Twitter', 'YouTube', 'WhatsApp'] },
        { key: 'tiempo_redes_diario', label: 'Tiempo en Redes (horas/día)', type: 'range', min: 0, max: 12 },
        { key: 'influencia_influencers', label: 'Influencia de Influencers', type: 'range', min: 1, max: 10 },
        { key: 'busqueda_online', label: 'Búsqueda de Info Online', type: 'range', min: 1, max: 10 },
        { key: 'compra_online', label: 'Frecuencia Compra Online', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Frecuente', 'Siempre'] }
      ],
      'Cuidado Personal': [
        { key: 'rutina_belleza_complejidad', label: 'Complejidad Rutina Belleza', type: 'select', options: ['Básica', 'Intermedia', 'Compleja', 'Profesional'] },
        { key: 'tiempo_rutina_minutos', label: 'Tiempo Rutina Diaria (min)', type: 'number', min: 5, max: 120 },
        { key: 'productos_naturales', label: 'Preferencia Productos Naturales', type: 'range', min: 1, max: 10 },
        { key: 'ingredientes_premium', label: 'Interés Ingredientes Premium', type: 'range', min: 1, max: 10 },
        { key: 'conciencia_ingredientes', label: 'Conciencia sobre Ingredientes', type: 'range', min: 1, max: 10 }
      ],
      'Cuidado Capilar Específico': [
        { key: 'tipo_cabello', label: 'Tipo de Cabello', type: 'select', options: ['Graso', 'Seco', 'Mixto', 'Normal', 'Sensible'] },
        { key: 'textura_cabello', label: 'Textura', type: 'select', options: ['Liso', 'Ondulado', 'Rizado', 'Crespo'] },
        { key: 'problema_principal', label: 'Problema Principal', type: 'select', options: ['Caída', 'Caspa', 'Frizz', 'Falta de brillo', 'Resequedad', 'Grasa'] },
        { key: 'frecuencia_lavado', label: 'Frecuencia de Lavado', type: 'select', options: ['Diario', 'Inter-diario', '2-3 veces/semana', 'Semanal'] },
        { key: 'tratamientos_uso', label: 'Usa Tratamientos', type: 'boolean' },
        { key: 'coloracion', label: 'Cabello Teñido/Con Color', type: 'boolean' },
        { key: 'herramientas_calor', label: 'Uso de Herramientas de Calor', type: 'select', options: ['Nunca', 'Rara vez', 'Semanal', 'Frecuente', 'Diario'] }
      ],
      'Relación con Marcas': [
        { key: 'marcas_confianza', label: 'Marcas de Confianza', type: 'multiselect', options: ['Savital', 'Dove', 'Pantene', 'Head & Shoulders', 'L\'Oréal', 'Sedal', 'Herbal Essences'] },
        { key: 'disposicion_cambio', label: 'Disposición a Cambiar Marcas', type: 'range', min: 1, max: 10 },
        { key: 'factor_cambio', label: 'Factor Principal para Cambiar', type: 'select', options: ['Precio', 'Resultados', 'Recomendación', 'Promoción', 'Curiosidad'] },
        { key: 'influencia_familia', label: 'Influencia de la Familia', type: 'range', min: 1, max: 10 },
        { key: 'influencia_amigos', label: 'Influencia de Amigos', type: 'range', min: 1, max: 10 }
      ],
      'Comunicación y Lenguaje': [
        { key: 'nivel_formalidad', label: 'Nivel de Formalidad', type: 'select', options: ['Muy informal', 'Informal', 'Neutral', 'Formal', 'Muy formal'] },
        { key: 'expresiones_regionales', label: 'Expresiones Regionales', type: 'multiselect', options: ['¡Qué chimba!', 'Ave María', 'Uy, qué pena', '¡Qué bacano!', 'Parcero/a'] },
        { key: 'temas_interes', label: 'Temas de Interés', type: 'multiselect', options: ['Familia', 'Trabajo', 'Belleza', 'Salud', 'Entretenimiento', 'Moda', 'Cocina'] },
        { key: 'estilo_comunicacion', label: 'Estilo de Comunicación', type: 'select', options: ['Directo', 'Indirecto', 'Emocional', 'Racional', 'Mixto'] }
      ]
    } as const;

    const variables: PersonaVariable[] = [];

    // Valores específicos por arquetipo para personalización
    const archetypeDefaults: Record<string, Record<string, any>> = {
      'Costeña Emprendedora': {
        extroversion: 8, sensibilidad_precio: 7, lealtad_marca: 6, 
        uso_redes_sociales: ['Facebook', 'Instagram'], region: 'Costa Caribe',
        expresiones_regionales: ['¡Qué chimba!', '¡Qué bacano!'], hijos: 2
      },
      'Bogotana Profesional': {
        extroversion: 6, sensibilidad_precio: 4, lealtad_marca: 5,
        uso_redes_sociales: ['Instagram', 'LinkedIn'], region: 'Andina',
        expresiones_regionales: ['¡Qué bacano!'], hijos: 0
      },
      'Paisa Tradicional': {
        extroversion: 5, sensibilidad_precio: 8, lealtad_marca: 9,
        tradicionalismo: 8, uso_redes_sociales: ['Facebook'], region: 'Andina',
        expresiones_regionales: ['Ave María', 'Uy, qué pena'], hijos: 3
      },
      'Madre Moderna Profesional': {
        extroversion: 6, sensibilidad_precio: 5, lealtad_marca: 7,
        uso_redes_sociales: ['Instagram', 'WhatsApp'], region: 'Andina', 
        expresiones_regionales: ['¡Qué bacano!'], hijos: 2
      }
    };

    Object.entries(VARIABLE_CATEGORIES).forEach(([category, categoryVars]) => {
      categoryVars.forEach(varDef => {
        let defaultValue: any;
        const archetypeValue = archetypeDefaults[archetype]?.[varDef.key];

        if (archetypeValue !== undefined) {
          defaultValue = archetypeValue;
        } else {
          // Generar valor por defecto según tipo
          switch (varDef.type) {
            case 'number':
              if (varDef.key === 'edad') {
                defaultValue = baseProfile.age;
              } else if (varDef.key === 'ingreso_mensual') {
                const nseValues = { 'A': 8000000, 'B+': 5000000, 'B': 3500000, 'C+': 2500000, 'C': 1800000, 'D': 1200000 };
                defaultValue = nseValues[baseProfile.socioeconomicLevel as keyof typeof nseValues] || 2000000;
              } else {
                defaultValue = varDef.min || 0;
              }
              break;
            case 'range':
              defaultValue = Math.floor(((varDef.max || 10) + (varDef.min || 1)) / 2);
              break;
            case 'boolean':
              defaultValue = false;
              break;
            case 'select':
              if (varDef.key === 'genero') {
                defaultValue = baseProfile.gender;
              } else if (varDef.key === 'educacion') {
                const education = { 'A': 'Postgrado', 'B+': 'Universitario', 'B': 'Universitario', 'C+': 'Técnico', 'C': 'Bachillerato', 'D': 'Primaria' };
                defaultValue = education[baseProfile.socioeconomicLevel as keyof typeof education] || 'Bachillerato';
              } else {
                defaultValue = varDef.options?.[0] || '';
              }
              break;
            case 'multiselect':
              defaultValue = [];
              break;
            case 'text':
              if (varDef.key === 'ocupacion') {
                defaultValue = baseProfile.occupation;
              } else if (varDef.key === 'ciudad') {
                defaultValue = baseProfile.location.split(',')[0];
              } else {
                defaultValue = '';
              }
              break;
            default:
              defaultValue = '';
          }
        }

        variables.push({
          category,
          key: varDef.key,
          value: defaultValue,
          type: varDef.type as any,
          options: varDef.options,
          min: varDef.min,
          max: varDef.max
        });
      });
    });

    return variables;
  }
  
  /** Sample concepts for initial demo */
  function getDefaultConcepts(): Concept[] {
    return [
      {
        id: '1',
        name: 'Savital Control Caída desde la Raíz',
        category: 'Cuidado Capilar',
        brand: 'Savital',
        description: 'Tecnología clínicamente comprobada con sábila y péptidos',
        benefits: ['Reduce caída', 'Fortalece desde la raíz', 'Nutrición profunda'],
        ingredients: ['Sábila', 'Péptidos', 'Vitaminas'],
        targetAudience: 'Personas con problemas de caída capilar',
        differentiation: 'Única con péptidos y tecnología clínica',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  /** Sample personas with Colombian archetypes */
  function getDefaultPersonas(): SyntheticPersona[] {
    return [
      {
        id: '1',
        name: 'María José Martínez',
        archetype: 'Costeña Emprendedora',
        baseProfile: {
          age: 32,
          gender: 'Femenino',
          location: 'Barranquilla, Colombia',
          socioeconomicLevel: 'C+',
          occupation: 'Dueña de tienda de belleza'
        },
        variables: generateCompleteVariables('Costeña Emprendedora', {
          age: 32,
          gender: 'Femenino',
          location: 'Barranquilla, Colombia',
          socioeconomicLevel: 'C+',
          occupation: 'Dueña de tienda de belleza'
        }),
        psychographics: {
          valores: ['Familia', 'Emprendimiento', 'Belleza'],
          personalidad: { extroversion: 8, apertura: 7, responsabilidad: 9 }
        },
        behaviors: {
          compra: { canal_principal: 'Tienda barrio', frecuencia: 'Semanal' },
          uso_productos: { shampoo: 'Diario', tratamientos: 'Semanal' }
        },
        brandRelationships: {
          savital: { uso: 'Regular', percepcion: 'Económico y efectivo' },
          competencia: ['Sedal', 'Head & Shoulders']
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Andrea Carolina Rodríguez',
        archetype: 'Bogotana Profesional',
        baseProfile: {
          age: 28,
          gender: 'Femenino',
          location: 'Bogotá, Colombia',
          socioeconomicLevel: 'B+',
          occupation: 'Gerente de Marketing'
        },
        variables: generateCompleteVariables('Bogotana Profesional', {
          age: 28,
          gender: 'Femenino',
          location: 'Bogotá, Colombia',
          socioeconomicLevel: 'B+',
          occupation: 'Gerente de Marketing'
        }),
        psychographics: {
          valores: ['Profesionalismo', 'Innovación', 'Calidad'],
          personalidad: { extroversion: 6, apertura: 9, responsabilidad: 9 }
        },
        behaviors: {
          compra: { canal_principal: 'Supermercado premium', frecuencia: 'Mensual' },
          uso_productos: { shampoo: 'Diario', tratamientos: 'Bisemanal' }
        },
        brandRelationships: {
          savital: { uso: 'Ocasional', percepcion: 'Opción práctica' },
          competencia: ['Dove', 'L\'Oréal', 'Kerastase']
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // ===== NUEVO PERFIL 1: JOVEN UNIVERSITARIO GEN-Z =====
      {
        id: '5',
        name: 'Santiago Morales',
        archetype: 'Joven Universitario GenZ',
        baseProfile: {
          age: 21,
          gender: 'Masculino',
          location: 'Bucaramanga, Santander',
          socioeconomicLevel: 'C',
          occupation: 'Estudiante de Ingeniería + Trabajo Medio Tiempo'
        },
        variables: [
          // Demografía
          { category: 'Demografía', key: 'edad', value: 21, type: 'number' },
          { category: 'Demografía', key: 'ingreso_mensual', value: 800000, type: 'number' },
          { category: 'Demografía', key: 'estrato', value: 3, type: 'number' },
          { category: 'Demografía', key: 'nivel_educativo', value: 'Universitario en curso', type: 'text' },
          { category: 'Demografía', key: 'estado_civil', value: 'Soltero', type: 'text' },
          { category: 'Demografía', key: 'dependientes', value: 0, type: 'number' },
          
          // Geografía y Cultura
          { category: 'Ubicación', key: 'region', value: 'Andina Oriental', type: 'text' },
          { category: 'Ubicación', key: 'clima', value: 'Cálido seco', type: 'text' },
          { category: 'Ubicación', key: 'tipo_vivienda', value: 'Apartamento compartido', type: 'text' },
          { category: 'Cultural', key: 'dialecto', value: 'Santandereano', type: 'text' },
          { category: 'Cultural', key: 'expresiones', value: 'Qué chimba, Parce, Está buenísimo', type: 'text' },
          
          // Comportamiento FMCG
          { category: 'Comportamiento', key: 'frecuencia_compra_cuidado', value: 'Quincenal', type: 'select', options: ['Semanal', 'Quincenal', 'Mensual'] },
          { category: 'Comportamiento', key: 'canal_compra_principal', value: 'Tienda de barrio', type: 'select', options: ['Tienda barrio', 'Supermercado', 'Farmacia', 'Online'] },
          { category: 'Comportamiento', key: 'momento_compra', value: 'Cuando se acaba', type: 'text' },
          { category: 'Comportamiento', key: 'influencia_compra', value: 'Precio y recomendación de amigos', type: 'text' },
          { category: 'Comportamiento', key: 'sensibilidad_precio', value: 9, type: 'range', min: 1, max: 10 },
          { category: 'Comportamiento', key: 'lealtad_marca', value: 3, type: 'range', min: 1, max: 10 },
          { category: 'Comportamiento', key: 'apertura_innovacion', value: 8, type: 'range', min: 1, max: 10 },
          
          // Digital y Social Media
          { category: 'Digital', key: 'uso_redes_sociales', value: 'Intensivo', type: 'select', options: ['Bajo', 'Medio', 'Alto', 'Intensivo'] },
          { category: 'Digital', key: 'plataforma_principal', value: 'TikTok e Instagram', type: 'text' },
          { category: 'Digital', key: 'influencers_seguidos', value: 'Gaming y lifestyle masculino', type: 'text' },
          { category: 'Digital', key: 'compra_online', value: 'Ocasional', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Frecuente'] },
          
          // Personalidad Big 5
          { category: 'Personalidad', key: 'extroversion', value: 7, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'apertura', value: 9, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'responsabilidad', value: 6, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'amabilidad', value: 8, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'neuroticismo', value: 4, type: 'range', min: 1, max: 10 },
          
          // Marcas Unilever - Relación específica
          { category: 'Marcas', key: 'dove_uso', value: 'Rara vez', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'dove_percepcion', value: 'Para mujeres', type: 'text' },
          { category: 'Marcas', key: 'axe_uso', value: 'Frecuente', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'axe_percepcion', value: 'Mi marca de desodorante', type: 'text' },
          { category: 'Marcas', key: 'rexona_uso', value: 'Ocasional', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'savital_uso', value: 'Regular', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'savital_percepcion', value: 'Buena relación precio-calidad', type: 'text' },
          { category: 'Marcas', key: 'fruco_uso', value: 'Regular', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'fruco_percepcion', value: 'Clásica para comida', type: 'text' }
        ],
        psychographics: {
          valores: ['Amistad', 'Tecnología', 'Diversión', 'Ahorro', 'Autenticidad'],
          personalidad: { extroversion: 7, apertura: 9, responsabilidad: 6 },
          motivaciones: ['Pertenencia social', 'Experiencias nuevas', 'Eficiencia económica'],
          preocupaciones: ['Dinero limitado', 'Futuro laboral', 'Apariencia física']
        },
        behaviors: {
          compra: { canal_principal: 'Tienda de barrio', frecuencia: 'Cuando se necesita', decision_factor: 'Precio' },
          uso_productos: { shampoo: '3 veces por semana', desodorante: 'Diario', gel: 'Ocasional' },
          comunicacion: { estilo: 'Informal y directo', expresiones: ['Qué chimba', 'Está buenísimo', 'Parce'] }
        },
        brandRelationships: {
          axe: { uso: 'Frecuente', percepcion: 'Mi marca', conexion_emocional: 8 },
          savital: { uso: 'Regular', percepcion: 'Buena opción', conexion_emocional: 6 },
          dove: { uso: 'Rara vez', percepcion: 'Para mujeres', conexion_emocional: 2 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // ===== NUEVO PERFIL 2: PROFESIONAL MASCULINO DEL PACÍFICO =====
      {
        id: '6', 
        name: 'Carlos Andrés Valencia',
        archetype: 'Profesional Masculino Caleño',
        baseProfile: {
          age: 35,
          gender: 'Masculino',
          location: 'Cali, Valle del Cauca',
          socioeconomicLevel: 'B',
          occupation: 'Ingeniero Comercial'
        },
        variables: [
          // Demografía
          { category: 'Demografía', key: 'edad', value: 35, type: 'number' },
          { category: 'Demografía', key: 'ingreso_mensual', value: 4200000, type: 'number' },
          { category: 'Demografía', key: 'estrato', value: 4, type: 'number' },
          { category: 'Demografía', key: 'nivel_educativo', value: 'Profesional', type: 'text' },
          { category: 'Demografía', key: 'estado_civil', value: 'Casado', type: 'text' },
          { category: 'Demografía', key: 'dependientes', value: 2, type: 'number' },
          
          // Geografía y Cultura
          { category: 'Ubicación', key: 'region', value: 'Pacífico', type: 'text' },
          { category: 'Ubicación', key: 'clima', value: 'Cálido húmedo', type: 'text' },
          { category: 'Ubicación', key: 'tipo_vivienda', value: 'Casa propia', type: 'text' },
          { category: 'Cultural', key: 'dialecto', value: 'Valluno', type: 'text' },
          { category: 'Cultural', key: 'expresiones', value: 'Ey parce, Qué nota, Está chimba', type: 'text' },
          { category: 'Cultural', key: 'musica_preferida', value: 'Salsa y urbana', type: 'text' },
          
          // Comportamiento FMCG
          { category: 'Comportamiento', key: 'frecuencia_compra_cuidado', value: 'Mensual', type: 'select', options: ['Semanal', 'Quincenal', 'Mensual'] },
          { category: 'Comportamiento', key: 'canal_compra_principal', value: 'Supermercado', type: 'select', options: ['Tienda barrio', 'Supermercado', 'Farmacia', 'Online'] },
          { category: 'Comportamiento', key: 'momento_compra', value: 'Mercado familiar quincenal', type: 'text' },
          { category: 'Comportamiento', key: 'influencia_compra', value: 'Recomendación esposa y experiencia', type: 'text' },
          { category: 'Comportamiento', key: 'sensibilidad_precio', value: 5, type: 'range', min: 1, max: 10 },
          { category: 'Comportamiento', key: 'lealtad_marca', value: 7, type: 'range', min: 1, max: 10 },
          { category: 'Comportamiento', key: 'apertura_innovacion', value: 6, type: 'range', min: 1, max: 10 },
          { category: 'Comportamiento', key: 'cuidado_personal', value: 'Rutina establecida', type: 'text' },
          
          // Estilo de Vida
          { category: 'Estilo_Vida', key: 'rutina_ejercicio', value: 'Gimnasio 3 veces por semana', type: 'text' },
          { category: 'Estilo_Vida', key: 'actividad_social', value: 'Reuniones familiares y amigos', type: 'text' },
          { category: 'Estilo_Vida', key: 'tiempo_libre', value: 'Deportes y familia', type: 'text' },
          { category: 'Estilo_Vida', key: 'prioridades', value: 'Familia, trabajo, salud', type: 'text' },
          
          // Digital
          { category: 'Digital', key: 'uso_redes_sociales', value: 'Moderado', type: 'select', options: ['Bajo', 'Moderado', 'Alto', 'Intensivo'] },
          { category: 'Digital', key: 'plataforma_principal', value: 'Facebook e Instagram', type: 'text' },
          { category: 'Digital', key: 'compra_online', value: 'Ocasional', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Frecuente'] },
          
          // Personalidad Big 5
          { category: 'Personalidad', key: 'extroversion', value: 8, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'apertura', value: 6, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'responsabilidad', value: 8, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'amabilidad', value: 7, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'neuroticismo', value: 3, type: 'range', min: 1, max: 10 },
          
          // Marcas Unilever - Relación específica
          { category: 'Marcas', key: 'dove_uso', value: 'Ocasional', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'dove_percepcion', value: 'Calidad pero caro', type: 'text' },
          { category: 'Marcas', key: 'axe_uso', value: 'Regular', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'rexona_uso', value: 'Frecuente', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'rexona_percepcion', value: 'Confiable para el trabajo', type: 'text' },
          { category: 'Marcas', key: 'fruco_uso', value: 'Frecuente', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'fruco_percepcion', value: 'Indispensable en casa', type: 'text' },
          { category: 'Marcas', key: 'omo_uso', value: 'Regular', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular', 'Frecuente'] }
        ],
        psychographics: {
          valores: ['Familia', 'Trabajo', 'Salud', 'Tradición', 'Comodidad'],
          personalidad: { extroversion: 8, apertura: 6, responsabilidad: 8 },
          motivaciones: ['Proveer para familia', 'Mantener imagen profesional', 'Vida equilibrada'],
          preocupaciones: ['Estabilidad económica', 'Salud familiar', 'Tiempo limitado']
        },
        behaviors: {
          compra: { canal_principal: 'Supermercado grande', frecuencia: 'Mercado mensual familiar', decision_factor: 'Calidad y practicidad' },
          uso_productos: { shampoo: 'Diario', desodorante: 'Diario', gel: 'Ocasional', aftershave: 'Diario' },
          comunicacion: { estilo: 'Amigable y directo', expresiones: ['Ey parce', 'Qué nota', 'Está chimba'] }
        },
        brandRelationships: {
          rexona: { uso: 'Frecuente', percepcion: 'Confiable', conexion_emocional: 8 },
          fruco: { uso: 'Frecuente', percepcion: 'Tradicional', conexion_emocional: 7 },
          dove: { uso: 'Ocasional', percepcion: 'Premium', conexion_emocional: 5 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // ===== NUEVO PERFIL 3: MADRE SOLTERA ESTRATO MEDIO-BAJO =====
      {
        id: '7',
        name: 'Gloria Patricia Hernández',
        archetype: 'Madre Soltera Luchadora',
        baseProfile: {
          age: 38,
          gender: 'Femenino', 
          location: 'Ibagué, Tolima',
          socioeconomicLevel: 'C-',
          occupation: 'Auxiliar Administrativa + Ventas por Catálogo'
        },
        variables: [
          // Demografía
          { category: 'Demografía', key: 'edad', value: 38, type: 'number' },
          { category: 'Demografía', key: 'ingreso_mensual', value: 1800000, type: 'number' },
          { category: 'Demografía', key: 'estrato', value: 2, type: 'number' },
          { category: 'Demografía', key: 'nivel_educativo', value: 'Bachillerato + Técnico', type: 'text' },
          { category: 'Demografía', key: 'estado_civil', value: 'Soltera', type: 'text' },
          { category: 'Demografía', key: 'dependientes', value: 2, type: 'number' },
          { category: 'Demografía', key: 'edad_hijos', value: '12 y 15 años', type: 'text' },
          
          // Geografía y Cultura
          { category: 'Ubicación', key: 'region', value: 'Andina Central', type: 'text' },
          { category: 'Ubicación', key: 'clima', value: 'Cálido', type: 'text' },
          { category: 'Ubicación', key: 'tipo_vivienda', value: 'Apartamento arrendado', type: 'text' },
          { category: 'Cultural', key: 'dialecto', value: 'Tolimense', type: 'text' },
          { category: 'Cultural', key: 'expresiones', value: 'Mi amor, Ay no, Qué cosa tan linda', type: 'text' },
          
          // Comportamiento FMCG - Alta sensibilidad precio
          { category: 'Comportamiento', key: 'frecuencia_compra_cuidado', value: 'Quincenal o cuando hay oferta', type: 'text' },
          { category: 'Comportamiento', key: 'canal_compra_principal', value: 'Tienda de barrio y mayoristas', type: 'text' },
          { category: 'Comportamiento', key: 'momento_compra', value: 'Aprovecha promociones', type: 'text' },
          { category: 'Comportamiento', key: 'influencia_compra', value: 'Precio, rendimiento y necesidad hijos', type: 'text' },
          { category: 'Comportamiento', key: 'sensibilidad_precio', value: 10, type: 'range', min: 1, max: 10 },
          { category: 'Comportamiento', key: 'lealtad_marca', value: 4, type: 'range', min: 1, max: 10 },
          { category: 'Comportamiento', key: 'apertura_innovacion', value: 3, type: 'range', min: 1, max: 10 },
          { category: 'Comportamiento', key: 'busca_promociones', value: 'Siempre', type: 'select', options: ['Nunca', 'Rara vez', 'A veces', 'Frecuente', 'Siempre'] },
          
          // Prioridades Familiares
          { category: 'Familia', key: 'prioridad_gastos', value: 'Hijos primero, luego ella', type: 'text' },
          { category: 'Familia', key: 'productos_hijos', value: 'Shampoo, jabón, crema dental', type: 'text' },
          { category: 'Familia', key: 'tiempo_personal', value: 'Muy limitado', type: 'text' },
          { category: 'Familia', key: 'aspiraciones', value: 'Educación hijos y casa propia', type: 'text' },
          
          // Trabajo y Economía
          { category: 'Trabajo', key: 'horas_trabajo', value: '8 horas oficina + ventas tardes', type: 'text' },
          { category: 'Trabajo', key: 'ingreso_extra', value: 'Ventas por catálogo', type: 'text' },
          { category: 'Trabajo', key: 'presupuesto_personal', value: 150000, type: 'number' },
          { category: 'Trabajo', key: 'ahorro_mensual', value: 'Poco o nada', type: 'text' },
          
          // Digital (Limitado)
          { category: 'Digital', key: 'uso_redes_sociales', value: 'Básico', type: 'select', options: ['Bajo', 'Básico', 'Moderado', 'Alto'] },
          { category: 'Digital', key: 'plataforma_principal', value: 'WhatsApp y Facebook', type: 'text' },
          { category: 'Digital', key: 'compra_online', value: 'Nunca', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional'] },
          { category: 'Digital', key: 'acceso_internet', value: 'Celular con datos limitados', type: 'text' },
          
          // Personalidad Big 5
          { category: 'Personalidad', key: 'extroversion', value: 6, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'apertura', value: 4, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'responsabilidad', value: 9, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'amabilidad', value: 9, type: 'range', min: 1, max: 10 },
          { category: 'Personalidad', key: 'neuroticismo', value: 6, type: 'range', min: 1, max: 10 },
          
          // Marcas Unilever - Enfoque precio/rendimiento
          { category: 'Marcas', key: 'dove_uso', value: 'Rara vez', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular'] },
          { category: 'Marcas', key: 'dove_percepcion', value: 'Muy caro para mi presupuesto', type: 'text' },
          { category: 'Marcas', key: 'savital_uso', value: 'Ocasional', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular'] },
          { category: 'Marcas', key: 'savital_percepcion', value: 'Bueno cuando hay oferta', type: 'text' },
          { category: 'Marcas', key: 'fruco_uso', value: 'Regular', type: 'select', options: ['Rara vez', 'Ocasional', 'Regular', 'Frecuente'] },
          { category: 'Marcas', key: 'fruco_percepcion', value: 'Necesario para cocinar', type: 'text' },
          { category: 'Marcas', key: 'omo_uso', value: 'Ocasional', type: 'select', options: ['Nunca', 'Rara vez', 'Ocasional', 'Regular'] },
          { category: 'Marcas', key: 'omo_percepcion', value: 'Bueno pero caro', type: 'text' },
          { category: 'Marcas', key: 'marcas_economicas', value: 'Prefiere marcas más baratas', type: 'text' }
        ],
        psychographics: {
          valores: ['Familia', 'Sacrificio', 'Honestidad', 'Trabajo duro', 'Ahorro'],
          personalidad: { extroversion: 6, apertura: 4, responsabilidad: 9 },
          motivaciones: ['Bienestar de los hijos', 'Estabilidad económica', 'Progreso familiar'],
          preocupaciones: ['Dinero suficiente', 'Futuro hijos', 'Salud familiar', 'Gastos inesperados']
        },
        behaviors: {
          compra: { 
            canal_principal: 'Tienda de barrio y promociones mayorista', 
            frecuencia: 'Por necesidad y ofertas', 
            decision_factor: 'Precio y rendimiento'
          },
          uso_productos: { 
            shampoo: 'Cada 2-3 días para economizar', 
            jabon: 'Compra grandes para familia', 
            productos_hijos: 'Prioridad sobre los propios'
          },
          comunicacion: { 
            estilo: 'Cálida pero práctica', 
            expresiones: ['Mi amor', 'Ay no', 'Qué cosa tan linda', 'Está muy caro']
          }
        },
        brandRelationships: {
          fruco: { uso: 'Regular', percepcion: 'Necesario', conexion_emocional: 6 },
          savital: { uso: 'Ocasional', percepcion: 'Cuando hay oferta', conexion_emocional: 4 },
          dove: { uso: 'Rara vez', percepcion: 'Lujo que no puedo', conexion_emocional: 2 },
          marcas_economicas: { uso: 'Frecuente', percepcion: 'Lo que el bolsillo permite', conexion_emocional: 7 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // ===== NUEVO PERFIL 4: PAISA TRADICIONAL =====
      {
        id: '3',
        name: 'Luz Elena Restrepo',
        archetype: 'Paisa Tradicional',
        baseProfile: {
          age: 45,
          gender: 'Femenino',
          location: 'Medellín, Antioquia',
          socioeconomicLevel: 'B',
          occupation: 'Ama de casa dedicada'
        },
        variables: generateCompleteVariables('Paisa Tradicional', {
          age: 45,
          gender: 'Femenino',
          location: 'Medellín, Antioquia',
          socioeconomicLevel: 'B',
          occupation: 'Ama de casa dedicada'
        }),
        psychographics: {
          valores: ['Familia', 'Tradición', 'Confianza', 'Calidad probada', 'Estabilidad'],
          personalidad: { extroversion: 7, apertura: 3, responsabilidad: 10 }
        },
        behaviors: {
          compra: { canal_principal: 'Supermercado de confianza', frecuencia: 'Mensual religiosamente' },
          comunicacion: { estilo: 'Cálida y familiar', expresiones: ['Ave María', 'Qué pena', 'Mi niña'] }
        },
        brandRelationships: {
          omo: { uso: 'Frecuente', percepcion: 'Marca de confianza', conexion_emocional: 10 },
          fruco: { uso: 'Frecuente', percepcion: 'Tradición paisa', conexion_emocional: 9 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // ===== NUEVO PERFIL 5: MADRE MODERNA PROFESIONAL =====
      {
        id: '4',
        name: 'Andrea Jiménez',
        archetype: 'Madre Moderna Profesional',
        baseProfile: {
          age: 35,
          gender: 'Femenino',
          location: 'Bogotá, Colombia',
          socioeconomicLevel: 'B+',
          occupation: 'Gerente de Mercadeo con 2 hijos'
        },
        variables: generateCompleteVariables('Madre Moderna Profesional', {
          age: 35,
          gender: 'Femenino',
          location: 'Bogotá, Colombia',
          socioeconomicLevel: 'B+',
          occupation: 'Gerente de Mercadeo con 2 hijos'
        }),
        psychographics: {
          valores: ['Familia', 'Carrera', 'Eficiencia', 'Calidad', 'Innovación'],
          personalidad: { extroversion: 8, apertura: 9, responsabilidad: 9 }
        },
        behaviors: {
          compra: { canal_principal: 'Online + supermercado premium', frecuencia: 'Planificada y eficiente' },
          comunicacion: { estilo: 'Directa y eficiente', expresiones: ['Súper práctico', 'Me encanta que sea rápido'] }
        },
        brandRelationships: {
          dove: { uso: 'Frecuente', percepcion: 'Premium que vale la pena', conexion_emocional: 8 },
          cif: { uso: 'Frecuente', percepcion: 'Eficiencia doméstica', conexion_emocional: 7 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // ===== CORE EVALUATION LOGIC (REMOVED - Now handled in new implementation) =====


  // ===== CRUD HANDLERS =====
  
  /** Concept management handlers */
  const handleAddConcept = (concept: Concept) => {
    setConcepts([...concepts, { ...concept, id: Date.now().toString() }]);
    setShowConceptEditor(false);
  };

  const handleEditConcept = (concept: Concept) => {
    setConcepts(concepts.map(c => c.id === concept.id ? concept : c));
    setEditingConcept(null);
  };

  const handleDeleteConcept = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este concepto?')) {
      setConcepts(concepts.filter(c => c.id !== id));
    }
  };

  /** Persona management handlers */
  const handleAddPersona = (persona: SyntheticPersona) => {
    setPersonas([...personas, { ...persona, id: Date.now().toString() }]);
    setShowPersonaEditor(false);
  };

  const handleEditPersona = (persona: SyntheticPersona) => {
    setPersonas(personas.map(p => p.id === persona.id ? persona : p));
    setEditingPersona(null);
  };

  const handleDeletePersona = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta persona?')) {
      setPersonas(personas.filter(p => p.id !== id));
    }
  };

  /** Reset personas with complete 80+ variables */
  const handleResetPersonas = () => {
    if (confirm('¿Resetear todos los perfiles con las 80+ variables completas? Esto sobrescribirá los perfiles actuales.')) {
      localStorage.removeItem('innovation-lab-personas');
      setPersonas(getDefaultPersonas());
      alert('✅ Perfiles actualizados con 80+ variables cada uno!');
    }
  };

  /** Evaluate concept with selected personas */
  const evaluateConcept = async () => {
    if (!selectedConcept || selectedPersonas.length === 0) return;

    setIsEvaluating(true);
    setCurrentEvaluation([]);
    setConversationalEvaluations([]);

    try {
      const selectedPersonaObjects = personas.filter(p => selectedPersonas.includes(p.id));
      
      if (isConversationalMode) {
        // Modo conversacional avanzado con Railway Backend
        console.log('🚀 Iniciando evaluación conversacional con Railway...');
        
        const conversationalResults = await generateCompleteEvaluation(
          selectedConcept,
          selectedPersonaObjects,
          { 
            brand: selectedConcept.brand,
            category: selectedConcept.category,
            benefits: selectedConcept.benefits
          }
        );
        
        setConversationalEvaluations(conversationalResults);
        
        // Convertir a formato legacy para compatibilidad
        const legacyResults = conversationalResults.map(conv => ({
          personaId: conv.personaId,
          conceptId: conv.conceptId,
          overallAcceptance: conv.insights.purchaseIntent >= 7 ? 'alta' : 
                            conv.insights.purchaseIntent >= 4 ? 'media' : 'baja',
          quote: conv.insights.quotes[0] || 'Evaluación conversacional completa disponible',
          keyDrivers: conv.insights.keyThemes,
          suggestions: conv.insights.recommendations,
          aspects: {
            'Intención de Compra': {
              positives: [`${conv.insights.purchaseIntent}/10 puntos`],
              negatives: conv.insights.concerns,
              recommendations: [`Mejorar aspectos que preocupan al consumidor`]
            },
            'Conexión Emocional': {
              positives: [`Tono ${conv.insights.emotionalTone}`],
              negatives: [],
              recommendations: ['Reforzar elementos emocionales positivos']
            }
          }
        }));
        
        setCurrentEvaluation(legacyResults);
        
      } else {
        // Modo tradicional (legacy)
        const legacyResults = [];
        
        for (const persona of selectedPersonaObjects) {
          try {
            const result = await evaluateConceptByType(
              selectedConcept,
              persona,
              evaluationType,
              evaluationSettings
            );
            
            legacyResults.push(result);
            
            // Evolution logic (si está habilitado)
            if (enablePersonaEvolution) {
              const evolutionResult = evolvePersonaFromEvaluation(persona, result, selectedConcept);
              if (evolutionResult.hasEvolved) {
                setEvolutionSummaries(prev => [...prev, evolutionResult.summary]);
                // Actualizar persona evolucionada
                setPersonas(prev => prev.map(p => 
                  p.id === persona.id ? evolutionResult.evolvedPersona : p
                ));
              }
            }
          } catch (error) {
            console.error(`Error evaluating ${persona.name}:`, error);
            // Agregar resultado de error
            legacyResults.push({
              personaId: persona.id,
              conceptId: selectedConcept.id,
              overallAcceptance: 'media',
              quote: 'Sistema temporalmente limitado para evaluación completa',
              keyDrivers: [],
              suggestions: ['Pendiente de conectividad del sistema'],
              aspects: {
                funcionalidad: {
                  positives: ['Evaluación pendiente de sistema completo'],
                  negatives: ['Requiere análisis detallado'],
                  recommendations: ['Pendiente de conectividad del sistema']
                }
              }
            });
          }
        }
        
        setCurrentEvaluation(legacyResults);
      }
      
    } catch (error) {
      console.error('Error in evaluation:', error);
      alert('❌ Error durante la evaluación. Revisa la consola para más detalles.');
    } finally {
      setIsEvaluating(false);
      // Auto-abrir informe en modo conversacional
      if (isConversationalMode) {
        setShowConversationalReport(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Innovation Lab</h1>
                <p className="text-sm text-gray-600">Sistema universal de evaluación de conceptos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Upload className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'evaluate'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Evaluar Conceptos
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('concepts')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'concepts'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Gestionar Conceptos ({concepts.length})
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('personas')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'personas'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gestionar Personas ({personas.length})
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Historial ({evaluations.length})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab: Evaluar */}
        {activeTab === 'evaluate' && (
          <div className="space-y-6">
            {/* Step 1: Seleccionar Concepto */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Seleccionar Concepto a Evaluar
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {concepts.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedConcept?.id === concept.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{concept.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{concept.brand} • {concept.category}</div>
                    <div className="text-xs text-gray-500 mt-2">{concept.benefits.slice(0, 2).join(', ')}</div>
                  </button>
                ))}
                
                <button
                  onClick={() => setShowConceptEditor(true)}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Crear Nuevo Concepto</span>
                </button>
              </div>
            </div>

            {/* Step 2: Seleccionar Personas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Seleccionar Personas para Evaluación
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personas.map(persona => (
                  <div
                    key={persona.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPersonas.includes(persona.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPersonas.includes(persona.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPersonas([...selectedPersonas, persona.id]);
                          } else {
                            setSelectedPersonas(selectedPersonas.filter(id => id !== persona.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{persona.name}</div>
                        <div className="text-sm text-gray-600">{persona.archetype}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {persona.baseProfile.age} años • {persona.baseProfile.location} • NSE {persona.baseProfile.socioeconomicLevel}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
                
                <button
                  onClick={() => setShowPersonaEditor(true)}
                  className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-sm">Crear Nueva Persona</span>
                </button>
              </div>
            </div>

            {/* Step 3: Configuración y Evaluación */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Configuración y Evaluación
              </h2>
              
              {/* Evaluation Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Concepto:</span>
                    <p className="font-medium text-gray-900">{selectedConcept?.name || 'No seleccionado'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Personas:</span>
                    <p className="font-medium text-gray-900">{selectedPersonas.length} seleccionadas</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Modo:</span>
                    <p className="font-medium text-gray-900">
                      🎯 SyntheticUsers Pro
                    </p>
                  </div>
                </div>
              </div>

              {/* Evaluation Configuration - Removed duplicates */}
              <div className="space-y-4 mb-6">
                {false && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de Criticidad
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        onClick={() => setEvaluationSettings({...evaluationSettings, criticality: 'optimistic'})}
                        className={`p-2 rounded-lg text-center transition-all ${
                          evaluationSettings.criticality === 'optimistic'
                            ? 'bg-green-100 border-2 border-green-500 text-green-900'
                            : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-lg">😊</div>
                        <div className="text-xs">Optimista</div>
                      </button>
                      
                      <button
                        onClick={() => setEvaluationSettings({...evaluationSettings, criticality: 'neutral'})}
                        className={`p-2 rounded-lg text-center transition-all ${
                          evaluationSettings.criticality === 'neutral'
                            ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                            : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-lg">😐</div>
                        <div className="text-xs">Neutral</div>
                      </button>
                      
                      <button
                        onClick={() => setEvaluationSettings({...evaluationSettings, criticality: 'critical'})}
                        className={`p-2 rounded-lg text-center transition-all ${
                          evaluationSettings.criticality === 'critical'
                            ? 'bg-orange-100 border-2 border-orange-500 text-orange-900'
                            : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-lg">🤔</div>
                        <div className="text-xs">Crítico</div>
                      </button>
                      
                      <button
                        onClick={() => setEvaluationSettings({...evaluationSettings, criticality: 'skeptical'})}
                        className={`p-2 rounded-lg text-center transition-all ${
                          evaluationSettings.criticality === 'skeptical'
                            ? 'bg-red-100 border-2 border-red-500 text-red-900'
                            : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-lg">🧐</div>
                        <div className="text-xs">Escéptico</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Advanced Settings Toggle */}
                <button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${showAdvancedSettings ? 'rotate-90' : ''}`} />
                  Configuración Avanzada
                </button>

                {/* Advanced Settings Panel */}
                {showAdvancedSettings && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {/* Unified Evaluation Type Info */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🎯</div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-indigo-900">
                            Análisis Cualitativo Avanzado
                          </h4>
                          <p className="text-xs text-indigo-700 mt-1">
                            Sistema adaptativo estilo syntheticusers.com que genera automáticamente 5 temas 
                            dinámicos relevantes según la categoría del concepto (alimentos, cuidado personal, etc.)
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Temas Dinámicos
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Análisis Adaptativo
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Insights Profundos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Idioma</label>
                        <select
                          value={evaluationSettings.language}
                          onChange={(e) => setEvaluationSettings({
                            ...evaluationSettings,
                            language: e.target.value as any
                          })}
                          className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="spanish">Español</option>
                          <option value="english">English</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Evaluation Info */}
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-medium text-green-900 text-sm">✨ Evaluación Cualitativa Profunda</div>
                      <div className="text-sm text-green-700 mt-1">
                        El sistema se enfoca en el "por qué" detrás de cada opinión, generando insights profundos sobre razones de compra, barreras, credibilidad y diferenciación.
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Evaluation Mode - SyntheticUsers Style */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">🎯</div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Evaluación Conversacional SyntheticUsers
                      </h3>
                    </div>
                    <p className="text-sm text-purple-700">
                      Sistema avanzado con 10+ preguntas progresivas por persona, análisis ejecutivo detallado y formato idéntico a SyntheticUsers.com
                    </p>
                    
                    {isConversationalMode && (
                      <div className="mt-4 p-4 bg-purple-100 border border-purple-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h5 className="font-medium text-purple-900">Modo Conversacional Avanzado</h5>
                            <p className="text-sm text-purple-800 mt-1">
                              Genera conversaciones de 10+ preguntas progresivas con respuestas de 100-200 palabras cada una. 
                              Incluye análisis de insights, patrones emocionales y informes ejecutivos completos estilo SyntheticUsers.com
                            </p>
                            <div className="flex gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-200 text-purple-800">
                                Railway Backend
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-200 text-purple-800">
                                Sistema de Agentes
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-200 text-purple-800">
                                Validación RAG
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Evaluation Button */}
              <div className="flex justify-end">
                <button
                  onClick={evaluateConcept}
                  disabled={!selectedConcept || selectedPersonas.length === 0 || isEvaluating}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedConcept && selectedPersonas.length > 0
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        {isConversationalMode ? (
                          <>
                            <div className="animate-pulse">🎯</div>
                            <div className="animate-bounce">💬</div>
                            <div className="animate-pulse">🧠</div>
                          </>
                        ) : (
                          <>
                            <div className="animate-pulse">🧠</div>
                            <div className="animate-bounce">📚</div>
                            <div className="animate-pulse">🎭</div>
                          </>
                        )}
                      </div>
                      <span className="ml-2">
                        {isConversationalMode 
                          ? 'Generando conversaciones profundas con Railway...' 
                          : 'Analizando con Súper IA...'
                        }
                      </span>
                    </>
                  ) : (
                    <>
                      {isConversationalMode ? (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generar Conversaciones Profundas
                        </>
                      ) : (
                        <>
                          🚀 Evaluar con Súper Avanzado
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Resultados - Solo Informe Conversacional en modo SyntheticUsers */}
            {conversationalEvaluations.length > 0 && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        ✨ Evaluación SyntheticUsers Completada
                      </h2>
                      <p className="text-sm text-purple-700 mt-1">
                        {conversationalEvaluations.length} conversaciones profundas generadas con análisis ejecutivo
                      </p>
                    </div>
                    {/* Botón removido - El informe se abre automáticamente */}
                  </div>
                </div>
              </div>
            )}
            
            {/* Resultados tradicionales - Solo si no es modo conversacional */}
            {currentEvaluation.length > 0 && !isConversationalMode && (
              <div className="space-y-6">
                {currentEvaluation.map((evaluation, idx) => {
                  const persona = personas.find(p => p.id === evaluation.personaId);
                  const concept = concepts.find(c => c.id === evaluation.conceptId);
                  
                  return (
                    <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {persona?.name} evalúa "{concept?.name}"
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{persona?.archetype}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          evaluation.overallAcceptance === 'alta'
                            ? 'bg-green-100 text-green-700'
                            : evaluation.overallAcceptance === 'media'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          Aceptación: {evaluation.overallAcceptance}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 italic">"{evaluation.quote}"</p>
                      </div>
                      
                      <div className="space-y-4">
                        {Object.entries(evaluation.aspects).map(([aspect, data]) => (
                          <div key={aspect} className="border-l-4 border-purple-200 pl-4">
                            <h4 className="font-medium text-gray-900 mb-2">{aspect}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <div className="text-green-700 font-medium mb-1">Positivos:</div>
                                <ul className="space-y-1">
                                  {data.positives.map((p, i) => (
                                    <li key={i} className="text-gray-600">• {p}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-red-700 font-medium mb-1">Negativos:</div>
                                <ul className="space-y-1">
                                  {data.negatives.map((n, i) => (
                                    <li key={i} className="text-gray-600">• {n}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="text-blue-700 font-medium mb-1">Recomendaciones:</div>
                                <ul className="space-y-1">
                                  {data.recommendations.map((r, i) => (
                                    <li key={i} className="text-gray-600">• {r}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Gestionar Conceptos */}
        {activeTab === 'concepts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Biblioteca de Conceptos</h2>
              <button
                onClick={() => setShowConceptEditor(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
                Nuevo Concepto
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {concepts.map(concept => (
                <div key={concept.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{concept.name}</h3>
                      <p className="text-sm text-gray-600">{concept.brand} • {concept.category}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingConcept(concept);
                          setShowConceptEditor(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit3 className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteConcept(concept.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{concept.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Beneficios:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {concept.benefits.map((benefit, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-gray-500">Target:</span>
                      <p className="text-xs text-gray-600">{concept.targetAudience}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Gestionar Personas */}
        {activeTab === 'personas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Biblioteca de Personas Sintéticas</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetPersonas}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  title="Resetear todos los perfiles con las 80+ variables completas"
                >
                  <Settings className="h-4 w-4" />
                  Reset Variables (80+)
                </button>
                <button
                  onClick={() => setShowPersonaEditor(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Persona
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personas.map(persona => (
                <div key={persona.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{persona.name}</h3>
                      <p className="text-sm text-gray-600">{persona.archetype}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingPersona(persona);
                          setShowPersonaEditor(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit3 className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeletePersona(persona.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Edad:</span>
                      <span className="text-gray-900">{persona.baseProfile.age} años</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Ubicación:</span>
                      <span className="text-gray-900">{persona.baseProfile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">NSE:</span>
                      <span className="text-gray-900">{persona.baseProfile.socioeconomicLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Ocupación:</span>
                      <span className="text-gray-900">{persona.baseProfile.occupation}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      {persona.variables.length} variables configuradas
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Historial */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Historial de Evaluaciones</h2>
            
            {evaluations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No hay evaluaciones previas</p>
                <p className="text-sm text-gray-500 mt-2">Las evaluaciones realizadas aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-4">
                {evaluations.map((evaluation, idx) => {
                  const persona = personas.find(p => p.id === evaluation.personaId);
                  const concept = concepts.find(c => c.id === evaluation.conceptId);
                  
                  return (
                    <div key={idx} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {persona?.name} → {concept?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Aceptación: {evaluation.overallAcceptance}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modales */}
      {showConceptEditor && (
        <ConceptEditor
          concept={editingConcept}
          onSave={editingConcept ? handleEditConcept : handleAddConcept}
          onClose={() => {
            setShowConceptEditor(false);
            setEditingConcept(null);
          }}
        />
      )}
      
      {showPersonaEditor && (
        <PersonaEditor
          persona={editingPersona}
          onSave={editingPersona ? handleEditPersona : handleAddPersona}
          onClose={() => {
            setShowPersonaEditor(false);
            setEditingPersona(null);
          }}
        />
      )}
      
      {showReportGenerator && selectedConcept && currentEvaluation.length > 0 && (
        <SyntheticUsersReportGenerator
          concept={selectedConcept}
          evaluationResults={currentEvaluation}
          personas={personas}
          onClose={() => setShowReportGenerator(false)}
        />
      )}
      
      {showConversationalReport && selectedConcept && conversationalEvaluations.length > 0 && (
        <ConversationalReportGenerator
          concept={selectedConcept}
          evaluations={conversationalEvaluations}
          onClose={() => setShowConversationalReport(false)}
        />
      )}
    </div>
  );
};

export default InnovationLabContainer;