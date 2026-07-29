"use client";

import { useEffect, useState } from "react";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    text: "Upload a PDF and ask me anything about it. I'll answer using only the uploaded document.",
  },
];

export default function useSessionStorage() {
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);

  useEffect(() => {
    try {
      const savedMessages = sessionStorage.getItem("messages");
      const savedDocument = sessionStorage.getItem("document");

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }

      if (savedDocument) {
        setDocument(JSON.parse(savedDocument));
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      sessionStorage.removeItem("messages");
      sessionStorage.removeItem("document");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (document) {
      sessionStorage.setItem("document", JSON.stringify(document));
    } else {
      sessionStorage.removeItem("document");
    }
  }, [document]);

  return {
    document,
    setDocument,
    messages,
    setMessages,
  };
}
