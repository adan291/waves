/**
 * Translations Module
 * Multi-language support for Whispers of the Wave
 */

const translations = {
    es: {
        appName: 'Whispers of the Wave',
        waves: {
            calm: {
                name: 'Ola Tranquila',
                description: 'Para reflexión pausada y autoconocimiento profundo'
            },
            deep: {
                name: 'Ola Profunda',
                description: 'Para explorar emociones complejas y patrones internos'
            },
            energetic: {
                name: 'Ola Energética',
                description: 'Para resolver conflictos y tomar decisiones claras'
            },
            healing: {
                name: 'Ola Sanadora',
                description: 'Para procesar dolor emocional y encontrar paz interior'
            }
        },
        personas: {
            guardian: 'El Guardián de la Ola',
            companion: 'El Compañero del Océano',
            deep_explorer: 'El Explorador Profundo',
            problem_solver: 'El Solucionador',
            healer: 'El Sanador',
            life_questioning: 'El Guía del Propósito',
            narrador: 'El Narrador del Mar',
            kiro: 'Kiro - Susurro de la Ola'
        },
        ui: {
            welcome: 'Bienvenido al océano de pensamientos...',
            welcomeMessage: 'Comparte lo que llevas dentro, y las olas reflejarán tu verdad.',
            placeholder: 'Comparte tus pensamientos...',
            send: 'Enviar',
            back: 'Volver',
            changeWave: 'Cambiar de ola',
            continue: 'Continuar',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
            close: 'Cerrar',
            understood: 'Entendido',
            typingIndicator: 'Las olas están formando una respuesta...'
        },
        controls: {
            tts: 'Lectura automática',
            ttsOn: 'Activar lectura automática',
            ttsOff: 'Desactivar lectura automática',
            theme: 'Cambiar tema',
            language: 'Cambiar idioma',
            achievements: 'Ver logros',
            report: 'Ver informe de viaje',
            backToWaves: 'Volver a la selección de olas',
            speak: 'Hablar',
            search: 'Buscar en historial',
            reset: 'Reiniciar app',
            ambientSound: 'Sonido ambiente'
        },
        modals: {
            changeWaveTitle: '🌊 Cambiar de Ola',
            changeWaveMessage: '¿Quieres elegir una nueva ola? Se perderá la conversación actual y comenzarás de nuevo.',
            changeWaveConfirm: 'Cambiar de Ola',
            changeWaveCancel: 'Continuar Aquí'
        },
        suggestions: {
            startWith: 'Puedes empezar con:',
            shareThoughts: 'Puedes compartir:',
            exploreWorries: 'Explora tus preocupaciones:',
            reflect: 'Reflexiona sobre:',
            deepen: 'Profundiza en:',
            nextSteps: 'Próximos pasos:',
            continueExploring: 'Continúa explorando:',
            waves: {
                calm: [
                    "Quiero tomarme tiempo para conocerme mejor",
                    "¿Qué es lo que realmente me hace feliz?",
                    "Necesito entender mis valores antes de decidir",
                    "Quiero explorar sin presión qué me llama",
                    "Me gustaría reflexionar sobre quién soy",
                    "¿Cuáles son mis verdaderas prioridades?"
                ],
                deep: [
                    "Siento que hay algo más profundo detrás de mi confusión",
                    "Tengo miedos que no logro identificar",
                    "¿Por qué me cuesta tanto decidir?",
                    "Quiero entender qué me está bloqueando",
                    "Hay patrones en mi vida que se repiten",
                    "Necesito explorar mis emociones más profundas"
                ],
                energetic: [
                    "Necesito decidir pronto entre estas opciones",
                    "Quiero un plan de acción concreto",
                    "¿Cuál es el primer paso que debo dar?",
                    "Necesito momentum para empezar",
                    "Quiero resolver este conflicto de una vez",
                    "Dame claridad para actuar ya"
                ],
                healing: [
                    "Estoy agotado de tanta presión",
                    "Necesito procesar mis emociones primero",
                    "Me siento abrumado por todas las expectativas",
                    "Quiero encontrar paz antes de decidir",
                    "Necesito sanar antes de avanzar",
                    "Cargo con un peso que necesito soltar"
                ]
            },
            waveExamples: {
                calm: [
                    "Últimamente me siento desconectado de mí mismo",
                    "No sé qué quiero realmente de la vida",
                    "Necesito un momento de calma para pensar",
                    "Quiero entender mejor mis sentimientos"
                ],
                deep: [
                    "Tengo miedo de decepcionar a quienes confían en mí",
                    "Hay algo que me bloquea y no sé qué es",
                    "Siento que repito los mismos errores",
                    "Me cuesta conectar con mis emociones profundas"
                ],
                energetic: [
                    "Tengo que tomar una decisión importante pronto",
                    "Estoy atascado y necesito avanzar",
                    "Quiero resolver un conflicto que me agota",
                    "Necesito un plan claro para seguir adelante"
                ],
                healing: [
                    "Estoy pasando por un momento muy difícil",
                    "Necesito procesar una pérdida o un dolor",
                    "Me siento emocionalmente agotado",
                    "Cargo con heridas que necesitan sanar"
                ]
            }
        },
        oceanStates: {
            confused: 'Confusión',
            anxious: 'Ansiedad',
            processing: 'Procesando',
            clarity: 'Claridad',
            resolved: 'Resolución',
            neutral: 'Neutral'
        },
        achievements: {
            title: 'Logros Desbloqueados',
            unlocked: 'desbloqueados',
            locked: 'bloqueados',
            newAchievement: '¡Nuevo Logro!',
            viewAll: 'Ver todos los logros'
        },
        report: {
            title: 'Informe de Viaje',
            summary: 'Resumen',
            journey: 'Viaje Emocional',
            metrics: 'Métricas de Expresión',
            oceanStates: 'Estados del Océano',
            achievements: 'Logros',
            insights: 'Insights',
            recommendations: 'Recomendaciones',
            download: 'Descargar',
            downloadJSON: 'Descargar JSON',
            downloadTXT: 'Descargar TXT'
        },
        metrics: {
            title: 'Métricas de Expresión',
            clarity: 'Claridad',
            specificity: 'Especificidad',
            emotionalAwareness: 'Conciencia Emocional',
            overall: 'Puntuación General'
        },
        errors: {
            apiKeyMissing: 'Por favor configura tu API key de Gemini',
            connectionError: 'Error de conexión. Intenta de nuevo.',
            genericError: 'Algo salió mal. Por favor intenta de nuevo.'
        },
        apiKey: {
            title: '🔑 Configurar API Key',
            subtitle: 'Para usar Whispers of the Wave necesitas una API key gratuita de Google Gemini.',
            step1: '1. Visita Google AI Studio',
            step2: '2. Inicia sesión con tu cuenta de Google',
            step3: '3. Crea una nueva API key (es gratis)',
            step4: '4. Copia y pega la key aquí abajo',
            placeholder: 'Pega tu API key aquí...',
            getKey: 'Obtener API Key Gratis',
            save: 'Guardar y Comenzar',
            cancel: 'Cancelar',
            validating: 'Validando...',
            success: '✓ API key válida',
            error: '✗ API key inválida',
            errorEmpty: 'Por favor, introduce una API key',
            note: '💡 Tu API key se guarda solo en tu navegador y nunca se comparte.',
            changeKey: 'Cambiar API Key'
        },
        splash: {
            title: 'Whispers of the Wave',
            subtitle: 'Un viaje de autoconocimiento guiado por las olas',
            howItWorks: '¿Cómo funciona?',
            startJourney: 'Comenzar Viaje',
            selectWave: 'Selecciona tu Ola',
            titleMain: 'Whispers of the Wave - Inicio',
            titleSelection: 'Whispers of the Wave - Selecciona tu Ola',
            titleConversation: 'Whispers of the Wave - Conversación',
            tutorial: {
                step1: 'Elige tu ola según lo que necesites explorar',
                step2: 'Comparte tus pensamientos libremente',
                step3: 'Las olas reflejarán tu verdad interior'
            }
        }
    },
    en: {
        appName: 'Whispers of the Wave',
        waves: {
            calm: {
                name: 'Calm Wave',
                description: 'For peaceful reflection and deep self-awareness'
            },
            deep: {
                name: 'Deep Wave',
                description: 'To explore complex emotions and internal patterns'
            },
            energetic: {
                name: 'Energetic Wave',
                description: 'To resolve conflicts and make clear decisions'
            },
            healing: {
                name: 'Healing Wave',
                description: 'To process emotional pain and find inner peace'
            }
        },
        personas: {
            guardian: 'The Wave Guardian',
            companion: 'The Ocean Companion',
            deep_explorer: 'The Deep Explorer',
            problem_solver: 'The Problem Solver',
            healer: 'The Healer',
            life_questioning: 'The Purpose Guide',
            narrador: 'The Sea Narrator',
            kiro: 'Kiro - Wave Whisper'
        },
        ui: {
            welcome: 'Welcome to the ocean of thoughts...',
            welcomeMessage: 'Share what you carry within, and the waves will reflect your truth.',
            placeholder: 'Share your thoughts...',
            send: 'Send',
            back: 'Back',
            changeWave: 'Change wave',
            continue: 'Continue',
            cancel: 'Cancel',
            confirm: 'Confirm',
            close: 'Close',
            understood: 'Understood',
            typingIndicator: 'The waves are forming a response...'
        },
        controls: {
            tts: 'Auto-read',
            ttsOn: 'Enable auto-read',
            ttsOff: 'Disable auto-read',
            theme: 'Change theme',
            language: 'Change language',
            achievements: 'View achievements',
            report: 'View journey report',
            backToWaves: 'Back to wave selection',
            speak: 'Speak',
            search: 'Search history',
            reset: 'Reset app',
            ambientSound: 'Ambient sound'
        },
        modals: {
            changeWaveTitle: '🌊 Change Wave',
            changeWaveMessage: 'Do you want to choose a new wave? The current conversation will be lost and you will start fresh.',
            changeWaveConfirm: 'Change Wave',
            changeWaveCancel: 'Stay Here'
        },
        suggestions: {
            startWith: 'You can start with:',
            shareThoughts: 'You can share:',
            exploreWorries: 'Explore your worries:',
            reflect: 'Reflect on:',
            continueExploring: 'Continue exploring:',
            deepen: 'Deepen into:',
            nextSteps: 'Next steps:',
            waves: {
                calm: [
                    "I want to take time to know myself better",
                    "What really makes me happy?",
                    "I need to understand my values before deciding",
                    "I want to explore without pressure what calls me",
                    "I'd like to reflect on who I truly am",
                    "What are my real priorities in life?"
                ],
                deep: [
                    "I feel there's something deeper behind my confusion",
                    "I have fears I can't identify",
                    "Why is it so hard for me to decide?",
                    "I want to understand what's blocking me",
                    "There are patterns in my life that keep repeating",
                    "I need to explore my deeper emotions"
                ],
                energetic: [
                    "I need to decide soon between these options",
                    "I want a concrete action plan",
                    "What's the first step I should take?",
                    "I need momentum to start",
                    "I want to resolve this conflict once and for all",
                    "Give me clarity to act now"
                ],
                healing: [
                    "I'm exhausted from all the pressure",
                    "I need to process my emotions first",
                    "I feel overwhelmed by all the expectations",
                    "I want to find peace before deciding",
                    "I need to heal before moving forward",
                    "I carry a weight I need to release"
                ]
            },
            waveExamples: {
                calm: [
                    "Lately I feel disconnected from myself",
                    "I don't know what I really want from life",
                    "I need a moment of calm to think",
                    "I want to better understand my feelings"
                ],
                deep: [
                    "I'm afraid of disappointing those who trust me",
                    "There's something blocking me and I don't know what",
                    "I feel like I keep repeating the same mistakes",
                    "I struggle to connect with my deeper emotions"
                ],
                energetic: [
                    "I have to make an important decision soon",
                    "I'm stuck and need to move forward",
                    "I want to resolve a conflict that's draining me",
                    "I need a clear plan to move ahead"
                ],
                healing: [
                    "I'm going through a very difficult time",
                    "I need to process a loss or pain",
                    "I feel emotionally exhausted",
                    "I carry wounds that need to heal"
                ]
            }
        },
        oceanStates: {
            confused: 'Confusion',
            anxious: 'Anxiety',
            processing: 'Processing',
            clarity: 'Clarity',
            resolved: 'Resolution',
            neutral: 'Neutral'
        },
        achievements: {
            title: 'Unlocked Achievements',
            unlocked: 'unlocked',
            locked: 'locked',
            newAchievement: 'New Achievement!',
            viewAll: 'View all achievements'
        },
        report: {
            title: 'Journey Report',
            summary: 'Summary',
            journey: 'Emotional Journey',
            metrics: 'Expression Metrics',
            oceanStates: 'Ocean States',
            achievements: 'Achievements',
            insights: 'Insights',
            recommendations: 'Recommendations',
            download: 'Download',
            downloadJSON: 'Download JSON',
            downloadTXT: 'Download TXT'
        },
        metrics: {
            title: 'Expression Metrics',
            clarity: 'Clarity',
            specificity: 'Specificity',
            emotionalAwareness: 'Emotional Awareness',
            overall: 'Overall Score'
        },
        errors: {
            apiKeyMissing: 'Please configure your Gemini API key',
            connectionError: 'Connection error. Please try again.',
            genericError: 'Something went wrong. Please try again.'
        },
        apiKey: {
            title: '🔑 Configure API Key',
            subtitle: 'To use Whispers of the Wave you need a free Google Gemini API key.',
            step1: '1. Visit Google AI Studio',
            step2: '2. Sign in with your Google account',
            step3: '3. Create a new API key (it\'s free)',
            step4: '4. Copy and paste the key below',
            placeholder: 'Paste your API key here...',
            getKey: 'Get Free API Key',
            save: 'Save and Start',
            cancel: 'Cancel',
            validating: 'Validating...',
            success: '✓ Valid API key',
            error: '✗ Invalid API key',
            errorEmpty: 'Please enter an API key',
            note: '💡 Your API key is stored only in your browser and never shared.',
            changeKey: 'Change API Key'
        },
        splash: {
            title: 'Whispers of the Wave',
            subtitle: 'A journey of self-discovery guided by the waves',
            howItWorks: 'How it works?',
            startJourney: 'Start Journey',
            selectWave: 'Select your Wave',
            titleMain: 'Whispers of the Wave - Home',
            titleSelection: 'Whispers of the Wave - Select your Wave',
            titleConversation: 'Whispers of the Wave - Conversation',
            tutorial: {
                step1: 'Choose your wave based on what you need to explore',
                step2: 'Share your thoughts freely',
                step3: 'The waves will reflect your inner truth'
            }
        }
    },
    ro: {
        appName: 'Whispers of the Wave',
        waves: {
            calm: {
                name: 'Val Calm',
                description: 'Pentru reflecție liniștită și autocunoaștere profundă'
            },
            deep: {
                name: 'Val Profund',
                description: 'Pentru a explora emoții complexe și modele interne'
            },
            energetic: {
                name: 'Val Energetic',
                description: 'Pentru a rezolva conflicte și a lua decizii clare'
            },
            healing: {
                name: 'Val Vindecător',
                description: 'Pentru a procesa durerea emoțională și a găsi pace interioară'
            }
        },
        personas: {
            guardian: 'Gardianul Valului',
            companion: 'Companionul Oceanului',
            deep_explorer: 'Exploratorul Profund',
            problem_solver: 'Rezolvatorul',
            healer: 'Vindecătorul',
            life_questioning: 'Ghidul Scopului',
            narrador: 'Naratorul Mării',
            kiro: 'Kiro - Șoapta Valului'
        },
        ui: {
            welcome: 'Bine ai venit în oceanul gândurilor...',
            welcomeMessage: 'Împărtășește ce porți înăuntru, și valurile vor reflecta adevărul tău.',
            placeholder: 'Împărtășește gândurile tale...',
            send: 'Trimite',
            back: 'Înapoi',
            changeWave: 'Schimbă valul',
            continue: 'Continuă',
            cancel: 'Anulează',
            confirm: 'Confirmă',
            close: 'Închide',
            understood: 'Înțeles',
            typingIndicator: 'Valurile formează un răspuns...'
        },
        controls: {
            tts: 'Citire automată',
            ttsOn: 'Activează citirea automată',
            ttsOff: 'Dezactivează citirea automată',
            theme: 'Schimbă tema',
            language: 'Schimbă limba',
            achievements: 'Vezi realizările',
            report: 'Vezi raportul călătoriei',
            backToWaves: 'Înapoi la selecția valurilor',
            speak: 'Vorbește',
            search: 'Caută în istoric',
            reset: 'Resetează aplicația',
            ambientSound: 'Sunet ambiental'
        },
        modals: {
            changeWaveTitle: '🌊 Schimbă Valul',
            changeWaveMessage: 'Vrei să alegi un val nou? Conversația actuală va fi pierdută și vei începe de la zero.',
            changeWaveConfirm: 'Schimbă Valul',
            changeWaveCancel: 'Rămâi Aici'
        },
        suggestions: {
            startWith: 'Poți începe cu:',
            shareThoughts: 'Poți împărtăși:',
            exploreWorries: 'Explorează îngrijorările tale:',
            reflect: 'Reflectează asupra:',
            continueExploring: 'Continuă să explorezi:',
            deepen: 'Aprofundează în:',
            nextSteps: 'Pașii următori:',
            waves: {
                calm: [
                    "Vreau să îmi iau timp să mă cunosc mai bine",
                    "Ce mă face cu adevărat fericit?",
                    "Trebuie să îmi înțeleg valorile înainte de a decide",
                    "Vreau să explorez fără presiune ce mă cheamă",
                    "Aș vrea să reflectez asupra cine sunt cu adevărat",
                    "Care sunt prioritățile mele reale în viață?"
                ],
                deep: [
                    "Simt că există ceva mai profund în spatele confuziei mele",
                    "Am temeri pe care nu le pot identifica",
                    "De ce îmi este atât de greu să decid?",
                    "Vreau să înțeleg ce mă blochează",
                    "Există tipare în viața mea care se repetă",
                    "Trebuie să explorez emoțiile mele mai profunde"
                ],
                energetic: [
                    "Trebuie să decid curând între aceste opțiuni",
                    "Vreau un plan de acțiune concret",
                    "Care este primul pas pe care ar trebui să îl fac?",
                    "Am nevoie de impuls pentru a începe",
                    "Vreau să rezolv acest conflict odată pentru totdeauna",
                    "Dă-mi claritate să acționez acum"
                ],
                healing: [
                    "Sunt epuizat de toată presiunea",
                    "Trebuie să îmi procesez emoțiile mai întâi",
                    "Mă simt copleșit de toate așteptările",
                    "Vreau să găsesc pace înainte de a decide",
                    "Am nevoie să mă vindec înainte de a merge mai departe",
                    "Port o greutate pe care trebuie să o eliberez"
                ]
            },
            waveExamples: {
                calm: [
                    "În ultima vreme mă simt deconectat de mine însumi",
                    "Nu știu ce vreau cu adevărat de la viață",
                    "Am nevoie de un moment de liniște să gândesc",
                    "Vreau să îmi înțeleg mai bine sentimentele"
                ],
                deep: [
                    "Mi-e frică să dezamăgesc pe cei care au încredere în mine",
                    "Există ceva care mă blochează și nu știu ce",
                    "Simt că repet mereu aceleași greșeli",
                    "Îmi este greu să mă conectez cu emoțiile mele profunde"
                ],
                energetic: [
                    "Trebuie să iau o decizie importantă în curând",
                    "Sunt blocat și trebuie să avansez",
                    "Vreau să rezolv un conflict care mă epuizează",
                    "Am nevoie de un plan clar pentru a merge mai departe"
                ],
                healing: [
                    "Trec printr-un moment foarte dificil",
                    "Trebuie să procesez o pierdere sau o durere",
                    "Mă simt epuizat emoțional",
                    "Port răni care au nevoie să se vindece"
                ]
            }
        },
        oceanStates: {
            confused: 'Confuzie',
            anxious: 'Anxietate',
            processing: 'Procesare',
            clarity: 'Claritate',
            resolved: 'Rezolvare',
            neutral: 'Neutru'
        },
        achievements: {
            title: 'Realizări Deblocate',
            unlocked: 'deblocate',
            locked: 'blocate',
            newAchievement: 'Realizare Nouă!',
            viewAll: 'Vezi toate realizările'
        },
        report: {
            title: 'Raport de Călătorie',
            summary: 'Rezumat',
            journey: 'Călătorie Emoțională',
            metrics: 'Metrici de Expresie',
            oceanStates: 'Stări ale Oceanului',
            achievements: 'Realizări',
            insights: 'Perspective',
            recommendations: 'Recomandări',
            download: 'Descarcă',
            downloadJSON: 'Descarcă JSON',
            downloadTXT: 'Descarcă TXT'
        },
        metrics: {
            title: 'Metrici de Expresie',
            clarity: 'Claritate',
            specificity: 'Specificitate',
            emotionalAwareness: 'Conștiință Emoțională',
            overall: 'Scor General'
        },
        errors: {
            apiKeyMissing: 'Te rog configurează cheia API Gemini',
            connectionError: 'Eroare de conexiune. Încearcă din nou.',
            genericError: 'Ceva nu a mers bine. Te rog încearcă din nou.'
        },
        apiKey: {
            title: '🔑 Configurează API Key',
            subtitle: 'Pentru a folosi Whispers of the Wave ai nevoie de o cheie API gratuită Google Gemini.',
            step1: '1. Vizitează Google AI Studio',
            step2: '2. Conectează-te cu contul tău Google',
            step3: '3. Creează o nouă cheie API (este gratuită)',
            step4: '4. Copiază și lipește cheia mai jos',
            placeholder: 'Lipește cheia API aici...',
            getKey: 'Obține API Key Gratuit',
            save: 'Salvează și Începe',
            cancel: 'Anulează',
            validating: 'Se validează...',
            success: '✓ Cheie API validă',
            error: '✗ Cheie API invalidă',
            errorEmpty: 'Te rog introdu o cheie API',
            note: '💡 Cheia ta API este stocată doar în browserul tău și nu este partajată niciodată.',
            changeKey: 'Schimbă API Key'
        },
        splash: {
            title: 'Whispers of the Wave',
            subtitle: 'O călătorie de autocunoaștere ghidată de valuri',
            howItWorks: 'Cum funcționează?',
            startJourney: 'Începe Călătoria',
            selectWave: 'Selectează Valul Tău',
            titleMain: 'Whispers of the Wave - Acasă',
            titleSelection: 'Whispers of the Wave - Selectează Valul Tău',
            titleConversation: 'Whispers of the Wave - Conversație',
            tutorial: {
                step1: 'Alege valul tău în funcție de ce trebuie să explorezi',
                step2: 'Împărtășește gândurile tale liber',
                step3: 'Valurile vor reflecta adevărul tău interior'
            }
        }
    }
};

