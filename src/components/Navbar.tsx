"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface NavbarProps {
  hideLanguageToggle?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideLanguageToggle }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const showWelcome = session && pathname.startsWith("/dashboard");
  const hideAuthButtons =
    pathname.startsWith("/u/") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  const showLanguageToggle = !hideLanguageToggle && pathname !== "/";

  const texts = {
    appName: language === "en" ? "Sasayaki Box" : "ささやきボックス",
    welcome: language === "en" ? "Welcome" : "ようこそ",
    login: language === "en" ? "Login" : "ログイン",
    logout: language === "en" ? "Logout" : "ログアウト",
    langButton: language === "en" ? "日本語" : "EN",
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  };

  return (
    <nav className="sticky top-0 z-50 p-4 md:p-6 shadow-md bg-white/40 backdrop-blur-md border-b border-white/20">
      {/* ⭐ Only THIS LINE was changed */}
      <div className="container mx-auto flex flex-col md:flex-row items-center md:justify-between justify-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-2 md:mb-0">
          <img
            src="/icon.svg"
            alt="SasayakiBox Logo"
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <span className="text-xl font-bold">{texts.appName}</span>
        </Link>

        {/* Welcome */}
        {showWelcome && (
          <span className="text-lg font-medium text-center">
            {texts.welcome},{" "}
            {user?.displayName || user?.username || user?.email}
          </span>
        )}

        {/* Dashboard Button */}
        {session && !pathname.startsWith("/dashboard") && !pathname.startsWith("/u/") && (
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="mr-2">
              {language === "en" ? "Dashboard" : "ダッシュボード"}
            </Button>
          </Link>
        )}

        {/* Right Buttons */}
        <div className="flex items-center gap-2">
          {showLanguageToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
            >
              {texts.langButton}
            </Button>
          )}

          {!hideAuthButtons && (
            <>
              {session ? (
                <Button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <motion.span
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {language === "en" ? "Logging out..." : "ログアウト中..."}
                    </motion.span>
                  ) : (
                    texts.logout
                  )}
                </Button>
              ) : (
                <Link href="/sign-in">
                  <Button
                    className="flex items-center justify-center gap-2"
                    onClick={() => setIsLoading(true)}
                  >
                    {isLoading ? (
                      <motion.span
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {language === "en" ? "Logging in..." : "ログイン中..."}
                      </motion.span>
                    ) : (
                      texts.login
                    )}
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
