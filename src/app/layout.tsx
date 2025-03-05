import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
