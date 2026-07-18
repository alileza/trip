import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trip.alileza.me"),
  title: "Indonesia Trip with Ali — mapped to you",
  description:
    "Come explore Indonesia with me. Answer a few quick questions and get a Jan–Feb trip mapped to you — Java's music, temples and volcanoes, Bali, the Gilis and Komodo.",
  openGraph: {
    title: "Indonesia Trip with Ali — mapped to you",
    description:
      "Come explore Indonesia with me. A few quick questions and I'll map the trip that fits you.",
    url: "https://trip.alileza.me",
    siteName: "Indonesia Trip with Ali",
    locale: "en",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
