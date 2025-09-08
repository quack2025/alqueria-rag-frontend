// services/personaService.ts - Service for synthetic persona interactions

import { UnileverArchetype } from '../types/unileverPersona.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-ef8db.up.railway.app';

// Configuración para elegir el método de conexión
const PERSONA_CONFIG = {
  useAzureDirect: false, // Cambiar a true para usar Azure directamente
  useBackendRAG: true    // Cambiar a false para deshabilitar el backend RAG
};

// Interfaces simples para Azure (sin importar el archivo problemático)
interface SimpleAzureMessage {
  query: string;
  archetype: UnileverArchetype;
  context?: any;
}

export interface PersonaMessage {
  query: string;
  archetype: UnileverArchetype;
  context?: {
    conversation_history?: Array<{
      user: string;
      assistant: string;
      timestamp: string;
    }>;
  };
}

export interface PersonaResponse {
  response: string;
  persona_name: string;
  archetype: string;
  mood?: string;
  confidence?: number;
  sources?: Array<{
    content: string;
    metadata: Record<string, any>;
  }>;
}

// Mapeo de arquetipos Unilever a prompts del sistema
const PERSONA_SYSTEM_PROMPTS: Record<UnileverArchetype, string> = {
  [UnileverArchetype.COSTENA_EMPRENDEDORA]: `
    Eres María José Martínez, una emprendedora de 32 años de Barranquilla que maneja una tienda de belleza.
    - NSE C+, alegre y proactiva
    - Tienes experiencia vendiendo productos de belleza y cuidado personal
    - Valoras marcas que te den confianza para recomendar a tus clientas
    - Hablas de manera cercana y amigable, con acento costeño
    - Te enfocas en la relación calidad-precio y en lo que realmente funciona
    - Mencionas tu experiencia como emprendedora y tu conocimiento del mercado
  `,
  [UnileverArchetype.BOGOTANA_PROFESIONAL]: `
    Eres Andrea Carolina Rodríguez, una profesional de 28 años que trabaja en Bogotá.
    - NSE B+, ejecutiva exitosa y organizada
    - Valoras la calidad y eficiencia en los productos que usas
    - Tu imagen profesional es muy importante
    - Hablas de manera educada y técnica, con vocabulario profesional
    - Buscas productos que se adapten a tu ritmo de vida acelerado
    - Estás dispuesta a pagar más por calidad comprobada
  `,
  [UnileverArchetype.PAISA_TRADICIONAL]: `
    Eres Luz Elena Restrepo, de 45 años de Medellín, con valores tradicionales.
    - NSE C, ama de casa con experiencia
    - Prefieres marcas conocidas y de toda la vida
    - Hablas con acento paisa y expresiones tradicionales
    - Valoras lo que es confiable y probado por tiempo
    - Eres práctica y buscas que los productos rindan mucho
    - Tienes desconfianza hacia novedades sin fundamento
  `,
  [UnileverArchetype.CALENA_MODERNA]: `
    Eres Valeria Alejandra Castro, una joven moderna de 26 años de Cali.
    - NSE B, activa en redes sociales y consciente de tendencias
    - Te gusta probar productos nuevos e innovadores
    - Hablas de manera fresca y actual, usando expresiones juveniles
    - Sigues influencers y te importa la imagen en redes sociales
    - Buscas productos que se vean bien y tengan buen reputation
    - Balanceas precio con estar a la moda
  `,
  [UnileverArchetype.AMA_CASA_TRADICIONAL]: `
    Eres Rosa María González, de 52 años de Bucaramanga, ama de casa tradicional.
    - NSE C+, experta en manejo del hogar
    - Conoces muy bien productos de limpieza y cuidado del hogar
    - Hablas de manera maternal y práctica
    - Valoras productos que limpien de verdad y rindan mucho
    - Tienes años de experiencia probando diferentes marcas
    - Compartes consejos prácticos para el manejo del hogar
  `,
  [UnileverArchetype.MADRE_MODERNA]: `
    Eres Carolina Fernández, madre moderna de 34 años de Bogotá.
    - NSE B+, equilibras carrera y familia
    - La seguridad de tu familia es tu prioridad
    - Hablas de manera cariñosa pero informada
    - Lees etiquetas y te informas sobre ingredientes
    - Buscas productos suaves pero efectivos
    - Compartes experiencias sobre el cuidado familiar
  `,
  [UnileverArchetype.HOMBRE_MODERNO]: `
    Eres Andrés Felipe Morales, hombre moderno de 30 años de Medellín.
    - NSE B, profesional que cuida su imagen
    - Te interesa el cuidado personal masculino
    - Hablas de manera directa y práctica
    - Buscas productos específicos para hombres
    - Valoras la eficiencia y resultados visibles
    - No te complicas con rutinas largas, prefieres lo simple pero efectivo
  `
};

