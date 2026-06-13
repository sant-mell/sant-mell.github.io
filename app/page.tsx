"use client";

import type { ComponentType, ReactNode } from "react";
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
  Terminal,
} from "lucide-react";
import AnimatedProfileCard, {
  type ProfileCardProps,
} from "@/components/ui/info-card";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { LinkPreview } from "@/components/ui/link-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Constants & strict data interfaces
 * ------------------------------------------------------------------------- */

const LINKEDIN_URL =
  "https://www.linkedin.com/in/santiago-aguilar-b1702a270/";
const GITHUB_URL = "https://github.com/sant-mell";
const EMAIL = "a01753684@tec.mx";
const MAILTO_URL = `mailto:${EMAIL}`;
const CV_URL = "/cv.pdf";

const profile: ProfileCardProps = {
  name: "Santiago Aguilar Mello",
  role: "CS Engineering @ Tec de Monterrey · Systems & Security Focus",
  status: "online",
  avatar: "/profile.jpg",
  tags: ["Open to Work", "Cybersecurity", "CCNA Track", "ITC · Tec MTY"],
  isVerified: true,
  followers: 92,
  followersLabel: "GitHub repositories",
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
    title: "IBDP — Netherlands",
    date: "2021–2023",
    content:
      "Completed the International Baccalaureate Diploma Programme in the Netherlands. Cross-cultural adaptability and communication readiness for global, distributed NOC and remote incident-response teams.",
    category: "Education",
    icon: Globe,
    relatedIds: [2, 3],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Tec de Monterrey @ CEM",
    date: "2023–2025",
    content:
      "Began the Computer Science & Technology (ITC) degree at Campus Estado de México, building the algorithmic and systems foundation that underpins secure software and network engineering.",
    category: "Education",
    icon: GraduationCap,
    relatedIds: [1, 3, 4],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Polyglot — PT / EN / ES / NL",
    date: "Ongoing",
    content:
      "Native Portuguese, English C2, Spanish C2, Dutch A2. A strategic asset for global distributed teams — communication readiness across the time zones a modern NOC or security operations centre spans.",
    category: "Skills",
    icon: Languages,
    relatedIds: [1, 2],
    status: "completed",
    energy: 95,
  },
  {
    id: 4,
    title: "Campus Santa Fe Transfer",
    date: "Aug 2025",
    content:
      "Transferred to Tec de Monterrey Campus Santa Fe (CDMX) to continue the ITC degree, stepping into the cohort focused on systems architecture, security, and applied engineering.",
    category: "Education",
    icon: MapPin,
    relatedIds: [2, 5],
    status: "completed",
    energy: 100,
  },
  {
    id: 5,
    title: "Systems Architecture & Compilers",
    date: "2025",
    content:
      "Deep architectural and systems-level understanding: built a DFA-based lexer and a parallel syntax highlighter, plus an assembly simulator. The machine layer — exactly the parsing and memory knowledge secure code and deep packet inspection demand.",
    category: "Projects",
    icon: Cpu,
    relatedIds: [4, 6],
    status: "completed",
    energy: 90,
  },
  {
    id: 6,
    title: "Flagship Game Dev & Networking Basics",
    date: "2026",
    content:
      "Leading an 8-credit flagship project (The Fool's Descent) with a full-stack client/server architecture, while building foundational networking knowledge toward Cisco-track certification.",
    category: "Projects",
    icon: Network,
    relatedIds: [4, 5, 7],
    status: "in-progress",
    energy: 65,
  },
  {
    id: 7,
    title: "Target: CCNA & Cybersecurity Internship",
    date: "2026+",
    content:
      "Actively pursuing the Cisco CCNA certification and a cybersecurity / network engineering internship — remote global infrastructure, incident response, and security operations roles.",
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
    title: "DFA Lexer / Compiler",
    subtitle: "Python · Automata Theory",
    description:
      "Automata theory and parallel processing. Demonstrates the low-level parsing logic essential for writing secure code and deep packet inspection — a DFA-driven lexer with a parallel syntax highlighter benchmarked against a sequential baseline.",
    stack: ["Python", "Multiprocessing", "Automata / DFA", "Benchmarking"],
    repoUrl: GITHUB_URL,
  },
  {
    title: "MARIE.js",
    subtitle: "TypeScript · Assembly Simulator",
    description:
      "Web-based assembly simulator. Proves foundational knowledge of instruction sets and memory architecture — critical for reverse engineering and vulnerability research where you reason at the level of the machine, not the framework.",
    stack: ["TypeScript", "Assembly (MARIE ISA)", "Web", "Computer Architecture"],
    repoUrl: GITHUB_URL,
  },
  {
    title: "The Fool's Descent — TC2005B",
    subtitle: "JavaScript · Node · MySQL",
    description:
      "8-credit flagship project proving complex OOP, state management, and strict version control in a team environment. A roguelike card game with an HTML5 Canvas client, an Express API, and a MySQL persistence layer with stored procedures and triggers.",
    stack: ["JavaScript", "HTML5 Canvas", "Node.js / Express", "MySQL", "Git"],
    repoUrl: "https://github.com/sant-mell/videoGame-TC2005B.501",
  },
  {
    title: "Next.js Portfolio",
    subtitle: "Next.js 16 · React 19",
    description:
      "Modern web architecture featuring React 19, Tailwind 4, and server-side optimizations. Neumorphic UI, an interactive radial career orbit, and live link previews — this very site.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"],
    repoUrl: GITHUB_URL,
  },
];

