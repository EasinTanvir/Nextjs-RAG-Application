"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import RetrievalReadout from "./RetrievalReadout";

const THRESHOLD = 0.5;

// Mirrors the real pipeline stages so the wait feels like what's
// actually happening on the backend, not a generic spinner.
const STAGES = [
  "Embedding query",
  "Searching vector index",
  "Generating answer",
];

export default function ChatPanel({
  document,
  messages,
  setMessages,
  isThinking,
  setIsThinking,
  sessionId,
}) {
  const [query, setQuery] = useState("");
  const [stageIndex, setStageIndex] = useState(0);

  const messagesRef = useRef(null);
  const textareaRef = useRef(null);
  const stageTimer = useRef(null);

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

  useEffect(() => {
    if (!isThinking) {
      clearInterval(stageTimer.current);
      setStageIndex(0);
      return;
    }

    stageTimer.current = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 900);

    return () => clearInterval(stageTimer.current);
  }, [isThinking]);

  const handleSend = async () => {
    const question = query.trim();

    if (!question || !document || isThinking) return;

    if (question.length > 2000) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "That question is a bit long — try trimming it to under 2000 characters.",
        },
      ]);
      return;
    }

    const history = messages.slice(-3).map((m) => ({
      role: m.role,
      content: m.text,
    }));

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setQuery("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question, history }),
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
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    handleSend();
  };

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#262D37] bg-[#151920]">
      <div className="flex items-center justify-between border-b border-[#262D37] px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-[#5B6472]">
          <span>
            session{" "}
            <span className="text-[#8992A3]">{sessionId?.slice(0, 8)}</span>
          </span>
          <span>
            threshold{" "}
            <span className="text-[#8992A3]">{THRESHOLD.toFixed(2)}</span>
          </span>
          <span className="hidden sm:inline">
            chunking <span className="text-[#8992A3]">recursive · 500/50</span>
          </span>
        </div>

        {document && (
          <div className="flex items-center gap-1.5 rounded-full border border-[#4FC98A]/30 bg-[#4FC98A]/10 px-3 py-1 text-[#4FC98A]">
            <Sparkles className="h-3 w-3" />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              ready
            </span>
          </div>
        )}
      </div>

      <div ref={messagesRef} className="flex-1 overflow-y-auto px-5 py-6">
        {!document ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <FileText className="mb-4 h-9 w-9 text-[#262D37]" />
            <h3 className="text-sm font-medium text-[#8992A3]">
              No document indexed
            </h3>
            <p className="mt-2 max-w-xs font-mono text-[11px] leading-5 text-[#5B6472]">
              upload a pdf on the left to start querying
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                role={message.role}
                footer={
                  message.role === "assistant" && message.sources ? (
                    <RetrievalReadout
                      sources={message.sources}
                      threshold={THRESHOLD}
                    />
                  ) : null
                }
              >
                {message.text}
              </MessageBubble>
            ))}

            {isThinking && (
              <MessageBubble role="assistant">
                <span className="flex items-center gap-2 font-mono text-xs text-[#8992A3]">
                  <span className="flex gap-1">
                    <Dot />
                    <Dot delay="150ms" />
                    <Dot delay="300ms" />
                  </span>
                  {STAGES[stageIndex]}
                </span>
              </MessageBubble>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-[#262D37] p-4">
        <div className="flex items-end gap-2 rounded-xl border border-[#262D37] bg-[#0D1015] p-2.5 focus-within:border-[#5B8DEF]/50">
          <textarea
            ref={textareaRef}
            rows={1}
            value={query}
            disabled={!document || isThinking}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              document ? "Query the document…" : "Upload a PDF first…"
            }
            className="max-h-40 min-h-[24px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-[#E7EAEE] outline-none placeholder:text-[#5B6472] disabled:cursor-not-allowed"
          />

          <button
            onClick={handleSend}
            disabled={!document || isThinking || !query.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5B8DEF] text-white transition hover:bg-[#4A7CDE] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Dot({ delay = "0ms" }) {
  return (
    <span
      className="h-1 w-1 animate-bounce rounded-full bg-[#5B8DEF]"
      style={{ animationDelay: delay }}
    />
  );
}
