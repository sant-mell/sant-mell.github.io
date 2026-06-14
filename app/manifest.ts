import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Santiago Aguilar Mello | Cybersecurity & Network Engineering",
    short_name: "Santiago Aguilar Mello",
    description:
      "Portfolio of Santiago Aguilar Mello, Computer Science (ITC) student at Tec de Monterrey targeting cybersecurity, network engineering, and Cisco CCNA roles.",
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
