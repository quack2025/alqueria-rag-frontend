# ⚠️ CONFIGURACIÓN CRÍTICA - ALQUERÍA RAG SYSTEM

## 🔴 PROBLEMAS CRÍTICOS Y SOLUCIONES

### 1. **Límites de Tokens y Timeouts**

#### Problema
- Claude trunca respuestas cuando exceden límite de tokens
- Vercel Functions timeout después de 5 minutos
- Evaluaciones largas (5+ personas) pueden fallar

#### Configuración Actual
```javascript
// consolidatedEvaluationService.ts
max_tokens: 32000  // Máximo soportado
temperature: 0.2   // Baja para JSON consistente

// vercel.json
maxDuration: 300   // 5 minutos máximo

// API timeouts
RAG queries: 60 segundos
Claude calls: Sin timeout explícito (PROBLEMA)
```

#### ✅ Soluciones Implementadas
1. **Sistema de Fallback 3 niveles**
   - Nivel 1: Prompt completo (32K tokens)
   - Nivel 2: Prompt compacto (4K tokens)
   - Nivel 3: Análisis local de emergencia

2. **Detección de truncamiento**
   ```javascript
   if (data.stop_reason === 'max_tokens') {
     // Activar fallback automático
   }
   ```

3. **Limpieza de respuestas**
   - Función `cleanClaudeResponse()` elimina markdown
   - Validación JSON antes de parsear

### 2. **Seguridad de API Keys**

#### ⚠️ CRÍTICO
- NUNCA poner `VITE_CLAUDE_API_KEY` en el frontend
- SIEMPRE usar Vercel Functions como proxy

#### Configuración Segura
```bash
# .env.local (NUNCA commitear)
VITE_USE_VERCEL_FUNCTIONS=true  # Forzar uso de proxy

# En Vercel Dashboard
CLAUDE_API_KEY=sk-ant-xxx  # Solo en servidor
```

### 3. **Rate Limiting**

#### Problema
- Claude API: 60 requests/min
- Sin retry logic = fallos aleatorios

#### Solución
```javascript
import { callClaudeWithRetry } from './utils/retryWithBackoff';

// Usar wrapper con retry
const response = await callClaudeWithRetry(
  () => fetch('/api/claude-evaluation', {...}),
  'consolidación de reporte'
);
```

### 4. **Performance**

#### Problemas Detectados
- Bundle size: 784KB (muy grande)
- Evaluaciones secuenciales (muy lento)
- Sin caché de respuestas

#### Optimizaciones Pendientes
```javascript
// Paralelización controlada
const batchSize = 2; // Max 2 personas en paralelo
for (let i = 0; i < personas.length; i += batchSize) {
  const batch = personas.slice(i, i + batchSize);
  await Promise.all(batch.map(p => interview(p)));
}

// Implementar caché
const cacheKey = `${concept.id}_${persona.id}`;
if (cache.has(cacheKey)) return cache.get(cacheKey);
```

## 🚨 MONITOREO Y DEBUGGING

### Logs Críticos a Revisar

```javascript
// Buscar estos patrones en console:
"❌ Estructura de respuesta inesperada"  // JSON malformado
"⚠️ Respuesta truncada"                  // Límite de tokens
"❌ FALLBACK REPORT ACTIVADO"            // Sistema de respaldo
"Rate limit alcanzado"                   // Throttling de API
```

### Métricas a Monitorear

1. **Tasa de Éxito**
   - Target: >95% evaluaciones completas
   - Actual: ~80% (mejorar)

2. **Tiempos de Respuesta**
   - Entrevista individual: 30-45 seg
   - Consolidación: 20-30 seg
   - Total 5 personas: <5 min

3. **Uso de Tokens**
   - Por entrevista: ~2000-3000
   - Consolidación: ~8000-15000
   - Costo estimado: $0.10-0.20 por evaluación completa

## 📋 CHECKLIST PRE-PRODUCCIÓN

### Antes de Desplegar

- [ ] Verificar `VITE_USE_VERCEL_FUNCTIONS=true`
- [ ] API keys solo en Vercel Dashboard
- [ ] Retry logic implementado en todos los servicios
- [ ] Timeouts configurados correctamente
- [ ] Fallbacks probados manualmente
- [ ] Bundle size optimizado (<500KB)
- [ ] Logs de error configurados

### Testing Crítico

```bash
# 1. Test de carga
- Evaluar 5 personas simultáneamente
- Verificar que no hay timeouts
- Confirmar fallbacks funcionan

# 2. Test de resiliencia
- Simular fallo de Claude API
- Verificar activación de fallback local
- Confirmar UX no se rompe

# 3. Test de seguridad
- Inspeccionar bundle.js en producción
- Verificar NO hay API keys expuestas
- Confirmar todas las llamadas van por proxy
```

## 🔥 TROUBLESHOOTING

### Error: "Estructura de respuesta inesperada"
```javascript
// Causa: Claude retornó markdown o JSON truncado
// Solución:
1. Verificar stop_reason en respuesta
2. Si es 'max_tokens', reducir prompt
3. Activar fallback compacto
```

### Error: "429 Too Many Requests"
```javascript
// Causa: Rate limit de Claude
// Solución:
1. Implementar retry con backoff
2. Reducir paralelización
3. Añadir delays entre llamadas
```

### Error: Timeout en Vercel
```javascript
// Causa: Evaluación toma >5 min
// Solución:
1. Reducir número de personas
2. Optimizar prompts
3. Considerar arquitectura de queue
```

## 💡 MEJORAS FUTURAS

1. **Queue System**
   - Bull/Redis para procesar evaluaciones
   - Webhooks para notificar completado
   - Sin límite de timeout

2. **Streaming Responses**
   - Server-Sent Events para progreso real-time
   - Respuestas parciales visibles

3. **Edge Functions**
   - Migrar a Vercel Edge (no timeout)
   - Menor latencia global

4. **Caché Inteligente**
   - Redis para respuestas frecuentes
   - Invalidación por concepto/persona

---

**Última actualización:** 17 Enero 2025
**Mantenedor:** Jorge con asistencia Claude
**Criticidad:** ALTA - Revisar antes de cada deploy