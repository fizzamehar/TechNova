"use client";
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { api } from "@/lib/api";
function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [newTicket, setNewTicket] = useState({ userId: "", subject: "", message: "" });
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    api.admin.tickets.list().then(setTickets).catch(() => setTickets([])).finally(() => setLoading(false));
  }, []);
  function openForm() {
    setShowForm(true);
    if (users.length === 0) {
      api.admin.users.list().then(setUsers).catch(() => setUsers([]));
    }
  }
  async function createTicket(e) {
    e.preventDefault();
    if (!newTicket.userId || !newTicket.subject.trim() || !newTicket.message.trim()) return;
    setCreating(true);
    try {
      const ticket = await api.admin.tickets.create(newTicket.userId, newTicket.subject, newTicket.message);
      setTickets((prev) => [ticket, ...prev]);
      setNewTicket({ userId: "", subject: "", message: "" });
      setShowForm(false);
    } catch {
      alert("Couldn't create the ticket. Please try again.");
    } finally {
      setCreating(false);
    }
  }
  async function sendReply(id) {
    const message = replyDrafts[id];
    if (!message?.trim()) return;
    await api.admin.tickets.reply(id, message).catch(() => {
    });
    setReplyDrafts((d) => ({ ...d, [id]: "" }));
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: "IN_PROGRESS" } : t));
  }
  async function changeStatus(id, status) {
    const prevTickets = tickets;
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    await api.admin.tickets.updateStatus(id, status).catch(() => {
      setTickets(prevTickets);
    });
  }
  return <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Support Tickets</h1>
        <button
    onClick={() => showForm ? setShowForm(false) : openForm()}
    className="text-sm bg-trace text-ink-950 font-medium rounded-lg px-4 py-2 flex items-center gap-1.5"
  >
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> New Ticket</>}
        </button>
      </div>

      {showForm && <form onSubmit={createTicket} className="border border-ink-700 rounded-xl p-4 mb-6 space-y-3">
          <p className="text-sm font-medium">Open a manual ticket</p>
          <select
    value={newTicket.userId}
    onChange={(e) => setNewTicket((t) => ({ ...t, userId: e.target.value }))}
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-trace/60"
  >
            <option value="">Select customer…</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>
          <input
    value={newTicket.subject}
    onChange={(e) => setNewTicket((t) => ({ ...t, subject: e.target.value }))}
    placeholder="Subject"
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-trace/60"
  />
          <textarea
    value={newTicket.message}
    onChange={(e) => setNewTicket((t) => ({ ...t, message: e.target.value }))}
    placeholder="Describe the issue…"
    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-trace/60 min-h-[80px]"
  />
          <button
    type="submit"
    disabled={creating}
    className="text-sm bg-trace text-ink-950 font-medium rounded-lg px-4 py-2 disabled:opacity-50"
  >
            Create ticket
          </button>
        </form>}

      {loading ? <p className="text-sm text-fog-500">Loading tickets…</p> : tickets.length === 0 ? <p className="text-sm text-fog-500">No escalated tickets — the AI chatbot is resolving queries on its own.</p> : <div className="space-y-4">
          {tickets.map((t) => <div key={t.id} className="border border-ink-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">{t.subject}</p>
                <div className="flex items-center gap-2">
                  <span
    className={`text-[11px] font-mono px-2 py-0.5 rounded uppercase ${t.status === "OPEN" ? "bg-danger/10 text-danger" : t.status === "RESOLVED" || t.status === "CLOSED" ? "bg-trace/10 text-trace" : "bg-amber/10 text-amber"}`}
  >
                    {t.status}
                  </span>
                  <select
    value={t.status}
    onChange={(e) => changeStatus(t.id, e.target.value)}
    className="text-[11px] font-mono bg-ink-800 border border-ink-600 rounded px-2 py-1 outline-none focus:border-trace/60"
  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-fog-700 mb-3 font-mono">
                Source: {t.source} · {new Date(t.createdAt).toLocaleString()}
              </p>
              <div className="flex gap-2">
                <input
    value={replyDrafts[t.id] || ""}
    onChange={(e) => setReplyDrafts((d) => ({ ...d, [t.id]: e.target.value }))}
    placeholder="Reply to customer…"
    className="flex-1 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-trace/60"
  />
                <button
    onClick={() => sendReply(t.id)}
    className="text-sm bg-trace text-ink-950 font-medium rounded-lg px-4 py-2"
  >
                  Send
                </button>
              </div>
            </div>)}
        </div>}
    </div>;
}
export {
  AdminTicketsPage as default
};