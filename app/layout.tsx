import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://sant-mell.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Santiago Aguilar Mello | Cybersecurity & Network Engineering (CCNA)",
    template: "%s | Santiago Aguilar Mello",
  },
  description:
    "Multicultural Computer Science (ITC) student at Tec de Monterrey, Campus Santa Fe, focused on cybersecurity, network engineering, and Cisco CCNA. Native Portuguese and Spanish, English C2. Open to work, including remote and global roles.",
  keywords: [
    "Santiago Aguilar Mello",
    "cybersecurity",
    "network engineering",
    "Cisco CCNA",
    "CCNA",
    "network security",
    "computer science student",
    "ITC",
    "Tec de Monterrey",
    "Tecnologico de Monterrey",
    "Campus Santa Fe",
    "Mexico City",
    "Zona Esmeralda",
    "Estado de Mexico",
    "soft skills",
    "multilingual",
    "open to work",
    "remote",
  ],
  authors: [{ name: "Santiago Aguilar Mello", url: siteUrl }],
  creator: "Santiago Aguilar Mello",
  publisher: "Santiago Aguilar Mello",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Santiago Aguilar Mello",
    title:
      "Santiago Aguilar Mello | Cybersecurity & Network Engineering (CCNA)",
    description:
      "Computer Science (ITC) student at Tec de Monterrey, Campus Santa Fe, targeting cybersecurity, network engineering, and Cisco CCNA roles. Multilingual, open to remote and global work.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Santiago Aguilar Mello, cybersecurity and network engineering student",
      },
      {
        url: "/profile.jpg",
        alt: "Santiago Aguilar Mello",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Santiago Aguilar Mello | Cybersecurity & Network Engineering (CCNA)",
    description:
      "Computer Science (ITC) student at Tec de Monterrey targeting cybersecurity, network engineering, and Cisco CCNA roles. Open to remote and global work.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/profile.jpg",
  },
  manifest: "/manifest.webmanifest",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Santiago Aguilar Mello",
  url: siteUrl,
  image: `${siteUrl}/profile.jpg`,
  email: "mailto:sant.mell016@gmail.com",
  jobTitle: "Computer Science (ITC) Student",
  description:
    "Multicultural Computer Science (ITC) student targeting cybersecurity, network engineering, and Cisco CCNA roles. Open to work, including remote and global.",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Tec de Monterrey, Campus Santa Fe",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Zona Esmeralda",
    addressRegion: "Estado de Mexico",
    addressCountry: "MX",
  },
  knowsLanguage: ["Portuguese", "Spanish", "English", "Dutch"],
  knowsAbout: [
    "Cybersecurity",
    "Network Engineering",
    "Network Security",
    "Cisco CCNA",
    "Computer Science",
  ],
  seeks: {
    "@type": "Demand",
    name: "Cybersecurity, network engineering, and Cisco CCNA roles",
  },
  sameAs: [
    "https://github.com/sant-mell",
    "https://www.linkedin.com/in/santiago-aguilar-b1702a270/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
