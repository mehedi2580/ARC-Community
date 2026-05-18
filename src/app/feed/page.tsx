"use client";

import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import { mockPosts, mockChannels } from "@/lib/mockData";

const tabs = ["home", "following"];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
      {/* Desktop header */}
      <div className="hidden lg:block sticky top-0 z-30 glass border-b border-white/[0.07] px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl">
          <div className="flex items-center gap-1 bg-surface2 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-accent text-white shadow-accent-sm"
                    : "text-muted hover:text-text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-surface2 hover:bg-surface3 border border-white/[0.07] rounded-xl px-4 py-2 text-sm text-muted transition-colors">
            <Search size={14} />
            Search casts...
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden sticky top-[57px] z-30 glass border-b border-white/[0.07] px-4 py-2">
        <div className="flex gap-1 bg-surface2 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-accent text-white"
                  : "text-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-0">
        {/* Feed */}
        <div className="lg:col-span-2 lg:border-r lg:border-white/[0.07]">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Right sidebar - desktop */}
        <div className="hidden lg:block px-5 py-4">
          {/* Trending channels */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-accent" />
              <span className="text-xs font-bold text-muted uppercase tracking-widest">Trending Channels</span>
            </div>
            <div className="space-y-2">
              {mockChannels.filter(c => c.trending).slice(0, 4).map((ch) => (
                <div key={ch.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface2 transition-colors cursor-pointer group">
                  <span className="text-xl">{ch.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary">/{ch.name}</p>
                    <p className="text-xs text-muted">{(ch.members / 1000).toFixed(0)}K members</p>
                  </div>
                  {!ch.joined && (
                    <button className="text-xs text-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity border border-accent/30 px-2 py-0.5 rounded-md">
                      Join
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer links */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {["Privacy", "Terms", "About", "Docs"].map(l => (
              <span key={l} className="text-xs text-muted/50 hover:text-muted cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <p className="text-xs text-muted/40 mt-2 font-mono">© 2026 ARC Community</p>
        </div>
      </div>
    </div>
  );
}
