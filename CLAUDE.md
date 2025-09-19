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

## 🧪 **INNOVATION LAB - CONSULTOR VIRTUAL ENHANCED SYSTEM**

### **Next-Generation Concept Evaluation Architecture v2.0**
Advanced single-call evaluation system that simulates comprehensive 90-minute consumer interviews for dairy concept assessment. Replaces complex multi-interview systems with efficient Claude-powered deep analysis.

### **Major Enhancements v2.0 (September 2024)**

#### ✅ **Smart Persona Selection System**
- **Automatic Mode**: AI-selected 5 representative personas (balanced demographics)
- **Manual Mode**: User selection of 3-8 specific personas from pool
- **Validation**: Minimum requirements and optimal selection guidance
- **Preview**: Rich persona profiles with consumption patterns

#### ✅ **Deep Analysis Engine (5 New Sections)**
- **🏆 Competitive Analysis**: Main competitor, advantages/weaknesses, differentiation strategy
- **🚀 Adoption Journey**: Awareness → Trial → Repeat purchase mapping
- **⏰ Consumption Occasions**: Primary/secondary/unexplored usage contexts
- **📈 Market Projection**: Target size, penetration, growth potential, time-to-market
- **👥 Enhanced Segment Insights**: Psychological drivers, friction points, influencers

#### ✅ **Advanced Psychological Profiling**
- **💭 Emotional Drivers**: Deep motivational analysis per persona
- **⚡ Friction Points**: Specific psychological barriers identification
- **👨‍👩‍👧‍👦 Decision Influencers**: Social/family influence mapping
- **🕐 Consumption Context**: Detailed when/how/where scenarios
- **💬 Enhanced Quotes**: Main reaction + consumption moment insights

#### ✅ **Business Intelligence Integration**
- **Market Positioning**: Strategic placement vs Alpina/Colanta/Parmalat
- **Growth Assessment**: Realistic market penetration projections
- **Risk Analysis**: Comprehensive business risk evaluation
- **Actionable Insights**: Executive-ready strategic recommendations

### **Enhanced Architecture Files v2.0**

#### **Core Engine (Enhanced)**
- **`src/services/consultorVirtualService.ts`**:
  - Single-call evaluation engine with deep analysis
  - Manual/automatic persona selection
  - 90-minute interview simulation prompt
  - Comprehensive JSON structure with 6 analysis sections
  - Robust error handling with emergency fallbacks

#### **Advanced UI Components**
- **`src/components/InnovationLab/ConsultorVirtualLab.tsx`**:
  - Enhanced persona selection interface (automatic/manual modes)
  - Real-time progress tracking
  - Comprehensive concept management
  - Optimized evaluation workflow

- **`src/components/InnovationLab/ConsultorVirtualResults.tsx`**:
  - 6-section results display with color coding
  - Deep psychological insights visualization
  - Competitive analysis dashboard
  - Market projection summaries
  - Executive-ready formatting

- **`src/components/Modules/AlqueriaInnovationLab.tsx`**: Simplified entry point

#### **Supporting Infrastructure**
- **`api/claude-evaluation.js`**: Vercel Function proxy (300s timeout)
- **`src/types/dairy.types.ts`**: Enhanced TypeScript interfaces
- **`src/data/alqueriaPersonaSystem.ts`**: Colombian dairy consumer personas

### **Enhanced Data Structures v2.0**

```typescript
// Main evaluation result with 6 comprehensive sections
interface ConsultorEvaluation {
  // Core identification
  conceptId: string;
  conceptName: string;
  evaluationMode: 'consultant';
  timestamp: string;
  recommendation: 'GO' | 'REFINE' | 'NO-GO';
  overallScore: number; // 1-10
  confidence: number; // 1-10
  processingTime: number;

  // Analysis sections
  segmentAnalysis: SegmentInsight[];              // Enhanced persona insights
  executiveSummary: ExecutiveSummary;             // Strategic recommendations
  competitiveAnalysis: CompetitiveAnalysis;       // Market positioning
  adoptionJourney: AdoptionJourney;               // Consumer path mapping
  consumptionOccasions: ConsumptionOccasions;     // Usage context analysis
  marketProjection: MarketProjection;             // Business projections
}

// Deep psychological persona analysis
interface SegmentInsight {
  // Basic profile
  personaName: string;
  personaProfile: string;
  overallReaction: 'Positiva' | 'Neutral' | 'Negativa';
  purchaseIntent: number; // 1-10

  // Traditional insights
  keyBarriers: string[];
  keyOpportunities: string[];
  priceReaction: string;
  competitorComparison: string;

  // NEW: Deep psychological insights
  emotionalDrivers: string[];         // Emotional motivators
  frictionPoints: string[];           // Psychological barriers
  decisionInfluencers: string[];      // Social influence factors
  consumptionContext: string;         // Usage scenarios

  // Enhanced quotes
  representativeQuote: string;
  consumptionMomentQuote?: string;    // NEW: Usage context quote
}
```

