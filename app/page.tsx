"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  Globe,
  GraduationCap,
  Languages,
  MapPin,
  Cpu,
  Network,
  Shield,
  Mail,
  Award,
  TrendingUp,
  BookOpen,
  Briefcase,
  Users,
  BadgeCheck,
  CircuitBoard,
} from "lucide-react";
import AnimatedProfileCard, {
  type ProfileCardProps,
} from "@/components/ui/info-card";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { LinkPreview } from "@/components/ui/link-preview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobeViz from "@/components/ui/globe";
import ShaderBackground from "@/components/ui/shader-background";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Constants and data
 * ------------------------------------------------------------------------- */

const LINKEDIN_URL = "https://www.linkedin.com/in/santiago-aguilar-b1702a270/";
const GITHUB_URL = "https://github.com/sant-mell";
const EMAIL = "sant.mell016@gmail.com";
const MAILTO_URL = `mailto:${EMAIL}`;
const CV_URL = "/cv.pdf";

const profile: ProfileCardProps = {
  name: "Santiago Aguilar Mello",
  role: "Multicultural CS (ITC) student @ Tec de Monterrey, Santa Fe",
  status: "online",
  avatar: "/profile.jpg",
  tags: [],
  isVerified: true,
  followers: 142,
  followersLabel: "LinkedIn connections",
  connectUrl: LINKEDIN_URL,
  messageUrl: MAILTO_URL,
};

