import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Language identification
      languageCode: 'en',
      
      // Navigation & Layout
      nav: {
        selectModule: 'Select Module',
        backToMenu: 'Back to Menu',
        dashboard: 'Dashboard',
        settings: 'Settings'
      },
      
      // Authentication
      auth: {
        title: 'Unilever RAG Intelligence System',
        subtitle: 'Access market insights powered by AI',
        username: 'Username',
        password: 'Password',
        login: 'Login',
        loginError: 'Invalid credentials',
        loading: 'Signing in...'
      },
      
      // Module Selection
      modules: {
        title: 'Select a RAG Module',
        subtitle: 'Specialized system for Unilever brand insights analysis with advanced AI. Choose the module that best fits your research needs.',
        intelligent: {
          title: 'Intelligent RAG',
          subtitle: 'Unified intelligent search system',
          description: 'Adaptive search that automatically determines the best strategy for each query. With smart retry, in-depth analysis and optimized retrieval for complex cases.',
          features: [
            'Automatic adaptive search',
            'Smart Retry System for better quality',
            'Deep Search up to 15 chunks',
            'Brand-specific strategies',
            'Descriptive, strategic and predictive analysis'
          ],
          badge: 'RECOMMENDED',
          button: 'Access Intelligent RAG'
        },
        creative: {
          title: 'Creative RAG',
          subtitle: 'Creative insights with full transparency',
          description: 'Combines real study data with creative analysis. ALWAYS indicates what information comes from real studies vs generated insights. Perfect for brainstorming with solid foundation.',
          features: [
            'Full transparency: Real vs Generated',
            'Data-based insights + creativity',
            'Clear information source indicators',
            'Automatic visualizations',
            'Creative strategic recommendations'
          ],
          badge: 'TRANSPARENT',
          button: 'Access Creative RAG'
        },
        synthetic: {
          title: 'Synthetic Personas',
          subtitle: 'Colombian virtual users system',
          description: 'Chat with authentic Colombian synthetic personas with 80+ variables each. Detailed profiles of Unilever brand consumers.',
          features: [
            'Complete Colombian archetypes',
            '80+ variables per persona',
            'Authentic cultural context',
            'Detailed relationship with Unilever brands',
            'Advanced contextual chat'
          ],
          badge: '',
          button: 'Access Synthetic Personas'
        }
      },
      
      // Chat Interface
      chat: {
        title: 'Chat',
        placeholder: 'Type your question about Unilever insights...',
        send: 'Send',
        thinking: 'Thinking...',
        analyzing: 'Analyzing with intelligent search...',
        retrying: 'Retrying with improved strategy...',
        attemptNumber: 'Attempt',
        deepSearch: 'Intelligent deep search',
        creativity: 'Creativity',
        creativityLevel: 'Creativity Level',
        noMessages: 'No messages yet. Start a conversation!',
        clearChat: 'Clear Chat',
        exportChat: 'Export Chat',
        searchHistory: 'Search History',
        newChat: 'New Chat',
        welcomeTitle: 'Creative RAG - Insights with Full Transparency',
        welcomeMessage: 'I combine real study data with creative analysis. I ALWAYS indicate what information comes from real studies vs generated insights. Ask me about Unilever brands, consumers, or market trends.',
        
        // Creative specific translations
        generatingCreativeInsights: 'Generating creative insights...',
        detectingImageNeed: '🎨 I detected you need an image. Generating visual with DALL-E...',
        confirmClearCreative: 'Are you sure you want to clear the creative chat?',
        imageGenerated: '🎨 **Generated image**: {{prompt}}',
        creativitySubtitle: 'Creative insights with full transparency',
        imagesToday: 'images today',
        creativeWelcomeDescription: 'Combines real study data with creative analysis. <strong>Always indicates</strong> what information comes from studies vs generated insights',
        creativeModeActive: 'Creative Mode Activated',
        creativeModeDescription: 'Generates automatic visualizations, innovative insights and strategic recommendations based on data',
        imageGeneratedWithDallE: 'Image Generated with DALL-E',
        prompt: 'Prompt',
        creatingInsights: 'Creating insights...',
        creativePlaceholder: 'Describe your idea or generate creative insights...',
        generateImageDallE: 'Generate image with DALL-E',
        dailyLimitReachedCount: 'Daily limit reached ({{current}}/{{limit}})',
        generating: 'Generating...',
        image: 'Image',
        creativeModeLevel: 'Creative Mode: Innovative insights with {{level}}% creativity level',
        generateVisualImage: 'Generate visual image',
        dailyLimitReached: 'Daily limit reached',
        
        // Creative prompts
        creativePrompts: {
          innovativeDove: {
            title: 'Innovative Dove Ideas',
            prompt: 'Propose 5 disruptive concepts for Dove that revolutionize personal care in Colombia'
          },
          disruptiveMaizena: {
            title: 'Disruptive Maizena Strategy',
            prompt: 'Design an innovative strategy to position Maizena as a lifestyle brand in Colombia'
          },
          innovationSedal: {
            title: 'Sedal Innovation',
            prompt: 'Create 3 revolutionary product lines for Sedal aimed at the modern Colombian market'
          },
          disruptionSavital: {
            title: 'Savital Disruption',
            prompt: 'Propose a complete transformation of Savital to capture new segments in Colombia'
          }
        }
      },
      
      // Personas
      personas: {
        title: 'Colombian Consumer Personas',
        selectPersona: 'Select Persona',
        chatWith: 'Chat with',
        characteristics: 'Characteristics',
        demographics: 'Demographics',
        behavior: 'Behavior',
        brands: 'Brand Relationship',
        
        // Specific personas
        costeña: {
          name: 'María José',
          archetype: 'Coastal Entrepreneur',
          location: 'Barranquilla, Caribbean Coast',
          age: '32 years old',
          occupation: 'Beauty store owner'
        },
        bogotana: {
          name: 'Catalina',
          archetype: 'Professional from Bogotá',
          location: 'Bogotá, Andean Region',
          age: '29 years old', 
          occupation: 'Systems engineer'
        },
        paisa: {
          name: 'Luz Elena',
          archetype: 'Traditional Paisa',
          location: 'Medellín, Antioquia',
          age: '45 years old',
          occupation: 'Dedicated homemaker'
        },
        madre: {
          name: 'Andrea',
          archetype: 'Modern Mother',
          location: 'Bogotá, Cundinamarca',
          age: '35 years old',
          occupation: 'Marketing manager with 2 children'
        },
        
        // Synthetic module specific
        systemDescription: 'Basic virtual users system',
        configureServices: 'Configure services',
        advancedSystemTitle: 'Advanced Synthetic Personas System',
        advancedSystemDescription: 'Complete tools for concept validation with authentic Colombian consumers.',
        evaluateConcepts: 'Evaluate Concepts',
        editPersonas: 'Edit Personas',
        age: 'Age',
        years: 'years',
        nse: 'NSE',
        city: 'City',
        chatAvailableAfterEvaluation: 'Chat available after evaluating concepts',
        completeValidationSystem: 'Complete Validation System',
        systemFeatures: '🇨🇴 Authentic Personas: Each archetype has 80+ specific Colombian variables • 💬 Intelligent Chat: Natural conversations with cultural context • 🧪 Concept Evaluation: Automatic validation with multiple personas • ✏️ Advanced Editor: Customize characteristics according to your research'
      },
      
      // Concept Evaluator translations
      conceptEvaluator: {
        title: 'Concept Evaluator',
        subtitle: 'Evaluate product and campaign concepts with Colombian synthetic personas',
        conceptInformation: 'Concept Information',
        conceptType: 'Concept Type',
        productConcept: 'Product Concept',
        communicationCampaign: 'Communication Campaign',
        conceptTitle: 'Concept Title',
        conceptTitlePlaceholder: 'Ex: Dove Advanced Hair Repair',
        completeDescription: 'Complete Description',
        descriptionPlaceholder: 'Describe in detail the concept, characteristics, benefits, value proposition...',
        category: 'Category',
        categoryPlaceholder: 'Ex: Hair Care, Home Cleaning, Food',
        targetAudience: 'Target Audience',
        targetAudiencePlaceholder: 'Ex: Women 25-40 years old, NSE B/C+, urban',
        profilesToEvaluate: 'Profiles to Evaluate',
        profilesSelected: 'selected',
        evaluationTone: 'Evaluation Tone',
        verySkeptical: 'Very Skeptical',
        veryPositive: 'Very Positive',
        toneDescriptions: {
          verySkeptical: 'Personas will be very critical and question everything',
          skeptical: 'Personas will be cautious and mention doubts',
          balanced: 'Personas will give a balanced evaluation',
          positive: 'Personas will focus on positive aspects',
          veryPositive: 'Personas will be very receptive and optimistic'
        },
        evaluateWith: 'Evaluate with',
        person: 'Person',
        people: 'People',
        evaluating: 'Evaluating with',
        of: 'of',
        personas: 'personas...',
        personasWhoWillEvaluate: 'Personas Who Will Evaluate',
        realTimeResults: 'Real-Time Results',
        summaryCards: {
          overallScore: 'Overall Score',
          appeal: 'Appeal',
          understanding: 'Understanding',
          purchaseIntent: 'Purchase Intent',
          credibility: 'Credibility',
          benefits: 'Benefits',
          recommendation: 'Recommendation'
        },
        detailedAnalysis: {
          justifications: 'Justifications',
          overallScore: 'Overall Score',
          credibility: 'Credibility',
          priceAnalysis: 'Price Analysis',
          currentSpending: 'Currently spends',
          wouldPay: 'Would pay',
          ingredientAnalysis: 'Ingredient Analysis',
          comments: 'Comments',
          positiveAspects: 'Positive Aspects',
          concerns: 'Concerns'
        },
        strategicRecommendations: 'Strategic Recommendations',
        suggestedActions: 'Suggested Actions',
        exportResults: 'Export Results',
        evaluateAnother: 'Evaluate Another Concept',
        evaluateAnotherConcept: 'Evaluate Another Concept',
        chatAboutEvaluation: 'Chat about evaluation',
        completeFormValidation: 'Please complete at least the title and description of the concept',
        selectProfilesValidation: 'Please select at least one profile to evaluate',
        selectProfilesText: 'Select profiles to evaluate',
        fullDescription: 'Full Description',
        personsWhoWillEvaluate: 'Persons Who Will Evaluate',
        persons: 'Persons',
        placeholders: {
          conceptTitle: 'Ex: Dove Advanced Hair Repair',
          description: 'Describe in detail the concept, characteristics, benefits, value proposition...',
          category: 'Ex: Hair Care, Home Cleaning, Food',
          targetAudience: 'Ex: Women 25-40 years old, NSE B/C+, urban'
        },
        results: {
          overallScore: 'Overall Score',
          appeal: 'Appeal',
          understanding: 'Understanding',
          purchaseIntent: 'Purchase Intent',
          credibility: 'Credibility',
          benefits: 'Benefits',
          recommendation: 'Recommendation'
        },
        toneLabels: {
          verySkeptical: 'Very Skeptical',
          verySceptical: 'Very Skeptical',
          skeptical: 'Skeptical', 
          balanced: 'Balanced',
          positive: 'Positive',
          veryPositive: 'Very Positive'
        },
        priority: {
          high: 'High',
          medium: 'Medium',
          opportunity: 'Opportunity'
        }
      },
      
      // Concept Chat translations
      conceptChat: {
        welcomeMessage: 'Hello, I am {{name}}. I already evaluated your concept "{{concept}}" and gave it a score of {{score}}/10. Would you like me to elaborate on any specific aspect of my evaluation?',
        thinking: 'Thinking...',
        askAboutEvaluation: 'Ask me about my evaluation:',
        inputPlaceholder: 'Ask about my concept evaluation...',
        contextualQuestions: {
          whyScore: 'Why did you give it a {{score}}/10?',
          mainConcerns: 'What concerns you most about the concept?',
          improvements: 'How would you improve the concept?',
          pricePoint: 'At what price would you buy it?'
        }
      },
      
      // Intelligent RAG Module
      intelligentRAG: {
        title: 'Intelligent RAG System',
        subtitle: 'Unified intelligent search system that automatically adapts its strategy to get the best Unilever insights',
        features: {
          adaptiveSearch: {
            title: 'Adaptive Search',
            description: 'Automatically detects query type and adapts search strategy for better results'
          },
          smartRetry: {
            title: 'Smart Retry',
            description: 'Evaluates response quality and automatically retries with improved strategies'
          },
          deepAnalysis: {
            title: 'Deep Analysis',
            description: 'In-depth search with up to 15 chunks for complex cases like Pond\'s or specific brands'
          }
        },
        config: {
          title: 'Intelligent Configuration',
          searchDepth: 'Search Depth',
          maxChunks: 'Maximum Chunks',
          smartRetry: 'Smart Retry',
          temporalRanking: 'Temporal Ranking',
          historical: 'Historical',
          recent: 'Recent',
          balanced: 'Balanced',
          standard: 'Standard',
          deepSearch: 'Deep Search',
          comprehensive: 'Comprehensive',
          debugNormalization: 'Debug Normalization',
          intelligentConfig: 'Intelligent configuration',
          exportConversation: 'Export conversation',
          clearChat: 'Clear chat'
        },
        status: {
          deepSearch: 'Deep Search',
          comprehensive: 'Comprehensive',
          standard: 'Standard',
          maxChunks: 'Max {{count}} chunks',
          smartRetry: 'Smart Retry',
          historical: 'Historical',
          recent: 'Recent',
          balanced: 'Balanced'
        }
      },
      
      // Configuration
      config: {
        title: 'Configuration',
        language: 'Language',
        selectLanguage: 'Select Language',
        ragSettings: 'RAG Settings',
        maxChunks: 'Maximum Chunks',
        creativityLevel: 'Creativity Level',
        temporalRanking: 'Temporal Ranking',
        similarityThreshold: 'Similarity Threshold',
        save: 'Save',
        reset: 'Reset',
        advanced: 'Advanced Settings'
      },
      
      // Language Selector
      languages: {
        en: 'English',
        es: 'Español',
        fr: 'Français'
      },
      
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        logout: 'Logout',
        user: 'User',
        transparent: 'TRANSPARENT',
        exportConversation: 'Export conversation',
        clearChat: 'Clear chat',
        configuration: 'Configuration',
        create: 'Create',
        download: 'Download',
        backToHome: 'Back to home'
      },
      
      // Error messages
      errors: {
        connectionError: 'Connection error. Make sure the backend is running',
        dailyImageLimit: 'You have reached the daily limit of {{limit}} images. Try tomorrow.',
        imageGenerationError: 'Error generating the image. Try again.'
      },
      
      // Status Messages
      status: {
        connecting: 'Connecting...',
        connected: 'Connected',
        disconnected: 'Disconnected',
        processing: 'Processing...',
        completed: 'Completed',
        failed: 'Failed'
      },
      
      // Insights Categories
      insights: {
        brands: 'Brands & Products',
        segmentation: 'Segmentation & Audiences',
        behavior: 'Consumer Behavior',
        trends: 'Trends & Market',
        competition: 'Competition & Positioning',
        innovation: 'Innovation & Products'
      },
      
      // Question Suggestions
      suggestions: {
        title: 'Suggested Questions',
        brands: {
          dove: 'What are the main perceptions about Dove?',
          fruco: 'How is Fruco positioned vs competition?',
          omo: 'What insights do you have about OMO in the market?'
        },
        audience: {
          segments: 'What are the main consumer segments?',
          behavior: 'How does behavior vary by age and gender?',
          millennials: 'What do we know about millennial consumers?'
        },
        trends: {
          emerging: 'What are the emerging trends in personal care?',
          postPandemic: 'How is the market evolving post-pandemic?',
          sustainability: 'What sustainability trends are important?'
        }
      },
      
      // Persona Chat
      personaChat: {
        title: 'Chat with {{name}}',
        backButton: 'Back',
        saveConversation: 'Save conversation',
        typing: 'Writing...',
        suggestedQuestions: 'Suggested questions:',
        placeholder: 'Write your question...',
        
        // Predefined Questions
        questions: {
          costenaEmprendedora: [
            'What do you think of Dove brand for skin care?',
            'How do you choose products for your beauty store?',
            'What brands would you recommend for an entrepreneur woman like you?',
            'What is your daily personal care routine?',
            'What do you think about price versus quality in beauty products?'
          ],
          bogotanaProfesional: [
            'How do you integrate personal care products into your professional routine?',
            'What characteristics do you look for in professional hair shampoo?',
            'What is your opinion about Suave Professional?',
            'Do you prefer premium or accessible products for your daily routine?',
            'What brands do you consider most reliable for a professional?'
          ],
          paisaTradicional: [
            'What do you think of OMO compared to other detergents?',
            'How do you decide what cleaning products to use at home?',
            'What brand of seasonings do you prefer: Fruco or homemade?',
            'What are your lifelong brands?',
            'What seems more important to you: tradition or innovation?'
          ],
          calenaModerna: [
            'What do you think of current trends in hair care?',
            'Do you use natural products like Natura?',
            'How do you balance price and quality in your purchases?',
            'What do you think of Dove products for young women?',
            'Do you follow influencers to decide what products to buy?'
          ],
          amaCasaTradicional: [
            'How do you maintain home cleanliness with effective products?',
            'What do you think of Cif for deep cleaning?',
            'Do you prefer products that last long or clean quickly?',
            'What is your secret for a always clean house?',
            'What brands have been with you the longest?'
          ],
          madreModerna: [
            'How do you choose safe products for the whole family?',
            'What do you think of Dove Baby for children care?',
            'Do you look for natural ingredients in children products?',
            'How do you organize the family personal care routine?',
            'What brands do you consider most reliable for mothers?'
          ],
          hombreModerno: [
            'What do you think of Dove Men+Care for masculine care?',
            'Do you prefer products specific for men or unisex?',
            'How is your morning personal care routine?',
            'What characteristics do you look for in a deodorant?',
            'Do you consider skin care important for men?'
          ]
        },
        
        // Persona descriptions
        descriptions: {
          costenaEmprendedora: 'I am an entrepreneur and I run a beauty store in Barranquilla.',
          bogotanaProfesional: 'I am a professional who works in Bogotá and I value quality very much.',
          paisaTradicional: 'I am from Medellín and I like traditional and reliable things.',
          calenaModerna: 'I am a modern young woman from Cali who follows the latest trends.',
          amaCasaTradicional: 'I am dedicated to home and I know cleaning products well.',
          madreModerna: 'I am a mother and I always look for the best for my family.',
          hombreModerno: 'I am a man who takes care of his image and values quality products.'
        }
      }
    }
  },
  es: {
    translation: {
      // Language identification
      languageCode: 'es',
      
      // Navigation & Layout
      nav: {
        selectModule: 'Seleccionar Módulo',
        backToMenu: 'Volver al Menú',
        dashboard: 'Dashboard', 
        settings: 'Configuración'
      },
      
      // Authentication
      auth: {
        title: 'Sistema de Inteligencia RAG Unilever',
        subtitle: 'Accede a insights de mercado potenciados por IA',
        username: 'Usuario',
        password: 'Contraseña',
        login: 'Iniciar Sesión',
        loginError: 'Credenciales inválidas',
        loading: 'Iniciando sesión...'
      },
      
      // Module Selection
      modules: {
        title: 'Selecciona un Módulo RAG',
        subtitle: 'Sistema especializado para análisis de insights de marcas Unilever con IA avanzada. Elige el módulo que mejor se adapte a tus necesidades de investigación.',
        intelligent: {
          title: 'RAG Inteligente',
          subtitle: 'Sistema unificado de búsqueda inteligente',
          description: 'Búsqueda adaptativa que determina automáticamente la mejor estrategia para cada consulta. Con retry inteligente, análisis en profundidad y recuperación optimizada para casos complejos.',
          features: [
            'Búsqueda adaptativa automática',
            'Smart Retry System para mejor calidad',
            'Deep Search hasta 15 chunks',
            'Estrategias específicas por marca',
            'Análisis descriptivo, estratégico y predictivo'
          ],
          badge: 'RECOMENDADO',
          button: 'Acceder a RAG Inteligente'
        },
        creative: {
          title: 'RAG Creativo',
          subtitle: 'Insights creativos con transparencia total',
          description: 'Combina datos reales de estudios con análisis creativos. SIEMPRE indica qué información viene de estudios reales vs insights generados. Perfecto para brainstorming con base sólida.',
          features: [
            'Transparencia total: Real vs Generado',
            'Insights basados en datos + creatividad',
            'Indicadores claros de fuente de información',
            'Visualizaciones automáticas',
            'Recomendaciones estratégicas creativas'
          ],
          badge: 'TRANSPARENTE',
          button: 'Acceder a RAG Creativo'
        },
        synthetic: {
          title: 'Personas Sintéticas',
          subtitle: 'Sistema de usuarios virtuales colombianos',
          description: 'Conversa con personas sintéticas colombianas auténticas con 80+ variables cada una. Perfiles detallados de consumidores de marcas Unilever.',
          features: [
            '4 arquetipos colombianos completos',
            '80+ variables por persona',
            'Contexto cultural auténtico',
            'Relación detallada con marcas Unilever',
            'Chat contextual avanzado'
          ],
          badge: '',
          button: 'Acceder a Personas Sintéticas'
        }
      },
      
      // Chat Interface
      chat: {
        title: 'Chat',
        placeholder: 'Escribe tu pregunta sobre insights de Unilever...',
        send: 'Enviar',
        thinking: 'Pensando...',
        analyzing: 'Analizando con búsqueda inteligente...',
        retrying: 'Reintentando con estrategia mejorada...',
        attemptNumber: 'Intento',
        deepSearch: 'Búsqueda inteligente en profundidad',
        noMessages: 'No hay mensajes aún. ¡Inicia una conversación!',
        clearChat: 'Limpiar Chat',
        exportChat: 'Exportar Chat',
        searchHistory: 'Buscar Historial',
        newChat: 'Nuevo Chat',
        
        // Creative specific translations
        generatingCreativeInsights: 'Generando insights creativos...',
        detectingImageNeed: '🎨 Detecté que necesitas una imagen. Generando visual con DALL-E...',
        confirmClearCreative: '¿Estás seguro que deseas limpiar el chat creativo?',
        imageGenerated: '🎨 **Imagen generada**: {{prompt}}',
        creativitySubtitle: 'Insights creativos con transparencia total',
        imagesToday: 'imágenes hoy',
        creativeWelcomeDescription: 'Combina datos reales de estudios con análisis creativos. <strong>Siempre indica</strong> qué información viene de estudios vs insights generados',
        creativeModeActive: 'Modo Creativo Activado',
        creativeModeDescription: 'Genera visualizaciones automáticas, insights innovadores y recomendaciones estratégicas basadas en datos',
        imageGeneratedWithDallE: 'Imagen Generada con DALL-E',
        prompt: 'Prompt',
        creatingInsights: 'Creando insights...',
        creativePlaceholder: 'Describe tu idea o genera insights creativos...',
        generateImageDallE: 'Generar imagen con DALL-E',
        dailyLimitReachedCount: 'Límite diario alcanzado ({{current}}/{{limit}})',
        generating: 'Generando...',
        image: 'Imagen',
        creativeModeLevel: 'Modo Creativo: Insights innovadores con nivel {{level}}% de creatividad',
        generateVisualImage: 'Generar imagen visual',
        dailyLimitReached: 'Límite diario alcanzado',
        
        // Creative prompts
        creativePrompts: {
          innovativeDove: {
            title: 'Ideas Innovadoras Dove',
            prompt: 'Propón 5 conceptos disruptivos para Dove que revolucionen el cuidado personal en Colombia'
          },
          disruptiveMaizena: {
            title: 'Estrategia Disruptiva Maizena',
            prompt: 'Diseña una estrategia innovadora para posicionar Maizena como marca lifestyle en Colombia'
          },
          innovationSedal: {
            title: 'Innovación Sedal',
            prompt: 'Crea 3 líneas de productos revolucionarias para Sedal dirigidas al mercado colombiano moderno'
          },
          disruptionSavital: {
            title: 'Disruption Savital',
            prompt: 'Propón una transformación completa de Savital para capturar nuevos segmentos en Colombia'
          }
        }
      },
      
      // Personas
      personas: {
        title: 'Personas Consumidoras Colombianas',
        selectPersona: 'Seleccionar Persona',
        chatWith: 'Chatear con',
        characteristics: 'Características',
        demographics: 'Demografía',
        behavior: 'Comportamiento', 
        brands: 'Relación con Marcas',
        
        // Specific personas
        costeña: {
          name: 'María José',
          archetype: 'Emprendedora Costeña',
          location: 'Barranquilla, Costa Caribe',
          age: '32 años',
          occupation: 'Dueña de tienda de belleza'
        },
        bogotana: {
          name: 'Catalina',
          archetype: 'Profesional Bogotana',
          location: 'Bogotá, Región Andina',
          age: '29 años',
          occupation: 'Ingeniera de sistemas'
        },
        paisa: {
          name: 'Luz Elena',
          archetype: 'Paisa Tradicional',
          location: 'Medellín, Antioquia',
          age: '45 años',
          occupation: 'Ama de casa dedicada'
        },
        madre: {
          name: 'Andrea',
          archetype: 'Madre Moderna',
          location: 'Bogotá, Cundinamarca', 
          age: '35 años',
          occupation: 'Gerente de mercadeo con 2 hijos'
        },
        
        // Synthetic module specific
        systemDescription: 'Sistema básico de usuarios virtuales',
        configureServices: 'Configurar servicios',
        advancedSystemTitle: 'Sistema Avanzado de Personas Sintéticas',
        advancedSystemDescription: 'Herramientas completas para validación de conceptos con consumidores colombianos auténticos.',
        evaluateConcepts: 'Evaluar Conceptos',
        editPersonas: 'Editar Personas',
        age: 'Edad',
        years: 'años',
        nse: 'NSE',
        city: 'Ciudad',
        chatAvailableAfterEvaluation: 'Chat disponible después de evaluar conceptos',
        completeValidationSystem: 'Sistema Completo de Validación',
        systemFeatures: '🇨🇴 Personas Auténticas: Cada arquetipo tiene 80+ variables específicas colombianas • 💬 Chat Inteligente: Conversaciones naturales con contexto cultural • 🧪 Evaluación de Conceptos: Validación automática con múltiples personas • ✏️ Editor Avanzado: Personaliza características según tu investigación'
      },
      
      // Concept Evaluator translations
      conceptEvaluator: {
        title: 'Evaluador de Conceptos',
        subtitle: 'Evalúa conceptos de producto y campañas con personas sintéticas colombianas',
        conceptInformation: 'Información del Concepto',
        conceptType: 'Tipo de Concepto',
        productConcept: 'Concepto de Producto',
        communicationCampaign: 'Campaña de Comunicación',
        conceptTitle: 'Título del Concepto',
        conceptTitlePlaceholder: 'Ej: Dove Advanced Hair Repair',
        completeDescription: 'Descripción Completa',
        descriptionPlaceholder: 'Describe detalladamente el concepto, características, beneficios, propuesta de valor...',
        category: 'Categoría',
        categoryPlaceholder: 'Ej: Cuidado Capilar, Limpieza Hogar, Alimentos',
        targetAudience: 'Audiencia Objetivo',
        targetAudiencePlaceholder: 'Ej: Mujeres 25-40 años, NSE B/C+, urbanas',
        profilesToEvaluate: 'Perfiles a Evaluar',
        profilesSelected: 'seleccionados',
        evaluationTone: 'Tono de Evaluación',
        verySkeptical: 'Muy Escéptico',
        veryPositive: 'Muy Positivo',
        toneDescriptions: {
          verySkeptical: 'Las personas serán muy críticas y cuestionarán todo',
          skeptical: 'Las personas serán cautelosas y mencionarán dudas',
          balanced: 'Las personas darán una evaluación equilibrada',
          positive: 'Las personas se enfocarán en aspectos positivos',
          veryPositive: 'Las personas serán muy receptivas y optimistas'
        },
        evaluateWith: 'Evaluar con',
        person: 'Persona',
        people: 'Personas',
        evaluating: 'Evaluando con',
        of: 'de',
        personas: 'personas...',
        personasWhoWillEvaluate: 'Personas que Evaluarán',
        realTimeResults: 'Resultados en Tiempo Real',
        summaryCards: {
          overallScore: 'Score General',
          appeal: 'Atractivo',
          understanding: 'Comprensión',
          purchaseIntent: 'Intención Compra',
          credibility: 'Credibilidad',
          benefits: 'Beneficios',
          recommendation: 'Recomendación'
        },
        detailedAnalysis: {
          justifications: 'Justificaciones',
          overallScore: 'Score General',
          credibility: 'Credibilidad',
          priceAnalysis: 'Análisis de Precio',
          currentSpending: 'Gasta actualmente',
          wouldPay: 'Pagaría',
          ingredientAnalysis: 'Análisis de Ingredientes',
          comments: 'Comentarios',
          positiveAspects: 'Aspectos Positivos',
          concerns: 'Preocupaciones'
        },
        strategicRecommendations: 'Recomendaciones Estratégicas',
        suggestedActions: 'Acciones Sugeridas',
        exportResults: 'Exportar Resultados',
        evaluateAnother: 'Evaluar Otro Concepto',
        evaluateAnotherConcept: 'Evaluar Otro Concepto',
        chatAboutEvaluation: 'Chat sobre evaluación',
        completeFormValidation: 'Por favor completa al menos el título y descripción del concepto',
        selectProfilesValidation: 'Por favor selecciona al menos un perfil para evaluar',
        selectProfilesText: 'Selecciona perfiles para evaluar',
        fullDescription: 'Descripción Completa',
        personsWhoWillEvaluate: 'Personas Que Evaluarán',
        persons: 'Personas',
        placeholders: {
          conceptTitle: 'Ej: Dove Advanced Hair Repair',
          description: 'Describe en detalle el concepto, características, beneficios, propuesta de valor...',
          category: 'Ej: Cuidado Capilar, Limpieza del Hogar, Alimentos',
          targetAudience: 'Ej: Mujeres 25-40 años, NSE B/C+, urbanas'
        },
        results: {
          overallScore: 'Score General',
          appeal: 'Atractivo',
          understanding: 'Comprensión',
          purchaseIntent: 'Intención de Compra',
          credibility: 'Credibilidad',
          benefits: 'Beneficios',
          recommendation: 'Recomendación'
        },
        toneLabels: {
          verySkeptical: 'Muy Escéptico',
          verySceptical: 'Muy Escéptico',
          skeptical: 'Escéptico',
          balanced: 'Equilibrado',
          positive: 'Positivo',
          veryPositive: 'Muy Positivo'
        },
        priority: {
          high: 'Alta',
          medium: 'Media',
          opportunity: 'Oportunidad'
        }
      },
      
      // Traducciones de Concept Chat
      conceptChat: {
        welcomeMessage: 'Hola, soy {{name}}. Ya evalué tu concepto "{{concept}}" y le di un score de {{score}}/10. ¿Quieres que profundice en algún aspecto específico de mi evaluación?',
        thinking: 'Pensando...',
        askAboutEvaluation: 'Pregúntame sobre mi evaluación:',
        inputPlaceholder: 'Pregunta sobre mi evaluación del concepto...',
        contextualQuestions: {
          whyScore: '¿Por qué le diste un {{score}}/10 al concepto?',
          mainConcerns: '¿Qué te preocupa más del concepto?',
          improvements: '¿Cómo mejorarías el concepto?',
          pricePoint: '¿A qué precio lo comprarías?'
        }
      },
      
      // Módulo Intelligent RAG
      intelligentRAG: {
        title: 'Sistema RAG Inteligente',
        subtitle: 'Sistema unificado de búsqueda inteligente que adapta automáticamente su estrategia para obtener los mejores insights de Unilever',
        features: {
          adaptiveSearch: {
            title: 'Búsqueda Adaptativa',
            description: 'Detecta automáticamente el tipo de consulta y adapta la estrategia de búsqueda para mejores resultados'
          },
          smartRetry: {
            title: 'Smart Retry',
            description: 'Evalúa la calidad de respuestas y reintenta automáticamente con estrategias mejoradas'
          },
          deepAnalysis: {
            title: 'Deep Analysis',
            description: 'Búsqueda en profundidad con hasta 15 chunks para casos complejos como Pond\'s o marcas específicas'
          }
        },
        config: {
          title: 'Configuración Inteligente',
          searchDepth: 'Profundidad de Búsqueda',
          maxChunks: 'Chunks Máximos',
          smartRetry: 'Smart Retry',
          temporalRanking: 'Ranking Temporal',
          historical: 'Histórico',
          recent: 'Reciente',
          balanced: 'Balanceado',
          standard: 'Standard',
          deepSearch: 'Búsqueda Profunda',
          comprehensive: 'Comprehensive',
          debugNormalization: 'Debug Normalización',
          intelligentConfig: 'Configuración inteligente',
          exportConversation: 'Exportar conversación',
          clearChat: 'Limpiar chat'
        },
        status: {
          deepSearch: 'Deep Search',
          comprehensive: 'Comprehensive',
          standard: 'Standard',
          maxChunks: 'Max {{count}} chunks',
          smartRetry: 'Smart Retry',
          historical: 'Histórico',
          recent: 'Reciente',
          balanced: 'Balanceado'
        }
      },
      
      // Configuration
      config: {
        title: 'Configuración',
        language: 'Idioma',
        selectLanguage: 'Seleccionar Idioma',
        ragSettings: 'Configuración RAG',
        maxChunks: 'Máximo de Chunks',
        creativityLevel: 'Nivel de Creatividad',
        temporalRanking: 'Ranking Temporal',
        similarityThreshold: 'Umbral de Similitud',
        save: 'Guardar',
        reset: 'Reiniciar',
        advanced: 'Configuración Avanzada'
      },
      
      // Language Selector
      languages: {
        en: 'English',
        es: 'Español', 
        fr: 'Français'
      },
      
      // Common
      common: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        close: 'Cerrar',
        save: 'Guardar',
        edit: 'Editar',
        delete: 'Eliminar',
        search: 'Buscar',
        filter: 'Filtrar',
        export: 'Exportar',
        import: 'Importar',
        logout: 'Salir',
        user: 'Usuario',
        transparent: 'TRANSPARENTE',
        exportConversation: 'Exportar conversación',
        clearChat: 'Limpiar chat',
        configuration: 'Configuración',
        create: 'Crear',
        download: 'Descargar',
        backToHome: 'Volver al inicio'
      },
      
      // Error messages
      errors: {
        connectionError: 'Error de conexión. Asegúrate de que el backend esté ejecutándose',
        dailyImageLimit: 'Has alcanzado el límite diario de {{limit}} imágenes. Intenta mañana.',
        imageGenerationError: 'Error al generar la imagen. Intenta nuevamente.'
      },
      
      // Status Messages
      status: {
        connecting: 'Conectando...',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        processing: 'Procesando...',
        completed: 'Completado',
        failed: 'Falló'
      },
      
      // Insights Categories
      insights: {
        brands: 'Marcas y Productos',
        segmentation: 'Segmentación y Audiencias',
        behavior: 'Comportamiento del Consumidor',
        trends: 'Tendencias y Mercado',
        competition: 'Competencia y Posicionamiento',
        innovation: 'Innovación y Productos'
      },
      
      // Question Suggestions
      suggestions: {
        title: 'Preguntas Sugeridas',
        brands: {
          dove: '¿Cuáles son las principales percepciones sobre Dove?',
          fruco: '¿Cómo se posiciona Fruco versus la competencia?',
          omo: '¿Qué insights tienes sobre OMO en el mercado?'
        },
        audience: {
          segments: '¿Cuáles son los principales segmentos de consumidores?',
          behavior: '¿Cómo varía el comportamiento por edad y género?',
          millennials: '¿Qué sabemos sobre los consumidores millennials?'
        },
        trends: {
          emerging: '¿Cuáles son las tendencias emergentes en cuidado personal?',
          postPandemic: '¿Cómo está evolucionando el mercado post-pandemia?',
          sustainability: '¿Qué tendencias de sostenibilidad son importantes?'
        }
      }
    }
  },
  fr: {
    translation: {
      // Language identification
      languageCode: 'fr',
      
      // Navigation & Layout
      nav: {
        selectModule: 'Sélectionner un Module',
        backToMenu: 'Retour au Menu',
        dashboard: 'Tableau de Bord',
        settings: 'Paramètres'
      },
      
      // Authentication
      auth: {
        title: 'Système d\'Intelligence RAG Unilever',
        subtitle: 'Accédez aux insights de marché alimentés par l\'IA',
        username: 'Nom d\'utilisateur',
        password: 'Mot de passe',
        login: 'Se Connecter',
        loginError: 'Identifiants invalides',
        loading: 'Connexion en cours...'
      },
      
      // Module Selection
      modules: {
        title: 'Sélectionner un Module RAG',
        subtitle: 'Système spécialisé pour l\'analyse des insights de marques Unilever avec IA avancée. Choisissez le module qui correspond le mieux à vos besoins de recherche.',
        intelligent: {
          title: 'RAG Intelligent',
          subtitle: 'Système unifié de recherche intelligente',
          description: 'Recherche adaptative qui détermine automatiquement la meilleure stratégie pour chaque requête. Avec retry intelligent, analyse approfondie et récupération optimisée pour les cas complexes.',
          features: [
            'Recherche adaptative automatique',
            'Smart Retry System pour meilleure qualité',
            'Deep Search jusqu\'à 15 chunks',
            'Stratégies spécifiques par marque',
            'Analyse descriptive, stratégique et prédictive'
          ],
          badge: 'RECOMMANDÉ',
          button: 'Accéder au RAG Intelligent'
        },
        creative: {
          title: 'RAG Créatif',
          subtitle: 'Insights créatifs avec transparence totale',
          description: 'Combine données réelles d\'études avec analyse créative. Indique TOUJOURS quelle information vient d\'études réelles vs insights générés. Parfait pour brainstorming avec base solide.',
          features: [
            'Transparence totale: Réel vs Généré',
            'Insights basés sur données + créativité',
            'Indicateurs clairs de source d\'information',
            'Visualisations automatiques',
            'Recommandations stratégiques créatives'
          ],
          badge: 'TRANSPARENT',
          button: 'Accéder au RAG Créatif'
        },
        synthetic: {
          title: 'Personas Synthétiques',
          subtitle: 'Système d\'utilisateurs virtuels colombiens',
          description: 'Conversez avec des personas synthétiques colombiennes authentiques avec 80+ variables chacune. Profils détaillés de consommateurs de marques Unilever.',
          features: [
            '4 archétypes colombiens complets',
            '80+ variables par persona',
            'Contexte culturel authentique',
            'Relation détaillée avec marques Unilever',
            'Chat contextuel avancé'
          ],
          badge: '',
          button: 'Accéder aux Personas Synthétiques'
        }
      },
      
      // Chat Interface
      chat: {
        title: 'Chat',
        placeholder: 'Tapez votre question sur les insights Unilever...',
        send: 'Envoyer',
        thinking: 'Réflexion...',
        analyzing: 'Analyse avec recherche intelligente...',
        retrying: 'Nouvelle tentative avec stratégie améliorée...',
        attemptNumber: 'Tentative',
        deepSearch: 'Recherche intelligente approfondie',
        noMessages: 'Aucun message encore. Commencez une conversation !',
        clearChat: 'Effacer le Chat',
        exportChat: 'Exporter le Chat',
        searchHistory: 'Rechercher dans l\'Historique',
        newChat: 'Nouveau Chat',
        
        // Creative specific translations
        generatingCreativeInsights: 'Génération d\'insights créatifs...',
        detectingImageNeed: '🎨 J\'ai détecté que vous avez besoin d\'une image. Génération de visuel avec DALL-E...',
        confirmClearCreative: 'Êtes-vous sûr de vouloir effacer le chat créatif ?',
        imageGenerated: '🎨 **Image générée**: {{prompt}}',
        creativitySubtitle: 'Insights créatifs avec transparence totale',
        imagesToday: 'images aujourd\'hui',
        creativeWelcomeDescription: 'Combine données réelles d\'études avec analyse créative. <strong>Indique toujours</strong> quelle information vient d\'études vs insights générés',
        creativeModeActive: 'Mode Créatif Activé',
        creativeModeDescription: 'Génère visualisations automatiques, insights innovateurs et recommandations stratégiques basées sur données',
        imageGeneratedWithDallE: 'Image Générée avec DALL-E',
        prompt: 'Prompt',
        creatingInsights: 'Création d\'insights...',
        creativePlaceholder: 'Décrivez votre idée ou générez des insights créatifs...',
        generateImageDallE: 'Générer une image avec DALL-E',
        dailyLimitReachedCount: 'Limite quotidienne atteinte ({{current}}/{{limit}})',
        generating: 'Génération...',
        image: 'Image',
        creativeModeLevel: 'Mode Créatif: Insights innovateurs avec niveau {{level}}% de créativité',
        generateVisualImage: 'Générer une image visuelle',
        dailyLimitReached: 'Limite quotidienne atteinte',
        
        // Creative prompts
        creativePrompts: {
          innovativeDove: {
            title: 'Idées Innovantes Dove',
            prompt: 'Proposez 5 concepts disruptifs pour Dove qui révolutionnent les soins personnels en Colombie'
          },
          disruptiveMaizena: {
            title: 'Stratégie Disruptive Maizena',
            prompt: 'Concevez une stratégie innovante pour positionner Maizena comme marque lifestyle en Colombie'
          },
          innovationSedal: {
            title: 'Innovation Sedal',
            prompt: 'Créez 3 lignes de produits révolutionnaires pour Sedal ciblant le marché colombien moderne'
          },
          disruptionSavital: {
            title: 'Disruption Savital',
            prompt: 'Proposez une transformation complète de Savital pour capturer de nouveaux segments en Colombie'
          }
        }
      },
      
      // Personas
      personas: {
        title: 'Personas Consommatrices Colombiennes',
        selectPersona: 'Sélectionner une Persona',
        chatWith: 'Chatter avec',
        characteristics: 'Caractéristiques',
        demographics: 'Démographie',
        behavior: 'Comportement',
        brands: 'Relations avec les Marques',
        
        // Specific personas
        costeña: {
          name: 'María José',
          archetype: 'Entrepreneure de la Côte',
          location: 'Barranquilla, Côte Caraïbe',
          age: '32 ans',
          occupation: 'Propriétaire de magasin de beauté'
        },
        bogotana: {
          name: 'Catalina',
          archetype: 'Professionnelle de Bogotá',
          location: 'Bogotá, Région Andine',
          age: '29 ans',
          occupation: 'Ingénieure systèmes'
        },
        paisa: {
          name: 'Luz Elena',
          archetype: 'Paisa Traditionnelle',
          location: 'Medellín, Antioquia',
          age: '45 ans',
          occupation: 'Femme au foyer dévouée'
        },
        madre: {
          name: 'Andrea',
          archetype: 'Mère Moderne',
          location: 'Bogotá, Cundinamarca',
          age: '35 ans',
          occupation: 'Directrice marketing avec 2 enfants'
        },
        
        // Synthetic module specific
        systemDescription: 'Système d\'utilisateurs virtuels de base',
        configureServices: 'Configurer les services',
        advancedSystemTitle: 'Système Avancé de Personas Synthétiques',
        advancedSystemDescription: 'Outils complets pour la validation de concepts avec des consommateurs colombiens authentiques.',
        evaluateConcepts: 'Évaluer les Concepts',
        editPersonas: 'Modifier les Personas',
        age: 'Âge',
        years: 'ans',
        nse: 'NSE',
        city: 'Ville',
        chatAvailableAfterEvaluation: 'Chat disponible après évaluation des concepts',
        completeValidationSystem: 'Système Complet de Validation',
        systemFeatures: '🇨🇴 Personas Authentiques: Chaque archétype a 80+ variables spécifiques colombiennes • 💬 Chat Intelligent: Conversations naturelles avec contexte culturel • 🧪 Évaluation de Concepts: Validation automatique avec plusieurs personas • ✏️ Éditeur Avancé: Personnalisez les caractéristiques selon votre recherche'
      },
      
      // Concept Evaluator translations
      conceptEvaluator: {
        title: 'Évaluateur de Concepts',
        subtitle: 'Évaluez les concepts de produits et campagnes avec des personas synthétiques colombiennes',
        conceptInformation: 'Information sur le Concept',
        conceptType: 'Type de Concept',
        productConcept: 'Concept de Produit',
        communicationCampaign: 'Campagne de Communication',
        conceptTitle: 'Titre du Concept',
        conceptTitlePlaceholder: 'Ex: Dove Advanced Hair Repair',
        completeDescription: 'Description Complète',
        descriptionPlaceholder: 'Décrivez en détail le concept, caractéristiques, bénéfices, proposition de valeur...',
        category: 'Catégorie',
        categoryPlaceholder: 'Ex: Soins Capillaires, Nettoyage Maison, Alimentation',
        targetAudience: 'Audience Cible',
        targetAudiencePlaceholder: 'Ex: Femmes 25-40 ans, NSE B/C+, urbaines',
        profilesToEvaluate: 'Profils à Évaluer',
        profilesSelected: 'sélectionnés',
        evaluationTone: 'Ton d\'Évaluation',
        verySkeptical: 'Très Sceptique',
        veryPositive: 'Très Positif',
        toneDescriptions: {
          verySkeptical: 'Les personas seront très critiques et remettront tout en question',
          skeptical: 'Les personas seront prudentes et mentionneront des doutes',
          balanced: 'Les personas donneront une évaluation équilibrée',
          positive: 'Les personas se concentreront sur les aspects positifs',
          veryPositive: 'Les personas seront très réceptives et optimistes'
        },
        evaluateWith: 'Évaluer avec',
        person: 'Persona',
        people: 'Personas',
        evaluating: 'Évaluation avec',
        of: 'de',
        personas: 'personas...',
        personasWhoWillEvaluate: 'Personas Qui Vont Évaluer',
        realTimeResults: 'Résultats en Temps Réel',
        summaryCards: {
          overallScore: 'Score Global',
          appeal: 'Attrait',
          understanding: 'Compréhension',
          purchaseIntent: 'Intention d\'Achat',
          credibility: 'Crédibilité',
          benefits: 'Bénéfices',
          recommendation: 'Recommandation'
        },
        detailedAnalysis: {
          justifications: 'Justifications',
          overallScore: 'Score Global',
          credibility: 'Crédibilité',
          priceAnalysis: 'Analyse du Prix',
          currentSpending: 'Dépense actuellement',
          wouldPay: 'Paierait',
          ingredientAnalysis: 'Analyse des Ingrédients',
          comments: 'Commentaires',
          positiveAspects: 'Aspects Positifs',
          concerns: 'Préoccupations'
        },
        strategicRecommendations: 'Recommandations Stratégiques',
        suggestedActions: 'Actions Suggérées',
        exportResults: 'Exporter les Résultats',
        evaluateAnotherConcept: 'Évaluer un Autre Concept',
        selectProfilesText: 'Sélectionnez les profils à évaluer',
        fullDescription: 'Description Complète',
        persons: 'Personnes',
        placeholders: {
          conceptTitle: 'Ex: Dove Advanced Hair Repair',
          description: 'Décrivez en détail le concept, les caractéristiques, les bénéfices, la proposition de valeur...',
          category: 'Ex: Soins Capillaires, Nettoyage Ménager, Alimentation',
          targetAudience: 'Ex: Femmes 25-40 ans, NSE B/C+, urbaines'
        },
        results: {
          overallScore: 'Score Global',
          appeal: 'Attrait',
          understanding: 'Compréhension',
          purchaseIntent: 'Intention d\'Achat',
          credibility: 'Crédibilité',
          benefits: 'Bénéfices',
          recommendation: 'Recommandation'
        },
        evaluateAnother: 'Évaluer un Autre Concept',
        chatAboutEvaluation: 'Chat sur l\'évaluation',
        completeFormValidation: 'Veuillez compléter au moins le titre et la description du concept',
        selectProfilesValidation: 'Veuillez sélectionner au moins un profil pour évaluer',
        toneLabels: {
          verySkeptical: 'Très Sceptique',
          verySceptical: 'Très Sceptique',
          skeptical: 'Sceptique',
          balanced: 'Équilibré',
          positive: 'Positif',
          veryPositive: 'Très Positif'
        },
        priority: {
          high: 'Élevée',
          medium: 'Moyenne',
          opportunity: 'Opportunité'
        }
      },
      
      // Traductions de Concept Chat
      conceptChat: {
        welcomeMessage: "Bonjour, je suis {{name}}. J'ai déjà évalué votre concept \"{{concept}}\" et lui ai donné une note de {{score}}/10. Souhaitez-vous que j'approfondisse un aspect particulier de mon évaluation?",
        thinking: 'Réflexion en cours...',
        askAboutEvaluation: 'Posez-moi des questions sur mon évaluation:',
        inputPlaceholder: 'Posez une question sur mon évaluation du concept...',
        contextualQuestions: {
          whyScore: 'Pourquoi avez-vous donné {{score}}/10 au concept?',
          mainConcerns: 'Qu\'est-ce qui vous préoccupe le plus dans le concept?',
          improvements: 'Comment amélioreriez-vous le concept?',
          pricePoint: 'À quel prix l\'achèteriez-vous?'
        }
      },
      
      // Module Intelligent RAG
      intelligentRAG: {
        title: 'Système RAG Intelligent',
        subtitle: 'Système de recherche intelligent unifié qui adapte automatiquement sa stratégie pour obtenir les meilleurs insights d\'Unilever',
        features: {
          adaptiveSearch: {
            title: 'Recherche Adaptive',
            description: 'Détecte automatiquement le type de requête et adapte la stratégie de recherche pour de meilleurs résultats'
          },
          smartRetry: {
            title: 'Smart Retry',
            description: 'Évalue la qualité des réponses et réessaie automatiquement avec des stratégies améliorées'
          },
          deepAnalysis: {
            title: 'Analyse Approfondie',
            description: 'Recherche en profondeur avec jusqu\'à 15 chunks pour les cas complexes comme Pond\'s ou des marques spécifiques'
          }
        },
        config: {
          title: 'Configuration Intelligente',
          searchDepth: 'Profondeur de Recherche',
          maxChunks: 'Chunks Maximums',
          smartRetry: 'Smart Retry',
          temporalRanking: 'Classement Temporel',
          historical: 'Historique',
          recent: 'Récent',
          balanced: 'Équilibré',
          standard: 'Standard',
          deepSearch: 'Recherche Profonde',
          comprehensive: 'Comprehensive',
          debugNormalization: 'Debug Normalisation',
          intelligentConfig: 'Configuration intelligente',
          exportConversation: 'Exporter la conversation',
          clearChat: 'Effacer le chat'
        },
        status: {
          deepSearch: 'Deep Search',
          comprehensive: 'Comprehensive',
          standard: 'Standard',
          maxChunks: 'Max {{count}} chunks',
          smartRetry: 'Smart Retry',
          historical: 'Historique',
          recent: 'Récent',
          balanced: 'Équilibré'
        }
      },
      
      // Configuration
      config: {
        title: 'Configuration',
        language: 'Langue',
        selectLanguage: 'Sélectionner la Langue',
        ragSettings: 'Paramètres RAG',
        maxChunks: 'Chunks Maximum',
        creativityLevel: 'Niveau de Créativité',
        temporalRanking: 'Classement Temporel',
        similarityThreshold: 'Seuil de Similarité',
        save: 'Sauvegarder',
        reset: 'Réinitialiser',
        advanced: 'Paramètres Avancés'
      },
      
      // Language Selector
      languages: {
        en: 'English',
        es: 'Español',
        fr: 'Français'
      },
      
      // Common
      common: {
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        close: 'Fermer',
        save: 'Sauvegarder',
        edit: 'Modifier',
        delete: 'Supprimer',
        search: 'Rechercher',
        filter: 'Filtrer',
        export: 'Exporter',
        import: 'Importer',
        logout: 'Déconnexion',
        user: 'Utilisateur',
        transparent: 'TRANSPARENT',
        exportConversation: 'Exporter la conversation',
        clearChat: 'Effacer le chat',
        configuration: 'Configuration',
        create: 'Créer',
        download: 'Télécharger',
        backToHome: 'Retour à l\'accueil'
      },
      
      // Error messages
      errors: {
        connectionError: 'Erreur de connexion. Assurez-vous que le backend fonctionne',
        dailyImageLimit: 'Vous avez atteint la limite quotidienne de {{limit}} images. Essayez demain.',
        imageGenerationError: 'Erreur lors de la génération de l\'image. Réessayez.'
      },
      
      // Status Messages
      status: {
        connecting: 'Connexion...',
        connected: 'Connecté',
        disconnected: 'Déconnecté',
        processing: 'Traitement...',
        completed: 'Terminé',
        failed: 'Échoué'
      },
      
      // Insights Categories
      insights: {
        brands: 'Marques et Produits',
        segmentation: 'Segmentation et Audiences',
        behavior: 'Comportement du Consommateur',
        trends: 'Tendances et Marché',
        competition: 'Concurrence et Positionnement',
        innovation: 'Innovation et Produits'
      },
      
      // Question Suggestions
      suggestions: {
        title: 'Questions Suggérées',
        brands: {
          dove: 'Quelles sont les principales perceptions sur Dove ?',
          fruco: 'Comment Fruco est-il positionné face à la concurrence ?',
          omo: 'Quels insights avez-vous sur OMO sur le marché ?'
        },
        audience: {
          segments: 'Quels sont les principaux segments de consommateurs ?',
          behavior: 'Comment le comportement varie-t-il selon l\'âge et le sexe ?',
          millennials: 'Que savons-nous des consommateurs millennials ?'
        },
        trends: {
          emerging: 'Quelles sont les tendances émergentes en soins personnels ?',
          postPandemic: 'Comment le marché évolue-t-il post-pandémie ?',
          sustainability: 'Quelles tendances de durabilité sont importantes ?'
        }
      }
    }
  }
};

// Load saved language or default to English
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // Load saved language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Enable development tools
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;