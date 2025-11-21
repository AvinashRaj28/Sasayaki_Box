"use client";

import { Toaster } from "@/components/ui/sonner";
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar"; // ✅ added
import { Controller } from "react-hook-form";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { language } = useLanguage();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          (language === "en"
            ? "Error fetching accept message status"
            : "メッセージ受信ステータスの取得中にエラーが発生しました")
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, language]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success(
            language === "en"
              ? "Showing latest messages"
              : "最新のメッセージを表示中"
          );
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ||
            (language === "en"
              ? "Error fetching messages"
              : "メッセージ取得中にエラーが発生しました")
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages, language]
  );

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [status, session, fetchMessages, fetchAcceptMessage, setValue]);

  const handleSwitchChange = async () => {
    const newValue = !acceptMessages;
    setValue("acceptMessages", newValue);
    setIsSwitchLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: newValue,
      });
      toast.success(
        language === "en"
          ? response.data.message
          : "メッセージ受信ステータスを更新しました"
      );
    } catch (error) {
      toast.error(
        language === "en"
          ? "Error updating accept message status"
          : "メッセージ受信ステータス更新中にエラーが発生しました"
      );
      setValue("acceptMessages", !newValue);
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="text-center mt-10">
        {language === "en"
          ? "Please log in to access the dashboard."
          : "ダッシュボードにアクセスするにはログインしてください。"}
      </div>
    );
  }

  const { username } = session.user;
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success(
      language === "en"
        ? "Profile URL copied to clipboard"
        : "プロフィールURLがクリップボードにコピーされました"
    );
  };

  return (
    <>
      {/* ✅ Navbar now added */}
      <Navbar />

      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <Toaster />
        <h1 className="text-4xl font-bold mb-4">
          {language === "en" ? "User Dashboard" : "ユーザーダッシュボード"}
        </h1>

        {/* Copy Link */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">
            {language === "en"
              ? "Copy Your Unique Link"
              : "あなたのユニークリンクをコピー"}
          </h2>
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2 border rounded"
            />
            <Button onClick={copyToClipboard}>
              {language === "en" ? "Copy" : "コピー"}
            </Button>
          </div>
        </div>

        {/* Accept Messages Toggle */}
        <div className="mb-4 flex items-center">
          <Controller
            name="acceptMessages"
            control={form.control}
            render={({ field }) => (
              <Switch
                checked={field.value ?? false}
                onCheckedChange={(value) => {
                  field.onChange(value);

                  // Only call this if your function accepts parameters
                  if (typeof handleSwitchChange === "function") {
                    handleSwitchChange();
                  }

                  // If your handleSwitchChange takes NO arguments:
                  // handleSwitchChange();
                }}
                disabled={isSwitchLoading}
              />
            )}
          />

          <span className="ml-2">
            {language === "en" ? "Accept Messages" : "メッセージ受信"}:{" "}
            <span className="font-medium">
              {(form.watch("acceptMessages") ?? false)
                ? language === "en"
                  ? "On"
                  : "オン"
                : language === "en"
                  ? "Off"
                  : "オフ"}
            </span>
          </span>
        </div>

        <Separator />

        {/* Refresh Button */}
        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>

        {/* Message List */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => {
              const m = message as Message & { _id: string }; // 👈 override _id type

              return (
                <MessageCard
                  key={m._id}
                  message={m}
                  onMessageDelete={handleDeleteMessage}
                  language={language}
                />
              );
            })
          ) : (
            <p>
              {language === "en"
                ? "No messages to display."
                : "表示するメッセージはありません。"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
