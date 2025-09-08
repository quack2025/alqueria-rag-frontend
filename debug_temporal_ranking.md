# 🔍 DIAGNÓSTICO: ¿REALMENTE HAY BIAS TEMPORAL?

## Hipótesis a Probar

**Jorge observó**: "El sistema privilegia documentos nuevos sobre Pond's 2021"
**Mi hipótesis**: Azure AI Search tiene scoring profile con recency boost activo

## Experimento Controlado

### Test 1: Query Genérica vs Específica
```
Query A (genérica): "insights consumidor cuidado facial"
Expected: Debería retornar mix de marcas por similarity

Query B (específica): "POND'S tracking post lanzamiento 2021" 
Expected: Debería retornar SOLO Pond's 2021 por alta similarity
```

### Test 2: Análisis de Citations
```
Para cada respuesta, verificar:
1. similarity_score de cada citation
2. documento_fecha de cada citation  
3. ranking_order vs similarity_order

¿Hay correlación inversa entre fecha y ranking?
```

### Test 3: Comparación con Otras Marcas Históricas
```
Query: "Fruco tradición familiar Colombia"
¿Retorna docs históricos de Fruco o solo recientes?

Query: "Dove hidratación clima húmedo"
¿Retorna estudios antiguos de Dove que mencionan clima?
```

## Parámetros a Verificar en Backend

### 1. Endpoint /api/rag-pure
- ¿Usa vector search puro o semantic hybrid?
- ¿Tiene scoring_profile configurado?
- ¿Aplica boosts por fecha?

### 2. Azure AI Search Index Config
- ¿Hay freshness functions en scoring profiles?
- ¿Los embeddings incluyen fecha en el vector?
- ¿Hay post-processing que reordena por fecha?

## Resultado Esperado

Si el sistema es **RAG puro correcto**:
- Miranda vs Arizona 1966 con similarity 0.95 → Rank #1
- Pond's 2021 con similarity 0.85 → Rank #1 para queries específicas
- NO correlation entre document_date y ranking_position

Si hay **temporal bias problemático**:
- Docs recientes con similarity 0.30 → Rank #1
- Docs antiguos con similarity 0.85 → Rank #5+
- STRONG correlation entre document_date y ranking_position

## Acción Requerida

1. **Verificar configuración Azure AI Search**
2. **Analizar similarity scores vs ranking order**
3. **Si hay bias temporal**: Desactivar scoring profiles de recency
4. **Si NO hay bias**: El problema de Pond's es de embeddings quality, no temporal