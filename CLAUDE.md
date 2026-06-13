@AGENTS.md

# Portfolio — Component Inventory & Recruiter Website Strategy

## Stack
- Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4
- shadcn-compatible component structure at `components/ui/`
- `lib/utils.ts` provides `cn()` (clsx + tailwind-merge)

## UI Components

### `components/ui/info-card.tsx` — Animated Profile Card
**What it does:** Neumorphic profile card with hover animations, online/offline/away status indicator, verified badge, follower count, tags, and Follow/Message CTA buttons. Animated grid background.

**Advantages for recruiter site:**
- Immediately communicates identity, role, and availability at a glance
- The "online" pulse indicator signals active job-seeking status
- Verified badge → trust signal (can represent verified credentials or academic status)
- Follow/Message buttons → direct calls-to-action for LinkedIn or email contact
- Neumorphic design is striking and memorable; differentiates from flat portfolio sites

**Recruiter use cases:**
- Hero / above-the-fold section — first thing a recruiter sees
- Sidebar "about me" widget on any sub-page
- Shareable profile embed for LinkedIn/Notion links
- Status `"online"` → actively hiring / open to work signal; `"away"` → considering offers; `"offline"` → not looking
- `tags` prop → list current tech stack (e.g. "TypeScript", "React", "Python") or badges like "Open to Relocation", "IBDP Grad"
- `followers` → repurpose as GitHub stars total, LinkedIn connections, or years of experience
- `isVerified` + verified badge → link to LinkedIn "Open to Work" or a degree certificate URL
- The two action buttons can deep-link: Follow → LinkedIn connect URL, Message → `mailto:` or WhatsApp

**Props:** `name`, `role`, `status`, `avatar`, `tags`, `isVerified`, `followers`

---

### `components/ui/radial-orbital-timeline.tsx` — Radial Orbital Timeline
**What it does:** Interactive orbital visualization of timeline nodes. Auto-rotates; clicking a node expands a detail card showing status badge, date, description, energy bar, and connected nodes. Clicking canvas resets.

**Advantages for recruiter site:**
- Non-linear experience — recruiters explore rather than scroll, increasing time-on-page
- "Energy level" bar can visualize skill proficiency or project completion
- "Connected nodes" map skill → project → job relationships
- Dark canvas creates strong visual contrast from rest of page; great as a full-screen section
- Status badges (COMPLETE / IN PROGRESS / PENDING) directly communicate where a candidate stands

**Recruiter use cases:**
- Career timeline (education → internships → projects → goals) — the canonical use
- Skills & technologies map: each node = a language/framework, `relatedIds` link co-used skills (e.g. React → TypeScript → Tailwind)
- Project history: each node = a project, `relatedIds` link the skills used; `energy` = completion %
- Certification orbit: each node = a certificate/course; status shows if it's in-progress or completed
- Language proficiency: each node = English/Spanish/Portuguese/Dutch; `energy` = CEFR level mapped to %
- International experience: nodes for countries lived/studied in, linked to academic/work outcomes
- The `category` field can drive color-coding (Education = blue, Projects = green, Skills = purple) with a small legend

**Props:** `timelineData: TimelineItem[]` — each item has `id`, `title`, `date`, `content`, `category`, `icon`, `relatedIds`, `status`, `energy`

---

### `components/ui/link-preview.tsx` — Hover Link Preview
**What it does:** Wraps any anchor link with a hover card showing a live screenshot preview of the destination URL (via Microlink API) or a static image. Smooth spring animations via Framer Motion.

**Advantages for recruiter site:**
- GitHub, LinkedIn, project URLs show a live preview without the recruiter navigating away
- Dramatically reduces friction — recruiters see context before clicking
- Works with both external URLs (auto-screenshot) and static images (for custom previews)
- Subtle, professional interaction that signals technical polish

**Recruiter use cases:**
- Inline links to GitHub repos show a live screenshot so recruiters see the project without leaving
- LinkedIn / portfolio URL previews in bio/about section — proves the links are real
- Project list: each project title is a `LinkPreview` → recruiter hovers and sees the deployed app or README
- Tech blog posts / publications: hover preview of the article without navigating away
- Previous employer / institution links: hover to see the company/school website
- `isStatic` mode lets you supply a custom marketing screenshot instead of the auto-generated one — useful for closed-source projects where the auto-screenshot would show a login wall
- Works anywhere inline text appears: within the orbital timeline expanded cards, in a project grid, or in a prose bio

**Props:** `url`, `children`, `width`, `height`, `quality`, `isStatic` + `imageSrc` (for static mode)

---

## shadcn Primitives
- `components/ui/badge.tsx` — status chips (used inside timeline cards)
- `components/ui/button.tsx` — connected-node navigation buttons
- `components/ui/card.tsx` — expanded node detail cards in the timeline

## Areas of Opportunity (Recruiter Website)
1. **Replace placeholder data** — swap Alex Thompson's info with real data: photo from `_PMA118*.jpg`, role = "CS Student @ Tec de Monterrey", tags = ["Open to Work", "PT/EN/ES/NL"]
2. **GitHub contribution graph** — embed `https://ghchart.rshah.org/sant-mell` as a `<LinkPreview isStatic>` image or full `<img>` section to show coding activity
3. **Projects section** — parse `projects/` folder; each project = a `LinkPreview` card linking to GitHub; use `isStatic` with a screenshot for visual impact
4. **Academic section** — surface `infoTec/` data: GPA, kardex semester summaries, key courses; format as a skills orbit with the radial timeline
5. **Multilingual tags** — use profile card `tags` prop with language flags: ["🇧🇷 PT", "🇬🇧 EN", "🇪🇸 ES", "🇳🇱 NL (basic)"]
6. **International narrative** — the IBDP + Netherlands story is a strong differentiator; a dedicated orbital node or a hero subtitle makes this visible immediately
7. **CV download** — add a button linking to `../CV/cv.pdf` with `target="_blank"`; place it on the profile card's action buttons or as a floating FAB
8. **Dark/light consistency** — info-card supports both; radial timeline is dark-only; use `dark` class on the timeline section's wrapper to force it
9. **Mobile responsiveness** — orbital timeline needs a list-view fallback for mobile; the `viewMode` state stub is already in the component
10. **Recruiter-specific CTA flow** — profile card → "Message" button → pre-filled `mailto:` with subject "Re: Your Portfolio"; "Follow" → LinkedIn connect URL
11. **Live deploy** — push to Vercel with `vercel --prod` for a public URL to share with recruiters; free tier supports this project fully

## Key Dependencies
```
lucide-react, class-variance-authority, @radix-ui/react-slot,
@radix-ui/react-hover-card, qss, framer-motion, clsx, tailwind-merge
```
