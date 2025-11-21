"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/User";
import { formatDistanceToNow } from "date-fns";

interface MessageCardProps {
  message: Message & { _id: string };
  onMessageDelete: (messageId: string) => void;
  language: "en" | "jp"; // 👈 language toggle
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete, language }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      language === "en" 
        ? "Are you sure you want to delete this message?" 
        : "このメッセージを削除してもよろしいですか？"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);

      toast.success(
        response.data.message ||
          (language === "en" ? "Message deleted successfully" : "メッセージが削除されました")
      );

      onMessageDelete(message._id);
    } catch (error) {
      toast.error(language === "en" ? "Failed to delete message" : "削除に失敗しました");
    }
  };

  return (
    <Card className="shadow-md border rounded-lg">
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {language === "en" ? "Anonymous Message" : "匿名メッセージ"}
        </h3>
        <p className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </p>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap break-words">
          {message.content ||
            (language === "en" ? "(No message content)" : "（内容なし）")}
        </p>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          {language === "en" ? "Delete" : "削除"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
