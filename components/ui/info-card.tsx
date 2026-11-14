"use client"

import { Download, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GooeyText } from "@/components/ui/gooey-text-morphing"
import { LinkPreview } from "@/components/ui/link-preview"

/** LinkedIn brand mark (lucide v1 dropped brand icons). */
function LinkedinMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

export interface ProfileCardProps {
  name: string
  role: string
  avatar: string
  tags?: string[]
  /** LinkedIn connect action, rendered as the LinkedIn logo button. */
  connectUrl: string
  /** Email action, a mailto: link. */
  messageUrl: string
  /** WhatsApp chat link (wa.me). */
  whatsappUrl?: string
  /** Phone call link (tel:). */
  phoneUrl?: string
  /** Localized labels for screen readers. */
  labels?: { email: string; whatsapp: string; call: string }
}

export interface AnimatedProfileCardProps {
  profile: ProfileCardProps
  /** Optional CV download link rendered as a prominent button below the card. */
  cvUrl?: string
  /** Localized "Santiago is a" lead-in for the morphing tagline. */
  taglinePrefix?: string
  /** Localized roles cycled by the morphing tagline. */
  roles?: string[]
  /** Localized label for the CV download button. */
  cvLabel?: string
}

/** WhatsApp brand mark (lucide has no brand icons). */
function WhatsappMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35ZM12.04 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.43-9.44 9.43Zm8.04-17.47A11.3 11.3 0 0 0 12.04.7C5.77.7.67 5.8.67 12.06c0 2 .52 3.96 1.52 5.68L.57 23.6l6-1.57a11.33 11.33 0 0 0 5.46 1.39h.01c6.26 0 11.36-5.1 11.37-11.36 0-3.04-1.18-5.89-3.33-8.03Z" />
    </svg>
  )
}

export default function AnimatedProfileCard({
  profile,
  cvUrl,
  taglinePrefix = "Santiago is a",
  roles = [
    "CS Student",
    "Full-stack developer",
    "CCNA student",
    "Systems & IoT developer",
    "Polyglot",
  ],
  cvLabel = "Download CV (PDF)",
}: AnimatedProfileCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center w-full justify-center gap-8 p-4 relative overflow-hidden">
      {/* Animated Grid Background (decorative; hidden when reduced motion is preferred) */}
      <div className="absolute inset-0 opacity-20 motion-reduce:hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent"
          style={{
            backgroundImage: `
              linear-gradient(rgba(156, 163, 175, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(156, 163, 175, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            animation: "gridMove 20s linear infinite",
          }}
        />
      </div>

      {/* Morphing tagline */}
      <h1 className="relative z-10 flex flex-col items-center gap-3 px-2 text-center">
        <span className="font-light leading-tight text-zinc-600 dark:text-zinc-300 text-[clamp(1rem,4.8vw,2.25rem)]">
          {taglinePrefix}
        </span>
        <GooeyText
          texts={roles}
          morphTime={1}
          cooldownTime={1.4}
          className="flex h-14 w-full items-center justify-center sm:h-20"
          textClassName="text-[clamp(1.5rem,6vw,3rem)] font-bold text-zinc-900 dark:text-white whitespace-nowrap"
        />
      </h1>

      <ProfileCard {...profile} />


      {cvUrl && (
        <Button
          asChild
          size="lg"
          className="relative z-10 rounded-full px-8 shadow-lg shadow-zinc-600/20 transition-transform hover:scale-105 active:scale-95"
        >
          <a href={cvUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            {cvLabel}
          </a>
        </Button>
      )}

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
    </div>
  )
}

function ProfileCard({
  name,
  role,
  avatar,
  tags = [],
  connectUrl,
  messageUrl,
  whatsappUrl,
  phoneUrl,
  labels = { email: "Email", whatsapp: "WhatsApp", call: "Call" },
}: ProfileCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-800 p-6 w-80 shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.9)] dark:shadow-[12px_12px_24px_rgba(0,0,0,0.3),-12px_-12px_24px_rgba(255,255,255,0.1)] transition-all duration-500 hover:shadow-[20px_20px_40px_rgba(0,0,0,0.2),-20px_-20px_40px_rgba(255,255,255,1)] dark:hover:shadow-[20px_20px_40px_rgba(0,0,0,0.4),-20px_-20px_40px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2">

      {/* Profile Photo with enhanced hover effects */}
      <div className="mb-4 flex justify-center relative z-10">
        <div className="relative group-hover:animate-pulse">
          <div className="h-28 w-28 overflow-hidden rounded-full bg-white dark:bg-zinc-700 p-1 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.3),inset_-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-8px_-8px_16px_rgba(255,255,255,1)] dark:group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.4),inset_-8px_-8px_16px_rgba(255,255,255,0.15)] group-hover:scale-110">
            <img
              src={avatar}
              alt={name}
              style={{ objectPosition: "center" }}
              className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Glowing ring on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-zinc-300 dark:border-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
        </div>
      </div>

      {/* Profile Info with slide-up animation */}
      <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
          {name}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
          {role}
        </p>
      </div>

      {/* Tags with bounce animation */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2 relative z-10">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-block rounded-full bg-white dark:bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(113,113,122,0.3)]",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-2 relative z-10">
        <LinkPreview
          url={connectUrl}
          className="flex flex-1 items-center justify-center rounded-full bg-white dark:bg-zinc-700 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-zinc-100dark:group-hover:bg-zinc-800/30"
        >
          <LinkedinMark className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
          <span className="sr-only">Connect on LinkedIn</span>
        </LinkPreview>
        <a
          href={messageUrl}
          aria-label={labels.email}
          className="flex-1 rounded-full bg-white dark:bg-zinc-700 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-800"
        >
          <Mail className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" aria-hidden="true" />
        </a>
        {whatsappUrl && (
        <a
          href={whatsappUrl}
          aria-label={labels.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full bg-white dark:bg-zinc-700 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-800"
        >
          <WhatsappMark className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
        </a>
        )}
        {phoneUrl && (
        <a
          href={phoneUrl}
          aria-label={labels.call}
          className="flex-1 rounded-full bg-white dark:bg-zinc-700 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-800"
        >
          <Phone className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" aria-hidden="true" />
        </a>
        )}
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-3xl border border-zinc-300 dark:border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  )
}
