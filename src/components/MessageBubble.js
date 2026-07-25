export default function MessageBubble({ role, children }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-3xl border px-4 py-3 text-sm leading-6 ${
          isUser
            ? "border-slate-200 bg-white text-slate-900"
            : "border-slate-200 bg-slate-100 text-slate-900"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
