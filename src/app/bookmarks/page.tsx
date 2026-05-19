"use client";

import { Bookmark } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import { useSocial } from "@/lib/social";

export default function BookmarksPage() {
  const { posts } = useSocial();
  // For now show most-liked posts as "bookmarks" since bookmarks are local state
  const featured = posts.filter(p => p.likes.length > 0).sort((a, b) => b.likes.length - a.likes.length).slice(0, 10);

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      <div className="sticky top-0 z-30 glass border-b border-white/[0.07] px-4 py-4 lg:px-6 flex items-center gap-3">
        <Bookmark size={18} className="text-accent" />
        <h1 className="font-extrabold text-lg">Bookmarks</h1>
        <span className="ml-auto text-sm text-muted">{featured.length} saved</span>
      </div>
      {featured.length > 0 ? (
        featured.map(post => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-muted">
          <Bookmark size={36} className="mb-4 opacity-30" />
          <p className="font-semibold">No bookmarks yet</p>
          <p className="text-sm mt-1 opacity-60">Like posts to see them here</p>
        </div>
      )}
    </div>
  );
}
