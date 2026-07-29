"use client";

import { useEffect, useState } from "react";

import AppHeader from "./AppHeader";
import ChatPanel from "./ChatPanel";
import UploadPanel from "./UploadPanel";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    text: "Upload a PDF and ask me anything about it. I'll answer using only the uploaded document.",
  },
];

export default function HomePage({ sessionId }) {
  const [isUploading, setIsUploading] = useState(false);
  const [document, setDocument] = useState(null);

  const [messages, setMessages] = useState(DEFAULT_MESSAGES);

  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem("rag-chat");

    if (!storedMessages) return;

    try {
      setMessages(JSON.parse(storedMessages));
    } catch (error) {
      console.error("Failed to restore chat:", error);
      sessionStorage.removeItem("rag-chat");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("rag-chat", JSON.stringify(messages));
  }, [messages]);

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#0D1015] font-sans text-[#E7EAEE]">
      <AppHeader />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 overflow-auto px-4 py-5 sm:px-6 lg:flex-row lg:gap-5">
        <div className="w-full lg:max-w-[380px]">
          <UploadPanel
            document={document}
            setDocument={setDocument}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            setMessages={setMessages}
          />
        </div>

        <div className="min-h-[520px] flex-1">
          <ChatPanel
            sessionId={sessionId}
            document={document}
            messages={messages}
            setMessages={setMessages}
            isThinking={isThinking}
            setIsThinking={setIsThinking}
          />
        </div>
      </div>
    </main>
  );
}