interface Metric {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
}

const metrics: Metric[] = [
  {
    label: "GPA",
    value: "92.8",
    detail: "out of 100 · cumulative",
    icon: Award,
  },
  {
    label: "Credits",
    value: "61+",
    detail: "completed toward ITC",
    icon: BookOpen,
  },
  {
    label: "Trajectory",
    value: "4th Sem",
    detail: "ITC · Tec de Monterrey",
    icon: TrendingUp,
  },
  {
    label: "Peak Performance",
    value: "99.0",
    detail: "Intersemester · 96.3 in Sem 3",
    icon: Terminal,
  },
];

interface SkillCluster {
  title: string;
  icon: ComponentType<{ className?: string }>;
  skills: string[];
}

const skillClusters: SkillCluster[] = [
  {
    title: "Systems & Dev",
    icon: Cpu,
    skills: [
      "Python",
      "TypeScript",
      "C#",
      "Next.js",
      "React",
      "SQL",
      "Git",
      "Linux / Bash Basics",
      "Racket",
    ],
  },
  {
    title: "Languages & Comm",
    icon: Languages,
    skills: [
      "Portuguese (Native)",
      "English (C2)",
      "Spanish (C2)",
      "Dutch (A2)",
    ],
  },
];

/* ----------------------------------------------------------------------------
 * Small inline brand marks (lucide v1 dropped brand icons)
 * ------------------------------------------------------------------------- */

function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

function LinkedinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
 * Reusable section primitives
 * ------------------------------------------------------------------------- */

