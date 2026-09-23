import type { Metadata } from "next";
import { Handjet, Press_Start_2P, Silkscreen } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
});

const pressStart = Press_Start_2P({
  subsets: ["cyrillic", "latin"],
  weight: "400",
  variable: "--font-press-start",
});

const handjet = Handjet({
  subsets: ["cyrillic", "latin"],
  weight: "variable",
  variable: "--font-handjet",
});

export const metadata: Metadata = {
  title: "Vladyslav Huminiuk | Full-Stack Developer",
  description: "Portfolio of Vladyslav Huminiuk — React, Next.js and Node.js developer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body className={`${silkscreen.variable} ${GeistPixelSquare.variable} ${pressStart.variable} ${handjet.variable}`}>{children}<PageTransition /></body>
    </html>
  );
}
