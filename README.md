# Santiago Aguilar Mello, Portfolio (`sant-mell.github.io`)

Personal portfolio site built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. It is a central hub for my resume, academic background at Tec de Monterrey, and hands-on projects, aimed at cybersecurity, network engineering, and Cisco CCNA roles.

Live site: https://sant-mell.github.io  ·  CV: [`/cv.pdf`](public/cv.pdf)  ·  Email: sant.mell016@gmail.com

## About

- Native Portuguese and Spanish, English C2, Dutch A1. Sao Paulo roots, IB Diploma in Rotterdam, Computer Science in Mexico City.
- 4th semester Computer Science and Technology (ITC) student at Tec de Monterrey, Campus Santa Fe, based in Huixquilucan.
- Open to work, including remote and global roles. Targeting cybersecurity, network engineering, and the Cisco CCNA track.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, grayscale neumorphic theme |
| Animation | Framer Motion, scroll reveals, animated gradients |
| 3D / Shaders | three.js and @react-three/fiber (interactive globe), @paper-design/shaders-react (animated background) |
| Deployment | GitHub Pages and Netlify (static export) |

## Sections

1. Hero, animated profile card with status, verified badge, tags, LinkedIn and email actions, and a CV download.
2. Where I'm from, an interactive three.js globe marking Sao Paulo, Rotterdam, and Mexico City, plus flag cards and language proficiency.
3. On GitHub, a live GitHub contribution chart with a hover link preview.
4. Projects, a project grid with live "Play in browser" demos and links to each public repository.
5. My path so far, an interactive radial orbital timeline over an animated grayscale shader background.
6. Experience, teaching and mentoring roles across Mexico and the Netherlands.
7. Leadership and Coursework.
8. Academics, GPA and other metrics.
9. Skills, grouped into Systems and Dev, Tools and IoT, and Languages.
10. Certifications and awards, with a linked Common Purpose credential.

## Projects

| Project | Stack | Notes |
| --- | --- | --- |
| IoT Smart Parking System | ESP32, MQTT, Python | Occupancy detection, automated barrier control, and cloud telemetry. |
| Aquaroute (START Hack) | SaaS, algorithm design | Routes water trucks to water-stressed areas using satellite data and a weighted Dijkstra variation. |
| The Fool's Descent (TC2005B) | JavaScript, HTML5 Canvas, Node/Express, MySQL | 8-credit flagship team game. Repo: [`videoGame-TC2005B.501`](https://github.com/sant-mell/videoGame-TC2005B.501) |
| DFA Lexer / Compiler | Python, automata theory | A DFA lexer and a parallel syntax highlighter, benchmarked against a sequential baseline. |
| Data Structures in C++ | C++ | BSTs, AVL trees, heaps, graphs, and Dijkstra with complexity analysis. |
| Next.js Portfolio | Next.js 16, React 19, Tailwind 4 | This site. |

## Experience

- English Language Teacher, Pro English BV, Rotterdam (Jul 2025 to present).
- Computer Science Instructor, Logaritmia MX (Jan 2025 to May 2025).
- Volunteer and Peer Mentor, Tec de Monterrey (2024 to present).
- Media Logistics Assistant, DPG Media Nederland (Jun 2022 to Aug 2022).

## Local Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Deployment

The site builds to a static export (`output: "export"` in next.config.ts, `images.unoptimized: true`).

- GitHub Pages: `.github/workflows/deploy.yml` builds and publishes `./out` on every push to `main`. Set Settings, Pages, Source to GitHub Actions. `public/.nojekyll` keeps the `_next/` directory intact.
- Netlify: `netlify.toml` sets the build command to `npm run build` and the publish directory to `out`.

## Contact

- Email: sant.mell016@gmail.com
- GitHub: [github.com/sant-mell](https://github.com/sant-mell)
- LinkedIn: [santiago-aguilar](https://www.linkedin.com/in/santiago-aguilar-b1702a270/)