const NEUMORPHIC =
  "rounded-3xl bg-gray-100 dark:bg-gray-800 shadow-[12px_12px_24px_rgba(0,0,0,0.12),-12px_-12px_24px_rgba(255,255,255,0.9)] dark:shadow-[12px_12px_24px_rgba(0,0,0,0.4),-12px_-12px_24px_rgba(255,255,255,0.04)]";

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
      <p className="text-xs font-mono uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {children && (
        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
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
    <main className="bg-gray-100 dark:bg-gray-900">
      {/* A — HERO -------------------------------------------------------- */}
      <section>
        <AnimatedProfileCard profile={profile} cvUrl={CV_URL} />
      </section>

      {/* B — THE GLOBAL COMMUNICATOR ------------------------------------ */}
      <section className="px-4 py-24 sm:py-28">
        <SectionHeading eyebrow="The Global Communicator" title="Built for distributed, global teams">
          From a Brazilian-Portuguese household, through the IBDP in the
          Netherlands, to Computer Science in Mexico City — an international
          trajectory that maps directly onto the realities of a 24/7 global NOC.
        </SectionHeading>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              flag: "🇧🇷",
              title: "Brazilian Roots",
              body: "Native Portuguese speaker with a multicultural foundation and an early international mindset.",
            },
            {
              flag: "🇳🇱",
              title: "IBDP · Netherlands",
              body: "Completed the International Baccalaureate in an English-language, multinational cohort — rigour and cross-cultural fluency.",
            },
            {
              flag: "🇲🇽",
              title: "CS · Mexico City",
              body: "Pursuing Computer Science & Technology at Tec de Monterrey, Campus Santa Fe.",
            },
          ].map((item) => (
            <div key={item.title} className={cn(NEUMORPHIC, "p-6 text-center")}>
              <div className="text-4xl">{item.flag}</div>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          {[
            "🇧🇷 Portuguese — Native",
            "🇬🇧 English — C2",
            "🇪🇸 Spanish — C2",
            "🇳🇱 Dutch — A2",
          ].map((lang) => (
            <Badge
              key={lang}
              variant="secondary"
              className="px-4 py-1.5 text-sm shadow-sm"
            >
              {lang}
            </Badge>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm italic text-gray-500 dark:text-gray-500">
          Cross-cultural adaptability and communication readiness for global,
          distributed NOC or remote incident-response teams.
        </p>
      </section>

      {/* C — PROOF OF CONSISTENCY (GitHub) ------------------------------ */}
      <section className="px-4 py-24 sm:py-28">
        <SectionHeading eyebrow="Proof of Consistency" title="Shipping code, consistently">
          A public commit history is the most honest signal of an engineer&apos;s
          momentum. Hover the link to preview the profile.
        </SectionHeading>

        <div className={cn(NEUMORPHIC, "mx-auto mt-12 max-w-3xl p-6 sm:p-8")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ghchart.rshah.org/4a90d9/sant-mell"
            alt="GitHub contributions for sant-mell"
            className="w-full max-w-3xl mx-auto rounded-md shadow-sm dark:invert"
          />
        </div>

        <div className="mt-8 text-center">
          <LinkPreview
            url={GITHUB_URL}
            className="inline-flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-4"
          >
            <GithubMark className="h-4 w-4" />
            github.com/sant-mell
          </LinkPreview>
        </div>
      </section>

      {/* D — ENGINEERING SHOWCASE --------------------------------------- */}
      <section className="px-4 py-24 sm:py-28">
        <SectionHeading eyebrow="Engineering Showcase" title="Selected projects">
          From the machine layer up — parsers, simulators, full-stack systems,
          and modern web architecture.
        </SectionHeading>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.title}
              className={cn(
                NEUMORPHIC,
                "flex flex-col border-none p-2 transition-transform duration-300 hover:-translate-y-1",
              )}
            >
              <CardHeader>
                <p className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  {project.subtitle}
                </p>
                <CardTitle className="mt-1 text-xl text-gray-900 dark:text-white">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="mt-5">
                  <LinkPreview
                    url={project.repoUrl}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-4"
                  >
                    <GithubMark className="h-4 w-4" />
                    View on GitHub
                  </LinkPreview>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* E — SYSTEMS TIMELINE (dark island) ----------------------------- */}
      <section className="dark relative bg-black">
        <div className="absolute top-0 left-0 right-0 z-10 pt-8 text-center pointer-events-none">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-white/50">
            Systems Timeline
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white/90">
            From IBDP to the CCNA track
          </h2>
          <p className="mt-2 text-xs text-white/40">
            Click a node to explore the trajectory
          </p>
        </div>
        <RadialOrbitalTimeline timelineData={systemsTimeline} />
      </section>

      {/* F — ACADEMIC METRICS ------------------------------------------- */}
      <section className="px-4 py-24 sm:py-28">
        <SectionHeading eyebrow="Academic Metrics" title="Measured, consistent performance" />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className={cn(NEUMORPHIC, "p-6")}>
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {metric.label}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {metric.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* G — TECHNICAL ARSENAL ------------------------------------------ */}
      <section className="px-4 py-24 sm:py-28">
        <SectionHeading eyebrow="Technical Arsenal" title="Tools & languages" />

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          {skillClusters.map((cluster) => {
            const Icon = cluster.icon;
            return (
              <div key={cluster.title} className={cn(NEUMORPHIC, "p-7")}>
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-blue-600/10 p-2 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {cluster.title}
                  </h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {cluster.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1 text-sm shadow-sm"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* H — FOOTER ----------------------------------------------------- */}
      <footer className="border-t border-gray-200 dark:border-gray-800 px-4 py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-gray-900 dark:text-white">
              Santiago Aguilar Mello
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              CS Engineering · Cybersecurity &amp; CCNA Track
            </p>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={MAILTO_URL}
              aria-label="Email Santiago"
              className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <GithubMark className="h-5 w-5" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <LinkedinMark className="h-5 w-5" />
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} Santiago Aguilar Mello · Built with Next.js
          16, React 19 &amp; Tailwind CSS 4.
        </p>
      </footer>
    </main>
  );
}
