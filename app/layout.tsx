import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { SwRegister } from "@/components/sw-register";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Interior Designer AI",
  description:
    "Transform your space with AI-powered interior design in seconds.",
  keywords: [
    "interior design",
    "AI",
    "home design",
    "room redesign",
    "artificial intelligence",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Interior Designer AI",
    description:
      "Transform your space with AI-powered interior design in seconds.",
    url: "https://www.avada.space/",
    siteName: "Interior Designer AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.avada.space/app-screenshot.png",
        width: 1200,
        height: 630,
        alt: "Interior Designer AI - Transform your space instantly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Designer AI",
    description: "Transform your space with AI-powered interior design",
    images: ["https://www.avada.space/app-screenshot.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen overflow-x-hidden antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
        <SwRegister />
        <Analytics />
      </body>
    </html>
  );
}