interface TimelineNode {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: ComponentType<{ size?: number | string }>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

const systemsTimeline: TimelineNode[] = [
  {
    id: 1,
    title: "IBDP, Rotterdam (NL)",
    date: "2022-2024",
    content:
      "International Baccalaureate Diploma at Rotterdam International Secondary School, scoring 33/45 with an Excellence in English award. Cross-cultural readiness for global, distributed teams.",
    category: "Education",
    icon: Globe,
    relatedIds: [2, 3],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Polyglot: PT / ES / EN / NL",
    date: "Ongoing",
    content:
      "Native Portuguese and Spanish, English C2, Dutch A1. A real asset for distributed teams that span multiple time zones and languages.",
    category: "Skills",
    icon: Languages,
    relatedIds: [1, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "Tec de Monterrey, ITC",
    date: "2024-Present",
    content:
      "B.S. in Computer Science and Technology at Campus Santa Fe, Mexico City. GPA 96.33. Coursework spanning data structures, networks, databases, embedded systems, and cybersecurity.",
    category: "Education",
    icon: GraduationCap,
    relatedIds: [1, 2, 4],
    status: "in-progress",
    energy: 90,
  },
  {
    id: 4,
    title: "Teaching & Peer Mentorship",
    date: "2024-Present",
    content:
      "Python instructor for middle-school students, English teacher in the Netherlands, and a graduate Peer Mentor at Tec, guiding new students through their first year.",
    category: "Experience",
    icon: BookOpen,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 85,
  },
  {
    id: 5,
    title: "IoT & Systems Engineering",
    date: "2025",
    content:
      "An ESP32 IoT smart-parking prototype, a DFA-based lexer with parallel processing, and data structures in C++. Hands-on work at the hardware and machine layer.",
    category: "Projects",
    icon: Cpu,
    relatedIds: [4, 6],
    status: "completed",
    energy: 90,
  },
  {
    id: 6,
    title: "START Hack: Aquaroute",
    date: "2026",
    content:
      "First hackathon. Built Aquaroute in 36 hours: a SaaS that routes water trucks to the most water-stressed areas using satellite climate data and a weighted variation of Dijkstra's algorithm.",
    category: "Projects",
    icon: Network,
    relatedIds: [5, 7],
    status: "completed",
    energy: 80,
  },
  {
    id: 7,
    title: "Target: CCNA & Cybersecurity",
    date: "2026+",
    content:
      "Working toward the Cisco CCNA certification and a cybersecurity or network engineering internship, with a focus on remote, global infrastructure roles.",
    category: "Career",
    icon: Shield,
    relatedIds: [6],
    status: "pending",
    energy: 20,
  },
];

interface Project {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  repoUrl: string;
}

const projects: Project[] = [
  {
    title: "IoT Smart Parking System",
    subtitle: "ESP32 · MQTT · Python",
    description:
      "A full IoT prototype with occupancy detection, automated barrier control, and cloud telemetry. Embedded firmware on ESP32 talking to cloud services over MQTT.",
    stack: ["C++ / Arduino", "ESP32", "MQTT", "Python", "ThingSpeak"],
    repoUrl: "https://github.com/sant-mell/smart-parking-iot",
  },
  {
    title: "Aquaroute (START Hack)",
    subtitle: "SaaS · Algorithm Design",
    description:
      "A hackathon prototype that routes Mexican water trucks to the most water-stressed areas. Combines satellite climate data with a weighted, safety-aware variation of Dijkstra's algorithm, backed by a validated business model.",
    stack: ["Algorithm Design", "Dijkstra Variant", "Satellite Data", "SaaS"],
    repoUrl:
      "https://www.linkedin.com/posts/santiago-aguilar-b1702a270_starthackmexico-tecdemonterrey-lovable-ugcPost-7429695225133957120-GuHB/",
  },
  {
    title: "The Fool's Descent (TC2005B)",
    subtitle: "JavaScript · Node · MySQL",
    description:
      "An 8-credit flagship team project: a roguelike card game with an HTML5 Canvas client, an Express API, and a MySQL layer with stored procedures and triggers. Built with OOP, real state management, and strict version control.",
    stack: ["JavaScript", "HTML5 Canvas", "Node.js / Express", "MySQL", "Git"],
    repoUrl: "https://github.com/sant-mell/videoGame-TC2005B.501",
  },
  {
    title: "Breakout",
    subtitle: "JavaScript · HTML5 Canvas",
    description:
      "A browser Breakout clone with a twist: the paddle tilts to aim the ball into corners. Three levels, each with its own music theme (disco, hip hop, rock), built on a small Canvas engine with vector math and a delta-time game loop.",
    stack: ["JavaScript", "HTML5 Canvas", "Game Loop", "Collision Detection"],
    repoUrl: "https://github.com/sant-mell/myTC2005B/tree/main/Videojuegos/Breakout",
  },
  {
    title: "DFA Lexer / Compiler",
    subtitle: "Python · Automata Theory",
    description:
      "A DFA-driven lexer and a parallel syntax highlighter, benchmarked against a sequential baseline. The low-level parsing logic behind secure code and deep packet inspection.",
    stack: ["Python", "Multiprocessing", "Automata / DFA", "Benchmarking"],
    repoUrl: GITHUB_URL,
  },
  {
    title: "Data Structures in C++",
    subtitle: "C++ · Algorithms",
    description:
      "BSTs, AVL trees, heaps, queues, hash logs, BFS / DFS, and Dijkstra, each with a full time and space complexity analysis. Foundations done properly.",
    stack: ["C++", "Trees & Heaps", "Graphs", "Complexity Analysis"],
    repoUrl: "https://github.com/sant-mell/data-structures-cpp",
  },
  {
    title: "Cat Cafe Database",
    subtitle: "MySQL · Database Design",
    description:
      "A normalized MySQL database for a cat cafe chain: ER modeling, foreign keys, a many-to-many junction table, seed data, and example queries, alongside a formal normalization exercise.",
    stack: ["MySQL", "ER Modeling", "SQL", "Normalization"],
    repoUrl: "https://github.com/sant-mell/catcafe-database",
  },
  {
    title: "Next.js Portfolio",
    subtitle: "Next.js 16 · React 19",
    description:
      "This site. React 19, Tailwind 4, and a static export build, with a neumorphic UI, an interactive radial career orbit, and live link previews.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"],
    repoUrl: "https://github.com/sant-mell/sant-mell.github.io",
  },
];

interface Experience {
  role: string;
  org: string;
  /** Optional official URL for the org, shown as a hover link preview. */
  orgUrl?: string;
  period: string;
  location: string;
  detail: string;
}

const experiences: Experience[] = [
  {
    role: "English Language Teacher",
    org: "Pro English BV (Self-employed)",
    period: "Jul 2025 - Present",
    location: "Rotterdam, Netherlands",
    detail:
      "Immersive, play-based English instruction for around 165 children (ages 4 to 12) in a multicultural summer-camp setting, using four languages to support classroom management and cross-cultural understanding.",
  },
  {
    role: "Computer Science Instructor",
    org: "Logaritmia MX",
    orgUrl: "https://www.linkedin.com/company/logaritmia-mx/",
    period: "Jan 2025 - May 2025",
    location: "Telesecundaria, Mexico",
    detail:
      "Designed and taught a Python curriculum for middle-school students: variables, loops, conditionals, functions, and problem solving with Replit and Turtle, plus assessments and feedback.",
  },
  {
    role: "Volunteer & Peer Mentor",
    org: "Tec de Monterrey",
    orgUrl: "https://tec.mx",
    period: "2024 - Present",
    location: "Campus Santa Fe",
    detail:
      "Graduate of the Peer Mentorship Program. Guides new students through the academic and social adaptation to university life.",
  },
  {
    role: "Media Logistics Assistant",
    org: "DPG Media Nederland",
    orgUrl: "https://www.dpgmedia.nl",
    period: "Jun 2022 - Aug 2022",
    location: "South Holland, Netherlands",
    detail:
      "Optimized last-mile print distribution routes for NRC, De Telegraaf, AD, and others under strict daily time constraints.",
  },
];

interface LeadershipItem {
  /** Text before the linkable keyword. */
  pre?: string;
  /** The keyword itself (linked with a hover preview when `url` is set). */
  link: string;
  /** Optional official URL for the keyword. */
  url?: string;
  /** Text after the linkable keyword. */
  post?: string;
}

const leadership: LeadershipItem[] = [
  { pre: "Vice President, ", link: "Krei Student Society", url: "https://www.instagram.com/kreicsf/", post: " (Campus Santa Fe)" },
  { link: "Advanced Competitive Programming Team", post: " (CSF)" },
  { link: "COPARMEX", url: "https://coparmex.org.mx", post: " Chapter member (CSF)" },
  { link: "Peer Mentor", url: "https://tec.mx", post: ", Tec de Monterrey" },
  {
    pre: "Head of Charity, ",
    link: "RISS Netherlands",
    url: "https://riss.wolfert.nl",
    post: " (Buy a Tulip Help a Girl, Red Cross relief)",
  },
];

const coursework: string[] = [
  "Data Structures",
  "OOP (C++)",
  "Computer Networks",
  "Computer Cybersecurity",
  "Embedded Systems & IoT",
  "Databases",
  "Software Engineering",
  "Web Development",
  "Advanced AI for Data Science",
  "Data Analytics & AI Tools",
  "Computational Thinking",
  "Differential Equations",
];

interface Certification {
  name: string;
  issuer: string;
  /** Optional official URL for the issuer, shown as a hover link preview. */
  issuerUrl?: string;
  date: string;
  url?: string;
}

const certifications: Certification[] = [
  {
    name: "Universitas 21 Global Citizenship",
    issuer: "Common Purpose",
    issuerUrl: "https://commonpurpose.org",
    date: "Apr 2026",
    url: "https://students.learn.commonpurpose.org/badges/badge.php?hash=c0442df8bdb7d00a1d43171b2e55713295fb1f87",
  },
  {
    name: "IB Diploma, 33/45",
    issuer: "Rotterdam International Secondary School",
    issuerUrl: "https://riss.wolfert.nl",
    date: "2024",
  },
  {
    name: "Excellence in English Award",
    issuer: "RISS, Netherlands",
    issuerUrl: "https://riss.wolfert.nl",
    date: "2024",
  },
];

interface Metric {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
}

const metrics: Metric[] = [
  { label: "University GPA", value: "96.33", detail: "out of 100, Tec de Monterrey", icon: Award },
  { label: "IB Diploma", value: "33/45", detail: "Excellence in English", icon: GraduationCap },
  { label: "Expected Graduation", value: "2028", detail: "B.S. Computer Science (ITC)", icon: TrendingUp },
  { label: "Languages", value: "4", detail: "two native, English C2", icon: Languages },
];

interface SkillCluster {
  title: string;
  icon: ComponentType<{ className?: string }>;
  skills: string[];
}

const skillClusters: SkillCluster[] = [
  {
    title: "Languages",
    icon: Cpu,
    skills: ["C++", "Python", "TypeScript", "JavaScript", "SQL", "HTML / CSS", "Racket"],
  },
  {
    title: "Systems & Networking",
    icon: Network,
    skills: ["Linux / Bash", "Networking", "MQTT", "ESP-IDF", "Arduino (ESP32)", "Embedded C"],
  },
  {
    title: "Tools & Web",
    icon: CircuitBoard,
    skills: ["Git / GitHub", "Next.js", "React", "Node.js", "ThingSpeak"],
  },
];

/* ----------------------------------------------------------------------------
 * Brand marks (lucide v1 dropped brand icons)
 * ------------------------------------------------------------------------- */

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

function LinkedinMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * Animation helpers
 * ------------------------------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="aurora-blob absolute -top-24 -left-24 h-72 w-72 rounded-full bg-zinc-400/30 dark:bg-zinc-600/25" />
      <div
        className="aurora-blob absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-zinc-300/30 dark:bg-zinc-700/25"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="aurora-blob absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-zinc-500/20 dark:bg-zinc-500/15"
        style={{ animationDelay: "8s" }}
      />
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Section primitives
 * ------------------------------------------------------------------------- */

// Inline style for keyword links that reveal a hover screenshot preview.
const KEYWORD_LINK =
  "underline decoration-dotted decoration-zinc-400 underline-offset-4 transition-colors hover:text-zinc-900 dark:hover:text-white";

const NEUMORPHIC =
  "rounded-3xl bg-zinc-100 dark:bg-white/[0.05] dark:border dark:border-white/10 dark:backdrop-blur-xl shadow-[12px_12px_24px_rgba(0,0,0,0.12),-12px_-12px_24px_rgba(255,255,255,0.9)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]";

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-700 dark:text-zinc-300">
        {eyebrow}
      </p>
      <h2 className="gradient-text mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children && (
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {children}
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function Home() {
  return (
    <main className="relative isolate dark bg-black text-white">
      {/* Page-wide animated grayscale background */}
      <div className="fixed inset-0 -z-10">
        <ShaderBackground />
      </div>
      {/* HERO */}
      <section>
        <AnimatedProfileCard profile={profile} cvUrl={CV_URL} />
      </section>

      {/* SKILLS */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading eyebrow="Skills" title="Technical toolkit">
            Languages, systems, and the networking foundation behind a Cisco
            CCNA and cybersecurity track.
          </SectionHeading>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {skillClusters.map((cluster, i) => {
            const Icon = cluster.icon;
            return (
              <Reveal key={cluster.title} delay={i * 120}>
                <div className={cn(NEUMORPHIC, "group h-full p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-zinc-500/20")}>
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-zinc-700/10 p-2 text-zinc-700 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 dark:bg-zinc-300/10 dark:text-zinc-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {cluster.title}
                    </h3>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {cluster.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-3 py-1 text-sm shadow-sm transition-transform hover:scale-110"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading eyebrow="Projects" title="A few things I have built">
            From embedded IoT hardware up to full-stack systems and modern web
            architecture.
          </SectionHeading>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 100}>
              <Card
                className={cn(
                  NEUMORPHIC,
                  "shine group relative flex h-full flex-col overflow-hidden border-none p-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-zinc-500/20",
                )}
              >
                <CardHeader>
                  <p className="text-xs font-mono uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                    {project.subtitle}
                  </p>
                  <CardTitle className="mt-1 text-xl text-zinc-900 transition-colors group-hover:text-zinc-700 dark:text-white dark:group-hover:text-zinc-300">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs transition-transform hover:scale-110"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-5">
                    <LinkPreview
                      url={project.repoUrl}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 underline underline-offset-4 dark:text-zinc-300"
                    >
                      {project.repoUrl.includes("linkedin.com") ? (
                        <>
                          <LinkedinMark className="h-4 w-4" />
                          View on LinkedIn
                        </>
                      ) : (
                        <>
                          <GithubMark className="h-4 w-4" />
                          View on GitHub
                        </>
                      )}
                    </LinkPreview>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GITHUB ACTIVITY */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading eyebrow="On GitHub" title="What I have been building">
            My public commit history. Hover the link to preview the profile.
          </SectionHeading>
        </Reveal>

        <Reveal delay={120}>
          <div className={cn(NEUMORPHIC, "shine group relative mx-auto mt-12 max-w-3xl overflow-hidden p-6 transition-transform duration-300 hover:scale-[1.02] sm:p-8")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ghchart.rshah.org/52525b/sant-mell"
              alt="GitHub contributions for sant-mell"
              className="w-full max-w-3xl mx-auto rounded-md shadow-sm dark:invert"
            />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <LinkPreview
              url={GITHUB_URL}
              className="inline-flex items-center gap-2 font-semibold text-zinc-700 underline underline-offset-4 dark:text-zinc-300"
            >
              <GithubMark className="h-4 w-4" />
              github.com/sant-mell
            </LinkPreview>
          </div>
        </Reveal>
      </section>

      {/* EXPERIENCE */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading eyebrow="Experience" title="Where I have worked">
            Teaching, mentoring, and getting things done across cultures and
            time zones.
          </SectionHeading>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-5">
          {experiences.map((exp, i) => (
            <Reveal key={exp.role + exp.org} delay={i * 100}>
              <div className={cn(NEUMORPHIC, "group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-zinc-500/20")}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
                    <Briefcase className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                    {exp.role}
                  </h3>
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {exp.period}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {exp.orgUrl ? (
                    <LinkPreview url={exp.orgUrl} className={KEYWORD_LINK}>
                      {exp.org}
                    </LinkPreview>
                  ) : (
                    exp.org
                  )}
                  <span className="text-zinc-400 dark:text-zinc-500"> · {exp.location}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {exp.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LEADERSHIP & COURSEWORK */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <Reveal>
            <div className={cn(NEUMORPHIC, "h-full p-7")}>
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-zinc-700/10 p-2 text-zinc-700 dark:bg-zinc-300/10 dark:text-zinc-300">
                  <Users className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Leadership & Community
                </h3>
              </div>
              <ul className="mt-5 space-y-3">
                {leadership.map((item) => (
                  <li key={item.link} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
                    <span>
                      {item.pre}
                      {item.url ? (
                        <LinkPreview url={item.url} className={KEYWORD_LINK}>
                          {item.link}
                        </LinkPreview>
                      ) : (
                        item.link
                      )}
                      {item.post}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className={cn(NEUMORPHIC, "h-full p-7")}>
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-zinc-700/10 p-2 text-zinc-700 dark:bg-zinc-300/10 dark:text-zinc-300">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Relevant Coursework
                </h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {coursework.map((course) => (
                  <Badge
                    key={course}
                    variant="secondary"
                    className="px-3 py-1 text-sm shadow-sm transition-transform hover:scale-110"
                  >
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ACADEMIC METRICS */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading eyebrow="Academics" title="How I am doing at Tec" />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <Reveal key={metric.label} delay={i * 100}>
                <div
                  className={cn(
                    NEUMORPHIC,
                    "group h-full p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-zinc-500/20",
                  )}
                >
                  <Icon className="h-6 w-6 text-zinc-700 transition-transform duration-300 group-hover:scale-125 dark:text-zinc-300" />
                  <p className="gradient-text mt-4 text-4xl font-bold tracking-tight">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {metric.detail}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="relative overflow-hidden px-4 pb-24 sm:pb-28">
        <Aurora />
        <Reveal>
          <SectionHeading eyebrow="Certifications" title="Certifications & awards" />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {certifications.map((cert, i) => (
            <Reveal key={cert.name} delay={i * 100}>
              <div className={cn(NEUMORPHIC, "group h-full p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-zinc-500/20")}>
                <BadgeCheck className="mx-auto h-8 w-8 text-zinc-700 transition-transform duration-300 group-hover:scale-125 dark:text-zinc-300" />
                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
                  {cert.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {cert.issuerUrl ? (
                    <LinkPreview url={cert.issuerUrl} className={KEYWORD_LINK}>
                      {cert.issuer}
                    </LinkPreview>
                  ) : (
                    cert.issuer
                  )}
                </p>
                <p className="mt-1 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {cert.date}
                </p>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-900 hover:text-white dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-white dark:hover:text-zinc-900"
                  >
                    View credential
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SYSTEMS TIMELINE (the journey, segues into the globe below) */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-20 pt-8 text-center pointer-events-none">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-white/50">
            My path so far
          </p>
          <h2 className="gradient-text mt-2 text-2xl font-bold">
            From the IB Diploma to the CCNA track
          </h2>
          <p className="mt-2 text-xs text-white/40">
            Click a node to see more
          </p>
        </div>
        <div className="relative z-10">
          <RadialOrbitalTimeline timelineData={systemsTimeline} />
        </div>
      </section>

      {/* GLOBAL COMMUNICATOR (globe; closes the story the timeline opened) */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading eyebrow="Where I'm from" title="Three countries, four languages">
            That path runs across the globe. I grew up in a Brazilian-Portuguese
            household, did the IB Diploma in the Netherlands, and now study
            Computer Science in Mexico City. Working across cultures and time
            zones is just how I have always lived.
          </SectionHeading>
        </Reveal>

        <Reveal delay={80}>
          <div className="mx-auto mt-12 h-[300px] w-full max-w-md sm:h-[360px]">
            <GlobeViz className="h-full w-full" />
          </div>
          <p className="mt-2 text-center text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            Sao Paulo · Rotterdam · Mexico City
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              flag: "🇧🇷",
              title: "Brazilian Roots",
              body: "Native Portuguese and Spanish speaker with a multicultural foundation and an early international mindset.",
            },
            {
              flag: "🇳🇱",
              title: "IB Diploma, Netherlands",
              body: "Completed the International Baccalaureate (33/45) at Rotterdam International Secondary School with an Excellence in English award.",
            },
            {
              flag: "🇲🇽",
              title: "CS, Mexico City",
              body: "Studying Computer Science and Technology at Tec de Monterrey, Campus Santa Fe, based in Huixquilucan.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <div
                className={cn(
                  NEUMORPHIC,
                  "group h-full p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-zinc-500/20",
                )}
              >
                <div className="float-slow text-4xl" style={{ animationDelay: `${i * 0.6}s` }}>
                  {item.flag}
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900 transition-colors group-hover:text-zinc-700 dark:text-white dark:group-hover:text-zinc-300">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {[
              "🇧🇷 Portuguese, Native",
              "🇪🇸 Spanish, Native",
              "🇬🇧 English, C2",
              "🇳🇱 Dutch, A1",
            ].map((lang) => (
              <Badge
                key={lang}
                variant="secondary"
                className="px-4 py-1.5 text-sm shadow-sm transition-transform hover:scale-110"
              >
                {lang}
              </Badge>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 px-4 py-12 dark:border-zinc-800">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-zinc-900 dark:text-white">
              Santiago Aguilar Mello
            </p>
            <p className="flex items-center justify-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 sm:justify-start">
              <MapPin className="h-3.5 w-3.5" />
              Mexico City, Mexico · Open to remote and global roles
            </p>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={MAILTO_URL}
              aria-label="Email Santiago"
              className="text-zinc-500 transition-all hover:-translate-y-1 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              <Mail className="h-5 w-5" />
            </a>
            <LinkPreview
              url={GITHUB_URL}
              className="text-zinc-500 transition-all hover:-translate-y-1 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              <GithubMark className="h-5 w-5" />
              <span className="sr-only">GitHub profile</span>
            </LinkPreview>
            <LinkPreview
              url={LINKEDIN_URL}
              className="text-zinc-500 transition-all hover:-translate-y-1 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              <LinkedinMark className="h-5 w-5" />
              <span className="sr-only">LinkedIn profile</span>
            </LinkPreview>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} Santiago Aguilar Mello. Built with Next.js
          16, React 19 and Tailwind CSS 4.
        </p>
      </footer>
    </main>
  );
}
