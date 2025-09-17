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

## Próximas Mejoras
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