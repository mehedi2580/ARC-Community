"use client";

import { use, useState } from "react";
import { ArrowLeft, BadgeCheck, MessageCircle } from "lucide-react";
import { useSocial, timeAgo } from "@/lib/social";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import PostCard from "@/components/feed/PostCard";
import Link from "next/link";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { posts, getThread, createPost } = useSocial();
  const { user } = useAuth();
  const router = useRouter();
  const [replyContent, setReplyContent] = useState("");

  const post = posts.find(p => p.id === id);
  const replies = getThread(id);

  const handleReply = () => {
    if (!replyContent.trim() || !user) return;
    createPost(replyContent, post?.channel, id);
    setReplyContent("");
  };

  if (!post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-extrabold mb-2">Post not found</p>
        <button onClick={() => router.back()} className="text-accent hover:underline text-sm">Go back</button>
      </div>
    );
  }

  const avatarLetter = (post.authorName?.[0] || "?").toUpperCase();

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-white/[0.07] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg text-muted hover:text-text-primary hover:bg-surface2 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="font-extrabold text-sm">Post</p>
          <p className="text-xs text-muted">{replies.length} {replies.length === 1 ? "reply" : "replies"}</p>
        </div>
      </div>

      {/* Original post — full expanded view */}
      <div className="px-4 pt-5 pb-4 border-b border-white/[0.07]">
        <div className="flex gap-3 mb-3">
          <Link href={"/profile/" + post.authorUsername}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/70 to-cyan/70 flex items-center justify-center text-white font-bold border border-accent/20">
              {avatarLetter}
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link href={"/profile/" + post.authorUsername} className="font-bold hover:underline">{post.authorName}</Link>
              <BadgeCheck size={14} className="text-accent" />
            </div>
            <p className="text-xs text-muted font-mono">@{post.authorUsername}</p>
          </div>
        </div>

        {/* Full content */}
        <p className="text-base text-text-primary leading-relaxed whitespace-pre-line mb-4">{post.content}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-accent font-mono bg-accent/10 px-2 py-0.5 rounded-md">#{tag}</span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted mb-4 font-mono">
          {new Date(post.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          {" · "}
          {new Date(post.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
          {post.channel && <> · <span className="text-accent">/{post.channel}</span></>}
        </p>

        {/* Engagement counts */}
        <div className="flex items-center gap-5 py-3 border-y border-white/[0.07] text-sm mb-3">
          <div><span className="font-bold">{post.reposts.length}</span> <span className="text-muted">Reposts</span></div>
          <div><span className="font-bold">{post.likes.length}</span> <span className="text-muted">Likes</span></div>
          <div><span className="font-bold">{replies.length}</span> <span className="text-muted">Replies</span></div>
        </div>

        {/* Action buttons on expanded post */}
        <PostCard post={post} />
      </div>

      {/* Reply compose */}
      {user && (
        <div className="px-4 py-3 border-b border-white/[0.07] flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(user.name[0] || "?").toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder={"Reply to @" + post.authorUsername + "..."}
              rows={2}
              className="w-full bg-transparent text-sm text-text-primary placeholder-muted leading-relaxed resize-none focus:outline-none"
              maxLength={320}
            />
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs font-mono ${replyContent.length > 300 ? "text-red-400" : "text-muted/40"}`}>
                {320 - replyContent.length}
              </span>
              <button
                onClick={handleReply}
                disabled={!replyContent.trim()}
                className="px-4 py-1.5 bg-accent hover:bg-accent-light disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replies/Comments */}
      <div>
        {replies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <MessageCircle size={32} className="mb-3 opacity-20" />
            <p className="text-sm">No replies yet</p>
            <p className="text-xs mt-1 opacity-60">Be the first to reply!</p>
          </div>
        ) : (
          <div>
            <div className="px-4 py-2 border-b border-white/[0.05]">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
              </span>
            </div>
            {replies.map(reply => (
              <PostCard key={reply.id} post={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
