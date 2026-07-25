"use client";

import { useState } from "react";

import AppHeader from "@/components/AppHeader";
import ChatPanel from "@/components/ChatPanel";
import UploadPanel from "@/components/UploadPanel";

export default function HomePage() {
  const [isUploading, setIsUploading] = useState(false);

  const [document, setDocument] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Upload a PDF and ask me anything about it. I'll answer using only the uploaded document.",
    },
  ]);

  const [isThinking, setIsThinking] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader />

      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-6">
        <div className="flex-1 lg:basis-[35%]">
          <UploadPanel
            document={document}
            setDocument={setDocument}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            setMessages={setMessages}
          />
        </div>

        <div className="flex-1 lg:basis-[65%]">
          <ChatPanel
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
