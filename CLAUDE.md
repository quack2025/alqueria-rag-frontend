# Proyecto Alquería RAG Intelligence System

## Resumen del Proyecto
Sistema RAG (Retrieval-Augmented Generation) especializado para análisis de insights de mercado lácteo de Alquería basado en documentos de investigación de la industria láctea colombiana.

## Estructura del Proyecto

### Backend (FastAPI + Azure OpenAI)
- **URL de Producción**: `https://alqueria-rag-backend-production.up.railway.app`
- **Endpoint Principal**: `/api/rag-pure`
- **Estado**: ✅ 100% Operativo
- **Documentos**: 734 documentos lácteos disponibles ✅

### Frontend (React + TypeScript + Vite)
- **Ubicación**: `C:\Users\jorge\proyectos_python\alqueria_rag_frontend_new\`
- **Puerto**: 5190 (desarrollo)
- **Comando inicio**:
  ```bash
  cd C:\Users\jorge\proyectos_python\alqueria_rag_frontend_new
  npm run dev
  ```

## Funcionalidades Implementadas

### Core
- ✅ **Arquitectura Modular**: 3 módulos RAG independientes
- ✅ Sistema de citas con metadata de Alquería
- ✅ Renderizado Markdown
- ✅ **Branding Alquería**: Verde lácteo corporativo
- ✅ **Chat Inteligente**: Queries sugeridas específicas del sector lácteo

### Módulos RAG Implementados

#### 1. **RAG Puro** (`/api/rag-pure`)
- Consultas basadas 100% en documentos lácteos de Alquería
- Respuestas directas con citas específicas
- Datos reales sobre mercado lácteo colombiano
- Diseño verde corporativo Alquería

#### 2. **RAG Creativo** (`/api/rag-creative`)
- Análisis estratégicos con visualizaciones
- Recomendaciones de negocio lácteo
- Insights de tendencias y oportunidades
- Análisis competitivo vs Alpina, Colanta, Parmalat

#### 3. **RAG Híbrido** (`/api/rag-hybrid`)
- Balance personalizable RAG/Creatividad
- Configuración de porcentajes dinámicos (0-100%)
- Análisis adaptativos según contexto lácteo
- Default: 80% documentos, 20% AI

## 🥛 Enfoque Sector Lácteo

### **Competidores Analizados:**
- **Alpina**: Líder histórico en yogurts y lácteos premium
- **Colanta**: Cooperativa fuerte en leches y quesos
- **Parmalat**: Presencia internacional en UHT
- **Nestlé Dairy**: Marcas como Klim y La Lechera

### **Categorías de Productos:**
- **Leches**: Entera, deslactosada, light, fortificada
- **Yogurts**: Natural, griego, funcional, probiótico
- **Quesos**: Frescos, madurados, procesados
- **Derivados**: Kumis, arequipe, mantequilla, crema

### **Insights Clave:**
- Tendencias hacia productos funcionales y saludables
- Crecimiento en lácteos sin lactosa
- Importancia del canal tradicional en Colombia
- Preferencias regionales por sabores locales

## Tecnologías Principales
- **Backend**: Azure OpenAI, Azure AI Search
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **IA**: GPT-4, text-embedding-3-large (3072D)
- **Vector Store**: Azure AI Search (734 documentos lácteos)
- **Deploy**: Railway (backend), Local (frontend desarrollo)

## Configuración de Desarrollo

### Variables de Entorno
```bash
VITE_API_URL=https://alqueria-rag-backend-production.up.railway.app
VITE_JWT_SECRET=alqueria-rag-jwt-secret-2024
VITE_APP_NAME="Alquería RAG System"
VITE_DEBUG=true
```

### Comandos Útiles
```bash
# Instalación
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Vista previa
npm run preview
```

## Casos de Uso Principales

### Para Brand Managers
- Análisis de percepción de marca Alquería
- Competitive intelligence vs Alpina/Colanta
- Oportunidades de posicionamiento lácteo
- Performance de campañas en sector lácteo

### Para Consumer Insights
- Segmentación de audiencias lácteas
- Journey mapping del consumidor de lácteos
- Comportamiento del consumidor colombiano
- Tendencias emergentes en nutrición

### Para Innovation Teams
- Identificación de gaps en portafolio lácteo
- Necesidades no satisfechas en lácteos funcionales
- Oportunidades de producto lácteo
- Insights de packaging para lácteos

### Para Marketing Strategy
- Análisis competitivo sector lácteo
- Oportunidades de crecimiento en lácteos
- Estrategias de comunicación nutricional
- ROI de iniciativas lácteas

## Testing y Validación

### Queries de Prueba Lácteas
```bash
# Mercado específico
- "¿Cuáles son las tendencias del mercado lácteo en Colombia?"
- "¿Cómo se posiciona Alquería versus Alpina?"
- "¿Qué insights tienes sobre yogurt griego en Colombia?"

# Competencia
- "¿Cuáles son las fortalezas de Alquería vs competencia?"
- "¿Cómo varía la preferencia láctea por edad?"