/**
 * I18n Class
 * Handles translation and language switching
 */
class I18n {
    constructor(storage = localStorage, defaultLang = 'es') {
        this.storage = storage;
        this.defaultLanguage = defaultLang;
        this.translations = translations;
        
        // Validate and set current language
        const storedLang = this.storage.getItem('whispers-language');
        this.currentLanguage = this._validateLanguage(storedLang) ? storedLang : defaultLang;
    }

    /**
     * Validate if language is supported
     * @private
     * @param {string} lang - Language code to validate
     * @returns {boolean} True if language is supported
     */
    _validateLanguage(lang) {
        return lang && this.translations.hasOwnProperty(lang);
    }

    /**
     * Get translation by key path with fallback support
     * @param {string} keyPath - Dot notation path (e.g., 'ui.welcome')
     * @param {object} params - Optional parameters for string interpolation
     * @returns {string|object} Translated string or object
     */
    t(keyPath, params = {}) {
        const keys = keyPath.split('.');
        
        // Try current language first
        let value = this._getNestedValue(this.translations[this.currentLanguage], keys);
        
        // Fallback to default language if not found
        if (value === undefined && this.currentLanguage !== this.defaultLanguage) {
            value = this._getNestedValue(this.translations[this.defaultLanguage], keys);
            if (value !== undefined) {
                console.warn(`Translation key "${keyPath}" not found in "${this.currentLanguage}", using fallback`);
            }
        }
        
        // Return key path if still not found
        if (value === undefined) {
            console.warn(`Translation key not found: ${keyPath}`);
            return keyPath;
        }

        // Handle string interpolation
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return value.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
        }

