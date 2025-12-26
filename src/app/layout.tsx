import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Navigation } from "@/components/navigation";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-mono",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Learn2Code - Understand Code by Explaining It",
  description:
    "Master programming by explaining code in your own words. AI-powered feedback helps you truly understand C, Python, C++, and Java.",
  keywords: ["learn programming", "coding practice", "AI tutor", "C programming", "Python"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${ibmPlexMono.variable} ${ibmPlexSans.variable} font-mono bg-[#0a0a0a] text-white min-h-screen antialiased`}
      >
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
