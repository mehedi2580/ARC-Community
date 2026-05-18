"use client";

import { useState } from "react";
import { MessageCircle, Repeat2, Heart, Bookmark, Share, BadgeCheck, MoreHorizontal } from "lucide-react";
import { Post, formatNumber } from "@/lib/mockData";
import clsx from "clsx";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [reposted, setReposted] = useState(post.reposted);
  const [reposts, setReposts] = useState(post.reposts);
  const [bookmarked, setBookmarked] = useState(post.bookmarked);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleRepost = () => {
    setReposted(!reposted);
    setReposts(reposted ? reposts - 1 : reposts + 1);
  };

  const handleBookmark = () => setBookmarked(!bookmarked);

  return (
    <article className="feed-item px-4 pt-4 pb-3 hover:bg-surface/40 transition-colors cursor-pointer group">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/60 to-cyan/60 flex items-center justify-center text-white font-bold text-sm border border-accent/20">
            {post.user.name[0]}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="font-bold text-sm text-text-primary hover:underline truncate">
                {post.user.name}
              </span>
              {post.user.verified && (
                <BadgeCheck size={14} className="text-accent flex-shrink-0" />
              )}
              {post.channel && (
                <span className="text-xs text-muted flex-shrink-0">
                  in <span className="text-accent font-semibold">/{post.channel}</span>
                </span>
              )}
              <span className="text-xs text-muted flex-shrink-0">{post.timestamp}</span>
            </div>
            <button className="text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0 p-1">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Username */}
          <p className="text-xs text-muted font-mono mb-2">@{post.user.username}</p>

          {/* Content */}
          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line mb-3">
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-accent font-mono bg-accent/10 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between max-w-xs">
            <ActionButton
              icon={MessageCircle}
              count={post.replies}
              label="Reply"
              color="hover:text-blue-400 hover:bg-blue-400/10"
            />
            <ActionButton
              icon={Repeat2}
              count={reposts}
              label="Repost"
              active={reposted}
              activeColor="text-green-400"
              color="hover:text-green-400 hover:bg-green-400/10"
              onClick={handleRepost}
            />
            <ActionButton
              icon={Heart}
              count={likes}
              label="Like"
              active={liked}
              activeColor="text-pink-500"
              color="hover:text-pink-500 hover:bg-pink-500/10"
              onClick={handleLike}
            />
            <ActionButton
              icon={Bookmark}
              count={bookmarked ? post.bookmarks + 1 : post.bookmarks}
              label="Bookmark"
              active={bookmarked}
              activeColor="text-accent"
              color="hover:text-accent hover:bg-accent/10"
              onClick={handleBookmark}
            />
            <button className="p-1.5 rounded-lg text-muted hover:text-blue-400 hover:bg-blue-400/10 transition-all">
              <Share size={14} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  count: number;
  label: string;
  active?: boolean;
  activeColor?: string;
  color: string;
  onClick?: () => void;
}

function ActionButton({ icon: Icon, count, label, active, activeColor, color, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      aria-label={label}
      className={clsx(
        "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-muted text-xs font-semibold transition-all",
        color,
        active && activeColor
      )}
    >
      <Icon size={14} className={clsx(active && activeColor, "transition-transform hover:scale-110")} fill={active ? "currentColor" : "none"} />
      <span>{formatNumber(count)}</span>
    </button>
  );
}
