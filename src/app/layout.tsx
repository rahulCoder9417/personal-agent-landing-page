import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Geist({
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
});

// The web app's font, for the product showcase only, so it looks as the app does. Not preloaded:
// only the home page uses it.
const appSans = Plus_Jakarta_Sans({
  variable: "--font-app-sans",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "productivity",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, email: false, address: false },
  // The page is designed light-only; tell the Dark Reader extension not to repaint it.
  other: { "darkreader-lock": "true" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  // "only light" also opts out of Chrome's forced dark mode for websites.
  colorScheme: "only light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: browser extensions add attributes to <html> before React loads.
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${appSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        {/* Vercel Web Analytics: page views and referrers, no cookies */}
        <Analytics />
      </body>
    </html>
  );
}
