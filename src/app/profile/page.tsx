"use client";

import { useState } from "react";
import { BadgeCheck, Copy, ExternalLink, Edit3 } from "lucide-react";
import { currentUser, mockPosts, formatNumber } from "@/lib/mockData";
import PostCard from "@/components/feed/PostCard";

const tabs = ["casts", "replies", "media", "likes"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("casts");
  const [copied, setCopied] = useState(false);

  const copyWallet = () => {
    navigator.clipboard.writeText(currentUser.walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const userPosts = mockPosts.filter(p => p.user.id === currentUser.id || activeTab === "likes");

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      {/* Cover */}
      <div className="h-28 lg:h-36 bg-gradient-to-br from-accent/40 via-accent2/20 to-cyan/20 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Profile info */}
      <div className="px-4 lg:px-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className="relative">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-accent to-cyan border-4 border-bg flex items-center justify-center text-white font-extrabold text-2xl">
              {currentUser.name[0]}
            </div>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-bg" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-white/[0.15] rounded-xl text-sm font-bold hover:bg-surface2 transition-colors">
            <Edit3 size={14} />
            Edit profile
          </button>
        </div>

        {/* Name & handle */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl">{currentUser.name}</h1>
            {currentUser.verified && <BadgeCheck size={18} className="text-accent" />}
          </div>
          <p className="text-sm text-muted font-mono">@{currentUser.username}</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-text-secondary leading-relaxed mb-3">{currentUser.bio}</p>

        {/* Wallet */}
        <button
          onClick={copyWallet}
          className="flex items-center gap-2 bg-surface2 hover:bg-surface3 border border-white/[0.07] rounded-xl px-3 py-2 text-xs font-mono text-muted transition-colors mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          {currentUser.walletAddress}
          <Copy size={12} className="ml-1" />
          {copied && <span className="text-accent">Copied!</span>}
        </button>

        {/* Stats */}
        <div className="flex gap-5 mb-5">
          {[
            { label: "Posts", value: currentUser.posts },
            { label: "Following", value: currentUser.following },
            { label: "Followers", value: currentUser.followers },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-extrabold text-lg">{formatNumber(value)}</div>
              <div className="text-xs text-muted">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.07] mb-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-bold capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div>
        {userPosts.length > 0 ? (
          userPosts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-16 text-muted">
            <p className="text-sm">No {activeTab} yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
