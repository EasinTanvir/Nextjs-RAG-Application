"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import MessageBubble from "./MessageBubble";

export default function ChatPanel({
  document,
  messages,
  setMessages,
  isThinking,
  setIsThinking,
}) {
  const [query, setQuery] = useState("");

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const handleSend = async () => {
    const question = query.trim();

    if (!question || isThinking || !document) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    setQuery("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: question,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error.message ||
            "Something went wrong while generating the response.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    if (e.shiftKey) return;

    e.preventDefault();

    handleSend();
  };

  return (
    <section className="flex h-full min-h-[660px] flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-base font-semibold text-slate-900">
          Document Conversation
        </p>

        {document && (
          <p className="mt-1 text-sm text-slate-500">{document.name}</p>
        )}
      </div>

      <div className="flex-1 overflow-hidden px-6 py-5">
        <div className="flex h-full flex-col gap-5 overflow-y-auto pr-2">
          {messages.map((message, index) => (
            <MessageBubble key={index} role={message.role}>
              {message.text}
            </MessageBubble>
          ))}

          {isThinking && (
            <MessageBubble role="assistant">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </MessageBubble>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-4">
        <div className="flex items-end gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <textarea
            rows={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!document || isThinking}
            placeholder={
              document
                ? "Ask a question about the document..."
                : "Upload a PDF to begin..."
            }
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            disabled={!document || !query.trim() || isThinking}
            onClick={handleSend}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isThinking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Send
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
