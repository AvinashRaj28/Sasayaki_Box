import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import Background from "@/components/Background";
import NavbarWrapper from "@/components/NavbarWrapper"; // we'll make this client

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SasayakiBox",
  description: "Send and receive anonymous messages securely",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-pink-200 `}>
        <AuthProvider>
          <LanguageProvider>
            <Background />
            <NavbarWrapper />
            <main>{children}</main>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
