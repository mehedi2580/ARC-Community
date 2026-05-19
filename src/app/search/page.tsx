"use client";

import { useState, useEffect, useRef } from "react";
import { Search, User, FileText, X, BadgeCheck } from "lucide-react";
import { useSocial } from "@/lib/social";
import { UserProfile } from "@/lib/auth";
import { Post } from "@/lib/social";
import PostCard from "@/components/feed/PostCard";
import Link from "next/link";
import clsx from "clsx";

const tabs = ["all", "people", "posts"] as const;
type Tab = typeof tabs[number];

export default function SearchPage() {
  const { searchPosts, searchUsers } = useSocial();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!query.trim()) { setUsers([]); setPosts([]); return; }
      setUsers(searchUsers(query));
      setPosts(searchPosts(query));
    }, 200);
    return () => clearTimeout(t);
  }, [query, searchUsers, searchPosts]);

  const hasResults = users.length > 0 || posts.length > 0;
  const showUsers = tab === "all" || tab === "people";
  const showPosts = tab === "all" || tab === "posts";

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      {/* Search bar */}
      <div className="sticky top-0 lg:top-0 z-30 glass border-b border-white/[0.07] px-4 py-3 lg:px-6">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search people, posts, tags..."
            className="w-full bg-surface2 border border-white/[0.07] rounded-xl pl-11 pr-10 py-3 text-sm text-text-primary placeholder-muted focus:border-accent/50 focus:outline-none transition-all"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary transition-colors">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Tabs */}
        {query && (
          <div className="flex gap-1 mt-3 bg-surface2 rounded-xl p-1">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={clsx("flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                  tab === t ? "bg-accent text-white" : "text-muted hover:text-text-primary")}>
                {t} {t === "people" && users.length > 0 && `(${users.length})`}
                {t === "posts" && posts.length > 0 && `(${posts.length})`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty state */}
      {!query && (
        <div className="flex flex-col items-center justify-center py-24 text-muted">
          <Search size={40} className="mb-4 opacity-20" />
          <p className="font-semibold">Search ARC Community</p>
          <p className="text-sm mt-1 opacity-60">Find people, posts, and channels</p>
          <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-xs">
            {["#base", "#onchain", "#defi", "#nft", "cryptosage", "basegirl"].map(s => (
              <button key={s} onClick={() => setQuery(s)}
                className="text-xs text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full hover:bg-accent/20 transition-colors font-mono">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query && !hasResults && (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <Search size={32} className="mb-3 opacity-20" />
          <p className="font-semibold">No results for &quot;{query}&quot;</p>
          <p className="text-sm mt-1 opacity-60">Try different keywords</p>
        </div>
      )}

      {/* Results */}
      {query && hasResults && (
        <div>
          {/* People */}
          {showUsers && users.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
                <User size={13} className="text-accent" />
                <span className="text-xs font-bold text-muted uppercase tracking-wider">People</span>
              </div>
              {users.map(u => (
                <UserRow key={u.walletAddress} user={u} />
              ))}
            </div>
          )}

          {/* Posts */}
          {showPosts && posts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
                <FileText size={13} className="text-accent" />
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Posts</span>
              </div>
              {posts.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UserRow({ user }: { user: UserProfile }) {
  return (
    <Link href={"/profile/" + user.username}
      className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition-colors border-b border-white/[0.04]">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/60 to-cyan/60 flex items-center justify-center text-white font-bold flex-shrink-0">
        {(user.name[0] || "?").toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-sm">{user.name}</span>
          <BadgeCheck size={13} className="text-accent" />
        </div>
        <p className="text-xs text-muted font-mono">@{user.username}</p>
        {user.bio && <p className="text-xs text-muted/70 truncate mt-0.5">{user.bio}</p>}
      </div>
      <span className="text-xs text-accent font-bold border border-accent/30 px-3 py-1 rounded-lg hover:bg-accent/10 transition-colors flex-shrink-0">
        View
      </span>
    </Link>
  );
}
