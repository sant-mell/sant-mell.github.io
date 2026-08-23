/* ----------------------------------------------------------------------------
 * Site content in all four languages Santiago speaks. English is the default.
 * Only human-readable prose lives here; icons, URLs, dates, numbers, tech-stack
 * chips, and proper nouns stay in the page as language-neutral data.
 * ------------------------------------------------------------------------- */

export type Locale = "en" | "es" | "pt" | "nl";

export const LOCALES: { code: Locale; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
  { code: "pt", label: "PT", name: "Português" },
  { code: "nl", label: "NL", name: "Nederlands" },
];

interface SectionCopy {
  eyebrow: string;
  title: string;
  intro?: string;
}

export interface Dict {
  hero: {
    prefix: string;
    roles: string[];
    openToWork: string;
    cv: string;
    cardRole: string;
  };
  ui: {
    viewOnGithub: string;
    viewOnLinkedin: string;
    playInBrowser: string;
    visitSite: string;
    benchSequential: string;
    benchParallel: string;
    benchFaster: string;
    viewCredential: string;
  };
  statLabels: Record<string, string>;
  sections: {
    projects: SectionCopy;
    skills: SectionCopy;
    github: SectionCopy;
    experience: SectionCopy;
    academics: SectionCopy;
    certifications: SectionCopy;
    whereFrom: SectionCopy;
  };
  leadershipTitle: string;
  courseworkTitle: string;
  timeline: { eyebrow: string; title: string; hint: string };
  globeCaption: string;
  footer: { location: string; citizenship: string; builtWith: string };
  projectDescriptions: string[];
  experiences: { role: string; detail: string }[];
  timelineNodes: { title: string; content: string; category: string }[];
  certNames: string[];
  metrics: { label: string; detail: string }[];
  skillTitles: string[];
  coursework: string[];
  leadership: { pre: string; post: string }[];
  whereFrom: { title: string; body: string }[];
  languageBadges: string[];
}

