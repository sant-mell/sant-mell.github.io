"use client";

import { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

// Grayscale animated mesh gradient used as the page-wide background.
export default function ShaderBackground({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("absolute inset-0 bg-black", className)} aria-hidden="true" />;
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <MeshGradient
        className="h-full w-full"
        colors={["#000000", "#1a1a1a", "#333333", "#52525b"]}
        speed={0.4}
      />
    </div>
  );
}
