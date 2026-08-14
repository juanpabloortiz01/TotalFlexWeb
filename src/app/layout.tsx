import type { Metadata } from "next";
import { Bebas_Neue, Inter, Barlow } from "next/font/google";
import "./globals.css";

// ── FUENTES ──────────────────────────────────────────────────
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",          // Bebas Neue solo tiene una variante
  variable: "--font-bebas",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

// Barlow Black — fuente ancha de alto impacto para el título del Hero
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["900"],          // Black — máximo peso para letras anchas
  variable: "--font-barlow",
  display: "swap",
  preload: true,
});

// ── SEO & METADATA ───────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "TotalFlexGym — El Gimnasio Más Grande de Loja",
    template: "%s | TotalFlexGym Loja",
  },
  description:
    "El centro de entrenamiento más completo de Loja, Ecuador. 9 disciplinas: Pesas, Box, MMA, Jiujitsu, Spinning, Funcional, Pilates, Calistenia y Bailoterapia. Inscríbete en línea.",
  keywords: [
    "gimnasio Loja",
    "gym Loja Ecuador",
    "TotalFlexGym",
    "MMA Loja",
    "box Loja",
    "spinning Loja",
    "membresía gimnasio",
    "inscripción gimnasio",
    "jiujitsu Loja",
    "musculación Loja",
  ],
  authors: [{ name: "TotalFlexGym" }],
  creator: "TotalFlexGym",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://totalflexgym.com.ec"
  ),
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "/",
    siteName: "TotalFlexGym",
    title: "TotalFlexGym — El Gimnasio Más Grande de Loja",
    description:
      "Entrena en Loja con los mejores. 9 disciplinas, equipos de última generación. Membresías desde el primer día.",
    // images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TotalFlexGym — El Gimnasio Más Grande de Loja",
    description:
      "Entrena en Loja con los mejores. 9 disciplinas, equipos de última generación.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// ── ROOT LAYOUT ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark ${bebasNeue.variable} ${inter.variable} ${barlow.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconexión a Google Fonts para reducir latencia */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Viewport Mobile-First */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Color del navegador móvil */}
        <meta name="theme-color" content="#09090B" />
        <meta name="msapplication-TileColor" content="#09090B" />
      </head>
      <body className="bg-brand-black text-brand-white antialiased">
        {children}
      </body>
    </html>
  );
}