export const translations: Record<Locale, Dict> = {
  en: {
    hero: {
      prefix: "Santiago is a",
      roles: [
        "CS Student",
        "Full-stack developer",
        "CCNA student",
        "Systems & IoT developer",
        "Polyglot",
      ],
      openToWork: "Open to Work",
      cv: "Download CV (PDF)",
      cardRole: "Multicultural CS (ITC) student @ Tec de Monterrey, Santa Fe",
    },
    ui: {
      viewOnGithub: "View on GitHub",
      viewOnLinkedin: "View on LinkedIn",
      playInBrowser: "Play in browser",
      visitSite: "Visit site",
      benchSequential: "Sequential",
      benchParallel: "Parallel",
      benchFaster: "faster",
      viewCredential: "View credential",
    },
    statLabels: {
      endpoints: "REST endpoints",
      schemaLoc: "schema LOC",
      procedures: "stored procedures",
      frameworks: "frameworks",
      levels: "themed levels",
      servicePages: "service pages",
      clientSite: "client site",
      buildTime: "to build",
      languages: "languages",
    },
    sections: {
      projects: {
        eyebrow: "Projects",
        title: "A few things I've built",
        intro:
          "IoT firmware on ESP32, full-stack web apps, browser games, and parallel processing in Python.",
      },
      skills: {
        eyebrow: "Skills",
        title: "Technical toolkit",
        intro:
          "The languages, systems, and tools I work with.",
      },
      github: {
        eyebrow: "On GitHub",
        title: "What I've been building",
        intro: "My public commit history. Hover the link to preview the profile.",
      },
      experience: {
        eyebrow: "Experience",
        title: "Where I've worked",
        intro:
          "Teaching English in the Netherlands, Python in a Mexican middle school, and mentoring first-year students at Tec.",
      },
      academics: { eyebrow: "Academics", title: "How I'm doing at Tec" },
      certifications: {
        eyebrow: "Certifications",
        title: "Certifications & awards",
      },
      whereFrom: {
        eyebrow: "Where I'm from",
        title: "Three countries, four languages",
        intro:
          "I grew up in a Brazilian-Portuguese household, did the IB Diploma in the Netherlands, and now study Computer Science in Mexico City. I hold Mexican, Brazilian, and Portuguese (EU) citizenship, so I can work across the EU, Mexico, and Brazil without sponsorship.",
      },
    },
    leadershipTitle: "Leadership & Community",
    courseworkTitle: "Relevant Coursework",
    timeline: {
      eyebrow: "My path so far",
      title: "From the IB Diploma to the CCNA track",
      hint: "Click a node to see more",
    },
    globeCaption: "São Paulo · Rotterdam · Mexico City",
    footer: {
      location:
        "Greater Mexico City · Open to internships, remote, and global roles",
      citizenship:
        "Mexican, Brazilian, and Portuguese (EU) citizen · eligible to work in the EU, Mexico, and Brazil with no sponsorship",
      builtWith: "Built with Next.js 16, React 19 and Tailwind CSS 4.",
    },
    projectDescriptions: [
      "A full IoT prototype with occupancy detection, automated barrier control, and cloud telemetry. Embedded firmware on ESP32 talking to cloud services over MQTT.",
      "A freelance website I designed and shipped for DT Construct ICS, a Mexican construction company. Hand-coded in vanilla HTML, CSS, and JavaScript: a six-page services catalog (retail, industrial, infrastructure, special installations, and maintenance), interactive Leaflet maps, and a project gallery of the company's completed work. Live on a custom domain.",
      "A hackathon prototype that routes Mexican water trucks to the most water-stressed areas. Combines satellite climate data with a weighted, safety-aware variation of Dijkstra's algorithm.",
      "A semester-long team project for TC2005B: a roguelike deckbuilder built from scratch, engine included (no framework). An HTML5 Canvas client over an Express REST API of 28 endpoints, backed by a 745-line MySQL schema: 12 tables, 20 stored procedures, 13 analytics views (leaderboards, enemy and difficulty win rates, card popularity), and 7 triggers that keep player stats and run history in sync. Mid-duel state is checkpointed as JSON so a run resumes exactly where it left off, with cascade deletes and 35 indexes.",
      "A browser Breakout built from scratch on a custom HTML5 Canvas engine (no framework): an OOP hierarchy of Ball, Paddle, and Brick over a shared GameObject base and a small Vector library, driven by a delta-time loop for frame-rate-independent physics. The twist: tilting the paddle 30 degrees rotates it through the canvas transform and redirects the ball's bounce vector to aim into corners. Three themed levels (disco, hip hop, rock), each with its own sprites and music.",
      "A hand-built DFA lexer (explicit transition table, no regex) extended into a parallel syntax highlighter, benchmarked at about 6x speedup over a sequential baseline: 60 Python files, 8 MB, on 16 cores.",
      "This site. React 19, Tailwind 4, and a static export build, with a glassy dark UI over an animated WebGL shader background, an interactive three.js globe, a radial career orbit, and live link previews.",
    ],
    experiences: [
      {
        role: "English Language Teacher",
        detail:
          "Immersive, play-based English instruction for 165 children (ages 4 to 12) in a multicultural summer-camp setting, using English, Spanish, and Portuguese to support classroom management and cross-cultural understanding.",
      },
      {
        role: "Python Instructor",
        detail:
          "Designed and taught a Python curriculum for middle-school students: variables, loops, conditionals, functions, and problem solving with Replit and Turtle, plus assessments and feedback.",
      },
      {
        role: "Volunteer & Peer Mentor",
        detail:
          "Graduate of the Peer Mentorship Program. Guided new students through their first year, academically and socially.",
      },
      {
        role: "Media Logistics Assistant",
        detail:
          "Optimized last-mile print distribution routes for NRC, De Telegraaf, AD, and others under strict daily time constraints.",
      },
    ],
    timelineNodes: [
      {
        title: "IBDP, Rotterdam (NL)",
        content:
          "International Baccalaureate Diploma at Rotterdam International Secondary School, scoring 33/45 with an Excellence in English award.",
        category: "Education",
      },
      {
        title: "Polyglot: PT / ES / EN / NL",
        content:
          "Native Portuguese and Spanish, English C1, Dutch A1.",
        category: "Skills",
      },
      {
        title: "Tec de Monterrey, ITC",
        content:
          "B.S. in Computer Science and Technology at Campus Santa Fe, Mexico City. GPA 93.5/100. Coursework spanning data structures, databases, embedded systems and IoT, device interconnection, and software engineering.",
        category: "Education",
      },
      {
        title: "Teaching & Peer Mentorship",
        content:
          "Python instructor for middle-school students, English teacher in the Netherlands, and a graduate Peer Mentor at Tec, guiding new students through their first year.",
        category: "Experience",
      },
      {
        title: "IoT & Systems Engineering",
        content:
          "An ESP32 smart-parking prototype with MQTT telemetry, a DFA-based lexer parallelized with Python multiprocessing, and data structures in C++.",
        category: "Projects",
      },
      {
        title: "START Hack: Aquaroute",
        content:
          "First hackathon. Built Aquaroute in 36 hours: a SaaS that routes water trucks to the most water-stressed areas using satellite climate data and a weighted variation of Dijkstra's algorithm.",
        category: "Projects",
      },
      {
        title: "Target: CCNA & Cybersecurity",
        content:
          "Working toward the Cisco CCNA certification and a cybersecurity or network engineering internship, with a focus on remote, global infrastructure roles.",
        category: "Career",
      },
    ],
    certNames: [
      "Universitas 21 Global Citizenship",
      "IB Diploma, 33/45",
      "Excellence in English Award",
    ],
    metrics: [
      { label: "University GPA", detail: "out of 100, Tec de Monterrey" },
      { label: "IB Diploma", detail: "Excellence in English" },
      { label: "Expected Graduation", detail: "B.S. Computer Science (ITC)" },
      { label: "Languages", detail: "two native, English C1" },
    ],
    skillTitles: ["Languages", "Systems & Networking", "Tools & Web"],
    coursework: [
      "Data Structures",
      "OOP (C++)",
      "Device Interconnection (IoT)",
      "Embedded Systems & IoT",
      "Databases",
      "Software Engineering",
      "Web Development",
      "Advanced AI for Data Science",
      "Data Analytics & AI Tools",
      "Computational Thinking",
      "Differential Equations",
    ],
    leadership: [
      { pre: "Vice President, ", post: ", the Computer Science student society (Campus Santa Fe) · 5th semester" },
      { pre: "Former Vice President, ", post: " (Campus Santa Fe) · 4th semester" },
      { pre: "", post: " (CSF)" },
      { pre: "", post: " Chapter member (CSF)" },
      { pre: "", post: ", Tec de Monterrey · since 2nd semester" },
      { pre: "Head of Charity, ", post: " (Buy a Tulip, Help a Girl · Red Cross relief)" },
    ],
    whereFrom: [
      {
        title: "Brazilian Roots",
        body: "Native Portuguese and Spanish speaker, raised in a Brazilian-Portuguese household.",
      },
      {
        title: "IB Diploma, Netherlands",
        body: "Completed the International Baccalaureate (33/45) at Rotterdam International Secondary School with an Excellence in English award.",
      },
      {
        title: "CS, Mexico City",
        body: "Studying Computer Science and Technology at Tec de Monterrey, Campus Santa Fe, in the Santa Fe district of Mexico City.",
      },
    ],
    languageBadges: [
      "Portuguese, Native",
      "Spanish, Native",
      "English, C1",
      "Dutch, A1",
    ],
  },

  es: {
    hero: {
      prefix: "Santiago es un",
      roles: [
        "Estudiante de ITC",
        "Desarrollador full-stack",
        "Estudiante de CCNA",
        "Desarrollador de sistemas e IoT",
        "Políglota",
      ],
      openToWork: "Disponible para trabajar",
      cv: "Descargar CV (PDF)",
      cardRole: "Estudiante multicultural de Tecnologías Computacionales (ITC) en el Tec de Monterrey, Santa Fe",
    },
    ui: {
      viewOnGithub: "Ver en GitHub",
      viewOnLinkedin: "Ver en LinkedIn",
      playInBrowser: "Jugar en el navegador",
      visitSite: "Ver sitio",
      benchSequential: "Secuencial",
      benchParallel: "Paralelo",
      benchFaster: "más rápido",
      viewCredential: "Ver credencial",
    },
    statLabels: {
      endpoints: "endpoints REST",
      schemaLoc: "líneas de esquema",
      procedures: "procedimientos",
      frameworks: "frameworks",
      levels: "niveles temáticos",
      servicePages: "páginas de servicios",
      clientSite: "sitio del cliente",
      buildTime: "de desarrollo",
      languages: "idiomas",
    },
    sections: {
      projects: {
        eyebrow: "Proyectos",
        title: "Algunas cosas que he construido",
        intro:
          "Firmware IoT en ESP32, aplicaciones web full-stack, juegos en el navegador y cómputo paralelo en Python.",
      },
      skills: {
        eyebrow: "Habilidades",
        title: "Kit técnico",
        intro:
          "Los lenguajes, sistemas y herramientas con los que trabajo.",
      },
      github: {
        eyebrow: "En GitHub",
        title: "Lo que he estado construyendo",
        intro:
          "Mi historial público de commits. Pasa el cursor por el enlace para previsualizar el perfil.",
      },
      experience: {
        eyebrow: "Experiencia",
        title: "Dónde he trabajado",
        intro:
          "Clases de inglés en los Países Bajos, Python en una telesecundaria mexicana y mentoría a estudiantes de primer año en el Tec.",
      },
      academics: { eyebrow: "Académico", title: "Cómo me va en el Tec" },
      certifications: {
        eyebrow: "Certificaciones",
        title: "Certificaciones y premios",
      },
      whereFrom: {
        eyebrow: "De dónde vengo",
        title: "Tres países, cuatro idiomas",
        intro:
          "Crecí en un hogar brasileño y portugués, hice el Diploma del IB en los Países Bajos y ahora estudio Ingeniería en Tecnologías Computacionales en la Ciudad de México. Tengo nacionalidad mexicana, brasileña y portuguesa (UE), así que puedo trabajar en la UE, México y Brasil sin patrocinio.",
      },
    },
    leadershipTitle: "Liderazgo y comunidad",
    courseworkTitle: "Cursos relevantes",
    timeline: {
      eyebrow: "Mi camino hasta ahora",
      title: "Del Diploma del IB a la ruta CCNA",
      hint: "Haz clic en un nodo para ver más",
    },
    globeCaption: "São Paulo · Róterdam · Ciudad de México",
    footer: {
      location:
        "Zona Metropolitana de la Ciudad de México · Disponible para prácticas, remoto y roles globales",
      citizenship:
        "Ciudadano mexicano, brasileño y portugués (UE) · habilitado para trabajar en la UE, México y Brasil sin patrocinio",
      builtWith: "Hecho con Next.js 16, React 19 y Tailwind CSS 4.",
    },
    projectDescriptions: [
      "Un prototipo IoT completo con detección de ocupación, control automático de barrera y telemetría en la nube. Firmware embebido en ESP32 que habla con servicios en la nube por MQTT.",
      "Un sitio web freelance que diseñé y entregué para DT Construct ICS, una empresa mexicana de construcción. Programado a mano en HTML, CSS y JavaScript: un catálogo de servicios de seis páginas (retail, industrial, infraestructura, instalaciones especiales y mantenimiento), mapas interactivos con Leaflet y una galería con las obras terminadas de la empresa. En línea con dominio propio.",
      "Un prototipo de hackathon que enruta camiones de agua mexicanos hacia las zonas con mayor estrés hídrico. Combina datos climáticos satelitales con una variación ponderada y consciente de la seguridad del algoritmo de Dijkstra.",
      "Un proyecto de equipo de un semestre para TC2005B: un deckbuilder roguelike hecho desde cero, motor incluido (sin framework). Un cliente en HTML5 Canvas sobre una API REST en Express de 28 endpoints, respaldada por un esquema MySQL de 745 líneas: 12 tablas, 20 procedimientos almacenados, 13 vistas analíticas (tablas de líderes, tasas de victoria por enemigo y dificultad, popularidad de cartas) y 7 triggers que mantienen sincronizadas las estadísticas del jugador y el historial de partidas. El estado a mitad de duelo se guarda como JSON para reanudar la partida justo donde quedó, con borrados en cascada y 35 índices.",
      "Un Breakout en el navegador hecho desde cero sobre un motor HTML5 Canvas propio (sin framework): una jerarquía POO de Ball, Paddle y Brick sobre una base GameObject común y una pequeña librería Vector, movida por un bucle con delta-time para una física independiente de los FPS. El giro: inclinar la paleta 30 grados la rota con la transformación del canvas y redirige el vector de rebote de la bola hacia las esquinas. Tres niveles temáticos (disco, hip hop, rock), cada uno con sus propios sprites y música.",
      "Un lexer DFA hecho a mano (tabla de transiciones explícita, sin regex) extendido a un resaltador de sintaxis paralelo, con un speedup medido de unas 6x frente a una versión secuencial: 60 archivos de Python, 8 MB, en 16 núcleos.",
      "Este sitio. React 19, Tailwind 4 y una compilación de exportación estática, con una interfaz oscura tipo cristal sobre un fondo shader WebGL animado, un globo interactivo en three.js, una órbita radial de trayectoria y vistas previas de enlaces en vivo.",
    ],
    experiences: [
      {
        role: "Profesor de inglés",
        detail:
          "Enseñanza de inglés inmersiva y basada en el juego para 165 niños (de 4 a 12 años) en un campamento de verano multicultural, usando inglés, español y portugués para apoyar la gestión del aula y el entendimiento intercultural.",
      },
      {
        role: "Instructor de Python",
        detail:
          "Diseñé e impartí un currículo de Python para estudiantes de secundaria: variables, bucles, condicionales, funciones y resolución de problemas con Replit y Turtle, además de evaluaciones y retroalimentación.",
      },
      {
        role: "Voluntario y mentor par",
        detail:
          "Egresado del Programa de Mentoría entre Pares. Acompañé a nuevos estudiantes en su primer año, en lo académico y en lo social.",
      },
      {
        role: "Asistente de logística de medios",
        detail:
          "Optimicé rutas de distribución de prensa de última milla para NRC, De Telegraaf, AD y otros, bajo estrictas restricciones de tiempo diarias.",
      },
    ],
    timelineNodes: [
      {
        title: "IBDP, Róterdam (NL)",
        content:
          "Diploma del Bachillerato Internacional en la Rotterdam International Secondary School, con 33/45 y un premio a la Excelencia en Inglés.",
        category: "Educación",
      },
      {
        title: "Políglota: PT / ES / EN / NL",
        content:
          "Portugués y español nativos, inglés C1, neerlandés A1.",
        category: "Habilidades",
      },
      {
        title: "Tec de Monterrey, ITC",
        content:
          "Licenciatura en Ingeniería en Tecnologías Computacionales en el Campus Santa Fe, Ciudad de México. Promedio 93,5/100. Cursos de estructuras de datos, bases de datos, sistemas embebidos e IoT, interconexión de dispositivos e ingeniería de software.",
        category: "Educación",
      },
      {
        title: "Docencia y mentoría entre pares",
        content:
          "Instructor de Python para estudiantes de secundaria, profesor de inglés en los Países Bajos y mentor par egresado en el Tec, acompañando a nuevos estudiantes en su primer año.",
        category: "Experiencia",
      },
      {
        title: "IoT e ingeniería de sistemas",
        content:
          "Un prototipo de estacionamiento inteligente con ESP32 y telemetría por MQTT, un lexer basado en DFA paralelizado con multiprocessing de Python y estructuras de datos en C++.",
        category: "Proyectos",
      },
      {
        title: "START Hack: Aquaroute",
        content:
          "Primer hackathon. Construí Aquaroute en 36 horas: un SaaS que enruta camiones de agua hacia las zonas con mayor estrés hídrico usando datos climáticos satelitales y una variación ponderada del algoritmo de Dijkstra.",
        category: "Proyectos",
      },
      {
        title: "Objetivo: CCNA y ciberseguridad",
        content:
          "En camino hacia la certificación Cisco CCNA y unas prácticas en ciberseguridad o ingeniería de redes, con foco en roles de infraestructura remotos y globales.",
        category: "Carrera",
      },
    ],
    certNames: [
      "Universitas 21 Global Citizenship",
      "Diploma del IB, 33/45",
      "Excellence in English Award",
    ],
    metrics: [
      { label: "Promedio universitario", detail: "sobre 100, Tec de Monterrey" },
      { label: "Diploma del IB", detail: "Excelencia en Inglés" },
      {
        label: "Graduación prevista",
        detail: "Lic. en Tecnologías Computacionales (ITC)",
      },
      { label: "Idiomas", detail: "dos nativos, inglés C1" },
    ],
    skillTitles: ["Lenguajes", "Sistemas y redes", "Herramientas y web"],
    coursework: [
      "Estructuras de datos",
      "POO (C++)",
      "Interconexión de dispositivos (IoT)",
      "Sistemas embebidos e IoT",
      "Bases de datos",
      "Ingeniería de software",
      "Desarrollo web",
      "IA avanzada para ciencia de datos",
      "Analítica de datos y herramientas de IA",
      "Pensamiento computacional",
      "Ecuaciones diferenciales",
    ],
    leadership: [
      { pre: "Vicepresidente, ", post: ", la sociedad de alumnos de ITC (Campus Santa Fe) · 5º semestre" },
      { pre: "Exvicepresidente, ", post: " (Campus Santa Fe) · 4º semestre" },
      { pre: "", post: " (CSF)" },
      { pre: "", post: " Miembro del capítulo (CSF)" },
      { pre: "", post: ", Tec de Monterrey · desde el 2º semestre" },
      { pre: "Responsable de beneficencia, ", post: " (Buy a Tulip, Help a Girl · apoyo a la Cruz Roja)" },
    ],
    whereFrom: [
      {
        title: "Raíces brasileñas",
        body: "Hablante nativo de portugués y español, criado en un hogar brasileño y portugués.",
      },
      {
        title: "Diploma del IB, Países Bajos",
        body: "Completé el Bachillerato Internacional (33/45) en la Rotterdam International Secondary School con un premio a la Excelencia en Inglés.",
      },
      {
        title: "CC, Ciudad de México",
        body: "Estudio Ingeniería en Tecnologías Computacionales en el Tec de Monterrey, Campus Santa Fe, en la zona de Santa Fe de la Ciudad de México.",
      },
    ],
    languageBadges: [
      "Portugués, nativo",
      "Español, nativo",
      "Inglés, C1",
      "Neerlandés, A1",
    ],
  },

  pt: {
    hero: {
      prefix: "Santiago é um",
      roles: [
        "Estudante de ITC",
        "Desenvolvedor full-stack",
        "Estudante de CCNA",
        "Desenvolvedor de sistemas e IoT",
        "Poliglota",
      ],
      openToWork: "Disponível para trabalhar",
      cv: "Baixar CV (PDF)",
      cardRole: "Estudante multicultural de CC (ITC) no Tec de Monterrey, Santa Fe",
    },
    ui: {
      viewOnGithub: "Ver no GitHub",
      viewOnLinkedin: "Ver no LinkedIn",
      playInBrowser: "Jogar no navegador",
      visitSite: "Ver site",
      benchSequential: "Sequencial",
      benchParallel: "Paralelo",
      benchFaster: "mais rápido",
      viewCredential: "Ver credencial",
    },
    statLabels: {
      endpoints: "endpoints REST",
      schemaLoc: "linhas de schema",
      procedures: "procedimentos",
      frameworks: "frameworks",
      levels: "níveis temáticos",
      servicePages: "páginas de serviços",
      clientSite: "site do cliente",
      buildTime: "de construção",
      languages: "idiomas",
    },
    sections: {
      projects: {
        eyebrow: "Projetos",
        title: "Algumas coisas que construí",
        intro:
          "Firmware IoT no ESP32, aplicações web full-stack, jogos no navegador e computação paralela em Python.",
      },
      skills: {
        eyebrow: "Habilidades",
        title: "Kit técnico",
        intro:
          "As linguagens, os sistemas e as ferramentas com que trabalho.",
      },
      github: {
        eyebrow: "No GitHub",
        title: "O que tenho construído",
        intro:
          "Meu histórico público de commits. Passe o cursor sobre o link para pré-visualizar o perfil.",
      },
      experience: {
        eyebrow: "Experiência",
        title: "Onde trabalhei",
        intro:
          "Aulas de inglês nos Países Baixos, Python no ensino fundamental no México e mentoria a estudantes de primeiro ano no Tec.",
      },
      academics: { eyebrow: "Acadêmico", title: "Como vou no Tec" },
      certifications: {
        eyebrow: "Certificações",
        title: "Certificações e prêmios",
      },
      whereFrom: {
        eyebrow: "De onde venho",
        title: "Três países, quatro idiomas",
        intro:
          "Cresci em uma casa brasileira e portuguesa, fiz o Diploma do IB nos Países Baixos e agora estudo Ciência da Computação na Cidade do México. Tenho nacionalidade mexicana, brasileira e portuguesa (UE), então posso trabalhar na UE, no México e no Brasil sem patrocínio.",
      },
    },
    leadershipTitle: "Liderança e comunidade",
    courseworkTitle: "Disciplinas relevantes",
    timeline: {
      eyebrow: "Meu caminho até agora",
      title: "Do Diploma do IB ao caminho do CCNA",
      hint: "Clique em um nó para ver mais",
    },
    globeCaption: "São Paulo · Roterdã · Cidade do México",
    footer: {
      location:
        "Grande Cidade do México · Disponível para estágios, remoto e vagas globais",
      citizenship:
        "Cidadão mexicano, brasileiro e português (UE) · apto a trabalhar na UE, no México e no Brasil sem patrocínio",
      builtWith: "Feito com Next.js 16, React 19 e Tailwind CSS 4.",
    },
    projectDescriptions: [
      "Um protótipo IoT completo com detecção de ocupação, controle automático de cancela e telemetria na nuvem. Firmware embarcado no ESP32 conversando com serviços de nuvem por MQTT.",
      "Um site freelance que desenhei e entreguei para a DT Construct ICS, uma empresa mexicana de construção. Programado à mão em HTML, CSS e JavaScript: um catálogo de serviços de seis páginas (varejo, industrial, infraestrutura, instalações especiais e manutenção), mapas interativos com Leaflet e uma galeria com as obras concluídas da empresa. No ar com domínio próprio.",
      "Um protótipo de hackathon que roteia caminhões-pipa mexicanos para as áreas com maior estresse hídrico. Combina dados climáticos de satélite com uma variação ponderada e atenta à segurança do algoritmo de Dijkstra.",
      "Um projeto de equipe de um semestre para a matéria TC2005B: um deckbuilder roguelike feito do zero, motor incluído (sem framework). Um cliente em HTML5 Canvas sobre uma API REST em Express de 28 endpoints, apoiada por um esquema MySQL de 745 linhas: 12 tabelas, 20 procedimentos armazenados, 13 views analíticas (rankings, taxas de vitória por inimigo e dificuldade, popularidade de cartas) e 7 triggers que mantêm sincronizadas as estatísticas do jogador e o histórico de partidas. O estado no meio do duelo é salvo como JSON para retomar a partida exatamente de onde parou, com deleções em cascata e 35 índices.",
      "Um Breakout no navegador feito do zero sobre um motor HTML5 Canvas próprio (sem framework): uma hierarquia POO de Ball, Paddle e Brick sobre uma base GameObject comum e uma pequena biblioteca Vector, movida por um loop com delta-time para uma física independente dos FPS. O diferencial: inclinar a raquete 30 graus a rotaciona pela transformação do canvas e redireciona o vetor de rebote da bola para os cantos. Três níveis temáticos (disco, hip hop, rock), cada um com seus próprios sprites e música.",
      "Um lexer DFA feito à mão (tabela de transições explícita, sem regex) estendido para um realçador de sintaxe paralelo, com speedup medido de cerca de 6x sobre uma versão sequencial: 60 arquivos de Python, 8 MB, em 16 núcleos.",
      "Este site. React 19, Tailwind 4 e um build de exportação estática, com uma interface escura estilo vidro sobre um fundo shader WebGL animado, um globo interativo em three.js, uma órbita radial de trajetória e pré-visualizações de links ao vivo.",
    ],
    experiences: [
      {
        role: "Professor de inglês",
        detail:
          "Ensino de inglês imersivo e baseado em brincadeiras para 165 crianças (de 4 a 12 anos) em um acampamento de verão multicultural, usando inglês, espanhol e português para apoiar a gestão da turma e o entendimento intercultural.",
      },
      {
        role: "Instrutor de Python",
        detail:
          "Projetei e lecionei um currículo de Python para alunos do ensino fundamental: variáveis, laços, condicionais, funções e resolução de problemas com Replit e Turtle, além de avaliações e feedback.",
      },
      {
        role: "Voluntário e mentor par",
        detail:
          "Formado pelo Programa de Mentoria entre Pares. Acompanhei novos estudantes no primeiro ano, no acadêmico e no social.",
      },
      {
        role: "Assistente de logística de mídia",
        detail:
          "Otimizei rotas de distribuição de jornais de última milha para NRC, De Telegraaf, AD e outros, sob rígidas restrições diárias de tempo.",
      },
    ],
    timelineNodes: [
      {
        title: "IBDP, Roterdã (NL)",
        content:
          "Diploma do Bacharelado Internacional na Rotterdam International Secondary School, com 33/45 e um prêmio de Excelência em Inglês.",
        category: "Educação",
      },
      {
        title: "Poliglota: PT / ES / EN / NL",
        content:
          "Português e espanhol nativos, inglês C1, neerlandês A1.",
        category: "Habilidades",
      },
      {
        title: "Tec de Monterrey, ITC",
        content:
          "Bacharelado em Ciência e Tecnologia da Computação no Campus Santa Fe, Cidade do México. Média 93,5/100. Disciplinas de estruturas de dados, bancos de dados, sistemas embarcados e IoT, interconexão de dispositivos e engenharia de software.",
        category: "Educação",
      },
      {
        title: "Docência e mentoria entre pares",
        content:
          "Instrutor de Python para alunos do ensino fundamental, professor de inglês nos Países Baixos e mentor par formado no Tec, acompanhando novos estudantes no primeiro ano.",
        category: "Experiência",
      },
      {
        title: "IoT e engenharia de sistemas",
        content:
          "Um protótipo de estacionamento inteligente com ESP32 e telemetria por MQTT, um lexer baseado em DFA paralelizado com multiprocessing de Python e estruturas de dados em C++.",
        category: "Projetos",
      },
      {
        title: "START Hack: Aquaroute",
        content:
          "Primeiro hackathon. Construí o Aquaroute em 36 horas: um SaaS que roteia caminhões-pipa para as áreas com maior estresse hídrico usando dados climáticos de satélite e uma variação ponderada do algoritmo de Dijkstra.",
        category: "Projetos",
      },
      {
        title: "Objetivo: CCNA e cibersegurança",
        content:
          "A caminho da certificação Cisco CCNA e de um estágio em cibersegurança ou engenharia de redes, com foco em vagas de infraestrutura remotas e globais.",
        category: "Carreira",
      },
    ],
    certNames: [
      "Universitas 21 Global Citizenship",
      "Diploma do IB, 33/45",
      "Excellence in English Award",
    ],
    metrics: [
      { label: "Média universitária", detail: "de 100, Tec de Monterrey" },
      { label: "Diploma do IB", detail: "Excelência em Inglês" },
      {
        label: "Formatura prevista",
        detail: "Bacharelado em Ciência da Computação (ITC)",
      },
      { label: "Idiomas", detail: "dois nativos, inglês C1" },
    ],
    skillTitles: ["Linguagens", "Sistemas e redes", "Ferramentas e web"],
    coursework: [
      "Estruturas de dados",
      "POO (C++)",
      "Interconexão de dispositivos (IoT)",
      "Sistemas embarcados e IoT",
      "Bancos de dados",
      "Engenharia de software",
      "Desenvolvimento web",
      "IA avançada para ciência de dados",
      "Análise de dados e ferramentas de IA",
      "Pensamento computacional",
      "Equações diferenciais",
    ],
    leadership: [
      { pre: "Vice-presidente, ", post: ", a sociedade de alunos de ITC (Campus Santa Fe) · 5º semestre" },
      { pre: "Ex-vice-presidente, ", post: " (Campus Santa Fe) · 4º semestre" },
      { pre: "", post: " (CSF)" },
      { pre: "", post: " Membro do capítulo (CSF)" },
      { pre: "", post: ", Tec de Monterrey · desde o 2º semestre" },
      { pre: "Responsável por caridade, ", post: " (Buy a Tulip, Help a Girl · apoio à Cruz Vermelha)" },
    ],
    whereFrom: [
      {
        title: "Raízes brasileiras",
        body: "Falante nativo de português e espanhol, criado em uma casa brasileira e portuguesa.",
      },
      {
        title: "Diploma do IB, Países Baixos",
        body: "Concluí o Bacharelado Internacional (33/45) na Rotterdam International Secondary School com um prêmio de Excelência em Inglês.",
      },
      {
        title: "CC, Cidade do México",
        body: "Estudo Ciência e Tecnologia da Computação no Tec de Monterrey, Campus Santa Fe, no distrito de Santa Fe da Cidade do México.",
      },
    ],
    languageBadges: [
      "Português, nativo",
      "Espanhol, nativo",
      "Inglês, C1",
      "Neerlandês, A1",
    ],
  },

  nl: {
    hero: {
      prefix: "Santiago is een",
      roles: [
        "Informaticastudent",
        "Full-stack developer",
        "CCNA-student",
        "Systeem- en IoT-ontwikkelaar",
        "Polyglot",
      ],
      openToWork: "Open voor werk",
      cv: "CV downloaden (PDF)",
      cardRole: "Multiculturele informaticastudent (ITC) aan Tec de Monterrey, Santa Fe",
    },
    ui: {
      viewOnGithub: "Bekijk op GitHub",
      viewOnLinkedin: "Bekijk op LinkedIn",
      playInBrowser: "Speel in browser",
      visitSite: "Bekijk site",
      benchSequential: "Sequentieel",
      benchParallel: "Parallel",
      benchFaster: "sneller",
      viewCredential: "Bekijk credential",
    },
    statLabels: {
      endpoints: "REST-endpoints",
      schemaLoc: "schema-regels",
      procedures: "stored procedures",
      frameworks: "frameworks",
      levels: "thematische levels",
      servicePages: "servicepagina's",
      clientSite: "clientsite",
      buildTime: "bouwtijd",
      languages: "talen",
    },
    sections: {
      projects: {
        eyebrow: "Projecten",
        title: "Een paar dingen die ik heb gebouwd",
        intro:
          "IoT-firmware op de ESP32, full-stack webapps, browsergames en parallelle verwerking in Python.",
      },
      skills: {
        eyebrow: "Vaardigheden",
        title: "Technische toolkit",
        intro:
          "De talen, systemen en tools waarmee ik werk.",
      },
      github: {
        eyebrow: "Op GitHub",
        title: "Wat ik heb gebouwd",
        intro:
          "Mijn publieke commit-geschiedenis. Beweeg over de link voor een voorbeeld van het profiel.",
      },
      experience: {
        eyebrow: "Ervaring",
        title: "Waar ik heb gewerkt",
        intro:
          "Engelse les in Nederland, Python op een Mexicaanse middelbare school en begeleiding van eerstejaars studenten aan Tec.",
      },
      academics: { eyebrow: "Studie", title: "Hoe het gaat aan Tec" },
      certifications: {
        eyebrow: "Certificeringen",
        title: "Certificeringen en prijzen",
      },
      whereFrom: {
        eyebrow: "Waar ik vandaan kom",
        title: "Drie landen, vier talen",
        intro:
          "Ik groeide op in een Braziliaans-Portugees gezin, behaalde het IB-diploma in Nederland en studeer nu informatica in Mexico-Stad. Ik heb de Mexicaanse, Braziliaanse en Portugese (EU) nationaliteit, dus ik kan zonder sponsoring in de EU, Mexico en Brazilië werken.",
      },
    },
    leadershipTitle: "Leiderschap en gemeenschap",
    courseworkTitle: "Relevante vakken",
    timeline: {
      eyebrow: "Mijn pad tot nu toe",
      title: "Van het IB-diploma naar het CCNA-traject",
      hint: "Klik op een knooppunt voor meer",
    },
    globeCaption: "São Paulo · Rotterdam · Mexico-Stad",
    footer: {
      location:
        "Grootstedelijk Mexico-Stad · Open voor stages, remote en wereldwijde functies",
      citizenship:
        "Mexicaans, Braziliaans en Portugees (EU) staatsburger · gerechtigd om te werken in de EU, Mexico en Brazilië zonder sponsoring",
      builtWith: "Gemaakt met Next.js 16, React 19 en Tailwind CSS 4.",
    },
    projectDescriptions: [
      "Een volledig IoT-prototype met bezettingsdetectie, automatische slagboombesturing en cloudtelemetrie. Embedded firmware op de ESP32 die via MQTT met clouddiensten communiceert.",
      "Een freelance website die ik ontwierp en opleverde voor DT Construct ICS, een Mexicaans bouwbedrijf. Met de hand gecodeerd in HTML, CSS en JavaScript: een servicecatalogus van zes pagina's (retail, industrieel, infrastructuur, speciale installaties en onderhoud), interactieve Leaflet-kaarten en een projectgalerij met het opgeleverde werk van het bedrijf. Live op een eigen domein.",
      "Een hackathon-prototype dat Mexicaanse watertrucks naar de gebieden met de grootste waterschaarste stuurt. Combineert satellietklimaatdata met een gewogen, veiligheidsbewuste variant van Dijkstra's algoritme.",
      "Een teamproject van een semester voor het vak TC2005B: een roguelike deckbuilder volledig zelf gebouwd, engine inbegrepen (geen framework). Een HTML5 Canvas-client op een Express REST-API van 28 endpoints, met een MySQL-schema van 745 regels: 12 tabellen, 20 stored procedures, 13 analytische views (ranglijsten, winstpercentages per vijand en moeilijkheidsgraad, kaartpopulariteit) en 7 triggers die spelerstatistieken en speelgeschiedenis synchroon houden. De staat midden in een duel wordt als JSON opgeslagen zodat een run precies hervat waar hij stopte, met cascade-deletes en 35 indexen.",
      "Een browser-Breakout volledig zelf gebouwd op een eigen HTML5 Canvas-engine (geen framework): een OOP-hiërarchie van Ball, Paddle en Brick op een gedeelde GameObject-basis en een kleine Vector-library, aangedreven door een delta-time loop voor framerate-onafhankelijke fysica. De twist: de paddle 30 graden kantelen draait hem via de canvas-transform en stuurt de stuitervector van de bal naar de hoeken. Drie thematische levels (disco, hiphop, rock), elk met eigen sprites en muziek.",
      "Een handgebouwde DFA-lexer (expliciete overgangstabel, geen regex) uitgebreid tot een parallelle syntax-highlighter, gemeten op ongeveer 6x sneller dan een sequentiële basis: 60 Python-bestanden, 8 MB, op 16 cores.",
      "Deze site. React 19, Tailwind 4 en een statische export-build, met een glasachtige donkere UI over een geanimeerde WebGL-shaderachtergrond, een interactieve three.js-globe, een radiale loopbaanbaan en live linkvoorbeelden.",
    ],
    experiences: [
      {
        role: "Docent Engels",
        detail:
          "Meeslepend, spelgebaseerd Engels onderwijs voor 165 kinderen (4 tot 12 jaar) in een multiculturele zomerkampsetting, met Engels, Spaans en Portugees ter ondersteuning van klassenmanagement en intercultureel begrip.",
      },
      {
        role: "Python-instructeur",
        detail:
          "Een Python-curriculum ontworpen en gegeven voor middelbare scholieren: variabelen, loops, condities, functies en probleemoplossing met Replit en Turtle, plus toetsing en feedback.",
      },
      {
        role: "Vrijwilliger en peer-mentor",
        detail:
          "Afgestudeerd aan het Peer Mentorship-programma. Begeleidde nieuwe studenten door hun eerste jaar, zowel academisch als sociaal.",
      },
      {
        role: "Assistent media-logistiek",
        detail:
          "Optimaliseerde last-mile bezorgroutes voor NRC, De Telegraaf, AD en anderen onder strikte dagelijkse tijdsdruk.",
      },
    ],
    timelineNodes: [
      {
        title: "IBDP, Rotterdam (NL)",
        content:
          "International Baccalaureate-diploma aan de Rotterdam International Secondary School, met 33/45 en een Excellence in English-prijs.",
        category: "Onderwijs",
      },
      {
        title: "Polyglot: PT / ES / EN / NL",
        content:
          "Portugees en Spaans als moedertaal, Engels C1, Nederlands A1.",
        category: "Vaardigheden",
      },
      {
        title: "Tec de Monterrey, ITC",
        content:
          "Bachelor in Computer Science and Technology aan Campus Santa Fe, Mexico-Stad. GPA 93,5/100. Vakken in datastructuren, databases, embedded systems en IoT, apparaatinterconnectie en software engineering.",
        category: "Onderwijs",
      },
      {
        title: "Lesgeven en peer-mentoring",
        content:
          "Python-instructeur voor middelbare scholieren, docent Engels in Nederland en afgestudeerd peer-mentor aan Tec die nieuwe studenten door hun eerste jaar begeleidt.",
        category: "Ervaring",
      },
      {
        title: "IoT en systeemengineering",
        content:
          "Een ESP32 smart-parking-prototype met MQTT-telemetrie, een DFA-gebaseerde lexer geparallelliseerd met Python-multiprocessing en datastructuren in C++.",
        category: "Projecten",
      },
      {
        title: "START Hack: Aquaroute",
        content:
          "Eerste hackathon. Aquaroute in 36 uur gebouwd: een SaaS die watertrucks naar de gebieden met de grootste waterschaarste stuurt met satellietklimaatdata en een gewogen variant van Dijkstra's algoritme.",
        category: "Projecten",
      },
      {
        title: "Doel: CCNA en cybersecurity",
        content:
          "Op weg naar de Cisco CCNA-certificering en een stage in cybersecurity of netwerkengineering, met focus op remote, wereldwijde infrastructuurfuncties.",
        category: "Carrière",
      },
    ],
    certNames: [
      "Universitas 21 Global Citizenship",
      "IB-diploma, 33/45",
      "Excellence in English Award",
    ],
    metrics: [
      { label: "Universitair GPA", detail: "van de 100, Tec de Monterrey" },
      { label: "IB-diploma", detail: "Excellence in English" },
      {
        label: "Verwachte afstuderen",
        detail: "Bachelor Informatica (ITC)",
      },
      { label: "Talen", detail: "twee moedertalen, Engels C1" },
    ],
    skillTitles: ["Programmeertalen", "Systemen en netwerken", "Tools en web"],
    coursework: [
      "Datastructuren",
      "OOP (C++)",
      "Apparaatinterconnectie (IoT)",
      "Embedded systems en IoT",
      "Databases",
      "Software engineering",
      "Webontwikkeling",
      "Geavanceerde AI voor data science",
      "Data-analyse en AI-tools",
      "Computational thinking",
      "Differentiaalvergelijkingen",
    ],
    leadership: [
      { pre: "Vicevoorzitter, ", post: ", de ITC-studentenvereniging (Campus Santa Fe) · 5e semester" },
      { pre: "Voormalig vicevoorzitter, ", post: " (Campus Santa Fe) · 4e semester" },
      { pre: "", post: " (CSF)" },
      { pre: "", post: " Afdelingslid (CSF)" },
      { pre: "", post: ", Tec de Monterrey · sinds het 2e semester" },
      { pre: "Hoofd liefdadigheid, ", post: " (Buy a Tulip, Help a Girl · steun aan het Rode Kruis)" },
    ],
    whereFrom: [
      {
        title: "Braziliaanse wortels",
        body: "Portugees en Spaans als moedertaal, opgegroeid in een Braziliaans-Portugees gezin.",
      },
      {
        title: "IB-diploma, Nederland",
        body: "Behaalde het International Baccalaureate (33/45) aan de Rotterdam International Secondary School met een Excellence in English-prijs.",
      },
      {
        title: "Informatica, Mexico-Stad",
        body: "Studeer Computer Science and Technology aan Tec de Monterrey, Campus Santa Fe, in de wijk Santa Fe van Mexico-Stad.",
      },
    ],
    languageBadges: [
      "Portugees, moedertaal",
      "Spaans, moedertaal",
      "Engels, C1",
      "Nederlands, A1",
    ],
  },
};
