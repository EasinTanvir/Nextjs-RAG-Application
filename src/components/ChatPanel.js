"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText, Loader2, Sparkles } from "lucide-react";

import MessageBubble from "./MessageBubble";

export default function ChatPanel({
  document,
  messages,
  setMessages,
  isThinking,
  setIsThinking,
  sessionId,
}) {
  const [query, setQuery] = useState("");

  const messagesRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!messagesRef.current) return;

    messagesRef.current.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [query]);

  const handleSend = async () => {
    const question = query.trim();

    if (!question || !document || isThinking) return;

    // capture history BEFORE adding the new message
    const history = messages.slice(-3).map((m) => ({
      role: m.role,
      content: m.text,
    }));

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
          history, // <-- send last 3 messages
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
    <section className="flex h-full w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-1 flex-col">
        {/* Header */}

        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI Assistant</h2>

              <p className="mt-1 text-sm text-slate-500">
                Temporary SessionId -{" "}
                <span className="font-semibold text-black">{sessionId}</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Threshold Value -{" "}
                <span className="font-semibold text-black">0.5</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Chunk -{" "}
                <span className="font-semibold text-black">
                  Recursive Chunking
                </span>
              </p>
            </div>

            {document && (
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 md:flex">
                <Sparkles className="h-4 w-4" />
                Ready
              </div>
            )}
          </div>
        </div>

        {/* Messages */}

        <div ref={messagesRef} className="flex-1 overflow-y-auto px-6 py-6">
          {!document ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FileText className="mb-6 h-12 w-12 text-slate-300" />

              <h3 className="text-lg font-semibold">No document uploaded</h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Since we are using recursive chunking, make sure you document is
                labelled well
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message, index) => (
                <MessageBubble key={index} role={message.role}>
                  {message.text}
                </MessageBubble>
              ))}

              {isThinking && (
                <MessageBubble role="assistant">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin" />

                    <span>Thinking...</span>
                  </div>
                </MessageBubble>
              )}
            </div>
          )}
        </div>

        {/* Input */}

        <div className="border-t border-slate-200 p-5">
          <div className="flex items-end gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={query}
              disabled={!document || isThinking}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                document
                  ? "Ask anything about this document..."
                  : "Upload a PDF first..."
              }
              className="max-h-40 min-h-[28px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />

            <button
              onClick={handleSend}
              disabled={!document || isThinking || !query.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isThinking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
