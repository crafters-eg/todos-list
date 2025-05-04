import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tomados",
  description: "A modern task management application",
  keywords: ["task management", "productivity", "todo", "tomados"],
  authors: [{ name: "Tomados" }],
  twitter: {
    card: "summary_large_image",
    title: "Tomados",
    description: "A modern task management application",
    images: "https://i.imgur.com/LjGwNJv.jpeg",
  },
  openGraph: {
    title: "Tomados",
    description: "A modern task management application",
    url: "https://tomados.vercel.app",
    images: "https://i.imgur.com/LjGwNJv.jpeg",
    siteName: "Tomados",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-neutral-950 dark:text-white min-h-screen transition-colors duration-200`}
      >
        <SessionProvider>
          <ThemeProvider defaultTheme="system" storageKey="theme">
            <Navbar />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