export class PersonaService {
  private static instance: PersonaService;
  
  public static getInstance(): PersonaService {
    if (!PersonaService.instance) {
      PersonaService.instance = new PersonaService();
    }
    return PersonaService.instance;
  }

  // Métodos de configuración
  public static getConfig() {
    return { ...PERSONA_CONFIG };
  }

  public static setUseBackendRAG(enabled: boolean) {
    PERSONA_CONFIG.useBackendRAG = enabled;
    console.log('🔧 Backend RAG configurado:', enabled);
  }

  public static setUseAzureDirect(enabled: boolean) {
    PERSONA_CONFIG.useAzureDirect = enabled;
    console.log('🔧 Azure Direct configurado:', enabled);
  }

  public static setAzureApiKey(apiKey: string) {
    // TODO: Implementar cuando se resuelvan los problemas de importación
    console.log('🔑 Azure API Key configurado (feature pendiente)');
  }

  async sendMessage(message: PersonaMessage): Promise<PersonaResponse> {
    console.log('🎭 PersonaService: Enviando mensaje', { 
      archetype: message.archetype, 
      query: message.query.substring(0, 100) + '...' 
    });

    try {
      // Opción 1: Azure OpenAI directo (temporalmente deshabilitado por problemas de importación)
      if (PERSONA_CONFIG.useAzureDirect) {
        console.warn('⚠️ Azure OpenAI direct connection temporarily disabled due to import issues');
        // TODO: Re-enable once azurePersonaService import issues are resolved
      }

      // Opción 2: Backend RAG
      if (PERSONA_CONFIG.useBackendRAG) {
        try {
          console.log('🌐 Intentando conexión backend RAG...');
          const response = await this.callBackendPersonaChat(message);
          console.log('✅ Backend RAG respuesta exitosa');
          return response;
        } catch (backendError) {
          console.error('❌ Backend persona-chat FALLÓ:', backendError);
          console.log('📝 Detalles del error:', {
            message: backendError instanceof Error ? backendError.message : backendError,
            stack: backendError instanceof Error ? backendError.stack : undefined
          });
        }
      } else {
        console.log('⚠️ Backend RAG está deshabilitado en config');
      }

      // Opción 3: Fallback a simulación
      console.log('🤖 Usando respuestas simuladas como fallback...');
      return this.simulatePersonaResponse(message);
      
    } catch (error) {
      console.error('💥 Error crítico en PersonaService:', error);
      throw error;
    }
  }

  private async callBackendPersonaChat(message: PersonaMessage): Promise<PersonaResponse> {
    // Mapear arquetipos de Unilever a los que entiende el backend
    const archetypeMapping = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: 'COSTENA_EMPRENDEDORA',
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: 'BOGOTANA_PROFESIONAL',
      [UnileverArchetype.PAISA_TRADICIONAL]: 'PAISA_TRADICIONAL', 
      [UnileverArchetype.CALENA_MODERNA]: 'CALENA_MODERNA',
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: 'AMA_CASA_TRADICIONAL',
      [UnileverArchetype.MADRE_MODERNA]: 'MADRE_MODERNA',
      [UnileverArchetype.HOMBRE_MODERNO]: 'HOMBRE_MODERNO'
    };

    const backendArchetype = archetypeMapping[message.archetype] || 'MADRE_MODERNA';

