"use client";

import {
  Fragment,
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
  Play,
  ExternalLink,
} from "lucide-react";
import dynamic from "next/dynamic";
import AnimatedProfileCard, {
  type ProfileCardProps,
} from "@/components/ui/info-card";
import { LinkPreview } from "@/components/ui/link-preview";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { translations, LOCALES, type Locale } from "@/lib/i18n";

/* Heavy WebGL/3D widgets are below the fold. Load them client-side only and
 * code-split them out of the initial bundle so first paint stays fast. */
const RadialOrbitalTimeline = dynamic(
  () => import("@/components/ui/radial-orbital-timeline"),
  { ssr: false, loading: () => <div className="min-h-[60vh]" /> },
);
const GlobeViz = dynamic(() => import("@/components/ui/globe"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});
const ShaderBackground = dynamic(
  () => import("@/components/ui/shader-background"),
  { ssr: false },
);

/* ----------------------------------------------------------------------------
 * Language-neutral data (icons, URLs, dates, numbers, tech-stack chips, and
 * proper nouns). All human-readable prose comes from `@/lib/i18n` by locale.
 * ------------------------------------------------------------------------- */

const LINKEDIN_URL = "https://www.linkedin.com/in/santiago-aguilar-b1702a270/";
const GITHUB_URL = "https://github.com/sant-mell";
const EMAIL = "sant.mell016@gmail.com";
const MAILTO_URL = `mailto:${EMAIL}`;
const CV_URL = "/cv.pdf";

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

const TIMELINE_META: Omit<TimelineNode, "title" | "content" | "category">[] = [
  { id: 1, date: "2022-2024", icon: Globe, relatedIds: [2, 3], status: "completed", energy: 100 },
  { id: 2, date: "Ongoing", icon: Languages, relatedIds: [1, 3], status: "completed", energy: 95 },
  { id: 3, date: "2024-Present", icon: GraduationCap, relatedIds: [1, 2, 4], status: "in-progress", energy: 90 },
  { id: 4, date: "2024-Present", icon: BookOpen, relatedIds: [3, 5], status: "in-progress", energy: 85 },
  { id: 5, date: "2025", icon: Cpu, relatedIds: [4, 6], status: "completed", energy: 90 },
  { id: 6, date: "2026", icon: Network, relatedIds: [5, 7], status: "completed", energy: 80 },
  { id: 7, date: "2026+", icon: Shield, relatedIds: [6], status: "pending", energy: 20 },
];

interface Project {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  /** Public repo. Omitted for client work whose source is private. */
  repoUrl?: string;
  /** Optional live URL a recruiter can open. */
  liveUrl?: string;
  /** How to label the live link: an in-browser demo ("demo") or a shipped site ("site"). */
  liveKind?: "demo" | "site";
  /** Render the measured sequential-vs-parallel benchmark bars (DFA lexer). */
  benchmark?: boolean;
  /** Ordered stages of a data-flow pipeline, drawn as a compact diagram. */
  pipeline?: string[];
}

