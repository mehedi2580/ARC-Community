"use client";

import { useState, useRef, useEffect } from "react";
import { X, Hash, AtSign, Smile, Image } from "lucide-react";
import { useSocial } from "@/lib/social";
import { useAuth } from "@/lib/auth";

interface CreatePostModalProps { onClose: () => void; }

export default function CreatePostModal({ onClose }: CreatePostModalProps) {
  const { user } = useAuth();
  const { createPost } = useSocial();
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const charLimit = 320;
  const remaining = charLimit - content.length;
  const canPost = content.trim().length > 0 && remaining >= 0;

  const handleSubmit = () => {
    if (!canPost || !user) return;
    createPost(content, channel || undefined);
    onClose();
  };

  if (!user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto animate-slide-up">
        <div className="bg-surface border border-white/[0.1] rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-text-primary hover:bg-surface2 transition-colors"><X size={18} /></button>
            <span className="text-sm font-bold">New Cast</span>
            <button onClick={handleSubmit} disabled={!canPost}
              className="px-4 py-1.5 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors">
              Cast
            </button>
          </div>
          <div className="p-4 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user.name[0] || "?").toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)}
                placeholder="What's onchain?" rows={5}
                className="w-full bg-transparent text-text-primary placeholder-muted text-sm leading-relaxed resize-none focus:outline-none"
                maxLength={charLimit} />
              <div className="flex items-center gap-2 mt-2">
                <Hash size={13} className="text-muted" />
                <input value={channel} onChange={e => setChannel(e.target.value)} placeholder="channel (optional)"
                  className="bg-transparent text-xs text-muted placeholder-muted/60 font-mono focus:outline-none focus:text-accent transition-colors" />
              </div>
              <p className="text-[10px] text-muted/40 mt-1">Use #hashtags to add tags automatically</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.07]">
            <div className="flex items-center gap-1">
              {([Image, AtSign, Smile] as React.ElementType[]).map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors"><Icon size={15} /></button>
              ))}
            </div>
            <div className="relative w-7 h-7">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                <circle cx="14" cy="14" r="10" fill="none"
                  stroke={remaining < 20 ? (remaining < 0 ? "#ef4444" : "#f59e0b") : "#7c5cfc"}
                  strokeWidth="2.5" strokeDasharray={String(2 * Math.PI * 10)}
                  strokeDashoffset={String(2 * Math.PI * 10 * (1 - Math.min(content.length / charLimit, 1)))}
                  strokeLinecap="round" className="transition-all" />
              </svg>
              {remaining <= 50 && (
                <span className={"absolute inset-0 flex items-center justify-center text-[9px] font-bold " + (remaining < 0 ? "text-red-400" : "text-muted")}>{remaining}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
