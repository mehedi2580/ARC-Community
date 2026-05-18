"use client";

import { useState } from "react";
import { Search, Edit3, BadgeCheck, Circle } from "lucide-react";
import { mockMessages } from "@/lib/mockData";

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = mockMessages.filter(m =>
    m.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMsg = mockMessages.find(m => m.id === selected);

  return (
    <div className="flex h-[calc(100vh-57px)] lg:h-screen">
      {/* List */}
      <div className={`${selected ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-80 xl:w-96 border-r border-white/[0.07]`}>
        {/* Header */}
        <div className="glass border-b border-white/[0.07] px-4 py-3 flex items-center justify-between">
          <h1 className="font-extrabold text-lg">Messages</h1>
          <button className="p-2 rounded-xl bg-surface2 text-muted hover:text-text-primary transition-colors">
            <Edit3 size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-white/[0.07]">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search messages"
              className="w-full bg-surface2 rounded-xl pl-9 pr-3 py-2.5 text-sm text-text-primary placeholder-muted focus:outline-none"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(msg => (
            <button
              key={msg.id}
              onClick={() => setSelected(msg.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface2 transition-colors border-b border-white/[0.04] text-left ${
                selected === msg.id ? "bg-accent/10 border-l-2 border-l-accent" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/50 to-cyan/50 flex items-center justify-center font-bold text-sm text-white">
                  {msg.user.name[0]}
                </div>
                {msg.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-bg" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm truncate">{msg.user.name}</span>
                    {msg.user.verified && <BadgeCheck size={11} className="text-accent flex-shrink-0" />}
                  </div>
                  <span className="text-xs text-muted flex-shrink-0 ml-2">{msg.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted truncate">{msg.lastMessage}</p>
                  {msg.unread > 0 && (
                    <span className="ml-2 bg-accent text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                      {msg.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className={`${selected ? "flex" : "hidden lg:flex"} flex-1 flex-col`}>
        {selectedMsg ? (
          <>
            {/* Chat header */}
            <div className="glass border-b border-white/[0.07] px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setSelected(null)}
                className="lg:hidden text-muted hover:text-text-primary p-1"
              >
                ←
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/50 to-cyan/50 flex items-center justify-center font-bold text-sm text-white">
                {selectedMsg.user.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">{selectedMsg.user.name}</span>
                  {selectedMsg.user.verified && <BadgeCheck size={12} className="text-accent" />}
                </div>
                <span className="text-xs text-muted flex items-center gap-1">
                  {selectedMsg.online ? (
                    <><Circle size={6} className="fill-green-400 text-green-400" /> Online</>
                  ) : (
                    "Offline"
                  )}
                </span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 flex items-center justify-center text-muted">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-surface2 mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
                  {selectedMsg.user.name[0]}
                </div>
                <p className="font-bold mb-1">{selectedMsg.user.name}</p>
                <p className="text-xs text-muted/60">Start a conversation</p>
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/[0.07] p-4">
              <div className="flex gap-3 items-end">
                <input
                  placeholder={`Message ${selectedMsg.user.name}...`}
                  className="flex-1 bg-surface2 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-muted focus:outline-none focus:border-accent/50 transition-colors"
                />
                <button className="px-4 py-2.5 bg-accent rounded-xl text-white text-sm font-bold hover:bg-accent-light transition-colors">
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <Edit3 size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">Select a conversation</p>
              <p className="text-xs mt-1 opacity-60">Choose from your messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
