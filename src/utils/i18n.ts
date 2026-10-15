export type AppLanguage = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it';

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
  locale: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', locale: 'en-US' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', locale: 'pt-BR' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', locale: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', locale: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', locale: 'de-DE' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', locale: 'it-IT' },
];

const I18N_STORAGE_KEY = 'tudolearn_app_language_v1';

export function getStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(I18N_STORAGE_KEY) as AppLanguage | null;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved;
    }
    // Check browser language
    const navLang = navigator.language?.slice(0, 2)?.toLowerCase();
    if (navLang && SUPPORTED_LANGUAGES.some((l) => l.code === navLang)) {
      return navLang as AppLanguage;
    }
  } catch (e) {
    console.error('Error reading saved language:', e);
  }
  return 'en';
}

export function saveStoredLanguage(lang: AppLanguage) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(I18N_STORAGE_KEY, lang);
  } catch (e) {
    console.error('Error saving language:', e);
  }
}

export const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  en: {
    // Navigation tabs
    'nav.learn': 'Learn',
    'nav.leaderboard': 'Leaderboard',
    'nav.badges': 'Badges',
    'nav.shop': 'Shop',
    'nav.community': 'Community',
    'nav.analytics': 'Analytics',
    'nav.management': 'Management',

    // Header & stats
    'header.streak': 'Streak',
    'header.gems': 'Gems',
    'header.hearts': 'Hearts',
    'header.super': 'Super',
    'header.get_super': 'Get Super',
    'header.switch_course': 'Switch Course or Subject',
    'header.search_course': 'Search courses, instruments, languages...',
    'header.native_language': 'Native / App Language',
    'header.select_native_lang': 'Choose your native language to learn and navigate:',
    'header.daily_goal': 'Daily Goal',
    'header.sign_in': 'Sign In with Google',
    'header.sign_out': 'Sign Out',
    'header.my_certificates': 'My Certificates',

    // Learning path & modes
    'path.learning_path': 'Learning Path',
    'path.study_guides': 'Study Guides',
    'path.flashcards': 'Flashcards',
    'path.level': 'Level',
    'path.unit': 'Unit',
    'path.lesson': 'Lesson',
    'path.start_quiz': 'Start Interactive Quiz',
    'path.read_notes': 'Read Study Notes',
    'path.practice_deck': 'Practice Deck',
    'path.pip_tutor': 'Pip Tutor',
    'path.ask_pip': 'Ask Pip AI tutor',

    // Levels & Super TudoLearn
    'levels.free_badge': 'Free Access',
    'levels.premium_badge': 'Super TudoLearn Exclusive',
    'levels.level_locked': 'Level Locked',
    'levels.upgrade_prompt_title': 'Unlock Levels 3 to 10 with Super TudoLearn',
    'levels.upgrade_prompt_desc': 'Levels 1 and 2 are free. Upgrade to Super TudoLearn to unlock all 10 Levels in every course, earn verified certificates, and get unlimited hearts!',
    'levels.upgrade_button': 'Upgrade to Super TudoLearn',
    'levels.milestone_level5': 'Milestone Level 5 — Intermediate Achievement',
    'levels.milestone_level10': 'Milestone Level 10 — Master Capstone Graduation',
    'levels.certificate_level5_award': 'Earn Level 5 Intermediate Diploma upon completion',
    'levels.certificate_level10_award': 'Earn Level 10 Master Certification upon completion',
    'levels.view_certificate': 'View & Print Certificate',

    // Certificates
    'cert.title': 'Certificate of Mastery',
    'cert.intermediate_title': 'Diploma of Intermediate Fluency & Practical Mastery',
    'cert.master_title': 'Master Certification of Academic Excellence',
    'cert.awarded_to': 'Awarded To',
    'cert.for_completing': 'For outstanding dedication, discipline, and successful completion of',
    'cert.verified_credential': 'Verified Academic Credential',
    'cert.print_pdf': 'Print / Save PDF',
    'cert.share': 'Share Certificate',
    'cert.official_seal': 'OFFICIAL SEAL',
    'cert.congrats_title': 'Congratulations on your Certificate!',
    'cert.congrats_desc': 'You have successfully conquered this milestone level! Your official verified certificate is now available.',

    // Quiz & Exercises
    'quiz.check': 'Check',
    'quiz.continue': 'Continue',
    'quiz.correct': 'Correct! Well done!',
    'quiz.incorrect': 'Not quite. Check the correct answer below.',
    'quiz.hint': 'Hint',
    'quiz.explanation': 'Explanation',
    'quiz.listen_again': 'Listen again',
    'quiz.speak_now': 'Speak now',
  },

  pt: {
    // Navigation tabs
    'nav.learn': 'Aprender',
    'nav.leaderboard': 'Classificação',
    'nav.badges': 'Conquistas',
    'nav.shop': 'Loja',
    'nav.community': 'Comunidade',
    'nav.analytics': 'Progresso & Certificados',
    'nav.management': 'Gestão & Painel',

    // Header & stats
    'header.streak': 'Ofensiva',
    'header.gems': 'Gemas',
    'header.hearts': 'Vidas',
    'header.super': 'Super',
    'header.get_super': 'Seja Super',
    'header.switch_course': 'Trocar de Curso ou Idioma',
    'header.search_course': 'Pesquisar cursos, instrumentos, idiomas...',
    'header.native_language': 'Idioma Nativo do App',
    'header.select_native_lang': 'Escolha seu idioma nativo para navegar e aprender:',
    'header.daily_goal': 'Meta Diária',
    'header.sign_in': 'Entrar com Google',
    'header.sign_out': 'Sair',
    'header.my_certificates': 'Meus Certificados',

    // Learning path & modes
    'path.learning_path': 'Trilha de Aprendizado',
    'path.study_guides': 'Guias de Estudo',
    'path.flashcards': 'Flashcards',
    'path.level': 'Nível',
    'path.unit': 'Unidade',
    'path.lesson': 'Lição',
    'path.start_quiz': 'Iniciar Quiz Prático',
    'path.read_notes': 'Ler Notas de Estudo',
    'path.practice_deck': 'Praticar Cartões',
    'path.pip_tutor': 'Tutor Pip',
    'path.ask_pip': 'Pedir ajuda ao Pip AI',

    // Levels & Super TudoLearn
    'levels.free_badge': 'Acesso Gratuito',
    'levels.premium_badge': 'Exclusivo Super TudoLearn',
    'levels.level_locked': 'Nível Bloqueado',
    'levels.upgrade_prompt_title': 'Desbloqueie os Níveis 3 a 10 com o Super TudoLearn',
    'levels.upgrade_prompt_desc': 'Os Níveis 1 e 2 são gratuitos. Atualize para o Super TudoLearn para desbloquear todos os 10 Níveis de todos os cursos, conquistar certificados verificados e ter vidas infinitas!',
    'levels.upgrade_button': 'Fazer Upgrade para Super TudoLearn',
    'levels.milestone_level5': 'Nível Marco 5 — Conquista Intermediária',
    'levels.milestone_level10': 'Nível Marco 10 — Formatura e Certificação Master',
    'levels.certificate_level5_award': 'Conquiste o Diploma Intermediário Nível 5 ao concluir',
    'levels.certificate_level10_award': 'Conquiste o Certificado Master Nível 10 ao concluir',
    'levels.view_certificate': 'Ver & Imprimir Certificado',

    // Certificates
    'cert.title': 'Certificado de Conclusão e Domínio',
    'cert.intermediate_title': 'Diploma de Fluência Intermediária e Domínio Prático',
    'cert.master_title': 'Certificação Master de Excelência Acadêmica',
    'cert.awarded_to': 'Concedido a',
    'cert.for_completing': 'Por dedicação exemplar, disciplina intelectual e conclusão com êxito de',
    'cert.verified_credential': 'Credencial Acadêmica Verificada',
    'cert.print_pdf': 'Imprimir / Salvar PDF',
    'cert.share': 'Compartilhar Certificado',
    'cert.official_seal': 'SELO OFICIAL',
    'cert.congrats_title': 'Parabéns pelo seu Certificado!',
    'cert.congrats_desc': 'Você completou este nível marco com excelência! Seu certificado oficial verificado já está disponível.',

    // Quiz & Exercises
    'quiz.check': 'Verificar',
    'quiz.continue': 'Continuar',
    'quiz.correct': 'Correto! Muito bem!',
    'quiz.incorrect': 'Incorreto. Veja a resposta correta abaixo.',
    'quiz.hint': 'Dica',
    'quiz.explanation': 'Explicação',
    'quiz.listen_again': 'Ouvir novamente',
    'quiz.speak_now': 'Falar agora',
  },

  es: {
    // Navigation tabs
    'nav.learn': 'Aprender',
    'nav.leaderboard': 'Clasificación',
    'nav.badges': 'Logros',
    'nav.shop': 'Tienda',
    'nav.community': 'Comunidad',
    'nav.analytics': 'Estadísticas y Diplomas',
    'nav.management': 'Gestión y Panel',

    // Header & stats
    'header.streak': 'Racha',
    'header.gems': 'Gemas',
    'header.hearts': 'Vidas',
    'header.super': 'Super',
    'header.get_super': 'Hazte Super',
    'header.switch_course': 'Cambiar de Curso o Idioma',
    'header.search_course': 'Buscar cursos, instrumentos, materias...',
    'header.native_language': 'Idioma Nativo de la App',
    'header.select_native_lang': 'Elige tu idioma materno para aprender y navegar:',
    'header.daily_goal': 'Meta Diaria',
    'header.sign_in': 'Iniciar con Google',
    'header.sign_out': 'Cerrar Sesión',
    'header.my_certificates': 'Mis Certificados',

    // Learning path & modes
    'path.learning_path': 'Ruta de Aprendizaje',
    'path.study_guides': 'Guías de Estudio',
    'path.flashcards': 'Fichas de Memoria',
    'path.level': 'Nivel',
    'path.unit': 'Unidad',
    'path.lesson': 'Lección',
    'path.start_quiz': 'Comenzar Cuestionario',
    'path.read_notes': 'Leer Notas de Estudio',
    'path.practice_deck': 'Practicar Fichas',
    'path.pip_tutor': 'Tutor Pip',
    'path.ask_pip': 'Preguntar al Tutor Pip AI',

    // Levels & Super TudoLearn
    'levels.free_badge': 'Acceso Libre',
    'levels.premium_badge': 'Exclusivo Super TudoLearn',
    'levels.level_locked': 'Nivel Bloqueado',
    'levels.upgrade_prompt_title': 'Desbloquea los Niveles 3 al 10 con Super TudoLearn',
    'levels.upgrade_prompt_desc': 'Los Niveles 1 y 2 son gratuitos. ¡Actualiza a Super TudoLearn para desbloquear los 10 Niveles en todos los cursos, obtener certificados oficiales y vidas infinitas!',
    'levels.upgrade_button': 'Actualizar a Super TudoLearn',
    'levels.milestone_level5': 'Nivel Hito 5 — Logro Intermedio',
    'levels.milestone_level10': 'Nivel Hito 10 — Graduación y Certificación Máster',
    'levels.certificate_level5_award': 'Obtén el Diploma Intermedio Nivel 5 al completar',
    'levels.certificate_level10_award': 'Obtén la Certificación Máster Nivel 10 al completar',
    'levels.view_certificate': 'Ver e Imprimir Certificado',

    // Certificates
    'cert.title': 'Certificado de Conclusión y Dominio',
    'cert.intermediate_title': 'Diploma de Fluidez Intermedia y Dominio Práctico',
    'cert.master_title': 'Certificación Máster de Excelencia Académica',
    'cert.awarded_to': 'Otorgado a',
    'cert.for_completing': 'Por su ejemplar disciplina, dedicación y superación exitosa de',
    'cert.verified_credential': 'Credencial Académica Verificada',
    'cert.print_pdf': 'Imprimir / Guardar PDF',
    'cert.share': 'Compartir Certificado',
    'cert.official_seal': 'SELLO OFICIAL',
    'cert.congrats_title': '¡Felicidades por tu Certificado!',
    'cert.congrats_desc': '¡Has superado este nivel hito con honores! Tu certificado verificado ya está disponible.',

    // Quiz & Exercises
    'quiz.check': 'Comprobar',
    'quiz.continue': 'Continuar',
    'quiz.correct': '¡Excelente! ¡Correcto!',
    'quiz.incorrect': 'Incorrecto. Mira la respuesta correcta abajo.',
    'quiz.hint': 'Pista',
    'quiz.explanation': 'Explicación',
    'quiz.listen_again': 'Escuchar de nuevo',
    'quiz.speak_now': 'Habla ahora',
  },

  fr: {
    // Navigation tabs
    'nav.learn': 'Apprendre',
    'nav.leaderboard': 'Classement',
    'nav.badges': 'Badges',
    'nav.shop': 'Boutique',
    'nav.community': 'Communauté',
    'nav.analytics': 'Statistiques & Certificats',
    'nav.management': 'Gestion & Studio',

    // Header & stats
    'header.streak': 'Série',
    'header.gems': 'Gemmes',
    'header.hearts': 'Vies',
    'header.super': 'Super',
    'header.get_super': 'Passer Super',
    'header.switch_course': 'Changer de Cours ou Langue',
    'header.search_course': 'Rechercher des cours, instruments, langues...',
    'header.native_language': 'Langue Maternelle de l\'Application',
    'header.select_native_lang': 'Choisissez votre langue maternelle pour apprendre et naviguer :',
    'header.daily_goal': 'Objectif Quotidien',
    'header.sign_in': 'Connexion Google',
    'header.sign_out': 'Déconnexion',
    'header.my_certificates': 'Mes Certificats',

    // Learning path & modes
    'path.learning_path': 'Parcours d\'Apprentissage',
    'path.study_guides': 'Fiches de Cours',
    'path.flashcards': 'Cartes Mémoire',
    'path.level': 'Niveau',
    'path.unit': 'Unité',
    'path.lesson': 'Leçon',
    'path.start_quiz': 'Démarrer le Quiz Interactif',
    'path.read_notes': 'Lire le Résumé',
    'path.practice_deck': 'Pratiquer les Cartes',
    'path.pip_tutor': 'Tuteur Pip',
    'path.ask_pip': 'Poser une question à Pip AI',

    // Levels & Super TudoLearn
    'levels.free_badge': 'Accès Gratuit',
    'levels.premium_badge': 'Exclusivité Super TudoLearn',
    'levels.level_locked': 'Niveau Verrouillé',
    'levels.upgrade_prompt_title': 'Débloquez les Niveaux 3 à 10 avec Super TudoLearn',
    'levels.upgrade_prompt_desc': 'Les Niveaux 1 et 2 sont gratuits. Passez à Super TudoLearn pour débloquer les 10 Niveaux de tous les cours, obtenir des certificats officiels et des vies illimitées !',
    'levels.upgrade_button': 'Passer à Super TudoLearn',
    'levels.milestone_level5': 'Niveau Étape 5 — Réussite Intermédiaire',
    'levels.milestone_level10': 'Niveau Étape 10 — Maîtrise & Certification Expert',
    'levels.certificate_level5_award': 'Obtenez le Diplôme Intermédiaire Niveau 5 à l\'achèvement',
    'levels.certificate_level10_award': 'Obtenez la Certification Master Niveau 10 à l\'achèvement',
    'levels.view_certificate': 'Voir & Imprimer le Certificat',

    // Certificates
    'cert.title': 'Certificat de Réussite et de Maîtrise',
    'cert.intermediate_title': 'Diplôme de Maîtrise Pratique et d\'Aisance Intermédiaire',
    'cert.master_title': 'Certification Master d\'Excellence Académique',
    'cert.awarded_to': 'Attribué à',
    'cert.for_completing': 'Pour son assiduité exemplaire, sa rigueur intellectuelle et la validation de',
    'cert.verified_credential': 'Titre Académique Vérifié',
    'cert.print_pdf': 'Imprimer / Sauvegarder PDF',
    'cert.share': 'Partager le Certificat',
    'cert.official_seal': 'SCEAU OFFICIEL',
    'cert.congrats_title': 'Félicitations pour votre Certificat !',
    'cert.congrats_desc': 'Vous avez validé ce niveau clé avec brio ! Votre certificat officiel vérifié est désormais disponible.',

    // Quiz & Exercises
    'quiz.check': 'Vérifier',
    'quiz.continue': 'Continuer',
    'quiz.correct': 'Bravo ! C\'est exact !',
    'quiz.incorrect': 'Pas tout à fait. Voyez la bonne réponse ci-dessous.',
    'quiz.hint': 'Indice',
    'quiz.explanation': 'Explication',
    'quiz.listen_again': 'Réécouter',
    'quiz.speak_now': 'Parlez maintenant',
  },

  de: {
    // Navigation tabs
    'nav.learn': 'Lernen',
    'nav.leaderboard': 'Rangliste',
    'nav.badges': 'Erfolge',
    'nav.shop': 'Shop',
    'nav.community': 'Community',
    'nav.analytics': 'Statistiken & Zertifikate',
    'nav.management': 'Verwaltung & Studio',

    // Header & stats
    'header.streak': 'Streak',
    'header.gems': 'Edelsteine',
    'header.hearts': 'Herzen',
    'header.super': 'Super',
    'header.get_super': 'Super holen',
    'header.switch_course': 'Kurs oder Sprache wechseln',
    'header.search_course': 'Kurse, Instrumente, Sprachen suchen...',
    'header.native_language': 'Muttersprache / App-Sprache',
    'header.select_native_lang': 'Wählen Sie Ihre Muttersprache zum Lernen und Navigieren:',
    'header.daily_goal': 'Tagesziel',
    'header.sign_in': 'Mit Google anmelden',
    'header.sign_out': 'Abmelden',
    'header.my_certificates': 'Meine Zertifikate',

    // Learning path & modes
    'path.learning_path': 'Lernpfad',
    'path.study_guides': 'Lernleitfäden',
    'path.flashcards': 'Karteikarten',
    'path.level': 'Stufe',
    'path.unit': 'Einheit',
    'path.lesson': 'Lektion',
    'path.start_quiz': 'Interaktives Quiz starten',
    'path.read_notes': 'Notizen lesen',
    'path.practice_deck': 'Karten üben',
    'path.pip_tutor': 'Pip Tutor',
    'path.ask_pip': 'Pip KI-Tutor fragen',

    // Levels & Super TudoLearn
    'levels.free_badge': 'Kostenloser Zugang',
    'levels.premium_badge': 'Super TudoLearn Exklusiv',
    'levels.level_locked': 'Stufe gesperrt',
    'levels.upgrade_prompt_title': 'Schalte Stufen 3 bis 10 mit Super TudoLearn frei',
    'levels.upgrade_prompt_desc': 'Stufen 1 und 2 sind kostenlos. Upgrade auf Super TudoLearn für alle 10 Stufen in jedem Kurs, offizielle Zertifikate und unbegrenzte Herzen!',
    'levels.upgrade_button': 'Auf Super TudoLearn upgraden',
    'levels.milestone_level5': 'Meilenstein Stufe 5 — Fortgeschrittener Abschluss',
    'levels.milestone_level10': 'Meilenstein Stufe 10 — Master-Zertifizierung',
    'levels.certificate_level5_award': 'Erhalte das Stufe 5 Zwischendiplom beim Abschluss',
    'levels.certificate_level10_award': 'Erhalte die Stufe 10 Master-Zertifizierung beim Abschluss',
    'levels.view_certificate': 'Zertifikat anzeigen & drucken',

    // Certificates
    'cert.title': 'Abschluss- und Meisterschaftszertifikat',
    'cert.intermediate_title': 'Diplom für fortgeschrittene Sprach- und Praxisbeherrschung',
    'cert.master_title': 'Master-Zertifizierung akademischer Exzellenz',
    'cert.awarded_to': 'Verliehen an',
    'cert.for_completing': 'Für vorbildliches Engagement, Disziplin und den erfolgreichen Abschluss von',
    'cert.verified_credential': 'Verifizierter akademischer Nachweis',
    'cert.print_pdf': 'Drucken / PDF speichern',
    'cert.share': 'Zertifikat teilen',
    'cert.official_seal': 'OFFIZIELLES SIEGEL',
    'cert.congrats_title': 'Herzlichen Glückwunsch zu Ihrem Zertifikat!',
    'cert.congrats_desc': 'Sie haben diese Meilensteinstufe mit Bravour gemeistert! Ihr offizielles Zertifikat ist jetzt bereit.',

    // Quiz & Exercises
    'quiz.check': 'Prüfen',
    'quiz.continue': 'Weiter',
    'quiz.correct': 'Richtig! Sehr gut!',
    'quiz.incorrect': 'Nicht ganz. Schau dir die richtige Antwort an.',
    'quiz.hint': 'Hinweis',
    'quiz.explanation': 'Erklärung',
    'quiz.listen_again': 'Nochmals anhören',
    'quiz.speak_now': 'Jetzt sprechen',
  },

  it: {
    // Navigation tabs
    'nav.learn': 'Impara',
    'nav.leaderboard': 'Classifica',
    'nav.badges': 'Distintivi',
    'nav.shop': 'Negozio',
    'nav.community': 'Comunità',
    'nav.analytics': 'Statistiche & Certificati',
    'nav.management': 'Gestione & Studio',

    // Header & stats
    'header.streak': 'Serie',
    'header.gems': 'Gemme',
    'header.hearts': 'Vite',
    'header.super': 'Super',
    'header.get_super': 'Diventa Super',
    'header.switch_course': 'Cambia Corso o Lingua',
    'header.search_course': 'Cerca corsi, strumenti, lingue...',
    'header.native_language': 'Lingua Madre dell\'App',
    'header.select_native_lang': 'Scegli la tua lingua madre per navigare e imparare:',
    'header.daily_goal': 'Obiettivo Giornaliero',
    'header.sign_in': 'Accedi con Google',
    'header.sign_out': 'Esci',
    'header.my_certificates': 'I Miei Certificati',

    // Learning path & modes
    'path.learning_path': 'Percorso di Studio',
    'path.study_guides': 'Guide di Studio',
    'path.flashcards': 'Flashcard',
    'path.level': 'Livello',
    'path.unit': 'Unità',
    'path.lesson': 'Lezione',
    'path.start_quiz': 'Inizia Quiz Pratico',
    'path.read_notes': 'Leggi Note di Studio',
    'path.practice_deck': 'Esercitati con le Carte',
    'path.pip_tutor': 'Tutor Pip',
    'path.ask_pip': 'Chiedi al Tutor Pip AI',

    // Levels & Super TudoLearn
    'levels.free_badge': 'Accesso Gratuito',
    'levels.premium_badge': 'Esclusivo Super TudoLearn',
    'levels.level_locked': 'Livello Bloccato',
    'levels.upgrade_prompt_title': 'Sblocca i Livelli da 3 a 10 con Super TudoLearn',
    'levels.upgrade_prompt_desc': 'I Livelli 1 e 2 sono gratuiti. Passa a Super TudoLearn per sbloccare tutti i 10 Livelli in ogni corso, ottenere certificati ufficiali e vite illimitate!',
    'levels.upgrade_button': 'Passa a Super TudoLearn',
    'levels.milestone_level5': 'Livello Traguardo 5 — Risultato Intermedio',
    'levels.milestone_level10': 'Livello Traguardo 10 — Certificazione Master',
    'levels.certificate_level5_award': 'Ottieni il Diploma Intermedio Livello 5 al completamento',
    'levels.certificate_level10_award': 'Ottieni la Certificazione Master Livello 10 al completamento',
    'levels.view_certificate': 'Visualizza & Stampa Certificato',

    // Certificates
    'cert.title': 'Certificato di Completamento e Padronanza',
    'cert.intermediate_title': 'Diploma di Fluenza Intermedia e Padronanza Pratica',
    'cert.master_title': 'Certificazione Master di Eccellenza Accademica',
    'cert.awarded_to': 'Conferito a',
    'cert.for_completing': 'Per esemplare dedizione, disciplina e superamento con successo di',
    'cert.verified_credential': 'Titolo Accademico Verificato',
    'cert.print_pdf': 'Stampa / Salva PDF',
    'cert.share': 'Condividi Certificato',
    'cert.official_seal': 'SIGILLO UFFICIALE',
    'cert.congrats_title': 'Congratulazioni per il tuo Certificato!',
    'cert.congrats_desc': 'Hai superato questo livello fondamentale con successo! Il tuo certificato ufficiale verificato è ora disponibile.',

    // Quiz & Exercises
    'quiz.check': 'Verifica',
    'quiz.continue': 'Continua',
    'quiz.correct': 'Corretto! Ottimo lavoro!',
    'quiz.incorrect': 'Non proprio. Guarda la risposta corretta sotto.',
    'quiz.hint': 'Suggerimento',
    'quiz.explanation': 'Spiegazione',
    'quiz.listen_again': 'Riascolta',
    'quiz.speak_now': 'Parla ora',
  },
};

export function t(key: string, lang: AppLanguage = 'en'): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}
