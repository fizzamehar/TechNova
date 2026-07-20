"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: `Hi, I'm the TechNova assistant. Ask me about an order, delivery times, warranty, or for a product recommendation \u2014 e.g. "best laptop under 150k".`
    }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);
  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    try {
      const res = await api.chatbot.send(sessionId, text);
      setSessionId(res.sessionId);
      setMessages((m) => [...m, res.reply]);
      if (res.escalated) setEscalated(true);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          content: "I couldn't reach the support service right now. Please try again shortly, or the chat will escalate to a ticket automatically."
        }
      ]);
    } finally {
      setSending(false);
    }
  }
  return <div className="fixed bottom-5 right-5 z-50">
      {open && <div className="mb-3 w-[340px] sm:w-[380px] h-[480px] bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700 bg-ink-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-trace/10 border border-trace/40 flex items-center justify-center">
                <Bot size={16} className="text-trace" />
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">TechNova Assistant</p>
                <p className="text-[11px] text-fog-500 flex items-center gap-1">
                  <span className="led-dot" /> Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-fog-500 hover:text-fog-100" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "bg-trace text-ink-950 font-medium" : "bg-ink-700 text-fog-100"}`}
  >
                  {m.content}
                </div>
              </div>)}
            {escalated && <div className="flex items-center gap-2 text-xs text-amber bg-amber/10 border border-amber/30 rounded-lg px-3 py-2">
                <AlertCircle size={14} />
                This has been escalated — a support ticket was opened for an admin to follow up.
              </div>}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t border-ink-700">
            <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type your message…"
    className="flex-1 bg-ink-700 border border-ink-600 rounded-lg px-3 h-10 text-sm outline-none focus:border-trace/60"
  />
            <button
    type="submit"
    disabled={sending}
    className="w-10 h-10 shrink-0 rounded-lg bg-trace text-ink-950 flex items-center justify-center disabled:opacity-50"
    aria-label="Send"
  >
              <Send size={16} />
            </button>
          </form>
        </div>}

      <button
    onClick={() => setOpen((v) => !v)}
    className="w-14 h-14 rounded-full bg-trace text-ink-950 shadow-trace flex items-center justify-center hover:scale-105 transition"
    aria-label="Open chat support"
  >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>;
}
export {
  ChatWidget as default
};
