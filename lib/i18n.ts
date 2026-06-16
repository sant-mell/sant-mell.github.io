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
        "CCNA candidate",
        "Systems & IoT developer",
        "Polyglot",
        "Global citizen",
        "Problem solver",
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
      engineLoc: "engine LOC",
      servicePages: "service pages",
      clientSite: "client site",
      buildTime: "to build",
      hackathon: "hackathon",
      languages: "languages",
      trackers: "trackers",
    },
    sections: {
      projects: {
        eyebrow: "Projects",
        title: "A few things I have built",
        intro:
          "From embedded IoT hardware up to full-stack systems and modern web architecture.",
      },
      skills: {
        eyebrow: "Skills",
        title: "Technical toolkit",
        intro:
          "Languages, systems, and the engineering foundation behind my embedded, full-stack, and parallel-computing work.",
      },
      github: {
        eyebrow: "On GitHub",
        title: "What I have been building",
        intro: "My public commit history. Hover the link to preview the profile.",
      },
      experience: {
        eyebrow: "Experience",
        title: "Where I have worked",
        intro:
          "Teaching, mentoring, and getting things done across cultures and time zones. The soft skills that round out the technical ones.",
      },
      academics: { eyebrow: "Academics", title: "How I am doing at Tec" },
      certifications: {
        eyebrow: "Certifications",
        title: "Certifications & awards",
      },
      whereFrom: {
        eyebrow: "Where I'm from",
        title: "Three countries, four languages",
        intro:
          "That path runs across the globe. I grew up in a Brazilian-Portuguese household, did the IB Diploma in the Netherlands, and now study Computer Science in Mexico City. I hold Mexican, Brazilian, and Portuguese (EU) citizenship, so I can work across the EU, Mexico, and Brazil without sponsorship. Working across cultures and time zones is just how I have always lived, and it is where my soft skills in communication and adaptability come from.",
      },
    },
    leadershipTitle: "Leadership & Community",
    courseworkTitle: "Relevant Coursework",
    timeline: {
      eyebrow: "My path so far",
      title: "From the IB Diploma to the CCNA track",
      hint: "Click a node to see more",
    },
    globeCaption: "Sao Paulo · Rotterdam · Mexico City",
    footer: {
      location:
        "Greater Mexico City · Open to internships, remote, and global roles",
      citizenship:
        "Mexican, Brazilian, and Portuguese (EU) citizen · eligible to work in the EU, Mexico, and Brazil with no sponsorship",
      builtWith: "Built with Next.js 16, React 19 and Tailwind CSS 4.",
    },
    projectDescriptions: [
      "A full IoT prototype with occupancy detection, automated barrier control, and cloud telemetry. Embedded firmware on ESP32 talking to cloud services over MQTT.",
      "A freelance website I designed and shipped for DT Construct ICS, a Mexican construction company. Hand-coded in vanilla HTML, CSS, and JavaScript: a six-page services catalog (retail, industrial, infrastructure, special installations, and maintenance), interactive Leaflet maps, and a portfolio of completed work for clients such as Almacenes Garcia, Avante Textil, Hotel Resort Secrets, and TOUS. Live on a custom domain.",
      "A hackathon prototype that routes Mexican water trucks to the most water-stressed areas. Combines satellite climate data with a weighted, safety-aware variation of Dijkstra's algorithm, backed by a validated business model.",
      "An 8-credit flagship team project: a roguelike deckbuilder built from scratch, engine included (no framework). An HTML5 Canvas client over an Express REST API of 28 endpoints, backed by a 745-line MySQL schema: 12 tables, 20 stored procedures, 13 analytics views (leaderboards, enemy and difficulty win rates, card popularity), and 7 triggers that keep player stats and run history in sync. Mid-duel state is checkpointed as JSON so a run resumes exactly where it left off, with cascade deletes and 35 indexes.",
      "A browser Breakout built from scratch on a custom HTML5 Canvas engine (no framework): an OOP hierarchy of Ball, Paddle, and Brick over a shared GameObject base and a small Vector library, driven by a delta-time loop for frame-rate-independent physics. The twist: tilting the paddle 30 degrees rotates it through the canvas transform and redirects the ball's bounce vector to aim into corners. Three themed levels (disco, hip hop, rock), each with its own sprites and music.",
      "A hand-built DFA lexer (explicit transition table, no regex) extended into a parallel syntax highlighter, benchmarked at about 6x speedup over a sequential baseline on 16 cores. The low-level parsing logic behind secure code and deep packet inspection.",
      "This site. React 19, Tailwind 4, and a static export build, with a glassy dark UI over an animated WebGL shader background, an interactive three.js globe, a radial career orbit, and live link previews.",
    ],
    experiences: [
      {
        role: "English Language Teacher",
        detail:
          "Immersive, play-based English instruction for around 165 children (ages 4 to 12) in a multicultural summer-camp setting, using four languages to support classroom management and cross-cultural understanding.",
      },
      {
        role: "Computer Science Instructor",
        detail:
          "Designed and taught a Python curriculum for middle-school students: variables, loops, conditionals, functions, and problem solving with Replit and Turtle, plus assessments and feedback.",
      },
      {
        role: "Volunteer & Peer Mentor",
        detail:
          "Graduate of the Peer Mentorship Program. Guides new students through the academic and social adaptation to university life.",
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
          "International Baccalaureate Diploma at Rotterdam International Secondary School, scoring 33/45 with an Excellence in English award. Cross-cultural readiness for global, distributed teams.",
        category: "Education",
      },
      {
        title: "Polyglot: PT / ES / EN / NL",
        content:
          "Native Portuguese and Spanish, English C2, Dutch A1. A core soft skill and a real asset for distributed teams that span multiple time zones and languages.",
        category: "Skills",
      },
      {
        title: "Tec de Monterrey, ITC",
        content:
          "B.S. in Computer Science and Technology at Campus Santa Fe, Mexico City. GPA 92.8/100. Coursework spanning data structures, databases, embedded systems and IoT, device interconnection, and software engineering.",
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
          "An ESP32 IoT smart-parking prototype, a DFA-based lexer with parallel processing, and data structures in C++. Hands-on work at the hardware and machine layer.",
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
      { label: "Languages", detail: "two native, English C2" },
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
      { pre: "Vice President, ", post: " (Campus Santa Fe)" },
      { pre: "", post: " (CSF)" },
      { pre: "", post: " Chapter member (CSF)" },
      { pre: "", post: ", Tec de Monterrey" },
      { pre: "Head of Charity, ", post: " (Buy a Tulip Help a Girl, Red Cross relief)" },
    ],
    whereFrom: [
      {
        title: "Brazilian Roots",
        body: "Native Portuguese and Spanish speaker with a multicultural foundation and an early international mindset.",
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
      "English, C2",
      "Dutch, A1",
    ],
  },

  es: {
    hero: {
      prefix: "Santiago es un",
      roles: [
        "Estudiante de CC",
        "Desarrollador full-stack",
        "Candidato al CCNA",
        "Desarrollador de sistemas e IoT",
        "Políglota",
        "Ciudadano global",
        "Solucionador de problemas",
      ],
      openToWork: "Disponible para trabajar",
      cv: "Descargar CV (PDF)",
      cardRole: "Estudiante multicultural de CC (ITC) en el Tec de Monterrey, Santa Fe",
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
      engineLoc: "líneas de motor",
      servicePages: "páginas de servicios",
      clientSite: "sitio del cliente",
      buildTime: "de desarrollo",
      hackathon: "hackathon",
      languages: "idiomas",
      trackers: "rastreadores",
    },
    sections: {
      projects: {
        eyebrow: "Proyectos",
        title: "Algunas cosas que he construido",
        intro:
          "Desde hardware IoT embebido hasta sistemas full-stack y arquitectura web moderna.",
      },
      skills: {
        eyebrow: "Habilidades",
        title: "Kit técnico",
        intro:
          "Lenguajes, sistemas y la base de ingeniería detrás de mi trabajo en sistemas embebidos, full-stack y cómputo paralelo.",
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
          "Enseñar, mentorear y sacar las cosas adelante entre culturas y zonas horarias. Las habilidades blandas que complementan a las técnicas.",
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
          "Ese camino recorre el mundo. Crecí en un hogar brasileño y portugués, hice el Diploma del IB en los Países Bajos y ahora estudio Ciencias de la Computación en la Ciudad de México. Tengo nacionalidad mexicana, brasileña y portuguesa (UE), así que puedo trabajar en la UE, México y Brasil sin patrocinio. Moverme entre culturas y zonas horarias es como siempre he vivido, y de ahí vienen mis habilidades de comunicación y adaptación.",
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
      "Un sitio web freelance que diseñé y entregué para DT Construct ICS, una empresa mexicana de construcción. Programado a mano en HTML, CSS y JavaScript: un catálogo de servicios de seis páginas (retail, industrial, infraestructura, instalaciones especiales y mantenimiento), mapas interactivos con Leaflet y un portafolio de obras realizadas para clientes como Almacenes Garcia, Avante Textil, Hotel Resort Secrets y TOUS. En línea con dominio propio.",
      "Un prototipo de hackathon que enruta camiones de agua mexicanos hacia las zonas con mayor estrés hídrico. Combina datos climáticos satelitales con una variación ponderada y consciente de la seguridad del algoritmo de Dijkstra, respaldado por un modelo de negocio validado.",
      "Un proyecto estrella de equipo de 8 créditos: un deckbuilder roguelike hecho desde cero, motor incluido (sin framework). Un cliente en HTML5 Canvas sobre una API REST en Express de 28 endpoints, respaldada por un esquema MySQL de 745 líneas: 12 tablas, 20 procedimientos almacenados, 13 vistas analíticas (tablas de líderes, tasas de victoria por enemigo y dificultad, popularidad de cartas) y 7 triggers que mantienen sincronizadas las estadísticas del jugador y el historial de partidas. El estado a mitad de duelo se guarda como JSON para reanudar la partida justo donde quedó, con borrados en cascada y 35 índices.",
      "Un Breakout en el navegador hecho desde cero sobre un motor HTML5 Canvas propio (sin framework): una jerarquía POO de Ball, Paddle y Brick sobre una base GameObject común y una pequeña librería Vector, movida por un bucle con delta-time para una física independiente de los FPS. El giro: inclinar la paleta 30 grados la rota con la transformación del canvas y redirige el vector de rebote de la bola hacia las esquinas. Tres niveles temáticos (disco, hip hop, rock), cada uno con sus propios sprites y música.",
      "Un lexer DFA hecho a mano (tabla de transiciones explícita, sin regex) extendido a un resaltador de sintaxis paralelo, con un speedup medido de unas 6x frente a una versión secuencial en 16 núcleos. La lógica de parsing de bajo nivel detrás del código seguro y la inspección profunda de paquetes.",
      "Este sitio. React 19, Tailwind 4 y una compilación de exportación estática, con una interfaz oscura tipo cristal sobre un fondo shader WebGL animado, un globo interactivo en three.js, una órbita radial de trayectoria y vistas previas de enlaces en vivo.",
    ],
    experiences: [
      {
        role: "Profesor de inglés",
        detail:
          "Enseñanza de inglés inmersiva y basada en el juego para unos 165 niños (de 4 a 12 años) en un campamento de verano multicultural, usando cuatro idiomas para apoyar la gestión del aula y el entendimiento intercultural.",
      },
      {
        role: "Instructor de Ciencias de la Computación",
        detail:
          "Diseñé e impartí un currículo de Python para estudiantes de secundaria: variables, bucles, condicionales, funciones y resolución de problemas con Replit y Turtle, además de evaluaciones y retroalimentación.",
      },
      {
        role: "Voluntario y mentor par",
        detail:
          "Egresado del Programa de Mentoría entre Pares. Acompaña a nuevos estudiantes en la adaptación académica y social a la vida universitaria.",
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
          "Diploma del Bachillerato Internacional en la Rotterdam International Secondary School, con 33/45 y un premio a la Excelencia en Inglés. Preparación intercultural para equipos globales y distribuidos.",
        category: "Educación",
      },
      {
        title: "Políglota: PT / ES / EN / NL",
        content:
          "Portugués y español nativos, inglés C2, neerlandés A1. Una habilidad blanda clave y una ventaja real para equipos distribuidos en varias zonas horarias e idiomas.",
        category: "Habilidades",
      },
      {
        title: "Tec de Monterrey, ITC",
        content:
          "Licenciatura en Ingeniería en Tecnologías Computacionales en el Campus Santa Fe, Ciudad de México. Promedio 92.8/100. Cursos de estructuras de datos, bases de datos, sistemas embebidos e IoT, interconexión de dispositivos e ingeniería de software.",
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
          "Un prototipo IoT de estacionamiento inteligente con ESP32, un lexer basado en DFA con procesamiento paralelo y estructuras de datos en C++. Trabajo práctico en la capa de hardware y máquina.",
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
      { label: "Idiomas", detail: "dos nativos, inglés C2" },
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
      { pre: "Vicepresidente, ", post: " (Campus Santa Fe)" },
      { pre: "", post: " (CSF)" },
      { pre: "", post: " Miembro del capítulo (CSF)" },
      { pre: "", post: ", Tec de Monterrey" },
      { pre: "Responsable de beneficencia, ", post: " (Buy a Tulip Help a Girl, Red Cross relief)" },
    ],
    whereFrom: [
      {
        title: "Raíces brasileñas",
        body: "Hablante nativo de portugués y español, con una base multicultural y una mentalidad internacional desde temprano.",
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
      "Inglés, C2",
      "Neerlandés, A1",
    ],
  },

  pt: {
    hero: {
      prefix: "Santiago é um",
      roles: [
        "Estudante de CC",
        "Desenvolvedor full-stack",
        "Candidato ao CCNA",
        "Desenvolvedor de sistemas e IoT",
        "Poliglota",
        "Cidadão global",
        "Solucionador de problemas",
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
      engineLoc: "linhas de motor",
      servicePages: "páginas de serviços",
      clientSite: "site do cliente",
      buildTime: "de construção",
      hackathon: "hackathon",
      languages: "idiomas",
      trackers: "rastreadores",
    },
    sections: {
      projects: {
        eyebrow: "Projetos",
        title: "Algumas coisas que construí",
        intro:
          "De hardware IoT embarcado até sistemas full-stack e arquitetura web moderna.",
      },
      skills: {
        eyebrow: "Habilidades",
        title: "Kit técnico",
        intro:
          "Linguagens, sistemas e a base de engenharia por trás do meu trabalho em sistemas embarcados, full-stack e computação paralela.",
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
          "Ensinar, mentorar e fazer acontecer entre culturas e fusos horários. As habilidades interpessoais que complementam as técnicas.",
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
          "Esse caminho atravessa o mundo. Cresci em uma casa brasileira e portuguesa, fiz o Diploma do IB nos Países Baixos e agora estudo Ciência da Computação na Cidade do México. Tenho nacionalidade mexicana, brasileira e portuguesa (UE), então posso trabalhar na UE, no México e no Brasil sem patrocínio. Transitar entre culturas e fusos horários é como sempre vivi, e é daí que vêm minhas habilidades de comunicação e adaptação.",
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
      "Um site freelance que desenhei e entreguei para a DT Construct ICS, uma empresa mexicana de construção. Programado à mão em HTML, CSS e JavaScript: um catálogo de serviços de seis páginas (varejo, industrial, infraestrutura, instalações especiais e manutenção), mapas interativos com Leaflet e um portfólio de obras realizadas para clientes como Almacenes Garcia, Avante Textil, Hotel Resort Secrets e TOUS. No ar com domínio próprio.",
      "Um protótipo de hackathon que roteia caminhões-pipa mexicanos para as áreas com maior estresse hídrico. Combina dados climáticos de satélite com uma variação ponderada e atenta à segurança do algoritmo de Dijkstra, apoiada por um modelo de negócio validado.",
      "Um projeto de equipe principal de 8 créditos: um deckbuilder roguelike feito do zero, motor incluído (sem framework). Um cliente em HTML5 Canvas sobre uma API REST em Express de 28 endpoints, apoiada por um esquema MySQL de 745 linhas: 12 tabelas, 20 procedimentos armazenados, 13 views analíticas (rankings, taxas de vitória por inimigo e dificuldade, popularidade de cartas) e 7 triggers que mantêm sincronizadas as estatísticas do jogador e o histórico de partidas. O estado no meio do duelo é salvo como JSON para retomar a partida exatamente de onde parou, com deleções em cascata e 35 índices.",
      "Um Breakout no navegador feito do zero sobre um motor HTML5 Canvas próprio (sem framework): uma hierarquia POO de Ball, Paddle e Brick sobre uma base GameObject comum e uma pequena biblioteca Vector, movida por um loop com delta-time para uma física independente dos FPS. O diferencial: inclinar a raquete 30 graus a rotaciona pela transformação do canvas e redireciona o vetor de rebote da bola para os cantos. Três níveis temáticos (disco, hip hop, rock), cada um com seus próprios sprites e música.",
      "Um lexer DFA feito à mão (tabela de transições explícita, sem regex) estendido para um realçador de sintaxe paralelo, com speedup medido de cerca de 6x sobre uma versão sequencial em 16 núcleos. A lógica de parsing de baixo nível por trás do código seguro e da inspeção profunda de pacotes.",
      "Este site. React 19, Tailwind 4 e um build de exportação estática, com uma interface escura estilo vidro sobre um fundo shader WebGL animado, um globo interativo em three.js, uma órbita radial de trajetória e pré-visualizações de links ao vivo.",
    ],
    experiences: [
      {
        role: "Professor de inglês",
        detail:
          "Ensino de inglês imersivo e baseado em brincadeiras para cerca de 165 crianças (de 4 a 12 anos) em um acampamento de verão multicultural, usando quatro idiomas para apoiar a gestão da turma e o entendimento intercultural.",
      },
      {
        role: "Instrutor de Ciência da Computação",
        detail:
          "Projetei e lecionei um currículo de Python para alunos do ensino fundamental: variáveis, laços, condicionais, funções e resolução de problemas com Replit e Turtle, além de avaliações e feedback.",
      },
      {
        role: "Voluntário e mentor par",
        detail:
          "Formado pelo Programa de Mentoria entre Pares. Acompanha novos estudantes na adaptação acadêmica e social à vida universitária.",
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
          "Diploma do Bacharelado Internacional na Rotterdam International Secondary School, com 33/45 e um prêmio de Excelência em Inglês. Preparo intercultural para equipes globais e distribuídas.",
        category: "Educação",
      },
      {
        title: "Poliglota: PT / ES / EN / NL",
        content:
          "Português e espanhol nativos, inglês C2, neerlandês A1. Uma habilidade interpessoal essencial e uma vantagem real para equipes distribuídas em vários fusos e idiomas.",
        category: "Habilidades",
      },
      {
        title: "Tec de Monterrey, ITC",
        content:
          "Bacharelado em Ciência e Tecnologia da Computação no Campus Santa Fe, Cidade do México. Média 92.8/100. Disciplinas de estruturas de dados, bancos de dados, sistemas embarcados e IoT, interconexão de dispositivos e engenharia de software.",
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
          "Um protótipo IoT de estacionamento inteligente com ESP32, um lexer baseado em DFA com processamento paralelo e estruturas de dados em C++. Trabalho prático na camada de hardware e máquina.",
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
      { label: "Idiomas", detail: "dois nativos, inglês C2" },
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
      { pre: "Vice-presidente, ", post: " (Campus Santa Fe)" },
      { pre: "", post: " (CSF)" },
      { pre: "", post: " Membro do capítulo (CSF)" },
      { pre: "", post: ", Tec de Monterrey" },
      { pre: "Responsável por caridade, ", post: " (Buy a Tulip Help a Girl, Red Cross relief)" },
    ],
    whereFrom: [
      {
        title: "Raízes brasileiras",
        body: "Falante nativo de português e espanhol, com uma base multicultural e uma mentalidade internacional desde cedo.",
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
      "Inglês, C2",
      "Neerlandês, A1",
    ],
  },

  nl: {
    hero: {
      prefix: "Santiago is een",
      roles: [
        "Informaticastudent",
        "Full-stack developer",
        "CCNA-kandidaat",
        "Systeem- en IoT-ontwikkelaar",
        "Polyglot",
        "Wereldburger",
        "Probleemoplosser",
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
      engineLoc: "engine-regels",
      servicePages: "servicepagina's",
      clientSite: "clientsite",
      buildTime: "bouwtijd",
      hackathon: "hackathon",
      languages: "talen",
      trackers: "trackers",
    },
    sections: {
      projects: {
        eyebrow: "Projecten",
        title: "Een paar dingen die ik heb gebouwd",
        intro:
          "Van embedded IoT-hardware tot full-stack systemen en moderne webarchitectuur.",
      },
      skills: {
        eyebrow: "Vaardigheden",
        title: "Technische toolkit",
        intro:
          "Talen, systemen en de technische basis achter mijn werk in embedded, full-stack en parallel computing.",
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
          "Lesgeven, begeleiden en dingen gedaan krijgen over culturen en tijdzones heen. De soft skills die de technische aanvullen.",
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
          "Dat pad loopt over de hele wereld. Ik groeide op in een Braziliaans-Portugees gezin, behaalde het IB-diploma in Nederland en studeer nu informatica in Mexico-Stad. Ik heb de Mexicaanse, Braziliaanse en Portugese (EU) nationaliteit, dus ik kan zonder sponsoring in de EU, Mexico en Brazilië werken. Werken over culturen en tijdzones heen is hoe ik altijd heb geleefd, en daar komen mijn communicatie- en aanpassingsvaardigheden vandaan.",
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
      "Een freelance website die ik ontwierp en opleverde voor DT Construct ICS, een Mexicaans bouwbedrijf. Met de hand gecodeerd in HTML, CSS en JavaScript: een servicecatalogus van zes pagina's (retail, industrieel, infrastructuur, speciale installaties en onderhoud), interactieve Leaflet-kaarten en een portfolio van opgeleverd werk voor klanten als Almacenes Garcia, Avante Textil, Hotel Resort Secrets en TOUS. Live op een eigen domein.",
      "Een hackathon-prototype dat Mexicaanse watertrucks naar de gebieden met de grootste waterschaarste stuurt. Combineert satellietklimaatdata met een gewogen, veiligheidsbewuste variant van Dijkstra's algoritme, onderbouwd door een gevalideerd bedrijfsmodel.",
      "Een toonaangevend teamproject van 8 studiepunten: een roguelike deckbuilder volledig zelf gebouwd, engine inbegrepen (geen framework). Een HTML5 Canvas-client op een Express REST-API van 28 endpoints, met een MySQL-schema van 745 regels: 12 tabellen, 20 stored procedures, 13 analytische views (ranglijsten, winstpercentages per vijand en moeilijkheidsgraad, kaartpopulariteit) en 7 triggers die spelerstatistieken en speelgeschiedenis synchroon houden. De staat midden in een duel wordt als JSON opgeslagen zodat een run precies hervat waar hij stopte, met cascade-deletes en 35 indexen.",
      "Een browser-Breakout volledig zelf gebouwd op een eigen HTML5 Canvas-engine (geen framework): een OOP-hiërarchie van Ball, Paddle en Brick op een gedeelde GameObject-basis en een kleine Vector-library, aangedreven door een delta-time loop voor framerate-onafhankelijke fysica. De twist: de paddle 30 graden kantelen draait hem via de canvas-transform en stuurt de stuitervector van de bal naar de hoeken. Drie thematische levels (disco, hiphop, rock), elk met eigen sprites en muziek.",
      "Een handgebouwde DFA-lexer (expliciete overgangstabel, geen regex) uitgebreid tot een parallelle syntax-highlighter, gemeten op ongeveer 6x sneller dan een sequentiële basis op 16 cores. De low-level parsinglogica achter veilige code en deep packet inspection.",
      "Deze site. React 19, Tailwind 4 en een statische export-build, met een glasachtige donkere UI over een geanimeerde WebGL-shaderachtergrond, een interactieve three.js-globe, een radiale loopbaanbaan en live linkvoorbeelden.",
    ],
    experiences: [
      {
        role: "Docent Engels",
        detail:
          "Meeslepend, spelgebaseerd Engels onderwijs voor ongeveer 165 kinderen (4 tot 12 jaar) in een multiculturele zomerkampsetting, met vier talen ter ondersteuning van klassenmanagement en intercultureel begrip.",
      },
      {
        role: "Informatica-instructeur",
        detail:
          "Een Python-curriculum ontworpen en gegeven voor middelbare scholieren: variabelen, loops, condities, functies en probleemoplossing met Replit en Turtle, plus toetsing en feedback.",
      },
      {
        role: "Vrijwilliger en peer-mentor",
        detail:
          "Afgestudeerd aan het Peer Mentorship-programma. Begeleidt nieuwe studenten bij de academische en sociale aanpassing aan het studentenleven.",
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
          "International Baccalaureate-diploma aan de Rotterdam International Secondary School, met 33/45 en een Excellence in English-prijs. Interculturele paraatheid voor wereldwijde, gedistribueerde teams.",
        category: "Onderwijs",
      },
      {
        title: "Polyglot: PT / ES / EN / NL",
        content:
          "Portugees en Spaans als moedertaal, Engels C2, Nederlands A1. Een belangrijke soft skill en een echt voordeel voor gedistribueerde teams over meerdere tijdzones en talen.",
        category: "Vaardigheden",
      },
      {
        title: "Tec de Monterrey, ITC",
        content:
          "Bachelor in Computer Science and Technology aan Campus Santa Fe, Mexico-Stad. GPA 92,8/100. Vakken in datastructuren, databases, embedded systems en IoT, apparaatinterconnectie en software engineering.",
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
          "Een ESP32 IoT smart-parking-prototype, een DFA-gebaseerde lexer met parallelle verwerking en datastructuren in C++. Praktisch werk op de hardware- en machinelaag.",
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
      { label: "Talen", detail: "twee moedertalen, Engels C2" },
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
      { pre: "Vicevoorzitter, ", post: " (Campus Santa Fe)" },
      { pre: "", post: " (CSF)" },
      { pre: "", post: " Afdelingslid (CSF)" },
      { pre: "", post: ", Tec de Monterrey" },
      { pre: "Hoofd liefdadigheid, ", post: " (Buy a Tulip Help a Girl, Red Cross relief)" },
    ],
    whereFrom: [
      {
        title: "Braziliaanse wortels",
        body: "Portugees en Spaans als moedertaal, met een multiculturele basis en al vroeg een internationale instelling.",
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
      "Engels, C2",
      "Nederlands, A1",
    ],
  },
};
