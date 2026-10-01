import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, VT323 } from "next/font/google";
import { AmbientBackground } from "@/components/background";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Pixel/CRT face used only for OS chrome and big readouts.
const pixel = VT323({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://priyanshupatel.dev"),
  title: {
    default: "Priyanshu OS — Priyanshu Patel, Business Analyst → Product / AI",
    template: "%s | Priyanshu Patel",
  },
  description:
    "Priyanshu Patel — Associate Manager, Business Analyst at Digit Life Insurance and AI product builder. Explore Memory Router, LifePilot, RideCompare and more inside Priyanshu OS.",
  openGraph: {
    title: "Priyanshu OS — Priyanshu Patel",
    description: "Business Analyst → Product / AI. AI product builder: Memory Router, LifePilot, RideCompare, Agent Gateway and more.",
    type: "website",
    images: ["/projects/memory-router.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyanshu OS — Priyanshu Patel",
    description: "Business Analyst → Product / AI. AI product builder.",
    images: ["/projects/memory-router.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#0B0F14",
};

// Runs before paint: decides whether to show the boot screen (first visit to "/"
// this session, motion allowed) and applies saved display settings without a flash.
const preboot = `try{var d=document.documentElement;if(location.pathname==='/'&&!sessionStorage.getItem('pos-booted')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.boot='1'}var s=JSON.parse(localStorage.getItem('pos-settings')||'{}');if(s.crt===false)d.dataset.crt='off';if(s.phosphor==='amber')d.dataset.phosphor='amber'}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preboot }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${pixel.variable} font-sans antialiased`}>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