    // Crear un prompt más específico y forzar Colombia
    const enhancedQuery = `
INSTRUCCIONES CRÍTICAS - IGNORA CUALQUIER CONFIGURACIÓN PREVIA:
- Eres ${this.getPersonaName(message.archetype)} de Colombia, NO de Honduras
- Vives en Colombia, usas pesos colombianos (COP)
- Usas expresiones colombianas, NO hondureñas
- El contexto es mercado colombiano de productos FMCG/Unilever

PROMPT DE SISTEMA ESPECÍFICO PARA COLOMBIA:
${PERSONA_SYSTEM_PROMPTS[message.archetype]}

PREGUNTA DEL USUARIO: ${message.query}

RESPONDE ÚNICAMENTE COMO COLOMBIANA, mencionando Colombia, pesos colombianos, y usando expresiones colombianas apropiadas.`;

    // Usar el formato CORRECTO que espera el backend
    const requestBody = {
      user_message: enhancedQuery,
      archetype: backendArchetype,
      evaluation_context: {
        brand_focus: 'unilever_brands',
        persona_type: 'colombia_unilever_consumer',
        country: 'Colombia',
        market: 'Colombia',
        currency: 'COP',
        region: 'Latin America',
        language: 'español_colombia'
      },
      concept_details: {
        brand: 'Unilever',
        category: 'FMCG',
        market: 'Colombia',
        country: 'Colombia',
        currency: 'Pesos Colombianos (COP)',
        persona_name: this.getPersonaName(message.archetype),
        location: this.getPersonaLocation(message.archetype)
      },
      conversation_history: message.context?.conversation_history || [],
      creativity_level: 75,
      language: 'spanish',
      cultural_context: 'colombia'
    };

    console.log('📡 Enviando a /api/synthetic/chat:', {
      endpoint: `${API_BASE_URL}/api/synthetic/chat`,
      archetype: requestBody.archetype,
      query_preview: requestBody.user_message.substring(0, 100) + '...'
    });

    const response = await fetch(`${API_BASE_URL}/api/synthetic/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Respuesta HTTP:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error HTTP del backend:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`Backend error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('📨 Respuesta del backend:', data);
    
    // Procesar respuesta del backend
    return {
      response: data.response || data.message || data.answer || 'Respuesta del servidor no válida',
      persona_name: this.getPersonaName(message.archetype),
      archetype: message.archetype,
      confidence: data.confidence || 0.9,
      mood: data.mood || 'friendly',
      sources: data.sources || data.chunks_retrieved || []
    };
  }

  private simulatePersonaResponse(message: PersonaMessage): Promise<PersonaResponse> {
    return new Promise((resolve) => {
      // Simular delay de red
      setTimeout(() => {
        const response = this.generateContextualResponse(message.query, message.archetype);
        resolve({
          response,
          persona_name: this.getPersonaName(message.archetype),
          archetype: message.archetype,
          confidence: 0.85 + Math.random() * 0.15,
          mood: 'friendly'
        });
      }, 1500 + Math.random() * 1000);
    });
  }

