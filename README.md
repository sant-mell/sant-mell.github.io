# Santiago Aguilar Mello — Portfolio (`sant-mell.github.io`)

Personal portfolio website built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It serves as a central hub for my resume, academic background at Tec de Monterrey, and hands-on projects — tailored toward **systems engineering, cybersecurity, and networking (Cisco / CCNA)** roles.

🔗 **Live site:** https://sant-mell.github.io · **CV:** [`/cv.pdf`](public/cv.pdf)

---

## About

- 🇧🇷 Brazilian-Portuguese background · 🇳🇱 IBDP in the Netherlands (2021–2023) · 🇲🇽 CS in Mexico City
- 4th-semester **Computer Science & Technology (ITC)** student at **Tec de Monterrey, Campus Santa Fe**
- Cross-cultural, multilingual, and oriented toward global distributed / remote infrastructure teams
- **Open to work** — targeting Cybersecurity, Network Engineering, and the **Cisco CCNA** track

**Languages:** Portuguese (Native) · English (C2) · Spanish (C2) · Dutch (A2)

**Academic metrics:** GPA **92.8 / 100** · **61+** credits completed · peak **96.3** (Semester 3) and **99.0** (Intersemester)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) & React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| UI | Radix UI primitives / shadcn-style components, lucide-react icons |
| Deployment | GitHub Pages (static export via GitHub Actions) |

---

## Site Sections

1. **Hero** — animated neumorphic profile card (status, verified badge, repo count, tags) with LinkedIn / email actions and a CV download button.
2. **The Global Communicator** — international background (🇧🇷 🇳🇱 🇲🇽) and multilingual proficiency framed for global teams.
3. **Proof of Consistency** — live GitHub contribution chart with a hover link preview.
4. **Engineering Showcase** — project grid with tech-stack badges and GitHub link previews.
5. **Systems Timeline** — interactive radial-orbital visualization from IBDP through to the CCNA / cybersecurity target (dark contrast section).
6. **Academic Metrics** — GPA, credits, trajectory, and peak performance.
7. **Technical Arsenal** — Systems & Dev and Languages & Communication skill clusters.
8. **Footer** — email, GitHub, and LinkedIn links.

---

## Project Highlights Included

| Project | Stack | Framing |
| --- | --- | --- |
| **DFA Lexer / Compiler** | Python (parallel + sequential), Automata Theory | A DFA-driven lexer and parallel syntax highlighter, benchmarked against a sequential baseline. Low-level parsing logic relevant to secure code and deep packet inspection. |
| **MARIE.js** | TypeScript, MARIE ISA | A web-based assembly-language simulator demonstrating instruction sets and memory architecture — foundational for reverse engineering and vulnerability research. |
| **The Fool's Descent (TC2005B)** | JavaScript, HTML5 Canvas, Node.js / Express, MySQL | 8-credit flagship **team** project: a roguelike card game with a Canvas client, an Express API, and a MySQL persistence layer (stored procedures, triggers, views). Proves OOP, state management, and strict version control. Repo: [`videoGame-TC2005B.501`](https://github.com/sant-mell/videoGame-TC2005B.501) |
| **Next.js Portfolio** | Next.js 16, React 19, TypeScript, Tailwind 4 | This site — modern web architecture with static-export optimizations. |

> Note: The TC2005B game is implemented in **JavaScript / HTML5 Canvas + Node/Express/MySQL** (not Unity/C#), matching the actual project repository.

---

## Key Features

- **Interactive radial-orbital timeline** tracking the international academic journey (Brazil → Netherlands → Mexico) toward the CCNA / cybersecurity goal.
- **Live GitHub activity** chart with hover link previews.
- **Neumorphic UI** with full dark-mode support and a responsive, fast-loading layout.

---

## Local Development

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # static export to ./out
npm run lint
```

---

## Deployment

This is a **`username.github.io` user site** deployed via **GitHub Pages + GitHub Actions**:

- `next.config.ts` sets `output: "export"` and `images.unoptimized: true` (no Image Optimization server on static hosts).
- `.github/workflows/deploy.yml` builds the static export and publishes `./out` on every push to `main`.
- `public/.nojekyll` prevents GitHub Pages from stripping the `_next/` asset directory.

To enable: in the repository **Settings → Pages**, set **Source** to **GitHub Actions**.

---

## Contact

- **Email:** a01753684@tec.mx
- **GitHub:** [github.com/sant-mell](https://github.com/sant-mell)
- **LinkedIn:** [santiago-aguilar](https://www.linkedin.com/in/santiago-aguilar-b1702a270/)
