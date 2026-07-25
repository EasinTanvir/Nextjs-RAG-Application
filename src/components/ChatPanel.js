import { Paperclip, ArrowRight } from "lucide-react";
import MessageBubble from "./MessageBubble";

const messages = [
  {
    role: "assistant",
    text: "Looking at the uploaded document, I can help summarize sections or find key passages for your review.",
  },
  {
    role: "user",
    text: "Can you identify the main action items from the financial report?",
  },
  {
    role: "assistant",
    text: "The report highlights revenue growth, cost control measures, and an update on the hiring plan for Q3.",
  },
];

export default function ChatPanel() {
  return (
    <section className="flex h-full min-h-[660px] flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-base font-semibold text-slate-900">
          Document conversation
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Review context and ask questions about the uploaded file.
        </p>
      </div>

      <div className="flex-1 overflow-hidden px-6 py-5">
        <div className="flex h-full flex-col gap-5 overflow-y-auto pr-2 pb-4">
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
            Upload a PDF to start asking questions.
          </div>

          {messages.map((message, index) => (
            <MessageBubble key={index} role={message.role}>
              {message.text}
            </MessageBubble>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
          <button type="button" className="text-slate-500">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Ask a question about the document"
            className="h-11 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Send
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