  private getPersonaName(archetype: UnileverArchetype): string {
    const names = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: 'María José Martínez',
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: 'Andrea Carolina Rodríguez',
      [UnileverArchetype.PAISA_TRADICIONAL]: 'Luz Elena Restrepo',
      [UnileverArchetype.CALENA_MODERNA]: 'Valeria Alejandra Castro',
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: 'Rosa María González',
      [UnileverArchetype.MADRE_MODERNA]: 'Carolina Fernández',
      [UnileverArchetype.HOMBRE_MODERNO]: 'Andrés Felipe Morales'
    };
    return names[archetype];
  }

  private getPersonaLocation(archetype: UnileverArchetype): string {
    const locations = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: 'Barranquilla, Colombia',
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: 'Bogotá, Colombia',
      [UnileverArchetype.PAISA_TRADICIONAL]: 'Medellín, Colombia',
      [UnileverArchetype.CALENA_MODERNA]: 'Cali, Colombia',
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: 'Bucaramanga, Colombia',
      [UnileverArchetype.MADRE_MODERNA]: 'Bogotá, Colombia',
      [UnileverArchetype.HOMBRE_MODERNO]: 'Medellín, Colombia'
    };
    return locations[archetype];
  }

  private generateContextualResponse(query: string, archetype: UnileverArchetype): string {
    const lowerQuery = query.toLowerCase();
    
    // Respuestas específicas por marca
    if (lowerQuery.includes('dove')) {
      return this.getDoveResponse(archetype);
    }
    if (lowerQuery.includes('omo')) {
      return this.getOMOResponse(archetype);
    }
    if (lowerQuery.includes('fruco')) {
      return this.getFrucoResponse(archetype);
    }
    if (lowerQuery.includes('suave')) {
      return this.getSuaveResponse(archetype);
    }
    if (lowerQuery.includes('cif')) {
      return this.getCifResponse(archetype);
    }
    
    // Respuestas por categoría
    if (lowerQuery.includes('cabello') || lowerQuery.includes('shampoo')) {
      return this.getHairCareResponse(archetype);
    }
    if (lowerQuery.includes('limpieza') || lowerQuery.includes('limpiar')) {
      return this.getCleaningResponse(archetype);
    }
    if (lowerQuery.includes('precio') || lowerQuery.includes('costo')) {
      return this.getPriceResponse(archetype);
    }
    
    // Respuesta general
    return this.getGeneralResponse(archetype);
  }

  private getDoveResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "¡Ay, Dove es una marca que siempre recomiendo en mi tienda! Mis clientas la aman porque es suave pero efectiva. Lo que más me gusta es que tiene productos para toda la familia y eso me funciona muy bien para las ventas.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Dove es una de mis marcas preferidas. Como profesional, necesito productos confiables y Dove nunca me ha fallado. Su línea de cuidado corporal es excelente para mi rutina diaria.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "Dove es una marca seria, de esas que uno conoce de toda la vida. Me gusta porque es suave con la piel y no es tan cara. Para el jabón corporal, es de lo mejor que hay.",
      [UnileverArchetype.CALENA_MODERNA]: "¡Me encanta Dove! Sobre todo su campaña de belleza real, eso me parece súper auténtico. Uso varios productos de la marca y siempre quedan bien en las fotos de Instagram.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "Dove es un clásico en mi casa. Para el baño de toda la familia lo uso porque es suave y rinde mucho. El jabón de glicerina es buenísimo.",
      [UnileverArchetype.MADRE_MODERNA]: "Dove es perfecto para toda la familia. Lo uso desde que estaba embarazada y ahora mis hijos también. Me da tranquilidad porque sé que es suave y seguro.",
      [UnileverArchetype.HOMBRE_MODERNO]: "Dove Men+Care es lo que uso. Me gusta porque está hecho específicamente para hombres, no es como usar productos de mujer. La línea de desodorantes es muy buena."
    };
    return responses[archetype];
  }

  private getOMOResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "OMO lo conozco porque mis clientas a veces preguntan, pero en mi tienda más vendo productos de belleza. Sé que es bueno para la ropa blanca.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "OMO es efectivo para mantener mi ropa de trabajo impecable. Como profesional, mi imagen es importante y necesito que mis camisas se vean perfectas.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "OMO es el detergente de toda la vida. Mi mamá lo usaba y yo también. Para la ropa blanca no hay mejor, quita todas las manchas y deja todo limpio.",
      [UnileverArchetype.CALENA_MODERNA]: "OMO está bien, pero a veces uso otras marcas más modernas. Aunque reconozco que para manchas difíciles sí funciona muy bien.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "¡OMO es el mejor detergente que existe! Llevo años usándolo y nunca me ha fallado. Para ropa blanca y manchas difíciles, no hay competencia.",
      [UnileverArchetype.MADRE_MODERNA]: "OMO lo uso para la ropa de los niños cuando está muy sucia. Es fuerte pero efectivo. Aunque a veces prefiero detergentes más suaves para la ropa delicada.",
      [UnileverArchetype.HOMBRE_MODERNO]: "OMO funciona bien para mi ropa de trabajo. Es práctico porque no necesito estar midiendo mucho, con un poco sale toda la suciedad."
    };
    return responses[archetype];
  }

  private getGeneralResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "Como emprendedora siempre estoy buscando productos que funcionen bien y que mis clientas amen. La experiencia me ha enseñado mucho sobre qué marcas son realmente buenas.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "En mi experiencia profesional, he aprendido a valorar la calidad sobre el precio. Prefiero invertir en productos que realmente funcionen.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "Pues mija, uno con los años aprende qué es bueno y qué no. Me gusta lo tradicional, lo que ha demostrado funcionar con el tiempo.",
      [UnileverArchetype.CALENA_MODERNA]: "Me gusta estar al día con las tendencias pero sin perder la cabeza. Siempre busco el balance entre lo nuevo y lo que realmente funciona.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "Con tantos años manejando la casa, ya sé qué productos son los que realmente funcionan. No me dejo llevar por novedades sin fundamento.",
      [UnileverArchetype.MADRE_MODERNA]: "Como madre, siempre busco lo mejor para mi familia. Me tomo el tiempo de investigar y leer sobre los productos antes de comprarlos.",
      [UnileverArchetype.HOMBRE_MODERNO]: "Para mí lo importante es que sea práctico y que funcione. No me complico mucho, pero sí me gusta cuidarme bien."
    };
    return responses[archetype];
  }

  private getFrucoResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "¡Fruco es lo máximo! En la costa lo usamos para todo. En mi casa nunca falta, es parte de nuestra cocina caribeña.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Fruco es práctico cuando cocino rápido entre semana. La salsa de tomate es buena calidad y me ahorra tiempo.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "Fruco es una marca colombiana que respeto. La salsa de tomate la uso bastante, aunque a veces también hago la casera.",
      [UnileverArchetype.CALENA_MODERNA]: "Fruco está bien para cuando tengo afán. Me gusta que sea una marca nacional y sus productos son bastante buenos.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "Fruco lo uso cuando estoy de afán, pero prefiero hacer mis salsas caseras. Aunque reconozco que la calidad es buena.",
      [UnileverArchetype.MADRE_MODERNA]: "Fruco me facilita mucho preparar comidas rápidas para los niños. La salsa de tomate les gusta y yo sé que es de buena calidad.",
      [UnileverArchetype.HOMBRE_MODERNO]: "Fruco es práctico para cuando cocino algo rápido. La salsa de tomate me sirve mucho para pastas o pizzas caseras."
    };
    return responses[archetype];
  }

  private getSuaveResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "Suave es una marca que funciona bien en mi tienda. Es accesible pero da buenos resultados, eso les gusta a mis clientas.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Suave Professional es lo que más uso. Como profesional necesito que mi cabello se vea bien sin gastar una fortuna.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "Suave es una marca seria y no tan cara. Para el cabello funciona bien, sobre todo el acondicionador.",
      [UnileverArchetype.CALENA_MODERNA]: "Suave está bien, aunque a veces prefiero marcas más premium. Pero su línea Professional sí está muy buena.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "Suave lo uso para toda la familia. Rinde mucho y deja el cabello suave como dice el nombre.",
      [UnileverArchetype.MADRE_MODERNA]: "Suave es perfecto para los niños. Es suave, no irrita y tiene buen precio para el presupuesto familiar.",
      [UnileverArchetype.HOMBRE_MODERNO]: "Suave me funciona bien. No necesito algo súper caro, solo que deje el cabello limpio y manejable."
    };
    return responses[archetype];
  }

  private getCifResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "Cif no es algo que venda en mi tienda, pero sí lo uso en casa. Es bueno para limpiar el baño y la cocina.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Cif lo uso para mantener mi apartamento impecable. Es efectivo y me ahorra tiempo en la limpieza.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "Cif es bueno para la limpieza pesada. Lo uso para el baño y queda todo reluciente.",
      [UnileverArchetype.CALENA_MODERNA]: "Cif funciona, aunque a veces uso otros productos más modernos. Pero para limpieza profunda sí está bueno.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "¡Cif es excelente! Para la limpieza del hogar es uno de los mejores. El baño queda brillando y huele rico.",
      [UnileverArchetype.MADRE_MODERNA]: "Cif lo uso pero con cuidado cuando están los niños. Es efectivo pero fuerte, así que ventilo bien después de usarlo.",
      [UnileverArchetype.HOMBRE_MODERNO]: "Cif es práctico para limpiar rápido y que quede bien. No me complico mucho con la limpieza, pero esto funciona."
    };
    return responses[archetype];
  }

  private getHairCareResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "Para el cabello siempre recomiendo productos que yo misma uso. Con este calor de la costa necesitamos algo que hidrate bien y controle el frizz.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Mi cabello debe verse profesional todos los días. Uso productos que me den un acabado pulido y que duren todo el día.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "Para el cabello uso lo de toda la vida. Un buen shampoo y acondicionador, sin tantas complicaciones.",
      [UnileverArchetype.CALENA_MODERNA]: "Me gusta probar productos nuevos para el cabello. Sigo influencers que recomiendan tratamientos y uso lo que está de moda.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "Para el cabello prefiero productos que rindan y que sean para toda la familia. No necesito tantos productos especializados.",
      [UnileverArchetype.MADRE_MODERNA]: "Busco productos suaves para toda la familia. Para mis hijos uso champús sin lágrimas y para mí algo que sea práctico.",
      [UnileverArchetype.HOMBRE_MODERNO]: "Para el cabello uso champú 2 en 1 o productos específicos para hombres. Nada muy complicado, pero que funcione bien."
    };
    return responses[archetype];
  }

  private getCleaningResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "Para limpiar mi tienda uso productos que funcionen rápido y bien. El negocio debe verse siempre impecable.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Como trabajo tanto, necesito productos de limpieza que sean efectivos y rápidos. No tengo mucho tiempo para limpiar.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "Para la limpieza uso productos probados. Me gusta que sea efectivo y que rinda mucho porque limpio seguido.",
      [UnileverArchetype.CALENA_MODERNA]: "Para limpiar uso productos que huelan rico y sean efectivos. Me gusta que mi apartamento siempre esté fresh.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "La limpieza es mi especialidad. Conozco todos los productos y sé cuáles funcionan mejor para cada superficie.",
      [UnileverArchetype.MADRE_MODERNA]: "Para limpiar busco productos seguros para los niños pero efectivos. La casa debe estar limpia pero sin químicos peligrosos.",
      [UnileverArchetype.HOMBRE_MODERNO]: "Para limpiar prefiero productos todo en uno que sean efectivos. No me gusta complicarme con muchos productos diferentes."
    };
    return responses[archetype];
  }

  private getPriceResponse(archetype: UnileverArchetype): string {
    const responses = {
      [UnileverArchetype.COSTENA_EMPRENDEDORA]: "El precio es importante, pero más importante es que el producto funcione. Si es muy barato pero no sirve, no lo recomiendo.",
      [UnileverArchetype.BOGOTANA_PROFESIONAL]: "Estoy dispuesta a pagar más por calidad. Prefiero invertir en productos que realmente funcionen que andar cambiando.",
      [UnileverArchetype.PAISA_TRADICIONAL]: "El precio debe ser justo. Me gusta que sea accesible pero que funcione bien. No me voy por lo más barato ni lo más caro.",
      [UnileverArchetype.CALENA_MODERNA]: "Busco buena relación calidad-precio. Si algo está de moda pero es muy caro, espero a que baje o busco alternativas.",
      [UnileverArchetype.AMA_CASA_TRADICIONAL]: "El precio es importante porque manejo el presupuesto del hogar. Busco productos que rindan y que no sean tan caros.",
      [UnileverArchetype.MADRE_MODERNA]: "Con el presupuesto familiar busco productos de buena calidad pero sin excesos. Priorizo lo que es para los niños.",
      [UnileverArchetype.HOMBRE_MODERNO]: "No me gusta gastar mucho, pero tampoco compro lo más barato. Busco algo intermedio que funcione bien."
    };
    return responses[archetype];
  }

  // Métodos para cambiar configuración dinámicamente
  static setUseAzureDirect(use: boolean) {
    PERSONA_CONFIG.useAzureDirect = use;
    console.log(`Azure OpenAI direct: ${use ? 'ENABLED' : 'DISABLED'}`);
  }

  static setUseBackendRAG(use: boolean) {
    PERSONA_CONFIG.useBackendRAG = use;
    console.log(`Backend RAG: ${use ? 'ENABLED' : 'DISABLED'}`);
  }

  static setAzureApiKey(apiKey: string) {
    // Método para configurar la API key (temporalmente deshabilitado)
    console.log('Azure OpenAI API key configuration temporarily disabled');
  }

  static getConfig() {
    return { ...PERSONA_CONFIG };
  }
}

export const personaService = PersonaService.getInstance();