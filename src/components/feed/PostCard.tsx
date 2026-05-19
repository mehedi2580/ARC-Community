"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Repeat2, Heart, Bookmark, Share, MoreHorizontal, Trash2, BadgeCheck } from "lucide-react";
import { Post, useSocial, timeAgo } from "@/lib/social";
import { useAuth } from "@/lib/auth";
import clsx from "clsx";
import ReplyModal from "./ReplyModal";

interface PostCardProps {
  post: Post;
  showThread?: boolean;
}

export default function PostCard({ post, showThread = false }: PostCardProps) {
  const { user } = useAuth();
  const { toggleLike, toggleRepost, deletePost, getThread } = useSocial();
  const [showReply, setShowReply] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const myAddr = user?.walletAddress || "";
  const liked = post.likes.includes(myAddr);
  const reposted = post.reposts.includes(myAddr);
  const isOwn = post.authorAddress === myAddr;
  const replies = showThread ? getThread(post.id) : [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + "/profile/" + post.authorUsername).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const avatarLetter = (post.authorName?.[0] || "?").toUpperCase();

  return (
    <>
      <article className="feed-item px-4 pt-4 pb-3 hover:bg-white/[0.02] transition-colors">
        <div className="flex gap-3">
          <Link href={"/profile/" + post.authorUsername} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/70 to-cyan/70 flex items-center justify-center text-white font-bold text-sm border border-accent/20 hover:opacity-80 transition-opacity">
              {avatarLetter}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <Link href={"/profile/" + post.authorUsername} className="font-bold text-sm hover:underline">
                  {post.authorName}
                </Link>
                <BadgeCheck size={13} className="text-accent flex-shrink-0" />
                <span className="text-xs text-muted font-mono">{"@" + post.authorUsername}</span>
                {post.channel && (
                  <span className="text-xs text-muted">
                    in <span className="text-accent font-semibold">{"/" + post.channel}</span>
                  </span>
                )}
                <span className="text-xs text-muted">{"· " + timeAgo(post.createdAt)}</span>
              </div>
              <div className="relative ml-2">
                <button
                  onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-1 text-muted hover:text-text-primary rounded-lg hover:bg-surface2 transition-colors"
                >
                  <MoreHorizontal size={15} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-7 z-50 bg-surface border border-white/[0.1] rounded-xl shadow-card py-1 w-40 text-sm">
                    {isOwn && (
                      <button
                        onClick={e => { e.stopPropagation(); deletePost(post.id, myAddr); setShowMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); handleShare(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-muted hover:bg-surface2 transition-colors"
                    >
                      <Share size={14} /> {copied ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line mb-2">{post.content}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs text-accent font-mono bg-accent/10 px-2 py-0.5 rounded-md">{"#" + tag}</span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 -ml-1.5 mt-1">
              <ActionBtn icon={MessageCircle} count={post.replyCount} label="Reply"
                color="hover:text-blue-400 hover:bg-blue-400/10"
                onClick={() => { setShowMenu(false); setShowReply(true); }} />
              <ActionBtn icon={Repeat2} count={post.reposts.length} label="Repost"
                active={reposted} activeColor="text-green-400"
                color="hover:text-green-400 hover:bg-green-400/10"
                onClick={() => user && toggleRepost(post.id, myAddr)} />
              <ActionBtn icon={Heart} count={post.likes.length} label="Like"
                active={liked} activeColor="text-pink-500" filled={liked}
                color="hover:text-pink-500 hover:bg-pink-500/10"
                onClick={() => user && toggleLike(post.id, myAddr)} />
              <ActionBtn icon={Bookmark} count={0} label="Bookmark"
                active={bookmarked} activeColor="text-accent" filled={bookmarked}
                color="hover:text-accent hover:bg-accent/10"
                onClick={() => setBookmarked(!bookmarked)} hideCount />
              <button onClick={handleShare} className="p-1.5 rounded-lg text-muted hover:text-blue-400 hover:bg-blue-400/10 transition-all ml-auto">
                <Share size={13} />
              </button>
            </div>
          </div>
        </div>

        {showThread && replies.length > 0 && (
          <div className="mt-3 ml-12 space-y-3 border-l border-white/[0.07] pl-4">
            {replies.map(r => <PostCard key={r.id} post={r} />)}
          </div>
        )}
      </article>

      {showReply && user && <ReplyModal post={post} onClose={() => setShowReply(false)} />}
    </>
  );
}

interface ActionBtnProps {
  icon: React.ElementType; count: number; label: string;
  active?: boolean; activeColor?: string; color: string;
  onClick?: (e: React.MouseEvent) => void; filled?: boolean; hideCount?: boolean;
}

function ActionBtn({ icon: Icon, count, label, active, activeColor, color, onClick, filled, hideCount }: ActionBtnProps) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick?.(e); }} aria-label={label}
      className={clsx("flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-muted text-xs font-semibold transition-all", color, active && activeColor)}>
      <Icon size={14} className={clsx(active && activeColor)} fill={filled ? "currentColor" : "none"} strokeWidth={filled ? 0 : 2} />
      {!hideCount && <span>{count > 0 ? count : ""}</span>}
    </button>
  );
}