### **Evolution Roadmap - Advanced AI-Powered Features**

#### **🎯 PHASE 3: Dynamic Scenario Simulation** [NEXT]
- **Price Elasticity**: Real-time response simulation across price points
- **Competitive Response**: Impact analysis of competitor moves (Alpina/Colanta launches)
- **Economic Sensitivity**: Consumer behavior during economic downturns
- **Channel Optimization**: Traditional vs modern retail strategy recommendations

#### **💡 PHASE 4: Real-Time Market Intelligence**
- **Live Market Signals**: Integration with social media sentiment and search trends
- **Competitive Monitoring**: Automated alerts on competitor product launches
- **Consumer Trend Detection**: Early identification of emerging dairy preferences
- **Predictive Analytics**: 6-month market trajectory forecasting

#### **🔬 PHASE 5: AI-Powered Business Strategy Generator**
- **Go-to-Market Plans**: Automated campaign strategy generation
- **Resource Allocation**: Optimal budget distribution recommendations
- **Risk Mitigation**: Proactive identification of business threats
- **Success Metrics**: KPI tracking and optimization suggestions

### **Current Capabilities Summary (v2.0)**
✅ **Single-call comprehensive evaluation** (15-25 seconds)
✅ **Manual persona selection** (3-8 people) or automatic (5 people)
✅ **6 analysis sections** with deep psychological insights
✅ **Executive-ready recommendations** with actionable strategies
✅ **Competitive positioning** vs major Colombian dairy brands
✅ **Market growth projections** with business viability assessment

### **Technical Implementation Status**

#### **✅ Enhanced Features Deployed**
- **Deep Analysis Engine**: 90-minute interview simulation with cultural insights
- **Persona Selection System**: Manual (3-8) or automatic (5) with demographic balance
- **Psychological Profiling**: Emotional drivers, friction points, social influencers
- **Competitive Intelligence**: Strategic positioning vs Alpina, Colanta, Parmalat
- **Market Projections**: Growth potential with realistic penetration estimates
- **Business Recommendations**: Executive-ready strategic guidance

#### **🔧 Technical Optimizations**
- **Clean Code Architecture**: Comprehensive documentation and type safety
- **Performance Optimized**: Single API call (vs previous multi-call system)
- **Error Handling**: Robust fallbacks with emergency evaluation modes
- **UI/UX Enhanced**: Intuitive persona selection with real-time validation
- **Response Processing**: Advanced JSON cleaning and structure validation

#### **📈 Quality Improvements**
- **Prompt Engineering**: Culturally-aware Colombian dairy market insights
- **Insight Depth**: From surface-level to psychological behavioral analysis
- **Business Value**: Strategic recommendations vs generic market research
- **Actionability**: Specific, implementable guidance for dairy product teams

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

- **Fecha**: 18 Septiembre 2025
- **Desarrollador**: Jorge con asistencia Claude Code
- **Estado**: ✅ **PRODUCTION DEPLOYED - ENHANCED v2.0 CONSULTOR VIRTUAL**
- **Performance**: 15-25 segundos por evaluación completa
- **Depth**: 6 secciones de análisis + insights psicológicos profundos
- **Business Value**: Recomendaciones estratégicas ejecutivas accionables

## 🔗 Enlaces Activos

- **Sistema Alquería**: http://localhost:5190 ✅
- **Backend RAG**: https://alqueria-rag-backend-production.up.railway.app ✅

---

**🥛 Sistema RAG Alquería - Inteligencia Láctea Especializada**
*Frontend dedicado optimizado para el mercado lácteo colombiano*