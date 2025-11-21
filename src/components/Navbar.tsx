"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // spinner icon

interface NavbarProps {
  hideLanguageToggle?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideLanguageToggle }) => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
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

  // handle logout with loading animation
  const handleLogout = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  };

  return (
    <nav className="sticky top-0 z-50 p-4 md:p-6 shadow-md bg-white/40 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left - App name */}
        <a className="text-xl font-bold mb-4 md:mb-0" href="/">
          {texts.appName}
        </a>

        {/* Middle - Welcome and username */}
        {showWelcome && (
          <span className="text-lg font-medium mb-4 md:mb-0 text-center">
            {texts.welcome}, {user?.username || user?.email}
          </span>
        )}

        {/* Right - Buttons */}
        <div className="flex items-center gap-2">
          {showLanguageToggle && (
            <Button
              className="cursor-pointer"
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
                  className="flex items-center justify-center gap-2 "
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
                    className="flex items-center justify-center gap-2 "
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
