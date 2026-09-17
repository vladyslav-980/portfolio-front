import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vladyslav Huminiuk | Full-Stack Developer",
  description: "Portfolio of Vladyslav Huminiuk — React, Next.js and Node.js developer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
