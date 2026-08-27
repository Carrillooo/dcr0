import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/lib/smooth";
import { CanvasRoot } from "@/components/canvas/CanvasRoot";
import { Nav } from "@/components/ui/Nav";
import { Menu } from "@/components/ui/Menu";
import { Cursor } from "@/components/ui/Cursor";
import { Loader } from "@/components/ui/Loader";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { Footer } from "@/components/ui/Footer";
import { RouteTransition } from "@/components/ui/RouteTransition";

/* Display: a grotesque with enough width and weight to be set very large and
   still hold its counters. UI: IBM Plex Sans — drawn for engineering documents,
   which is exactly the register. Data: Plex Mono for every technical value.
   Deliberately not Inter or Roboto, which are the default-by-reflex choices. */

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dcro.example"),
  title: {
    default: "DCRO — Automotive Redefined",
    template: "%s — DCRO",
  },
  description:
    "DCRO engineers automotive accessories to component standards. Machined, tested and fitted to your vehicle.",
  openGraph: {
    title: "DCRO — Automotive Redefined",
    description: "Automotive accessories engineered to component standards.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${plex.variable} ${plexMono.variable}`}>
      <body className="grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-paper focus:px-4 focus:py-2 focus:text-ground"
        >
          Skip to content
        </a>

        <SmoothScroll>
          {/* One canvas above the router outlet — routes swap the scene inside
              it, never the canvas itself. */}
          <CanvasRoot />
          <Loader />
          <Nav />
          <Menu />
          <Cursor />
          <SoundToggle />
          <RouteTransition />
          <main id="main" className="relative z-10">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
