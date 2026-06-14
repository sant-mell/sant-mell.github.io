"use client"

import { MessageCircle, UserPlus, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import AnimatedTextCycle from "@/components/ui/animated-text-cycle"
import { LinkPreview } from "@/components/ui/link-preview"

export type ProfileStatus = "online" | "offline" | "away"

export interface ProfileCardProps {
  name: string
  role: string
  status: ProfileStatus
  avatar: string
  tags?: string[]
  isVerified?: boolean
  followers?: number
  /** Label rendered under the follower count (e.g. "public repositories"). */
  followersLabel?: string
  /** UserPlus action, typically a LinkedIn connect URL. */
  connectUrl: string
  /** MessageCircle action, typically a mailto: link. */
  messageUrl: string
}

export interface AnimatedProfileCardProps {
  profile: ProfileCardProps
  /** Optional CV download link rendered as a prominent button below the card. */
  cvUrl?: string
}

export default function AnimatedProfileCard({
  profile,
  cvUrl,
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

      {/* Cycling tagline */}
      <h1 className="relative z-10 whitespace-nowrap px-2 text-center font-light leading-tight text-zinc-600 dark:text-zinc-300 text-[clamp(1rem,4.8vw,3rem)]">
        Santiago is a{" "}
        <AnimatedTextCycle
          words={[
            "CS Student",
            "Cybersecurity enthusiast",
            "CCNA candidate",
            "Network engineer",
            "Polyglot",
            "Global citizen",
            "Problem solver",
          ]}
          interval={2600}
          className="gradient-text"
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
            Download CV (PDF)
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
  followers,
  followersLabel = "followers",
  connectUrl,
  messageUrl,
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
              style={{ objectPosition: "center 18%" }}
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

        {typeof followers === "number" && (
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500 transition-all duration-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 group-hover:font-medium">
            {followers.toLocaleString()} {followersLabel}
          </p>
        )}
      </div>

      {/* Tags with bounce animation */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2 relative z-10">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-block rounded-full bg-white dark:bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] transition-all duration-300 group-hover:scale-105",
                tag === "Open to Work" &&
                  "text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-100dark:group-hover:bg-zinc-800/30 group-hover:shadow-[0_0_10px_rgba(113,113,122,0.3)]",
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
          <UserPlus className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" aria-hidden="true" />
          <span className="sr-only">Connect on LinkedIn</span>
        </LinkPreview>
        <a
          href={messageUrl}
          aria-label="Send an email"
          className="flex-1 rounded-full bg-white dark:bg-zinc-700 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-800"
        >
          <MessageCircle className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" aria-hidden="true" />
        </a>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-3xl border border-zinc-300 dark:border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  )
}
