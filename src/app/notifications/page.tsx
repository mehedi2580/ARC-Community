"use client";

import { useState } from "react";
import { Heart, Repeat2, UserPlus, AtSign, MessageCircle, Gift, BadgeCheck } from "lucide-react";
import { mockNotifications } from "@/lib/mockData";
import clsx from "clsx";

const typeConfig = {
  like: { icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
  repost: { icon: Repeat2, color: "text-green-400", bg: "bg-green-400/10" },
  follow: { icon: UserPlus, color: "text-accent", bg: "bg-accent/10" },
  mention: { icon: AtSign, color: "text-blue-400", bg: "bg-blue-400/10" },
  reply: { icon: MessageCircle, color: "text-blue-400", bg: "bg-blue-400/10" },
  airdrop: { icon: Gift, color: "text-yellow-400", bg: "bg-yellow-400/10" },
};

const tabs = ["all", "mentions", "likes", "follows"];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));

  const filtered = notifications.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "mentions") return n.type === "mention" || n.type === "reply";
    if (activeTab === "likes") return n.type === "like";
    if (activeTab === "follows") return n.type === "follow";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto lg:max-w-xl">
      {/* Header */}
      <div className="sticky top-0 lg:top-0 z-30 glass border-b border-white/[0.07] px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-accent font-bold hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="flex gap-1 bg-surface2 rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                activeTab === tab ? "bg-accent text-white" : "text-muted hover:text-text-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div>
        {filtered.map(notif => {
          const cfg = typeConfig[notif.type];
          const Icon = cfg.icon;
          return (
            <div
              key={notif.id}
              className={clsx(
                "feed-item flex items-start gap-3 px-4 py-4 hover:bg-surface/40 transition-colors cursor-pointer",
                !notif.read && "border-l-2 border-l-accent"
              )}
            >
              {/* Icon */}
              <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
                <Icon size={16} className={cfg.color} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="font-bold text-sm">{notif.user.name}</span>
                  {notif.user.verified && <BadgeCheck size={12} className="text-accent" />}
                  <span className="text-sm text-muted">{notif.content}</span>
                </div>
                {notif.postPreview && (
                  <p className="text-xs text-muted/70 truncate mt-1 bg-surface2 px-2 py-1 rounded-lg">
                    {notif.postPreview}
                  </p>
                )}
                <p className="text-xs text-muted/50 mt-1 font-mono">{notif.timestamp}</p>
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-sm">No notifications here</p>
          </div>
        )}
      </div>
    </div>
  );
}
