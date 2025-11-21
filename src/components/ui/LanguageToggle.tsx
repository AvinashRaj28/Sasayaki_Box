"use client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="absolute top-4 right-4"
    >
      {language === "en" ? "日本語" : "English"}
    </Button>
  );
};

export default LanguageToggle;
