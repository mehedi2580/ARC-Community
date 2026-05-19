"use client";

import { useState } from "react";
import { Search, TrendingUp, Hash } from "lucide-react";
import { mockChannels } from "@/lib/mockData";
import { formatNumber } from "@/lib/mockData";
import clsx from "clsx";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState<Record<string, boolean>>(
    Object.fromEntries(mockChannels.map(c => [c.id, c.joined]))
  );

  const filtered = mockChannels.filter(
    c => c.name.includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
  );

  const trending = mockChannels.filter(c => c.trending);

  return (
    <div className="max-w-2xl mx-auto lg:max-w-none px-4 py-4 lg:px-6 lg:py-6">
      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search channels..."
          className="w-full max-w-xl bg-surface2 border border-white/[0.07] rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder-muted focus:border-accent/50 focus:bg-surface3 transition-all"
        />
      </div>

      {/* Trending */}
      {!search && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-accent" />
            <h2 className="text-xs font-bold text-muted uppercase tracking-widest">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {trending.map((ch, i) => (
              <ChannelCard
                key={ch.id}
                channel={ch}
                joined={joined[ch.id]}
                onToggle={() => setJoined(p => ({ ...p, [ch.id]: !p[ch.id] }))}
                featured={i === 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* All channels */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Hash size={14} className="text-accent" />
          <h2 className="text-xs font-bold text-muted uppercase tracking-widest">
            {search ? `Results for "${search}"` : "All Channels"}
          </h2>
        </div>
        <div className="space-y-2">
          {filtered.map((ch) => (
            <ChannelRow
              key={ch.id}
              channel={ch}
              joined={joined[ch.id]}
              onToggle={() => setJoined(p => ({ ...p, [ch.id]: !p[ch.id] }))}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted">
              <Hash size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No channels found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ChannelCard({ channel: ch, joined, onToggle, featured }: {
  channel: typeof mockChannels[0]; joined: boolean; onToggle: () => void; featured?: boolean;
}) {
  return (
    <div className={clsx(
      "p-4 rounded-2xl border transition-all hover:-translate-y-0.5 cursor-pointer",
      featured
        ? "border-accent/30 bg-accent/5 hover:border-accent/50"
        : "border-white/[0.07] bg-surface hover:border-white/[0.15]"
    )}>
      <div className="text-3xl mb-3">{ch.icon}</div>
      <h3 className="font-bold text-sm mb-1">/{ch.name}</h3>
      <p className="text-xs text-muted line-clamp-2 mb-3">{ch.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted font-mono">{formatNumber(ch.members)} members</span>
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          className={clsx(
            "text-xs font-bold px-3 py-1 rounded-lg transition-all",
            joined
              ? "bg-surface3 text-muted hover:text-red-400 hover:bg-red-400/10"
              : "bg-accent text-white hover:bg-accent-light"
          )}
        >
          {joined ? "Joined" : "Join"}
        </button>
      </div>
    </div>
  );
}

function ChannelRow({ channel: ch, joined, onToggle }: {
  channel: typeof mockChannels[0]; joined: boolean; onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.07] bg-surface hover:bg-surface2 hover:border-white/[0.12] transition-all cursor-pointer">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${ch.color}20` }}
      >
        {ch.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">/{ch.name}</span>
          {ch.trending && (
            <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-md">HOT</span>
          )}
        </div>
        <p className="text-xs text-muted truncate">{ch.description}</p>
      </div>
      <div className="text-right flex-shrink-0 mr-3 hidden sm:block">
        <p className="text-xs font-bold">{formatNumber(ch.members)}</p>
        <p className="text-[10px] text-muted">members</p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        className={clsx(
          "text-xs font-bold px-4 py-2 rounded-xl transition-all flex-shrink-0",
          joined
            ? "border border-white/[0.1] text-muted hover:text-red-400 hover:border-red-400/30"
            : "bg-accent text-white hover:bg-accent-light"
        )}
      >
        {joined ? "Joined" : "Join"}
      </button>
    </div>
  );
}