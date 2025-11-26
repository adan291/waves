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
            life_questioning: 'El Guía del Propósito'
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
            search: 'Buscar en historial'
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
            examples: {
                neutral: [
                    "Estoy entre medicina e ingeniería",
                    "Me gusta el arte pero también la ciencia",
                    "No sé si estudiar o trabajar primero",
                    "Mis padres quieren que estudie una cosa pero yo otra"
                ],
                exploration: [
                    "Me da miedo equivocarme y perder tiempo",
                    "Siento presión de mi familia por elegir algo estable",
                    "No sé qué me gusta realmente",
                    "Tengo muchas opciones y me paralizo"
                ],
                depth: [
                    "Tengo miedo de decepcionar a las personas que confían en mí",
                    "Me da miedo no ser lo suficientemente bueno",
                    "Temo invertir años en algo que no me llene",
                    "El miedo al fracaso me paraliza"
                ],
                identity: [
                    "Quiero hacer algo que tenga impacto en las personas",
                    "Me gusta crear cosas y ver resultados tangibles",
                    "Disfruto ayudar a otros y verlos crecer",
                    "Me apasiona aprender cosas nuevas constantemente"
                ],
                action: [
                    "Podría investigar más sobre las opciones que me interesan",
                    "Hablar con alguien que ya trabaje en eso",
                    "Probar algo pequeño esta semana para experimentar",
                    "Hacer una lista de pros y contras de cada opción"
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
        splash: {
            title: 'Whispers of the Wave',
            subtitle: 'Un viaje de autoconocimiento guiado por las olas',
            howItWorks: '¿Cómo funciona?',
            startJourney: 'Comenzar Viaje',
            selectWave: 'Selecciona tu Ola',
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
            life_questioning: 'The Purpose Guide'
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
            search: 'Search history'
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
            deepen: 'Deepen into:',
            nextSteps: 'Next steps:',
            examples: {
                neutral: [
                    "I'm between medicine and engineering",
                    "I like art but also science",
                    "I don't know whether to study or work first",
                    "My parents want me to study one thing but I want another"
                ],
                exploration: [
                    "I'm afraid of making a mistake and wasting time",
                    "I feel pressure from my family to choose something stable",
                    "I don't know what I really like",
                    "I have many options and I'm paralyzed"
                ],
                depth: [
                    "I'm afraid of disappointing people who trust me",
                    "I'm afraid I'm not good enough",
                    "I fear investing years in something that won't fulfill me",
                    "Fear of failure paralyzes me"
                ],
                identity: [
                    "I want to do something that impacts people",
                    "I like creating things and seeing tangible results",
                    "I enjoy helping others and watching them grow",
                    "I'm passionate about constantly learning new things"
                ],
                action: [
                    "I could research more about the options that interest me",
                    "Talk to someone who already works in that field",
                    "Try something small this week to experiment",
                    "Make a pros and cons list for each option"
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
        splash: {
            title: 'Whispers of the Wave',
            subtitle: 'A journey of self-discovery guided by the waves',
            howItWorks: 'How it works?',
            startJourney: 'Start Journey',
            selectWave: 'Select your Wave',
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
            life_questioning: 'Ghidul Scopului'
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
            search: 'Caută în istoric'
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
            deepen: 'Aprofundează în:',
            nextSteps: 'Pașii următori:',
            examples: {
                neutral: [
                    "Sunt între medicină și inginerie",
                    "Îmi place arta dar și știința",
                    "Nu știu dacă să studiez sau să lucrez mai întâi",
                    "Părinții mei vor să studiez ceva dar eu vreau altceva"
                ],
                exploration: [
                    "Mi-e frică să greșesc și să pierd timp",
                    "Simt presiune din partea familiei să aleg ceva stabil",
                    "Nu știu ce îmi place cu adevărat",
                    "Am multe opțiuni și sunt paralizat"
                ],
                depth: [
                    "Mi-e frică să dezamăgesc oamenii care au încredere în mine",
                    "Mi-e frică că nu sunt suficient de bun",
                    "Mă tem să investesc ani în ceva care nu mă va împlini",
                    "Frica de eșec mă paralizează"
                ],
                identity: [
                    "Vreau să fac ceva care să aibă impact asupra oamenilor",
                    "Îmi place să creez lucruri și să văd rezultate tangibile",
                    "Mă bucur să ajut pe alții și să îi văd crescând",
                    "Sunt pasionat de a învăța constant lucruri noi"
                ],
                action: [
                    "Aș putea cerceta mai mult despre opțiunile care mă interesează",
                    "Să vorbesc cu cineva care lucrează deja în domeniu",
                    "Să încerc ceva mic săptămâna aceasta pentru a experimenta",
                    "Să fac o listă de pro și contra pentru fiecare opțiune"
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
        splash: {
            title: 'Whispers of the Wave',
            subtitle: 'O călătorie de autocunoaștere ghidată de valuri',
            howItWorks: 'Cum funcționează?',
            startJourney: 'Începe Călătoria',
            selectWave: 'Selectează Valul Tău',
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
    constructor() {
        this.currentLanguage = localStorage.getItem('whispers-language') || 'es';
        this.translations = translations;
    }

    /**
     * Get translation by key path
     * @param {string} keyPath - Dot notation path (e.g., 'ui.welcome')
     * @param {object} params - Optional parameters for string interpolation
     * @returns {string} Translated string
     */
    t(keyPath, params = {}) {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLanguage];

        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                console.warn(`Translation key not found: ${keyPath}`);
                return keyPath;
            }
        }

        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return value.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
        }

        return value || keyPath;
    }

    /**
     * Set current language
     * @param {string} lang - Language code (es, en, fr, de)
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('whispers-language', lang);
            document.dispatchEvent(new CustomEvent('language:changed', {
                detail: { language: lang }
            }));
            console.log(`🌐 Language changed to: ${lang}`);
        } else {
            console.warn(`Language not supported: ${lang}`);
        }
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getLanguage() {
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
