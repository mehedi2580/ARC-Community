"use client";

import { useState, useRef, useEffect } from "react";
import { X, BadgeCheck } from "lucide-react";
import { Post, useSocial, timeAgo } from "@/lib/social";
import { useAuth } from "@/lib/auth";

interface ReplyModalProps {
  post: Post;
  onClose: () => void;
}

export default function ReplyModal({ post, onClose }: ReplyModalProps) {
  const { user } = useAuth();
  const { createPost } = useSocial();
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const canPost = content.trim().length > 0 && content.length <= 320;

  const handleSubmit = () => {
    if (!canPost || !user) return;
    createPost(content, post.channel, post.id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto animate-slide-up">
        <div className="bg-surface border border-white/[0.1] rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-text-primary hover:bg-surface2 transition-colors">
              <X size={18} />
            </button>
            <span className="text-sm font-bold">Reply</span>
            <button onClick={handleSubmit} disabled={!canPost}
              className="px-4 py-1.5 bg-accent hover:bg-accent-light disabled:opacity-40 text-white text-sm font-bold rounded-lg transition-colors">
              Reply
            </button>
          </div>

          {/* Original post */}
          <div className="px-4 py-3 border-b border-white/[0.07] opacity-70">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/50 to-cyan/50 flex items-center justify-center text-white font-bold text-xs">
                {(post.authorName[0] || "?").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-bold text-xs">{post.authorName}</span>
                  <BadgeCheck size={11} className="text-accent" />
                  <span className="text-xs text-muted">· {timeAgo(post.createdAt)}</span>
                </div>
                <p className="text-xs text-muted line-clamp-2">{post.content}</p>
              </div>
            </div>
          </div>

          {/* Reply compose */}
          <div className="p-4 flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user?.name[0] || "?").toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted mb-2">
                Replying to <span className="text-accent">@{post.authorUsername}</span>
              </p>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Post your reply..."
                rows={4}
                className="w-full bg-transparent text-sm text-text-primary placeholder-muted leading-relaxed resize-none focus:outline-none"
                maxLength={320}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs font-mono ${320 - content.length < 20 ? "text-red-400" : "text-muted/50"}`}>
                  {320 - content.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
