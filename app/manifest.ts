import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Santiago Aguilar Mello | Embedded, Full-Stack & Systems",
    short_name: "Santiago Aguilar Mello",
    description:
      "Portfolio of Santiago Aguilar Mello, Computer Science (ITC) student at Tec de Monterrey, building embedded/IoT systems, full-stack apps, and parallel software. Studying for the Cisco CCNA and moving into cybersecurity.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/profile.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
