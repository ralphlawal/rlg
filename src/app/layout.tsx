import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/content/site";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ralph Lawal Group · Software, Apps and AI, Built in Dublin",
    template: "%s · Ralph Lawal Group",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IE",
    url: site.url,
  },
  twitter: { card: "summary_large_image", site: site.social.x.handle },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/**
 * Runs before first paint so the saved theme applies with no flash.
 * Light is the default; a saved choice wins. Kept tiny and dependency-free.
 */
const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");var t="light";try{var s=localStorage.getItem("rlg-theme");if(s==="dark"||s==="light")t=s}catch(e){}d.dataset.theme=t})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IE"
      data-theme="light"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <RevealObserver />
        {/* Cookieless visit counts (Vercel Web Analytics); only active on the Vercel deployment. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