# Innovación
- "¿Qué oportunidades existen en lácteos funcionales?"
- "¿Cómo está evolucionando el consumo de leche deslactosada?"
```

### Resultados Esperados
- **Chunks Retrieved**: 5-10 (óptimo para consultas lácteas)
- **Similarity Scores**: 0.026-0.045
- **Response Time**: 15-25 segundos
- **Citations**: Específicas por documento lácteo

---

## 🧪 **INNOVATION LAB - SISTEMA DE ENTREVISTAS SINTÉTICAS**

### **Arquitectura Avanzada de Evaluación de Conceptos**
Sistema de investigación cualitativa que simula entrevistas profundas con consumidores sintéticos para evaluar conceptos lácteos de Alquería.

### **Funcionalidades Implementadas**

#### ✅ **Sistema de Evaluación Consolidada (2 Fases)**
- **Fase 1**: Entrevistas individuales con cada persona sintética
- **Fase 2**: Generación de reporte ejecutivo consolidado
- **Formato**: Compatible con Study 1.json (formato competencia)
- **Progreso en tiempo real**: Indicadores visuales de progreso por entrevista

#### ✅ **Moderador Experto Integrado**
- **Revisión automática**: Claude actúa como moderador experto con 15+ años experiencia
- **Preguntas naturales**: Convierte preguntas académicas en conversacionales
- **Contexto lácteo**: Especializado en productos Alquería, Alpina, Colanta
- **Mejora ejemplo**:
  - ❌ "¿Qué preguntas específicas harías sobre Alquería Vital+ Digestive si estuvieras genuinamente interesado/a versus si solo estuvieras siendo educado/a?"
  - ✅ "Cuéntame, si realmente te interesara probar este Alquería Vital+ Digestive, ¿qué le preguntarías a alguien que ya lo haya probado?"

#### ✅ **Infraestructura Robusta**
- **Vercel Functions**: API proxy con timeout 300s para evaluaciones largas
- **CORS resuelto**: Forzar uso de Vercel Functions en producción
- **Fallback systems**: Respaldo cuando Claude API falla
- **JSON parsing**: Limpieza de respuestas markdown de Claude

### **Archivos Principales**

#### **Backend API**
- **`api/claude-evaluation.js`**: Vercel Function para proxy Claude API
- **`vercel.json`**: Configuración timeout 300s, CORS, build vars

#### **Frontend Core**
- **`src/services/claudeEvaluationService.ts`**: Motor de entrevistas + moderador experto
- **`src/services/consolidatedEvaluationService.ts`**: Sistema 2 fases + reportes consolidados
- **`src/types/dairy.types.ts`**: Interfaces TypeScript para datos estructurados

#### **Componentes UI**
- **`src/components/InnovationLab/EvaluationProgress.tsx`**: Progreso tiempo real
- **`src/components/InnovationLab/ConsolidatedResults.tsx`**: Display resultados con drill-down
- **`src/components/Modules/AlqueriaInnovationLab.tsx`**: Módulo principal

### **Tipos de Datos Principales**

```typescript
// Resultado consolidado tipo Study 1.json
interface ConsolidatedStudyResult {
  id: string;
  conceptId: string;
  conceptName: string;
  syntheticUser: string;
  researchGoal: string;
  executiveSummary: StudySection[];
  interviews: DetailedInterview[];
  metadata: StudyMetadata;
}

// Progreso en tiempo real
interface EvaluationProgress {
  currentPhase: 'interviews' | 'consolidation' | 'completed';
  currentStep: number;
  totalSteps: number;
  currentPersona?: string;
  currentAction: string;
  timeElapsed: number;
  estimatedTimeRemaining?: number;
}
```

### **Roadmap de Evolución Claude-Powered**

#### **🎯 FASE 1: Entrevistas Adaptativas Dinámicas** [PRÓXIMO]
- **Análisis respuesta en tiempo real**: Claude detecta emociones, barreras, oportunidades
- **Preguntas de seguimiento dinámicas**: Genera 2-3 preguntas específicas según respuesta
- **Casos de uso**:
  - Menciona precio → Explora sensibilidad económica
  - Muestra entusiasmo por probióticos → Indaga conocimiento nutricional
  - Referencia familiar → Profundiza en influencia social

#### **💡 FASE 2: Recomendaciones Estratégicas en Tiempo Real**
- **Live insights**: Genera recomendaciones mientras se realizan entrevistas
- **Alertas accionables**: "4/5 personas asocian 'digestivo' con medicina"
- **Segmentación dinámica**: Identifica patrones por demographic, NSE, región

#### **🔬 FASE 3: Simulador de Escenarios de Mercado**
- **Elasticidad de precio**: Simula respuesta a diferentes precios
- **Competencia**: Predice impacto si Alpina lanza producto similar
- **Crisis económica**: Evalúa lealtad durante recesión
- **Channel strategy**: Optimiza estrategia tiendas vs supermercados

### **Próximas Mejoras Core**
1. **Dashboard Analytics**: Métricas de uso por producto lácteo
2. **Comparación Temporal**: Evolución de insights lácteos
3. **Alertas Inteligentes**: Cambios en percepciones de marca
4. **Integración CRM**: Conexión con sistemas Alquería
5. **Mobile App**: Versión nativa para ejecutivos lácteos

## Documentación Técnica

### Estructura de Datos
```typescript
interface AlqueriaInsight {
  brand: string;
  category: string;
  region: string;
  consumer_segment: string;
  insight_type: string;
  confidence_score: number;
  source_documents: string[];
}
```

### API Endpoints
- `GET /api/v1/alqueria/health` - Health check
- `POST /api/rag-pure` - RAG puro lácteo
- `POST /api/rag-creative` - Insights creativos lácteos
- `POST /api/rag-hybrid` - Modo híbrido lácteo

---

## 📅 Estado Actual

- **Fecha**: 16 Septiembre 2025
- **Desarrollador**: Jorge con asistencia Claude Code
- **Estado**: ✅ **PRODUCCIÓN READY - SISTEMA LÁCTEO DEDICADO**

## 🔗 Enlaces Activos

- **Sistema Alquería**: http://localhost:5190 ✅
- **Backend RAG**: https://alqueria-rag-backend-production.up.railway.app ✅

---

**🥛 Sistema RAG Alquería - Inteligencia Láctea Especializada**
*Frontend dedicado optimizado para el mercado lácteo colombiano*