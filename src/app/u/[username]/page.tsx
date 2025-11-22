"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import Background from "@/components/Background"; // Your sakura JSON background component

const PublicUserPage = () => {
  const { username } = useParams();
  const safeUsername = String(username).trim().toLowerCase();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error(
        language === "en"
          ? "Please write a message first!"
          : "メッセージを書いてください！"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: safeUsername, content: message }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          language === "en"
            ? "Message sent anonymously!"
            : "匿名メッセージが送信されました！"
        );
        setMessage("");
      } else {
        toast.error(
          data.message ||
            (language === "en"
              ? "Failed to send message."
              : "送信に失敗しました。")
        );
      }
    } catch (err) {
      toast.error(
        language === "en" ? "Something went wrong." : "エラーが発生しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background animation */}
      <Background />
      {/* Toast notifications */}
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-md shadow-2xl rounded-xl border border-pink-200 bg-white/80 backdrop-blur-md">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-pink-700">
            {language === "en"
              ? `Send a message to @${username}`
              : `@${username} へメッセージを送る`}
          </h1>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              language === "en"
                ? "Write your anonymous message here..."
                : "ここに匿名メッセージを書いてください..."
            }
            className="min-h-[140px] resize-none border-pink-300 focus:ring-pink-400 focus:border-pink-400 rounded-md"
          />

          <Button
            onClick={handleSend}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-pink-300" : "bg-pink-500 hover:bg-pink-600"
            } text-white font-semibold`}
          >
            {loading
              ? language === "en"
                ? "Sending..."
                : "送信中..."
              : language === "en"
                ? "Send Message"
                : "メッセージを送る"}
          </Button>
        </CardContent>
      </Card>
      <p className="mt-6 text-sm text-gray-600 text-center italic">
        {language === "en"
          ? "Your identity is hidden. Be kind 💖"
          : "あなたの身元は公開されません。優しくしてね 💖"}
      </p>
    </div>
  );
};

export default PublicUserPage;
