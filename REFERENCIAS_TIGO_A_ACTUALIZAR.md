# Referencias de Tigo/Honduras a Actualizar para Unilever Colombia

## ✅ ACTUALIZACIONES COMPLETADAS

### ModuleSelector.tsx
- ✅ "Tigo RAG System" → "Unilever RAG System"
- ✅ "6 arquetipos de consumidores hondureños" → "7 arquetipos de consumidores colombianos"
- ✅ "1,500+ documentos" → "47 estudios Unilever"
- ✅ "Sistema desarrollado para Tigo Honduras" → "Sistema desarrollado para Unilever Colombia"

### ConfigurationPanel.tsx
- ✅ Prompts de sistema actualizados para Unilever Colombia y FMCG

### ChatHistorySearch.tsx
- ✅ "Tigo RAG" → "Unilever RAG"

### unileverLLMService.ts
- ✅ Preguntas sugeridas completamente rediseñadas para productos de consumo masivo

## ❌ PENDIENTES DE ACTUALIZAR

### Archivos que requieren atención:

1. **src/data/hondurasKnowledgeBase.ts**
   - Todo el archivo es específico de Honduras/telecomunicaciones
   - Debe reemplazarse por datos de consumidores colombianos FMCG

2. **src/types/persona.types.ts**
   - TigoArchetype → debe reemplazarse por UnileverArchetype
   - Arquetipos hondureños → arquetipos colombianos
   - Referencias a telecomunicaciones

3. **src/components/Analytics/DashboardModule.tsx**
   - "Nueva campaña Tigo 5G Pro" → ejemplos de campañas Unilever

4. **src/components/Modules/SyntheticModule.tsx**
   - Import de TigoArchetype

5. **src/components/Campaign/HumanArchetypeChat.tsx**
   - Referencias específicas a "Tigo", "Honduras", servicios prepago/postpago
   - Conversaciones de telecomunicaciones → conversaciones FMCG

6. **src/utils/authenticConversationEngine.ts**
   - Lógica específica de telecomunicaciones
   - Referencias a gastos en "Tigo"
   - Presupuesto de telecomunicaciones

7. **src/utils/campaignEvaluator.ts**
   - Todo basado en TigoArchetype
   - Evaluaciones de productos telecom

8. **src/components/Campaign/ArchetypeSelector.tsx**
   - Arquetipos y demografías de Honduras
   - TigoArchetype references

9. **src/components/ML/PredictorModule.tsx**
   - Ejemplo "Tigo 5G Pro"

10. **src/components/Modules/CreativeModule.tsx**
    - Prompts de imagen específicos de Tigo Honduras
    - Branding corporativo azul de Tigo

11. **src/components/Campaign/PersonaSettings.tsx**
    - TigoArchetype y nombres hondureños

12. **src/components/Reports/ReportsModule.tsx**
    - Ejemplos "Análisis Q4 2024 - Tigo Honduras"
    - "Focus Group - Tigo 5G Pro"
    - "Aplicar branding de Tigo"

## 🎯 RECOMENDACIONES DE ACTUALIZACIÓN

### Para Arquetipos:
- Usar los arquetipos ya definidos en `unileverPersona.types.ts`
- Mantener coherencia con personas colombianas

### Para Ejemplos de Campañas:
- "Dove Autoestima 2024"
- "OMO Tecnología Activa"
- "Fruco Sabor Auténtico"
- "Suave Nutrición Capilar"

### Para Demographics:
- Cambiar ciudades hondureñas por ciudades colombianas
- NSE adaptado al contexto colombiano
- Expresiones regionales colombianas vs hondureñas

### Para Business Context:
- Telecomunicaciones → FMCG (productos de consumo masivo)
- Prepago/Postpago → Uso de productos/frecuencia de compra
- Señal/Cobertura → Disponibilidad/Distribución de productos
- Planes → Portafolio de productos

## 💡 SIGUIENTE PASO RECOMENDADO

Priorizar la actualización de:
1. `types/persona.types.ts` - Base de todo el sistema
2. `data/hondurasKnowledgeBase.ts` - Datos fundamentales 
3. `components/Campaign/` - Componentes de interacción con usuarios

Estos cambios tendrán el mayor impacto en la experiencia del usuario.