"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Edit3, BadgeCheck, Circle, Send, ArrowLeft } from "lucide-react";
import { useSocial, timeAgo } from "@/lib/social";
import { useAuth } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export default function MessagesPage() {
  const { user } = useAuth();
  const { getConversationList, getConversation, sendDM, markDMsRead, searchUsers } = useSocial();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [showNewDM, setShowNewDM] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const myAddr = user?.walletAddress || "";

  // Handle ?dm= query param (from profile page)
  useEffect(() => {
    const dm = searchParams.get("dm");
    if (dm) setSelected(dm);
  }, [searchParams]);

  const conversations = getConversationList(myAddr);
  const filteredConvos = conversations.filter(c =>
    c.user.name.toLowerCase().includes(search.toLowerCase()) ||
    c.user.username.toLowerCase().includes(search.toLowerCase())
  );

  const messages = selected ? getConversation(myAddr, selected) : [];
  const selectedUser = conversations.find(c => c.user.walletAddress === selected)?.user;

  // Mark messages read when opening conversation
  useEffect(() => {
    if (selected) markDMsRead(myAddr, selected);
  }, [selected, myAddr, markDMsRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim() || !selected || !user) return;
    sendDM(myAddr, selected, input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const newDMResults = userSearch ? searchUsers(userSearch).filter(u => u.walletAddress !== myAddr) : [];

  return (
    <div className="flex h-[calc(100vh-57px)] lg:h-screen overflow-hidden">
      {/* Conversation list */}
      <div className={clsx("flex flex-col border-r border-white/[0.07] bg-surface", selected ? "hidden lg:flex lg:w-80 xl:w-96" : "flex w-full lg:w-80 xl:w-96")}>
        {/* Header */}
        <div className="glass border-b border-white/[0.07] px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="font-extrabold text-lg">Messages</h1>
          <button onClick={() => setShowNewDM(!showNewDM)}
            className="p-2 rounded-xl bg-surface2 text-muted hover:text-text-primary transition-colors">
            <Edit3 size={16} />
          </button>
        </div>

        {/* New DM search */}
        {showNewDM && (
          <div className="border-b border-white/[0.07] p-3 bg-surface2/50">
            <p className="text-xs font-bold text-muted mb-2 uppercase tracking-wider">New Message</p>
            <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by username..."
              className="w-full bg-surface border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-text-primary placeholder-muted focus:outline-none focus:border-accent/50" />
            {newDMResults.length > 0 && (
              <div className="mt-2 space-y-1">
                {newDMResults.slice(0, 4).map(u => (
                  <button key={u.walletAddress}
                    onClick={() => { setSelected(u.walletAddress); setShowNewDM(false); setUserSearch(""); }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface transition-colors text-left">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/50 to-cyan/50 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {(u.name[0] || "?").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{u.name}</p>
                      <p className="text-xs text-muted font-mono">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="px-3 py-2 border-b border-white/[0.07] flex-shrink-0">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations"
              className="w-full bg-surface2 rounded-lg pl-8 pr-3 py-2 text-xs text-text-primary placeholder-muted focus:outline-none" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvos.length === 0 && (
            <div className="text-center py-12 text-muted">
              <Edit3 size={24} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs opacity-60 mt-1">Start one using the button above</p>
            </div>
          )}
          {filteredConvos.map(({ user: u, lastMsg, unread }) => (
            <button key={u.walletAddress} onClick={() => setSelected(u.walletAddress)}
              className={clsx("w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.04] text-left hover:bg-surface2/60 transition-colors",
                selected === u.walletAddress && "bg-accent/5 border-l-2 border-l-accent")}>
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/50 to-cyan/50 flex items-center justify-center font-bold text-sm text-white">
                  {(u.name[0] || "?").toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm truncate">{u.name}</span>
                    <BadgeCheck size={11} className="text-accent flex-shrink-0" />
                  </div>
                  <span className="text-[10px] text-muted flex-shrink-0 ml-1 font-mono">{timeAgo(lastMsg.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted truncate">{lastMsg.fromAddress === myAddr ? "You: " : ""}{lastMsg.content}</p>
                  {unread > 0 && (
                    <span className="ml-1 bg-accent text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center flex-shrink-0">
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className={clsx("flex-1 flex flex-col bg-bg", !selected && "hidden lg:flex")}>
        {selected ? (
          <>
            {/* Chat header */}
            <div className="glass border-b border-white/[0.07] px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <button onClick={() => setSelected(null)} className="lg:hidden text-muted hover:text-text-primary p-1 transition-colors">
                <ArrowLeft size={18} />
              </button>
              {selectedUser ? (
                <>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/50 to-cyan/50 flex items-center justify-center font-bold text-sm text-white">
                    {(selectedUser.name[0] || "?").toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm">{selectedUser.name}</span>
                      <BadgeCheck size={12} className="text-accent" />
                    </div>
                    <Link href={"/profile/" + selectedUser.username} className="text-xs text-muted hover:text-accent transition-colors font-mono">
                      @{selectedUser.username}
                    </Link>
                  </div>
                  <Link href={"/profile/" + selectedUser.username}
                    className="text-xs text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors font-bold">
                    Profile
                  </Link>
                </>
              ) : (
                <div className="flex-1">
                  <p className="text-sm font-bold font-mono text-muted">{selected.slice(0, 10)}…</p>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-12 text-muted">
                  <Circle size={24} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No messages yet. Say hi!</p>
                </div>
              )}
              {messages.map(msg => {
                const isMe = msg.fromAddress === myAddr;
                return (
                  <div key={msg.id} className={clsx("flex", isMe ? "justify-end" : "justify-start")}>
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/50 to-cyan/50 flex items-center justify-center text-white font-bold text-xs mr-2 flex-shrink-0 mt-1">
                        {(selectedUser?.name[0] || "?").toUpperCase()}
                      </div>
                    )}
                    <div className={clsx("max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm",
                      isMe
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-surface2 text-text-primary rounded-bl-sm border border-white/[0.07]")}>
                      <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className={clsx("text-[10px] mt-1 font-mono", isMe ? "text-white/60" : "text-muted/60")}>
                        {timeAgo(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.07] p-3 flex-shrink-0 glass">
              <div className="flex gap-2 items-end">
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Type a message... (Enter to send)"
                  rows={1}
                  className="flex-1 bg-surface2 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-muted focus:outline-none focus:border-accent/50 transition-colors resize-none max-h-32 overflow-y-auto" />
                <button onClick={handleSend} disabled={!input.trim()}
                  className="w-10 h-10 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all flex-shrink-0">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <Edit3 size={36} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold">Your messages</p>
              <p className="text-sm mt-1 opacity-60">Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
