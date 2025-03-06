import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientComponentWrapper from "../components/ClientComponentWrapper";

// Modern, clean sans-serif font for body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Modern, geometric font for headings
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

// Modern, distinctive font for accents and tech-related elements
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aakar | Innovative Sustainability Solutions",
  description: "Premium software, data, and AI solutions that directly contribute to sustainability projects across Malaysia and beyond.",
  keywords: ["green technology", "sustainability", "Malaysia", "software", "AI solutions", "eco-friendly", "data analytics", "tech innovation"],
  authors: [{ name: "Aakar" }],
  openGraph: {
    title: "Aakar | Innovative Sustainability Solutions",
    description: "Building software, data, and AI solutions that directly contribute to sustainability projects in Malaysia.",
    url: "https://aakar.com",
    siteName: "Aakar",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aakar - Sustainable Technology Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.svg" },
    ],
    apple: [
      { url: "/favicon.svg" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased bg-background`}
      >
        {children}
        <ClientComponentWrapper />
      </body>
    </html>
  );
}
