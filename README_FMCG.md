# Unilever FMCG RAG System

## 🛍️ Especialización FMCG
Sistema RAG adaptado para productos de consumo masivo con 25 nuevas variables específicas para comportamientos de compra.

## 🔄 Cambios Principales
- **Variables**: 25 telecom → 25 FMCG 
- **Moneda**: Lempiras → Pesos
- **Contexto**: Honduras telecom → LATAM FMCG
- **UX**: Sin referencias "Tigo Honduras"

## 🛍️ Variables FMCG (25 Nuevas)
- `shopping_frequency`, `primary_shopping_channel`
- `brand_loyalty_level`, `price_sensitivity` 
- `promotion_responsiveness`, `bulk_buying_behavior`
- `health_consciousness`, `eco_sustainability_concern`
- `innovation_adoption`, `local_brand_preference`
- Y 15 más especializadas para FMCG

## 👥 Arquetipos FMCG
1. **PROFESIONAL**: Premium quality seeker ($25k)
2. **CONTROLADOR**: Budget-conscious planner ($18k)
3. **EMPRENDEDOR**: Convenience seeker ($15k)
4. **GOMOSO**: Experience & trend seeker ($20k)
5. **PRAGMÁTICO**: Value optimizer
6. **RESIGNADO**: Necessities buyer ($8k)

## 🔧 Sistema Configurable
- **PersonaVariableConfig**: Crear variables personalizadas
- **Tipos**: text, number, select, boolean
- **Default FMCG**: 5 variables base configurables

## 🚀 Enlaces
- **Backend**: https://web-production-68331.up.railway.app/
- **GitHub**: https://github.com/quack2025/alqueria-rag-frontend
- **Estado**: Backend ✅ | Frontend 🟡 (listo para Vercel)

## 📋 Casos de Uso Unilever
- **Dove Body Wash Natural**: Testing con arquetipos FMCG
- **Variables críticas**: health_consciousness, brand_loyalty, eco_concern
- **Evaluación**: 9 aspectos por arquetipo (0-100 puntos)