const PROJECT_META: Omit<Project, "description">[] = [
  {
    title: "IoT Smart Parking System",
    subtitle: "ESP32 · MQTT · Python",
    stack: ["C++ / Arduino", "ESP32", "MQTT", "Python", "ThingSpeak"],
    repoUrl: "https://github.com/sant-mell/smart-parking-iot",
    pipeline: ["Sensors", "ESP32", "MQTT", "ThingSpeak", "Client"],
  },
  {
    title: "DT Construct ICS",
    subtitle: "Freelance · Client Website",
    stack: ["HTML", "CSS", "JavaScript", "Leaflet", "Netlify"],
    repoUrl: "https://github.com/sant-mell/dt-website",
    liveUrl: "https://dtc-ingenieria.com",
    liveKind: "site",
  },
  {
    title: "Aquaroute (START Hack)",
    subtitle: "SaaS · Algorithm Design",
    stack: ["Algorithm Design", "Dijkstra Variant", "Satellite Data", "SaaS"],
    repoUrl:
      "https://www.linkedin.com/posts/santiago-aguilar-b1702a270_starthackmexico-tecdemonterrey-lovable-ugcPost-7429695225133957120-GuHB/",
  },
  {
    title: "The Fool's Descent (TC2005B)",
    subtitle: "JavaScript · Node · MySQL",
    stack: ["JavaScript", "HTML5 Canvas", "Node.js / Express", "MySQL", "Git"],
    repoUrl: "https://github.com/sant-mell/videoGame-TC2005B.501",
  },
  {
    title: "Breakout",
    subtitle: "JavaScript · HTML5 Canvas",
    stack: ["JavaScript", "HTML5 Canvas", "Game Loop", "Collision Detection"],
    repoUrl: "https://github.com/sant-mell/myTC2005B/tree/main/Videojuegos/Breakout",
    liveUrl:
      "https://sant-mell.github.io/myTC2005B/Videojuegos/Breakout/breakout.html",
  },
  {
    title: "DFA Lexer / Compiler",
    subtitle: "Python · Automata Theory",
    stack: ["Python", "Multiprocessing", "Automata / DFA", "Benchmarking"],
    repoUrl: "https://github.com/sant-mell/parallel-syntax-highlighter",
    benchmark: true,
  },
  {
    title: "Next.js Portfolio",
    subtitle: "Next.js 16 · React 19",
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

const EXPERIENCE_META: Omit<Experience, "role" | "detail">[] = [
  {
    org: "Pro English BV (Self-employed)",
    orgUrl: "https://engelsvoorbengels.nl/",
    period: "Jul 2025 - Present",
    location: "Rotterdam, Netherlands",
  },
  {
    org: "Logaritmia MX",
    orgUrl: "https://www.linkedin.com/company/logaritmia-mx/",
    period: "Jan 2025 - May 2025",
    location: "Telesecundaria, Mexico",
  },
  {
    org: "Tec de Monterrey",
    orgUrl: "https://tec.mx",
    period: "2024 - Present",
    location: "Campus Santa Fe",
  },
  {
    org: "DPG Media Nederland",
    orgUrl: "https://www.dpgmedia.nl",
    period: "Jun 2022 - Aug 2022",
    location: "South Holland, Netherlands",
  },
];

interface LeadershipItem {
  pre?: string;
  link: string;
  url?: string;
  post?: string;
}

const LEADERSHIP_META: { link: string; url?: string }[] = [
  { link: "Krei Student Society", url: "https://www.instagram.com/kreicsf/" },
  { link: "Advanced Competitive Programming Team" },
  { link: "COPARMEX", url: "https://coparmex.org.mx" },
  {
    link: "Peer Mentor",
    url: "https://conecta.tec.mx/es/noticias/laguna/educacion/peer-mentors-jovenes-acompanando-jovenes-en-el-tec",
  },
  { link: "RISS Netherlands", url: "https://riss.wolfert.nl" },
];

interface Certification {
  name: string;
  issuer: string;
  /** Optional official URL for the issuer, shown as a hover link preview. */
  issuerUrl?: string;
  date: string;
  url?: string;
}

const CERT_META: Omit<Certification, "name">[] = [
  {
    issuer: "Common Purpose",
    issuerUrl: "https://commonpurpose.org",
    date: "Apr 2026",
    url: "https://students.learn.commonpurpose.org/badges/badge.php?hash=c0442df8bdb7d00a1d43171b2e55713295fb1f87",
  },
  {
    issuer: "Rotterdam International Secondary School",
    issuerUrl: "https://riss.wolfert.nl",
    date: "2024",
  },
  {
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

const METRIC_META: Omit<Metric, "label" | "detail">[] = [
  { value: "92.8", icon: Award },
  { value: "33/45", icon: GraduationCap },
  { value: "2028", icon: TrendingUp },
  { value: "4", icon: Languages },
];

interface SkillCluster {
  title: string;
  icon: ComponentType<{ className?: string }>;
  skills: string[];
}

const SKILL_META: Omit<SkillCluster, "title">[] = [
  {
    icon: Cpu,
    skills: ["C++", "Python", "TypeScript", "JavaScript", "SQL", "HTML / CSS", "Racket"],
  },
  {
    icon: Network,
    skills: ["Linux / Bash", "Networking", "MQTT", "ESP-IDF", "Arduino (ESP32)", "Embedded C"],
  },
  {
    icon: CircuitBoard,
    skills: ["Git / GitHub", "Next.js", "React", "Node.js", "ThingSpeak"],
  },
];

const WHEREFROM_META: { icon: ComponentType<{ className?: string }> }[] = [
  { icon: Globe },
  { icon: GraduationCap },
  { icon: Cpu },
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
 * Benchmark bars (measured DFA lexer speedup)
 * ------------------------------------------------------------------------- */

function BenchmarkBars({
  sequentialLabel,
  parallelLabel,
  fasterLabel,
}: {
  sequentialLabel: string;
  parallelLabel: string;
  fasterLabel: string;
}) {
  // Measured on a 16-core machine over a 60-file (~8 MB) Python corpus.
  const seqSeconds = 7.1;
  const parSeconds = 1.14;
  const parWidth = (parSeconds / seqSeconds) * 100; // ~16%
  return (
    <div className="mt-4 rounded-lg border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="space-y-2">
        {[
          { label: sequentialLabel, value: "7.10s", width: 100, fill: "bg-zinc-400 dark:bg-zinc-500" },
          { label: parallelLabel, value: "1.14s", width: parWidth, fill: "bg-zinc-900 dark:bg-white" },
        ].map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between font-mono text-xs text-zinc-600 dark:text-zinc-400">
              <span>{bar.label}</span>
              <span>{bar.value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div className={cn("h-full rounded-full", bar.fill)} style={{ width: `${bar.width}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-zinc-900 dark:text-white">6.23&times; {fasterLabel}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          16 cores &middot; 60 files &middot; 8 MB
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Pipeline diagram (compact data-flow architecture)
 * ------------------------------------------------------------------------- */

function PipelineDiagram({ stages }: { stages: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-1.5 rounded-lg border border-black/10 bg-black/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.04]">
      {stages.map((stage, i) => (
        <Fragment key={stage}>
          <span className="rounded-md bg-white/70 px-2 py-1 font-mono text-[11px] font-semibold text-zinc-700 shadow-sm dark:bg-white/10 dark:text-zinc-200">
            {stage}
          </span>
          {i < stages.length - 1 && (
            <span aria-hidden="true" className="text-zinc-400 dark:text-zinc-500">
              &rarr;
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Language switcher
 * ------------------------------------------------------------------------- */

function LanguageSwitcher({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
}) {
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/10 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {LOCALES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={locale === l.code}
            aria-label={l.name}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider transition-all",
              locale === l.code
                ? "bg-white text-zinc-900"
                : "text-zinc-300 hover:text-white",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
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
  const [locale, setLocale] = useState<Locale>("en");

  // Restore the visitor's last choice, then keep <html lang> and storage in sync.
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && LOCALES.some((l) => l.code === saved)) setLocale(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = translations[locale];

  const profile: ProfileCardProps = {
    name: "Santiago Aguilar Mello",
    role: t.hero.cardRole,
    avatar: "/profile.jpg",
    tags: [t.hero.openToWork],
    connectUrl: LINKEDIN_URL,
    messageUrl: MAILTO_URL,
  };

  const projects: Project[] = PROJECT_META.map((p, i) => ({
    ...p,
    description: t.projectDescriptions[i],
  }));
  const experiences: Experience[] = EXPERIENCE_META.map((e, i) => ({
    ...e,
    role: t.experiences[i].role,
    detail: t.experiences[i].detail,
  }));
  const systemsTimeline: TimelineNode[] = TIMELINE_META.map((n, i) => ({
    ...n,
    title: t.timelineNodes[i].title,
    content: t.timelineNodes[i].content,
    category: t.timelineNodes[i].category,
  }));
  const certifications: Certification[] = CERT_META.map((c, i) => ({
    ...c,
    name: t.certNames[i],
  }));
  const metrics: Metric[] = METRIC_META.map((m, i) => ({
    ...m,
    label: t.metrics[i].label,
    detail: t.metrics[i].detail,
  }));
  const skillClusters: SkillCluster[] = SKILL_META.map((s, i) => ({
    ...s,
    title: t.skillTitles[i],
  }));
  const leadership: LeadershipItem[] = LEADERSHIP_META.map((l, i) => ({
    ...l,
    pre: t.leadership[i].pre,
    post: t.leadership[i].post,
  }));
  const whereFrom = WHEREFROM_META.map((w, i) => ({
    ...w,
    title: t.whereFrom[i].title,
    body: t.whereFrom[i].body,
  }));
  const coursework = t.coursework;
  const languageBadges = t.languageBadges;

  return (
    <main className="relative isolate dark bg-black text-white">
      {/* Page-wide animated grayscale background */}
      <div className="fixed inset-0 -z-10">
        <ShaderBackground />
      </div>

      <LanguageSwitcher locale={locale} setLocale={setLocale} />

      {/* HERO */}
      <section>
        <AnimatedProfileCard
          profile={profile}
          cvUrl={CV_URL}
          taglinePrefix={t.hero.prefix}
          roles={t.hero.roles}
          cvLabel={t.hero.cv}
        />
      </section>

      {/* PROJECTS */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading
            eyebrow={t.sections.projects.eyebrow}
            title={t.sections.projects.title}
          >
            {t.sections.projects.intro}
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
                  {project.benchmark && (
                    <BenchmarkBars
                      sequentialLabel={t.ui.benchSequential}
                      parallelLabel={t.ui.benchParallel}
                      fasterLabel={t.ui.benchFaster}
                    />
                  )}
                  {project.pipeline && <PipelineDiagram stages={project.pipeline} />}
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-zinc-900"
                      >
                        {project.liveKind === "site" ? (
                          <>
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            {t.ui.visitSite}
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" aria-hidden="true" />
                            {t.ui.playInBrowser}
                          </>
                        )}
                      </a>
                    )}
                    {project.repoUrl && (
                      <LinkPreview
                        url={project.repoUrl}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 underline underline-offset-4 dark:text-zinc-300"
                      >
                        {project.repoUrl.includes("linkedin.com") ? (
                          <>
                            <LinkedinMark className="h-4 w-4" />
                            {t.ui.viewOnLinkedin}
                          </>
                        ) : (
                          <>
                            <GithubMark className="h-4 w-4" />
                            {t.ui.viewOnGithub}
                          </>
                        )}
                      </LinkPreview>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading
            eyebrow={t.sections.skills.eyebrow}
            title={t.sections.skills.title}
          >
            {t.sections.skills.intro}
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

      {/* GITHUB ACTIVITY */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading
            eyebrow={t.sections.github.eyebrow}
            title={t.sections.github.title}
          >
            {t.sections.github.intro}
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
          <SectionHeading
            eyebrow={t.sections.experience.eyebrow}
            title={t.sections.experience.title}
          >
            {t.sections.experience.intro}
          </SectionHeading>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-5">
          {experiences.map((exp, i) => (
            <Reveal key={exp.org} delay={i * 100}>
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
                  {t.leadershipTitle}
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
                  {t.courseworkTitle}
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
          <SectionHeading
            eyebrow={t.sections.academics.eyebrow}
            title={t.sections.academics.title}
          />
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
          <SectionHeading
            eyebrow={t.sections.certifications.eyebrow}
            title={t.sections.certifications.title}
          />
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
                  <LinkPreview
                    url={cert.url}
                    className="mt-3 inline-block rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-900 hover:text-white dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-white dark:hover:text-zinc-900"
                  >
                    {t.ui.viewCredential}
                  </LinkPreview>
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
            {t.timeline.eyebrow}
          </p>
          <h2 className="gradient-text mt-2 text-2xl font-bold">
            {t.timeline.title}
          </h2>
          <p className="mt-2 text-xs text-white/40">{t.timeline.hint}</p>
        </div>
        <div className="relative z-10">
          <RadialOrbitalTimeline timelineData={systemsTimeline} />
        </div>
      </section>

      {/* GLOBAL COMMUNICATOR (globe; closes the story the timeline opened) */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-28">
        <Aurora />
        <Reveal>
          <SectionHeading
            eyebrow={t.sections.whereFrom.eyebrow}
            title={t.sections.whereFrom.title}
          >
            {t.sections.whereFrom.intro}
          </SectionHeading>
        </Reveal>

        <Reveal delay={80}>
          <div className="mx-auto mt-12 h-[300px] w-full max-w-md sm:h-[360px]">
            <GlobeViz className="h-full w-full" />
          </div>
          <p className="mt-2 text-center text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            {t.globeCaption}
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {whereFrom.map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <div
                className={cn(
                  NEUMORPHIC,
                  "group h-full p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-zinc-500/20",
                )}
              >
                <div
                  className="float-slow mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-700/10 text-zinc-700 dark:bg-zinc-300/10 dark:text-zinc-300"
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <item.icon className="h-6 w-6" />
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
            {languageBadges.map((lang) => (
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
              {t.footer.location}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 sm:justify-start">
              <BadgeCheck className="h-3.5 w-3.5" />
              {t.footer.citizenship}
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
          © {new Date().getFullYear()} Santiago Aguilar Mello. {t.footer.builtWith}
        </p>
      </footer>
    </main>
  );
}