        return value;
    }

    /**
     * Get nested value from object using key path
     * @private
     * @param {object} obj - Object to traverse
     * @param {Array<string>} keys - Array of keys
     * @returns {*} Value at key path or undefined
     */
    _getNestedValue(obj, keys) {
        let value = obj;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        return value;
    }

    /**
     * Set current language
     * @param {string} lang - Language code (es, en, ro)
     * @returns {boolean} True if language was changed successfully
     */
    setLanguage(lang) {
        if (!this._validateLanguage(lang)) {
            console.warn(`Language not supported: ${lang}`);
            return false;
        }

        const previousLanguage = this.currentLanguage;
        this.currentLanguage = lang;
        this.storage.setItem('whispers-language', lang);
        
        // Dispatch event with previous and new language
        document.dispatchEvent(new CustomEvent('language:changed', {
            detail: { 
                language: lang,
                previousLanguage: previousLanguage
            }
        }));
        
        console.log(`🌐 Language changed from ${previousLanguage} to ${lang}`);
        return true;
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get current language (alias for getLanguage)
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     * @returns {Array} Array of language codes
     */
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}

// Create global instance
const i18n = new I18n();

// Export to window for global access
if (typeof window !== 'undefined') {
    window.i18n = i18n;
    window.I18n = I18n;
    window.translations = translations;
}

console.log('🌐 i18n system loaded');
