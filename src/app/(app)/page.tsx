"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion"; // for animations

// Carousel wrapper that forces remount when language changes
const LanguageAwareCarousel = () => {
  const { language } = useLanguage();
  const [carouselKey, setCarouselKey] = useState(0);

  useEffect(() => {
    setCarouselKey((prev) => prev + 1); // force remount on language toggle
  }, [language]);

  return (
    <Carousel
      key={carouselKey}
      plugins={[Autoplay({ delay: 2500 })]}
      className="w-full max-w-xs "
    >
      <CarouselContent className="gap-4">
        {messages.map((message, index) => (
          <CarouselItem key={index}>
            <motion.div
              className="p-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="rounded-xl shadow-lg border border-pink-100 hover:shadow-2xl transition-shadow duration-300 bg-white">
                <CardHeader className="text-pink-600 font-semibold text-lg md:text-xl">
                  {language === "en"
                    ? message.title
                    : (message as any).titleJP || message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-gray-900 text-lg md:text-2xl font-medium text-center">
                    {language === "en"
                      ? message.content
                      : (message as any).contentJP || message.content}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 text-pink-700 hover:text-pink-900 animate-bounce-slow" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 text-pink-700 hover:text-pink-900 animate-bounce-slow" />
    </Carousel>
  );
};

export default function Home() {
  const { language } = useLanguage();

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 relative pt-5">
        <section className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-700 to-pink-500
 drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {language === "en"
              ? "Welcome to Sasayaki Box!"
              : "ささやきボックスへようこそ！"}
          </motion.h1>

          <motion.p
            className="max-w-6xl mx-auto p-8 rounded-2xl bg-white/50 backdrop-blur-md border border-white/50 shadow-xl text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {language === "en"
              ? "Explore Sasayaki Box, your go-to platform for sharing and discovering anonymous messages. Dive into a world of secrets, confessions, and stories from people around the globe. Whether you want to share your own thoughts or read what others have to say, Sasayaki Box is the perfect place to connect anonymously."
              : "ささやきボックスは、匿名メッセージを共有・発見できるプラットフォームです。世界中の人々の秘密、告白、ストーリーに触れ、あなた自身の思いを共有することも、他の人の声を読むこともできます。匿名でつながるのに最適な場所です。"}
          </motion.p>
        </section>

        <LanguageAwareCarousel />
      </main>

      <footer className="text-center p-4 md:p-6 bg-pink-200 rounded-lg shadow-inner">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-pink-700">
          {language === "en" ? "SasayakiBox" : "ささやきボックス"}
        </span>
        . All rights reserved.
      </footer>
    </>
  );
}
